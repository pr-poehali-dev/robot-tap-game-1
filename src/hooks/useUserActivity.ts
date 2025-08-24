import { useEffect } from 'react'
import { User } from '@/types/user'

export const useUserActivity = (
  currentUser: User | null, 
  onUpdateOnlineCount: () => void
) => {
  useEffect(() => {
    const updateActivity = () => {
      if (currentUser) {
        localStorage.setItem(`lastActivity_${currentUser.id}`, Date.now().toString())
        onUpdateOnlineCount()
      }
    }

    updateActivity()

    const interval = setInterval(updateActivity, 30000)

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
  }, [currentUser, onUpdateOnlineCount])
}

export const getOnlineCount = () => {
  const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
  const now = Date.now()
  const onlineThreshold = 5 * 60 * 1000

  const onlineUsers = users.filter((user: User) => {
    const lastActivity = localStorage.getItem(`lastActivity_${user.id}`)
    if (!lastActivity) return false
    
    const timeSinceActivity = now - parseInt(lastActivity)
    return timeSinceActivity <= onlineThreshold
  })
  
  return onlineUsers.length
}

export const getRegistrationCount = () => {
  const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
  return users.length
}

export const formatNumber = (num: number) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}