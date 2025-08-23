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
    <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full mb-3">
      <Card className="bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-orange-500/20 border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Coins" size={14} className="text-yellow-600 sm:w-4 sm:h-4" />
            </div>
            <div className="text-sm sm:text-lg font-black text-yellow-700 drop-shadow-sm">{currentUser.gameStats.coins.toLocaleString()}</div>
            <div className="text-[10px] sm:text-xs font-semibold text-yellow-600/80">Монеты</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-400/20 via-blue-500/10 to-purple-500/20 border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Zap" size={14} className="text-blue-600 sm:w-4 sm:h-4" />
            </div>
            <div className="text-sm sm:text-lg font-black text-blue-700 drop-shadow-sm">+{currentUser.gameStats.robotPower}</div>
            <div className="text-[10px] sm:text-xs font-semibold text-blue-600/80">За тап</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-400/20 via-red-500/10 to-pink-500/20 border-orange-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onAutoTapClick}>
        <CardContent className="p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Car" size={14} className="text-orange-600 sm:w-4 sm:h-4" />
            </div>
            <div className="text-sm sm:text-lg font-black text-orange-700 drop-shadow-sm">AUTO</div>
            <div className="text-[10px] sm:text-xs font-semibold text-orange-600/80">Тап</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-teal-500/20 border-green-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onWithdrawClick}>
        <CardContent className="p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Wallet" size={14} className="text-green-600 sm:w-4 sm:h-4" />
            </div>
            <div className="text-sm sm:text-lg font-black text-green-700 drop-shadow-sm">ВЫВОД</div>
            <div className="text-[10px] sm:text-xs font-semibold text-green-600/80">Средств</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-400/20 via-indigo-500/10 to-blue-500/20 border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('leagues')}>
        <CardContent className="p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Medal" size={14} className="text-purple-600 sm:w-4 sm:h-4" />
            </div>
            <div className="text-sm sm:text-lg font-black text-purple-700 drop-shadow-sm">ЛИГИ</div>
            <div className="text-[10px] sm:text-xs font-semibold text-purple-600/80">Рейтинг</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-400/20 via-rose-500/10 to-red-500/20 border-pink-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('minigames')}>
        <CardContent className="p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Dices" size={14} className="text-pink-600 sm:w-4 sm:h-4" />
            </div>
            <div className="text-sm sm:text-lg font-black text-pink-700 drop-shadow-sm">ИГРЫ</div>
            <div className="text-[10px] sm:text-xs font-semibold text-pink-600/80">Мини</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-orange-500/20 border-amber-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onTabChange('achievements')}>
        <CardContent className="p-2 sm:p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Trophy" size={14} className="text-amber-600 sm:w-4 sm:h-4" />
            </div>
            <div className="text-sm sm:text-lg font-black text-amber-700 drop-shadow-sm">ТРОФЕИ</div>
            <div className="text-[10px] sm:text-xs font-semibold text-amber-600/80">Награды</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}