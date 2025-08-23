import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface DailyTask {
  id: string
  title: string
  description: string
  icon: string
  requirement: number
  reward: number
  type: 'taps' | 'coins' | 'energy' | 'login'
}

interface DailyTasksSectionProps {
  currentUser: User | null
  onClaimReward: (task: DailyTask) => void
}

const DAILY_TASKS: DailyTask[] = [
  {
    id: 'daily_taps',
    title: 'Активный игрок',
    description: 'Сделайте 1,000 тапов',
    icon: 'MousePointer',
    requirement: 1000,
    reward: 5000,
    type: 'taps'
  },
  {
    id: 'daily_coins',
    title: 'Коллекционер монет',
    description: 'Заработайте 50,000 монет',
    icon: 'Coins',
    requirement: 50000,
    reward: 10000,
    type: 'coins'
  },
  {
    id: 'daily_energy',
    title: 'Энергичный',
    description: 'Потратьте всю энергию 3 раза',
    icon: 'Zap',
    requirement: 3,
    reward: 7500,
    type: 'energy'
  },
  {
    id: 'daily_login',
    title: 'Постоянный игрок',
    description: 'Войдите в игру',
    icon: 'LogIn',
    requirement: 1,
    reward: 2000,
    type: 'login'
  }
]

export default function DailyTasksSection({ currentUser, onClaimReward }: DailyTasksSectionProps) {
  const [timeToReset, setTimeToReset] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const timeLeft = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeToReset(`${hours}ч ${minutes}мин`)
    }

    updateTimer()
    const timer = setInterval(updateTimer, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!currentUser) {
    return (
      <div className="text-center space-y-4">
        <Icon name="Lock" size={64} className="mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Требуется авторизация</h3>
        <p className="text-muted-foreground">Войдите в аккаунт чтобы увидеть задания</p>
      </div>
    )
  }

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0] // YYYY-MM-DD
  }

  const getDailyProgress = (task: DailyTask): { completed: boolean, progress: number, currentValue: number } => {
    const todayKey = getTodayKey()
    const dailyData = JSON.parse(localStorage.getItem(`dailyTasks_${currentUser.id}_${todayKey}`) || '{}')
    
    if (dailyData[task.id]?.completed) {
      return { completed: true, progress: 100, currentValue: task.requirement }
    }

    let currentValue = 0

    switch (task.type) {
      case 'taps':
        currentValue = dailyData.taps || 0
        break
      case 'coins':
        currentValue = dailyData.coinsEarned || 0
        break
      case 'energy':
        currentValue = dailyData.energyDepletion || 0
        break
      case 'login':
        currentValue = dailyData.loginCount || 0
        break
    }

    const progress = Math.min((currentValue / task.requirement) * 100, 100)
    const completed = currentValue >= task.requirement

    return { completed, progress, currentValue }
  }

  const handleClaimReward = (task: DailyTask) => {
    const todayKey = getTodayKey()
    const dailyData = JSON.parse(localStorage.getItem(`dailyTasks_${currentUser.id}_${todayKey}`) || '{}')
    
    dailyData[task.id] = { completed: true, claimedAt: new Date().toISOString() }
    localStorage.setItem(`dailyTasks_${currentUser.id}_${todayKey}`, JSON.stringify(dailyData))
    
    onClaimReward(task)
  }

  // Отмечаем вход в игру
  useEffect(() => {
    if (currentUser) {
      const todayKey = getTodayKey()
      const dailyData = JSON.parse(localStorage.getItem(`dailyTasks_${currentUser.id}_${todayKey}`) || '{}')
      
      if (!dailyData.loginCount) {
        dailyData.loginCount = 1
        localStorage.setItem(`dailyTasks_${currentUser.id}_${todayKey}`, JSON.stringify(dailyData))
      }
    }
  }, [currentUser])

  const completedCount = DAILY_TASKS.filter(task => {
    const { completed } = getDailyProgress(task)
    return completed
  }).length

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">📋 Ежедневные задания</h2>
        <p className="text-muted-foreground">
          Выполнено: {completedCount}/{DAILY_TASKS.length}
        </p>
        <Progress value={(completedCount / DAILY_TASKS.length) * 100} className="max-w-xs mx-auto" />
        <div className="text-xs text-muted-foreground">
          ⏱️ Обновление через: {timeToReset}
        </div>
      </div>

      <div className="grid gap-3">
        {DAILY_TASKS.map(task => {
          const { completed, progress, currentValue } = getDailyProgress(task)

          return (
            <Card 
              key={task.id} 
              className={`relative overflow-hidden ${
                completed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${completed ? 'bg-green-100' : 'bg-muted'}`}>
                    <Icon name={task.icon as any} size={24} className={
                      completed ? 'text-green-600' : 'text-muted-foreground'
                    } />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{task.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          +{task.reward.toLocaleString()} монет
                        </Badge>
                        {completed && <Badge className="bg-green-500">Выполнено</Badge>}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Прогресс: {currentValue.toLocaleString()}/{task.requirement.toLocaleString()}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {completed && (
                      <Button
                        onClick={() => handleClaimReward(task)}
                        className="w-full mt-2 bg-green-500 hover:bg-green-600"
                        disabled={JSON.parse(localStorage.getItem(`dailyTasks_${currentUser.id}_${getTodayKey()}`) || '{}')[task.id]?.completed}
                      >
                        {JSON.parse(localStorage.getItem(`dailyTasks_${currentUser.id}_${getTodayKey()}`) || '{}')[task.id]?.completed ? 
                          'Награда получена ✅' : 'Получить награду! 🎁'
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Экспортируем функцию для обновления прогресса заданий
export const updateDailyTaskProgress = (userId: string, type: 'taps' | 'coins' | 'energy', amount: number = 1) => {
  const todayKey = new Date().toISOString().split('T')[0]
  const dailyData = JSON.parse(localStorage.getItem(`dailyTasks_${userId}_${todayKey}`) || '{}')
  
  switch (type) {
    case 'taps':
      dailyData.taps = (dailyData.taps || 0) + amount
      break
    case 'coins':
      dailyData.coinsEarned = (dailyData.coinsEarned || 0) + amount
      break
    case 'energy':
      dailyData.energyDepletion = (dailyData.energyDepletion || 0) + amount
      break
  }
  
  localStorage.setItem(`dailyTasks_${userId}_${todayKey}`, JSON.stringify(dailyData))
}