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
    //  VERY IMPORTANT: PROTECT SLEEP
    // if time is between 2h30m and 10h am
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    if (((h === 2 && m > 30) || h > 2) && h < 10) {
        // TODO: make font size bigger
        const importantMessage = "please\nthis is very important\ngo to sleep now\ndon't mess up your sleep schedule\nif you mess it up\nit will take days and days of painful insomnia\nuntil you will be able to fix it again\nplease take care of yourself\nyou deserve care and love\nplase take care of your body\ngo to sleep";
        renderText(importantMessage);
        return;
    }

    // show text
    renderText("hi there my lovely person ✨\nplease take a moment to breath in and out 🌱\nare you feeling alright? 💜");

    // show the first set of responses
    [
        "i'm diong something which is in my plan",
        "i'm doing something which is not in my plan",
        "i'm doing something which is not in my plan but is kinda useful",
        "i was going to do something which is on my plan but got distracted",
        "i'm kinda distracted",
        "i'm doing some necessary tedious stuff",
        "i'm struggling with insomnia",
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
            "i'm hyperfocused",
            "i'm feeling alright",
            "i'm hungry",
            "i'm thirsty",
            "i'm tired",
            "i'm sad",
            // 'i feel dysphoric',
            'i feel frustrated',
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
