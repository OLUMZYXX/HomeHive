import React, { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import { useAPI } from '../../contexts/APIContext'
import { FaLock } from 'react-icons/fa'

const StripeCheckoutForm = ({ bookingData, onPaymentSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { apiCall } = useAPI()
  const [processing, setProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: bookingData.userEmail || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  const handleBillingChange = (e) => {
    const { name, value } = e.target
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const amount = bookingData.totalAmount * 100 // Convert to cents
        const response = await apiCall('/payments/create-intent', 'POST', {
          amount,
          bookingId: 'pending', // We'll create the booking first or use a different approach
        })
        setClientSecret(response.clientSecret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        toast.error('Failed to initialize payment. Please try again.')
      }
    }

    if (bookingData) {
      createPaymentIntent()
    }
  }, [bookingData, apiCall])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Validate cardholder name
    if (!billingDetails.name.trim()) {
      toast.error('Please enter the cardholder name')
      return
    }

    setProcessing(true)

    try {
      const cardElement = elements.getElement(CardElement)

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.name || 'Customer',
              email:
                billingDetails.email ||
                bookingData.userEmail ||
                'customer@example.com',
              address: {
                line1: billingDetails.address || '',
                city: billingDetails.city || '',
                state: billingDetails.state || '',
                postal_code: billingDetails.zip || '',
                country: billingDetails.country || 'US',
              },
            },
          },
        }
      )

      if (error) {
        console.error('Payment error:', error)
        toast.error(error.message)
        setProcessing(false)
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! Booking confirmed.')
        onPaymentSuccess(paymentIntent)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <div className='mt-6 p-6 bg-gradient-to-r from-primary-25 to-neutral-50 rounded-xl border border-primary-200'>
      <div className='flex items-center gap-3 mb-6'>
        <FaLock className='text-primary-600' />
        <h3 className='text-lg font-bold text-primary-800'>
          Secure Payment with Stripe
        </h3>
      </div>

      {!stripe ? (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600'></div>
          <span className='ml-3 text-primary-600'>Loading payment form...</span>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-primary-700 mb-2'>
                Cardholder Name
              </label>
              <input
                type='text'
                name='name'
                value={billingDetails.name}
                onChange={handleBillingChange}
                placeholder='Full name on card'
                className='w-full p-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300 bg-white'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-primary-700 mb-2'>
                Card Details
              </label>
              <div className='p-4 border-2 border-primary-200 rounded-xl focus-within:border-primary-500 bg-white'>
                <CardElement options={cardStyle} />
              </div>
            </div>

            <div className='flex items-center gap-2 text-xs text-primary-600 mb-4'>
              <FaLock />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <button
              type='submit'
              disabled={!stripe || processing || !clientSecret}
              className='w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-base shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3'
            >
              {processing ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaLock />
                  Pay Now - ₦{bookingData.totalAmount?.toLocaleString()}
                </>
              )}
            </button>
          </form>

          <div className='mt-4 text-xs text-gray-500 text-center'>
            <p>Test card: 4242 4242 4242 4242</p>
            <p>Use any future date for expiry and any 3-digit CVC</p>
          </div>
        </>
      )}
    </div>
  )
}

export default StripeCheckoutForm
