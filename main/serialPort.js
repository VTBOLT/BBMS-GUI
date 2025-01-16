import { SerialPort } from "serialport";

let serialPort;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listPorts() {
	return await SerialPort.list();
}

export async function connectPort(path) {
	if (serialPort && serialPort.isOpen) {
		await serialPort.close();
	}

	serialPort = new SerialPort({
		path,
		baudRate: 115200,
	});

	return { success: true, message: `Connected to ${path}` };
}

export async function disconnectPort() {
	if (serialPort && serialPort.isOpen) {
		await serialPort.close();
		return { success: true, message: "Disconnected from port" };
	}
	return { success: true, message: "Port already disconnected" };
}

export async function sendCommand(command, nodeId) {
	if (!serialPort || !serialPort.isOpen) {
		throw new Error("Serial port is not connected");
	}

	serialPort.flush();
	await delay(50);

	await new Promise((resolve) => {
		serialPort.write(`${command} ${nodeId}\n`, (error) => {
			if (error) {
				console.error("Serial port writing error:", error);
				serialPort.flush();
				throw error;
			}
		});
		serialPort.drain(() => resolve());
	});

	const lines = await readUntilDone();
	return processResponse(lines, command);
}

async function readUntilDone(timeout = 750) {
	let buffer = "";
	let startFound = false;

	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(
			() =>
				reject(
					new Error(
						`Reading operation timed out with buffer: ${buffer}`
					)
				),
			timeout
		);
	});

	const readingPromise = (async () => {
		while (true) {
			const data = serialPort.read();
			if (data) {
				buffer += data.toString();

				if (!startFound && buffer.includes("START")) {
					startFound = true;
				} else if (startFound && buffer.includes("END")) {
					return buffer
						.split("\n")
						.map((line) => line.trim())
						.filter((line) => line.length > 0);
				}
			}
			await delay(1);
		}
	})();

	try {
		return await Promise.race([readingPromise, timeoutPromise]);
	} catch (error) {
		console.error("Serial port reading error:", error);
		serialPort.flush();
		throw error;
	}
}

function processResponse(lines, type) {
	let formattedLines = [];

	for (const line of lines) {
		if (line.includes(",")) {
			if (type == "v") {
				const value = line.split(",")[1];
				formattedLines.push(value);
			} else {
				formattedLines = line.split(",");
			}
		}
	}

	return {
		success: lines.length > 0,
		message:
			lines.length > 0 ? "Data sent successfully" : "Data not sent :(",
		output: formattedLines,
	};
}
