import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, GameStats } from './GameSection'

interface UpgradesSectionProps {
  currentUser: User | null
  onUpgradeRobot: () => void
  onUpdateStats: (stats: GameStats) => void
}

export default function UpgradesSection({ currentUser, onUpgradeRobot, onUpdateStats }: UpgradesSectionProps) {
  if (!currentUser) {
    return null
  }

  const handleUpgradeEnergy = () => {
    if (!currentUser || currentUser.gameStats.coins < 2000) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins - 2000,
      maxTaps: currentUser.gameStats.maxTaps + 20,
      tapsLeft: currentUser.gameStats.tapsLeft + 20
    }
    
    onUpdateStats(updatedStats)
  }

  const handleBuyVIP = () => {
    if (!currentUser || currentUser.gameStats.coins < 50000) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins - 50000
    }
    
    // Сохраняем VIP статус
    localStorage.setItem(`vipStatus_${currentUser.id}`, 'true')
    onUpdateStats(updatedStats)
  }

  const isVIP = localStorage.getItem(`vipStatus_${currentUser.id}`) === 'true'

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Улучшения робота</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Мощность робота</h3>
              <p className="text-sm text-muted-foreground">Текущий уровень: {currentUser.gameStats.level}</p>
            </div>
            <Badge variant="outline">{currentUser.gameStats.robotPower} монет/тап</Badge>
          </div>
          <Button 
            onClick={onUpgradeRobot}
            disabled={currentUser.gameStats.coins < currentUser.gameStats.level * 1000}
            className="w-full"
          >
            Улучшить за {(currentUser.gameStats.level * 1000).toLocaleString()} монет
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Энергия</h3>
              <p className="text-sm text-muted-foreground">Максимум тапов: {currentUser.gameStats.maxTaps}</p>
            </div>
            <Badge variant="outline">+20 тапов</Badge>
          </div>
          <Button 
            onClick={handleUpgradeEnergy}
            disabled={currentUser.gameStats.coins < 2000}
            className="w-full"
          >
            Улучшить за 2,000 монет
          </Button>
        </CardContent>
      </Card>

      <Card className={isVIP ? "border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                👑 VIP статус
                {isVIP && <span className="text-yellow-600">✨ Активен</span>}
              </h3>
              <p className="text-sm text-muted-foreground">
                Восстановление энергии: {isVIP ? '1 час' : '5 часов → 1 час'}
              </p>
            </div>
            <Badge variant={isVIP ? "default" : "outline"} className={isVIP ? "bg-yellow-500" : ""}>
              {isVIP ? "VIP" : "Премиум"}
            </Badge>
          </div>
          <Button 
            onClick={handleBuyVIP}
            disabled={currentUser.gameStats.coins < 50000 || isVIP}
            className={`w-full ${isVIP ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
          >
            {isVIP ? '✅ VIP приобретен' : 'Купить VIP за 50,000 монет'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}