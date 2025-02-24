const {
    ipcRenderer,
    remote,
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
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    // convert time to minutes
    let curTime = m + h * 60;
    // SLEEP_TIME should be in a format 'hh:mm-hh:mm'
    const sleepTime = remote.getGlobal('SLEEP_TIME')
        .split(/\D/)
        .map(Number)
        .reduce((acc, cur, idx) => {
            // convert time to minutes
            if (idx % 2 === 0) {
                acc[idx/2] = cur * 60;
            } else {
                acc[(idx-1)/2] = acc[(idx-1)/2] + cur;
            }
            return acc;
        }, []);
    // adjust for day boundary
    if (sleepTime[0] > sleepTime[1]) {
        sleepTime[1] = sleepTime[1] + 24 * 60;
        if (curTime < sleepTime[0]) curTime += 24 * 60;
    }
    
    if (curTime > sleepTime[0] && curTime < sleepTime[1]) {
        // TODO: make font size bigger
        let i = 1
        const importantMessageLines = [
            "please",
            "this is very important",
            "go to sleep now",
            "don't mess up your sleep schedule",
            "if you mess it up",
            "it will take days and days of painful insomnia",
            "until you will be able to fix it again",
            "please take care of yourself",
            "you deserve care and love",
            "plase take care of your body",
            "go to sleep"
        ];
        document.getElementById('textContainer').innerText += importantMessageLines[0]
        document.addEventListener('keyup', function(e) {
            if (i >= importantMessageLines.length) return;
            document.getElementById('textContainer').innerText += '\n' + importantMessageLines[i]
            if (++i >= importantMessageLines.length) {
                // what do we do when all lines are printed
                window.setTimeout(() => {
                    addResponse(
                        "\nhiya! i took a moment to think about how i'm feeling\nand how things are going 🌱✨🌈",
                        (respEl, text, inputCode) => {
                            ipcRenderer.send('closeWindowOfCare');
                        },
                        ['Enter', 'enter']
                    );
                }, remote.getGlobal('MEDITATION_TIME'))
                return;
            }
        });
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
