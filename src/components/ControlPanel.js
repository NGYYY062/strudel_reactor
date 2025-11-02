function ControlPanel({ onPlay, onStop, onProc, onProcAndPlay }) {
    return (
        <div className="col-md-4 flex">
            <button id="process" className="btn btn-outline-primary" onClick={onProc}>Preprocess</button>
            <button id="process_play" className="btn btn-outline-primary" onClick={onProcAndPlay}>Proc & Play</button>
            <button id="play" className="btn btn-outline-primary" onClick={onPlay}>Play</button>
            <button id="stop" className="btn btn-outline-primary" onClick={onStop}>Stop</button>
        </div>
    )
}

export default ControlPanel;