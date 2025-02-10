import {
	Battery,
	Activity,
	Thermometer,
	Settings,
	Terminal,
	Usb,
	AlertTriangle,
} from "lucide-react";
import React, { useState, FormEvent, useEffect } from "react";
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

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BMSFrontend = () => {
	const electron = useElectron();
	const [balancingTime, setBalancingTime] = useState<number>(60);
	const [rawCommand, setRawCommand] = useState<string>("");
	const [numNodes, setNumNodes] = useState<number>(1);

	const [isCharging, setIsCharging] = useState(false);
	const [isBalancing, setIsBalancing] = useState(false);
	const [balancingStatus, setBalancingStatus] = useState<string | null>(null);
	const [balancingLogs, setBalancingLogs] = useState<
		[number[], number[]][][]
	>([]);

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

	const {
		deviceId,
		allNodeData,
		terminalOutput,
		sendCommand,
		isFetching,
		setIsFetching,
	} = useNodeData(isConnected, numNodes);

	const [bmsError, setBmsError] = useState<string>("");

	useEffect(() => {
		let isError: boolean = false;
		for (const node of allNodeData) {
			if (node.errors.length > 0) {
				setBmsError(
					(currentError) => currentError + node.errors.toString()
				);
				isError = true;
				break;
			}
		}

		if (!isError) {
			setBmsError("");
		}
	}, [allNodeData, setBmsError]);

	const handleRawCommand = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const parts = rawCommand.trim().split(" ");
		const command = parts[0];
		const args = parts.slice(1);
		sendCommand(command, ...args);
		setRawCommand("");
	};

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
						balancingLogs={balancingLogs}
						setBalancingLogs={setBalancingLogs}
						sendCommand={sendCommand}
						isFetching={isFetching}
						allNodeData={allNodeData}
						setIsFetching={setIsFetching}
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
		</div>
	);
};

export default BMSFrontend;
