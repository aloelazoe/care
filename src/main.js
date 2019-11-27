const path = require('path');
const fse = require('fs-extra');
const {
  app,
  dialog,
  Notification,
  BrowserWindow,
  ipcMain,
  shell,
  Menu,
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
      MEDITATION_TIME: 3000,
      SLEEP_TIME: '00:30-10:00',
    }, { spaces: 2 });
  }

  const prefs = fse.readJsonSync(prefsPath, { throws: false }) || {};
  global = Object.assign(global, prefs);

  global.lastTimeout = null;

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Settings',
      submenu: [
        {
          label: 'config file',
          type: 'normal',
          click: () => {shell.openItem(prefsPath);},
        },
        {
          label: 'log',
          type: 'normal',
          click: () => {shell.openItem(logPath);},
        },
      ],
    },
    { role: 'editMenu' },
    ]));

  // takes a path to js preload file (relative to the app folder path)
  function showWindowOfCare(preloadPath) {
    app.focus();
    if (win) return; // just show the existing window it if it's hidden for some reason
    const { screen } = require('electron');
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    // mb still use winWidth and widthHeight which is relative to the screen. but that would make more sense if font size and all elements are adjustabel too
    // const winWidth = Math.floor(screenWidth * 0.5);
    // const winHeight = Math.floor(screenHeight * 0.3);
    const winWidth = 720;
    const winHeight = 720;
    log(`screenWidth: ${screenWidth}\nscreenHeight: ${screenHeight}\nwinWidth: ${winWidth}\nwinHeight: ${winHeight}`);
    win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(app.getAppPath(), preloadPath),
      },
      show: true,
      alwaysOnTop: app.isPackaged,
      frame: !app.isPackaged,
      resizable: !app.isPackaged,
      movable: true,
      width: winWidth,
      height: winHeight,
      x: Math.floor(screenWidth * 0.5 - (winWidth * 0.5)),
      y: Math.floor(screenHeight * 0.5 - (winHeight * 0.5)),
    });
    win.loadFile(path.join(app.getAppPath(), 'src/index.html'));

    win.on('close', () => {
      win = null;
      log('win.on close event');
      // todo: make sure the i'm not setting several timeouts to show new windows at the same time
      if (!careWindowTimeout) {
        global.lastTimeout = Date.now();
        careWindowTimeout = setTimeout(() => {
          careWindowTimeout = null;
          showWindowOfCare('src/screen-reminder.js');
        }, global.CARE_INTERVAL);
        log('set new timeout');
      } else {
        log('timeout was already set before');
      }
    });
  }

  function launch() {
    // shell.openItem(prefsPath);
    // shell.openItem(logPath);
    showWindowOfCare('src/screen-setup.js');
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
