import { useState, useCallback } from 'react'
import { User, GameStats } from '@/types/user'
import { updateDailyTaskProgress } from '@/components/DailyTasksSection'

const initialGameStats: GameStats = {
  coins: 0,
  dailyBonus: 50,
  tapsLeft: 100,
  maxTaps: 100,
  level: 1,
  robotPower: 10,
  totalEarned: 0
}

export const useGameLogic = (
  currentUser: User | null,
  updateUserStats: (stats: GameStats) => void
) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [coinAnimations, setCoinAnimations] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleRobotTap = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentUser || currentUser.gameStats.tapsLeft <= 0) return
    
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
      
      const daysPassed = Math.floor((Date.now() - purchaseDate) / (1000 * 60 * 60 * 24))
      if (daysPassed >= robot.lifespan && robotId !== 'basic') {
        localStorage.setItem(`userRobot_${currentUser.id}`, JSON.stringify({
          robotId: 'basic',
          purchaseDate: Date.now()
        }))
        return 1
      }
      
      return robot.tapPower
    }
    
    const robotTapPower = getRobotTapPower()
    const totalTapPower = currentUser.gameStats.robotPower * robotTapPower
    
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
      energyDepletedAt: newTapsLeft <= 0 ? Date.now() : currentUser.gameStats.energyDepletedAt
    }
    
    updateUserStats(updatedStats)
    
    updateDailyTaskProgress(currentUser.id, 'taps', 1)
    updateDailyTaskProgress(currentUser.id, 'coins', totalTapPower)
    
    if (newTapsLeft <= 0) {
      updateDailyTaskProgress(currentUser.id, 'energy', 1)
    }
    
    setTimeout(() => setIsAnimating(false), 300)
    setTimeout(() => setCoinAnimations(prev => prev.slice(1)), 1000)
  }, [currentUser, updateUserStats])

  const handleClaimDailyBonus = useCallback(() => {
    if (!currentUser) return
    
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
  }, [currentUser, updateUserStats])

  const handleUpgradeRobot = useCallback(() => {
    if (!currentUser) return
    
    const upgradeCost = currentUser.gameStats.level * 1000
    if (currentUser.gameStats.coins >= upgradeCost) {
      // Записываем трату в историю
      const spentHistory = JSON.parse(localStorage.getItem(`spentHistory_${currentUser.id}`) || '[]')
      spentHistory.push({
        id: Date.now(),
        type: 'upgrade',
        itemName: `Улучшение робота (уровень ${currentUser.gameStats.level + 1})`,
        amount: upgradeCost,
        timestamp: Date.now(),
        date: new Date().toISOString()
      })
      localStorage.setItem(`spentHistory_${currentUser.id}`, JSON.stringify(spentHistory))
      
      const updatedStats = {
        ...currentUser.gameStats,
        coins: currentUser.gameStats.coins - upgradeCost,
        level: currentUser.gameStats.level + 1,
        robotPower: currentUser.gameStats.robotPower + 5
      }
      
      updateUserStats(updatedStats)
    }
  }, [currentUser, updateUserStats])

  return {
    isAnimating,
    coinAnimations,
    handleRobotTap,
    handleClaimDailyBonus,
    handleUpgradeRobot,
    initialGameStats
  }
}