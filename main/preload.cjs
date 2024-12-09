const { contextBridge, ipcRenderer } = require("electron");

const handler = {
    listPorts: async () => {
        return ipcRenderer.invoke("list-ports");
    },

    connect: async (path) => {
        return ipcRenderer.invoke("connect-port", path);
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
};

console.log("preload.js: exposing handler to window.electron");
contextBridge.exposeInMainWorld("electron", handler);