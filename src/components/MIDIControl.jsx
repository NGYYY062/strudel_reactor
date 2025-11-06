import { ProcAndPlay, Proc } from "../utils/ProcessUtlis";
import { useEffect, useState } from 'react';

function MIDIControl({ volume, setVolume, cpm, setCpm }) {



    return (
        <>
            < div className="col-md-4" >
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={() => ProcAndPlay(volume)} defaultChecked />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        p1: ON
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={() => ProcAndPlay(volume)} />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        p1: HUSH
                    </label>
                </div>


                <div className="input-group mb-3">
                    <span className="input-group-text" id="cpmLabel">setCPM</span>
                    <input type="number" className="form-control" aria-label="" value={cpm} id="cpmInput" min="1" max="999"
                        onChange={(e) => {
                            const newCpm = e.target.value;
                            setCpm(newCpm);
                            Proc(volume, newCpm);
                        }}
                    />
                </div>
                <div className="row">
                    <label htmlFor="volumeRange">Volume: {volume}</label>
                    <input type="range" className="form-range" id="volumeRange" min="0" max="1" step="0.01" value={volume}
                        onChange={(e) => {
                            const newVolume = e.target.value;
                            setVolume(newVolume);
                            Proc(newVolume, cpm);
                        }}
                    />
                </div>

                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="s1" />
                    <label className="form-check-label" htmlFor="s1">s1</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="s2" />
                    <label className="form-check-label" htmlFor="s2">s2</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="s3" />
                    <label className="form-check-label" htmlFor="s3">s3</label>
                </div>
            </div>
        </>
    )
}

export default MIDIControl;