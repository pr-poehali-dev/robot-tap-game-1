import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface ProfileSectionProps {
  currentUser: User | null
  onLogout: () => void
}

export default function ProfileSection({ currentUser, onLogout }: ProfileSectionProps) {
  if (!currentUser) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="User" size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{currentUser.username}</h2>
          <Badge variant="secondary">Уровень {currentUser.gameStats.level}</Badge>
          <p className="text-sm text-muted-foreground mt-2">ID: {currentUser.id}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-primary">{currentUser.gameStats.totalEarned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Всего заработано</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-secondary">{(currentUser.gameStats.totalEarned / 10000).toFixed(2)} ₽</div>
            <div className="text-sm text-muted-foreground">В рублях</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={() => window.location.href = '/admin'} 
          variant="outline" 
          className="w-full"
        >
          <Icon name="Shield" className="mr-2" />
          Админка (тест)
        </Button>
        
        <Button onClick={onLogout} variant="destructive" className="w-full">
          <Icon name="LogOut" className="mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  )
}