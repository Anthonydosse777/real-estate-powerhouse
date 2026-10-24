import { formatCurrency, formatDate, getSaleFacts } from '../lib/format.js'
import './SaleCard.css'

export default function SaleCard({ sale, onOpen }) {
  const facts = getSaleFacts(sale)

  return (
    <article className="card stack stack--tight sale-card">
      <h3 className="sale-card__address">
        <button type="button" className="sale-card__open" onClick={() => onOpen(sale.id)}>
          <span className="visually-hidden">View details for </span>
          {sale.address}
          {sale.unit && (
            <span className="unit-label">
              <span className="visually-hidden">, </span>Unit {sale.unit}
            </span>
          )}
        </button>
      </h3>
      <p className="price-display">{formatCurrency(sale.price)}</p>
      <p className="text-meta">
        {sale.neighborhood}
        <span aria-hidden="true"> · </span>
        {sale.propertyType}
      </p>
      <p className="text-meta">
        Sold <time dateTime={sale.date}>{formatDate(sale.date)}</time>
      </p>
      {facts.length > 0 && (
        <dl className="sale-card__facts">
          {facts.map((fact) => (
            <div key={fact.label} className="sale-card__fact">
              <dt className={fact.hideLabel ? 'visually-hidden' : undefined}>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}
