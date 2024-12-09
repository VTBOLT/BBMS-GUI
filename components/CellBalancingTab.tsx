import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CellBalancingTabProps {
    deviceId: number;
    setDeviceId: (id: number) => void;
    balancingTime: number;
    setBalancingTime: (time: number) => void;
    sendCommand: (command: string, ...args: number[]) => Promise<string>;
}

const CellBalancingTab: React.FC<CellBalancingTabProps> = ({
    deviceId,
    setDeviceId,
    balancingTime,
    setBalancingTime,
    sendCommand
}) => {
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
                            value={deviceId}
                            onChange={(e) => setDeviceId(parseInt(e.target.value))}
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
                            onChange={(e) => setBalancingTime(parseInt(e.target.value))}
                            className="w-32"
                            min={0}
                        />
                        <span className="text-sm text-gray-500">
                            Balancing Time (s)
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => sendCommand("b", deviceId, balancingTime)}>
                            Start Balancing
                        </Button>
                        <Button variant="destructive" onClick={() => sendCommand("x", deviceId)}>
                            Stop Balancing
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CellBalancingTab;