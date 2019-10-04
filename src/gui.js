// each newly added response element will register under respecitve keyup event's code property
let responsesInputMap = {};
// keep track of what keys were pressed and released
let pressedKeys = {};

const orderedResponsesCodeNamePairs = [
    ["Digit1", "1"],
    ["Digit2", "2"],
    ["Digit3", "3"],
    ["Digit4", "4"],
    ["Digit5", "5"],
    ["Digit6", "6"],
    ["Digit7", "7"],
    ["Digit8", "8"],
    ["Digit9", "9"],
    ["KeyA", "a"],
    ["KeyS", "s"],
    ["KeyD", "d"],
    ["KeyF", "f"],
    ["KeyG", "g"],
    ["KeyH", "h"],
    ["KeyJ", "j"],
    ["KeyK", "k"],
    ["KeyL", "l"],
];

function renderText(str) {
    const textContainer = document.getElementById('textContainer');
    // setting innerText inserts <br> elements automatically on every new line
    textContainer.innerText = str;
}

// arguments passed to click callback: response html element, response text, key up event code
function addResponse(text, click, inputCodeNamePair = [undefined, undefined], cssClasses = []) {
    const responsesContainer = document.getElementById('responsesContainer');
    const respEl = document.createElement('p');
    respEl.innerText = inputCodeNamePair[1] + ': ' + text;
    respEl.className = 'response' + ' ' + cssClasses.join(' ');
    const callback = () => {
        click(respEl, text, inputCodeNamePair[0]);
    };
    respEl.onclick = callback;
    responsesInputMap[inputCodeNamePair[0]] = respEl;
    responsesContainer.appendChild(respEl);
}

function clearResponses() {
    const responsesContainer = document.getElementById('responsesContainer');
    // re-initialize input map
    responsesInputMap = {};
    pressedKeys = {};
    // todo: delete all children of responses container
    [...responsesContainer.children].forEach((el) => {
        el.remove();
    });
}

function toggleClass(el, className) {
    const classNamePrefixed = ' ' + className;
    if (el.className.indexOf(classNamePrefixed) !== -1) {
        el.className = el.className.replace(classNamePrefixed, '');
    } else {
        el.className += classNamePrefixed;
    }
}

// set up the input
document.addEventListener('keydown', (e) => {
    // prevent keydown from firing multiple times when held
    const respEl = responsesInputMap[e.code];
    if (!respEl || (pressedKeys[e.code] && pressedKeys[e.code] === true)) return;
    pressedKeys[e.code] = true;
    respEl.className += (' ' + 'keyPressed');
});

document.addEventListener('keyup', (e) => {
    // allow keydown to be fired again
    pressedKeys[e.code] = false;
    const respEl = responsesInputMap[e.code];
    if (!respEl) return;
    respEl.className = respEl.className.replace(' ' + 'keyPressed', '');
    if (respEl.onclick) respEl.onclick.call();
});

exports.renderText = renderText;
exports.addResponse = addResponse;
exports.clearResponses = clearResponses;
exports.toggleClass = toggleClass;
exports.orderedResponsesCodeNamePairs = orderedResponsesCodeNamePairs;
