export interface NodeData {
	nodeId: number;
	voltages: number[];
	temps: number[];
	diagnostic: string[];
	bmicTemp: number;
	errors: string[];
}

// Constants
export const maxCellVoltage = 4.2;
export const minCellVoltage = 2.8;
export const lowCellVoltage = 3.0;
export const fetchInterval = 1500;
