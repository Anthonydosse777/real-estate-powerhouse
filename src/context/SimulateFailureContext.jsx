import { useState } from 'react'
import { SimulateFailureContext } from './failureContext.js'

export default function SimulateFailureProvider({ children }) {
  const [simulateFailure, setSimulateFailure] = useState(false)
  return (
    <SimulateFailureContext value={{ simulateFailure, setSimulateFailure }}>
      {children}
    </SimulateFailureContext>
  )
}
