import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

const earnMethods = [
  {
    title: 'Клики по Роботу',
    description: 'Кликайте по роботу и получайте монеты. Чем сильнее робот, тем больше награда!',
    icon: 'MousePointer2',
    reward: '1-75 монет за клик'
  },
  {
    title: 'Ежедневные Задания',
    description: 'Выполняйте простые задания каждый день и получайте бонусы!',
    icon: 'CheckSquare',
    reward: 'До 10,000 монет'
  },
  {
    title: 'Автоматический Сбор',
    description: 'Роботы работают даже когда вы не в игре! Заходите и собирайте награды.',
    icon: 'Zap',
    reward: 'Пассивный доход'
  },
  {
    title: 'Вывод Денег',
    description: 'Зарабатывайте реальные деньги! Выводите заработанные монеты на свои счета.',
    icon: 'Wallet',
    reward: 'Реальные деньги!'
  },
  {
    title: 'Улучшения',
    description: 'Улучшайте своих роботов для увеличения прибыли и открытия новых возможностей.',
    icon: 'TrendingUp',
    reward: 'Увеличение дохода'
  },
  {
    title: 'Социальные Бонусы',
    description: 'Приглашайте друзей, участвуйте в рейтингах и получайте дополнительные награды!',
    icon: 'Users',
    reward: 'Специальные призы'
  },
  {
    title: 'Мини-игры',
    description: 'Играйте в увлекательные мини-игры и зарабатывайте дополнительные монеты!',
    icon: 'Gamepad2',
    reward: 'Бонусные монеты'
  }
]

export default function EarningMethodsSection() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        💸 Способы Заработка
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {earnMethods.map((method, index) => (
          <Card key={index} className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon name={method.icon as any} size={24} className="text-yellow-400" />
                {method.title}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {method.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                {method.reward}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}