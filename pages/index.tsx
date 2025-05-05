import {
	Battery,
	Activity,
	Thermometer,
	Settings,
	Terminal,
	Usb,
	AlertTriangle,
	Save,
	Database,
} from "lucide-react";
import React, { useState, FormEvent, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useElectron } from "@/components/useElectron";
import DiagnosticDisplay from "@/components/DiagnosticDisplay";
import PortSelectionDialog from "@/components/PortSelectionDialog";
import OverviewTab from "@/components/OverviewTab";
import VoltageSummaryTab from "@/components/VoltageSummaryTab";
import TemperatureSummaryTab from "@/components/TemperatureSummaryTab";
import CellBalancingTab from "@/components/CellBalancingTab";
import TerminalTab from "@/components/TerminalTab";
import OtherTab from "@/components/OtherTab";
import { usePortConnection } from "@/hooks/usePortConnection";
import { useNodeData } from "@/hooks/useNodeData";
import { fetchInterval, NodeData, NUM_NODES } from "@/types";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BMSFrontend = () => {
	const electron = useElectron();
	const [balancingTime, setBalancingTime] = useState<number>(60);
	const [rawCommand, setRawCommand] = useState<string>("");
	const [numNodes, setNumNodes] = useState<number>(NUM_NODES);

	const [isCharging, setIsCharging] = useState(false);
	const [isBalancing, setIsBalancing] = useState(false);
	const [balancingStatus, setBalancingStatus] = useState<string | null>(null);

	// Logging
	const [isLogging, setIsLogging] = useState<boolean>(false);
	const [logData, setLogData] = useState<
		Array<{ timestamp: number; nodes: NodeData[]; current: number }>
	>([]);
	const logIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const {
		availablePorts,
		selectedPort,
		setSelectedPort,
		showPortDialog,
		setShowPortDialog,
		isConnected,
		error,
		handlePortConnection,
		handleDisconnect,
	} = usePortConnection();

	const { deviceId, allNodeData, terminalOutput, sendCommand, totalCurrent } =
		useNodeData(isConnected, numNodes);

	const [bmsError, setBmsError] = useState<string>("");

	useEffect(() => {
		let isError: boolean = false;
		for (const node of allNodeData) {
			if (node.errors.length > 0) {
				console.log(
					"Node " +
						node.nodeId +
						" has " +
						node.errors.length +
						" errors: {" +
						node.errors +
						"}"
				);
				setBmsError(
					(currentError) =>
						currentError +
						node.nodeId +
						": " +
						node.errors.toString()
				);
				isError = true;
				break;
			}
		}

		if (!isError) {
			setBmsError("");
		}

		// Logging
		if (isLogging) {
			setLogData((prevData) => [
				...prevData,
				{
					timestamp: Date.now(),
					nodes: JSON.parse(JSON.stringify(allNodeData)), // Deep copy
					current: totalCurrent,
				},
			]);
		}
	}, [allNodeData, setBmsError, isLogging, totalCurrent]);

	const handleRawCommand = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const parts = rawCommand.trim().split(" ");
		const command = parts[0];
		const args = parts.slice(1);
		sendCommand(command, ...args);
		setRawCommand("");
	};

	// Add these functions to the BMSFrontend component
	const startLogging = () => {
		// Only start logging if we're connected and have data
		if (!isConnected) {
			setBmsError("Cannot start logging - not connected to BMS");
			return;
		}

		if (allNodeData.length === 0) {
			setBmsError("Cannot start logging - no data available");
			return;
		}

		// Clear any previous errors
		setBmsError("");

		// Clear previous log data
		setLogData([]);
		setIsLogging(true);

		// Add initial entry immediately
		setLogData([
			{
				timestamp: Date.now(),
				nodes: JSON.parse(JSON.stringify(allNodeData)), // Deep copy
				current: totalCurrent,
			},
		]);

		// Log started notification
		console.log("Logging started");
		setBalancingStatus("Data logging started");

		// Clear the status message after a few seconds
		setTimeout(() => {
			if (setBalancingStatus) {
				setBalancingStatus((prev) =>
					prev === "Data logging started" ? null : prev
				);
			}
		}, 3000);
	};

	const stopLogging = async () => {
		// Clear the interval
		if (logIntervalRef.current) {
			clearInterval(logIntervalRef.current);
			logIntervalRef.current = null;
		}

		setIsLogging(false);

		// Only attempt to save if we have data
		if (logData.length > 0) {
			try {
				// Create metadata and format the log
				const now = new Date();
				const filename = `bms_log_${now
					.toISOString()
					.replace(/[:.]/g, "-")}.json`;

				// Format the data with useful metadata
				const logFileData = {
					metadata: {
						version: "1.0",
						application: "Brad BMS Manager",
						timestamp: now.toISOString(),
						date: now.toLocaleDateString(),
						time: now.toLocaleTimeString(),
						numNodes: numNodes,
						numEntries: logData.length,
						startTime: new Date(logData[0].timestamp).toISOString(),
						endTime: new Date(
							logData[logData.length - 1].timestamp
						).toISOString(),
						duration:
							(logData[logData.length - 1].timestamp -
								logData[0].timestamp) /
							1000,
						samplingIntervalMs: fetchInterval, // We're logging every second
						totalVoltageSummary: {
							min: Math.min(
								...logData.map((entry) =>
									entry.nodes.reduce(
										(total, node) =>
											total +
											node.voltages
												.filter((v) => v > 0)
												.reduce((sum, v) => sum + v, 0),
										0
									)
								)
							),
							max: Math.max(
								...logData.map((entry) =>
									entry.nodes.reduce(
										(total, node) =>
											total +
											node.voltages
												.filter((v) => v > 0)
												.reduce((sum, v) => sum + v, 0),
										0
									)
								)
							),
						},
						temperatureSummary: {
							min: Math.min(
								...logData.map((entry) =>
									Math.min(
										...entry.nodes.flatMap((node) =>
											node.temps.filter((t) => t !== 0)
										)
									)
								)
							),
							max: Math.max(
								...logData.map((entry) =>
									Math.max(
										...entry.nodes.flatMap((node) =>
											node.temps.filter((t) => t !== 0)
										)
									)
								)
							),
						},
					},
					logEntries: logData,
				};

				const dataStr = JSON.stringify(logFileData, null, 2);

				// Browser download fallback
				const blob = new Blob([dataStr], { type: "application/json" });
				const url = URL.createObjectURL(blob);

				const link = document.createElement("a");
				link.href = url;
				link.download = filename;
				document.body.appendChild(link);
				link.click();

				// Clean up
				setTimeout(() => {
					URL.revokeObjectURL(url);
					document.body.removeChild(link);
				}, 100);

				console.log(`Log saved with ${logData.length} entries`);
			} catch (error) {
				console.error("Failed to save log data:", error);
				setBmsError(`Failed to save log: ${error}`);
			}
		} else {
			console.log("No log data to save");
			setBmsError("No log data to save");
		}
	};

	useEffect(() => {
		return () => {
			if (logIntervalRef.current) {
				clearInterval(logIntervalRef.current);
			}
		};
	}, []);

	if (!electron) {
		return "loading...";
	}

	return (
		<div className="container mx-auto p-4 max-w-6xl">
			<PortSelectionDialog
				showPortDialog={showPortDialog}
				setShowPortDialog={setShowPortDialog}
				selectedPort={selectedPort}
				setSelectedPort={setSelectedPort}
				availablePorts={availablePorts}
				isConnected={isConnected}
				onConnect={handlePortConnection}
				onDisconnect={handleDisconnect}
			/>

			<Card>
				<CardHeader className="flex flex-row items-center">
					<CardTitle className="text-2xl grow">
						Brad BMS Manager
					</CardTitle>
					<div className="flex items-center gap-4">
						{/* Logging button */}
						<div className="flex items-center gap-2">
							<Button
								variant={isLogging ? "destructive" : "outline"}
								size="sm"
								onClick={isLogging ? stopLogging : startLogging}
								className="flex items-center gap-2"
							>
								{isLogging ? (
									<>
										<Save className="h-4 w-4" />
										<span>Stop & Save Log</span>
									</>
								) : (
									<>
										<Database className="h-4 w-4" />
										<span>Start Logging</span>
									</>
								)}
							</Button>
							{isLogging && (
								<div className="text-xs px-2 py-1 rounded-full border border-gray-300 bg-green-100 dark:bg-green-900 dark:border-gray-700 flex items-center">
									<span className="animate-pulse mr-1 h-2 w-2 rounded-full bg-green-500 inline-block"></span>
									<span>{logData.length} entries</span>
								</div>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Thermometer className="h-5 w-5 text-orange-500" />
							<span className="text-sm font-medium">
								{Math.max(
									...allNodeData.map((node) => node.bmicTemp),
									0
								).toFixed(2)}
								°C
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Activity className="h-5 w-5 text-blue-500" />
							<span className="text-sm font-medium">
								{totalCurrent
									? totalCurrent.toFixed(2)
									: "0.00"}
								A
							</span>
						</div>
						<button
							className="justify-self-end"
							onClick={() => setShowPortDialog(true)}
						>
							<Usb color={isConnected ? "green" : "red"} />
						</button>
					</div>
				</CardHeader>
			</Card>

			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{bmsError && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{bmsError}</AlertDescription>
				</Alert>
			)}

			<div className="flex items-center gap-4 m-4">
				<span className="text-xs text-gray-500 dark:text-gray-400">
					Number of BMS nodes in system:
				</span>
				<div className="flex items-center gap-4">
					<div className="flex flex-col gap-1">
						<Input
							type="number"
							value={numNodes}
							onChange={(e) =>
								setNumNodes(parseInt(e.target.value))
							}
							className="w-32"
							min={1}
							placeholder="# of nodes"
						/>
					</div>
					<Button onClick={() => sendCommand("a", numNodes)}>
						Start Addressing
					</Button>
				</div>
			</div>

			<Tabs
				defaultValue="overview"
				className="flex flex-col items-center"
			>
				<TabsList className="mx-auto">
					<TabsTrigger value="overview">
						<Activity className="mr-2 h-4 w-4" />
						Overview
					</TabsTrigger>
					<TabsTrigger value="voltage-summary">
						<Battery className="mr-2 h-4 w-4" />
						All Voltages
					</TabsTrigger>
					<TabsTrigger value="temp-summary">
						<Thermometer className="mr-2 h-4 w-4" />
						All Temperatures
					</TabsTrigger>
					<TabsTrigger value="balancing">
						<Activity className="mr-2 h-4 w-4" />
						Balancing/Charging
					</TabsTrigger>
					<TabsTrigger value="diagnostics">
						<AlertTriangle className="mr-2 h-4 w-4" />
						Diagnostics
					</TabsTrigger>
					<TabsTrigger value="terminal">
						<Terminal className="mr-2 h-4 w-4" />
						Terminal
					</TabsTrigger>
					<TabsTrigger value="other">
						<Settings className="mr-2 h-4 w-4" />
						Other
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-4">
					<OverviewTab allNodeData={allNodeData} />
				</TabsContent>

				<TabsContent value="voltage-summary" className="mt-4">
					<VoltageSummaryTab allNodeData={allNodeData} />
				</TabsContent>

				<TabsContent value="diagnostics" className="mt-4">
					<div>
						{allNodeData.map((data) => {
							return (
								<DiagnosticDisplay
									key={data.nodeId}
									diagnostics={data.diagnostic}
									nodeNum={data.nodeId}
								/>
							);
						})}
					</div>
				</TabsContent>

				<TabsContent value="temp-summary" className="mt-4">
					<TemperatureSummaryTab allNodeData={allNodeData} />
				</TabsContent>

				<TabsContent value="balancing" className="mt-4">
					<CellBalancingTab
						balancingTime={balancingTime}
						setBalancingTime={setBalancingTime}
						isCharging={isCharging}
						setIsCharging={setIsCharging}
						isBalancing={isBalancing}
						setIsBalancing={setIsBalancing}
						balancingStatus={balancingStatus}
						setBalancingStatus={setBalancingStatus}
						sendCommand={sendCommand}
						allNodeData={allNodeData}
					/>
				</TabsContent>

				<TabsContent value="terminal" className="mt-4">
					<TerminalTab
						terminalOutput={terminalOutput}
						rawCommand={rawCommand}
						setRawCommand={setRawCommand}
						handleRawCommand={handleRawCommand}
					/>
				</TabsContent>

				<TabsContent value="other" className="mt-4">
					<OtherTab deviceId={deviceId} sendCommand={sendCommand} />
				</TabsContent>
			</Tabs>

			{/* Balancing border */}
			<div
				className="fixed inset-0 border-8 border-sky-500 pointer-events-none"
				hidden={!isBalancing}
			></div>
		</div>
	);
};

export default BMSFrontend;
