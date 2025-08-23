import { Card, CardContent } from '@/components/ui/card'
import { User } from '../GameSection'

interface LeaderboardTabProps {
  currentUser: User | null
}

export default function LeaderboardTab({ currentUser }: LeaderboardTabProps) {
  if (!currentUser) return null

  const getLeaderboard = (): Array<User & { rank: number }> => {
    const users: User[] = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    return users
      .sort((a, b) => b.gameStats.totalEarned - a.gameStats.totalEarned)
      .map((user, index) => ({ ...user, rank: index + 1 }))
      .slice(0, 50)
  }

  const leaderboard = getLeaderboard()

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-center">🏆 Топ игроков</h3>
      {leaderboard.map(user => (
        <Card key={user.id} className={user.id === currentUser.id ? 'border-blue-500 bg-blue-50' : ''}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`font-bold ${
                  user.rank === 1 ? 'text-yellow-500' :
                  user.rank === 2 ? 'text-gray-500' :
                  user.rank === 3 ? 'text-amber-600' : 'text-muted-foreground'
                }`}>
                  #{user.rank}
                </span>
                <div>
                  <p className={`font-medium ${
                    user.id === currentUser.id ? 'text-blue-800' : 'text-foreground'
                  }`}>
                    {user.username}
                    {user.id === currentUser.id && ' (Вы)'}
                  </p>
                  <p className={`text-xs ${
                    user.id === currentUser.id ? 'text-blue-600' : 'text-muted-foreground'
                  }`}>
                    Уровень {user.gameStats.level}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  user.id === currentUser.id ? 'text-blue-800' : 'text-foreground'
                }`}>{user.gameStats.totalEarned.toLocaleString()}</p>
                <p className={`text-xs ${
                  user.id === currentUser.id ? 'text-blue-600' : 'text-muted-foreground'
                }`}>монет заработано</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}