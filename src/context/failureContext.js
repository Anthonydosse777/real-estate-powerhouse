import { createContext } from 'react'

// Kept apart from the provider component so that file only exports a component.
export const SimulateFailureContext = createContext({
  simulateFailure: false,
  setSimulateFailure: () => {},
})
