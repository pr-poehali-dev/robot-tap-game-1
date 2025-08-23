import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User } from '../GameSection'

interface FriendRequest {
  id: string
  from: string
  to: string
  timestamp: string
}

interface Gift {
  id: string
  from: string
  to: string
  amount: number
  message: string
  timestamp: string
}

interface FriendsTabProps {
  currentUser: User | null
}

export default function FriendsTab({ currentUser }: FriendsTabProps) {
  const [friendUsername, setFriendUsername] = useState('')
  const [giftAmount, setGiftAmount] = useState(1000)
  const [giftMessage, setGiftMessage] = useState('')
  const [giftToUser, setGiftToUser] = useState('')

  if (!currentUser) return null

  const getFriends = (): User[] => {
    const friendIds: string[] = JSON.parse(localStorage.getItem(`friends_${currentUser.id}`) || '[]')
    const users: User[] = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    return users.filter(user => friendIds.includes(user.id))
  }

  const getFriendRequests = (): FriendRequest[] => {
    return JSON.parse(localStorage.getItem(`friendRequests_${currentUser.id}`) || '[]')
  }

  const sendFriendRequest = () => {
    if (!friendUsername.trim()) return
    
    const users: User[] = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const targetUser = users.find(u => u.username.toLowerCase() === friendUsername.toLowerCase().trim())
    
    if (!targetUser) {
      alert('Пользователь не найден!')
      return
    }
    
    if (targetUser.id === currentUser.id) {
      alert('Нельзя добавить себя в друзья!')
      return
    }

    const friends = getFriends()
    if (friends.some(f => f.id === targetUser.id)) {
      alert('Этот пользователь уже ваш друг!')
      return
    }

    const requests: FriendRequest[] = JSON.parse(localStorage.getItem(`friendRequests_${targetUser.id}`) || '[]')
    if (requests.some(r => r.from === currentUser.id)) {
      alert('Запрос уже отправлен!')
      return
    }

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      from: currentUser.id,
      to: targetUser.id,
      timestamp: new Date().toISOString()
    }

    requests.push(newRequest)
    localStorage.setItem(`friendRequests_${targetUser.id}`, JSON.stringify(requests))
    setFriendUsername('')
    alert('Запрос в друзья отправлен!')
  }

  const acceptFriendRequest = (request: FriendRequest) => {
    const myFriends: string[] = JSON.parse(localStorage.getItem(`friends_${currentUser.id}`) || '[]')
    const theirFriends: string[] = JSON.parse(localStorage.getItem(`friends_${request.from}`) || '[]')
    
    myFriends.push(request.from)
    theirFriends.push(currentUser.id)
    
    localStorage.setItem(`friends_${currentUser.id}`, JSON.stringify(myFriends))
    localStorage.setItem(`friends_${request.from}`, JSON.stringify(theirFriends))
    
    const requests = getFriendRequests().filter(r => r.id !== request.id)
    localStorage.setItem(`friendRequests_${currentUser.id}`, JSON.stringify(requests))
    
    alert('Пользователь добавлен в друзья!')
    window.location.reload()
  }

  const rejectFriendRequest = (request: FriendRequest) => {
    const requests = getFriendRequests().filter(r => r.id !== request.id)
    localStorage.setItem(`friendRequests_${currentUser.id}`, JSON.stringify(requests))
    alert('Запрос отклонен')
    window.location.reload()
  }

  const sendGift = () => {
    if (!giftToUser.trim() || giftAmount <= 0) return
    
    if (currentUser.gameStats.coins < giftAmount) {
      alert('Недостаточно монет!')
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const targetUser = users.find(u => u.username.toLowerCase() === giftToUser.toLowerCase().trim())
    
    if (!targetUser) {
      alert('Пользователь не найден!')
      return
    }

    const friends = getFriends()
    if (!friends.some(f => f.id === targetUser.id)) {
      alert('Подарки можно отправлять только друзьям!')
      return
    }

    const senderIndex = users.findIndex(u => u.id === currentUser.id)
    if (senderIndex !== -1) {
      users[senderIndex].gameStats.coins -= giftAmount
      localStorage.setItem('robotGameUsers', JSON.stringify(users))
    }

    const gifts: Gift[] = JSON.parse(localStorage.getItem(`gifts_${targetUser.id}`) || '[]')
    const newGift: Gift = {
      id: Date.now().toString(),
      from: currentUser.username,
      to: targetUser.id,
      amount: giftAmount,
      message: giftMessage || 'Подарок от друга!',
      timestamp: new Date().toISOString()
    }

    gifts.push(newGift)
    localStorage.setItem(`gifts_${targetUser.id}`, JSON.stringify(gifts))
    
    setGiftToUser('')
    setGiftAmount(1000)
    setGiftMessage('')
    alert('Подарок отправлен!')
    window.location.reload()
  }

  const getMyGifts = (): Gift[] => {
    return JSON.parse(localStorage.getItem(`gifts_${currentUser.id}`) || '[]')
  }

  const claimGift = (gift: Gift) => {
    const users: User[] = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const userIndex = users.findIndex(u => u.id === currentUser.id)
    
    if (userIndex !== -1) {
      users[userIndex].gameStats.coins += gift.amount
      localStorage.setItem('robotGameUsers', JSON.stringify(users))
    }

    const gifts = getMyGifts().filter(g => g.id !== gift.id)
    localStorage.setItem(`gifts_${currentUser.id}`, JSON.stringify(gifts))
    
    alert(`Получено ${gift.amount.toLocaleString()} монет от ${gift.from}!`)
    window.location.reload()
  }

  const friends = getFriends()
  const friendRequests = getFriendRequests()
  const myGifts = getMyGifts()

  return (
    <div className="space-y-4">
      {/* Запросы в друзья */}
      {friendRequests.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">📩 Запросы в друзья</h4>
            {friendRequests.map(request => {
              const users: User[] = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
              const fromUser = users.find(u => u.id === request.from)
              if (!fromUser) return null

              return (
                <div key={request.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{fromUser.username}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => acceptFriendRequest(request)} className="bg-green-500 hover:bg-green-600">
                      ✓
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => rejectFriendRequest(request)}>
                      ✗
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Добавить друга */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">➕ Добавить друга</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              placeholder="Введите имя пользователя..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <Button onClick={sendFriendRequest}>Добавить</Button>
          </div>
        </CardContent>
      </Card>

      {/* Мои подарки */}
      {myGifts.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">🎁 Ваши подарки</h4>
            {myGifts.map(gift => (
              <div key={gift.id} className="flex items-center justify-between p-2 border rounded mb-2">
                <div>
                  <p className="font-medium">От {gift.from}</p>
                  <p className="text-sm text-muted-foreground">{gift.message}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{gift.amount.toLocaleString()} монет</p>
                  <Button size="sm" onClick={() => claimGift(gift)} className="bg-green-500 hover:bg-green-600">
                    Получить
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Отправить подарок */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">🎁 Отправить подарок</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={giftToUser}
              onChange={(e) => setGiftToUser(e.target.value)}
              placeholder="Имя друга..."
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(parseInt(e.target.value) || 0)}
              placeholder="Количество монет..."
              min="100"
              max={currentUser.gameStats.coins}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Сообщение (необязательно)..."
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <Button onClick={sendGift} className="w-full">Отправить подарок</Button>
          </div>
        </CardContent>
      </Card>

      {/* Список друзей */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">👫 Мои друзья ({friends.length})</h4>
          {friends.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">У вас пока нет друзей</p>
          ) : (
            friends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-2 border rounded mb-2">
                <div>
                  <p className="font-medium">{friend.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Уровень {friend.gameStats.level} • {friend.gameStats.totalEarned.toLocaleString()} монет
                  </p>
                </div>
                <Badge variant="outline">Друг</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}