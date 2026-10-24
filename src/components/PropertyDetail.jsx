import { useEffect, useMemo, useRef } from 'react'
import { buildNearbySalesUrl, normalizeSale } from '../api/salesApi.js'
import useFetch from '../hooks/useFetch.js'
import { formatCurrency, getDetailFacts, getMapsUrl } from '../lib/format.js'
import FailureSwitch from './FailureSwitch.jsx'
import NearbySales from './NearbySales.jsx'
import './PropertyDetail.css'

export default function PropertyDetail({ sale, onClose }) {
  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const saleId = sale?.id ?? null

  // A plain string (or null when nothing is selected), so useFetch's dependencies stay primitive.
  const nearby = useFetch(sale ? buildNearbySalesUrl(sale) : null)

  const nearbySales = useMemo(() => (nearby.data ? nearby.data.map(normalizeSale) : []), [nearby.data])

  // Open the modal when a sale is picked, remembering which button opened it.
  useEffect(() => {
    const dialog = dialogRef.current
    if (saleId !== null && !dialog.open) {
      openerRef.current = document.activeElement
      dialog.showModal()
    }
  }, [saleId])

  // Runs for every way of closing: the Close button, Escape, or a backdrop click.
  function handleClose() {
    onClose()
    openerRef.current?.focus()
    openerRef.current = null
  }

  // The dialog itself has no padding, so a click that lands on it is a backdrop click.
  function handleDialogClick(event) {
    if (event.target === event.currentTarget) dialogRef.current.close()
  }

  const mapsUrl = sale ? getMapsUrl(sale) : null

  return (
    <dialog
      ref={dialogRef}
      className="detail-dialog"
      aria-labelledby="detail-title"
      onClose={handleClose}
      onClick={handleDialogClick}
    >
      {sale && (
        <div className="detail">
          <div className="detail__topbar">
            <button type="button" className="button button--secondary" onClick={() => dialogRef.current.close()}>
              Close
            </button>
          </div>

          <header className="detail__header">
            <p className="detail__price">{formatCurrency(sale.price)}</p>
            <h2 id="detail-title" className="detail__title">
              {sale.address}
              {sale.unit && <span className="detail__unit">Unit {sale.unit}</span>}
            </h2>
          </header>

          <dl className="detail__facts">
            {getDetailFacts(sale).map((fact) => (
              <div key={fact.label} className="detail__fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          {mapsUrl && (
            <a className="detail__map-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          )}

          <NearbySales result={nearby} sales={nearbySales} />

          <div className="detail__failure">
            <FailureSwitch />
          </div>
        </div>
      )}
    </dialog>
  )
}
