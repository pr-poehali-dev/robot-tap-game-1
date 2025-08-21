import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User, GameStats } from './GameSection'

interface AutoSectionProps {
  currentUser: User | null
  onUpdateStats: (stats: GameStats) => void
}

export default function AutoSection({ currentUser, onUpdateStats }: AutoSectionProps) {
  const [timeToAutoTap, setTimeToAutoTap] = useState('')
  const [autoTapStatus, setAutoTapStatus] = useState<'inactive' | 'charging' | 'active'>('inactive')
  
  const AUTO_TAP_COST = 15000
  const AUTO_TAP_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 дней в миллисекундах
  const CHARGE_TIME = 5 * 60 * 60 * 1000 // 5 часов в миллисекундах

  const getAutoTapStatus = () => {
    if (!currentUser?.gameStats.autoTapData) {
      return { status: 'inactive', timeLeft: '', canActivate: true }
    }

    const { activatedAt, expiresAt, chargingStarted } = currentUser.gameStats.autoTapData
    const now = new Date().getTime()

    // Если автотап истек
    if (expiresAt && now > expiresAt) {
      return { status: 'inactive', timeLeft: '', canActivate: true }
    }

    // Если сейчас заряжается
    if (chargingStarted && !activatedAt) {
      const chargeEndTime = chargingStarted + CHARGE_TIME
      if (now < chargeEndTime) {
        const timeLeft = chargeEndTime - now
        const hours = Math.floor(timeLeft / (60 * 60 * 1000))
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
        return { 
          status: 'charging', 
          timeLeft: hours > 0 ? `${hours}ч ${minutes}мин` : `${minutes}мин`,
          canActivate: false
        }
      } else {
        return { status: 'charged', timeLeft: '', canActivate: false }
      }
    }

    // Если активен
    if (activatedAt && expiresAt) {
      const timeLeft = expiresAt - now
      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000))
        const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        return { 
          status: 'active', 
          timeLeft: days > 0 ? `${days}д ${hours}ч` : `${hours}ч`,
          canActivate: false
        }
      }
    }

    return { status: 'inactive', timeLeft: '', canActivate: true }
  }

  const handlePurchaseAutoTap = () => {
    if (!currentUser || currentUser.gameStats.coins < AUTO_TAP_COST) {
      alert('Недостаточно монет для покупки автотапа!')
      return
    }

    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins - AUTO_TAP_COST,
      autoTapData: {
        chargingStarted: new Date().getTime(),
        activatedAt: null,
        expiresAt: null
      }
    }

    onUpdateStats(updatedStats)
  }

  const handleActivateAutoTap = () => {
    if (!currentUser?.gameStats.autoTapData) return

    const now = new Date().getTime()
    const updatedStats = {
      ...currentUser.gameStats,
      autoTapData: {
        ...currentUser.gameStats.autoTapData,
        activatedAt: now,
        expiresAt: now + AUTO_TAP_DURATION
      }
    }

    onUpdateStats(updatedStats)
  }

  useEffect(() => {
    if (!currentUser) return

    const updateStatus = () => {
      const status = getAutoTapStatus()
      setAutoTapStatus(status.status as any)
      setTimeToAutoTap(status.timeLeft)

      // Автоматически активируем когда зарядка завершена
      if (status.status === 'charged') {
        handleActivateAutoTap()
      }
    }

    updateStatus()
    const timer = setInterval(updateStatus, 60000) // Обновляем каждую минуту

    return () => clearInterval(timer)
  }, [currentUser])

  // Автоматический тап каждые 3 минуты когда активен
  useEffect(() => {
    if (!currentUser || autoTapStatus !== 'active') return

    const autoTapInterval = setInterval(() => {
      if (currentUser.gameStats.tapsLeft > 0) {
        const updatedStats = {
          ...currentUser.gameStats,
          coins: currentUser.gameStats.coins + currentUser.gameStats.robotPower,
          tapsLeft: currentUser.gameStats.tapsLeft - 1,
          totalEarned: currentUser.gameStats.totalEarned + currentUser.gameStats.robotPower
        }
        onUpdateStats(updatedStats)
      }
    }, 180000) // Каждые 3 минуты

    return () => clearInterval(autoTapInterval)
  }, [currentUser, autoTapStatus])

  if (!currentUser) {
    return (
      <div className="text-center space-y-4">
        <Icon name="Lock" size={64} className="mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Требуется авторизация</h3>
        <p className="text-muted-foreground">Войдите в аккаунт чтобы использовать автотап</p>
      </div>
    )
  }

  const status = getAutoTapStatus()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Icon name="Bot" size={20} />
            Автоматический тап
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-gradient-to-b from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Icon name="Zap" size={40} className="text-white sm:w-12 sm:h-12" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-semibold">
                {autoTapStatus === 'inactive' && 'Автотап неактивен'}
                {autoTapStatus === 'charging' && 'Зарядка автотапа'}
                {autoTapStatus === 'active' && 'Автотап активен'}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {autoTapStatus === 'inactive' && 'Активируйте автотап для автоматического заработка'}
                {autoTapStatus === 'charging' && `Автотап будет готов через: ${timeToAutoTap}`}
                {autoTapStatus === 'active' && `Остается времени: ${timeToAutoTap}`}
              </p>
            </div>
          </div>

          <div className="bg-secondary/20 p-3 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Как работает автотап:</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                <span>Покупаете автотап за {AUTO_TAP_COST.toLocaleString()} монет</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                <span>Ждете 5 часов для полной зарядки</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                <span>Автотап активируется автоматически на 30 дней</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">4.</span>
                <span>Робот тапает каждые 3 минуты автоматически</span>
              </div>
            </div>
          </div>

          {autoTapStatus === 'inactive' && (
            <Button 
              onClick={handlePurchaseAutoTap}
              disabled={currentUser.gameStats.coins < AUTO_TAP_COST}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Icon name="ShoppingCart" className="mr-2" />
              Купить автотап за {AUTO_TAP_COST.toLocaleString()} монет
            </Button>
          )}

          {autoTapStatus === 'charging' && (
            <div className="text-center">
              <div className="bg-yellow-500/20 text-yellow-600 p-3 rounded-lg">
                <Icon name="Clock" className="mx-auto mb-2" />
                <p>Автотап заряжается...</p>
                <p className="text-sm">Осталось: {timeToAutoTap}</p>
              </div>
            </div>
          )}

          {autoTapStatus === 'active' && (
            <div className="text-center">
              <div className="bg-green-500/20 text-green-600 p-3 rounded-lg">
                <Icon name="CheckCircle" className="mx-auto mb-2" />
                <p>Автотап работает!</p>
                <p className="text-sm">Осталось: {timeToAutoTap}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}