import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	NodeData,
	maxCellVoltage,
	minCellVoltage,
	lowCellVoltage,
} from "../types";

interface VoltageSummaryTabProps {
	allNodeData: NodeData[];
	balancingCells: number[];
}

const VoltageSummaryTab: React.FC<VoltageSummaryTabProps> = ({
	allNodeData,
	balancingCells,
}) => {
	return (
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
								{node.voltages.map((voltage, idx) => (
									<div
										key={idx}
										className={`rounded px-5 py-0.5 ${
											balancingCells.includes(
												idx + 1 + 14 * (node.nodeId - 1)
											)
												? "bg-sky-100 dark:bg-sky-100"
												: voltage < minCellVoltage ||
												  voltage > maxCellVoltage
												? "bg-red-100 dark:bg-red-900"
												: voltage < lowCellVoltage
												? "bg-yellow-100 dark:bg-yellow-900"
												: "bg-green-100 dark:bg-green-900"
										}`}
									>
										<div className="text-center text-[11px] leading-none font-mono dark:text-gray-100">
											{voltage.toFixed(3)}V
										</div>
										<div className="text-center text-[8px] leading-none text-gray-500 dark:text-gray-400">
											C{idx + 1}
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

export default VoltageSummaryTab;
