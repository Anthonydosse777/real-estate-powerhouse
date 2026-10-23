import './Skeleton.css'

// Matches the layout of the real cards, including the sideways scroll for stats.
const WRAPPER_CLASS = { sale: '', stat: 'stat-scroller' }
const GRID_CLASS = { sale: 'card-grid', stat: 'stat-grid' }

// Placeholder cards have no data, so their keys are just slot names.
function slotKeys(variant, count) {
  return Array.from({ length: count }, (_, slot) => `${variant}-slot-${slot}`)
}

export default function Skeleton({ variant, count, label }) {
  return (
    <div role="status" className={WRAPPER_CLASS[variant]}>
      <span className="visually-hidden">{label}</span>
      <ul className={GRID_CLASS[variant]} aria-hidden="true">
        {slotKeys(variant, count).map((key) => (
          <li key={key} className={`card skeleton skeleton--${variant}`}>
            <span className="skeleton__line skeleton__line--title" />
            <span className="skeleton__line" />
            <span className="skeleton__line skeleton__line--short" />
          </li>
        ))}
      </ul>
    </div>
  )
}
