import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User } from '../GameSection'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
}

interface ChatTabProps {
  currentUser: User | null
}

export default function ChatTab({ currentUser }: ChatTabProps) {
  const [chatMessage, setChatMessage] = useState('')

  if (!currentUser) return null

  const getChatMessages = (): ChatMessage[] => {
    return JSON.parse(localStorage.getItem('globalChat') || '[]')
      .sort((a: ChatMessage, b: ChatMessage) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50)
  }

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return

    const messages: ChatMessage[] = JSON.parse(localStorage.getItem('globalChat') || '[]')
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: currentUser.username,
      message: chatMessage.trim(),
      timestamp: new Date().toISOString()
    }

    messages.unshift(newMessage)
    const trimmedMessages = messages.slice(0, 1000)
    localStorage.setItem('globalChat', JSON.stringify(trimmedMessages))
    
    setChatMessage('')
  }

  const deleteMessage = (messageId: string) => {
    const messages: ChatMessage[] = JSON.parse(localStorage.getItem('globalChat') || '[]')
    const updatedMessages = messages.filter(msg => msg.id !== messageId)
    localStorage.setItem('globalChat', JSON.stringify(updatedMessages))
    // Принудительно обновляем компонент
    window.dispatchEvent(new Event('storage'))
  }

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshTrigger(prev => prev + 1)
    }

    const interval = setInterval(() => {
      window.dispatchEvent(new Event('storage'))
    }, 5000)

    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const chatMessages = getChatMessages()
  // Используем refreshTrigger для принудительного обновления
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _ = refreshTrigger

  return (
    <div className="space-y-4">
      {/* Отправка сообщения */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Введите сообщение..."
              className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={200}
            />
            <Button onClick={sendChatMessage}>Отправить</Button>
          </div>
        </CardContent>
      </Card>

      {/* Сообщения чата */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-foreground">💬 Общий чат</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Сообщений пока нет</p>
            ) : (
              chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg border relative group ${
                    message.username === currentUser.username 
                      ? 'bg-primary/10 border-primary/20 ml-4' 
                      : 'bg-secondary/20 border-secondary/40 mr-4'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm text-foreground">{message.username}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.username === currentUser.username && (
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-red-500 hover:text-red-600"
                          title="Удалить сообщение"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{message.message}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}