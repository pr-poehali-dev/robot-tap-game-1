import { useState, useEffect } from 'react'
import Icon from '@/components/ui/icon'
import AuthForm from '@/components/AuthForm'
import GameSection from '@/components/GameSection'
import { User, GameStats } from '@/types/user'
import ProfileSection from '@/components/ProfileSection'
import UpgradesSection from '@/components/UpgradesSection'
import AutoSection from '@/components/AutoSection'
import WithdrawSection from '@/components/WithdrawSection'
import RatingSection from '@/components/RatingSection'
import TasksSection from '@/components/TasksSection'
import RobotsSection from '@/components/RobotsSection'
import AchievementsSection from '@/components/AchievementsSection'
import DailyTasksSection, { updateDailyTaskProgress } from '@/components/DailyTasksSection'
import LeaguesSection from '@/components/LeaguesSection'
import MinigamesSection from '@/components/MinigamesSection'
import SocialSection from '@/components/SocialSection'
import Navigation from '@/components/Navigation'

export default function Index() {
  const [activeTab, setActiveTab] = useState('game')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  const [registrationCount, setRegistrationCount] = useState(0)

  useEffect(() => {
    document.title = 'YaTitan - Робот кликер'
  }, [])

  // Отслеживание активности пользователя
  useEffect(() => {
    const updateActivity = () => {
      if (currentUser) {
        localStorage.setItem(`lastActivity_${currentUser.id}`, Date.now().toString())
      }
    }

    // Обновляем активность при загрузке
    updateActivity()

    // Обновляем активность каждые 30 секунд
    const interval = setInterval(updateActivity, 30000)

    // Обновляем активность при различных событиях
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    return () => {
      clearInterval(interval)
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [currentUser])
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
    setRegistrationCount(users.length) // Обновляем счетчик регистраций
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
        'cyborg': { tapPower: 20, lifespan: 100 },
        'student': { tapPower: 35, lifespan: 120 },
        'quantum': { tapPower: 75, lifespan: 180 }
      }
      
      const robot = robots[robotId as keyof typeof robots]
      if (!robot) return 1
      
      // Проверяем срок жизни
      const daysPassed = Math.floor((Date.now() - purchaseDate) / (1000 * 60 * 60 * 24))
      if (daysPassed >= robot.lifespan && robotId !== 'basic') {
        // Срок истёк, возвращаем к базовому роботу
        localStorage.setItem(`userRobot_${currentUser.id}`, JSON.stringify({
          robotId: 'basic',
          purchaseDate: Date.now()
        }))
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
    
    // Обновляем прогресс ежедневных заданий
    updateDailyTaskProgress(currentUser.id, 'taps', 1)
    updateDailyTaskProgress(currentUser.id, 'coins', totalTapPower)
    
    // Отмечаем истощение энергии для заданий
    if (newTapsLeft <= 0) {
      updateDailyTaskProgress(currentUser.id, 'energy', 1)
    }
    
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

  const handleClaimAchievementReward = (achievement: { id: string, reward: number }) => {
    if (!currentUser) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + achievement.reward
    }
    
    updateUserStats(updatedStats)
    alert(`Достижение выполнено! +${achievement.reward.toLocaleString()} монет! 🎉`)
  }

  const handleClaimDailyTaskReward = (task: { id: string, reward: number }) => {
    if (!currentUser) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + task.reward
    }
    
    updateUserStats(updatedStats)
    alert(`Задание выполнено! +${task.reward.toLocaleString()} монет! ✅`)
  }

  const handleUpdateCoinsFromMinigame = (newCoins: number) => {
    if (!currentUser) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: newCoins
    }
    
    updateUserStats(updatedStats)
  }

  // Получаем количество зарегистрированных пользователей
  const getRegistrationCount = () => {
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    return users.length
  }

  // Форматируем большие числа
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId')
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    
    if (savedUserId) {
      const user = users.find((u: User) => u.id === savedUserId)
      if (user) {
        setCurrentUser(user)
      }
    }
    
    // Инициализируем счетчик регистраций
    setRegistrationCount(users.length)
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
          const hasUnlimitedEnergy = localStorage.getItem(`unlimitedEnergy_${user.id}`) === 'true'
          const isVIP = localStorage.getItem(`vipStatus_${user.id}`) === 'true'
          
          let recoveryTime
          if (hasUnlimitedEnergy) {
            recoveryTime = 15 * 60 * 1000 // 15 минут для безлимитной энергии
          } else if (isVIP) {
            recoveryTime = 1 * 60 * 60 * 1000 // 1 час для VIP
          } else {
            recoveryTime = 5 * 60 * 60 * 1000 // 5 часов для обычных пользователей
          }
          
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
            onTabChange={setActiveTab}
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
        return <WithdrawSection currentUser={currentUser} onAutoTapClick={() => setActiveTab('auto')} onTabChange={setActiveTab} />
      case 'rating': 
        return <RatingSection currentUser={currentUser} />
      case 'robots':
        return <RobotsSection currentUser={currentUser} onUpdateStats={updateUserStats} />
      case 'tasks': 
        return (
          <DailyTasksSection 
            currentUser={currentUser}
            onClaimReward={handleClaimDailyTaskReward}
          />
        )
      case 'achievements':
        return (
          <AchievementsSection 
            currentUser={currentUser}
            onClaimReward={handleClaimAchievementReward}
          />
        )
      case 'leagues':
        return <LeaguesSection currentUser={currentUser} />
      case 'minigames':
        return (
          <MinigamesSection 
            currentUser={currentUser}
            onUpdateCoins={handleUpdateCoinsFromMinigame}
          />
        )
      case 'social':
        return <SocialSection currentUser={currentUser} onUpdateStats={updateUserStats} />
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
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* Кнопка счетчика регистраций - адаптивная */}
      <div className="fixed left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full shadow-lg border border-primary/20 hover:bg-primary transition-all duration-200 hover:scale-105 cursor-pointer px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] text-center">
          <div className="flex flex-col items-center">
            <Icon name="Users" size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold leading-none">
              {formatNumber(registrationCount)}
            </span>
          </div>
        </div>
      </div>

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