import { useCallback, useEffect, useState } from 'react'
import useSimulateFailure from './useSimulateFailure.js'

class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`)
    this.status = status
  }
}

// Swaps in a dataset id that doesn't exist, so the request really fails (404).
function breakUrl(url) {
  return url.replace('/resource/w2pb-icbu.json', '/resource/xxxx-0000.json')
}

function toFriendlyMessage(error) {
  if (!navigator.onLine) return "You're offline. Check your connection and try again."
  if (error instanceof HttpError) {
    return `NYC Open Data didn't respond (error ${error.status}). Please try again.`
  }
  return 'Something went wrong while loading NYC Open Data. Please try again.'
}

// Identifies one request. When it changes, the previous result is out of date.
function getRequestKey(url, simulateFailure, attempt) {
  return `${url}|${simulateFailure}|${attempt}`
}

export default function useFetch(url) {
  const { simulateFailure } = useSimulateFailure()
  const [attempt, setAttempt] = useState(0)
  // The result remembers which request it belongs to, so loading can be derived
  // during render instead of being set at the start of the effect.
  const [result, setResult] = useState({ key: null, data: null, error: null })

  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  useEffect(() => {
    if (url === null) return

    const key = getRequestKey(url, simulateFailure, attempt)
    const controller = new AbortController()

    fetch(simulateFailure ? breakUrl(url) : url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new HttpError(response.status)
        return response.json()
      })
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult({ key, data: null, error: toFriendlyMessage(error) })
      })

    return () => controller.abort()
  }, [url, simulateFailure, attempt])

  if (url === null) return { data: null, loading: false, error: null, retry }

  const isCurrent = result.key === getRequestKey(url, simulateFailure, attempt)
  return {
    data: isCurrent ? result.data : null,
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    retry,
  }
}
