import React, { useState, useEffect } from 'react'
import {
  FaStar,
  FaCrown,
  FaCheck,
  FaSpinner,
  FaCreditCard,
  FaImage,
} from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { useAPI } from '../../contexts/APIContext'
import { toast } from '../../utils/toast.jsx'

const PremiumUpgrade = () => {
  const { upgradeToPremium, getPremiumStatus, user } = useAPI()

  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Premium plans
  const premiumPlans = [
    {
      id: 'premium_monthly',
      name: 'Premium Monthly',
      price: '₦15,000',
      duration: 'month',
      features: [
        'Featured listing on homepage',
        'Priority in search results',
        'Premium badge on listings',
        'Hero image rotation slot',
        'Enhanced analytics',
        'Priority customer support',
      ],
    },
    {
      id: 'premium_yearly',
      name: 'Premium Yearly',
      price: '₦150,000',
      duration: 'year',
      originalPrice: '₦180,000',
      savings: '₦30,000',
      popular: true,
      features: [
        'All monthly features',
        'Featured listing on homepage',
        'Priority in search results',
        'Premium badge on listings',
        'Hero image rotation slot',
        'Enhanced analytics',
        'Priority customer support',
        '2 months free',
        'Featured property highlights',
      ],
    },
  ]

  // Check premium status on component mount
  useEffect(() => {
    checkPremiumStatus()
  }, [])

  const checkPremiumStatus = async () => {
    try {
      setStatusLoading(true)
      const status = await getPremiumStatus()
      setIsPremium(status.isPremium || false)
    } catch (error) {
      console.error('Error checking premium status:', error)
      setIsPremium(false)
    } finally {
      setStatusLoading(false)
    }
  }

  const handleUpgrade = async (plan) => {
    try {
      setLoading(true)

      const upgradeData = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        duration: plan.duration,
        userId: user?.id || user?.userId,
        features: plan.features,
      }

      const result = await upgradeToPremium(upgradeData)

      if (result.success) {
        toast.success('Premium Upgrade Successful!', {
          description: `You've successfully upgraded to ${plan.name}. Your properties will now be featured!`,
          duration: 5000,
        })

        setIsPremium(true)
        setShowUpgradeModal(false)

        // Refresh status after upgrade
        setTimeout(() => {
          checkPremiumStatus()
        }, 1000)
      } else {
        throw new Error(result.message || 'Upgrade failed')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      toast.error('Upgrade Failed', {
        description:
          error.message ||
          'Unable to process premium upgrade. Please try again.',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (statusLoading) {
    return (
      <div className='bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center'>
        <div className='flex items-center space-x-3'>
          <FaSpinner className='animate-spin text-primary-600 text-xl' />
          <span className='text-primary-600 font-medium'>
            Checking premium status...
          </span>
        </div>
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className='bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-lg p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl'>
              <FaCrown className='text-white text-xl' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-amber-800'>Premium Host</h3>
              <p className='text-amber-600'>Your properties are featured!</p>
            </div>
          </div>
          <div className='flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1.5 rounded-full text-sm font-bold'>
            <HiSparkles className='text-sm' />
            <span>ACTIVE</span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4'>
            <div className='flex items-center space-x-3'>
              <FaImage className='text-amber-600 text-lg' />
              <div>
                <p className='font-semibold text-amber-800'>Hero Featured</p>
                <p className='text-sm text-amber-600'>
                  Your images rotate on homepage
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4'>
            <div className='flex items-center space-x-3'>
              <FaStar className='text-amber-600 text-lg' />
              <div>
                <p className='font-semibold text-amber-800'>Priority Listing</p>
                <p className='text-sm text-amber-600'>Higher search ranking</p>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center text-sm text-amber-700'>
          <p>Thank you for being a Premium Host! 🎉</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-primary-200 transition-colors duration-300'>
        <div className='text-center mb-6'>
          <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl mx-auto mb-4'>
            <FaCrown className='text-white text-2xl' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800 mb-2'>
            Upgrade to Premium
          </h3>
          <p className='text-gray-600'>
            Get your properties featured on the homepage and boost your
            bookings!
          </p>
        </div>

        <div className='space-y-4 mb-6'>
          <div className='flex items-center space-x-3'>
            <FaCheck className='text-green-500 text-sm flex-shrink-0' />
            <span className='text-gray-700'>
              Featured on homepage hero section
            </span>
          </div>
          <div className='flex items-center space-x-3'>
            <FaCheck className='text-green-500 text-sm flex-shrink-0' />
            <span className='text-gray-700'>Priority in search results</span>
          </div>
          <div className='flex items-center space-x-3'>
            <FaCheck className='text-green-500 text-sm flex-shrink-0' />
            <span className='text-gray-700'>Premium badge on listings</span>
          </div>
          <div className='flex items-center space-x-3'>
            <FaCheck className='text-green-500 text-sm flex-shrink-0' />
            <span className='text-gray-700'>Enhanced analytics & insights</span>
          </div>
        </div>

        <button
          onClick={() => setShowUpgradeModal(true)}
          className='w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2'
        >
          <HiSparkles className='text-lg' />
          <span>Upgrade to Premium</span>
        </button>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-8'>
              <div className='text-center mb-8'>
                <div className='flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mx-auto mb-4'>
                  <FaCrown className='text-white text-3xl' />
                </div>
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                  Choose Your Premium Plan
                </h2>
                <p className='text-gray-600'>
                  Select the plan that best fits your hosting needs
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                {premiumPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                      selectedPlan?.id === plan.id
                        ? 'border-primary-500 bg-primary-50 shadow-lg'
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    } ${plan.popular ? 'ring-2 ring-amber-400' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {plan.popular && (
                      <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                        <div className='bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-bold'>
                          🔥 Most Popular
                        </div>
                      </div>
                    )}

                    <div className='text-center mb-6'>
                      <h3 className='text-xl font-bold text-gray-800 mb-2'>
                        {plan.name}
                      </h3>
                      <div className='mb-2'>
                        <span className='text-3xl font-bold text-primary-600'>
                          {plan.price}
                        </span>
                        <span className='text-gray-500'>/{plan.duration}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className='text-sm text-gray-500'>
                          <span className='line-through'>
                            {plan.originalPrice}
                          </span>
                          <span className='text-green-600 font-semibold ml-2'>
                            Save {plan.savings}
                          </span>
                        </div>
                      )}
                    </div>

                    <ul className='space-y-3'>
                      {plan.features.map((feature, index) => (
                        <li key={index} className='flex items-start space-x-2'>
                          <FaCheck className='text-green-500 text-sm mt-1 flex-shrink-0' />
                          <span className='text-gray-700 text-sm'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className='flex items-center justify-between pt-6 border-t border-gray-200'>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className='px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300'
                >
                  Cancel
                </button>

                <button
                  onClick={() => selectedPlan && handleUpgrade(selectedPlan)}
                  disabled={!selectedPlan || loading}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    !selectedPlan || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaCreditCard />
                      <span>Upgrade Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PremiumUpgrade
