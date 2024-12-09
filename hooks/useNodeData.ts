import { useState, useEffect, useCallback } from "react";
import { NodeData, fetchInterval } from "../types";
import { useElectron } from "@/components/useElectron";

export const useNodeData = (isConnected: boolean) => {
	const electron = useElectron();
	const [deviceId, setDeviceId] = useState<number>(1);
	const [allNodeData, setAllNodeData] = useState<NodeData[]>([]);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

	const sendCommand = useCallback(
		async (
			command: string,
			...args: number[] | string[]
		): Promise<string> => {
			setTerminalOutput((prev) => [
				...prev,
				`> ${command} ${args.join(" ")}`,
			]);

			if (!isConnected) {
				setError("Not connected to serial port");
				return "";
			} else {
				if (error === "Not connected to serial port") {
					setError("");
				}
			}

			const nodeId: number = args[0] as number;

			switch (command) {
				case "v":
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							const { success, message, output } =
								await electron.getVoltage(nodeId);
							if (success) {
								return output.toString();
							} else {
								console.log(message);
								return "FAIL";
							}
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				case "t":
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							const { success, message, output } =
								await electron.getTemps(nodeId);
							if (success) {
								return output.toString();
							} else {
								console.log(message);
								return "FAIL";
							}
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				case "d":
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							const { success, message, output } =
								await electron.getDiagnostics(nodeId);
							if (success) {
								return output.toString();
							} else {
								console.log(message);
								return "FAIL";
							}
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				default:
					setError("Invalid command");
					return "";
			}
		},
		[electron, isConnected, error]
	);

	const fetchAllNodesData = useCallback(async () => {
		if (isFetching) return;

		try {
			setIsFetching(true);
			const voltages = await sendCommand("v", deviceId);
			if (voltages === "FAIL") {
				console.error("Failed to fetch voltages");
				return;
			}

			const temps = await sendCommand("t", deviceId);
			if (temps === "FAIL") {
				console.error("Failed to fetch temperatures");
				return;
			}

			if (voltages.includes("nan") || temps.includes("nan")) {
				console.error("NAN in data");
				return;
			}

			try {
				const newData = [
					{
						nodeId: deviceId,
						voltages: JSON.parse(`[${voltages}]`),
						temps: JSON.parse(`[${temps}]`),
						diagnostic: "1,2,3,4",
					},
				];
				setAllNodeData(newData);
			} catch (parseErr) {
				console.error("Failed to parse data:", parseErr);
			}
		} catch (err) {
			console.error("Error in fetchAllNodesData:", err);
		} finally {
			setIsFetching(false);
		}
	}, [deviceId, sendCommand, isFetching]);

	useEffect(() => {
		if (!electron || !isConnected) return;

		let intervalId: NodeJS.Timeout | null = null;
		intervalId = setInterval(fetchAllNodesData, fetchInterval);

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [fetchAllNodesData, electron, isConnected]);

	return {
		deviceId,
		setDeviceId,
		allNodeData,
		error,
		setError,
		terminalOutput,
		setTerminalOutput,
		sendCommand,
	};
};
