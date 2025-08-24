import { useEffect } from 'react'
import { User } from '@/types/user'

export const useEnergyRecovery = (
  currentUser: User | null,
  setCurrentUser: (user: User) => void
) => {
  useEffect(() => {
    if (!currentUser) return
    
    const timer = setInterval(() => {
      const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
      const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
      if (userIndex !== -1) {
        const now = Date.now()
        const user = users[userIndex]
        
        if (user.gameStats.energyDepletedAt) {
          const timeSinceDepletion = now - user.gameStats.energyDepletedAt
          const hasUnlimitedEnergy = localStorage.getItem(`unlimitedEnergy_${user.id}`) === 'true'
          const isVIP = localStorage.getItem(`vipStatus_${user.id}`) === 'true'
          
          let recoveryTime
          if (hasUnlimitedEnergy) {
            recoveryTime = 15 * 60 * 1000
          } else if (isVIP) {
            recoveryTime = 1 * 60 * 60 * 1000
          } else {
            recoveryTime = 5 * 60 * 60 * 1000
          }
          
          if (timeSinceDepletion >= recoveryTime) {
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
    }, 1000)
    
    return () => clearInterval(timer)
  }, [currentUser, setCurrentUser])
}