import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'
import StatsHeader from './StatsHeader'
import AdModal from '@/components/AdModal'
import { User, GameStats } from '@/types/user'





interface GameSectionProps {
  currentUser: User | null
  isAnimating: boolean
  coinAnimations: Array<{ id: number; x: number; y: number }>
  onRobotTap: (e: React.MouseEvent<HTMLButtonElement>) => void
  onClaimDailyBonus: () => void
  onAutoTapClick: () => void
  onUpdateStats: (stats: GameStats) => void
  onTabChange: (tab: string) => void
  onAdReward: () => void
  onAdModalStateChange?: (isOpen: boolean) => void
}

export default function GameSection({ 
  currentUser, 
  isAnimating, 
  coinAnimations, 
  onRobotTap, 
  onClaimDailyBonus,
  onAutoTapClick,
  onUpdateStats,
  onTabChange,
  onAdReward,
  onAdModalStateChange
}: GameSectionProps) {
  const [timeToFullEnergy, setTimeToFullEnergy] = useState('')
  const [timeToNextBonus, setTimeToNextBonus] = useState('')
  const [canClaimBonus, setCanClaimBonus] = useState(true)
  const [isRobotAnimating, setIsRobotAnimating] = useState(false)
  const [showRefuelDialog, setShowRefuelDialog] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [clickCount, setClickCount] = useState(() => {
    if (!currentUser) return 0
    return parseInt(localStorage.getItem(`adClickCount_${currentUser.id}`) || '0')
  })
  const [isHolding, setIsHolding] = useState(false)
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Получаем текущего робота пользователя
  const getUserRobot = () => {
    if (!currentUser) return { emoji: '🤖', image: '/img/0c89b02e-e86a-4f7d-ab06-628ffeff8291.jpg', tapPower: 1, name: 'Базовый робот' }
    
    const robotData = localStorage.getItem(`userRobot_${currentUser.id}`)
    if (!robotData) return { emoji: '🤖', image: '/img/0c89b02e-e86a-4f7d-ab06-628ffeff8291.jpg', tapPower: 1, name: 'Базовый робот' }
    
    const { robotId, purchaseDate } = JSON.parse(robotData)
    
    // Список роботов (должен совпадать с RobotsSection)
    const robots = {
      'basic': { emoji: '🤖', image: '/img/0c89b02e-e86a-4f7d-ab06-628ffeff8291.jpg', tapPower: 1, name: 'Базовый робот', lifespan: 999999 },
      'worker': { emoji: '👷‍♂️', image: '/img/6298380d-94b8-449b-8539-a248456cf888.jpg', tapPower: 2, name: 'Рабочий робот', lifespan: 30 },
      'engineer': { emoji: '👨‍💻', image: '/img/8b9dcf07-12d5-4043-a5a5-907c0a63627b.jpg', tapPower: 3, name: 'Инженер', lifespan: 45 },
      'scientist': { emoji: '👨‍🔬', image: '/img/2ec52712-5033-4e4d-91cd-4251a6f218c1.jpg', tapPower: 5, name: 'Учёный', lifespan: 60 },
      'commander': { emoji: '👨‍✈️', image: '/img/646c617e-8b01-47fc-a700-b85b270caaee.jpg', tapPower: 10, name: 'Командир', lifespan: 90 },
      'cyborg': { emoji: '🦾', image: '/img/89a0d696-e417-48e9-82be-fc15e0417ff4.jpg', tapPower: 20, name: 'Киборг', lifespan: 100 },
      'student': { emoji: '🎓', image: '/img/ac2ca91c-0b9f-44f7-b5b4-a2d871140891.jpg', tapPower: 35, name: 'Работа школьника', lifespan: 120 },
      'quantum': { emoji: '⚡', image: '/img/8e056dbc-5c2c-42e4-ae1e-4b9f2306236f.jpg', tapPower: 75, name: 'Квантовый титан', lifespan: 180 },
      'gingerbread': { emoji: '🍪', image: '/img/c8c90612-581c-47ce-b99a-4c397fa0f01b.jpg', tapPower: 40, name: 'Пряничный Робот', lifespan: 140 },
      'coffee': { emoji: '☕', image: '/img/82ee2bff-d0ba-488c-b30b-edf4b77af986.jpg', tapPower: 50, name: 'Кофейный робот', lifespan: 160 },
      'radionoumi': { emoji: '📻', image: '/img/f918766f-2718-497f-9cfb-29e12bc98904.jpg', tapPower: 85, name: 'Radio Noumi', lifespan: 190 },
      'autumn': { emoji: '🍂', image: '/img/1274db0f-36b9-4bb9-b0ce-0f4a14760b3b.jpg', tapPower: 100, name: 'Осенний робот', lifespan: 200 },
      'volcanic': { emoji: '🌋', image: '/img/ed865552-df19-4979-9421-f7ccc1c4d99d.jpg', tapPower: 150, name: 'Вулканический робот', lifespan: 250 },
      'emperor': { emoji: '👑', image: '/img/a04eb0c3-6ac8-46f6-913a-b04ddf509b96.jpg', tapPower: 300, name: 'Робот Император', lifespan: 500 }
    }
    
    const robot = robots[robotId as keyof typeof robots]
    if (!robot) return robots.basic
    
    // Проверяем срок жизни робота
    const daysPassed = Math.floor((Date.now() - purchaseDate) / (1000 * 60 * 60 * 24))
    if (daysPassed >= robot.lifespan && robotId !== 'basic') {
      // Срок истёк, возвращаем базового робота
      localStorage.setItem(`userRobot_${currentUser.id}`, JSON.stringify({
        robotId: 'basic',
        purchaseDate: Date.now()
      }))
      return robots.basic
    }
    
    return robot
  }

  const currentRobot = getUserRobot()
  const isVIP = currentUser ? localStorage.getItem(`vipStatus_${currentUser.id}`) === 'true' : false

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
        let restoreTimeMs
        
        if (hasUnlimitedEnergy) {
          restoreTimeMs = 15 * 60 * 1000 // 15 минут для безлимитной энергии
        } else if (isVIP) {
          restoreTimeMs = 1 * 60 * 60 * 1000 // 1 час для VIP
        } else {
          restoreTimeMs = 5 * 60 * 60 * 1000 // 5 часов для обычных пользователей
        }
        
        const restoreTime = currentUser.gameStats.energyDepletedAt + restoreTimeMs
        
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

  const hasUnlimitedEnergy = localStorage.getItem(`unlimitedEnergy_${currentUser.id}`) === 'true'
  
  const handleRobotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (currentUser.gameStats.tapsLeft > 0) {
      setIsRobotAnimating(true)
      setIsPulsing(true)
      setTimeout(() => setIsRobotAnimating(false), 400)
      setTimeout(() => setIsPulsing(false), 600)
      
      // Подсчёт кликов для показа рекламы (только для не-VIP пользователей)
      if (!isVIP) {
        const newClickCount = clickCount + 1
        setClickCount(newClickCount)
        localStorage.setItem(`adClickCount_${currentUser.id}`, newClickCount.toString())
        
        // Показываем рекламу каждые 50 кликов
        if (newClickCount % 50 === 0) {
          setShowAdModal(true)
          onAdModalStateChange?.(true)
        }
      }
    }
    onRobotTap(e)
  }

  const startHolding = () => {
    if (currentUser.gameStats.tapsLeft <= 0 || isHolding) return
    
    setIsHolding(true)
    
    // Начинаем автоматические тапы каждые 100мс
    holdIntervalRef.current = setInterval(() => {
      if (currentUser.gameStats.tapsLeft > 0) {
        setIsRobotAnimating(true)
        setTimeout(() => setIsRobotAnimating(false), 200)
        
        // Подсчёт кликов для показа рекламы (только для не-VIP пользователей)
        if (!isVIP) {
          const newClickCount = clickCount + 1
          setClickCount(newClickCount)
          localStorage.setItem(`adClickCount_${currentUser.id}`, newClickCount.toString())
          
          // Показываем рекламу каждые 50 кликов
          if (newClickCount % 50 === 0) {
            setShowAdModal(true)
            onAdModalStateChange?.(true)
          }
        }
        
        // Симулируем клик
        const fakeEvent = { 
          currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }) },
          clientX: 100,
          clientY: 100
        } as React.MouseEvent<HTMLButtonElement>
        onRobotTap(fakeEvent)
      } else {
        // Если энергия закончилась, останавливаем автотапы
        stopHolding()
      }
    }, 100)
  }
  
  const stopHolding = () => {
    setIsHolding(false)
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }
  
  // Очищаем интервал при размонтировании компонента
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current)
      }
    }
  }, [])

  const handleRefuelEnergy = () => {
    if (!currentUser || currentUser.gameStats.coins < 5000) {
      return
    }

    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins - 5000,
      tapsLeft: currentUser.gameStats.maxTaps,
      energyDepletedAt: null
    }

    onUpdateStats(updatedStats)
    setShowRefuelDialog(false)
  }



  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
      <StatsHeader 
        currentUser={currentUser} 
        onAutoTapClick={onAutoTapClick}
        onTabChange={onTabChange}
      />

      <div className="relative">
        <Button
          onClick={handleRobotClick}
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          disabled={currentUser.gameStats.tapsLeft <= 0}
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full p-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:via-purple-400 hover:to-pink-400 border-4 shadow-2xl overflow-hidden transition-all duration-500 animate-gradient-shift ${
            hasUnlimitedEnergy ? 'border-purple-400 shadow-purple-300/50 animate-energy-pulse' :
            isVIP ? 'border-yellow-400 shadow-yellow-300/50' : 'border-primary/30'
          } ${isAnimating ? 'animate-tap-bounce' : ''} ${isRobotAnimating ? 'animate-robot-active animate-tap-glow' : ''} ${
            isPulsing ? 'animate-click-pulse' : ''
          } ${
            currentUser.gameStats.tapsLeft > 0 ? 'hover:scale-105 cursor-pointer' : 'opacity-60'
          }`}
        >
          <img
            src={currentRobot.image}
            alt={currentRobot.name}
            className={`w-full h-full object-cover rounded-full transition-all duration-300 ${
              isRobotAnimating ? 'scale-110 brightness-110' : 'hover:scale-110'
            }`}
          />
          {hasUnlimitedEnergy && (
            <div className="absolute -top-2 -right-2 text-3xl animate-pulse">
              ⚡
            </div>
          )}
          {isVIP && !hasUnlimitedEnergy && (
            <div className="absolute -top-2 -right-2 text-3xl animate-pulse">
              👑
            </div>
          )}
        </Button>
      
        {coinAnimations.map(coin => (
          <div
            key={coin.id}
            className="absolute text-2xl font-bold text-secondary animate-coin-collect pointer-events-none"
            style={{ left: coin.x, top: coin.y }}
          >
            +{currentUser.gameStats.robotPower * currentRobot.tapPower}
          </div>
        ))}
      </div>

      {/* Информация о текущем роботе */}
      <div className="text-center space-y-1">
        <h3 className="font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
          {currentRobot.name}
          {isVIP && <span className="text-yellow-600">👑 VIP</span>}
        </h3>
        <p className="text-xs text-muted-foreground">
          Мощность тапа: {currentUser.gameStats.robotPower} × {currentRobot.tapPower} = {currentUser.gameStats.robotPower * currentRobot.tapPower} монет
        </p>
        {hasUnlimitedEnergy ? (
          <p className="text-xs text-purple-600 font-medium">
            ⚡ Безлимитная энергия: восстановление 15 минут
          </p>
        ) : isVIP ? (
          <p className="text-xs text-yellow-600 font-medium">
            ⚡ VIP восстановление энергии: 1 час вместо 5 часов
          </p>
        ) : null}
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span>Энергия: {currentUser.gameStats.tapsLeft}/{currentUser.gameStats.maxTaps}</span>
          {!isVIP && (
            <span className="text-xs text-muted-foreground">
              До рекламы: {50 - (clickCount % 50)} кликов
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary">⚡</span>
            {currentUser.gameStats.tapsLeft < currentUser.gameStats.maxTaps && (
              <Button
                onClick={() => setShowRefuelDialog(true)}
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
              >
                <Icon name="Fuel" size={12} />
              </Button>
            )}
            <Button
              onClick={onAutoTapClick}
              size="sm"
              variant="outline" 
              className="h-6 w-6 p-0"
            >
              <Icon name="Car" size={12} />
            </Button>
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

      {/* Модальное окно для восстановления энергии */}
      <Dialog open={showRefuelDialog} onOpenChange={setShowRefuelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Fuel" size={20} />
              Восстановление энергии
            </DialogTitle>
            <DialogDescription>
              Хотите мгновенно восстановить энергию до максимума?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Текущая энергия:</span>
                <span>{currentUser.gameStats.tapsLeft}/{currentUser.gameStats.maxTaps}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Стоимость восстановления:</span>
                <span className="text-secondary">5,000 💰</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ваши монеты:</span>
                <span className={currentUser.gameStats.coins >= 5000 ? 'text-green-600' : 'text-red-600'}>
                  {currentUser.gameStats.coins.toLocaleString()} 💰
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRefuelDialog(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleRefuelEnergy}
                disabled={currentUser.gameStats.coins < 5000}
                className="flex-1"
              >
                <Icon name="Zap" size={16} className="mr-2" />
                Заправить за 5,000
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Рекламное модальное окно */}
      <AdModal
        isOpen={showAdModal}
        onClose={() => {
          setShowAdModal(false)
          onAdModalStateChange?.(false)
        }}
        onReward={onAdReward}
      />
    </div>
  )
}