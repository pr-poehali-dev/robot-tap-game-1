import { useState, useEffect } from 'react'
import { User } from '@/types/user'

interface RealTimeStats {
  activeUsers: number
  totalCoinsEarned: number
  totalRobots: number
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    activeUsers: 0,
    totalCoinsEarned: 0,
    totalRobots: 0
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
    
    // Общее количество роботов у всех игроков
    const totalRobots = users.reduce((total, user) => {
      const robotsOwned = user.gameStats?.robotsOwned || {}
      return total + Object.values(robotsOwned).reduce((sum: number, count: any) => sum + (count || 0), 0)
    }, 0)
    
    setStats({
      activeUsers,
      totalCoinsEarned,
      totalRobots
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