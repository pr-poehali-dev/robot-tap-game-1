import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    image: '/img/82ee2bff-d0ba-488c-b30b-edf4b77af986.jpg',
    lifespan: '160 дней'
  },
  {
    id: 'radionoumi',
    name: 'Radio Noumi',
    power: 85,
    price: 9800500,
    description: 'Высокотехнологичный робот с системой радиосвязи! x85 монет, 190 дней.',
    icon: '📻',
    image: '/img/f918766f-2718-497f-9cfb-29e12bc98904.jpg',
    lifespan: '190 дней'
  },
  {
    id: 'autumn',
    name: 'Осенний робот',
    power: 100,
    price: 15980752,
    description: 'Сезонный робот с силой осеннего урожая! x100 монет, 200 дней.',
    icon: '🍂',
    image: '/img/1274db0f-36b9-4bb9-b0ce-0f4a14760b3b.jpg',
    lifespan: '200 дней',
    availableFrom: '1 сентября 2025'
  }
]

export default function RobotsShowcaseSection() {
  const [activeRobot, setActiveRobot] = useState(0)

  return (
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
              {robot.availableFrom && (
                <div className="text-xs text-orange-400 font-medium">
                  🔒 Доступен с {robot.availableFrom}
                </div>
              )}
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
  )
}