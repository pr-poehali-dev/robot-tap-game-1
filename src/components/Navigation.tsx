import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User } from '@/types/user'

interface NavigationProps {
  activeTab: string
  currentUser: User | null
  onTabChange: (tab: string) => void
}

export default function Navigation({ activeTab, currentUser, onTabChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const tabs = [
    { id: 'game', label: 'Игра', icon: 'Gamepad2' },
    { id: 'social', label: 'Фортуна', icon: 'TrendingUp' },
    { id: 'tasks', label: 'Задания', icon: 'CheckSquare' },
    { id: 'upgrades', label: 'Улучшения', icon: 'Zap' },
    { id: 'robots', label: 'Роботы', icon: 'Bot' },
    { id: 'profile', label: 'Профиль', icon: 'User' }
  ]

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation - скрыто на мобильных */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-center max-w-screen-xl mx-auto">
          <div className="flex gap-2 p-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center py-3 h-auto px-4 min-w-[80px]"
                disabled={!currentUser && tab.id !== 'profile'}
              >
                <Icon name={tab.icon as any} size={20} />
                <span className="text-xs mt-1 leading-tight">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - видно только на мобильных и планшетах */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        {/* Мобильное меню - горизонтальная прокрутка */}
        <div className="sm:hidden flex overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 p-1 min-w-max">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center py-2 h-auto px-3 min-w-[60px] flex-shrink-0"
                disabled={!currentUser && tab.id !== 'profile'}
              >
                <Icon name={tab.icon as any} size={16} />
                <span className="text-[10px] mt-0.5 leading-tight whitespace-nowrap">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Планшетное меню - обычная сетка */}
        <div className="hidden sm:block md:hidden">
          <div className="flex justify-center">
            <div className="flex gap-1 p-1 max-w-full overflow-hidden">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className="flex flex-col items-center py-2 h-auto px-2 min-w-[70px] flex-1"
                  disabled={!currentUser && tab.id !== 'profile'}
                >
                  <Icon name={tab.icon as any} size={18} />
                  <span className="text-[11px] mt-0.5 leading-tight">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>


    </>
  )
}