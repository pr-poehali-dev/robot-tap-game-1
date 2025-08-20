import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User } from './GameSection'

interface UpgradesSectionProps {
  currentUser: User | null
  onUpgradeRobot: () => void
}

export default function UpgradesSection({ currentUser, onUpgradeRobot }: UpgradesSectionProps) {
  if (!currentUser) {
    return null
  }

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
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          <Button disabled className="w-full">
            Скоро доступно
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}