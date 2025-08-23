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
    { id: 'social', label: 'Друзья', icon: 'Users' },
    { id: 'tasks', label: 'Задания', icon: 'CheckSquare' },
    { id: 'upgrades', label: 'Улучшения', icon: 'Zap' },
    { id: 'robots', label: 'Роботы', icon: 'Bot' },
    { id: 'profile', label: 'Профиль', icon: 'User' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-center max-w-screen-xl mx-auto overflow-x-auto">
        <div className="flex gap-1 sm:gap-2 p-1 sm:p-2 min-w-max sm:min-w-0">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center py-2 sm:py-3 h-auto px-2 sm:px-4 min-w-[60px] sm:min-w-[80px] flex-1 sm:flex-none"
              disabled={!currentUser && tab.id !== 'profile'}
            >
              <Icon name={tab.icon as any} size={16} className="sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 leading-tight">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}