
import { useEffect, useState } from 'react';

function MIDIControl({ volume, setVolume, onVolumeChange }) {
    const [tempVolume, setTempVolume] = useState(volume);

    useEffect(() => {
        setTempVolume(volume);
    }, [volume]);

    return (
        <>
            < div className="col-md-4" >
                {/* <div className="form-check">
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
                </div> */}


                <div className="row">
                    <label htmlFor="volumeRange">Volume: {tempVolume}</label>
                    <input type="range" className="form-range" id="volumeRange" min="0" max="1" step="0.01" value={tempVolume}
                        onChange={(e) => {
                            setTempVolume(e.target.value);
                        }}
                        onMouseUp={(e) => {
                            const v = tempVolume;
                            setVolume(v);


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