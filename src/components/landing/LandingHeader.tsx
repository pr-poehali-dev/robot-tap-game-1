import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface LandingHeaderProps {
  onOpenLogin: () => void
  onOpenRegister: () => void
  registrationCount: number
  onlineCount: number
}

const formatCount = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'  
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export default function LandingHeader({ 
  onOpenLogin, 
  onOpenRegister, 
  registrationCount, 
  onlineCount 
}: LandingHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative container mx-auto px-4 py-8 text-center text-white">
        <div className="mb-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            YaTitan
          </h1>
          <p className="text-xl md:text-2xl mb-2">🚀 Робот Кликер Будущего!</p>
          <p className="text-lg opacity-90">Кликайте, улучшайте, зарабатывайте!</p>
          <p className="text-md opacity-80 mt-2">💰 <strong>Выводите реальные деньги</strong> за игровые достижения!</p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            onClick={onOpenRegister}
            size="lg" 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 text-lg"
          >
            <Icon name="UserPlus" size={20} className="mr-2" />
            Начать Играть
          </Button>
          <Button 
            onClick={onOpenLogin}
            size="lg" 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg"
          >
            <Icon name="LogIn" size={20} className="mr-2" />
            Войти в Игру
          </Button>
        </div>

        {/* Beautiful User Counter */}
        <div className="flex justify-center gap-4 sm:gap-8">
          <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-200">
              <Icon name="UserCheck" size={18} className="text-emerald-400" />
              <div>
                <div className="text-lg font-bold text-white">{formatCount(registrationCount)}</div>
                <div className="text-xs opacity-90">Регистраций</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 text-cyan-200">
              <Icon name="Users" size={18} className="text-cyan-400" />
              <div>
                <div className="text-lg font-bold text-white">{formatCount(onlineCount)}</div>
                <div className="text-xs opacity-90">Онлайн</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}