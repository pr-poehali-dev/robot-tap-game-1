import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Icon from '@/components/ui/icon'

export default function GameFeaturesSection() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        ⭐ Особенности Игры
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon name="Zap" size={24} className="text-yellow-400" />
              Пассивный Доход
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• Роботы работают даже когда вы не в игре</p>
            <p>• Автоматический сбор монет каждые 6 часов</p>
            <p>• Чем больше роботов - тем больше пассивного дохода</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon name="Trophy" size={24} className="text-yellow-400" />
              Система Достижений
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• Выполняйте достижения и получайте награды</p>
            <p>• Ежедневные задания с крутыми призами</p>
            <p>• Рейтинговая система и лиги игроков</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon name="Users" size={24} className="text-yellow-400" />
              Социальные Функции
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• Приглашайте друзей и получайте бонусы</p>
            <p>• Соревнуйтесь в глобальных рейтингах</p>
            <p>• Делитесь достижениями в социальных сетях</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon name="Wallet" size={24} className="text-yellow-400" />
              Вывод Денег
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• Зарабатывайте реальные деньги за игру</p>
            <p>• Выводите монеты на банковские карты</p>
            <p>• Минимальная сумма для вывода - доступна всем</p>
            <p>• Быстрые выплаты в течение 24 часов</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon name="Gamepad2" size={24} className="text-yellow-400" />
              Мини-игры
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• Играйте в увлекательные мини-игры</p>
            <p>• Зарабатывайте дополнительные монеты</p>
            <p>• Разнообразьте игровой процесс</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}