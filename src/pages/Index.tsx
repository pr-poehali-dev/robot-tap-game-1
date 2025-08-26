import { useState, useEffect, useCallback } from 'react'
import AuthForm from '@/components/AuthForm'
import GameSection from '@/components/GameSection'
import LandingPage from '@/components/LandingPage'
import { User, GameStats } from '@/types/user'
import ProfileSection from '@/components/ProfileSection'
import UpgradesSection from '@/components/UpgradesSection'
import AutoSection from '@/components/AutoSection'
import WithdrawSection from '@/components/WithdrawSection'
import RatingSection from '@/components/RatingSection'
import RobotsSection from '@/components/RobotsSection'
import AchievementsSection from '@/components/AchievementsSection'
import DailyTasksSection from '@/components/DailyTasksSection'
import LeaguesSection from '@/components/LeaguesSection'
import MinigamesSection from '@/components/MinigamesSection'
import SocialSection from '@/components/SocialSection'
import Navigation from '@/components/Navigation'
import UserCounters from '@/components/UserCounters'
import { useAuth } from '@/hooks/useAuth'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useUserActivity, getOnlineCount, getRegistrationCount } from '@/hooks/useUserActivity'
import { useEnergyRecovery } from '@/hooks/useEnergyRecovery'

export default function Index() {
  const [activeTab, setActiveTab] = useState('game')
  const [showLanding, setShowLanding] = useState(true)
  const [registrationCount, setRegistrationCount] = useState(0)
  const [onlineCount, setOnlineCount] = useState(0)

  const {
    currentUser,
    setCurrentUser,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    handleRegister: authRegister,
    handleLogin,
    handleLogout: authLogout
  } = useAuth()

  const updateOnlineCount = useCallback(() => {
    setOnlineCount(getOnlineCount())
  }, [])

  const updateUserStats = useCallback((updatedStats: GameStats) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, gameStats: updatedStats }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
    users[userIndex] = updatedUser
    localStorage.setItem('robotGameUsers', JSON.stringify(users))
    
    setCurrentUser(updatedUser)
  }, [currentUser, setCurrentUser])

  const {
    isAnimating,
    coinAnimations,
    handleRobotTap,
    handleClaimDailyBonus,
    handleUpgradeRobot
  } = useGameLogic(currentUser, updateUserStats)

  useUserActivity(currentUser, updateOnlineCount)
  useEnergyRecovery(currentUser, setCurrentUser)

  const handleRegister = useCallback(() => {
    const newCount = authRegister()
    if (newCount) {
      setRegistrationCount(newCount)
    }
  }, [authRegister])

  const handleLandingLogin = useCallback((form: { username: string; email: string; password: string }) => {
    setAuthForm(form)
    const success = handleLogin()
    if (success) {
      setShowLanding(false)
    }
  }, [handleLogin])

  const handleLandingRegister = useCallback((form: { username: string; email: string; password: string }) => {
    setAuthForm(form)
    const success = authRegister()
    if (success) {
      setShowLanding(false)
      setRegistrationCount(prev => prev + 1)
    }
  }, [authRegister])

  const handleLogout = useCallback(() => {
    authLogout()
    setActiveTab('game')
  }, [authLogout])

  const handleClaimAchievementReward = useCallback((achievement: { id: string, reward: number }) => {
    if (!currentUser) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + achievement.reward
    }
    
    updateUserStats(updatedStats)
    alert(`Достижение выполнено! +${achievement.reward.toLocaleString()} монет! 🎉`)
  }, [currentUser, updateUserStats])

  const handleClaimDailyTaskReward = useCallback((task: { id: string, reward: number }) => {
    if (!currentUser) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + task.reward
    }
    
    updateUserStats(updatedStats)
    alert(`Задание выполнено! +${task.reward.toLocaleString()} монет! ✅`)
  }, [currentUser, updateUserStats])

  const handleUpdateCoinsFromMinigame = useCallback((newCoins: number) => {
    if (!currentUser) return
    
    const updatedStats = {
      ...currentUser.gameStats,
      coins: newCoins
    }
    
    updateUserStats(updatedStats)
  }, [currentUser, updateUserStats])

  useEffect(() => {
    document.title = 'YaTitan - Робот кликер'
  }, [])

  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId')
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    
    if (savedUserId) {
      const user = users.find((u: User) => u.id === savedUserId)
      if (user) {
        setCurrentUser(user)
        setShowLanding(false)
      }
    }
    
    setRegistrationCount(users.length)
  }, [setCurrentUser])

  useEffect(() => {
    const updateOnlineCountTimer = () => {
      setOnlineCount(getOnlineCount())
    }

    updateOnlineCountTimer()

    const onlineTimer = setInterval(updateOnlineCountTimer, 30000)

    return () => clearInterval(onlineTimer)
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

  if (showLanding) {
    return (
      <LandingPage 
        onLogin={handleLandingLogin}
        onRegister={handleLandingRegister}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <UserCounters 
        registrationCount={registrationCount}
        onlineCount={onlineCount}
      />

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