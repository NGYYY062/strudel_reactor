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

import { Proc, Preprocess } from "../utils/ProcessUtlis";
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

    const [volume, setVolume] = useState(1);
    // const [cpm, setCpm] = useState(35);
    const [songText, setSongText] = useState(tune);
    const [state, setState] = useState("stop");


    const onPlay = () => {
        let outputText = Preprocess({ inputText: songText, volume: volume });
        globalEditor.setCode(outputText);
        globalEditor.evaluate();
    };

    const onStop = () => {
        if (globalEditor != null) {
            globalEditor.stop();
        }
    };
    const onProc = () => {
        let outputText = Preprocess({ inputText: songText, volume: volume });
        globalEditor.setCode(outputText);
    };

    const onProcAndPlay = () => {
        if (globalEditor != null) {
            // Proc(volume, cpm)
            globalEditor.evaluate()
        }
    };

    useEffect(() => {
        if (state === "play") {
            onPlay()
        }
        console.log(`Volume changed to ${volume}`);
    }, [volume]);

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
                    initAudioOnFirstClick();
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
            let outputText = Preprocess({ inputText: songText, volume: volume });
            globalEditor.setCode(outputText);
        }

    }, []);

    return (
        <>
            <div>
                <main>

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-8" style={{ maxHeight: '49 vh', overflowY: 'auto' }}>
                                <PreprocessTextarea defaultValue={songText}
                                    onChange={(e) => setSongText(e.target.value)}
                                />
                            </div>

                            <ControlPanel
                                onPlay={onPlay}
                                onStop={onStop}
                                onProc={onProc}
                                onProcAndPlay={onProcAndPlay}
                                state={state}
                                setState={setState}
                                onVolumeChange={(e) => setVolume(e.target.value)}
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