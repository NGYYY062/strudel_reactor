import { globalEditor } from '../components/StrudelEditor';
// import fs from 'fs';

// preprocess logic
export function Preprocess({ inputText, volume }) {
    let outputText = inputText;

    let regex = /[a-zA-Z0-9_]+:\s*\n[\s\S]+?\r?\n(?=[a-zA-Z0-9_]*[:\/])/gm;

    let m;

    let matches = [];

    while ((m = regex.exec(outputText)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            matches.push(match);
        });
    }

    console.log(matches);

    let matches2 = matches.map(match => match.replaceAll(/(?<!post)gain\(([\d.]+)\)/g, (match, captureGroup) => `gain(${captureGroup}*${volume})`));

    let matches3 = matches.reduce((text, original, i) => text.replaceAll(original, matches2[i]), outputText);

    console.log(matches3);

    return matches3;
}

export function convertToPlain(rtf) {
    rtf = rtf
        .replace(/^[\s\S]*?\\pard/, '\\pard')
        .replace(/\\[a-zA-Z]+\d*/g, '')
        .replace(/\\[^a-zA-Z0-9{}]/g, "\n") // replace all the \ at the end of the lines
        .replace(/\\/g, "") // remove all backslashes
        .replace(/\}\s*$/, "")
        .trim();

    return rtf;
}



// TODO: Get rid of Proc - unused
export function Proc(volumeNum, cpm) {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    proc_text_replaced = proc_text_replaced.replaceAll('<volume_val>', volumeNum);
    proc_text_replaced = proc_text_replaced.replaceAll('<cpm_val>', cpm);
    globalEditor.setCode(proc_text_replaced)

}

// TODO: Get rid of ProcessText - unused
export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

// TODO: Modify? 
export function ProcAndPlay(volumeNum, cpm) {
    if (globalEditor != null && globalEditor.repl.state.started === true) {
        console.log(globalEditor)
        Proc(volumeNum, cpm)
        // globalEditor.evaluate();
    }
}

export function ReadTuneFromFile() {

}

// export async function SaveTune() {

//     let proc_text = document.getElementById('proc').value;
//     const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
//     if (!isNode) {

//         DownloadTune();
//         return;
//     }

//     try {

//         const fs = await import('fs');
//         const path = await import('path');
//         const fsp = fs.promises;


//         const dest = path.join(process.cwd(), 'src', 'assets', 'tunes', 'tune1.txt');
//         await fsp.writeFile(dest, proc_text, 'utf8');
//         console.log('Song saved successfully to', dest);
//     } catch (e) {
//         console.error('Error saving tune:', e);
//     }
// }

// TODO: Modify and improve
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

