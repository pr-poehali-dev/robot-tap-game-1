import { Card, CardContent } from '@/components/ui/card'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface StatsHeaderProps {
  currentUser: User | null
  onAutoTapClick: () => void
  onWithdrawClick: () => void
  onTabChange: (tab: string) => void
}

export default function StatsHeader({ currentUser, onAutoTapClick, onWithdrawClick, onTabChange }: StatsHeaderProps) {
  if (!currentUser) return null

  return (
    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full mb-3">
      <Card className="bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-orange-500/20 border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-0.5">
              <Icon name="Coins" size={12} className="text-yellow-600 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-[10px] xs:text-xs sm:text-sm font-black text-yellow-700 drop-shadow-sm leading-tight">{currentUser.gameStats.coins.toLocaleString()}</div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-yellow-600/80">Монеты</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-400/20 via-blue-500/10 to-purple-500/20 border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-0.5">
              <Icon name="Zap" size={12} className="text-blue-600 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-[10px] xs:text-xs sm:text-sm font-black text-blue-700 drop-shadow-sm leading-tight">+{currentUser.gameStats.robotPower}</div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-blue-600/80">За тап</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-400/20 via-red-500/10 to-pink-500/20 border-orange-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onAutoTapClick}>
        <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-0.5">
              <Icon name="Car" size={12} className="text-orange-600 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-[10px] xs:text-xs sm:text-sm font-black text-orange-700 drop-shadow-sm leading-tight">AUTO</div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-orange-600/80">Тап</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-teal-500/20 border-green-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onWithdrawClick}>
        <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-0.5">
              <Icon name="Wallet" size={12} className="text-green-600 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-green-700 drop-shadow-sm leading-tight">ВЫВОД</div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-green-600/80">Средств</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-400/20 via-indigo-500/10 to-blue-500/20 border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('leagues')}>
        <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-0.5">
              <Icon name="Medal" size={12} className="text-purple-600 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-purple-700 drop-shadow-sm leading-tight">ЛИГИ</div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-purple-600/80">Рейтинг</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-400/20 via-rose-500/10 to-red-500/20 border-pink-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('minigames')}>
        <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-0.5">
              <Icon name="Dices" size={12} className="text-pink-600 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs font-black text-pink-700 drop-shadow-sm leading-tight">ИГРЫ</div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-pink-600/80">Мини</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-orange-500/20 border-amber-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('achievements')}>
        <CardContent className="p-1 xs:p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-0.5">
              <Icon name="Trophy" size={12} className="text-amber-600 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-amber-700 drop-shadow-sm leading-tight">ТРОФЕИ</div>
            <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-amber-600/80">Награды</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}