// headingLevel keeps the outline in order: 3 under a page section, 4 inside the dialog.
export default function ErrorState({ title, message, onRetry, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  return (
    <div className="stack state-panel state-panel--error" role="alert">
      <svg className="state-panel__icon" viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v6M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <Heading className="state-panel__title">{title}</Heading>
      <p className="state-panel__message">{message}</p>
      <button type="button" className="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
