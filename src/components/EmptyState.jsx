export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="state-panel">
      <svg className="state-panel__icon" viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m16.5 16.5 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h3 className="state-panel__title">{title}</h3>
      <p className="state-panel__message">{message}</p>
      {actionLabel && onAction && (
        <button type="button" className="button button--secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
