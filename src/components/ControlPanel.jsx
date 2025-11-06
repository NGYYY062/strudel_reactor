import { useEffect, useState } from 'react';
import { webaudioOutput } from '@strudel/webaudio';
import { globalEditor } from './StrudelEditor';
import { DownloadTune } from '../utils/ProcessUtlis';

function ControlPanel({ onPlay, onStop, onProc, onProcAndPlay }) {
    const [volume, setVolume] = useState(100); // Initialize volume state

    // useEffect(() => {
    //     const volumeRange = document.getElementById('volumeRange');
    //     if (volumeRange) {
    //         volumeRange.addEventListener('input', (e) => {
    //             setVolume(e.target.value);
    //         });
    //     }
    // }, []);

    useEffect(() => {
        const volumeValue = volume / 100;
        // if (globalEditor?.defaultOutput?.gain?.gain) {
        //     globalEditor.defaultOutput.gain.gain.value = -100;
        //     console.log(globalEditor.defaultOutput.gain.gain.value);
        // }
        try {
            const mediaVolume = volumeValue;
            const els = document.querySelectorAll('audio, video');
            els.forEach(el => {
                try {
                    el.volume = mediaVolume;

                    if (el.muted) el.muted = false;
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }, [volume])

    console.log("Control ready");
    // console.log(volume);
    // console.log(webaudioOutput, webaudioOutput?.gain, webaudioOutput?.gain?.gain);

    return (
        <>
            <div className="col-md-4 flex">
                <div className="row">
                    <div className="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="tunesMenu" data-bs-toggle="dropdown" aria-expanded="false">Select Tunes</button>
                        <ul className="dropdown-menu" aria-labelledby="tunesMenu" id="tunesDropdown">
                            <li><a className="dropdown-item" href="#">Song1</a></li>
                        </ul>
                    </div>
                </div>

                <button id="process" className="btn btn-outline-primary" onClick={onProc}>Preprocess</button>
                <button id="process_play" className="btn btn-outline-primary" onClick={onProcAndPlay}>Proc & Play</button>
                <button id="play" className="btn btn-outline-primary" onClick={onPlay}>Play</button>
                <button id="stop" className="btn btn-outline-primary" onClick={onStop}>Stop</button>
                <button id="save" className='btn btn-outline-warning'>Save</button>
                <button id="download" className="btn btn-outline-success" onClick={DownloadCode}>Download</button>

                <div className="row">
                    <label htmlFor="volumeRange">Volume: {volume}</label>
                    <input type="range" className="form-range" id="volumeRange" min="0" max="100" step="1" value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                    />
                </div>

            </div>
        </>
    )
}

export default ControlPanel;