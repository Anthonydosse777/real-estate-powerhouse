import FailureSwitch from './components/FailureSwitch.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import MarketSnapshot from './components/MarketSnapshot.jsx'
import SalesList from './components/SalesList.jsx'
import SimulateFailureProvider from './context/SimulateFailureContext.jsx'

export default function App() {
  return (
    <SimulateFailureProvider>
      <a className="skip-link button" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <div className="failure-bar">
        <div className="container">
          <FailureSwitch />
        </div>
      </div>
      <main id="main-content" className="container site-main">
        <MarketSnapshot />
        <SalesList />
      </main>
      <Footer />
    </SimulateFailureProvider>
  )
}
