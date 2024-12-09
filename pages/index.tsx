import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Battery,
	Activity,
	Thermometer,
	Settings,
	Terminal,
	Usb,
	AlertTriangle,
} from "lucide-react";
import { useElectron } from "@/components/useElectron";
import { port } from "@/components/serialTypes";
import DiagnosticDisplay from "@/components/DiagnosticDisplay";
import {
	generateRandomDiagnosticData,
	printDiagnosticData,
} from "@/components/diagnosticGen";
import PortSelectionDialog from "@/components/PortSelectionDialog";
import OverviewTab from "@/components/OverviewTab";
import VoltageSummaryTab from "@/components/VoltageSummaryTab";
import TemperatureSummaryTab from "@/components/TemperatureSummaryTab";
import CellBalancingTab from "@/components/CellBalancingTab";
import TerminalTab from "@/components/TerminalTab";
import SettingsTab from "@/components/SettingsTab";
import { NodeData, fetchInterval } from "../types";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BMSFrontend = () => {
	const electron = useElectron();
	const [deviceId, setDeviceId] = useState<number>(1);
	const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
	const [balancingTime, setBalancingTime] = useState<number>(60);
	const [rawCommand, setRawCommand] = useState<string>("");
	const [numNodes, setNumNodes] = useState<number>(1);
	const [error, setError] = useState<string>("");
	const [allNodeData, setAllNodeData] = useState<NodeData[]>([]);
	const [availablePorts, setAvailablePorts] = useState<port[]>([]);
	const [selectedPort, setSelectedPort] = useState<string>("");
	const [showPortDialog, setShowPortDialog] = useState<boolean>(false);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const handlePortConnection = async (port: string) => {
		if (!electron) return;
		try {
			console.log("Connecting to port", port);
			await electron.connect(port);
			setIsConnected(true);
			setShowPortDialog(false);
			setError("");
		} catch (err) {
			setError(`Failed to connect to port ${port}: ${err}`);
		}
	};

	const handleDisconnect = async () => {
		if (!electron) return;
		try {
			console.log("Disconnecting from port");
			electron.disconnect();
			setIsConnected(false);
			setShowPortDialog(false);
			setError("");
		} catch (err) {
			setError(`Failed to disconnect from port: ${err}`);
		}
	};

	const sendCommand = useCallback(
		async (
			command: string,
			...args: number[] | string[]
		): Promise<string> => {
			// Simulate sending command over UART
			// console.log("Sending command:", command, args);
			setTerminalOutput((prev) => [
				...prev,
				`> ${command} ${args.join(" ")}`,
			]);

			if (!isConnected) {
				setError("Not connected to serial port");
				return "";
			} else {
				if (error == "Not connected to serial port") {
					setError("");
				}
			}

			const nodeId: number = args[0] as number;

			// Handle responses based on command
			switch (command) {
				case "v":
					// Mock voltage data
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							const { success, message, output } =
								await electron.getVoltage(nodeId);
							if (success) {
								return output.toString();
							} else {
								console.log(message);
								return "FAIL";
							}
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				case "t":
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							const { success, message, output } =
								await electron.getTemps(nodeId);
							if (success) {
								return output.toString();
							} else {
								console.log(message);
								return "FAIL";
							}
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				// Add other command handlers
				case "d":
					// Mock diagnostic data
					const mockDiagnostic = generateRandomDiagnosticData();
					return printDiagnosticData(mockDiagnostic);
				default:
					setError("Invalid command");
					return "";
			}
		},
		[electron, isConnected, error]
	);

	// Initialize on mount
	// Fetch data for all nodes
	const fetchAllNodesData = useCallback(async () => {
		// If already fetching, skip this execution
		if (isFetching) return;

		try {
			setIsFetching(true);
			const voltages = await sendCommand("v", deviceId);
			if (voltages === "FAIL") {
				console.error("Failed to fetch voltages");
				return;
			}

			const temps = await sendCommand("t", deviceId);
			if (temps === "FAIL") {
				console.error("Failed to fetch voltages");
				return;
			}

			if (voltages.includes("nan") || temps.includes("nan")) {
				console.error("NAN in data");
				return;
			}

			try {
				const newData = [
					{
						nodeId: deviceId,
						voltages: JSON.parse(`[${voltages}]`),
						temps: JSON.parse(`[${temps}]`),
						diagnostic: "1,2,3,4",
					},
				];
				setAllNodeData(newData);
			} catch (parseErr) {
				console.error("Failed to parse data:", parseErr);
			}
		} catch (err) {
			console.error("Error in fetchAllNodesData:", err);
		} finally {
			setIsFetching(false);
		}
	}, [deviceId, sendCommand, isFetching]);

	// Modify the useEffect to handle the interval more carefully
	useEffect(() => {
		if (!electron) return;

		let intervalId: NodeJS.Timeout | null = null;

		const initializeAndStartFetching = async () => {
			if (!isConnected) {
				try {
					const ports = await electron.listPorts();
					setAvailablePorts(ports.ports);
					setShowPortDialog(true);
				} catch (err) {
					setError(`Failed to list ports: ${err}`);
				}
				return;
			}

			// Initial fetch
			// await fetchAllNodesData();

			// Set up interval for subsequent fetches
			intervalId = setInterval(fetchAllNodesData, fetchInterval);
		};

		initializeAndStartFetching();

		// Cleanup function
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [numNodes, fetchAllNodesData, electron, isConnected]);

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
				<CardHeader className="flex flex-row">
					<CardTitle className="text-2xl grow">
						Brad BMS Manager
					</CardTitle>
					<button
						className="justify-self-end"
						onClick={() => setShowPortDialog(true)}
					>
						<Usb color={isConnected ? "green" : "red"} />
					</button>
				</CardHeader>
			</Card>

			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="flex items-center gap-4 mb-4">
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
						<span className="text-xs text-gray-500 dark:text-gray-400">
							Number of BMS nodes in system
						</span>
					</div>
					<Button onClick={() => sendCommand("a", numNodes)}>
						Start Addressing
					</Button>
				</div>
			</div>

			<Tabs defaultValue="overview">
				<TabsList className="justify-self-center">
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
						Cell Balancing
					</TabsTrigger>
					<TabsTrigger value="diagnostics">
						<AlertTriangle className="mr-2 h-4 w-4" />
						Diagnostics
					</TabsTrigger>
					<TabsTrigger value="terminal">
						<Terminal className="mr-2 h-4 w-4" />
						Terminal
					</TabsTrigger>
					<TabsTrigger value="settings">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-4">
					<OverviewTab allNodeData={allNodeData} />
				</TabsContent>

				<TabsContent value="voltage-summary" className="mt-4">
					<VoltageSummaryTab allNodeData={allNodeData} />
				</TabsContent>

				<TabsContent value="diagnostics" className="mt-4">
					{allNodeData.map((data) => {
						return (
							<DiagnosticDisplay
								key={data.nodeId}
								diagnostics={data.diagnostic}
								nodeNum={data.nodeId}
							/>
						);
					})}
				</TabsContent>

				<TabsContent value="temp-summary" className="mt-4">
					<TemperatureSummaryTab allNodeData={allNodeData} />
				</TabsContent>

				<TabsContent value="balancing" className="mt-4">
					<CellBalancingTab
						deviceId={deviceId}
						setDeviceId={setDeviceId}
						balancingTime={balancingTime}
						setBalancingTime={setBalancingTime}
						sendCommand={sendCommand}
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

				<TabsContent value="settings" className="mt-4">
					<SettingsTab
						deviceId={deviceId}
						sendCommand={sendCommand}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default BMSFrontend;
