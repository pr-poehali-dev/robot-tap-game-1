import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface CallToActionSectionProps {
  onOpenRegister: () => void
}

export default function CallToActionSection({ onOpenRegister }: CallToActionSectionProps) {
  return (
    <section className="text-center py-16">
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-white">
          🚀 Готовы Начать Зарабатывать?
        </h2>
        <p className="text-xl mb-4 text-gray-300">
          Присоединяйтесь к тысячам игроков уже зарабатывающих в YaTitan!
        </p>
        <p className="text-lg mb-8 text-yellow-300">
          💰 <strong>Зарабатывайте реальные деньги играя!</strong> Выводите заработанные монеты прямо на карту!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onOpenRegister}
            size="lg" 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-12 py-4 text-xl"
          >
            <Icon name="Rocket" size={24} className="mr-3" />
            Начать Играть Сейчас!
          </Button>
        </div>
      </div>
    </section>
  )
}