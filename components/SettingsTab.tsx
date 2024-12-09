import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SettingsTabProps {
	deviceId: number;
	sendCommand: (
		command: string,
		...args: number[] | string[]
	) => Promise<string>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ deviceId, sendCommand }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>System Settings</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<Button onClick={() => sendCommand("m", deviceId)}>
						Get Misc Information
					</Button>
					<Button onClick={() => sendCommand("z", deviceId)}>
						Check Errors
					</Button>
					<Button onClick={() => sendCommand("q")}>
						Quick Setup
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default SettingsTab;
