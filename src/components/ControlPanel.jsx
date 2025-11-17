import { useEffect, useState } from 'react';
import { webaudioOutput } from '@strudel/webaudio';
import { globalEditor } from './StrudelEditor';
import { DownloadTune, SaveTune } from '../utils/ProcessUtlis';

import PlayBtnImg from '../assets/images/play-button.png';
import PreprocessBtnImg from '../assets/images/replay.png';
import StopBtnImg from '../assets/images/pause.png';
import DownloadBtnImg from '../assets/images/downloads.png';
import UploadBtnImg from '../assets/images/upload.png';
import { upload } from '@testing-library/user-event/dist/upload';

function ControlPanel({ onPlay, onStop, onProc, onProcAndPlay, state, setState }) {


    // useEffect(() => {
    //     const volumeRange = document.getElementById('volumeRange');
    //     if (volumeRange) {
    //         volumeRange.addEventListener('input', (e) => {
    //             setVolume(e.target.value);
    //         });
    //     }
    // }, []);

    // useEffect(() => {
    //     const volumeValue = volume / 100;
    //     // if (globalEditor?.defaultOutput?.gain?.gain) {
    //     //     globalEditor.defaultOutput.gain.gain.value = -100;
    //     //     console.log(globalEditor.defaultOutput.gain.gain.value);
    //     // }
    //     try {
    //         const mediaVolume = volumeValue;
    //         const els = document.querySelectorAll('audio, video');
    //         els.forEach(el => {
    //             try {
    //                 el.volume = mediaVolume;

    //                 if (el.muted) el.muted = false;
    //             } catch (e) {
    //                 console.log(e);
    //             }
    //         });
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }, [volume])

    // console.log("Control ready");
    // console.log(volume);
    // console.log(webaudioOutput, webaudioOutput?.gain, webaudioOutput?.gain?.gain);

    return (
        <>
            <div className="col-md-4 flex">
                {/* <div className="row">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="tunesMenu" data-bs-toggle="dropdown" aria-expanded="false">Select Tunes</button>
                        <ul className="dropdown-menu" aria-labelledby="tunesMenu" id="tunesDropdown">
                            <li><a className="dropdown-item" href="#">Song1</a></li>
                        </ul>
                    </div>
                </div> */}
                <div className='row flex'>
                    <div className='col-md-4 d-flex justify-content-center'>

                        <button id="process" className="btn btn-outline-primary" onClick={onProc} style={{ width: 'clamp(100px, 30vw, 160px)', height: 'clamp(100px, 30vw, 160px)' }}>
                            <img src={PreprocessBtnImg} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
                        </button>
                    </div>
                    <div className='col-md-4 d-flex justify-content-center'>

                        <button id="play" className="btn btn-outline-primary"
                            onClick={() => {
                                setState("play");
                                onPlay();
                                console.log(`Play button pressed.\nState: ${state}`);
                            }}
                            style={{ width: 'clamp(100px, 30vw, 160px)', height: 'clamp(100px, 30vw, 160px)' }}
                        >
                            <img src={PlayBtnImg} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
                        </button>

                    </div>
                    <div className='col-md-4 d-flex justify-content-center'>
                        <button id="stop" className="btn btn-outline-danger"
                            onClick={() => {
                                setState("stop");
                                onStop();
                                console.log(`Stop button pressed.\n State: ${state}`);
                            }}
                            style={{ width: 'clamp(100px, 30vw, 160px)', height: 'clamp(100px, 30vw, 160px)' }}
                        >
                            <img src={StopBtnImg} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
                        </button>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-6 d-flex justify-content-center'>
                        <button id="upload" className='btn btn-outline-warning' style={{ width: 'clamp(100px, 30vw, 160px)', height: 'clamp(100px, 30vw, 160px)' }}>
                            <img src={UploadBtnImg} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
                        </button>
                    </div>
                    <div className='col-md-6 d-flex justify-content-center' >
                        <button id="download" className="btn btn-outline-success" onClick={DownloadTune} style={{ width: 'clamp(100px, 30vw, 160px)', height: 'clamp(100px, 30vw, 160px)' }}>
                            <img src={DownloadBtnImg} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }} />
                        </button>
                    </div>
                </div>



            </div>
        </>
    )
}

export default ControlPanel;