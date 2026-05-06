const { app, BrowserWindow, dialog, shell } = require("electron");
const { fork } = require("child_process");
const http = require("http");
const path = require("path");

const API_HOST = "127.0.0.1";
const API_PORT = process.env.ELECTRON_API_PORT || "5050";
const API_BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

let mainWindow = null;
let backendProcess = null;

function getBackendEntry() {
  if (app.isPackaged) {
    // Backend is unpacked because child processes cannot run reliably from asar.
    return path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "backend",
      "server.js"
    );
  }

  return path.join(app.getAppPath(), "backend", "server.js");
}

function getFrontendIndex() {
  return path.join(app.getAppPath(), "frontend", "build", "index.html");
}

function startBackend() {
  const backendEntry = getBackendEntry();
  // Uploaded Excel files must live outside the installed app directory.
  const uploadDir = path.join(app.getPath("userData"), "uploads");
  const nodeModulesPath = path.join(app.getAppPath(), "node_modules");

  backendProcess = fork(backendEntry, {
    cwd: path.dirname(backendEntry),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      HOST: API_HOST,
      PORT: API_PORT,
      NODE_PATH: nodeModulesPath,
      UPLOAD_DIR: uploadDir,
      JWT_SECRET: process.env.JWT_SECRET || "attendance-monitoring-local-secret"
    },
    stdio: "pipe"
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`[backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`[backend] ${data.toString().trim()}`);
  });

  backendProcess.on("exit", (code) => {
    if (code !== 0 && !app.isQuitting) {
      dialog.showErrorBox(
        "Backend stopped",
        "The local backend server stopped unexpectedly. Please restart the app."
      );
    }
  });
}

function waitForBackend(timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      // Keep the Electron window hidden until the API is ready to receive calls.
      const request = http.get(`http://${API_HOST}:${API_PORT}/test`, (res) => {
        res.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("Backend did not start in time."));
          return;
        }

        setTimeout(check, 300);
      });

      request.setTimeout(1000, () => {
        request.destroy();
      });
    };

    check();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // The renderer reads this through preload instead of hard-coding an API URL.
      additionalArguments: [`--api-base-url=${API_BASE_URL}`]
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  await mainWindow.loadFile(getFrontendIndex());
}

app.whenReady().then(async () => {
  try {
    startBackend();
    await waitForBackend();
    await createWindow();
  } catch (error) {
    dialog.showErrorBox(
      "Startup failed",
      `${error.message}\n\nMake sure XAMPP MySQL is running and the attendance_monitor database exists.`
    );
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

app.on("before-quit", () => {
  app.isQuitting = true;

  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
});
