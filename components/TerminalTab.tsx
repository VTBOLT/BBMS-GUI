import React, { FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TerminalTabProps {
    terminalOutput: string[];
    rawCommand: string;
    setRawCommand: (command: string) => void;
    handleRawCommand: (e: FormEvent<HTMLFormElement>) => void;
}

const TerminalTab: React.FC<TerminalTabProps> = ({
    terminalOutput,
    rawCommand,
    setRawCommand,
    handleRawCommand
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Terminal Interface</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg h-96 mb-4 overflow-auto font-mono text-sm">
                    {terminalOutput.map((line, i) => (
                        <div key={i} className="text-gray-100 dark:text-gray-300">
                            {line}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleRawCommand} className="flex gap-2">
                    <Input
                        value={rawCommand}
                        onChange={(e) => setRawCommand(e.target.value)}
                        placeholder="Enter command..."
                        className="font-mono"
                    />
                    <Button type="submit">Send</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default TerminalTab;