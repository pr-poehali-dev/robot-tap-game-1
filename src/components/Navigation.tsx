import { useState, useEffect } from 'react'
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
  const [isTouch, setIsTouch] = useState(false)
  
  const tabs = [
    { id: 'game', label: 'Игра', icon: 'Gamepad2' },
    { id: 'tasks', label: 'Задания', icon: 'CheckSquare' },
    { id: 'upgrades', label: 'Улучшения', icon: 'Zap' },
    { id: 'robots', label: 'Роботы', icon: 'Bot' },
    { id: 'profile', label: 'Профиль', icon: 'User' }
  ]

  // Определяем touch устройства
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    
    checkTouch()
    window.addEventListener('resize', checkTouch)
    
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation - скрыто на мобильных и touch устройствах */}
      <div className={`${isTouch ? 'hidden' : 'hidden md:block'} fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 animate-in slide-in-from-bottom duration-500`}>
        <div className="flex justify-center max-w-screen-xl mx-auto">
          <div className="flex gap-2 p-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-3 h-auto px-4 min-w-[80px] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${activeTab === tab.id ? 'animate-pulse bg-gradient-to-r from-primary to-primary/80' : 'hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10'}`}
                disabled={!currentUser && tab.id !== 'profile'}
              >
                <Icon name={tab.icon as any} size={20} className={`transition-all duration-300 ${activeTab === tab.id ? 'animate-bounce' : 'hover:rotate-12'}`} />
                <span className="text-xs mt-1 leading-tight">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Touch Navigation - только для touch устройств */}
      {isTouch && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 animate-in slide-in-from-bottom duration-300">
          {/* Touch меню - адаптивная сетка */}
          <div className="block">
            <div className="flex justify-center">
              <div className="flex gap-1 p-1 max-w-full overflow-hidden">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center py-2 h-auto px-2 min-w-[60px] flex-1 touch-manipulation transition-all duration-200 transform active:scale-95 ${activeTab === tab.id ? 'animate-pulse bg-gradient-to-r from-primary to-primary/80' : 'hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10'}`}
                    disabled={!currentUser && tab.id !== 'profile'}
                  >
                    <Icon name={tab.icon as any} size={18} className={`transition-all duration-200 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                    <span className="text-[11px] mt-0.5 leading-tight">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation - видно только на не-touch устройствах */}
      {!isTouch && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 animate-in slide-in-from-bottom duration-300">
          {/* Мобильное меню - горизонтальная прокрутка */}
          <div className="sm:hidden flex overflow-x-auto scrollbar-hide">
            <div className="flex gap-0.5 p-1 min-w-max">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center py-2 h-auto px-2 min-w-[50px] flex-shrink-0 transition-all duration-200 transform active:scale-95 ${activeTab === tab.id ? 'animate-pulse bg-gradient-to-r from-primary to-primary/80' : 'hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10'}`}
                  disabled={!currentUser && tab.id !== 'profile'}
                >
                  <Icon name={tab.icon as any} size={14} className={`transition-all duration-200 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                  <span className="text-[9px] mt-0.5 leading-tight whitespace-nowrap">{tab.label}</span>
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
                    className={`flex flex-col items-center py-2 h-auto px-2 min-w-[70px] flex-1 transition-all duration-200 transform active:scale-95 ${activeTab === tab.id ? 'animate-pulse bg-gradient-to-r from-primary to-primary/80' : 'hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/10'}`}
                    disabled={!currentUser && tab.id !== 'profile'}
                  >
                    <Icon name={tab.icon as any} size={18} className={`transition-all duration-200 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                    <span className="text-[11px] mt-0.5 leading-tight">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  )
}