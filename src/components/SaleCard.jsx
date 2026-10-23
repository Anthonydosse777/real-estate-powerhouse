import { formatCurrency, formatDate, getSaleFacts } from '../lib/format.js'
import './SaleCard.css'

export default function SaleCard({ sale }) {
  const facts = getSaleFacts(sale)

  return (
    <article className="card sale-card">
      <h3 className="sale-card__address">
        {sale.address}
        {sale.unit && <span className="sale-card__unit">Unit {sale.unit}</span>}
      </h3>
      <p className="sale-card__price">{formatCurrency(sale.price)}</p>
      <p className="sale-card__meta">
        {sale.neighborhood}
        <span aria-hidden="true"> · </span>
        {sale.propertyType}
      </p>
      <p className="sale-card__date">
        Sold <time dateTime={sale.date}>{formatDate(sale.date)}</time>
      </p>
      {facts.length > 0 && (
        <dl className="sale-card__facts">
          {facts.map((fact) => (
            <div key={fact.label} className="sale-card__fact">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}
