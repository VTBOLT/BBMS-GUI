import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
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

const maxCellVoltage = 4.2;
const minCellVoltage = 2.8;
const lowCellVoltage = 3.0;
const fetchInterval = 500;

interface NodeData {
	nodeId: number;
	voltages: number[];
	temps: number[];
	diagnostic: string;
}

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
			<AlertDialog open={showPortDialog} onOpenChange={setShowPortDialog}>
				<AlertDialogContent className="bg-white dark:bg-gray-800">
					<AlertDialogHeader>
						<AlertDialogTitle>Select Serial Port</AlertDialogTitle>
						<AlertDialogDescription>
							Choose a serial port to connect to the BMS system.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex items-center gap-4 my-4">
						<Select
							value={selectedPort}
							onValueChange={setSelectedPort}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a port" />
							</SelectTrigger>
							<SelectContent>
								{availablePorts.map((port) => (
									<SelectItem
										key={port.path}
										value={port.path}
									>
										{port.path}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => handleDisconnect()}
							disabled={!isConnected}
						>
							Disconnect
						</AlertDialogAction>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => handlePortConnection(selectedPort)}
							disabled={!selectedPort}
						>
							Connect
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
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
					<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
						{/* Total Battery Voltage */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-base">
									Total Battery Voltage
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col items-center">
									<div className="text-4xl font-bold">
										{allNodeData
											.reduce(
												(total, node) =>
													total +
													node.voltages
														.filter((v) => v > 0)
														.reduce(
															(sum, v) => sum + v,
															0
														),
												0
											)
											.toFixed(1)}
										V
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
										{allNodeData.reduce(
											(total, node) =>
												total +
												node.voltages.filter(
													(v) => v > 0
												).length,
											0
										)}{" "}
										Active Cells
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Cell Voltage Range */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-base">
									Cell Voltage Range
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex justify-between items-center">
									<div className="text-center">
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Min
										</div>
										<div className="text-2xl font-semibold">
											{Math.min(
												...allNodeData.flatMap((node) =>
													node.voltages.filter(
														(v) => v > 0
													)
												)
											).toFixed(3)}
											V
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											Cell{" "}
											{allNodeData
												.find((node) =>
													node.voltages.includes(
														Math.min(
															...allNodeData.flatMap(
																(node) =>
																	node.voltages.filter(
																		(v) =>
																			v >
																			0
																	)
															)
														)
													)
												)
												?.voltages.indexOf(
													Math.min(
														...allNodeData.flatMap(
															(node) =>
																node.voltages.filter(
																	(v) => v > 0
																)
														)
													)
												) ?? -2 + 1}{" "}
											on Node{" "}
											{
												allNodeData.find((node) =>
													node.voltages.includes(
														Math.min(
															...allNodeData.flatMap(
																(node) =>
																	node.voltages.filter(
																		(v) =>
																			v >
																			0
																	)
															)
														)
													)
												)?.nodeId
											}
										</div>
									</div>
									<div className="text-center">
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Δ
										</div>
										<div className="text-2xl font-semibold">
											{(
												Math.max(
													...allNodeData.flatMap(
														(node) =>
															node.voltages
																.filter(
																	(v) => v > 0
																)
																.map((v) => v)
													)
												) -
												Math.min(
													...allNodeData.flatMap(
														(node) =>
															node.voltages.filter(
																(v) => v > 0
															)
													)
												)
											).toFixed(3)}
											V
										</div>
									</div>
									<div className="text-center">
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Max
										</div>
										<div className="text-2xl font-semibold">
											{Math.max(
												...allNodeData.flatMap((node) =>
													node.voltages.filter(
														(v) => v > 0
													)
												)
											).toFixed(3)}
											V
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											Cell{" "}
											{allNodeData
												.find((node) =>
													node.voltages.includes(
														Math.max(
															...allNodeData.flatMap(
																(node) =>
																	node.voltages.filter(
																		(v) =>
																			v >
																			0
																	)
															)
														)
													)
												)
												?.voltages.indexOf(
													Math.max(
														...allNodeData.flatMap(
															(node) =>
																node.voltages.filter(
																	(v) => v > 0
																)
														)
													)
												) ?? -2 + 1}{" "}
											on Node{" "}
											{
												allNodeData.find((node) =>
													node.voltages.includes(
														Math.max(
															...allNodeData.flatMap(
																(node) =>
																	node.voltages.filter(
																		(v) =>
																			v >
																			0
																	)
															)
														)
													)
												)?.nodeId
											}
										</div>
									</div>
								</div>
								<div className="text-[12px] text-gray-500 dark:text-gray-400 text-center mt-2">
									Across{" "}
									{allNodeData.reduce(
										(total, node) =>
											total +
											node.voltages.filter((v) => v > 0)
												.length,
										0
									)}{" "}
									Active Cells
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-base">
									Temperature Range
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex justify-between items-center">
									<div className="text-center">
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Min
										</div>
										<div className="text-2xl font-semibold">
											{Math.min(
												...allNodeData.flatMap((node) =>
													node.temps.filter(
														(t) => t !== 0
													)
												)
											).toFixed(1)}
											°C
										</div>
									</div>
									<div className="text-center">
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Δ
										</div>
										<div className="text-2xl font-semibold">
											{(
												Math.max(
													...allNodeData.flatMap(
														(node) =>
															node.temps.filter(
																(t) => t !== 0
															)
													)
												) -
												Math.min(
													...allNodeData.flatMap(
														(node) =>
															node.temps.filter(
																(t) => t !== 0
															)
													)
												)
											).toFixed(1)}
											°C
										</div>
									</div>
									<div className="text-center">
										<div className="text-sm text-gray-500 dark:text-gray-400">
											Max
										</div>
										<div className="text-2xl font-semibold">
											{Math.max(
												...allNodeData.flatMap((node) =>
													node.temps.filter(
														(t) => t !== 0
													)
												)
											).toFixed(1)}
											°C
										</div>
									</div>
								</div>
								<div className="text-[12px] text-gray-500 dark:text-gray-400 text-center mt-2">
									Across{" "}
									{allNodeData.reduce(
										(total, node) =>
											total +
											node.temps.filter((t) => t !== 0)
												.length,
										0
									)}{" "}
									Active Thermistors
								</div>
							</CardContent>
						</Card>

						{/* System Status */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-base">
									System Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="flex justify-between border-b dark:border-gray-700 py-1">
										<span className="text-gray-500 dark:text-gray-400">
											Active Nodes
										</span>
										<span className="font-medium">
											{allNodeData.length}
										</span>
									</div>
									<div className="flex justify-between border-b dark:border-gray-700 py-1">
										<span className="text-gray-500 dark:text-gray-400">
											Active Cells
										</span>
										<span className="font-medium">
											{allNodeData.reduce(
												(total, node) =>
													total +
													node.voltages.filter(
														(v) => v > 0
													).length,
												0
											)}
										</span>
									</div>
									<div className="flex justify-between border-b dark:border-gray-700 py-1">
										<span className="text-gray-500 dark:text-gray-400">
											Active Thermistors
										</span>
										<span className="font-medium">
											{allNodeData.reduce(
												(total, node) =>
													total +
													node.temps.filter(
														(t) => t !== 0
													).length,
												0
											)}
										</span>
									</div>
									<div className="flex justify-between border-b dark:border-gray-700 py-1">
										<span className="text-gray-500 dark:text-gray-400">
											Cell Balance
										</span>
										<span className="font-medium text-green-600 dark:text-green-500">
											{Math.max(
												...allNodeData.flatMap((node) =>
													node.voltages.filter(
														(v) => v > 0
													)
												)
											) -
												Math.min(
													...allNodeData.flatMap(
														(node) =>
															node.voltages.filter(
																(v) => v > 0
															)
													)
												) <
											0.1
												? "Good"
												: "Needs Balance"}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="voltage-summary" className="mt-4">
					<Card>
						<CardHeader className="pb-1">
							<CardTitle className="flex justify-between items-center text-base">
								<span>All Cell Voltages</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-1">
								{allNodeData.map((node) => (
									<div key={node.nodeId} className="flex">
										<div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 pl-1 sideways">
											Node {node.nodeId}
										</div>
										<div className="border rounded-lg p-0.5 grid grid-cols-7 gap-0.5 grow">
											{node.voltages.map(
												(voltage, idx) => (
													<div
														key={idx}
														className={`rounded px-0.5 py-0.5 ${
															voltage <
																minCellVoltage ||
															voltage >
																maxCellVoltage
																? "bg-red-100 dark:bg-red-900"
																: voltage <
																  lowCellVoltage
																? "bg-yellow-100 dark:bg-yellow-900"
																: "bg-green-100 dark:bg-green-900"
														}`}
													>
														<div className="text-center text-[11px] leading-none font-mono dark:text-gray-100">
															{voltage.toFixed(3)}
															V
														</div>
														<div className="text-center text-[8px] leading-none text-gray-500 dark:text-gray-400">
															C{idx + 1}
														</div>
													</div>
												)
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
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
					<Card>
						<CardHeader className="pb-1">
							<CardTitle className="flex justify-between items-center text-base">
								<span>All Temperatures</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 grid-cols-2">
								{allNodeData.map((node) => (
									<div key={node.nodeId} className="flex">
										<div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 pl-1 sideways">
											Node {node.nodeId}
										</div>
										<div className="border rounded-lg p-1 grid grid-cols-4 gap-0.5 grow">
											{node.temps.map((temp, idx) => (
												<div
													key={idx}
													className={`rounded px-0.5 py-0.5 ${
														temp > 50
															? "bg-red-100 dark:bg-red-900"
															: temp > 40
															? "bg-yellow-100 dark:bg-yellow-900"
															: "bg-green-100 dark:bg-green-900"
													}`}
												>
													<div className="text-center text-[12px] leading-none font-mono dark:text-gray-100">
														{temp.toFixed(3)}°C
													</div>
													<div className="text-center text-[10px] leading-none text-gray-500 dark:text-gray-400">
														GPIO{idx + 3}
													</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="balancing" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle>Cell Balancing Control</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-4">
								<div className="flex items-center gap-4">
									<Input
										type="number"
										value={deviceId}
										onChange={(e) =>
											setDeviceId(
												parseInt(e.target.value)
											)
										}
										className="w-32"
										min={0}
									/>
									<span className="text-sm text-gray-500">
										Device ID
									</span>
								</div>
								<div className="flex items-center gap-4">
									<Input
										type="number"
										value={balancingTime}
										onChange={(e) =>
											setBalancingTime(
												parseInt(e.target.value)
											)
										}
										className="w-32"
										min={0}
									/>
									<span className="text-sm text-gray-500">
										Balancing Time (s)
									</span>
								</div>
								<div className="flex gap-4">
									<Button
										onClick={() =>
											sendCommand(
												"b",
												deviceId,
												balancingTime
											)
										}
									>
										Start Balancing
									</Button>
									<Button
										variant="destructive"
										onClick={() =>
											sendCommand("x", deviceId)
										}
									>
										Stop Balancing
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="terminal" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle>Terminal Interface</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg h-96 mb-4 overflow-auto font-mono text-sm">
								{terminalOutput.map((line, i) => (
									<div
										key={i}
										className="text-gray-100 dark:text-gray-300"
									>
										{line}
									</div>
								))}
							</div>
							<form
								onSubmit={handleRawCommand}
								className="flex gap-2"
							>
								<Input
									value={rawCommand}
									onChange={(e) =>
										setRawCommand(e.target.value)
									}
									placeholder="Enter command..."
									className="font-mono"
								/>
								<Button type="submit">Send</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="settings" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle>System Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								<Button
									onClick={() => sendCommand("m", deviceId)}
								>
									Get Misc Information
								</Button>
								<Button
									onClick={() => sendCommand("z", deviceId)}
								>
									Check Errors
								</Button>
								<Button onClick={() => sendCommand("q")}>
									Quick Setup
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default BMSFrontend;
