import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import "./ipcHandlers.js";

const __dirname = app.getAppPath();
const appServe = serve({ directory: "out" });

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: `${__dirname}/main/preload.cjs`,
		},
	});

	if (app.isPackaged) {
		appServe(mainWindow)
			.then(() => mainWindow.loadURL("app://-"))
			.catch((error) => console.error("Error serving app:", error));
	} else {
		mainWindow.loadURL("http://localhost:3000/");
		mainWindow.webContents.openDevTools();
		console.log("Going!");
	}
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => app.quit());

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
