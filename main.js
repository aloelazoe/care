const path = require('path');
const fse = require('fs-extra');
const {
  app,
  dialog,
  Notification,
  BrowserWindow,
  ipcMain,
  shell
} = require('electron');

function init() {
  let win = null;
  let careWindowTimeout = null;

  const iconPath = path.join(app.getAppPath(), 'icons/circle-icons-heart.png');
  let userDataPath = app.getPath('userData');
  if (!app.isPackaged) userDataPath = path.join(userDataPath, 'dev');
  const logPath = path.join(userDataPath, 'log.txt');
  fse.outputFileSync(logPath, '');
  const prefsPath = path.join(userDataPath, 'preferences.json');
  if (!fse.pathExistsSync(prefsPath)) {
    fse.outputJsonSync(prefsPath, {
      CARE_INTERVAL: 1800000, // todo: set in minutes instead. note: 30 minutes = 1 800 000 ms
      MEDITATION_TIME: 3000
    }, { spaces: 2 });
  }

  const prefs = fse.readJsonSync(prefsPath, { throws: false }) || {};
  global = Object.assign(global, prefs);

  global.lastTimeout = null;

  // takes a path to hmtl file to load (relative to the app folder path)
  function showWindowOfCare(htmlPath) {
    app.focus();
    if (win) return; // show it if it's hidden for some reason
    const { screen } = require('electron');
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    const winWidth = Math.floor(screenWidth * 0.5);
    const winHeight = Math.floor(screenHeight * 0.3);
    log(`screenWidth: ${screenWidth}\nscreenHeight: ${screenHeight}\nwinWidth: ${winWidth}\nwinHeight: ${winHeight}`);
    win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true
      },
      show: true,
      alwaysOnTop: true,
      frame: false,
      resizable: false,
      movable: true,
      width: winWidth,
      height: winHeight,
      x: Math.floor(screenWidth * 0.5 - (winWidth * 0.5)),
      y: Math.floor(screenHeight * 0.3 - (winHeight * 0.5)),
    });
    win.loadFile(path.join(app.getAppPath(), htmlPath));

    win.on('close', () => {
      win = null;
      log('win.on close event');
      // todo: make sure the i'm not setting several timeouts to show new windows at the same time
      if (!careWindowTimeout) {
        global.lastTimeout = Date.now();
        careWindowTimeout = setTimeout(() => {
          careWindowTimeout = null;
          showWindowOfCare('render/reminder.html');
        }, global.CARE_INTERVAL);
        log('set new timeout');
      } else {
        log('timeout was already set before');
      }
    });
  }

  function launch() {
    shell.openItem(prefsPath);
    shell.openItem(logPath);
    showWindowOfCare('render/setup.html');
    // todo: show setup window that i'm going to show on the fresh startup or when a new day starts
  }

  app.on('ready', launch);

  app.on('activate', launch);

  app.on('window-all-closed', (e) => {
    e.preventDefault();
  });

  ipcMain.on('closeWindowOfCare', (e) => {
    if (win) win.close();
  });

  function log(msg) {
    fse.appendFileSync(logPath, msg + '\n');
  }
}

init();
