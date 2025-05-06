import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Battery, BatteryCharging } from "lucide-react";
import { NodeData } from "@/types";

interface CellBalancingTabProps {
	balancingTime: number;
	setBalancingTime: (time: number) => void;
	sendCommand: (command: string, ...args: number[]) => Promise<string>;
	allNodeData: NodeData[];
	isCharging: boolean;
	setIsCharging: (isCharging: boolean) => void;
	isBalancing: boolean;
	setIsBalancing: (isBalancing: boolean) => void;
	balancingStatus: string | null;
	setBalancingStatus: (status: string | null) => void;
}

const CellBalancingTab: React.FC<CellBalancingTabProps> = ({
	balancingTime,
	setBalancingTime,
	sendCommand,
	isCharging,
	setIsCharging,
	isBalancing,
	setIsBalancing,
	balancingStatus,
	setBalancingStatus,
}) => {
	const startCharging = async () => {
		try {
			await sendCommand("s 1");
			setIsCharging(true);
			setBalancingStatus("Charging started for all devices");
		} catch (error) {
			setBalancingStatus("Failed to start charging: " + error);
		}
	};

	const stopCharging = async () => {
		try {
			await sendCommand("s 0");
			setIsCharging(false);
			setBalancingStatus("Charging stopped for all devices");
		} catch (error) {
			setBalancingStatus("Failed to stop charging: " + error);
		}
	};

	const startBalancing = async () => {
		try {
			// setIsBalancing(true);
			setBalancingStatus("Balancing started for all devices");
			await sendCommand("b", balancingTime);

			setTimeout(() => {
				// setIsBalancing(false);
				setBalancingStatus("Balancing completed for all devices");
			}, balancingTime * 1000);
		} catch (error) {
			setBalancingStatus("Failed to start balancing: " + error);
		}
	};

	const stopBalancing = async () => {
		try {
			await sendCommand("x");
			// setIsBalancing(false);
			setBalancingStatus("Balancing stopped for all devices");
		} catch (error) {
			setBalancingStatus("Failed to stop balancing: " + error);
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
						{balancingStatus && (
							<Alert>
								<AlertDescription>
									{balancingStatus}
								</AlertDescription>
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
