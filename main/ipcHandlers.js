import { ipcMain } from "electron";
import {
	listPorts,
	connectPort,
	disconnectPort,
	sendCommand,
	justSendData,
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

ipcMain.handle("start-balancing", async (_, balTime) => {
	try {
		await justSendData(`b ${balTime}\n`);
		return;
	} catch (error) {
		console.error("Error starting balancing:", error);
		throw error;
	}
});

ipcMain.handle("read-register", async (_, nodeId, regAddr) => {
	try {
		return await sendCommand("r", `${nodeId} ${regAddr}`);
	} catch (error) {
		console.error("Error reading register:", error);
		throw error;
	}
});
