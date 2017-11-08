const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

//-------------------------------------------------------------------
//加入日志
//
//
//
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

//-------------------------------------------------------------------
//初始化默认串口
//
//
//
//-------------------------------------------------------------------
let win; // this will store the window object
function createDefaultWindow() {
  win = new BrowserWindow({ width: 900, height: 680 });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on("closed", () => app.quit());
  return win;
}

// when the app is loaded create a BrowserWindow and check for updates
app.on("ready", function() {
  createDefaultWindow();
  autoUpdater.checkForUpdates();
});

//-------------------------------------------------------------------
//设置更新
//
//
//
//-------------------------------------------------------------------
autoUpdater.on("error", (event, error) => {
  dialog.showErrorBox("Error: ", error);
});
autoUpdater.on("update-available", () => {
  dialog.showMessageBox(
    {
      type: "info",
      title: "Found Updates",
      message: "Found updates, do you want update now?",
      buttons: ["Sure", "No"]
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      } else {
        updater.enabled = true;
        updater = null;
      }
    }
  );
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.setFeedURL({
    GithubOptions: { token: "9e5abd5f8b7581dc9a2b0a216e2e258611f634d4" }
  });

  autoUpdater.quitAndInstall();
});
