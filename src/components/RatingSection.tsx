import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface RatingSectionProps {
  currentUser: User | null
}

export default function RatingSection({ currentUser }: RatingSectionProps) {
  if (!currentUser) {
    return null
  }

  const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
  const sortedUsers = users.sort((a: User, b: User) => b.gameStats.totalEarned - a.gameStats.totalEarned).slice(0, 10)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Топ игроков</h2>
      
      {sortedUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Пока нет других игроков</p>
          </CardContent>
        </Card>
      ) : (
        sortedUsers.map((user: User, index: number) => (
          <Card key={user.id} className={user.id === currentUser.id ? 'ring-2 ring-primary' : ''}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant={index < 3 ? "default" : "outline"}>#{index + 1}</Badge>
                <div>
                  <div className="font-semibold">
                    {user.username} {user.id === currentUser.id && '(Вы)'}
                  </div>
                  <div className="text-sm text-muted-foreground">Уровень {user.gameStats.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{user.gameStats.totalEarned.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">монет</div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}