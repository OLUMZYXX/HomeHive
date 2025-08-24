import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaHeadset,
  FaRobot,
} from 'react-icons/fa'

const FloatingSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your HomeHive support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setMessage('')

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: 'Thanks for your message! Our support team will get back to you shortly. For immediate assistance, you can also check our FAQ section.',
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
      }, 1000)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-strong z-50 flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div
              key='close'
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes className='text-white text-lg sm:text-xl' />
            </motion.div>
          ) : (
            <motion.div
              key='chat'
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaComments className='text-white text-lg sm:text-xl' />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Dot */}
        {!isOpen && (
          <div className='absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white'>
            <div className='w-full h-full bg-green-400 rounded-full animate-ping opacity-75'></div>
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className='fixed bottom-16 right-4 sm:bottom-24 sm:right-6 w-full max-w-sm sm:w-80 h-80 sm:h-96 bg-white rounded-2xl shadow-intense border border-gray-200 z-50 flex flex-col overflow-hidden mx-4 sm:mx-0'
          >
            {/* Chat Header */}
            <div className='bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                <FaRobot className='text-white text-sm' />
              </div>
              <div className='flex-1'>
                <h3 className='text-white font-semibold text-sm'>
                  HomeHive Support
                </h3>
                <div className='flex items-center gap-1 text-white/80 text-xs'>
                  <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                  <span>Online</span>
                </div>
              </div>
              <FaHeadset className='text-white/80 text-lg' />
            </div>

            {/* Chat Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={sendMessage}
              className='p-4 border-t border-gray-200'
            >
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='Type your message...'
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                />
                <button
                  type='submit'
                  disabled={!message.trim()}
                  className='w-8 h-8 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors duration-200'
                >
                  <FaPaperPlane className='text-xs' />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingSupportChat
