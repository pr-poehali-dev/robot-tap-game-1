import { Card, CardContent } from '@/components/ui/card'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface StatsHeaderProps {
  currentUser: User | null
  onAutoTapClick: () => void
  onTabChange: (tab: string) => void
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'  
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

export default function StatsHeader({ currentUser, onAutoTapClick, onTabChange }: StatsHeaderProps) {
  if (!currentUser) return null

  return (
    <div className="grid grid-cols-6 gap-0.5 sm:gap-1 w-full mb-3">
      <div className="group relative">
        <Card className="bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-orange-500/20 border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[40px] sm:min-h-[50px]">
              <Icon name="Coins" size={16} className="text-yellow-600 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-1" />
              <div className="text-xs sm:text-sm md:text-base font-black text-yellow-700 drop-shadow-sm">
                {formatNumber(currentUser.gameStats.coins)}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Монеты
        </div>
      </div>
      
      <div className="group relative">
        <Card className="bg-gradient-to-br from-blue-400/20 via-blue-500/10 to-purple-500/20 border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[40px] sm:min-h-[50px]">
              <Icon name="Zap" size={16} className="text-blue-600 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-1" />
              <div className="text-xs sm:text-sm md:text-base font-black text-blue-700 drop-shadow-sm">
                +{currentUser.gameStats.robotPower}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          За тап
        </div>
      </div>
      
      <div className="group relative">
        <Card className="bg-gradient-to-br from-orange-400/20 via-red-500/10 to-pink-500/20 border-orange-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onAutoTapClick}>
          <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[40px] sm:min-h-[50px]">
              <Icon name="Car" size={16} className="text-orange-600 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </CardContent>
        </Card>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Auto тап
        </div>
      </div>

<div className="group relative">
        <Card className="bg-gradient-to-br from-purple-400/20 via-indigo-500/10 to-blue-500/20 border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('leagues')}>
          <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[40px] sm:min-h-[50px]">
              <Icon name="Medal" size={16} className="text-purple-600 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </CardContent>
        </Card>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Лиги рейтинг
        </div>
      </div>

      <div className="group relative">
        <Card className="bg-gradient-to-br from-pink-400/20 via-rose-500/10 to-red-500/20 border-pink-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('minigames')}>
          <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[40px] sm:min-h-[50px]">
              <Icon name="Dices" size={16} className="text-pink-600 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </CardContent>
        </Card>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Игры мини
        </div>
      </div>

      <div className="group relative">
        <Card className="bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-teal-500/20 border-green-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('robots')}>
          <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[40px] sm:min-h-[50px]">
              <Icon name="Bot" size={16} className="text-green-600 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </CardContent>
        </Card>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Роботы
        </div>
      </div>
    </div>
  )
}