import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Icon from '@/components/ui/icon'

export interface GameStats {
  coins: number
  dailyBonus: number
  tapsLeft: number
  maxTaps: number
  level: number
  robotPower: number
  totalEarned: number
  lastDailyBonusTime?: string
  energyDepletedAt?: number | null
  autoTapData?: {
    chargingStarted: number | null
    activatedAt: number | null
    expiresAt: number | null
  }
}

export interface User {
  id: string
  username: string
  email: string
  gameStats: GameStats
  registeredAt: string
}

interface GameSectionProps {
  currentUser: User | null
  isAnimating: boolean
  coinAnimations: Array<{ id: number; x: number; y: number }>
  onRobotTap: (e: React.MouseEvent<HTMLButtonElement>) => void
  onClaimDailyBonus: () => void
  onAutoTapClick: () => void
}

export default function GameSection({ 
  currentUser, 
  isAnimating, 
  coinAnimations, 
  onRobotTap, 
  onClaimDailyBonus,
  onAutoTapClick 
}: GameSectionProps) {
  const [timeToFullEnergy, setTimeToFullEnergy] = useState('')
  const [timeToNextBonus, setTimeToNextBonus] = useState('')
  const [canClaimBonus, setCanClaimBonus] = useState(true)

  const getDailyBonusStatus = () => {
    if (!currentUser?.gameStats.lastDailyBonusTime) {
      return { canClaim: true, timeLeft: '' }
    }

    const lastBonusDate = new Date(currentUser.gameStats.lastDailyBonusTime)
    const now = new Date()
    const timeDiff = now.getTime() - lastBonusDate.getTime()
    const dayInMs = 24 * 60 * 60 * 1000

    if (timeDiff >= dayInMs) {
      return { canClaim: true, timeLeft: '' }
    }

    const timeLeft = dayInMs - timeDiff
    const hours = Math.floor(timeLeft / (60 * 60 * 1000))
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
    
    return { 
      canClaim: false, 
      timeLeft: hours > 0 ? `${hours}ч ${minutes}мин` : `${minutes}мин`
    }
  }

  useEffect(() => {
    if (!currentUser) return

    const updateTimer = () => {
      const now = Date.now()
      
      // Если энергия полная
      if (currentUser.gameStats.tapsLeft >= currentUser.gameStats.maxTaps) {
        setTimeToFullEnergy('Полная')
        return
      }

      // Если энергия истощена и установлена метка времени
      if (currentUser.gameStats.energyDepletedAt) {
        const restoreTime = currentUser.gameStats.energyDepletedAt + (5 * 60 * 60 * 1000) // 5 часов в миллисекундах
        
        if (now >= restoreTime) {
          setTimeToFullEnergy('Готово к восстановлению')
          return
        }

        const timeLeft = restoreTime - now
        const hours = Math.floor(timeLeft / (60 * 60 * 1000))
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000)

        if (hours > 0) {
          setTimeToFullEnergy(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        } else {
          setTimeToFullEnergy(`${minutes}:${seconds.toString().padStart(2, '0')}`)
        }
        return
      }

      // Если нет метки времени истощения, но энергия не полная
      setTimeToFullEnergy('Восстанавливается...')
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000) // Обновляем каждую секунду для точности

    return () => clearInterval(timer)
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return

    const updateBonusStatus = () => {
      const status = getDailyBonusStatus()
      setCanClaimBonus(status.canClaim)
      setTimeToNextBonus(status.timeLeft)
    }

    updateBonusStatus()
    const bonusTimer = setInterval(updateBonusStatus, 60000) // Обновляем каждую минуту

    return () => clearInterval(bonusTimer)
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="text-center space-y-4">
        <Icon name="Lock" size={64} className="mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Требуется авторизация</h3>
        <p className="text-muted-foreground">Войдите в аккаунт чтобы начать играть</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full mb-2">
        <Card className="bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-orange-500/20 border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-3 sm:p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Coins" size={20} className="text-yellow-600 sm:w-6 sm:h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-yellow-700 drop-shadow-sm">{currentUser.gameStats.coins.toLocaleString()}</div>
              <div className="text-xs sm:text-sm font-semibold text-yellow-600/80">Монеты</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-400/20 via-blue-500/10 to-purple-500/20 border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-3 sm:p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Zap" size={20} className="text-blue-600 sm:w-6 sm:h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-700 drop-shadow-sm">+{currentUser.gameStats.robotPower}</div>
              <div className="text-xs sm:text-sm font-semibold text-blue-600/80">За тап</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-400/20 via-red-500/10 to-pink-500/20 border-orange-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onAutoTapClick}>
          <CardContent className="p-3 sm:p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Car" size={20} className="text-orange-600 sm:w-6 sm:h-6" />
              </div>
              <div className="text-lg sm:text-xl font-black text-orange-700 drop-shadow-sm">AUTO</div>
              <div className="text-xs sm:text-sm font-semibold text-orange-600/80">Тап</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Button
          onClick={onRobotTap}
          disabled={currentUser.gameStats.tapsLeft <= 0}
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full p-0 bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-4 border-primary/30 shadow-2xl ${
            isAnimating ? 'animate-tap-bounce' : ''
          }`}
        >
          <img 
            src="/img/61a04de9-f347-4c44-b1fb-99ec94268c4e.jpg" 
            alt="Робот" 
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover"
          />
        </Button>
      
        {coinAnimations.map(coin => (
          <div
            key={coin.id}
            className="absolute text-2xl font-bold text-secondary animate-coin-collect pointer-events-none"
            style={{ left: coin.x, top: coin.y }}
          >
            +{currentUser.gameStats.robotPower}
          </div>
        ))}
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
          <span>Энергия: {currentUser.gameStats.tapsLeft}/{currentUser.gameStats.maxTaps}</span>
          <span className="text-primary">⚡</span>
        </div>
        <Progress value={(currentUser.gameStats.tapsLeft / currentUser.gameStats.maxTaps) * 100} className="h-2 sm:h-3" />
        <div className="text-center text-xs text-muted-foreground">
          {currentUser.gameStats.tapsLeft < currentUser.gameStats.maxTaps ? (
            <>До полного восстановления: {timeToFullEnergy}</>
          ) : (
            'Энергия полная!'
          )}
        </div>
      </div>

      <Button 
        onClick={onClaimDailyBonus} 
        disabled={!canClaimBonus}
        className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
      >
        <Icon name="Gift" className="mr-2 w-4 h-4" />
        {canClaimBonus ? (
          `Получить дневной бонус: ${currentUser.gameStats.dailyBonus} монет`
        ) : (
          `Следующий бонус через: ${timeToNextBonus}`
        )}
      </Button>
    </div>
  )
}