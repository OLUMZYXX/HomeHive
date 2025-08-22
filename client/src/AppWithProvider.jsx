import { APIProvider } from './contexts/APIContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import App from './App'

// Wrap your main App component with APIProvider and CurrencyProvider
const AppWithProvider = () => {
  return (
    <APIProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </APIProvider>
  )
}

export default AppWithProvider
