import { val } from '@strudel/core';
import { globalEditor } from '../components/StrudelEditor';
// import fs from 'fs';

// Preprocess logic with gloabl volume slider
export function Preprocess({ inputText, volume, tagDict }) {
    let outputText = inputText;

    let regex = /[a-zA-Z0-9_]+:\s*\n[\s\S]+?\r?\n(?=[a-zA-Z0-9_]*[:\/])/gm;

    let m;

    let matches = [];

    while ((m = regex.exec(outputText)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            console.log(typeof match);
            console.log(`Found match, group ${groupIndex}: ${match}`);
            matches.push(match);
        });
    }

    console.log(typeof matches);
    console.log("Logging Matches.")
    console.log(matches);

    let matches2 = matches.map(match => match.replaceAll(/(?<!post)gain\(([\d.]+)\)/g, (match, captureGroup) => `gain(${captureGroup}*${volume})`));

    let matches3 = matches.reduce((text, original, i) => text.replaceAll(original, matches2[i]), outputText);

    // replace all tags with their value
    for (const [tag, value] of Object.entries(tagDict)) {
        matches3 = matches3.replaceAll(String(tag), String(value));
    }

    console.log(matches3);

    return matches3;
}



// Function to convert rtf to plain text
export function ConvertToPlain(rtf) {
    rtf = rtf
        .replace(/^[\s\S]*?\\pard/, '\\pard')
        .replace(/\\[a-zA-Z]+\d*/g, '')
        .replace(/\\[^a-zA-Z0-9{}]/g, "\n") // replace all the \ at the end of the lines
        .replace(/\\/g, "") // remove all backslashes
        .replace(/\}\s*$/, "")
        .trim();

    return rtf;
}

// Function: Download tunes as txt file
export function DownloadTune() {
    let proc_text = document.getElementById('proc').value;
    let blob = new Blob([proc_text], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let anele = document.createElement("a");

    anele.setAttribute("download", "MyTune");
    anele.href = url;
    anele.click();
    console.log(blob);
}

// Replace tag with value
export function ProcessTags(tag, value) {
    let proc_text = document.getElementById('proc').value;
    let proc_text_replaced = proc_text.replaceAll(tag, value);
    globalEditor.setCode(proc_text_replaced);
}



