
import { val } from '@strudel/core';
import { useEffect, useState } from 'react';

function MIDIControl({ volume, setVolume, tagDict, updateTagDict }) {
    // tempVolume variable for volume display
    const [tempVolume, setTempVolume] = useState(volume);

    const [tempTagValues, setTempTagValues] = useState({});

    const [tagRanges, setTagRanges] = useState({});

    useEffect(() => {
        setTempVolume(volume);
    }, [volume]);

    // update tag ranges dict on change of tag dict
    useEffect(() => {
        setTempTagValues({ ...tagDict });

        const newRanges = {};
        Object.keys(tagDict).forEach(tag => {
            if (tagRanges[tag]) {
                newRanges[tag] = tagRanges[tag];
            } else {
                newRanges[tag] = { min: 0, max: 100 };
            }
        });
        setTagRanges(newRanges);
    }, [tagDict])

    // Update max or min of the tag
    const updateRange = (tag, field, value) => {
        setTagRanges(prev => ({
            ...prev, [tag]: { ...prev[tag], [field]: parseFloat(value) || 0 }
        }));
    };

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
                {/* create new sliders here */}
                {Object.keys(tagDict).map((tag) => {
                    const range = tagRanges[tag] || { min: 0, max: 100 };
                    const tagVal = tempTagValues[tag] !== undefined ? tempTagValues[tag] : tagDict[tag];



                    return (
                        <div className='row' key={tag}>
                            <label htmlFor={`slider-${tag}`}>
                                {tag}: {tagVal}
                            </label>
                            <div className='d-flex gap-2 mb-2'>
                                <div className='flex-fill'>
                                    <label htmlFor={`min-${tag}`} className='form-label small'>Min</label>
                                    <input type="number" className="form-control form-control-sm" id={`min-${tag}`} value={range.min}
                                        onChange={(e) => updateRange(tag, 'min', e.target.value)}
                                    />
                                </div>
                                <div className='flex-fill'>
                                    <input type='number' className='form-control form-control-sm' id={`max-${tag}`} value={range.max}
                                        onChange={(e) => updateRange(tag, 'max', e.target.value)}
                                    />
                                </div>
                            </div>
                            <input type="range" className='form-range' id={`slider-${tag}`} min={range.min} max={range.max} step="0.01" value={tagVal}
                                onChange={(e) => {
                                    setTempTagValues(prev => ({
                                        ...prev, [tag]: e.target.value
                                    }));
                                }}
                                onMouseUp={(e) => {
                                    updateTagDict(tag, tempTagValues[tag]);
                                }}
                            />
                        </div>
                    )
                })
                }
                {/* <div className="form-check">
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
                </div> */}
            </div>
        </>
    )
}

export default MIDIControl;