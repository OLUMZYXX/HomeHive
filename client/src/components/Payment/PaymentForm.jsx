import React, { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'
import { useAPI } from '../../contexts/APIContext'

const PaymentForm = ({ booking, onPaymentSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const { apiCall } = useAPI()
  const [processing, setProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await apiCall('/api/payments/create-intent', 'POST', {
          amount: booking.totalAmount * 100, // Convert to cents
          bookingId: booking._id,
        })
        setClientSecret(response.clientSecret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        toast.error('Failed to initialize payment. Please try again.')
      }
    }

    if (booking) {
      createPaymentIntent()
    }
  }, [booking, apiCall])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const cardElement = elements.getElement(CardElement)

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking.userEmail,
          },
        },
      }
    )

    if (error) {
      console.error('Payment error:', error)
      toast.error(error.message)
      setProcessing(false)
    } else if (paymentIntent.status === 'succeeded') {
      try {
        // Confirm the booking on the server
        const response = await apiCall(
          `/api/bookings/${booking._id}/confirm`,
          'POST',
          {
            paymentIntentId: paymentIntent.id,
          }
        )

        toast.success('Payment successful! Booking confirmed.')
        onPaymentSuccess(response.booking)
      } catch (error) {
        console.error('Error confirming booking:', error)
        toast.error(
          'Payment successful but booking confirmation failed. Please contact support.'
        )
      }
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

  if (!booking) {
    return <div>Loading booking details...</div>
  }

  return (
    <div className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-center'>
        Complete Your Payment
      </h2>

      <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
        <h3 className='font-semibold mb-2'>Booking Summary</h3>
        <p className='text-sm text-gray-600 mb-1'>
          Property: {booking.propertyTitle}
        </p>
        <p className='text-sm text-gray-600 mb-1'>
          Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
        </p>
        <p className='text-sm text-gray-600 mb-1'>
          Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
        </p>
        <p className='text-sm text-gray-600 mb-1'>Guests: {booking.guests}</p>
        <div className='border-t pt-2 mt-2'>
          <p className='font-semibold'>Total: ${booking.totalAmount}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Card Details
          </label>
          <div className='p-3 border border-gray-300 rounded-md'>
            <CardElement options={cardStyle} />
          </div>
        </div>

        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={!stripe || processing}
            className='flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
          >
            {processing ? 'Processing...' : `Pay $${booking.totalAmount}`}
          </button>
        </div>
      </form>

      <div className='mt-4 text-xs text-gray-500 text-center'>
        <p>Test card: 4242 4242 4242 4242</p>
        <p>Use any future date for expiry and any 3-digit CVC</p>
      </div>
    </div>
  )
}

export default PaymentForm
