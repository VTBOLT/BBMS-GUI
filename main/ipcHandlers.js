import { ipcMain } from "electron";
import {
	listPorts,
	connectPort,
	disconnectPort,
	sendCommand,
} from "./serialPort.js";

ipcMain.handle("list-ports", async () => {
	try {
		const ports = await listPorts();
		return { ports };
	} catch (error) {
		console.error("Error listing ports:", error);
		throw error;
	}
});

ipcMain.handle("connect-port", async (_, path) => {
	try {
		return await connectPort(path);
	} catch (error) {
		console.error("Error connecting to port:", error);
		throw error;
	}
});

ipcMain.handle("disconnect-port", async () => {
	try {
		return await disconnectPort();
	} catch (error) {
		console.error("Error disconnecting port:", error);
		throw error;
	}
});

ipcMain.handle("get-voltage", async (_, nodeId) => {
	try {
		return await sendCommand("v", nodeId);
	} catch (error) {
		console.error("Error getting voltage:", error);
		throw error;
	}
});

ipcMain.handle("get-temps", async (_, nodeId) => {
	try {
		return await sendCommand("t", nodeId);
	} catch (error) {
		console.error("Error getting temperatures:", error);
		throw error;
	}
});

ipcMain.handle("get-diagnostics", async (_, nodeId) => {
	try {
		return await sendCommand("d", nodeId);
	} catch (error) {
		console.error("Error getting diagnostics:", error);
		throw error;
	}
});
