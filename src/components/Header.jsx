import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <svg className="site-header__icon" viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
          <path d="M6 22 24 7l18 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 20v20h26V20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M20 40V29h8v11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M33 13V8h4v8.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <h1 className="site-header__title">Real Estate Powerhouse</h1>
          <p className="text-meta site-header__subtitle">2025 Staten Island property sales</p>
          <p className="site-header__note">
            Every 2025 Staten Island sale recorded by the NYC Department of Finance, with $0 and other
            non-market transfers (under $10,000) left out.
          </p>
        </div>
      </div>
    </header>
  )
}
