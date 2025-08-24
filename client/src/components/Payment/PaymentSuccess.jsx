import { useNavigate } from 'react-router-dom'

const PaymentSuccess = ({ booking }) => {
  const navigate = useNavigate()

  if (!booking) {
    return <div>Loading...</div>
  }

  return (
    <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center'>
      <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
        <span className='text-white text-3xl'>✓</span>
      </div>

      <h2 className='text-2xl font-bold text-green-600 mb-4'>
        Payment Successful!
      </h2>

      <p className='text-gray-600 mb-6'>
        Your booking has been confirmed and a confirmation email has been sent
        to you.
      </p>

      <div className='bg-gray-50 p-4 rounded-lg mb-6 text-left'>
        <h3 className='font-semibold mb-2'>Booking Confirmation</h3>
        <p className='text-sm text-gray-600 mb-1'>
          <span className='font-medium'>Booking ID:</span> {booking._id}
        </p>
        <p className='text-sm text-gray-600 mb-1'>
          <span className='font-medium'>Property:</span> {booking.propertyTitle}
        </p>
        <p className='text-sm text-gray-600 mb-1'>
          <span className='font-medium'>Check-in:</span>{' '}
          {new Date(booking.checkInDate).toLocaleDateString()}
        </p>
        <p className='text-sm text-gray-600 mb-1'>
          <span className='font-medium'>Check-out:</span>{' '}
          {new Date(booking.checkOutDate).toLocaleDateString()}
        </p>
        <p className='text-sm text-gray-600 mb-1'>
          <span className='font-medium'>Guests:</span> {booking.guests}
        </p>
        <p className='text-sm text-gray-600'>
          <span className='font-medium'>Total Paid:</span> $
          {booking.totalAmount}
        </p>
      </div>

      <div className='flex space-x-4'>
        <button
          onClick={() => navigate('/my-bookings')}
          className='flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          View My Bookings
        </button>
        <button
          onClick={() => navigate('/')}
          className='flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccess
