import React from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { port } from "@/components/serialTypes";

interface PortSelectionDialogProps {
	showPortDialog: boolean;
	setShowPortDialog: (show: boolean) => void;
	selectedPort: string;
	setSelectedPort: (port: string) => void;
	availablePorts: port[];
	isConnected: boolean;
	onConnect: (port: port) => Promise<void>;
	onDisconnect: () => Promise<void>;
}

const PortSelectionDialog: React.FC<PortSelectionDialogProps> = ({
	showPortDialog,
	setShowPortDialog,
	selectedPort,
	setSelectedPort,
	availablePorts,
	isConnected,
	onConnect,
	onDisconnect,
}) => {
	return (
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
									key={port.productId}
									value={JSON.stringify(port)}
								>
									{port.productName} ({port.manufacturer})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={() => onDisconnect()}
						disabled={!isConnected}
					>
						Disconnect
					</AlertDialogAction>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => onConnect(JSON.parse(selectedPort))}
						disabled={!selectedPort}
					>
						Connect
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default PortSelectionDialog;
