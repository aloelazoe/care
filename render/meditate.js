const {
  ipcRenderer,
  remote
} = require('electron');

function main () {
  window.setTimeout(() => {
    const closeButton = document.createElement("button");
    // closeButton.value = "i'm a closeButton";
    // closeButton.type = "button";
    closeButton.innerHTML = "1. hiya! i took a moment to think about how i'm feeling and how things are going 🌱✨🌈";
    closeButton.onclick = () => {
      ipcRenderer.send('closeWindowOfCare');
    };
    document.body.appendChild(closeButton);
  }, remote.getGlobal('MEDITATION_TIME'))
}

document.addEventListener('DOMContentLoaded', main);
