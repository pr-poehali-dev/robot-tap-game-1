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
  const [countdown, setCountdown] = useState(5)
  const [canClose, setCanClose] = useState(false)
  const [currentAd, setCurrentAd] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCountdown(5)
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg">
            💝 Спасибо за поддержку!
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Реклама помогает нам поддерживать игру <strong>абсолютно бесплатной</strong> для всех игроков!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Имитация рекламы */}
          <div className={`relative bg-gradient-to-r ${ad.color} rounded-lg p-6 text-white text-center overflow-hidden`}>
            <div className="absolute top-1 right-1 text-xs bg-black/30 px-2 py-1 rounded">
              Реклама
            </div>
            <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
            <p className="text-sm opacity-90 mb-3">{ad.description}</p>
            <div className="text-xs opacity-75">{ad.company}</div>
            
            {/* Декоративные элементы */}
            <div className="absolute top-2 left-2 opacity-20">
              <Icon name="Sparkles" size={20} />
            </div>
            <div className="absolute bottom-2 right-2 opacity-20">
              <Icon name="Star" size={16} />
            </div>
          </div>

          {/* Информация о бесплатности */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-green-600 mb-2">
              <Icon name="Heart" size={24} className="mx-auto" />
            </div>
            <p className="text-sm text-green-700 font-medium">
              🎮 <strong>Игра полностью бесплатна!</strong>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Никаких платных подписок • Никаких обязательных покупок
            </p>
          </div>

          {/* Награда за просмотр */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-yellow-700 mb-1">
              🎁 Награда за просмотр:
            </p>
            <div className="flex items-center justify-center gap-1">
              <Icon name="Coins" size={16} className="text-yellow-600" />
              <span className="font-bold text-yellow-700">+100 монет</span>
            </div>
          </div>

          {/* Кнопка закрытия */}
          <div className="flex items-center justify-center gap-3">
            <Button 
              onClick={handleClose}
              disabled={!canClose}
              className="w-full"
            >
              {canClose ? (
                <>
                  <Icon name="Gift" size={16} className="mr-2" />
                  Получить награду!
                </>
              ) : (
                <>
                  <Icon name="Clock" size={16} className="mr-2" />
                  Закрыть через {countdown}с
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Благодарим за терпение! Ваша поддержка позволяет нам развивать игру 💙
          </p>
        </CardContent>
      </Card>
    </div>
  )
}