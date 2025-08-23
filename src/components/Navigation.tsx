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
    { id: 'auto', label: 'Авто', icon: 'Car' },
    { id: 'withdraw', label: 'Вывод', icon: 'Wallet' },
    { id: 'rating', label: 'Рейтинг', icon: 'Trophy' },
    { id: 'tasks', label: 'Задания', icon: 'CheckSquare' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="relative grid grid-cols-7 gap-0.5 sm:gap-1 p-1 sm:p-2">
        {tabs.map((tab) => {
          if (tab.id === 'auto') {
            return (
              <div key={tab.id} className="flex justify-center items-center relative">
                <Button
                  variant={activeTab === tab.id ? "default" : "secondary"}
                  onClick={() => onTabChange(tab.id)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg transform -translate-y-2 flex items-center justify-center"
                  disabled={!currentUser}
                >
                  <Icon name="Car" size={20} className="text-white sm:w-[24px] sm:h-[24px]" />
                </Button>
                <span className="absolute -bottom-1 text-[9px] sm:text-[10px] text-center font-medium text-muted-foreground">
                  {tab.label}
                </span>
              </div>
            )
          }
          
          return (
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
          )
        })}
      </div>
    </div>
  )
}