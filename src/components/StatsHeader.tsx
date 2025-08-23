import { Card, CardContent } from '@/components/ui/card'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface StatsHeaderProps {
  currentUser: User | null
  onAutoTapClick: () => void
}

export default function StatsHeader({ currentUser, onAutoTapClick }: StatsHeaderProps) {
  if (!currentUser) return null

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full mb-4">
      <Card className="bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-orange-500/20 border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-3 sm:p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Coins" size={20} className="text-yellow-600 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-yellow-700 drop-shadow-sm">{currentUser.gameStats.coins.toLocaleString()}</div>
            <div className="text-xs sm:text-sm font-semibold text-yellow-600/80">Монеты</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-400/20 via-blue-500/10 to-purple-500/20 border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-3 sm:p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Zap" size={20} className="text-blue-600 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-700 drop-shadow-sm">+{currentUser.gameStats.robotPower}</div>
            <div className="text-xs sm:text-sm font-semibold text-blue-600/80">За тап</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-400/20 via-red-500/10 to-pink-500/20 border-orange-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onAutoTapClick}>
        <CardContent className="p-3 sm:p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Car" size={20} className="text-orange-600 sm:w-6 sm:h-6" />
            </div>
            <div className="text-lg sm:text-xl font-black text-orange-700 drop-shadow-sm">AUTO</div>
            <div className="text-xs sm:text-sm font-semibold text-orange-600/80">Тап</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}