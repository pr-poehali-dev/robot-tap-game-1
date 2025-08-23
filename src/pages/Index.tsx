import { useState, useEffect } from 'react'
import AuthForm from '@/components/AuthForm'
import GameSection, { User, GameStats } from '@/components/GameSection'
import ProfileSection from '@/components/ProfileSection'
import UpgradesSection from '@/components/UpgradesSection'
import AutoSection from '@/components/AutoSection'
import WithdrawSection from '@/components/WithdrawSection'
import RatingSection from '@/components/RatingSection'
import TasksSection from '@/components/TasksSection'
import RobotsSection from '@/components/RobotsSection'
import Navigation from '@/components/Navigation'

export default function Index() {
  const [activeTab, setActiveTab] = useState('game')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })

  useEffect(() => {
    document.title = 'YaTitan - Робот кликер'
  }, [])
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
    if (!authForm.username.trim() || !authForm.email.trim() || !authForm.password.trim()) {
      alert('Заполните все поля')
      return
    }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const existingUser = users.find((u: User) => u.username === authForm.username.trim())
    
    if (existingUser) {
      alert('Пользователь с таким именем уже существует')
      return
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username: authForm.username.trim(),
      email: authForm.email.trim(),
      password: authForm.password.trim(),
      gameStats: { ...initialGameStats },
      registeredAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('robotGameUsers', JSON.stringify(users))
    localStorage.setItem('currentUserId', newUser.id)
    
    setCurrentUser(newUser)
    setAuthForm({ username: '', email: '', password: '' })
  }

  const handleLogin = () => {
    if (!authForm.username.trim() || !authForm.password.trim()) {
      alert('Заполните все поля')
      return
    }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const user = users.find((u: User) => 
      u.username === authForm.username.trim() && 
      (u.password === authForm.password.trim() || u.email === authForm.password.trim()) // Проверяем и новое поле password, и старое email для совместимости
    )
    
    if (user) {
      localStorage.setItem('currentUserId', user.id)
      setCurrentUser(user)
      setAuthForm({ username: '', email: '', password: '' })
    } else {
      alert('Неверный логин или пароль')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUserId')
    setCurrentUser(null)
    setActiveTab('game')
  }

  const updateUserStats = (updatedStats: GameStats) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, gameStats: updatedStats }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
    users[userIndex] = updatedUser
    localStorage.setItem('robotGameUsers', JSON.stringify(users))
    
    setCurrentUser(updatedUser)
  }

  const handleRobotTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentUser || currentUser.gameStats.tapsLeft <= 0) return
    
    // Получаем мощность текущего робота
    const getRobotTapPower = () => {
      const robotData = localStorage.getItem(`userRobot_${currentUser.id}`)
      if (!robotData) return 1
      
      const { robotId, purchaseDate } = JSON.parse(robotData)
      const robots = {
        'basic': { tapPower: 1, lifespan: 999999 },
        'worker': { tapPower: 2, lifespan: 30 },
        'engineer': { tapPower: 3, lifespan: 45 },
        'scientist': { tapPower: 5, lifespan: 60 },
        'commander': { tapPower: 10, lifespan: 90 },
        'cyborg': { tapPower: 20, lifespan: 100 }
      }
      
      const robot = robots[robotId as keyof typeof robots]
      if (!robot) return 1
      
      // Проверяем срок жизни
      const daysPassed = Math.floor((Date.now() - purchaseDate) / (1000 * 60 * 60 * 24))
      if (daysPassed >= robot.lifespan && robotId !== 'basic') {
        return 1 // Базовый робот
      }
      
      return robot.tapPower
    }
    
    const robotTapPower = getRobotTapPower()
    const totalTapPower = currentUser.gameStats.robotPower * robotTapPower // Базовая мощность × мощность робота
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsAnimating(true)
    setCoinAnimations(prev => [...prev, { id: Date.now(), x, y }])
    
    const newTapsLeft = currentUser.gameStats.tapsLeft - 1
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + totalTapPower,
      tapsLeft: newTapsLeft,
      totalEarned: currentUser.gameStats.totalEarned + totalTapPower,
      // Если энергия заканчивается, устанавливаем время истощения
      energyDepletedAt: newTapsLeft <= 0 ? Date.now() : currentUser.gameStats.energyDepletedAt
    }
    
    updateUserStats(updatedStats)
    
    setTimeout(() => setIsAnimating(false), 300)
    setTimeout(() => setCoinAnimations(prev => prev.slice(1)), 1000)
  }

  const handleClaimDailyBonus = () => {
    if (!currentUser) return
    
    // Проверяем можно ли получить бонус
    const lastBonusTime = currentUser.gameStats.lastDailyBonusTime
    if (lastBonusTime) {
      const lastBonusDate = new Date(lastBonusTime)
      const now = new Date()
      const timeDiff = now.getTime() - lastBonusDate.getTime()
      const dayInMs = 24 * 60 * 60 * 1000
      
      if (timeDiff < dayInMs) {
        const timeLeft = dayInMs - timeDiff
        const hours = Math.floor(timeLeft / (60 * 60 * 1000))
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))
        const timeLeftStr = hours > 0 ? `${hours}ч ${minutes}мин` : `${minutes}мин`
        alert(`Дневной бонус уже получен! Следующий бонус через: ${timeLeftStr}`)
        return
      }
    }
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + currentUser.gameStats.dailyBonus,
      totalEarned: currentUser.gameStats.totalEarned + currentUser.gameStats.dailyBonus,
      lastDailyBonusTime: new Date().toISOString()
    }
    
    updateUserStats(updatedStats)
  }

  const handleUpgradeRobot = () => {
    if (!currentUser) return
    
    const upgradeCost = currentUser.gameStats.level * 1000
    if (currentUser.gameStats.coins >= upgradeCost) {
      const updatedStats = {
        ...currentUser.gameStats,
        coins: currentUser.gameStats.coins - upgradeCost,
        level: currentUser.gameStats.level + 1,
        robotPower: currentUser.gameStats.robotPower + 5
      }
      
      updateUserStats(updatedStats)
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
        const now = Date.now()
        const user = users[userIndex]
        
        // Проверяем, нужно ли восстановить энергию
        if (user.gameStats.energyDepletedAt) {
          const timeSinceDepletion = now - user.gameStats.energyDepletedAt
          const isVIP = localStorage.getItem(`vipStatus_${user.id}`) === 'true'
          const recoveryTime = isVIP ? 1 * 60 * 60 * 1000 : 5 * 60 * 60 * 1000 // 1 час для VIP, 5 часов для обычных
          
          if (timeSinceDepletion >= recoveryTime) {
            // Восстанавливаем энергию полностью
            const updatedStats = {
              ...user.gameStats,
              tapsLeft: user.gameStats.maxTaps,
              energyDepletedAt: null
            }
            
            users[userIndex] = { ...user, gameStats: updatedStats }
            localStorage.setItem('robotGameUsers', JSON.stringify(users))
            setCurrentUser(users[userIndex])
          }
        }
      }
    }, 1000) // Проверяем каждую секунду
    
    return () => clearInterval(timer)
  }, [currentUser])

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'game': 
        return (
          <GameSection 
            currentUser={currentUser}
            isAnimating={isAnimating}
            coinAnimations={coinAnimations}
            onRobotTap={handleRobotTap}
            onClaimDailyBonus={handleClaimDailyBonus}
            onAutoTapClick={() => setActiveTab('auto')}
            onWithdrawClick={() => setActiveTab('withdraw')}
          />
        )
      case 'profile': 
        return currentUser ? (
          <ProfileSection 
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        ) : (
          <AuthForm
            authMode={authMode}
            authForm={authForm}
            onAuthFormChange={setAuthForm}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onModeChange={setAuthMode}
          />
        )
      case 'upgrades': 
        return (
          <UpgradesSection 
            currentUser={currentUser}
            onUpgradeRobot={handleUpgradeRobot}
            onUpdateStats={updateUserStats}
          />
        )
      case 'auto': 
        return (
          <AutoSection 
            currentUser={currentUser}
            onUpdateStats={updateUserStats}
          />
        )
      case 'withdraw': 
        return <WithdrawSection currentUser={currentUser} onAutoTapClick={() => setActiveTab('auto')} />
      case 'rating': 
        return <RatingSection currentUser={currentUser} />
      case 'robots':
        return <RobotsSection currentUser={currentUser} onUpdateStats={updateUserStats} />
      case 'tasks': 
        return <TasksSection currentUser={currentUser} onUpdateStats={updateUserStats} />
      default: 
        return (
          <GameSection 
            currentUser={currentUser}
            isAnimating={isAnimating}
            coinAnimations={coinAnimations}
            onRobotTap={handleRobotTap}
            onClaimDailyBonus={handleClaimDailyBonus}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 overflow-y-auto pb-16">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-md">
          {!currentUser && activeTab !== 'profile' ? (
            <AuthForm
              authMode={authMode}
              authForm={authForm}
              onAuthFormChange={setAuthForm}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onModeChange={setAuthMode}
            />
          ) : renderActiveTab()}
        </div>
      </div>

      <Navigation 
        activeTab={activeTab}
        currentUser={currentUser}
        onTabChange={setActiveTab}
      />
    </div>
  )
}