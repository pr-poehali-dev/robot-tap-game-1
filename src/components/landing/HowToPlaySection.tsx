import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HowToPlaySection() {
  return (
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
  )
}