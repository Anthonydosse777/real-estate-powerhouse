import './Skeleton.css'

// Each variant matches the layout of the real content, including the sideways scroll for stats.
const LAYOUT = {
  sale: { wrapper: '', list: 'card-grid', item: 'card' },
  stat: { wrapper: 'stat-scroller', list: 'stat-grid', item: 'card' },
  row: { wrapper: '', list: 'compact-list', item: 'compact-row' },
}

// Placeholder cards have no data, so their keys are just slot names.
function slotKeys(variant, count) {
  return Array.from({ length: count }, (_, slot) => `${variant}-slot-${slot}`)
}

export default function Skeleton({ variant, count, label }) {
  const layout = LAYOUT[variant]
  return (
    <div role="status" className={layout.wrapper}>
      <span className="visually-hidden">{label}</span>
      <ul className={layout.list} aria-hidden="true">
        {slotKeys(variant, count).map((key) => (
          <li key={key} className={`${layout.item} skeleton skeleton--${variant}`}>
            <span className="skeleton__line skeleton__line--title" />
            <span className="skeleton__line" />
            <span className="skeleton__line skeleton__line--short" />
          </li>
        ))}
      </ul>
    </div>
  )
}
