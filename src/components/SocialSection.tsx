import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { User, GameStats } from './GameSection'
import LeaderboardTab from './social/LeaderboardTab'
import FriendsTab from './social/FriendsTab'
import ChatTab from './social/ChatTab'
import WheelTab from './social/WheelTab'

interface SocialSectionProps {
  currentUser: User | null
  onUpdateStats: (stats: GameStats) => void
}

interface FriendRequest {
  id: string
  from: string
  to: string
  timestamp: string
}

export default function SocialSection({ currentUser, onUpdateStats }: SocialSectionProps) {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends' | 'chat' | 'wheel'>('leaderboard')

  if (!currentUser) {
    return (
      <div className="text-center space-y-4">
        <Icon name="Lock" size={64} className="mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Требуется авторизация</h3>
        <p className="text-muted-foreground">Войдите в аккаунт для доступа к социальным функциям</p>
      </div>
    )
  }

  const getFriendRequests = (): FriendRequest[] => {
    return JSON.parse(localStorage.getItem(`friendRequests_${currentUser.id}`) || '[]')
  }

  const friendRequests = getFriendRequests()

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">👥 Социальные функции</h2>
        <p className="text-muted-foreground">Общайтесь с другими игроками</p>
      </div>

      {/* Табы */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'leaderboard' ? 'bg-background shadow-sm text-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'
          }`}
        >
          🏆 Рейтинг
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'friends' ? 'bg-background shadow-sm text-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'
          }`}
        >
          👫 Друзья {friendRequests.length > 0 && <Badge className="ml-1 bg-red-500">{friendRequests.length}</Badge>}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'chat' ? 'bg-background shadow-sm text-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'
          }`}
        >
          💬 Чат
        </button>
        <button
          onClick={() => setActiveTab('wheel')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'wheel' ? 'bg-background shadow-sm text-foreground' : 'hover:bg-muted-foreground/10 text-muted-foreground'
          }`}
        >
          🎰 Колесо
        </button>
      </div>

      {/* Контент табов */}
      {activeTab === 'leaderboard' && <LeaderboardTab currentUser={currentUser} />}
      {activeTab === 'friends' && <FriendsTab currentUser={currentUser} />}
      {activeTab === 'chat' && <ChatTab currentUser={currentUser} />}
      {activeTab === 'wheel' && <WheelTab currentUser={currentUser} onUpdateStats={onUpdateStats} />}
    </div>
  )
}