const { contextBridge } = require("electron");

function readArgument(name) {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : "";
}

contextBridge.exposeInMainWorld("electronAPI", {
  apiBaseUrl: readArgument("--api-base-url"),
  isDesktop: true
});
