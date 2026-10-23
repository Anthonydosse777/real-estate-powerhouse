import { useContext } from 'react'
import { SimulateFailureContext } from '../context/failureContext.js'

export default function useSimulateFailure() {
  return useContext(SimulateFailureContext)
}
