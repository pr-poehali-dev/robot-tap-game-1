import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

interface VerificationRequest {
  userId: string
  username: string
  photoFile: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function VerificationAdmin() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    const saved = localStorage.getItem('verificationRequests')
    if (saved) {
      setRequests(JSON.parse(saved))
    }
  }

  const updateRequestStatus = (userId: string, status: 'approved' | 'rejected') => {
    const updatedRequests = requests.map(req => 
      req.userId === userId ? { ...req, status } : req
    )
    setRequests(updatedRequests)
    localStorage.setItem('verificationRequests', JSON.stringify(updatedRequests))

    // Обновляем статус пользователя
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((user: any) => {
      if (user.id === userId) {
        return {
          ...user,
          verificationStatus: status,
          isVerified: status === 'approved'
        }
      }
      return user
    })
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    // Обновляем текущего пользователя если он в localStorage
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id === userId) {
        user.verificationStatus = status
        user.isVerified = status === 'approved'
        localStorage.setItem('currentUser', JSON.stringify(user))
      }
    }
  }

  const pendingRequests = requests.filter(req => req.status === 'pending')
  const processedRequests = requests.filter(req => req.status !== 'pending')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          <Icon name="Shield" className="inline mr-2" />
          Управление верификацией
        </h1>
        <p className="text-muted-foreground">
          Заявки на верификацию аккаунтов пользователей
        </p>
      </div>

      {/* Новые заявки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Clock" className="text-orange-500" />
            Ожидают рассмотрения ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нет новых заявок на верификацию</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.userId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{request.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {request.userId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Подано: {new Date(request.submittedAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      <Icon name="Clock" size={14} className="mr-1" />
                      Ожидает
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateRequestStatus(request.userId, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Подтвердить
                    </Button>
                    <Button
                      onClick={() => updateRequestStatus(request.userId, 'rejected')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Отклонить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Обработанные заявки */}
      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Archive" className="text-gray-500" />
              История ({processedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <div key={request.userId} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium">{request.username}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.submittedAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <Badge 
                    variant={request.status === 'approved' ? 'default' : 'destructive'}
                    className={request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                  >
                    <Icon 
                      name={request.status === 'approved' ? 'Check' : 'X'} 
                      size={14} 
                      className="mr-1" 
                    />
                    {request.status === 'approved' ? 'Подтверждено' : 'Отклонено'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}