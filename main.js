const path = require('path');
const {
  app,
  dialog,
  Notification,
  BrowserWindow
} = require('electron');

let notification = null;
let win = null;

const iconPath = path.join(app.getAppPath(), 'icons/circle-icons-heart.png');

app.on('ready', () => {
  // console.log('💜💜💜');
  // notification = new Notification({
  //   title: 'hi there lovely human person ♡[๑ಡ ᴗ ಡ๑]♡',
  //   subtitle: 'please take a moment to breath in and out 🌱',
  //   body: "are you feeling alright? 💜"
  // });
  // notification.show();

  // setInterval(showWindowOfCare, 5000);
  showWindowOfCare();
});

function showWindowOfCare() {
  app.focus();
  if (win) return; // show it if it's hidden for some reason
  const { screen } = require('electron');
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  const winWidth = Math.floor(screenWidth * 0.5);
  const winHeight = Math.floor(screenHeight * 0.3);
  console.log(`screenWidth: ${screenWidth}\nscreenHeight: ${screenHeight}\nwinWidth: ${winWidth}\nwinHeight: ${winHeight}`);
  win = new BrowserWindow({
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
  win.loadFile('src/index.html');
}
