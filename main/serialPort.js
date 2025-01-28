import { WebUSB } from "usb";
import { TextEncoder, TextDecoder } from "util";

// Constants
const END_MARKER = "\x04"; // EOT (End of Transmission) character
const DEFAULT_CONFIG = {
	configurationValue: 1,
	interfaceNumber: 1,
};

class USBConnection {
	constructor() {
		this.webusb = new WebUSB({
			allowAllDevices: true, // Be careful with this in production
		});
		this.device = null;
		this.endpointIn = null;
		this.endpointOut = null;
	}

	async listPorts() {
		try {
			const devices = await this.webusb.getDevices();
			return devices.map((d) => ({
				path: `${d.manufacturerName || ""} ${
					d.productName || ""
				}`.trim(),
				vendorId: d.vendorId,
				productId: d.productId,
				manufacturer: d.manufacturerName,
				productName: d.productName,
				serialNumber: d.serialNumber,
				usbVersion: d.usbVersionMajor + "." + d.usbVersionMinor,
				deviceVersion:
					d.deviceVersionMajor + "." + d.deviceVersionMinor,
				deviceClass: d.deviceClass,
				deviceSubclass: d.deviceSubclass,
				deviceProtocol: d.deviceProtocol,
			}));
		} catch (error) {
			console.error("Error listing USB devices:", error);
			throw error;
		}
	}

	async connectPort(portInfo) {
		if (this.device) {
			await this.disconnectPort();
		}

		try {
			// Get all devices and find the matching one
			const devices = await this.webusb.getDevices();
			this.device = devices.find(
				(d) =>
					d.vendorId === portInfo.vendorId &&
					d.productId === portInfo.productId
			);

			if (!this.device) {
				throw new Error("Device not found");
			}

			await this.device.open();

			// Reset the device
			await this.device.reset();

			// Select configuration
			await this.device.selectConfiguration(
				DEFAULT_CONFIG.configurationValue
			);

			// Claim interface
			await this.device.claimInterface(DEFAULT_CONFIG.interfaceNumber);

			// Get the interface
			const iface =
				this.device.configuration.interfaces[
					DEFAULT_CONFIG.interfaceNumber
				];

			// Find endpoints
			const alternate = iface.alternate;
			this.endpointIn = alternate.endpoints.find(
				(e) => e.direction === "in"
			);
			this.endpointOut = alternate.endpoints.find(
				(e) => e.direction === "out"
			);

			if (!this.endpointIn || !this.endpointOut) {
				throw new Error("Required endpoints not found");
			}

			return {
				success: true,
				message: `Connected to ${
					this.device.productName || "USB device"
				}`,
			};
		} catch (error) {
			console.error("Connection error:", error);
			throw error;
		}
	}

	async disconnectPort() {
		if (this.device) {
			try {
				await this.device.close();
				this.device = null;
				this.endpointIn = null;
				this.endpointOut = null;
				return { success: true, message: "Disconnected" };
			} catch (error) {
				console.error("Disconnection error:", error);
				throw error;
			}
		}
		return { success: true, message: "Already disconnected" };
	}

	async sendCommand(command, nodeId) {
		if (!this.device || !this.endpointOut || !this.endpointIn) {
			throw new Error("Device not connected");
		}

		try {
			const encoder = new TextEncoder();
			const data = encoder.encode(`${command} ${nodeId}\n`);
			await this.device.transferOut(
				this.endpointOut.endpointNumber,
				data
			);
			await this.delay(50);

			const response = await this.readResponse();
			return this.processResponse(response, command);
		} catch (error) {
			console.error("Communication error:", error);
			throw error;
		}
	}

	async readResponse() {
		const lines = [];
		let buffer = "";
		const decoder = new TextDecoder();

		while (true) {
			const result = await this.device.transferIn(
				this.endpointIn.endpointNumber,
				this.endpointIn.packetSize
			);

			if (result.data && result.data.byteLength > 0) {
				const text = decoder.decode(result.data);

				if (text.includes(END_MARKER)) {
					buffer += text.split(END_MARKER)[0];
					if (buffer) {
						const finalLines = buffer
							.split("\n")
							.filter((line) => line);
						lines.push(...finalLines);
					}
					break;
				}

				buffer += text;
				const splitBuffer = buffer.split("\n");
				buffer = splitBuffer.pop() || "";

				const completeLines = splitBuffer.filter((line) => line);
				if (completeLines.length > 0) {
					lines.push(...completeLines);
				}
			}

			await this.delay(10);
		}

		return lines;
	}

	processResponse(lines, type) {
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
				lines.length > 0
					? "Data sent successfully"
					: "Data not sent :(",
			output: formattedLines,
		};
	}

	async justSendData(data) {
		if (!this.device || !this.endpointOut) {
			throw new Error("USB device is not connected");
		}

		const encoder = new TextEncoder();
		const buffer = encoder.encode(data);
		await this.device.transferOut(this.endpointOut.endpointNumber, buffer);
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// Create a singleton instance
const usbConnection = new USBConnection();

// Export functions directly to match original interface
export async function listPorts() {
	return await usbConnection.listPorts();
}

export async function connectPort(portInfo) {
	return await usbConnection.connectPort(portInfo);
}

export async function disconnectPort() {
	return await usbConnection.disconnectPort();
}

export async function sendCommand(command, nodeId) {
	return await usbConnection.sendCommand(command, nodeId);
}

export async function justSendData(data) {
	return await usbConnection.justSendData(data);
}
