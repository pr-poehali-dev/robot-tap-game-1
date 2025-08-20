import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface User {
  id: string
  username: string
  email: string
  gameStats: GameStats
  registeredAt: string
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('game')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  const [isAnimating, setIsAnimating] = useState(false)
  const [coinAnimations, setCoinAnimations] = useState<Array<{ id: number; x: number; y: number }>>([])

  const initialGameStats: GameStats = {
    coins: 0,
    dailyBonus: 50,
    tapsLeft: 100,
    maxTaps: 100,
    level: 1,
    robotPower: 10,
    totalEarned: 0
  }

  const handleRegister = () => {
    if (!authForm.username || !authForm.email || !authForm.password) return
    
    const newUser: User = {
      id: Date.now().toString(),
      username: authForm.username,
      email: authForm.email,
      gameStats: { ...initialGameStats },
      registeredAt: new Date().toISOString()
    }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    users.push(newUser)
    localStorage.setItem('robotGameUsers', JSON.stringify(users))
    localStorage.setItem('currentUserId', newUser.id)
    
    setCurrentUser(newUser)
    setAuthForm({ username: '', email: '', password: '' })
  }

  const handleLogin = () => {
    if (!authForm.username || !authForm.password) return
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const user = users.find((u: User) => u.username === authForm.username)
    
    if (user) {
      localStorage.setItem('currentUserId', user.id)
      setCurrentUser(user)
      setAuthForm({ username: '', email: '', password: '' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUserId')
    setCurrentUser(null)
    setActiveTab('game')
  }

  const handleRobotTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentUser || currentUser.gameStats.tapsLeft <= 0) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsAnimating(true)
    setCoinAnimations(prev => [...prev, { id: Date.now(), x, y }])
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + currentUser.gameStats.robotPower,
      tapsLeft: currentUser.gameStats.tapsLeft - 1,
      totalEarned: currentUser.gameStats.totalEarned + currentUser.gameStats.robotPower
    }
    
    const updatedUser = { ...currentUser, gameStats: updatedStats }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
    users[userIndex] = updatedUser
    localStorage.setItem('robotGameUsers', JSON.stringify(users))
    
    setCurrentUser(updatedUser)
    
    setTimeout(() => setIsAnimating(false), 300)
    setTimeout(() => setCoinAnimations(prev => prev.slice(1)), 1000)
  }

  const claimDailyBonus = () => {
    if (!currentUser) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + currentUser.gameStats.dailyBonus,
      totalEarned: currentUser.gameStats.totalEarned + currentUser.gameStats.dailyBonus
    }
    
    const updatedUser = { ...currentUser, gameStats: updatedStats }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
    users[userIndex] = updatedUser
    localStorage.setItem('robotGameUsers', JSON.stringify(users))
    
    setCurrentUser(updatedUser)
  }

  const upgradeRobot = () => {
    if (!currentUser) return
    
    const upgradeCost = currentUser.gameStats.level * 1000
    if (currentUser.gameStats.coins >= upgradeCost) {
      const updatedStats = {
        ...currentUser.gameStats,
        coins: currentUser.gameStats.coins - upgradeCost,
        level: currentUser.gameStats.level + 1,
        robotPower: currentUser.gameStats.robotPower + 5
      }
      
      const updatedUser = { ...currentUser, gameStats: updatedStats }
      
      const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
      const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
      users[userIndex] = updatedUser
      localStorage.setItem('robotGameUsers', JSON.stringify(users))
      
      setCurrentUser(updatedUser)
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId')
    if (savedUserId) {
      const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
      const user = users.find((u: User) => u.id === savedUserId)
      if (user) {
        setCurrentUser(user)
      }
    }
  }, [])

  useEffect(() => {
    if (!currentUser) return
    
    const timer = setInterval(() => {
      const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
      const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
      if (userIndex !== -1) {
        const updatedStats = {
          ...users[userIndex].gameStats,
          tapsLeft: Math.min(users[userIndex].gameStats.tapsLeft + 1, users[userIndex].gameStats.maxTaps)
        }
        
        users[userIndex] = { ...users[userIndex], gameStats: updatedStats }
        localStorage.setItem('robotGameUsers', JSON.stringify(users))
        setCurrentUser(users[userIndex])
      }
    }, 180000)
    
    return () => clearInterval(timer)
  }, [currentUser])

  const tabs = [
    { id: 'game', label: 'Игра', icon: 'Gamepad2' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'upgrades', label: 'Улучшения', icon: 'Zap' },
    { id: 'withdraw', label: 'Вывод', icon: 'Wallet' },
    { id: 'rating', label: 'Рейтинг', icon: 'Trophy' },
    { id: 'tasks', label: 'Задания', icon: 'CheckSquare' }
  ]

  const renderAuthForm = () => (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {authMode === 'login' ? 'Вход в игру' : 'Регистрация'}
            </h2>
            <p className="text-muted-foreground">
              {authMode === 'login' ? 'Войдите чтобы продолжить игру' : 'Создайте аккаунт и начните зарабатывать'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={authForm.username}
                onChange={(e) => setAuthForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Введите имя"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Введите email"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Введите пароль"
              />
            </div>

            <Button 
              onClick={authMode === 'login' ? handleLogin : handleRegister}
              className="w-full"
            >
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <Button 
              variant="ghost"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login')
                setAuthForm({ username: '', email: '', password: '' })
              }}
              className="w-full"
            >
              {authMode === 'login' ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Войти'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderGameTab = () => {
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
            onClick={handleRobotTap}
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
        </div>

        <Button onClick={claimDailyBonus} className="w-full max-w-md bg-secondary hover:bg-secondary/90">
          <Icon name="Gift" className="mr-2" />
          Получить дневной бонус: {currentUser.gameStats.dailyBonus} монет
        </Button>
      </div>
    )
  }

  const renderProfileTab = () => {
    if (!currentUser) return renderAuthForm()
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
              <Icon name="User" size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentUser.username}</h2>
            <Badge variant="secondary">Уровень {currentUser.gameStats.level}</Badge>
            <p className="text-sm text-muted-foreground mt-2">ID: {currentUser.id}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-primary">{currentUser.gameStats.totalEarned.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Всего заработано</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-secondary">{(currentUser.gameStats.totalEarned / 10000).toFixed(2)} ₽</div>
              <div className="text-sm text-muted-foreground">В рублях</div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleLogout} variant="destructive" className="w-full">
          <Icon name="LogOut" className="mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    )
  }

  const renderUpgradesTab = () => {
    if (!currentUser) return renderAuthForm()
    
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
              onClick={upgradeRobot}
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

  const renderWithdrawTab = () => {
    if (!currentUser) return renderAuthForm()
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Вывод средств</h2>
            <div className="text-4xl font-bold text-primary mb-2">{currentUser.gameStats.coins.toLocaleString()}</div>
            <div className="text-lg text-secondary">{(currentUser.gameStats.coins / 10000).toFixed(2)} ₽</div>
            <p className="text-sm text-muted-foreground mt-2">10,000 монет = 1 рубль</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button 
            disabled={currentUser.gameStats.coins < 10000} 
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
  }

  const renderRatingTab = () => {
    if (!currentUser) return renderAuthForm()
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const sortedUsers = users.sort((a: User, b: User) => b.gameStats.totalEarned - a.gameStats.totalEarned).slice(0, 10)
    
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Топ игроков</h2>
        
        {sortedUsers.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Пока нет других игроков</p>
            </CardContent>
          </Card>
        ) : (
          sortedUsers.map((user: User, index: number) => (
            <Card key={user.id} className={user.id === currentUser.id ? 'ring-2 ring-primary' : ''}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant={index < 3 ? "default" : "outline"}>#{index + 1}</Badge>
                  <div>
                    <div className="font-semibold">
                      {user.username} {user.id === currentUser.id && '(Вы)'}
                    </div>
                    <div className="text-sm text-muted-foreground">Уровень {user.gameStats.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{user.gameStats.totalEarned.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">монет</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    )
  }

  const renderTasksTab = () => {
    if (!currentUser) return renderAuthForm()
    
    const tasks = [
      { 
        title: "Сделать 50 тапов", 
        reward: 500, 
        completed: (currentUser.gameStats.totalEarned - currentUser.gameStats.coins + (currentUser.gameStats.maxTaps - currentUser.gameStats.tapsLeft)) >= 50
      },
      { title: "Войти в игру", reward: 100, completed: true },
      { title: "Улучшить робота", reward: 1000, completed: currentUser.gameStats.level > 1 },
      { title: "Заработать 10,000 монет", reward: 5000, completed: currentUser.gameStats.totalEarned >= 10000 }
    ]
    
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Ежедневные задания</h2>
        
        {tasks.map((task, index) => (
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
  }

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
          <p className="text-muted-foreground">
            {currentUser ? `Добро пожаловать, ${currentUser.username}!` : 'Войдите чтобы начать игру'}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {!currentUser && activeTab !== 'profile' ? renderAuthForm() : renderActiveTab()}
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
              disabled={!currentUser && tab.id !== 'profile'}
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