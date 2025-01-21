import { port } from "./serialTypes";

// utils/electron.ts
export type ElectronWindow = Window & {
	electron: {
		listPorts: () => Promise<{ ports: port[] }>;
		connect: (
			path: string
		) => Promise<{ success: boolean; message: string }>;
		disconnect: () => Promise<{ success: boolean; message: string }>;
		getVoltage: (nodeId: number) => Promise<{
			success: boolean;
			message: string;
			output: string[];
		}>;
		getTemps: (nodeId: number) => Promise<{
			success: boolean;
			message: string;
			output: string[];
		}>;
		getDiagnostics: (nodeId: number) => Promise<{
			success: boolean;
			message: string;
			output: string[];
		}>;
		startBalancing: (nodeId: number) => Promise<{
			success: boolean;
			message: string;
			output: string[];
		}>;
		readRegister: (
			nodeId: number,
			register: string
		) => Promise<{
			success: boolean;
			message: string;
			output: string[];
		}>;
	};
};

// Safe way to access electron from renderer
export const getElectron = () => {
	if (
		typeof window !== "undefined" &&
		(window as unknown as ElectronWindow).electron
	) {
		return (window as unknown as ElectronWindow).electron;
	}
	return undefined;
};
