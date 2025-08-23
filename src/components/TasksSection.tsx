import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User, GameStats } from './GameSection'
import { useEffect } from 'react'

interface TasksSectionProps {
  currentUser: User | null
  onUpdateStats: (stats: GameStats) => void
}

export default function TasksSection({ currentUser, onUpdateStats }: TasksSectionProps) {
  if (!currentUser) {
    return null
  }

  const handleTelegramSubscribe = () => {
    // Открываем Telegram группу
    window.open('https://t.me/roboyatitan', '_blank')
    
    // Через небольшую задержку предлагаем подтвердить подписку
    setTimeout(() => {
      const confirmed = confirm('Вы подписались на Telegram группу? Нажмите OK если да.')
      if (confirmed) {
        localStorage.setItem(`telegramSubscribed_${currentUser.id}`, 'true')
        // Принудительно обновляем состояние
        window.location.reload()
      }
    }, 2000)
  }

  const tasks = [
    { 
      id: 'taps_50',
      title: "Сделать 50 тапов", 
      reward: 500, 
      completed: (currentUser.gameStats.totalEarned - currentUser.gameStats.coins + (currentUser.gameStats.maxTaps - currentUser.gameStats.tapsLeft)) >= 50
    },
    { id: 'login', title: "Войти в игру", reward: 100, completed: true },
    { 
      id: 'telegram', 
      title: "Подписаться на Telegram группу", 
      reward: 1500, 
      completed: localStorage.getItem(`telegramSubscribed_${currentUser.id}`) === 'true',
      link: 'https://t.me/roboyatitan'
    },
    { id: 'upgrade', title: "Улучшить робота", reward: 1000, completed: currentUser.gameStats.level > 1 },
    { id: 'earn_10k', title: "Заработать 10,000 монет", reward: 5000, completed: currentUser.gameStats.totalEarned >= 10000 }
  ]

  // Проверяем выполненные задания и автоматически начисляем награды
  useEffect(() => {
    if (!currentUser) return
    
    const completedTasks = localStorage.getItem(`completedTasks_${currentUser.id}`) 
      ? JSON.parse(localStorage.getItem(`completedTasks_${currentUser.id}`) || '[]')
      : []
    
    let rewardToAdd = 0
    const newCompletedTasks = [...completedTasks]
    
    tasks.forEach(task => {
      if (task.completed && !completedTasks.includes(task.id)) {
        rewardToAdd += task.reward
        newCompletedTasks.push(task.id)
      }
    })
    
    if (rewardToAdd > 0) {
      const updatedStats = {
        ...currentUser.gameStats,
        coins: currentUser.gameStats.coins + rewardToAdd,
        totalEarned: currentUser.gameStats.totalEarned + rewardToAdd
      }
      
      localStorage.setItem(`completedTasks_${currentUser.id}`, JSON.stringify(newCompletedTasks))
      onUpdateStats(updatedStats)
    }
  }, [currentUser, tasks, onUpdateStats])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Ежедневные задания</h2>
      
      {tasks.map((task, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={task.completed ? "CheckCircle" : task.id === 'telegram' ? "Send" : "Circle"} 
                className={task.completed ? "text-green-500" : task.id === 'telegram' ? "text-blue-500" : "text-muted-foreground"} 
              />
              <div>
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm text-secondary">+{task.reward} монет</div>
                {task.id === 'telegram' && !task.completed && (
                  <div className="text-xs text-blue-600">t.me/roboyatitan</div>
                )}
              </div>
            </div>
            <Button 
              size="sm" 
              disabled={task.completed}
              variant={task.completed ? "outline" : "default"}
              onClick={() => {
                if (task.id === 'telegram' && !task.completed) {
                  handleTelegramSubscribe()
                }
              }}
            >
              {task.completed ? "Выполнено" : task.id === 'telegram' ? "Подписаться" : "Выполнить"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}