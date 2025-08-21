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
}

export default function GameSection({ 
  currentUser, 
  isAnimating, 
  coinAnimations, 
  onRobotTap, 
  onClaimDailyBonus 
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
      const missingEnergy = currentUser.gameStats.maxTaps - currentUser.gameStats.tapsLeft
      if (missingEnergy <= 0) {
        setTimeToFullEnergy('Полная')
        return
      }

      const minutesLeft = missingEnergy * 3
      const hours = Math.floor(minutesLeft / 60)
      const minutes = minutesLeft % 60

      if (hours > 0) {
        setTimeToFullEnergy(`${hours}ч ${minutes}мин`)
      } else {
        setTimeToFullEnergy(`${minutes}мин`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 60000) // Обновляем каждую минуту

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
    <div className="flex flex-col items-center space-y-6">
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{currentUser.gameStats.coins.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Монеты</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">+{currentUser.gameStats.robotPower}</div>
            <div className="text-sm text-muted-foreground">За тап</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Button
          onClick={onRobotTap}
          disabled={currentUser.gameStats.tapsLeft <= 0}
          className={`w-64 h-64 rounded-full p-0 bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-4 border-primary/30 shadow-2xl ${
            isAnimating ? 'animate-tap-bounce' : ''
          }`}
        >
          <img 
            src="/img/61a04de9-f347-4c44-b1fb-99ec94268c4e.jpg" 
            alt="Робот" 
            className="w-48 h-48 rounded-full object-cover"
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

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm">
          <span>Энергия: {currentUser.gameStats.tapsLeft}/{currentUser.gameStats.maxTaps}</span>
          <span className="text-primary">⚡</span>
        </div>
        <Progress value={(currentUser.gameStats.tapsLeft / currentUser.gameStats.maxTaps) * 100} className="h-3" />
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
        className="w-full max-w-md bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="Gift" className="mr-2" />
        {canClaimBonus ? (
          `Получить дневной бонус: ${currentUser.gameStats.dailyBonus} монет`
        ) : (
          `Следующий бонус через: ${timeToNextBonus}`
        )}
      </Button>
    </div>
  )
}