const {
  app,
  BrowserWindow,
  Menu,
  remote,
  dialog,
  ipcMain
} = require("electron");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");
//-------------------------------------------------------------------
//
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("app is running");

//-------------------------------------------------------------------
// 初始化菜单
//-------------------------------------------------------------------
const template = [
  {
    label: "选项",
    submenu: [
      {
        label: "退出",
        click() {
          appQuit();
        }
      }
    ]
  },
  {
    label: "关于我",
    submenu: [
      {
        label: "关于我",
        click() {}
      }
    ]
  }
];

//-------------------------------------------------------------------
//初始化窗口;
//-------------------------------------------------------------------
let win;
function createDefaultWindow() {
  win = new BrowserWindow({
    title: app.getName(),
    type: "toolbar",
    center: true,
    backgroundColor: "#2e2c29",
    width: 1100,
    height: 1000,
    minWidth: 800,
    minHeight: 600
  });
  win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
  win.once("ready-to-show", () => {
    win.show();
  });
  win.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
  return win;
}
function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send("message", text);
}

//-------------------------------------------------------------------
//更新函数;
//updateWithAuto自动更新；
//updateWIthHandle手动更新
//-------------------------------------------------------------------
function updateWithAuto() {
  let message = {
    error: "检查更新出错",
    checking: "正在检查更新……",
    updateAva: "可升级到新版本",
    updateNotAva: "现在使用的就是最新版本，不用更新",
    updateDownloaded: "更新完成，请重新启动已完成更新"
  };
  autoUpdater.setFeedURL("http://localhost:8080");

  autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow({
      status: 1,
      msg: message.checking
    });
  });
  autoUpdater.on("update-available", info => {
    sendStatusToWindow({
      status: 2,
      msg: message.updateAva
    });
  });
  autoUpdater.on("update-not-available", info => {
    sendStatusToWindow({
      status: 3,
      msg: message.updateNotAva
    });
  });
  autoUpdater.on("error", err => {
    sendStatusToWindow({
      status: 0,
      msg: message.error + err
    });
  });
  autoUpdater.on("download-progress", progressObj => {
    // let log_message = "";
    // log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    // log_message =
    //   log_message +
    //   " (" +
    //   progressObj.transferred +
    //   "/" +
    //   progressObj.total +
    //   ")";
    let log_message = parseInt(progressObj.percent) + "%";
    sendStatusToWindow({
      status: 4,
      msg: log_message,
      obj: progressObj
    });
  });
  autoUpdater.on("update-downloaded", info => {
    sendStatusToWindow({
      status: 5,
      msg: message.updateDownloaded,
      obj: info
    });
  });

  autoUpdater.checkForUpdatesAndNotify();
}
function updateWIthHandle() {
  autoUpdater.setFeedURL("http://localhost:8080");
  autoUpdater.autoDownload = false; //是否自动下载；
  autoUpdater.checkForUpdates(); //检查是否有更新

  ipcMain.on("update", function() {
    let CancellationToken = autoUpdater.downloadUpdate(); //获取浏览器发送的消息过来并进行更新
  });

  let message = {
    error: "检查更新出错",
    checking: "正在检查更新……",
    updateAva: "可升级到新版本",
    updateNotAva: "现在使用的就是最新版本，不用更新",
    updateDownloaded: "更新完成，请重新启动已完成更新"
  };

  autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow({
      status: 1,
      msg: message.checking
    });
  });
  autoUpdater.on("update-available", info => {
    console.log(info);
    sendStatusToWindow({
      status: 2,
      msg: message.updateAva
    });
  });
  autoUpdater.on("update-not-available", info => {
    sendStatusToWindow({
      status: 3,
      msg: message.updateNotAva
    });
  });
  autoUpdater.on("download-progress", progressObj => {
    let log_message = parseInt(progressObj.percent) + "%";
    sendStatusToWindow({
      status: 4,
      msg: "下载中，已下载" + log_message,
      obj: progressObj
    });
  });
  autoUpdater.on("error", err => {
    sendStatusToWindow({
      status: 0,
      msg: message.error + err
    });
  });
  autoUpdater.on("update-downloaded", info => {
    let version = info
    console.log(version)
    sendStatusToWindow({
      status: 5,
      msg: message.updateDownloaded,
      obj: info
    });
  });
}
//-------------------------------------------------------------------
//监控状态;
//-------------------------------------------------------------------
app.on("ready", function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  // updateWithAuto();
  mainWindow = createDefaultWindow();

  const page = mainWindow.webContents;
  page.on("dom-ready", () => {
    updateWIthHandle();

    console.log("页面加载完成");
  });
});
app.on("window-all-closed", () => {
  app.quit();
});

app.on("before-quit", () => {
  appQuit();
});

function appQuit() {
  dialog.showMessageBox(
    win,
    {
      title: "确定要退出?",
      message: "您所做过的更改可能无法保存哦!",
      type: "question",
      buttons: ["离开", "保留"]
    },
    response => {
      if (response === 0) {
        app.quit();
      }
    }
  );
}
