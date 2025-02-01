const { contextBridge, ipcRenderer } = require("electron");

const handler = {
	listPorts: async () => {
		return ipcRenderer.invoke("list-ports");
	},

	connect: async (portInfo) => {
		return ipcRenderer.invoke("connect-port", portInfo);
	},

	disconnect: async (path) => {
		return ipcRenderer.invoke("disconnect-port", path);
	},

	getVoltage: async (nodeId) => {
		return ipcRenderer.invoke("get-voltage", nodeId);
	},

	getTemps: async (nodeId) => {
		return ipcRenderer.invoke("get-temps", nodeId);
	},

	getDiagnostics: async (nodeId) => {
		return ipcRenderer.invoke("get-diagnostics", nodeId);
	},

	startBalancing: async (balTime) => {
		await ipcRenderer.invoke("start-balancing", balTime);
	},

	readRegister: async (nodeId, register) => {
		return ipcRenderer.invoke("read-register", nodeId, register);
	},

	getErrors: async (nodeId) => {
		return ipcRenderer.invoke("get-errors", nodeId);
	},
};

console.log("preload.js: exposing handler to window.electron");
contextBridge.exposeInMainWorld("electron", handler);
