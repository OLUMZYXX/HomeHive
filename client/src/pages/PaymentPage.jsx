import { useLocation, useNavigate } from 'react-router-dom'
import PaymentContainer from '../components/Payment/PaymentContainer'
import { toast } from 'react-toastify'

const PaymentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { booking } = location.state || {}

  if (!booking) {
    toast.error('No booking data found. Please try booking again.')
    navigate('/listings')
    return null
  }

  const handleCancel = () => {
    // Optionally, you could delete the pending booking here
    navigate(-1) // Go back to property detail
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <PaymentContainer booking={booking} onCancel={handleCancel} />
    </div>
  )
}

export default PaymentPage
