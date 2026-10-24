import FailureSwitch from './components/FailureSwitch.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import MarketSnapshot from './components/MarketSnapshot.jsx'
import SalesList from './components/SalesList.jsx'
import SimulateFailureProvider from './context/SimulateFailureContext.jsx'

export default function App() {
  return (
    <SimulateFailureProvider>
      <Header />
      <div className="failure-bar">
        <div className="container">
          <FailureSwitch />
        </div>
      </div>
      <main className="container site-main">
        <MarketSnapshot />
        <SalesList />
      </main>
      <Footer />
    </SimulateFailureProvider>
  )
}
