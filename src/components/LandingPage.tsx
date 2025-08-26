import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Icon from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'

interface LandingPageProps {
  onLogin: () => void
  onRegister: () => void
}

const robots = [
  {
    id: 'basic',
    name: 'Базовый Робот',
    power: 1,
    price: 0,
    description: 'Стартовый робот для новичков. Приносит 1 монету за клик.',
    icon: '🤖',
    level: 1
  },
  {
    id: 'advanced',
    name: 'Продвинутый Робот',
    power: 5,
    price: 1000,
    description: 'Улучшенный робот с повышенной мощностью. +5 монет за клик.',
    icon: '🚀',
    level: 2
  },
  {
    id: 'titanium',
    name: 'Титановый Робот',
    power: 25,
    price: 10000,
    description: 'Мощный титановый робот для опытных игроков. +25 монет за клик.',
    icon: '⚡',
    level: 3
  },
  {
    id: 'quantum',
    name: 'Квантовый Робот',
    power: 100,
    price: 100000,
    description: 'Сверхмощный квантовый робот. +100 монет за клик!',
    icon: '🌟',
    level: 4
  },
  {
    id: 'cosmic',
    name: 'Космический Робот',
    power: 500,
    price: 1000000,
    description: 'Легендарный космический робот. +500 монет за клик!',
    icon: '🌌',
    level: 5
  }
]

const earnMethods = [
  {
    title: 'Клики по Роботу',
    description: 'Кликайте по роботу и получайте монеты. Чем сильнее робот, тем больше награда!',
    icon: 'MousePointer2',
    reward: '1-500 монет за клик'
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

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const [activeRobot, setActiveRobot] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-8 text-center text-white">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              YaTitan
            </h1>
            <p className="text-xl md:text-2xl mb-2">🚀 Робот Кликер Будущего!</p>
            <p className="text-lg opacity-90">Кликайте, улучшайте, зарабатывайте!</p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={onRegister}
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 text-lg"
            >
              <Icon name="UserPlus" size={20} className="mr-2" />
              Начать Играть
            </Button>
            <Button 
              onClick={onLogin}
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg"
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти в Игру
            </Button>
          </div>

          {/* Game Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              <span>Активных игроков: <strong>1,247</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Coins" size={16} />
              <span>Монет заработано: <strong>12.5M+</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Bot" size={16} />
              <span>Роботов создано: <strong>8,931</strong></span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Как Играть */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            🎮 Как Играть?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">👆</div>
                <CardTitle>1. Кликайте</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">Кликайте по роботу и зарабатывайте монеты. Каждый клик приносит доход!</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">⬆️</div>
                <CardTitle>2. Улучшайте</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">Покупайте новых роботов и улучшения для увеличения дохода!</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <CardTitle>3. Зарабатывайте</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">Получайте пассивный доход даже в оффлайне! Роботы работают 24/7!</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Роботы */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            🤖 Коллекция Роботов
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {robots.map((robot, index) => (
              <Card 
                key={robot.id}
                className={`cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                  activeRobot === index 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 scale-105' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                } text-white`}
                onClick={() => setActiveRobot(index)}
              >
                <CardHeader className="text-center">
                  <div className="text-5xl mb-2">{robot.icon}</div>
                  <CardTitle className="flex items-center justify-between">
                    {robot.name}
                    <Badge variant={robot.level === 1 ? "secondary" : robot.level <= 2 ? "default" : "destructive"}>
                      Ур. {robot.level}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Мощность: <strong>+{robot.power} монет/клик</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{robot.description}</p>
                  <div className="text-center">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                      {robot.price === 0 ? 'Бесплатно' : `${robot.price.toLocaleString()} монет`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Способы Заработка */}
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

        {/* Особенности */}
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

        {/* Final CTA */}
        <section className="text-center py-16">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white">
              🚀 Готовы Начать Зарабатывать?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Присоединяйтесь к тысячам игроков уже зарабатывающих в YaTitan!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onRegister}
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-12 py-4 text-xl"
              >
                <Icon name="Rocket" size={24} className="mr-3" />
                Начать Играть Сейчас!
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/20 py-8 text-center text-white">
        <div className="container mx-auto px-4">
          <p className="text-lg font-semibold mb-2">YaTitan - Робот Кликер</p>
          <p className="text-sm opacity-70">© 2024 Все права защищены. Создано с ❤️ для геймеров!</p>
        </div>
      </footer>
    </div>
  )
}