import useSimulateFailure from '../hooks/useSimulateFailure.js'
import './FailureSwitch.css'

export default function FailureSwitch() {
  const { simulateFailure, setSimulateFailure } = useSimulateFailure()

  return (
    <div className="failure-bar">
      <div className="container failure-bar__inner">
        <label className="switch">
          <input
            className="switch__input"
            type="checkbox"
            role="switch"
            checked={simulateFailure}
            onChange={(event) => setSimulateFailure(event.target.checked)}
            aria-describedby="failure-switch-hint"
          />
          <span className="switch__track" aria-hidden="true" />
          <span className="switch__label">Simulate API failure</span>
        </label>
        <p id="failure-switch-hint" className="failure-bar__hint">
          Turn on to test the error screens.
        </p>
      </div>
    </div>
  )
}
