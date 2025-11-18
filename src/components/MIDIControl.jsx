
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

    const exportSettingsAsJson = () => {
        const settings = {
            tagDict: tagDict,
            tagRanges: tagRanges,
            volume: volume
        };

        const dataString = JSON.stringify(settings, null, 2);
        const blob = new Blob([dataString], { type: 'appliction/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'strudel-reactor-settings.json';
        link.click();

        URL.revokeObjectURL(url);
    }

    const importSettingsAsJson = (ev) => {
        const file = ev.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);

                if (settings.tagDict) {
                    Object.keys(settings.tagDict).forEach(tag => {
                        updateTagDict(tag, settings.tagDict[tag]);
                    });
                }

                if (settings.tagRanges) {
                    setTagRanges(settings.tagRanges);
                }

                if (settings.volume !== undefined) {
                    setVolume(settings.volume);
                }

                alert("Settings import success");
            } catch (e) {
                alert("Import settings error: " + e.message);
            }
        };
        reader.readAsText(file);

        ev.target.value = "";
    }

    return (
        <>
            < div className="col-md-4" >
                <div className='row mb-3'>
                    <div className='d-flex gap-2'>
                        <button className='btn btn-primary btn-sm flex-fill' onClick={exportSettingsAsJson}>
                            Export Tuning
                        </button>
                        <label className='btn btn-danger btn-sm flex-fill' htmlFor='import-settings'>
                            Import Tuning
                        </label>
                        <input type="file" id='import-settings' accept='.json' style={{ display: 'none' }} onChange={importSettingsAsJson} />
                    </div>
                </div>
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
                                    <label htmlFor={`max-${tag}`} className='form-label small'>Max</label>
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
            </div>
        </>
    )
}

export default MIDIControl;