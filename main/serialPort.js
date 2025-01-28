import { usb, findByIds } from "usb";
import { promisify } from "util";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let device = null;
let usbInterface = null; // Renamed from 'interface' (reserved word)
let endpointIn = null;
let endpointOut = null;
// On the sending side, append a special end marker
const END_MARKER = "\x04"; // EOT (End of Transmission) character

export async function listPorts() {
	try {
		return usb.getDeviceList().map((d) => ({
			path: `${d.deviceDescriptor.manufacturer || ""} ${
				d.deviceDescriptor.product || ""
			}`.trim(),
			vendorId: d.deviceDescriptor.idVendor,
			productId: d.deviceDescriptor.idProduct,
			manufacturer: d.deviceDescriptor.manufacturer,
			productName: d.deviceDescriptor.product,
			serialNumber: d.deviceDescriptor.serialNumber,
			usbVersion: d.deviceDescriptor.bcdUSB,
			deviceVersion: d.deviceDescriptor.bcdDevice,
			deviceClass: d.deviceDescriptor.bDeviceClass,
			deviceSubclass: d.deviceDescriptor.bDeviceSubClass,
			deviceProtocol: d.deviceDescriptor.bDeviceProtocol,
		}));
	} catch (error) {
		console.error("Error listing USB devices:", error);
		throw error;
	}
}

export async function connectPort(portInfo) {
	if (device) await disconnectPort();

	try {
		device = findByIds(portInfo.vendorId, portInfo.productId);

		if (!device) throw new Error("Device not found");

		// Synchronous open
		device.open();

		await new Promise((resolve, reject) => {
			device.reset((err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});

		// Promisify setConfiguration
		const setConfigurationAsync = promisify(device.setConfiguration).bind(
			device
		);
		await setConfigurationAsync(1);

		// Get first interface
		usbInterface = device.interfaces[1];
		if (!usbInterface) throw new Error("No interface found");

		// Synchronous claim
		usbInterface.claim();

		// Find endpoints
		endpointIn = usbInterface.endpoints.find((e) => e.direction === "in");
		endpointOut = usbInterface.endpoints.find((e) => e.direction === "out");

		if (!endpointIn || !endpointOut) {
			throw new Error("Required endpoints not found");
		}

		return {
			success: true,
			message: `Connected to ${
				device.deviceDescriptor.product || "USB device"
			}`,
		};
	} catch (error) {
		console.error("Connection error:", error);
		throw error;
	}
}

export async function disconnectPort() {
	if (device) {
		try {
			if (usbInterface) {
				// Synchronous release
				usbInterface.release(true);
			}
			// Synchronous close
			device.close();
			device = null;
			usbInterface = null;
			endpointIn = null;
			endpointOut = null;
			return { success: true, message: "Disconnected" };
		} catch (error) {
			console.error("Disconnection error:", error);
			throw error;
		}
	}
	return { success: true, message: "Already disconnected" };
}

export async function sendCommand(command, nodeId) {
	if (!device || !endpointOut || !endpointIn) {
		throw new Error("Device not connected");
	}

	try {
		const data = Buffer.from(`${command} ${nodeId}\n`);
		const transferOutAsync = promisify(endpointOut.transfer).bind(
			endpointOut
		);
		await transferOutAsync(data);
		await delay(50);

		const response = await readResponse();
		return processResponse(response, command);
	} catch (error) {
		console.error("Communication error:", error);
		throw error;
	}
}

// In readResponse()
async function readResponse() {
	const lines = [];
	let buffer = "";
	const transferInAsync = promisify(endpointIn.transfer).bind(endpointIn);

	while (true) {
		const data = await transferInAsync(
			endpointIn.descriptor.wMaxPacketSize
		);

		if (data && data.length > 0) {
			const text = data.toString();

			// Check if we've hit the end marker
			if (text.includes(END_MARKER)) {
				// Add any remaining text before the marker to the buffer
				buffer += text.split(END_MARKER)[0];

				// Process the final buffer contents
				if (buffer) {
					const finalLines = buffer
						.split("\n")
						.filter((line) => line);
					lines.push(...finalLines);
				}
				break;
			}

			// Add new text to buffer
			buffer += text;

			// Process complete lines from buffer
			const splitBuffer = buffer.split("\n");

			// Keep the last (potentially incomplete) line in the buffer
			buffer = splitBuffer.pop() || "";

			// Add complete lines to results
			const completeLines = splitBuffer.filter((line) => line);
			if (completeLines.length > 0) {
				lines.push(...completeLines);
			}
		}

		await delay(10);
	}

	return lines;
}

// Keep processResponse as original

function processResponse(lines, type) {
	let formattedLines = [];

	for (const line of lines) {
		if (type === "r") {
			if (line.includes("0x")) {
				formattedLines.push(line);
			}
		} else if (line.includes(",")) {
			if (type === "v") {
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

export async function justSendData(data) {
	if (!device || !endpointOut) {
		throw new Error("USB device is not connected");
	}

	const encoder = new TextEncoder();
	const buffer = encoder.encode(data);
	await device.transferOut(endpointOut.endpointNumber, buffer);
	return;
}
