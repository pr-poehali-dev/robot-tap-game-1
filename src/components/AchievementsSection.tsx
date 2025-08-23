import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: number
  reward: number
  type: 'coins' | 'taps' | 'days' | 'level' | 'robots'
  completed?: boolean
  progress?: number
}

interface AchievementsSectionProps {
  currentUser: User | null
  onClaimReward: (achievement: Achievement) => void
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_thousand',
    title: 'Первая тысяча',
    description: 'Заработайте 1,000 монет',
    icon: 'Coins',
    requirement: 1000,
    reward: 500,
    type: 'coins'
  },
  {
    id: 'first_million',
    title: 'Первый миллион',
    description: 'Заработайте 1,000,000 монет',
    icon: 'Trophy',
    requirement: 1000000,
    reward: 50000,
    type: 'coins'
  },
  {
    id: 'tap_master',
    title: 'Мастер тапов',
    description: 'Сделайте 10,000 тапов',
    icon: 'MousePointer',
    requirement: 10000,
    reward: 5000,
    type: 'taps'
  },
  {
    id: 'tap_king',
    title: 'Король тапов',
    description: 'Сделайте 100,000 тапов',
    icon: 'Crown',
    requirement: 100000,
    reward: 100000,
    type: 'taps'
  },
  {
    id: 'week_streak',
    title: 'Неделя успеха',
    description: 'Играйте 7 дней подряд',
    icon: 'Calendar',
    requirement: 7,
    reward: 10000,
    type: 'days'
  },
  {
    id: 'month_streak',
    title: '30 дней славы',
    description: 'Играйте 30 дней подряд',
    icon: 'Award',
    requirement: 30,
    reward: 100000,
    type: 'days'
  },
  {
    id: 'hundred_days',
    title: '100 дней подряд',
    description: 'Играйте 100 дней подряд',
    icon: 'Star',
    requirement: 100,
    reward: 1000000,
    type: 'days'
  },
  {
    id: 'level_master',
    title: 'Мастер уровней',
    description: 'Достигните 10 уровня',
    icon: 'TrendingUp',
    requirement: 10,
    reward: 25000,
    type: 'level'
  },
  {
    id: 'robot_collector',
    title: 'Коллекционер роботов',
    description: 'Купите 5 разных роботов',
    icon: 'Bot',
    requirement: 5,
    reward: 75000,
    type: 'robots'
  }
]

export default function AchievementsSection({ currentUser, onClaimReward }: AchievementsSectionProps) {
  if (!currentUser) {
    return (
      <div className="text-center space-y-4">
        <Icon name="Lock" size={64} className="mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Требуется авторизация</h3>
        <p className="text-muted-foreground">Войдите в аккаунт чтобы увидеть достижения</p>
      </div>
    )
  }

  const calculateProgress = (achievement: Achievement): { completed: boolean, progress: number } => {
    const savedAchievements = JSON.parse(localStorage.getItem(`achievements_${currentUser.id}`) || '{}')
    
    if (savedAchievements[achievement.id]?.completed) {
      return { completed: true, progress: 100 }
    }

    let currentValue = 0
    
    switch (achievement.type) {
      case 'coins':
        currentValue = currentUser.gameStats.totalEarned
        break
      case 'taps':
        // Считаем общее количество тапов через totalEarned / средняя мощность
        currentValue = Math.floor(currentUser.gameStats.totalEarned / Math.max(currentUser.gameStats.robotPower, 1))
        break
      case 'days':
        const registeredDate = new Date(currentUser.registeredAt)
        const today = new Date()
        const daysDiff = Math.floor((today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24))
        currentValue = Math.min(daysDiff, achievement.requirement)
        break
      case 'level':
        currentValue = currentUser.gameStats.level
        break
      case 'robots':
        const robotHistory = JSON.parse(localStorage.getItem(`robotHistory_${currentUser.id}`) || '[]')
        currentValue = new Set(robotHistory).size
        break
      default:
        currentValue = 0
    }

    const progress = Math.min((currentValue / achievement.requirement) * 100, 100)
    const completed = currentValue >= achievement.requirement && !savedAchievements[achievement.id]?.completed

    return { completed, progress }
  }

  const handleClaimReward = (achievement: Achievement) => {
    const savedAchievements = JSON.parse(localStorage.getItem(`achievements_${currentUser.id}`) || '{}')
    
    if (!savedAchievements[achievement.id]?.completed) {
      savedAchievements[achievement.id] = { completed: true, claimedAt: new Date().toISOString() }
      localStorage.setItem(`achievements_${currentUser.id}`, JSON.stringify(savedAchievements))
      onClaimReward(achievement)
    }
  }

  const completedCount = ACHIEVEMENTS.filter(achievement => {
    const { completed } = calculateProgress(achievement)
    return completed || JSON.parse(localStorage.getItem(`achievements_${currentUser.id}`) || '{}')[achievement.id]?.completed
  }).length

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">🏆 Достижения</h2>
        <p className="text-muted-foreground">
          Выполнено: {completedCount}/{ACHIEVEMENTS.length}
        </p>
        <Progress value={(completedCount / ACHIEVEMENTS.length) * 100} className="max-w-xs mx-auto" />
      </div>

      <div className="grid gap-3">
        {ACHIEVEMENTS.map(achievement => {
          const { completed, progress } = calculateProgress(achievement)
          const savedAchievements = JSON.parse(localStorage.getItem(`achievements_${currentUser.id}`) || '{}')
          const alreadyClaimed = savedAchievements[achievement.id]?.completed

          return (
            <Card 
              key={achievement.id} 
              className={`relative overflow-hidden ${
                alreadyClaimed ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 
                completed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 animate-pulse' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${alreadyClaimed ? 'bg-yellow-100' : completed ? 'bg-green-100' : 'bg-muted'}`}>
                    <Icon name={achievement.icon as any} size={24} className={
                      alreadyClaimed ? 'text-yellow-600' : completed ? 'text-green-600' : 'text-muted-foreground'
                    } />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          +{achievement.reward.toLocaleString()} монет
                        </Badge>
                        {alreadyClaimed && <Badge className="bg-yellow-500">Получено</Badge>}
                        {completed && !alreadyClaimed && <Badge className="bg-green-500 animate-pulse">Готово!</Badge>}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Прогресс</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {completed && !alreadyClaimed && (
                      <button
                        onClick={() => handleClaimReward(achievement)}
                        className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium animate-bounce"
                      >
                        Получить награду! 🎁
                      </button>
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