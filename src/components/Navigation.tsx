import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface NavigationProps {
  activeTab: string
  currentUser: User | null
  onTabChange: (tab: string) => void
}

export default function Navigation({ activeTab, currentUser, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'game', label: 'Игра', icon: 'Gamepad2' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'upgrades', label: 'Улучшения', icon: 'Zap' },
    { id: 'withdraw', label: 'Вывод', icon: 'Wallet' },
    { id: 'rating', label: 'Рейтинг', icon: 'Trophy' },
    { id: 'tasks', label: 'Задания', icon: 'CheckSquare' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="grid grid-cols-6 gap-0.5 sm:gap-1 p-1 sm:p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center py-2 sm:py-3 h-auto px-1 sm:px-2"
            disabled={!currentUser && tab.id !== 'profile'}
          >
            <Icon name={tab.icon as any} size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 hidden sm:block">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}