import { globalEditor } from '../components/StrudelEditor';
// import fs from 'fs';

export function Proc(volumeNum) {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    proc_text_replaced = proc_text_replaced.replaceAll('<volume_val>', volumeNum);
    globalEditor.setCode(proc_text_replaced)
}



export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

export function ProcAndPlay(volumeNum) {
    if (globalEditor != null && globalEditor.repl.state.started === true) {
        console.log(globalEditor)
        Proc(volumeNum)
        globalEditor.evaluate();
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
