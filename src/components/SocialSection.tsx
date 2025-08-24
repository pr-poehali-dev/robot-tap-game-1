import Icon from '@/components/ui/icon'
import { User, GameStats } from './GameSection'
import WheelTab from './social/WheelTab'

interface SocialSectionProps {
  currentUser: User | null
  onUpdateStats: (stats: GameStats) => void
}

export default function SocialSection({ currentUser, onUpdateStats }: SocialSectionProps) {
  if (!currentUser) {
    return (
      <div className="text-center space-y-4">
        <Icon name="Lock" size={64} className="mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Требуется авторизация</h3>
        <p className="text-muted-foreground">Войдите в аккаунт для доступа к колесу фортуны</p>
      </div>
    )
  }

  return <WheelTab currentUser={currentUser} onUpdateStats={onUpdateStats} />
}