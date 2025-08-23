import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface League {
  id: string
  name: string
  color: string
  minPoints: number
  maxPoints: number
  icon: string
  rewards: {
    daily: number
    weekly: number
  }
}

interface LeaguesSectionProps {
  currentUser: User | null
}

const LEAGUES: League[] = [
  {
    id: 'bronze',
    name: 'Бронзовая лига',
    color: 'from-amber-600 to-yellow-600',
    minPoints: 0,
    maxPoints: 9999,
    icon: 'Award',
    rewards: { daily: 1000, weekly: 5000 }
  },
  {
    id: 'silver',
    name: 'Серебряная лига',
    color: 'from-gray-400 to-gray-600',
    minPoints: 10000,
    maxPoints: 49999,
    icon: 'Medal',
    rewards: { daily: 2500, weekly: 15000 }
  },
  {
    id: 'gold',
    name: 'Золотая лига',
    color: 'from-yellow-400 to-yellow-600',
    minPoints: 50000,
    maxPoints: 199999,
    icon: 'Trophy',
    rewards: { daily: 5000, weekly: 35000 }
  },
  {
    id: 'platinum',
    name: 'Платиновая лига',
    color: 'from-cyan-400 to-blue-600',
    minPoints: 200000,
    maxPoints: 999999,
    icon: 'Crown',
    rewards: { daily: 10000, weekly: 75000 }
  },
  {
    id: 'diamond',
    name: 'Алмазная лига',
    color: 'from-purple-400 to-pink-600',
    minPoints: 1000000,
    maxPoints: Infinity,
    icon: 'Gem',
    rewards: { daily: 25000, weekly: 200000 }
  }
]

export default function LeaguesSection({ currentUser }: LeaguesSectionProps) {
  const [timeToReward, setTimeToReward] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const timeLeft = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeToReward(`${hours}ч ${minutes}мин`)
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
        <p className="text-muted-foreground">Войдите в аккаунт чтобы увидеть лиги</p>
      </div>
    )
  }

  const calculateLeaguePoints = (user: User): number => {
    // Очки лиги = заработанные монеты + уровень * 1000 + VIP бонус + безлимитная энергия бонус
    let points = user.gameStats.totalEarned
    points += user.gameStats.level * 1000
    
    const isVIP = localStorage.getItem(`vipStatus_${user.id}`) === 'true'
    const hasUnlimitedEnergy = localStorage.getItem(`unlimitedEnergy_${user.id}`) === 'true'
    
    if (isVIP) points += 50000
    if (hasUnlimitedEnergy) points += 500000
    
    return points
  }

  const getCurrentLeague = (points: number): League => {
    return LEAGUES.find(league => points >= league.minPoints && points <= league.maxPoints) || LEAGUES[0]
  }

  const getNextLeague = (currentLeague: League): League | null => {
    const currentIndex = LEAGUES.findIndex(league => league.id === currentLeague.id)
    return currentIndex < LEAGUES.length - 1 ? LEAGUES[currentIndex + 1] : null
  }

  const canClaimDailyReward = (): boolean => {
    const today = new Date().toISOString().split('T')[0]
    const lastClaim = localStorage.getItem(`leagueDaily_${currentUser.id}`)
    return lastClaim !== today
  }

  const canClaimWeeklyReward = (): boolean => {
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]
    const lastClaim = localStorage.getItem(`leagueWeekly_${currentUser.id}`)
    return lastClaim !== weekKey
  }

  const claimReward = (type: 'daily' | 'weekly') => {
    const currentPoints = calculateLeaguePoints(currentUser)
    const currentLeague = getCurrentLeague(currentPoints)
    const reward = currentLeague.rewards[type]

    const updatedStats = {
      ...currentUser.gameStats,
      coins: currentUser.gameStats.coins + reward
    }

    // Обновляем пользователя
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...currentUser, gameStats: updatedStats }
      localStorage.setItem('robotGameUsers', JSON.stringify(users))
    }

    // Отмечаем что награда получена
    if (type === 'daily') {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`leagueDaily_${currentUser.id}`, today)
    } else {
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      localStorage.setItem(`leagueWeekly_${currentUser.id}`, weekKey)
    }

    // Обновляем страницу для отображения изменений
    window.location.reload()
  }

  const currentPoints = calculateLeaguePoints(currentUser)
  const currentLeague = getCurrentLeague(currentPoints)
  const nextLeague = getNextLeague(currentLeague)

  const progressToNext = nextLeague ? 
    ((currentPoints - currentLeague.minPoints) / (nextLeague.minPoints - currentLeague.minPoints)) * 100 : 100

  // Получаем топ игроков текущей лиги
  const getAllUsers = (): User[] => {
    return JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
  }

  const getLeagueLeaderboard = (): Array<User & { points: number }> => {
    const allUsers = getAllUsers()
    return allUsers
      .map(user => ({ ...user, points: calculateLeaguePoints(user) }))
      .filter(user => getCurrentLeague(user.points).id === currentLeague.id)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
  }

  const leaderboard = getLeagueLeaderboard()
  const currentUserRank = leaderboard.findIndex(user => user.id === currentUser.id) + 1

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">🏆 Лиги</h2>
        <p className="text-muted-foreground">Соревнуйтесь с другими игроками</p>
      </div>

      {/* Текущая лига */}
      <Card className={`bg-gradient-to-r ${currentLeague.color} text-white`}>
        <CardContent className="p-6 text-center">
          <Icon name={currentLeague.icon as any} size={48} className="mx-auto mb-2" />
          <h3 className="text-xl font-bold mb-2">{currentLeague.name}</h3>
          <div className="text-lg font-semibold mb-2">
            {currentPoints.toLocaleString()} очков
          </div>
          {currentUserRank > 0 && (
            <div className="text-sm opacity-90">
              🏅 Место в лиге: #{currentUserRank}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Прогресс до следующей лиги */}
      {nextLeague && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">До {nextLeague.name}:</span>
                <span className="text-sm text-muted-foreground">
                  {(nextLeague.minPoints - currentPoints).toLocaleString()} очков
                </span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <div className="text-xs text-center text-muted-foreground">
                {Math.round(progressToNext)}% до повышения
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Награды лиги */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">🎁 Награды лиги</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ежедневная:</span>
                <Badge variant="outline">+{currentLeague.rewards.daily.toLocaleString()}</Badge>
              </div>
              <button
                onClick={() => claimReward('daily')}
                disabled={!canClaimDailyReward()}
                className={`w-full py-2 px-3 rounded text-sm font-medium ${
                  canClaimDailyReward() 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canClaimDailyReward() ? 'Получить' : 'Получено'}
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Еженедельная:</span>
                <Badge variant="outline">+{currentLeague.rewards.weekly.toLocaleString()}</Badge>
              </div>
              <button
                onClick={() => claimReward('weekly')}
                disabled={!canClaimWeeklyReward()}
                className={`w-full py-2 px-3 rounded text-sm font-medium ${
                  canClaimWeeklyReward() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canClaimWeeklyReward() ? 'Получить' : 'Получено'}
              </button>
            </div>
          </div>
          <div className="text-xs text-center text-muted-foreground mt-2">
            ⏱️ Обновление через: {timeToReward}
          </div>
        </CardContent>
      </Card>

      {/* Таблица лидеров лиги */}
      {leaderboard.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">🥇 Лидеры {currentLeague.name}</h4>
            <div className="space-y-2">
              {leaderboard.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`flex items-center justify-between p-2 rounded ${
                    user.id === currentUser.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-500' :
                      index === 2 ? 'text-amber-600' : 'text-muted-foreground'
                    }`}>
                      #{index + 1}
                    </span>
                    <span className="font-medium">
                      {user.username}
                      {user.id === currentUser.id && ' (Вы)'}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {user.points.toLocaleString()} очков
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Все лиги */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">📊 Все лиги</h4>
          <div className="space-y-2">
            {LEAGUES.map(league => (
              <div 
                key={league.id}
                className={`flex items-center justify-between p-3 rounded border ${
                  league.id === currentLeague.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={league.icon as any} size={20} />
                  <span className="font-medium">{league.name}</span>
                  {league.id === currentLeague.id && (
                    <Badge className="bg-blue-500">Текущая</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {league.minPoints.toLocaleString()}
                  {league.maxPoints !== Infinity && `- ${league.maxPoints.toLocaleString()}`}
                  {league.maxPoints === Infinity && '+'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}