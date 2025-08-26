import { useState, useEffect } from 'react'
import { User } from '@/types/user'

interface RealTimeStats {
  activeUsers: number
  totalCoinsEarned: number
  totalRobots: number
  robotBreakdown: Record<string, number>
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    activeUsers: 0,
    totalCoinsEarned: 0,
    totalRobots: 0,
    robotBreakdown: {}
  })

  const updateStats = () => {
    // Получаем всех пользователей из localStorage
    const users: User[] = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    
    // Активные игроки = количество зарегистрированных пользователей
    const activeUsers = users.length
    
    // Общее количество заработанных монет всеми игроками
    const totalCoinsEarned = users.reduce((total, user) => {
      return total + (user.gameStats?.totalEarned || 0)
    }, 0)
    
    // Общее количество роботов у всех игроков и разбивка по типам
    const robotBreakdown: Record<string, number> = {}
    let totalRobots = 0
    
    users.forEach(user => {
      const robotsOwned = user.gameStats?.robotsOwned || {}
      Object.entries(robotsOwned).forEach(([robotId, count]) => {
        const robotCount = count || 0
        robotBreakdown[robotId] = (robotBreakdown[robotId] || 0) + robotCount
        totalRobots += robotCount
      })
    })
    
    setStats({
      activeUsers,
      totalCoinsEarned,
      totalRobots,
      robotBreakdown
    })
  }

  useEffect(() => {
    // Обновляем статистику при первой загрузке
    updateStats()
    
    // Обновляем каждые 5 секунд для реального времени
    const interval = setInterval(updateStats, 5000)
    
    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      updateStats()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Функция для принудительного обновления (вызывается после регистрации/изменений)
  const forceUpdate = () => {
    updateStats()
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`
    }
    return num.toString()
  }

  return {
    stats,
    forceUpdate,
    formatNumber
  }
}