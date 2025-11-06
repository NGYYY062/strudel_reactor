import { globalEditor } from '../components/StrudelEditor';

export function Proc() {

    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    // ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
}

export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started === true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

export function ReadTuneFromFile() {

}

export function SaveTune() {
    let proc_text = document.getElementById('proc').value;

}

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
