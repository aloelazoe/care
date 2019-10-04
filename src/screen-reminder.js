const {
    ipcRenderer,
} = require('electron');
const {
    renderText,
    addResponse,
    clearResponses,
    toggleClass,
    orderedResponsesCodeNamePairs,
} = require('./gui.js');

document.addEventListener('DOMContentLoaded', () => {
    // show text
    renderText("hi there my lovely person ✨\nplease take a moment to breath in and out 🌱\nare you feeling alright? 💜");

    // show the first set of responses
    [
        "i'm hyperfocused on something which is in my plan",
        "i'm hyperfocued on something which is not in my plan",
        "i feel balanced and i'm focused on something which is in my plan",
        "i'm kinda distracted",
        "i'm doing some necessary tedious stuff",
        "i'm having a break",
        "i'm chatting with friends",
    ].forEach((action, i) => {
        addResponse(action, (respEl, text, inputCode) => {
            // todo: journal writing logic
            // show the second set of responses
            clearResponses();
            showSecondSetOfResponses();
        }, orderedResponsesCodeNamePairs[i])
    });

    function showSecondSetOfResponses() {
        [
            "i'm feeling alright",
            "i'm hungry",
            "i'm thirsty",
            "i'm tired",
            "i'm sad",
            "i'm feeling foggy",
            "i'm strained",
            "i'm horny",
            "i'm anxious",
        ].forEach((checkable, i) => {
            addResponse(checkable, (respEl, text, inputCode) => {
                toggleClass(respEl, 'checked');
                // todo: journal writing logic
            }, orderedResponsesCodeNamePairs[i])
        });

        addResponse(
            "\nhiya! i took a moment to think about how i'm feeling\nand how things are going 🌱✨🌈",
            (respEl, text, inputCode) => {
                ipcRenderer.send('closeWindowOfCare');
            },
            ['Enter', 'enter']
        );
    }
});
