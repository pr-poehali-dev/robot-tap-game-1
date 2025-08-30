import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Icon from '@/components/ui/icon'

interface AdModalProps {
  isOpen: boolean
  onClose: () => void
  onReward: () => void
}

const adTemplates = [
  {
    title: "🎮 Новая мобильная игра!",
    description: "Скачай сейчас и получи 1000 золота!",
    company: "GameStudio",
    color: "from-blue-600 to-purple-600"
  },
  {
    title: "🛒 Скидка 50% на всё!",
    description: "Мега распродажа в интернет-магазине!",
    company: "SuperShop",
    color: "from-green-600 to-emerald-600"
  },
  {
    title: "📱 Обновите свой телефон!",
    description: "Новые смартфоны со скидкой до 30%!",
    company: "TechStore",
    color: "from-orange-600 to-red-600"
  },
  {
    title: "🍕 Вкусная доставка!",
    description: "Бесплатная доставка при заказе от 500₽!",
    company: "FastFood",
    color: "from-yellow-600 to-orange-600"
  }
]

export default function AdModal({ isOpen, onClose, onReward }: AdModalProps) {
  const [countdown, setCountdown] = useState(60)
  const [canClose, setCanClose] = useState(false)
  const [currentAd, setCurrentAd] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCountdown(60)
      setCanClose(false)
      setCurrentAd(Math.floor(Math.random() * adTemplates.length))
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanClose(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    if (canClose) {
      onReward()
      onClose()
    }
  }

  const ad = adTemplates[currentAd]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 md:p-6">
      <Card className="w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-2 sm:mx-4 animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
          <CardTitle className="text-center text-sm sm:text-base lg:text-lg">
            💝 Спасибо за поддержку!
          </CardTitle>
          <p className="text-center text-xs sm:text-sm text-muted-foreground leading-tight">
            Реклама помогает нам поддерживать игру <strong>абсолютно бесплатной</strong> для всех игроков!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
          {/* Имитация рекламы */}
          <div className={`relative bg-gradient-to-r ${ad.color} rounded-lg p-3 sm:p-4 lg:p-6 text-white text-center overflow-hidden`}>
            <div className="absolute top-1 right-1 text-xs bg-black/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-xs">
              Реклама
            </div>
            <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{ad.title}</h3>
            <p className="text-xs sm:text-sm opacity-90 mb-2 sm:mb-3 leading-tight">{ad.description}</p>
            <div className="text-xs opacity-75">{ad.company}</div>
            
            {/* Декоративные элементы */}
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 opacity-20">
              <Icon name="Sparkles" size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 opacity-20">
              <Icon name="Star" size={12} className="sm:w-4 sm:h-4" />
            </div>
          </div>



          {/* Кнопка закрытия */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Button 
              onClick={handleClose}
              disabled={!canClose}
              className="w-full py-2 sm:py-3 text-sm sm:text-base"
            >
              {canClose ? (
                <>
                  <Icon name="X" size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-base">Закрыть</span>
                </>
              ) : (
                <>
                  <Icon name="Clock" size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-base">Закрыть через {countdown}с</span>
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2 sm:space-y-3 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
              Благодарим за терпение! Ваша поддержка позволяет нам развивать игру 💙
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-blue-700 font-medium mb-1">
                📢 Хотите разместить свою рекламу?
              </p>
              <p className="text-xs sm:text-sm text-blue-600 leading-tight">
                Заказать рекламу можно в WhatsApp: <strong className="break-all sm:break-normal">+7 904 980 82 75</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}