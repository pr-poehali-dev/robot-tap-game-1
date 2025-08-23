import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface MinigamesSectionProps {
  currentUser: User | null
  onUpdateCoins: (newCoins: number) => void
}

export default function MinigamesSection({ currentUser, onUpdateCoins }: MinigamesSectionProps) {
  const [rouletteSpinning, setRouletteSpinning] = useState(false)
  const [rouletteResult, setRouletteResult] = useState<number | null>(null)
  const [slotSpinning, setSlotSpinning] = useState(false)
  const [slotResult, setSlotResult] = useState<string[]>(['🍋', '🍋', '🍋'])
  const [guessNumber, setGuessNumber] = useState('')
  const [guessResult, setGuessResult] = useState<string | null>(null)

  if (!currentUser) {
    return (
      <div className="text-center space-y-4">
        <Icon name="Lock" size={64} className="mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Требуется авторизация</h3>
        <p className="text-muted-foreground">Войдите в аккаунт чтобы играть</p>
      </div>
    )
  }

  // Рулетка удачи
  const spinRoulette = (bet: number) => {
    if (currentUser.gameStats.coins < bet) {
      alert('Недостаточно монет!')
      return
    }

    setRouletteSpinning(true)
    setRouletteResult(null)
    
    // Уменьшаем монеты на ставку
    const newCoins = currentUser.gameStats.coins - bet
    onUpdateCoins(newCoins)

    setTimeout(() => {
      const result = Math.floor(Math.random() * 37) // 0-36 как в рулетке
      setRouletteResult(result)
      setRouletteSpinning(false)

      let winAmount = 0
      let winMessage = ''

      if (result === 0) {
        // Зеро - возврат ставки
        winAmount = bet
        winMessage = '🟢 ЗЕРО! Возврат ставки!'
      } else if (result % 2 === 0) {
        // Четное - x1.8
        winAmount = Math.floor(bet * 1.8)
        winMessage = `⚪ Четное ${result}! Выигрыш x1.8!`
      } else {
        // Нечетное - x2.2  
        winAmount = Math.floor(bet * 2.2)
        winMessage = `⚫ Нечетное ${result}! Выигрыш x2.2!`
      }

      if (winAmount > 0) {
        setTimeout(() => {
          onUpdateCoins(newCoins + winAmount)
          alert(winMessage + ` +${winAmount.toLocaleString()} монет!`)
        }, 1000)
      } else {
        setTimeout(() => {
          alert(`Число ${result}. Повезет в следующий раз! 🍀`)
        }, 1000)
      }
    }, 2000)
  }

  // Слот машина  
  const spinSlots = (bet: number) => {
    if (currentUser.gameStats.coins < bet) {
      alert('Недостаточно монет!')
      return
    }

    setSlotSpinning(true)
    
    // Уменьшаем монеты на ставку
    const newCoins = currentUser.gameStats.coins - bet
    onUpdateCoins(newCoins)

    const symbols = ['🍋', '🍒', '🍊', '⭐', '💎', '👑', '🎯']
    
    setTimeout(() => {
      const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]
      
      setSlotResult(result)
      setSlotSpinning(false)

      let winAmount = 0
      let winMessage = ''

      // Проверяем выигрышные комбинации
      if (result[0] === result[1] && result[1] === result[2]) {
        // Три одинаковых
        const multipliers: { [key: string]: number } = {
          '🍋': 5, '🍒': 8, '🍊': 10, '⭐': 15, '💎': 25, '👑': 50, '🎯': 100
        }
        const multiplier = multipliers[result[0]] || 5
        winAmount = bet * multiplier
        winMessage = `🎊 ДЖЕКПОТ! Три ${result[0]}! Выигрыш x${multiplier}!`
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        // Два одинаковых
        winAmount = bet * 2
        winMessage = `🎉 Два одинаковых! Выигрыш x2!`
      }

      if (winAmount > 0) {
        setTimeout(() => {
          onUpdateCoins(newCoins + winAmount)
          alert(winMessage + ` +${winAmount.toLocaleString()} монет!`)
        }, 1000)
      } else {
        setTimeout(() => {
          alert('Попробуйте еще раз! 🎰')
        }, 1000)
      }
    }, 2000)
  }

  // Угадай число
  const playGuessNumber = (bet: number) => {
    if (currentUser.gameStats.coins < bet) {
      alert('Недостаточно монет!')
      return
    }

    const playerNumber = parseInt(guessNumber)
    if (!playerNumber || playerNumber < 1 || playerNumber > 100) {
      alert('Введите число от 1 до 100!')
      return
    }

    // Уменьшаем монеты на ставку
    const newCoins = currentUser.gameStats.coins - bet
    onUpdateCoins(newCoins)

    const winningNumber = Math.floor(Math.random() * 100) + 1
    
    let winAmount = 0
    let message = ''

    const difference = Math.abs(playerNumber - winningNumber)
    
    if (difference === 0) {
      // Точное угадывание
      winAmount = bet * 50
      message = `🎯 ТОЧНОЕ ПОПАДАНИЕ! Число было ${winningNumber}! Выигрыш x50!`
    } else if (difference <= 3) {
      // Очень близко
      winAmount = bet * 10
      message = `🔥 Очень близко! Было ${winningNumber}, вы сказали ${playerNumber}. Выигрыш x10!`
    } else if (difference <= 10) {
      // Близко
      winAmount = bet * 3
      message = `👏 Неплохо! Было ${winningNumber}, вы сказали ${playerNumber}. Выигрыш x3!`
    } else {
      message = `😔 Число было ${winningNumber}, вы сказали ${playerNumber}. Попробуйте еще раз!`
    }

    setGuessResult(message)
    setGuessNumber('')

    if (winAmount > 0) {
      setTimeout(() => {
        onUpdateCoins(newCoins + winAmount)
      }, 500)
    }

    // Очистить результат через 5 секунд
    setTimeout(() => {
      setGuessResult(null)
    }, 5000)
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">🎮 Мини-игры</h2>
        <p className="text-muted-foreground">Испытайте свою удачу!</p>
        <Badge variant="outline" className="text-sm">
          💰 Баланс: {currentUser.gameStats.coins.toLocaleString()} монет
        </Badge>
      </div>

      {/* Рулетка удачи */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="RotateCcw" size={24} />
              <h3 className="text-xl font-bold">🎯 Рулетка удачи</h3>
            </div>
            
            <div className={`text-6xl mb-4 ${rouletteSpinning ? 'animate-spin' : ''}`}>
              🎰
            </div>

            {rouletteResult !== null && !rouletteSpinning && (
              <div className="text-2xl font-bold mb-4">
                Выпало: {rouletteResult}
              </div>
            )}

            <div className="text-sm text-muted-foreground mb-4">
              <div>• Четное число: выигрыш x1.8</div>
              <div>• Нечетное число: выигрыш x2.2</div>
              <div>• Зеро (0): возврат ставки</div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => spinRoulette(1000)}
                disabled={rouletteSpinning || currentUser.gameStats.coins < 1000}
                className="bg-red-500 hover:bg-red-600"
              >
                Ставка 1K
              </Button>
              <Button 
                onClick={() => spinRoulette(5000)}
                disabled={rouletteSpinning || currentUser.gameStats.coins < 5000}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Ставка 5K
              </Button>
              <Button 
                onClick={() => spinRoulette(10000)}
                disabled={rouletteSpinning || currentUser.gameStats.coins < 10000}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                Ставка 10K
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Слот машина */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Zap" size={24} />
              <h3 className="text-xl font-bold">🎰 Слот машина</h3>
            </div>
            
            <div className="flex justify-center gap-4 text-4xl mb-4 p-4 bg-muted rounded-lg">
              {slotResult.map((symbol, index) => (
                <div key={index} className={slotSpinning ? 'animate-bounce' : ''}>
                  {symbol}
                </div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground mb-4">
              <div>🎯 x100 | 👑 x50 | 💎 x25 | ⭐ x15</div>
              <div>🍊 x10 | 🍒 x8 | 🍋 x5 | Два одинаковых x2</div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => spinSlots(2000)}
                disabled={slotSpinning || currentUser.gameStats.coins < 2000}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Ставка 2K
              </Button>
              <Button 
                onClick={() => spinSlots(10000)}
                disabled={slotSpinning || currentUser.gameStats.coins < 10000}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Ставка 10K
              </Button>
              <Button 
                onClick={() => spinSlots(25000)}
                disabled={slotSpinning || currentUser.gameStats.coins < 25000}
                className="bg-pink-500 hover:bg-pink-600"
              >
                Ставка 25K
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Угадай число */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Hash" size={24} />
              <h3 className="text-xl font-bold">🔢 Угадай число</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Угадайте число от 1 до 100
            </p>

            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="number"
                min="1"
                max="100"
                value={guessNumber}
                onChange={(e) => setGuessNumber(e.target.value)}
                placeholder="Введите число..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
              />

              {guessResult && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm">{guessResult}</p>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground mb-4">
              <div>• Точное попадание: x50</div>
              <div>• Отклонение ±3: x10</div>
              <div>• Отклонение ±10: x3</div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => playGuessNumber(1000)}
                disabled={currentUser.gameStats.coins < 1000}
                className="bg-green-500 hover:bg-green-600"
              >
                Ставка 1K
              </Button>
              <Button 
                onClick={() => playGuessNumber(5000)}
                disabled={currentUser.gameStats.coins < 5000}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Ставка 5K
              </Button>
              <Button 
                onClick={() => playGuessNumber(15000)}
                disabled={currentUser.gameStats.coins < 15000}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                Ставка 15K
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}