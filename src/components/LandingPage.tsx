import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Icon from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import AuthModal from '@/components/AuthModal'
import { useRealTimeStats } from '@/hooks/useRealTimeStats'
import RobotStatsDisplay from '@/components/RobotStatsDisplay'

interface LandingPageProps {
  onLogin: (form: { username: string; email: string; password: string }) => void
  onRegister: (form: { username: string; email: string; password: string }) => void
}

const robots = [
  {
    id: 'basic',
    name: 'Базовый робот',
    power: 1,
    price: 0,
    description: 'Стандартный робот для начинающих игроков. Бесплатный и вечный!',
    icon: '🤖',
    image: '/img/0c89b02e-e86a-4f7d-ab06-628ffeff8291.jpg',
    lifespan: '∞'
  },
  {
    id: 'worker',
    name: 'Рабочий робот',
    power: 2,
    price: 5000,
    description: 'Добывает в 2 раза больше монет. Надёжный помощник на 30 дней.',
    icon: '👷‍♂️',
    image: '/img/6298380d-94b8-449b-8539-a248456cf888.jpg',
    lifespan: '30 дней'
  },
  {
    id: 'engineer',
    name: 'Инженер',
    power: 3,
    price: 15000,
    description: 'Умный робот с тройной мощностью. Работает 45 дней.',
    icon: '👨‍💻',
    image: '/img/8b9dcf07-12d5-4043-a5a5-907c0a63627b.jpg',
    lifespan: '45 дней'
  },
  {
    id: 'scientist',
    name: 'Учёный',
    power: 5,
    price: 50000,
    description: 'Продвинутый робот-исследователь. Мощность x5, работает 60 дней.',
    icon: '👨‍🔬',
    image: '/img/2ec52712-5033-4e4d-91cd-4251a6f218c1.jpg',
    lifespan: '60 дней'
  },
  {
    id: 'commander',
    name: 'Командир',
    power: 10,
    price: 150000,
    description: 'Элитный робот высшего класса. Мощность x10, срок службы 90 дней.',
    icon: '👨‍✈️',
    image: '/img/646c617e-8b01-47fc-a700-b85b270caaee.jpg',
    lifespan: '90 дней'
  },
  {
    id: 'cyborg',
    name: 'Киборг',
    power: 20,
    price: 500000,
    description: 'Легендарный робот будущего! Мощность x20, работает 100 дней.',
    icon: '🦾',
    image: '/img/89a0d696-e417-48e9-82be-fc15e0417ff4.jpg',
    lifespan: '100 дней'
  },
  {
    id: 'student',
    name: 'Работа школьника',
    power: 35,
    price: 780000,
    description: 'Умный ученик готов к новому учебному году! x35 монет, 120 дней.',
    icon: '🎓',
    image: '/img/ac2ca91c-0b9f-44f7-b5b4-a2d871140891.jpg',
    lifespan: '120 дней'
  },
  {
    id: 'quantum',
    name: 'Квантовый титан',
    power: 75,
    price: 5700000,
    description: 'Элитный робот будущего с квантовой технологией! x75 монет, 180 дней.',
    icon: '⚡',
    image: '/img/8e056dbc-5c2c-42e4-ae1e-4b9f2306236f.jpg',
    lifespan: '180 дней'
  },
  {
    id: 'gingerbread',
    name: 'Пряничный Робот',
    power: 40,
    price: 1700000,
    description: 'Сладкий помощник с новогодним настроением! x40 монет, 140 дней.',
    icon: '🍪',
    image: '/img/c8c90612-581c-47ce-b99a-4c397fa0f01b.jpg',
    lifespan: '140 дней'
  },
  {
    id: 'coffee',
    name: 'Кофейный робот',
    power: 50,
    price: 3450000,
    description: 'Бодрящий робот для истинных кофеманов! x50 монет, 160 дней.',
    icon: '☕',
    image: '/img/646c617e-8b01-47fc-a700-b85b270caaee.jpg',
    lifespan: '160 дней'
  }
]

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

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const [activeRobot, setActiveRobot] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register')
  
  const { stats, formatNumber } = useRealTimeStats()

  const handleOpenLogin = () => {
    setAuthModalTab('login')
    setIsAuthModalOpen(true)
  }

  const handleOpenRegister = () => {
    setAuthModalTab('register')
    setIsAuthModalOpen(true)
  }

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
            <p className="text-md opacity-80 mt-2">💰 <strong>Выводите реальные деньги</strong> за игровые достижения!</p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleOpenRegister}
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 text-lg"
            >
              <Icon name="UserPlus" size={20} className="mr-2" />
              Начать Играть
            </Button>
            <Button 
              onClick={handleOpenLogin}
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
              <span>Активных игроков: <strong>{stats.activeUsers || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Coins" size={16} />
              <span>Монет заработано: <strong>{formatNumber(stats.totalCoinsEarned)}</strong></span>
            </div>
            <RobotStatsDisplay 
              totalRobots={stats.totalRobots} 
              robotBreakdown={stats.robotBreakdown} 
            />
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {robots.map((robot, index) => (
              <Card 
                key={robot.id}
                className={`cursor-pointer transition-all duration-300 backdrop-blur-sm overflow-hidden ${
                  activeRobot === index 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 scale-105' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                } text-white`}
                onClick={() => setActiveRobot(index)}
              >
                {/* Изображение робота */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={robot.image}
                    alt={robot.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-2 right-2 text-2xl">{robot.icon}</div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/50 text-white border-white/20">
                      x{robot.power} мощность
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{robot.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    {robot.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                      {robot.price === 0 ? 'Бесплатно' : `${robot.price.toLocaleString()} 💰`}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      ⏱️ {robot.lifespan}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-400">
                      Доход за клик: <strong className="text-green-400">+{robot.power} монет</strong>
                    </div>
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

        {/* Final CTA */}
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
                onClick={handleOpenRegister}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </div>
  )
}