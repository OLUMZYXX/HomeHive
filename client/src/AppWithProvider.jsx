import { APIProvider } from './contexts/APIContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import ServerStatus from './components/common/ServerStatus'
import App from './App'

const AppWithProvider = () => {
  return (
    <APIProvider>
      <CurrencyProvider>
        <App />
        <ServerStatus />
      </CurrencyProvider>
    </APIProvider>
  )
}

export default AppWithProvider
