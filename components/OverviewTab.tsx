import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeData } from '../types';

interface OverviewTabProps {
    allNodeData: NodeData[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ allNodeData }) => {
    return (
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

            {/* Temperature Range Card */}
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

            {/* System Status Card */}
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
    );
};

export default OverviewTab;