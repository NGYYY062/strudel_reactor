import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from '../tunes';
import console_monkey_patch, { getD3Data } from '../console-monkey-patch';

import { Proc } from "../utils/ProcessUtlis";
import ControlPanel from "./ControlPanel";
import MIDIControl from "./MIDIControl";

export let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

function StrudelEditor() {

    const hasRun = useRef(false);

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });

            document.getElementById('proc').value = stranger_tune
            // SetupButtons()
            Proc()
        }

    }, []);

    const onPlay = () => globalEditor.evaluate();
    const onStop = () => globalEditor.stop();
    const onProc = () => Proc();
    const onProcAndPlay = () => {
        if (globalEditor != null) {
            Proc()
            globalEditor.evaluate()
        }
    };


    return (
        <div>
            <main>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Text to preprocess:</label>
                            <textarea className="form-control" rows="15" id="proc" ></textarea>
                        </div>

                        <ControlPanel
                            onPlay={onPlay}
                            onStop={onStop}
                            onProc={onProc}
                            onProcAndPlay={onProcAndPlay}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            <div id="output" />
                        </div>
                        <MIDIControl />
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );



}

export default StrudelEditor;