import { APIProvider } from '../contexts/APIContext'
import App from '../App'

// Wrap your main App component with APIProvider
const AppWithProvider = () => {
  return (
    <APIProvider>
      <App />
    </APIProvider>
  )
}

export default AppWithProvider
