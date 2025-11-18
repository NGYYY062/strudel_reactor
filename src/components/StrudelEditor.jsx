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
import { GetAllTags, UpdateCurrentTags } from "../utils/StrudelSetup";
import ControlPanel from "./ControlPanel";
import MIDIControl from "./MIDIControl";
import PreprocessTextarea from "./PreprocessTextarea";
import D3NoteVisual from "./D3NoteVisualizer";

export let globalEditor = null;
export let masterAudioGain;

const handleD3Data = (event) => {
    const latestEvent = event.detail.at(-1);
    console.log(latestEvent);

};

function StrudelEditor() {

    const hasRun = useRef(false);

    const [volume, setVolume] = useState(1);
    // const [cpm, setCpm] = useState(35);
    const [songText, setSongText] = useState(tune);
    const [state, setState] = useState("stop");
    const [tagDict, setTagDict] = useState({});

    // Function to update Tag Dictionary value by key
    const updateTagDict = (key, value) => {
        setTagDict(prevTagDict => ({
            ...prevTagDict,
            [key]: value,
        }));
    };

    // Function to remove an entry from Tag Dictionary
    const removeTagDict = (key) => {
        setTagDict(prevTagDict => {
            const newDict = { ...prevTagDict };
            delete newDict[key];
            return newDict;
        });
    }


    // Play button logic
    const onPlay = () => {
        let outputText = Preprocess({ inputText: songText, volume: volume, tagDict: tagDict });
        globalEditor.setCode(outputText);
        globalEditor.evaluate();
    };

    // stop button logic
    const onStop = () => {
        if (globalEditor != null) {
            globalEditor.stop();
        }
    };

    // Preprocess button logic
    const onProc = () => {
        const tempDict = UpdateCurrentTags({ inputText: songText, tagDict: tagDict });
        setTagDict(tempDict);
        let outputText = Preprocess({ inputText: songText, volume: volume, tagDict: tempDict });
        globalEditor.setCode(outputText);
        console.log("From onProc:")
        console.log(tempDict);
    };

    // TODO: Modify
    const onProcAndPlay = () => {
        if (globalEditor != null) {
            // Proc(volume, cpm)
            globalEditor.evaluate()
        }
    };


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


            const tags = GetAllTags({ inputText: songText });
            let tempTagDict = {};
            tags.forEach(tag => {
                // console.log(typeof (tag));
                tempTagDict[tag] = 0;
                // set default to 0
            });
            setTagDict(tempTagDict);
            console.log("logging tag dict");
            console.log(tempTagDict);

            document.getElementById('proc').value = tune
            // SetupButtons()
            let outputText = Preprocess({ inputText: songText, volume: volume, tagDict: tempTagDict });
            globalEditor.setCode(outputText);

        }

    }, []);

    useEffect(() => {
        if (state === "play") {
            onPlay()
        }
        console.log(`Volume changed to ${volume}`);
    }, [volume]);

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
                                {/* update sontText on Change */}
                            </div>

                            <ControlPanel
                                onPlay={onPlay}
                                onStop={onStop}
                                onProc={onProc}
                                onProcAndPlay={onProcAndPlay}
                                state={state}
                                setState={setState}
                                onVolumeChange={(e) => setVolume(e.target.value)}
                                setSongText={setSongText}
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
                                tagDict={tagDict}
                                updateTagDict={updateTagDict}
                            />
                        </div>
                    </div>
                    <canvas id="roll"></canvas>
                    <D3NoteVisual />
                </main >
            </div >
        </>
    );



}

export default StrudelEditor;