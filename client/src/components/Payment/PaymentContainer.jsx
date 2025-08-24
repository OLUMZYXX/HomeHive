import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from './PaymentForm'
import PaymentSuccess from './PaymentSuccess'

// Initialize Stripe - Using test key for development
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_51QOGwYEnTmUaGP9VnrZNGgFiKqaHLLZaHqcKINQKOTFVRNsLIYWKOJo3oq6MWfPgPNAW4q8vGgGcJaBkdwTjd4H800YxNE4LVA'
)

const PaymentContainer = ({ booking, onCancel }) => {
  const [paymentStep, setPaymentStep] = useState('payment') // 'payment' or 'success'
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  const handlePaymentSuccess = (booking) => {
    setConfirmedBooking(booking)
    setPaymentStep('success')
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
  }

  const options = {
    appearance,
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {paymentStep === 'payment' && (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm
              booking={booking}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={onCancel}
            />
          </Elements>
        )}

        {paymentStep === 'success' && (
          <PaymentSuccess booking={confirmedBooking} />
        )}
      </div>
    </div>
  )
}

export default PaymentContainer
