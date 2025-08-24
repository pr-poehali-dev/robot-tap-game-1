import Icon from '@/components/ui/icon'
import { formatNumber } from '@/hooks/useUserActivity'

interface UserCountersProps {
  registrationCount: number
  onlineCount: number
}

export default function UserCounters({ registrationCount, onlineCount }: UserCountersProps) {
  return (
    <>
      {/* Кнопка счетчика регистраций - адаптивная слева */}
      <div className="fixed left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-50 group">
        <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full shadow-lg border border-primary/20 hover:bg-primary transition-all duration-200 hover:scale-105 cursor-pointer px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] text-center">
          <div className="flex flex-col items-center">
            <Icon name="Users" size={12} className="sm:w-4 sm:h-4 md:w-5 md:h-5 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold leading-none">
              {formatNumber(registrationCount)}
            </span>
          </div>
        </div>
        
        {/* Тултип для ПК - показывается снизу при наведении */}
        <div className="hidden md:block absolute left-1/2 top-full mt-2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
            Регистрации
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Кнопка счетчика онлайн - адаптивная справа */}
      <div className="fixed right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-green-500/90 backdrop-blur-sm text-white rounded-full shadow-lg border border-green-400/20 hover:bg-green-500 transition-all duration-200 hover:scale-105 cursor-pointer px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-300 rounded-full animate-pulse mr-1"></div>
              <Icon name="Wifi" size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-bold leading-none">
              {formatNumber(onlineCount)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}