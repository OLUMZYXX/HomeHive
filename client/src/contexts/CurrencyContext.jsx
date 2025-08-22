import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// ================================
// CURRENCY CONTEXT
// ================================

const CurrencyContext = createContext()

// ================================
// CURRENCY PROVIDER
// ================================

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    NGN: 1650,
    GBP: 0.79,
  })

  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ]

  const selectedCurrencyData = currencies.find(
    (curr) => curr.code === selectedCurrency
  )

  // Fetch exchange rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Using ExchangeRate.host (free, no API key required)
        const res = await fetch(
          'https://api.exchangerate.host/latest?base=USD&symbols=USD,NGN,GBP'
        )
        const data = await res.json()
        if (data && data.rates) {
          setExchangeRates({
            USD: data.rates.USD,
            NGN: data.rates.NGN,
            GBP: data.rates.GBP,
          })
        }
      } catch (err) {
        console.error('Failed to fetch currency rates', err)
      }
    }
    fetchRates()
  }, [])

  // Convert base USD price to selected currency
  const convertPrice = (usdPrice) => {
    const rate = exchangeRates[selectedCurrency] || 1
    const converted = Math.round(usdPrice * rate)
    if (selectedCurrency === 'NGN') return converted.toLocaleString()
    return converted.toString()
  }

  // Convert price from one currency to another
  const convertFromCurrency = (
    price,
    fromCurrency,
    toCurrency = selectedCurrency
  ) => {
    // First convert to USD (base)
    const usdRate = exchangeRates[fromCurrency] || 1
    const priceInUsd = price / usdRate

    // Then convert to target currency
    const targetRate = exchangeRates[toCurrency] || 1
    const converted = Math.round(priceInUsd * targetRate)

    if (toCurrency === 'NGN') return converted.toLocaleString()
    return converted.toString()
  }

  // Format price with currency symbol
  const formatPrice = (price, currency = selectedCurrency) => {
    const currencyData = currencies.find((c) => c.code === currency)
    const symbol = currencyData?.symbol || '₦'

    if (typeof price === 'string' && price.includes(',')) {
      return `${symbol}${price}`
    }

    const formattedPrice =
      currency === 'NGN' ? price.toLocaleString() : price.toString()

    return `${symbol}${formattedPrice}`
  }

  const contextValue = {
    selectedCurrency,
    setSelectedCurrency,
    selectedCurrencyData,
    currencies,
    exchangeRates,
    convertPrice,
    convertFromCurrency,
    formatPrice,
  }

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  )
}

// Add PropTypes validation
CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// ================================
// CUSTOM HOOK
// ================================

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

export default CurrencyContext
