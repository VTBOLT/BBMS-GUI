import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeData } from '../types';

interface TemperatureSummaryTabProps {
    allNodeData: NodeData[];
}

const TemperatureSummaryTab: React.FC<TemperatureSummaryTabProps> = ({ allNodeData }) => {
    return (
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
    );
};

export default TemperatureSummaryTab;