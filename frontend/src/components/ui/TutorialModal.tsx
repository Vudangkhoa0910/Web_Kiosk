import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  RotateCcw,
  ShoppingCart,
  CreditCard,
  MapPin,
  CheckCircle
} from 'lucide-react'

interface TutorialSlide {
  id: number
  title: string
  content: string
  icon: React.ElementType
  image?: string
  color: string
}

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

const tutorialSlides: TutorialSlide[] = [
  {
    id: 1,
    title: 'Chào mừng đến với Alpha Asimov',
    content: 'Hệ thống đặt hàng và giao hàng bằng robot thông minh. Chúng tôi sẽ hướng dẫn bạn cách sử dụng dễ dàng trong vài bước đơn giản.',
    icon: Play,
    color: 'from-gray-800 to-gray-900'
  },
  {
    id: 2,
    title: 'Bước 1: Chọn món ăn',
    content: 'Nhấn vào "Menu đặt hàng" để xem danh sách các món ăn có sẵn. Chọn món bạn muốn và thêm vào giỏ hàng.',
    icon: ShoppingCart,
    color: 'from-gray-700 to-gray-800'
  },
  {
    id: 3,
    title: 'Bước 2: Thanh toán',
    content: 'Kiểm tra giỏ hàng, nhập thông tin giao hàng và chọn phương thức thanh toán (QR Code, MoMo, hoặc thẻ ngân hàng).',
    icon: CreditCard,
    color: 'from-gray-600 to-gray-700'
  },
  {
    id: 4,
    title: 'Bước 3: Theo dõi robot',
    content: 'Sau khi thanh toán, bạn có thể theo dõi robot giao hàng trực tiếp trên bản đồ và xem thời gian dự kiến.',
    icon: MapPin,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 5,
    title: 'Hoàn thành!',
    content: 'Robot sẽ giao hàng đến vị trí bạn chỉ định. Cảm ơn bạn đã sử dụng dịch vụ Alpha Asimov!',
    icon: CheckCircle,
    color: 'from-gray-800 to-black'
  }
]

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        if (prev >= tutorialSlides.length - 1) {
          setIsAutoPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 4000) // 4 seconds per slide

    return () => clearInterval(interval)
  }, [isAutoPlaying, isOpen, currentSlide])

  // Progress bar animation
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) {
      setProgress(0)
      return
    }

    setProgress(0)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0
        }
        return prev + (100 / 40) // 4000ms / 100ms = 40 steps
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [currentSlide, isAutoPlaying, isOpen])

  const nextSlide = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(prev => prev + 1)
      setIsAutoPlaying(false)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
      setIsAutoPlaying(false)
    }
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const restartTutorial = () => {
    setCurrentSlide(0)
    setIsAutoPlaying(true)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  if (!isOpen) return null

  const currentSlideData = tutorialSlides[currentSlide]
  const Icon = currentSlideData.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Hướng dẫn sử dụng</h2>
              <span className="text-sm text-gray-500">
                {currentSlide + 1} / {tutorialSlides.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Auto-play controls */}
              <button
                onClick={toggleAutoPlay}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title={isAutoPlaying ? 'Dừng tự động chạy' : 'Bật tự động chạy'}
              >
                {isAutoPlaying ? (
                  <Pause className="w-5 h-5 text-gray-600" />
                ) : (
                  <Play className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={restartTutorial}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Bắt đầu lại"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {isAutoPlaying && (
            <div className="h-1 bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-700 to-gray-800"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Icon */}
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${currentSlideData.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {currentSlideData.title}
                </h3>

                {/* Content */}
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {currentSlideData.content}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            {/* Previous button */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Trước
            </button>

            {/* Slide indicators */}
            <div className="flex gap-2">
              {tutorialSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-gray-800 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === tutorialSlides.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Tiếp
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            {currentSlide === tutorialSlides.length - 1 ? (
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Bắt đầu sử dụng
              </button>
            ) : (
              <button
                onClick={() => setCurrentSlide(tutorialSlides.length - 1)}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Bỏ qua hướng dẫn
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}