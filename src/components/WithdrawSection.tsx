import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'
import StatsHeader from './StatsHeader'

interface WithdrawSectionProps {
  currentUser: User | null
  onAutoTapClick: () => void
  onTabChange: (tab: string) => void
}

export default function WithdrawSection({ currentUser, onAutoTapClick, onTabChange }: WithdrawSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentSystem, setPaymentSystem] = useState('')
  const [walletInput, setWalletInput] = useState('')
  const [cardInput, setCardInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('+7')
  const [amount, setAmount] = useState('')

  if (!currentUser) {
    return null
  }

  // Проверка активности игрока для доступа к выводу
  const checkPlayerActivity = () => {
    const registrationDate = new Date(currentUser.createdAt)
    const now = new Date()
    const daysSinceRegistration = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Проверяем историю трат
    const spentHistory = JSON.parse(localStorage.getItem(`spentHistory_${currentUser.id}`) || '[]')
    const totalSpent = spentHistory.reduce((sum: number, record: any) => sum + record.amount, 0)
    
    return {
      daysSinceRegistration,
      totalSpent,
      canWithdraw: daysSinceRegistration >= 10 && totalSpent > 0,
      minDaysRequired: 10,
      hasSpent: totalSpent > 0
    }
  }

  const activityCheck = checkPlayerActivity()

  const handleSubmit = () => {
    // Проверяем активность перед созданием заявки
    if (!activityCheck.canWithdraw) {
      return // Блокируем создание заявки
    }

    const withdrawRequest = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      amount: parseFloat(amount),
      coins: parseFloat(amount) * 10000,
      paymentSystem,
      paymentDetails: paymentSystem === 'yumoney' ? walletInput : 
                      paymentSystem === 'card' ? cardInput : phoneInput,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      processedAt: null,
      processedBy: null
    }
    
    // Сохраняем заявку в localStorage
    const existingRequests = JSON.parse(localStorage.getItem('withdrawRequests') || '[]')
    existingRequests.push(withdrawRequest)
    localStorage.setItem('withdrawRequests', JSON.stringify(existingRequests))
    
    console.log('Заявка на вывод создана:', withdrawRequest)
    setIsModalOpen(false)
    
    // Очищаем форму
    setPaymentSystem('')
    setWalletInput('')
    setCardInput('')
    setPhoneInput('+7')
    setAmount('')
    
    // Показываем уведомление пользователю
    alert('Заявка на вывод средств подана! Ожидайте обработки администратором.')
  }

  const getInputPlaceholder = () => {
    switch(paymentSystem) {
      case 'yumoney': return 'Введите номер кошелька ЮMoney'
      case 'card': return 'Введите номер банковской карты'
      case 'phone': return 'Введите номер телефона'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      <StatsHeader currentUser={currentUser} onAutoTapClick={onAutoTapClick} onWithdrawClick={() => {}} onTabChange={onTabChange} />
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Вывод средств</h2>
          <div className="text-4xl font-bold text-primary mb-2">{currentUser.gameStats.coins.toLocaleString()}</div>
          <div className="text-lg text-secondary">{(currentUser.gameStats.coins / 10000).toFixed(2)} ₽</div>
          <p className="text-sm text-muted-foreground mt-2">10,000 монет = 1 рубль</p>
        </CardContent>
      </Card>

      {/* Блок требований для доступа к выводу */}
      {!activityCheck.canWithdraw && (
        <Card className="border-orange-500/50 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Icon name="Lock" size={20} className="text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-700 mb-2">
                  🔒 Вывод временно заблокирован
                </h3>
                <p className="text-sm text-orange-600 mb-3">
                  Для доступа к выводу средств необходимо выполнить условия:
                </p>
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${
                    activityCheck.daysSinceRegistration >= 10 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    <Icon 
                      name={activityCheck.daysSinceRegistration >= 10 ? "CheckCircle" : "Circle"} 
                      size={16} 
                    />
                    <span>
                      Играть минимум 10 дней 
                      <span className="font-medium">
                        ({activityCheck.daysSinceRegistration}/10 дней)
                      </span>
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    activityCheck.hasSpent ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    <Icon 
                      name={activityCheck.hasSpent ? "CheckCircle" : "Circle"} 
                      size={16} 
                    />
                    <span>
                      Потратить монеты на улучшения/роботов 
                      <span className="font-medium">
                        ({activityCheck.totalSpent.toLocaleString()} потрачено)
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">
                    💡 <strong>Совет:</strong> Покупайте роботов и улучшения, чтобы увеличить доход и получить доступ к выводу!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={currentUser.gameStats.coins < 5000000 || !activityCheck.canWithdraw} 
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Icon name="Banknote" className="mr-2" />
              {activityCheck.canWithdraw ? 'Подать заявку на вывод' : 'Вывод заблокирован'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Заявка на вывод средств</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Сумма вывода (в рублях)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Введите сумму"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="500"
                  max={Math.floor(currentUser.gameStats.coins / 10000)}
                />
                <div className="text-xs text-muted-foreground">
                  Доступно: {Math.floor(currentUser.gameStats.coins / 10000)} ₽
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-system">Платёжная система</Label>
                <Select value={paymentSystem} onValueChange={setPaymentSystem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите платёжную систему" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yumoney">
                      <div className="flex items-center gap-2">
                        <Icon name="Wallet" size={16} />
                        ЮMoney
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <Icon name="CreditCard" size={16} />
                        Банковская карта
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Icon name="Smartphone" size={16} />
                        Сотовая связь
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentSystem === 'yumoney' && (
                <div className="space-y-2">
                  <Label htmlFor="wallet">Номер кошелька ЮMoney</Label>
                  <Input
                    id="wallet"
                    placeholder="Введите номер кошелька"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                  />
                </div>
              )}

              {paymentSystem === 'card' && (
                <div className="space-y-2">
                  <Label htmlFor="card">Номер банковской карты</Label>
                  <Input
                    id="card"
                    placeholder="1234 5678 9012 3456"
                    value={cardInput}
                    onChange={(e) => setCardInput(e.target.value)}
                    maxLength={19}
                  />
                </div>
              )}

              {paymentSystem === 'phone' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    placeholder="+7 XXX XXX XX XX"
                    value={phoneInput}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.startsWith('+7') || value === '+') {
                        setPhoneInput(value)
                      } else if (!value.startsWith('+')) {
                        setPhoneInput('+7' + value.replace(/^7/, ''))
                      }
                    }}
                    maxLength={12}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSubmit}
                  disabled={!paymentSystem || !amount || 
                    (paymentSystem === 'yumoney' && !walletInput) ||
                    (paymentSystem === 'card' && !cardInput) ||
                    (paymentSystem === 'phone' && phoneInput.length < 12)
                  }
                >
                  Подать заявку
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="text-center text-sm text-muted-foreground">
          Минимальная сумма для вывода: 5,000,000 монет (500₽)
        </div>
      </div>
    </div>
  )
}