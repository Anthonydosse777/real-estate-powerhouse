import { useId } from 'react'
import useSimulateFailure from '../hooks/useSimulateFailure.js'
import './FailureSwitch.css'

// Shown below the header and again inside the property detail dialog,
// so useId keeps each copy's hint id unique.
export default function FailureSwitch() {
  const { simulateFailure, setSimulateFailure } = useSimulateFailure()
  const hintId = useId()

  return (
    <div className="failure-switch">
      <label className="switch">
        <input
          className="switch__input"
          type="checkbox"
          role="switch"
          checked={simulateFailure}
          onChange={(event) => setSimulateFailure(event.target.checked)}
          aria-describedby={hintId}
        />
        <span className="switch__track" aria-hidden="true" />
        <span>Simulate API failure</span>
      </label>
      <p id={hintId} className="text-meta failure-switch__hint">
        Turn on to test the error screens.
      </p>
    </div>
  )
}
