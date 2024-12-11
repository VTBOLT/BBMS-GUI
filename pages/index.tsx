import {
	Battery,
	Activity,
	Thermometer,
	Settings,
	Terminal,
	Usb,
	AlertTriangle,
} from "lucide-react";
import React, { useState, FormEvent } from "react";
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
import SettingsTab from "@/components/SettingsTab";
import { usePortConnection } from "@/hooks/usePortConnection";
import { useNodeData } from "@/hooks/useNodeData";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BMSFrontend = () => {
	const electron = useElectron();
	const [balancingTime, setBalancingTime] = useState<number>(60);
	const [rawCommand, setRawCommand] = useState<string>("");
	const [numNodes, setNumNodes] = useState<number>(1);

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

	const { deviceId, setDeviceId, allNodeData, terminalOutput, sendCommand } =
		useNodeData(isConnected, numNodes);

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
