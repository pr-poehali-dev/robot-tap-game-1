import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

  useEffect(() => {
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('storage'))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const chatMessages = getChatMessages()

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
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              maxLength={200}
            />
            <Button onClick={sendChatMessage}>Отправить</Button>
          </div>
        </CardContent>
      </Card>

      {/* Сообщения чата */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">💬 Общий чат</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Сообщений пока нет</p>
            ) : (
              chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-2 rounded ${
                    message.username === currentUser.username ? 'bg-blue-50 border-blue-200 border' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{message.username}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{message.message}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}