import { app, BrowserWindow, ipcMain } from "electron";
import { SerialPort } from "serialport";
import serve from "electron-serve";

// Crate the __dirname variable
const __dirname = app.getAppPath();

const appServe = serve({ directory: "out" });

let mainWindow;
let serialPort;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: `${__dirname}/main/preload.cjs`,
		},
	});

	const startUrl = "http://localhost:3000";

	if (app.isPackaged) {
		console.log("prod");
		appServe(mainWindow)
			.then(() => {
				mainWindow.loadURL("app://-");
				console.log("Serving app");
			})
			.catch((error) => {
				console.error("Error serving app:", error);
			});
	} else {
		console.log("dev");
		mainWindow.loadURL(startUrl);
	}

	if (!app.isPackaged) {
		mainWindow.webContents.openDevTools();
	}
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	app.quit();
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

const readUntilDone = async (timeout = 100) => {
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
		// Keep reading until we find both START and END
		while (true) {
			const data = serialPort.read();
			if (data) {
				// Append new data to buffer
				buffer += data.toString();

				// Look for START if we haven't found it yet
				if (!startFound && buffer.includes("START")) {
					startFound = true;
				} else if (startFound && buffer.includes("END")) {
					// Process the lines
					const processedLines = buffer
						.split("\n")
						.map((line) => line.trim())
						.filter((line) => line.length > 0);

					return processedLines;
				}
			}

			// Small delay to prevent CPU thrashing
			await new Promise((resolve) => setTimeout(resolve, 1));
		}
	})();

	try {
		return await Promise.race([readingPromise, timeoutPromise]);
	} catch (error) {
		console.error("Serial port reading error:", error);
		serialPort.flush(); // Flush the port on error
		throw error;
	}
};

// List available serial ports
ipcMain.handle("list-ports", async () => {
	try {
		const ports = await SerialPort.list();
		return { ports: ports };
	} catch (error) {
		console.error("Error listing ports:", error);
		throw error;
	}
});

// Connect to serial port
ipcMain.handle("connect-port", async (event, path) => {
	const baud = 115200;
	try {
		if (serialPort && serialPort.isOpen) {
			await serialPort.close();
		}

		console.log("Connecting to port:", path);

		serialPort = new SerialPort({
			path: path,
			baudRate: baud,
		});

		console.log(`Connected to ${path}`);

		return { success: true, message: `Connected to ${path}` };
	} catch (error) {
		console.error("Error connecting to port:", error);
		throw error;
	}
});

// Send data through serial port
ipcMain.handle("get-voltage", async (event, nodeId) => {
	try {
		if (!serialPort || !serialPort.isOpen) {
			throw new Error("Serial port is not connected");
		}

		serialPort.flush();
		await delay(50);

		const data = `v ${nodeId}\r\n`;

		await new Promise((resolve, reject) => {
			serialPort.write(data, (error) => {
				if (error) reject(error);
			});
			serialPort.drain(() => {
				resolve();
			});
		});

		const lines = await readUntilDone();

		let formattedLines = [];

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].indexOf(",") !== -1) {
				lines[i] = lines[i].split(",")[1];
				if (lines[i].length !== 7 && parseFloat(lines[i]) !== 0.0) {
					console.log("not sent: ", lines[i]);
					return {
						success: false,
						message: "Data not sent :(",
						output: formattedLines,
					};
				}
				formattedLines.push(lines[i]);
			}
		}

		if (lines.length === 0) {
			return {
				success: false,
				message: "Data not sent :(",
				output: formattedLines,
			};
		}

		return {
			success: true,
			message: "Data sent successfully",
			output: formattedLines,
		};
	} catch (error) {
		serialPort.write("\n");
		serialPort.write("\n");
		console.error("Error sending data:", error);
		throw error;
	}
});

ipcMain.handle("get-temps", async (event, nodeId) => {
	try {
		if (!serialPort || !serialPort.isOpen) {
			throw new Error("Serial port is not connected");
		}

		serialPort.flush();
		await delay(50);

		const data = `t ${nodeId}\n`;

		await new Promise((resolve, reject) => {
			serialPort.write(data, (error) => {
				if (error) reject(error);
			});
			serialPort.drain(() => {
				resolve();
			});
		});

		let received = await readUntilDone();
		let lines = [];
		for (const line of received) {
			if (line.indexOf(",") !== -1) {
				lines = [line];
			}
		}

		if (lines.length === 0) {
			return {
				success: false,
				message: "Data not sent :(",
				output: lines,
			};
		}

		return {
			success: true,
			message: "Data sent successfully",
			output: lines,
		};
	} catch (error) {
		serialPort.write("\n");
		serialPort.write("\n");
		console.error("Error sending data:", error);
		throw error;
	}
});

ipcMain.handle("get-diagnostics", async (event, nodeId) => {
	try {
		if (!serialPort || !serialPort.isOpen) {
			throw new Error("Serial port is not connected");
		}

		serialPort.flush();
		await delay(50);

		const data = `d ${nodeId}\n`;

		await new Promise((resolve, reject) => {
			serialPort.write(data, (error) => {
				if (error) reject(error);
			});
			serialPort.drain(() => {
				resolve();
			});
		});

		let received = await readUntilDone();
		let lines = [];
		for (const line of received) {
			if (line.indexOf(",") !== -1) {
				lines = [line];
			}
		}

		if (lines.length === 0) {
			return {
				success: false,
				message: "Data not sent :(",
				output: lines,
			};
		}

		return {
			success: true,
			message: "Data sent successfully",
			output: lines,
		};
	} catch (error) {
		serialPort.write("\n");
		serialPort.write("\n");
		console.error("Error sending data:", error);
		throw error;
	}
});

// Disconnect from serial port
ipcMain.handle("disconnect-port", async () => {
	try {
		if (serialPort && serialPort.isOpen) {
			await serialPort.close();
			return { success: true, message: "Disconnected from port" };
		}
		return { success: true, message: "Port already disconnected" };
	} catch (error) {
		console.error("Error disconnecting port:", error);
		throw error;
	}
});
