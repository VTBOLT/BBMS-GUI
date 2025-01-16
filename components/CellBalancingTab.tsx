import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Battery, BatteryCharging } from "lucide-react";
import { NodeData } from "@/types";

interface CellBalancingTabProps {
	numNodes: number;
	balancingTime: number;
	setBalancingTime: (time: number) => void;
	sendCommand: (command: string, ...args: number[]) => Promise<string>;
	allNodeData: NodeData[];
}

const CellBalancingTab: React.FC<CellBalancingTabProps> = ({
	numNodes,
	balancingTime,
	setBalancingTime,
	sendCommand,
	allNodeData,
}) => {
	const [isCharging, setIsCharging] = useState(false);
	const [isBalancing, setIsBalancing] = useState(false);
	const [status, setStatus] = useState<string | null>(null);
	const [logs, setLogs] = useState<[number[], number[]][][]>([]);

	useEffect(() => {
		if (isBalancing) {
			logs.push(allNodeData.map((data) => [data.voltages, data.temps]));
		} else {
			setLogs([]);
		}
	}, [allNodeData, isBalancing]);

	const startCharging = async () => {
		try {
			await sendCommand("s 1");
			setIsCharging(true);
			setStatus("Charging started for all devices");
		} catch (error) {
			setStatus("Failed to start charging: " + error);
		}
	};

	const stopCharging = async () => {
		try {
			await sendCommand("s 0");
			setIsCharging(false);
			setStatus("Charging stopped for all devices");
		} catch (error) {
			setStatus("Failed to stop charging: " + error);
		}
	};

	const startBalancing = async () => {
		try {
			for (let i = 1; i <= numNodes; i++) {
				await sendCommand("b", i, balancingTime);
			}
			setIsBalancing(true);
			setStatus("Balancing started for all devices");

			setTimeout(() => {
				console.log(logs);
				setIsBalancing(false);
				setStatus("Balancing completed for all devices");
			}, balancingTime * 1000);
		} catch (error) {
			setStatus("Failed to start balancing: " + error);
		}
	};

	const stopBalancing = async () => {
		try {
			await sendCommand("x");
			setIsBalancing(false);
			setStatus("Balancing stopped for all devices");
		} catch (error) {
			setStatus("Failed to stop balancing: " + error);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Cell Balancing Control</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<Input
							type="number"
							value={balancingTime}
							onChange={(e) =>
								setBalancingTime(parseInt(e.target.value))
							}
							className="w-32"
							min={0}
						/>
						<span className="text-sm text-gray-500">
							Balancing Time (s)
						</span>
					</div>

					{/* Status Display */}
					<div className="flex gap-4 items-center">
						{isCharging ? (
							<BatteryCharging
								className="text-green-500"
								size={24}
							/>
						) : (
							<Battery className="text-gray-500" size={24} />
						)}
						{status && (
							<Alert>
								<AlertDescription>{status}</AlertDescription>
							</Alert>
						)}
					</div>

					{/* Control Buttons */}
					<div className="flex flex-col gap-4">
						<div className="flex gap-4">
							<Button
								onClick={startCharging}
								disabled={isCharging}
								className="flex-1"
							>
								Start Charging
							</Button>
							<Button
								variant="destructive"
								onClick={stopCharging}
								disabled={!isCharging}
								className="flex-1"
							>
								Stop Charging
							</Button>
						</div>
						<div className="flex gap-4">
							<Button
								onClick={startBalancing}
								disabled={isBalancing}
								className="flex-1"
							>
								Start Balancing
							</Button>
							<Button
								variant="destructive"
								onClick={stopBalancing}
								disabled={!isBalancing}
								className="flex-1"
							>
								Stop Balancing
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CellBalancingTab;
