import React, { useState, useEffect } from 'react'
import { useAPI } from '../../contexts/APIContext'
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa'

const AvailabilityCalendar = ({
  propertyId,
  onDateSelect,
  selectedDates = {},
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookedDates, setBookedDates] = useState([])
  const [loading, setLoading] = useState(false)

  // This would use your API context to get availability
  // For now, using mock data
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!propertyId) return

      setLoading(true)
      try {
        // This would call your actual API
        // const availability = await getPropertyAvailability(propertyId, currentMonth.getMonth(), currentMonth.getFullYear())

        // Mock booked dates for demonstration
        const mockBookedDates = [
          '2024-08-25',
          '2024-08-26',
          '2024-08-27',
          '2024-09-01',
          '2024-09-02',
          '2024-09-03',
          '2024-09-04',
          '2024-09-15',
          '2024-09-16',
        ]

        setBookedDates(mockBookedDates)
      } catch (error) {
        console.error('Error fetching availability:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [propertyId, currentMonth])

  // Get calendar data for the current month
  const getCalendarData = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  // Check if a date is booked
  const isDateBooked = (day) => {
    if (!day) return false

    const dateString = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split('T')[0]

    return bookedDates.includes(dateString)
  }

  // Check if a date is in the past
  const isPastDate = (day) => {
    if (!day) return false

    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date < today
  }

  // Check if a date is selected
  const isDateSelected = (day) => {
    if (!day) return false

    const dateString = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split('T')[0]

    return (
      selectedDates.checkIn === dateString ||
      selectedDates.checkOut === dateString
    )
  }

  // Handle date click
  const handleDateClick = (day) => {
    if (!day || isPastDate(day) || isDateBooked(day)) return

    const dateString = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split('T')[0]

    if (onDateSelect) {
      onDateSelect(dateString)
    }
  }

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const calendarDays = getCalendarData()

  return (
    <div className='bg-white rounded-xl border border-primary-200 p-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-primary-900 flex items-center gap-2'>
          <FaCalendarAlt className='text-primary-600' />
          Availability
        </h3>

        <div className='flex items-center gap-2'>
          <button
            onClick={goToPreviousMonth}
            className='p-2 hover:bg-primary-100 rounded-lg transition-colors'
            aria-label='Previous month'
          >
            <FaChevronLeft className='text-primary-600' />
          </button>

          <span className='text-lg font-medium text-primary-900 min-w-[140px] text-center'>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>

          <button
            onClick={goToNextMonth}
            className='p-2 hover:bg-primary-100 rounded-lg transition-colors'
            aria-label='Next month'
          >
            <FaChevronRight className='text-primary-600' />
          </button>
        </div>
      </div>

      {loading && (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600'></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Day headers */}
          <div className='grid grid-cols-7 gap-1 mb-2'>
            {dayNames.map((day) => (
              <div
                key={day}
                className='text-center text-sm font-medium text-primary-500 py-2'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className='grid grid-cols-7 gap-1'>
            {calendarDays.map((day, index) => {
              const isBooked = isDateBooked(day)
              const isPast = isPastDate(day)
              const isSelected = isDateSelected(day)

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  disabled={!day || isPast || isBooked}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200
                    ${!day ? 'invisible' : ''}
                    ${isPast ? 'text-neutral-300 cursor-not-allowed' : ''}
                    ${
                      isBooked
                        ? 'bg-error-100 text-error-600 cursor-not-allowed'
                        : ''
                    }
                    ${isSelected ? 'bg-primary-600 text-white' : ''}
                    ${
                      !isPast && !isBooked && !isSelected
                        ? 'hover:bg-primary-50 text-primary-700'
                        : ''
                    }
                    ${day && !isPast && !isBooked ? 'cursor-pointer' : ''}
                  `}
                  title={
                    !day
                      ? ''
                      : isPast
                      ? 'Past date'
                      : isBooked
                      ? 'Not available'
                      : 'Available'
                  }
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className='flex items-center gap-4 mt-4 text-xs'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-neutral-100 rounded'></div>
              <span className='text-primary-600'>Available</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-error-100 rounded'></div>
              <span className='text-primary-600'>Booked</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-primary-600 rounded'></div>
              <span className='text-primary-600'>Selected</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AvailabilityCalendar
