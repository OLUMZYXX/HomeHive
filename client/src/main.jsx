import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { APIProvider } from './contexts/APIContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <APIProvider>
        <App />
      </APIProvider>
    </BrowserRouter>
  </React.StrictMode>
)
