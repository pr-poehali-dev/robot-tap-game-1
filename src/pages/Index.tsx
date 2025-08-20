import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Icon from '@/components/ui/icon'

interface GameStats {
  coins: number
  dailyBonus: number
  tapsLeft: number
  maxTaps: number
  level: number
  robotPower: number
  totalEarned: number
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('game')
  const [gameStats, setGameStats] = useState<GameStats>({
    coins: 12500,
    dailyBonus: 50,
    tapsLeft: 87,
    maxTaps: 100,
    level: 3,
    robotPower: 10,
    totalEarned: 45230
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [coinAnimations, setCoinAnimations] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleRobotTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (gameStats.tapsLeft <= 0) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsAnimating(true)
    setCoinAnimations(prev => [...prev, { id: Date.now(), x, y }])
    
    setGameStats(prev => ({
      ...prev,
      coins: prev.coins + prev.robotPower,
      tapsLeft: prev.tapsLeft - 1,
      totalEarned: prev.totalEarned + prev.robotPower
    }))
    
    setTimeout(() => setIsAnimating(false), 300)
    setTimeout(() => setCoinAnimations(prev => prev.slice(1)), 1000)
  }

  const claimDailyBonus = () => {
    setGameStats(prev => ({
      ...prev,
      coins: prev.coins + prev.dailyBonus,
      totalEarned: prev.totalEarned + prev.dailyBonus
    }))
  }

  const upgradeRobot = () => {
    const upgradeCost = gameStats.level * 1000
    if (gameStats.coins >= upgradeCost) {
      setGameStats(prev => ({
        ...prev,
        coins: prev.coins - upgradeCost,
        level: prev.level + 1,
        robotPower: prev.robotPower + 5
      }))
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        tapsLeft: Math.min(prev.tapsLeft + 1, prev.maxTaps)
      }))
    }, 180000) // 3 минуты = 180 секунд
    
    return () => clearInterval(timer)
  }, [])

  const tabs = [
    { id: 'game', label: 'Игра', icon: 'Gamepad2' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'upgrades', label: 'Улучшения', icon: 'Zap' },
    { id: 'withdraw', label: 'Вывод', icon: 'Wallet' },
    { id: 'rating', label: 'Рейтинг', icon: 'Trophy' },
    { id: 'tasks', label: 'Задания', icon: 'CheckSquare' }
  ]

  const renderGameTab = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{gameStats.coins.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Монеты</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">+{gameStats.robotPower}</div>
            <div className="text-sm text-muted-foreground">За тап</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Button
          onClick={handleRobotTap}
          disabled={gameStats.tapsLeft <= 0}
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
            +{gameStats.robotPower}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm">
          <span>Энергия: {gameStats.tapsLeft}/{gameStats.maxTaps}</span>
          <span className="text-primary">⚡</span>
        </div>
        <Progress value={(gameStats.tapsLeft / gameStats.maxTaps) * 100} className="h-3" />
      </div>

      <Button onClick={claimDailyBonus} className="w-full max-w-md bg-secondary hover:bg-secondary/90">
        <Icon name="Gift" className="mr-2" />
        Получить дневной бонус: {gameStats.dailyBonus} монет
      </Button>
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="User" size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Игрок #{Math.floor(Math.random() * 10000)}</h2>
          <Badge variant="secondary">Уровень {gameStats.level}</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-primary">{gameStats.totalEarned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Всего заработано</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-secondary">{(gameStats.totalEarned / 10000).toFixed(2)} ₽</div>
            <div className="text-sm text-muted-foreground">В рублях</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderUpgradesTab = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Улучшения робота</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Мощность робота</h3>
              <p className="text-sm text-muted-foreground">Текущий уровень: {gameStats.level}</p>
            </div>
            <Badge variant="outline">{gameStats.robotPower} монет/тап</Badge>
          </div>
          <Button 
            onClick={upgradeRobot}
            disabled={gameStats.coins < gameStats.level * 1000}
            className="w-full"
          >
            Улучшить за {(gameStats.level * 1000).toLocaleString()} монет
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Энергия</h3>
              <p className="text-sm text-muted-foreground">Максимум тапов: {gameStats.maxTaps}</p>
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

  const renderWithdrawTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Вывод средств</h2>
          <div className="text-4xl font-bold text-primary mb-2">{gameStats.coins.toLocaleString()}</div>
          <div className="text-lg text-secondary">{(gameStats.coins / 10000).toFixed(2)} ₽</div>
          <p className="text-sm text-muted-foreground mt-2">10,000 монет = 1 рубль</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button 
          disabled={gameStats.coins < 10000} 
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Icon name="Banknote" className="mr-2" />
          Подать заявку на вывод
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          Минимальная сумма для вывода: 10,000 монет (1₽)
        </div>
      </div>
    </div>
  )

  const renderRatingTab = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Топ игроков</h2>
      
      {[1,2,3,4,5].map((position) => (
        <Card key={position}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant={position <= 3 ? "default" : "outline"}>#{position}</Badge>
              <div>
                <div className="font-semibold">Игрок #{Math.floor(Math.random() * 10000)}</div>
                <div className="text-sm text-muted-foreground">Уровень {Math.floor(Math.random() * 10) + 1}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">{(Math.floor(Math.random() * 100000) + 10000).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">монет</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTasksTab = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Ежедневные задания</h2>
      
      {[
        { title: "Сделать 50 тапов", reward: 500, completed: true },
        { title: "Войти в игру", reward: 100, completed: true },
        { title: "Улучшить робота", reward: 1000, completed: false },
        { title: "Пригласить друга", reward: 5000, completed: false }
      ].map((task, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={task.completed ? "CheckCircle" : "Circle"} 
                className={task.completed ? "text-green-500" : "text-muted-foreground"} 
              />
              <div>
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm text-secondary">+{task.reward} монет</div>
              </div>
            </div>
            <Button 
              size="sm" 
              disabled={task.completed}
              variant={task.completed ? "outline" : "default"}
            >
              {task.completed ? "Выполнено" : "Выполнить"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'game': return renderGameTab()
      case 'profile': return renderProfileTab()
      case 'upgrades': return renderUpgradesTab()
      case 'withdraw': return renderWithdrawTab()
      case 'rating': return renderRatingTab()
      case 'tasks': return renderTasksTab()
      default: return renderGameTab()
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Robot Tap Game
          </h1>
          <p className="text-muted-foreground">Тапай робота и зарабатывай монеты!</p>
        </div>

        <div className="max-w-md mx-auto">
          {renderActiveTab()}
        </div>
      </div>

      {/* Нижняя навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-6 gap-1 p-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center py-3 h-auto"
            >
              <Icon name={tab.icon as any} size={18} />
              <span className="text-xs mt-1">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}