import { useState, useEffect, useCallback, useRef } from "react";
import { NodeData, fetchInterval } from "../types";
import { useElectron } from "@/components/useElectron";

export const useNodeData = (isConnected: boolean, numNodes: number) => {
	const electron = useElectron();
	const [deviceId, setDeviceId] = useState<number>(1);
	const [allNodeData, setAllNodeData] = useState<NodeData[]>([]);
	const [balancingCells, setBalancingCells] = useState<number[]>([]); // Array of node IDs that are balancing
	const [error, setError] = useState<string>("");
	const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
	const [totalCurrent, setTotalCurrent] = useState<number>(0);

	const isFetchingRef = useRef(false);

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
								let retVal = "";
								output.forEach((element) => {
									retVal += '"' + element + '",';
								});
								retVal = retVal.slice(0, -1); // Get rid of trailing comma
								return retVal;
							} else {
								console.log(message);
								return "FAIL";
							}
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				case "b":
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							await electron.startBalancing(nodeId);
							console.log("Balancing started with time ", nodeId);
							return "";
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				case "r":
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							const regToRead = args[1] as string;
							const { success, message, output } =
								await electron.readRegister(nodeId, regToRead);
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
				case "z":
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							return (
								await electron.getErrors(nodeId)
							).output.toString();
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
				default:
					if (!electron) {
						console.log("No electron :(");
						return "FAIL";
					} else {
						try {
							return (
								await electron.sendGenericCommand(
									command,
									nodeId
								)
							).output.toString();
						} catch (err) {
							console.error(err);
							return "FAIL";
						}
					}
			}
		},
		[electron, isConnected, error]
	);

	const fetchAllNodesData = useCallback(async () => {
		if (isFetchingRef.current) return;

		isFetchingRef.current = true; // lock

		const newData: NodeData[] = [];

		try {
			let balancingCellsString = await sendCommand("k");
			// If last char is a comma remove it
			if (balancingCellsString.endsWith(",")) {
				balancingCellsString = balancingCellsString.slice(0, -1);
			}

			setBalancingCells(JSON.parse(`[${balancingCellsString}]`));

			for (let i = 1; i <= numNodes; i++) {
				let voltages = await sendCommand("v", i);
				if (voltages === "FAIL") {
					console.error("Failed to fetch voltages");
					isFetchingRef.current = false; // unlock
					return;
				}

				let temps = await sendCommand("t", i);
				if (temps === "FAIL") {
					console.error("Failed to fetch temperatures");
					isFetchingRef.current = false; // unlock
					return;
				}

				let diagnostic = await sendCommand("d", i);
				if (diagnostic === "FAIL") {
					console.error("Failed to fetch diagnostics");
					isFetchingRef.current = false; // unlock
					return;
				}

				const mainTemp = await sendCommand("o", i);

				if (voltages.includes("nan") || temps.includes("nan")) {
					console.error("NAN in data");
					temps = temps.replaceAll("nan", "0");
					voltages = voltages.replaceAll("nan", "0");
					diagnostic = diagnostic.replaceAll("nan", "0");
				}

				const errors = await sendCommand("z", i);
				let formattedErrors: string[];
				if (errors === "") {
					formattedErrors = [];
				} else {
					formattedErrors = errors.split(";").map((error) => {
						return error.replace(/"/g, "");
					});
				}

				try {
					newData.push({
						nodeId: i,
						voltages: JSON.parse(`[${voltages}]`),
						temps: JSON.parse(`[${temps}]`),
						diagnostic: JSON.parse(`[${diagnostic}]`),
						errors: formattedErrors,
						bmicTemp: parseFloat(mainTemp),
					});
				} catch (parseErr) {
					console.error("Failed to parse data:", parseErr);
					isFetchingRef.current = false; // unlock
					return;
				}
			}
			setAllNodeData(newData);

			const current = await sendCommand("i");
			if (current === "FAIL") {
				console.error("Failed to fetch current");
				return;
			}
			const currentValue = parseFloat(current);
			if (!isNaN(currentValue)) {
				setTotalCurrent(currentValue);
				console.log("Current:", currentValue);
			}
		} catch (err) {
			console.error("Error in fetchAllNodesData:", err);
		} finally {
			isFetchingRef.current = false; // unlock
		}
	}, [sendCommand, numNodes]);

	useEffect(() => {
		if (!electron || !isConnected) return;

		let intervalId: NodeJS.Timeout | null = null;
		intervalId = setInterval(fetchAllNodesData, fetchInterval);

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
				// setTimeout(() => {
				// 	setIsFetching(false);
				// }, 1000);
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
		totalCurrent,
		balancingCells,
	};
};
