const {
    remote,
    ipcRenderer,
} = require('electron');
const {
    addResponse,
} = require('./gui.js');

document.addEventListener('DOMContentLoaded', () => {
    const careInterval = remote.getGlobal('CARE_INTERVAL');
    const lastTimeout = remote.getGlobal('lastTimeout');
    const textContainer = document.getElementById('textContainer');
    textContainer.innerHTML = `hi there beautiful human [*ﾟ ‿ ﾟ*]<br>see you in <span id="careIntervalEl"></span> minutes`;
    document.getElementById('careIntervalEl').innerHTML = parseMsToMinutes(lastTimeout ? careInterval - (Date.now() - lastTimeout) : careInterval);

    addResponse(
        "see ya soon",
        (respEl, text, inputCode) => {
            ipcRenderer.send('closeWindowOfCare');
        },
        ['Enter', 'enter']
    );
});

function parseMsToMinutes(msStr) {
    return Math.round(Number(msStr) / 1000 / 60);
}
