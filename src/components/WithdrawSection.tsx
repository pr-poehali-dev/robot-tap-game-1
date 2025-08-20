import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface WithdrawSectionProps {
  currentUser: User | null
}

export default function WithdrawSection({ currentUser }: WithdrawSectionProps) {
  if (!currentUser) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Вывод средств</h2>
          <div className="text-4xl font-bold text-primary mb-2">{currentUser.gameStats.coins.toLocaleString()}</div>
          <div className="text-lg text-secondary">{(currentUser.gameStats.coins / 10000).toFixed(2)} ₽</div>
          <p className="text-sm text-muted-foreground mt-2">10,000 монет = 1 рубль</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button 
          disabled={currentUser.gameStats.coins < 10000} 
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Icon name="Banknote" className="mr-2" />
          Подать заявку на вывод
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          Минимальная сумма для вывода: 10,000 монет (1₽)
        </div>
      </div>
    </div>
  )
}