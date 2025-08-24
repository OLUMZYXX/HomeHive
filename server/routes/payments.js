import express from 'express'
import Stripe from 'stripe'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { mongoBookingService } from '../services/mongoBookingService.js'

const router = express.Router()

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...')

// Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, bookingId } = req.body
    const user = req.user

    console.log('Creating payment intent:', {
      amount,
      bookingId,
      userId: user.id,
    })

    // Verify the booking exists and belongs to the user
    const booking = await mongoBookingService.getBookingById(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (booking.userId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized to pay for this booking' })
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({ error: 'Booking is already confirmed' })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId,
        userId: user.id,
        userEmail: user.email || booking.userEmail,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Update booking with payment intent ID
    await mongoBookingService.updateBooking(bookingId, {
      paymentIntentId: paymentIntent.id,
      status: 'payment_pending',
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

// Handle successful payment and confirm booking
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET // Add this to your environment

    let event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)

        try {
          // Find and confirm the booking
          const bookingId = paymentIntent.metadata.bookingId
          await mongoBookingService.updateBooking(bookingId, {
            status: 'confirmed',
            paymentStatus: 'paid',
            confirmedAt: new Date(),
            paymentIntentId: paymentIntent.id,
          })

          console.log(`Booking ${bookingId} confirmed after successful payment`)
        } catch (error) {
          console.error('Error confirming booking after payment:', error)
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)

        try {
          const bookingId = failedPayment.metadata.bookingId
          await mongoBookingService.updateBooking(bookingId, {
            status: 'payment_failed',
            paymentStatus: 'failed',
          })
        } catch (error) {
          console.error('Error updating booking after payment failure:', error)
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  }
)

export default router
