import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { User, GameStats } from './GameSection'

interface Robot {
  id: string
  name: string
  emoji: string
  price: number
  tapPower: number
  lifespan: number // в днях
  description: string
}

interface RobotsSectionProps {
  currentUser: User | null
  onUpdateStats: (stats: GameStats) => void
}

const availableRobots: Robot[] = [
  {
    id: 'basic',
    name: 'Базовый робот',
    emoji: '🤖',
    price: 0,
    tapPower: 1,
    lifespan: 999999,
    description: 'Стандартный робот'
  },
  {
    id: 'worker',
    name: 'Рабочий робот',
    emoji: '👷‍♂️',
    price: 5000,
    tapPower: 2,
    lifespan: 30,
    description: 'Добывает в 2 раза больше монет'
  },
  {
    id: 'engineer',
    name: 'Инженер',
    emoji: '👨‍💻',
    price: 15000,
    tapPower: 3,
    lifespan: 45,
    description: 'Умный робот с тройной мощностью'
  },
  {
    id: 'scientist',
    name: 'Учёный',
    emoji: '👨‍🔬',
    price: 50000,
    tapPower: 5,
    lifespan: 60,
    description: 'Продвинутый робот-исследователь'
  },
  {
    id: 'commander',
    name: 'Командир',
    emoji: '👨‍✈️',
    price: 150000,
    tapPower: 10,
    lifespan: 90,
    description: 'Элитный робот высшего класса'
  },
  {
    id: 'cyborg',
    name: 'Киборг',
    emoji: '🦾',
    price: 500000,
    tapPower: 20,
    lifespan: 100,
    description: 'Легендарный робот будущего'
  }
]

export default function RobotsSection({ currentUser, onUpdateStats }: RobotsSectionProps) {
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)

  if (!currentUser) {
    return null
  }

  // Получаем текущего робота пользователя
  const getUserRobot = () => {
    const robotData = localStorage.getItem(`userRobot_${currentUser.id}`)
    if (!robotData) return availableRobots[0] // базовый робот по умолчанию
    
    const { robotId, purchaseDate } = JSON.parse(robotData)
    const robot = availableRobots.find(r => r.id === robotId)
    if (!robot) return availableRobots[0]
    
    // Проверяем не истёк ли срок жизни робота
    const daysPassed = Math.floor((Date.now() - purchaseDate) / (1000 * 60 * 60 * 24))
    if (daysPassed >= robot.lifespan && robot.id !== 'basic') {
      // Срок жизни истёк, возвращаем базового робота
      localStorage.setItem(`userRobot_${currentUser.id}`, JSON.stringify({
        robotId: 'basic',
        purchaseDate: Date.now()
      }))
      return availableRobots[0]
    }
    
    return robot
  }

  const currentRobot = getUserRobot()

  const handleBuyRobot = (robot: Robot) => {
    if (currentUser.gameStats.coins < robot.price) {
      return // Недостаточно монет
    }

    // Списываем монеты
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins - robot.price
    }

    // Сохраняем нового робота
    localStorage.setItem(`userRobot_${currentUser.id}`, JSON.stringify({
      robotId: robot.id,
      purchaseDate: Date.now()
    }))

    onUpdateStats(updatedStats)
    setSelectedRobot(null)
  }

  const getRemainingDays = (robot: Robot) => {
    if (robot.id === 'basic') return '∞'
    
    const robotData = localStorage.getItem(`userRobot_${currentUser.id}`)
    if (!robotData) return robot.lifespan
    
    const { purchaseDate } = JSON.parse(robotData)
    const daysPassed = Math.floor((Date.now() - purchaseDate) / (1000 * 60 * 60 * 24))
    const remaining = Math.max(0, robot.lifespan - daysPassed)
    
    return remaining
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">🤖 Роботы</h1>
        <p className="text-muted-foreground text-sm">
          Покупайте роботов для увеличения добычи монет
        </p>
      </div>

      {/* Текущий робот */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bot" size={20} />
            Текущий робот
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{currentRobot.emoji}</span>
            <div className="flex-1">
              <h3 className="font-semibold">{currentRobot.name}</h3>
              <p className="text-sm text-muted-foreground">{currentRobot.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">
                  <Icon name="Zap" size={14} className="mr-1" />
                  {currentRobot.tapPower}x монет
                </Badge>
                <Badge variant="outline">
                  <Icon name="Clock" size={14} className="mr-1" />
                  {currentRobot.id === currentRobot.id ? getRemainingDays(currentRobot) : currentRobot.lifespan} дней
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Доступные роботы */}
      <div className="grid gap-3">
        <h2 className="text-lg font-semibold">Магазин роботов</h2>
        {availableRobots.slice(1).map((robot) => (
          <Card 
            key={robot.id}
            className={`transition-colors ${
              selectedRobot === robot.id ? 'border-primary' : ''
            } ${currentUser.gameStats.coins < robot.price ? 'opacity-50' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{robot.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{robot.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{robot.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      <Icon name="Zap" size={12} className="mr-1" />
                      {robot.tapPower}x монет
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Icon name="Clock" size={12} className="mr-1" />
                      {robot.lifespan} дней
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Icon name="Coins" size={16} />
                      <span className="font-semibold text-yellow-600">
                        {robot.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleBuyRobot(robot)}
                      disabled={
                        currentUser.gameStats.coins < robot.price || 
                        currentRobot.id === robot.id
                      }
                    >
                      {currentRobot.id === robot.id ? 'Активен' : 'Купить'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Информация */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="mt-0.5 text-blue-500" />
            <div className="text-sm">
              <p className="mb-1">
                <strong>Как работают роботы:</strong>
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Каждый робот увеличивает количество монет за тап</li>
                <li>• У роботов есть срок жизни (кроме базового)</li>
                <li>• После окончания срока робот заменяется на базового</li>
                <li>• Более дорогие роботы живут дольше и дают больше монет</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}