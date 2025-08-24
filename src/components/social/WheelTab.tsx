import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Icon from '@/components/ui/icon'
import { User, GameStats } from '../GameSection'

interface WheelTabProps {
  currentUser: User
  onUpdateStats: (stats: GameStats) => void
}

interface WheelPrize {
  coins: number
  weight: number
  color: string
}

const prizes: WheelPrize[] = [
  { coins: 10, weight: 25, color: '#22c55e' }, // очень часто
  { coins: 20, weight: 20, color: '#3b82f6' }, // часто  
  { coins: 30, weight: 15, color: '#8b5cf6' }, // не часто
  { coins: 40, weight: 12, color: '#f59e0b' }, // не часто
  { coins: 50, weight: 10, color: '#ef4444' }, // меньше
  { coins: 60, weight: 7, color: '#ec4899' }, // меньше
  { coins: 70, weight: 5, color: '#06b6d4' }, // меньше
  { coins: 80, weight: 3, color: '#84cc16' }, // редко
  { coins: 90, weight: 2, color: '#f97316' }, // редко
  { coins: 100, weight: 1, color: '#dc2626' } // очень редко
]

export default function WheelTab({ currentUser, onUpdateStats }: WheelTabProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null)
  const [wonPrize, setWonPrize] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`wheelSpin_${currentUser.id}`)
    if (saved) {
      setLastSpinDate(saved)
    }
  }, [currentUser.id])

  const canSpin = () => {
    if (!lastSpinDate) return true
    const today = new Date().toDateString()
    const lastSpin = new Date(lastSpinDate).toDateString()
    return today !== lastSpin
  }

  const getRandomPrize = (): WheelPrize => {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0)
    const random = Math.random() * totalWeight
    
    let currentWeight = 0
    for (const prize of prizes) {
      currentWeight += prize.weight
      if (random <= currentWeight) {
        return prize
      }
    }
    return prizes[0] // fallback
  }

  const spinWheel = () => {
    if (!canSpin() || isSpinning) return

    setIsSpinning(true)
    setWonPrize(null)

    const prize = getRandomPrize()
    const prizeIndex = prizes.findIndex(p => p.coins === prize.coins)
    const degreesPerSegment = 360 / prizes.length
    const targetRotation = rotation + 360 * 5 + (prizeIndex * degreesPerSegment) + (degreesPerSegment / 2)

    setRotation(targetRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setWonPrize(prize.coins)
      
      // Обновляем монеты пользователя
      const updatedStats = {
        ...currentUser.gameStats,
        coins: currentUser.gameStats.coins + prize.coins
      }
      onUpdateStats(updatedStats)

      // Сохраняем дату последнего вращения
      const today = new Date().toISOString()
      localStorage.setItem(`wheelSpin_${currentUser.id}`, today)
      setLastSpinDate(today)
    }, 4000)
  }

  const getTimeUntilNextSpin = () => {
    if (!lastSpinDate) return null
    const lastSpin = new Date(lastSpinDate)
    const nextSpin = new Date(lastSpin)
    nextSpin.setDate(nextSpin.getDate() + 1)
    const now = new Date()
    
    if (now >= nextSpin) return null
    
    const diff = nextSpin.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}ч ${minutes}м`
  }

  const timeUntilNext = getTimeUntilNextSpin()

  return (
    <div className="space-y-4 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">🎰 Колесо фортуны</h1>
        <p className="text-muted-foreground text-sm">
          Крути колесо раз в сутки и выигрывай монеты!
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <CardContent className="p-8 text-center">
          {/* Колесо */}
          <div className="relative w-80 h-80 mx-auto mb-6">
            {/* Стрелка указатель */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500"></div>
            </div>
            
            {/* Само колесо */}
            <div 
              className="w-full h-full rounded-full border-8 border-gray-300 relative transition-transform duration-[4000ms] ease-out"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(${prizes.map((prize, index) => 
                  `${prize.color} ${(index * 360 / prizes.length)}deg ${((index + 1) * 360 / prizes.length)}deg`
                ).join(', ')})`
              }}
            >
              {/* Сегменты с числами */}
              {prizes.map((prize, index) => {
                const angle = (index * 360 / prizes.length) + (360 / prizes.length / 2)
                return (
                  <div
                    key={prize.coins}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    <div 
                      className="text-white font-bold text-lg"
                      style={{ 
                        transform: `translateY(-120px) rotate(${-angle}deg)`
                      }}
                    >
                      {prize.coins}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Центральный круг */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-800 rounded-full border-4 border-white flex items-center justify-center">
              <Icon name="Star" size={24} className="text-yellow-400" />
            </div>
          </div>

          {/* Кнопка вращения */}
          <div className="space-y-4">
            <Button
              onClick={spinWheel}
              disabled={!canSpin() || isSpinning}
              size="lg"
              className="px-8 py-4 text-lg font-bold"
            >
              {isSpinning ? (
                <>
                  <Icon name="RotateCw" size={20} className="mr-2 animate-spin" />
                  Крутится...
                </>
              ) : canSpin() ? (
                <>
                  <Icon name="Play" size={20} className="mr-2" />
                  Крутить колесо!
                </>
              ) : (
                <>
                  <Icon name="Clock" size={20} className="mr-2" />
                  Следующее вращение через {timeUntilNext}
                </>
              )}
            </Button>

            {/* Результат */}
            {wonPrize && (
              <Card className="bg-green-50 border-green-200 animate-bounce">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="Trophy" size={24} className="text-yellow-500" />
                    <span className="text-lg font-bold text-green-700">
                      Поздравляем! Вы выиграли {wonPrize} монет!
                    </span>
                    <Icon name="Coins" size={24} className="text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Информация о призах */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Info" size={20} />
            Таблица призов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {prizes.map(prize => (
              <div key={prize.coins} className="flex justify-between items-center p-2 rounded" 
                   style={{ backgroundColor: `${prize.color}20` }}>
                <span className="font-medium">{prize.coins} монет</span>
                <span className="text-xs text-muted-foreground">
                  {prize.weight >= 20 ? 'Часто' : 
                   prize.weight >= 10 ? 'Средне' : 
                   prize.weight >= 5 ? 'Редко' : 
                   'Очень редко'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Правила */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Icon name="AlertCircle" size={16} className="mt-0.5 text-blue-500" />
            <div className="text-sm">
              <p className="mb-2 text-foreground font-semibold">
                Правила колеса фортуны:
              </p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Вращать колесо можно только 1 раз в сутки</li>
                <li>• Выигрыш от 10 до 100 монет</li>
                <li>• Меньшие призы выпадают чаще</li>
                <li>• Большие призы встречаются очень редко</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}