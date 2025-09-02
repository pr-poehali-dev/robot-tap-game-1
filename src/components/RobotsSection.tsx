import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { User, GameStats } from './GameSection'

interface Robot {
  id: string
  name: string
  emoji: string
  image: string
  price: number
  tapPower: number
  lifespan: number // в днях
  description: string
  availableFrom?: Date // дата когда робот станет доступным
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
    image: '/img/0c89b02e-e86a-4f7d-ab06-628ffeff8291.jpg',
    price: 0,
    tapPower: 1,
    lifespan: 999999,
    description: 'Стандартный робот'
  },
  {
    id: 'worker',
    name: 'Рабочий робот',
    emoji: '👷‍♂️',
    image: '/img/6298380d-94b8-449b-8539-a248456cf888.jpg',
    price: 120000,
    tapPower: 2,
    lifespan: 30,
    description: 'Добывает в 2 раза больше монет'
  },
  {
    id: 'engineer',
    name: 'Инженер',
    emoji: '👨‍💻',
    image: '/img/8b9dcf07-12d5-4043-a5a5-907c0a63627b.jpg',
    price: 15000,
    tapPower: 3,
    lifespan: 45,
    description: 'Умный робот с тройной мощностью'
  },
  {
    id: 'scientist',
    name: 'Учёный',
    emoji: '👨‍🔬',
    image: '/img/2ec52712-5033-4e4d-91cd-4251a6f218c1.jpg',
    price: 50000,
    tapPower: 5,
    lifespan: 60,
    description: 'Продвинутый робот-исследователь'
  },
  {
    id: 'commander',
    name: 'Командир',
    emoji: '👨‍✈️',
    image: '/img/646c617e-8b01-47fc-a700-b85b270caaee.jpg',
    price: 150000,
    tapPower: 10,
    lifespan: 90,
    description: 'Элитный робот высшего класса'
  },
  {
    id: 'cyborg',
    name: 'Киборг',
    emoji: '🦾',
    image: '/img/89a0d696-e417-48e9-82be-fc15e0417ff4.jpg',
    price: 500000,
    tapPower: 20,
    lifespan: 100,
    description: 'Легендарный робот будущего'
  },
  {
    id: 'student',
    name: 'Работа школьника',
    emoji: '🎓',
    image: '/img/ac2ca91c-0b9f-44f7-b5b4-a2d871140891.jpg',
    price: 780000,
    tapPower: 35,
    lifespan: 120,
    description: 'Умный ученик готов к новому учебному году!'
  },
  {
    id: 'quantum',
    name: 'Квантовый титан',
    emoji: '⚡',
    image: '/img/8e056dbc-5c2c-42e4-ae1e-4b9f2306236f.jpg',
    price: 5700000,
    tapPower: 75,
    lifespan: 180,
    description: 'Элитный робот будущего с квантовой технологией'
  },
  {
    id: 'gingerbread',
    name: 'Пряничный Робот',
    emoji: '🍪',
    image: '/img/c8c90612-581c-47ce-b99a-4c397fa0f01b.jpg',
    price: 1700000,
    tapPower: 40,
    lifespan: 140,
    description: 'Сладкий помощник с новогодним настроением!'
  },
  {
    id: 'coffee',
    name: 'Кофейный робот',
    emoji: '☕',
    image: '/img/82ee2bff-d0ba-488c-b30b-edf4b77af986.jpg',
    price: 3450000,
    tapPower: 50,
    lifespan: 160,
    description: 'Бодрящий робот для истинных кофеманов!'
  },
  {
    id: 'radionoumi',
    name: 'Radio Noumi',
    emoji: '📻',
    image: '/img/f918766f-2718-497f-9cfb-29e12bc98904.jpg',
    price: 9800500,
    tapPower: 85,
    lifespan: 190,
    description: 'Высокотехнологичный робот с системой радиосвязи!'
  },
  {
    id: 'autumn',
    name: 'Осенний робот',
    emoji: '🍂',
    image: '/img/1274db0f-36b9-4bb9-b0ce-0f4a14760b3b.jpg',
    price: 15980752,
    tapPower: 100,
    lifespan: 200,
    description: 'Сезонный робот с силой осеннего урожая!',
    availableFrom: new Date('2025-09-01')
  },
  {
    id: 'volcanic',
    name: 'Вулканический робот',
    emoji: '🌋',
    image: '/img/ed865552-df19-4979-9421-f7ccc1c4d99d.jpg',
    price: 58250956,
    tapPower: 150,
    lifespan: 250,
    description: 'Огненная мощь вулкана в металлическом корпусе!'
  },
  {
    id: 'emperor',
    name: 'Робот Император',
    emoji: '👑',
    image: '/img/a04eb0c3-6ac8-46f6-913a-b04ddf509b96.jpg',
    price: 15000000000,
    tapPower: 300,
    lifespan: 500,
    description: 'Величественный император роботов с непревзойденной мощью!'
  }
]

export default function RobotsSection({ currentUser, onUpdateStats }: RobotsSectionProps) {
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  const currentRobot = useMemo(() => getUserRobot(), [refreshTrigger, currentUser.id])

  const handleBuyRobot = (robot: Robot) => {
    if (currentUser.gameStats.coins < robot.price) {
      return // Недостаточно монет
    }

    // Записываем трату в историю
    const spentHistory = JSON.parse(localStorage.getItem(`spentHistory_${currentUser.id}`) || '[]')
    spentHistory.push({
      id: Date.now(),
      type: 'robot',
      itemName: robot.name,
      amount: robot.price,
      timestamp: Date.now(),
      date: new Date().toISOString()
    })
    localStorage.setItem(`spentHistory_${currentUser.id}`, JSON.stringify(spentHistory))

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
    setRefreshTrigger(prev => prev + 1)
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

  const isRobotAvailable = (robot: Robot) => {
    if (!robot.availableFrom) return true
    const now = new Date()
    return now >= robot.availableFrom
  }

  const getAvailabilityText = (robot: Robot) => {
    if (!robot.availableFrom) return null
    const now = new Date()
    if (now < robot.availableFrom) {
      return `Доступен с ${robot.availableFrom.toLocaleDateString('ru-RU')}`
    }
    return null
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
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <img 
                src={currentRobot.image}
                alt={currentRobot.name}
                className="w-full h-full object-cover"
              />
            </div>
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
        {availableRobots.slice(1).map((robot) => {
          const available = isRobotAvailable(robot)
          const availabilityText = getAvailabilityText(robot)
          
          return (
          <Card 
            key={robot.id}
            className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              selectedRobot === robot.id ? 'border-primary shadow-lg' : ''
            } ${currentUser.gameStats.coins < robot.price || !available ? 'opacity-50' : 'hover:border-primary/50'}
            ${currentRobot.id === robot.id ? 'border-green-500 bg-green-50/50' : ''}
            ${robot.id === 'autumn' ? 'border-orange-400/50 bg-gradient-to-br from-orange-50/30 to-yellow-50/20' : ''}
            ${robot.id === 'volcanic' ? 'border-red-500/50 bg-gradient-to-br from-red-50/30 to-orange-50/20' : ''}`}
          >
            <CardContent className="p-0">
              <div className="flex">
                {/* Красивое изображение робота */}
                <div className={`w-32 h-40 relative rounded-l-lg overflow-hidden ${
                  robot.id === 'quantum'
                    ? 'bg-gradient-to-br from-blue-600/30 via-purple-600/25 to-cyan-600/20 relative animate-pulse'
                    : robot.id === 'student'
                    ? 'bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 relative'
                    : robot.id === 'cyborg' 
                    ? 'bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 animate-pulse' 
                    : robot.id === 'commander'
                    ? 'bg-gradient-to-br from-yellow-500/15 via-orange-500/15 to-red-500/15'
                    : robot.id === 'scientist'
                    ? 'bg-gradient-to-br from-green-500/15 via-emerald-500/15 to-teal-500/15'
                    : robot.id === 'autumn'
                    ? 'bg-gradient-to-br from-orange-500/25 via-yellow-500/20 to-red-500/15 relative'
                    : robot.id === 'volcanic'
                    ? 'bg-gradient-to-br from-red-500/30 via-orange-500/25 to-yellow-500/15 relative animate-pulse'
                    : 'bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10'
                }`}>
                  <img 
                    src={robot.image}
                    alt={robot.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
                      robot.id === 'quantum'
                        ? 'hover:scale-115 filter hover:brightness-125 hover:saturate-150'
                        : robot.id === 'student' 
                        ? 'hover:scale-110 filter hover:brightness-110'
                        : robot.id === 'cyborg' 
                        ? 'hover:scale-110 filter hover:brightness-110'
                        : robot.id === 'volcanic'
                        ? 'hover:scale-115 filter hover:brightness-125 hover:saturate-150'
                        : 'hover:scale-105'
                    }`}
                  />
                  {robot.id === 'quantum' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-400/5 to-purple-400/15 pointer-events-none" />
                      <div className="absolute top-1 right-1 text-xs animate-ping">⚡</div>
                      <div className="absolute bottom-1 left-1 text-xs animate-pulse">⭐</div>
                      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg animate-pulse" />
                    </>
                  )}
                  {robot.id === 'student' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-400/10 pointer-events-none" />
                      <div className="absolute top-2 right-2 text-xl animate-bounce">🍎</div>
                    </>
                  )}
                  {robot.id === 'cyborg' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-cyan-400/10 pointer-events-none" />
                  )}
                  {robot.id === 'autumn' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-400/5 to-yellow-400/15 pointer-events-none" />
                      <div className="absolute top-2 right-2 text-lg animate-bounce">🍂</div>
                      <div className="absolute bottom-2 left-2 text-sm animate-pulse">🍁</div>
                      {!available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-xs text-center px-2">
                            🔒<br/>с 1 сентября
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {robot.id === 'volcanic' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-red-400/10 to-orange-400/20 pointer-events-none" />
                      <div className="absolute top-1 right-1 text-xs animate-ping">🔥</div>
                      <div className="absolute top-2 left-2 text-lg animate-bounce">🌋</div>
                      <div className="absolute bottom-1 right-1 text-xs animate-pulse">💥</div>
                      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-lg animate-pulse" />
                    </>
                  )}
                </div>
                
                {/* Информация о роботе */}
                <div className="flex-1 p-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-bold text-lg">{robot.name}</h3>
                      <p className="text-sm text-muted-foreground">{robot.description}</p>
                      {availabilityText && (
                        <p className="text-xs text-orange-600 font-medium mt-1">
                          🔒 {availabilityText}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Icon name="Zap" size={12} className="mr-1" />
                        {robot.tapPower}x мощность
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Clock" size={12} className="mr-1" />
                        {robot.lifespan} дней
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <Icon name="Coins" size={18} className="text-yellow-500" />
                        <span className="font-bold text-lg text-yellow-600">
                          {robot.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleBuyRobot(robot)}
                        disabled={
                          currentUser.gameStats.coins < robot.price || 
                          currentRobot.id === robot.id ||
                          !available
                        }
                        className={currentRobot.id === robot.id ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {!available ? (
                          <>
                            <Icon name="Lock" size={16} className="mr-1" />
                            Заблокирован
                          </>
                        ) : currentRobot.id === robot.id ? (
                          <>
                            <Icon name="Check" size={16} className="mr-1" />
                            Активен
                          </>
                        ) : (
                          <>
                            <Icon name="ShoppingCart" size={16} className="mr-1" />
                            Купить
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          )
        })}
      </div>

      {/* Информация */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="mt-0.5 text-blue-500" />
            <div className="text-sm">
              <p className="mb-2 text-foreground font-semibold">
                Как работают роботы:
              </p>
              <ul className="text-sm text-foreground/80 space-y-2">
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