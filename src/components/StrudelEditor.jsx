import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { tune } from '../tunes';
import console_monkey_patch, { getD3Data } from '../console-monkey-patch';

import { Proc } from "../utils/ProcessUtlis";
import ControlPanel from "./ControlPanel";
import MIDIControl from "./MIDIControl";
import PreprocessTextarea from "./PreprocessTextarea";

export let globalEditor = null;
export let masterAudioGain;

const handleD3Data = (event) => {
    console.log(event.detail);
};

function StrudelEditor() {

    const hasRun = useRef(false);

    const [volume, setVolume] = useState(0.5);
    const [songText, setSongText] = useState(tune);

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


            document.getElementById('proc').value = tune
            // SetupButtons()
            Proc(volume)
        }

    }, []);

    // useEffect(() => {
    //     globalEditor.setCode(songText)

    // }, [songText])

    const onPlay = () => {
        if (globalEditor != null) {
            globalEditor.evaluate();
        }
    };
    const onStop = () => {
        if (globalEditor != null) {
            globalEditor.stop();
        }
    };
    const onProc = () => Proc(volume);
    const onProcAndPlay = () => {
        if (globalEditor != null) {
            Proc(volume)
            globalEditor.evaluate()
        }
    };

    console.log("ready");

    return (
        <>
            <div>
                <main>

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                <PreprocessTextarea defaultValue={songText}
                                    onChange={(e) => setSongText(e.target.value)}
                                />
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
                            <MIDIControl
                                volume={volume}
                                setVolume={setVolume}
                            />
                        </div>
                    </div>
                    <canvas id="roll"></canvas>
                </main >
            </div >
        </>
    );



}

export default StrudelEditor;