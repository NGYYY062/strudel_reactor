import { useEffect, useState, useRef } from 'react';
import { webaudioOutput } from '@strudel/webaudio';
import { globalEditor } from './StrudelEditor';
import { DownloadTune, convertToPlain } from '../utils/ProcessUtlis';

import PlayBtnImg from '../assets/images/play-button.png';
import PreprocessBtnImg from '../assets/images/replay.png';
import StopBtnImg from '../assets/images/pause.png';
import DownloadBtnImg from '../assets/images/downloads.png';
import UploadBtnImg from '../assets/images/upload.png';
import { upload } from '@testing-library/user-event/dist/upload';

function ControlPanel({ onPlay, onStop, onProc, onProcAndPlay, state, setState, setSongText }) {


    const fileInputRef = useRef(null);

    // trigger file input reference on upload button click
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]; // select first file
        if (!file) return;

        const reader = new FileReader();

        // onload set song text
        reader.onload = (ev) => {
            let code = ev.target?.result;


            if (file.name.endsWith('.rtf')) {
                code = convertToPlain(code);
            }

            setSongText(code);

        }

        reader.onerror = () => alert('Error reading selected file');
        reader.readAsText(file);
        console.log("File uploaded")
    }


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
                        <input ref={fileInputRef} type="file" accept='.txt,.rtf' style={{ display: 'none' }} onChange={handleFileUpload} />
                        <button id="upload" className='btn btn-outline-warning' style={{ width: 'clamp(100px, 30vw, 160px)', height: 'clamp(100px, 30vw, 160px)' }} onClick={handleUploadClick}>
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