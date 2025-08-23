import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Icon from '@/components/ui/icon'
import { User } from '@/types/user'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface AdminPanelProps {
  onLogout: () => void
}

interface WithdrawRequest {
  id: number
  userId: string
  username: string
  email: string
  amount: number
  coins: number
  paymentSystem: 'yumoney' | 'card' | 'phone'
  paymentDetails: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  processedAt: string | null
  processedBy: string | null
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([])
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCoins: 0,
    totalTaps: 0,
    vipUsers: 0,
    onlineUsers: 0,
    pendingWithdraws: 0,
    totalWithdrawAmount: 0
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadUsersData()
    loadWithdrawRequests()
  }, [])

  const loadUsersData = () => {
    // Загружаем пользователей из основной системы сайта
    const allUsers: User[] = []
    let totalCoins = 0
    let totalTaps = 0
    let vipCount = 0
    let onlineCount = 0

    try {
      // Получаем пользователей из ключа robotGameUsers (основная система сайта)
      const usersData = localStorage.getItem('robotGameUsers')
      if (usersData) {
        const users: User[] = JSON.parse(usersData)
        
        for (const user of users) {
          allUsers.push(user)
          
          totalCoins += user.gameStats.coins || 0
          totalTaps += user.gameStats.totalEarned || 0
          
          // Проверяем VIP статус
          const isVIP = localStorage.getItem(`vipStatus_${user.id}`) === 'true'
          if (isVIP) vipCount++
          
          // Проверяем онлайн статус (активность за последние 10 минут)
          const lastActivity = localStorage.getItem(`lastActivity_${user.id}`)
          if (lastActivity) {
            const timeDiff = Date.now() - parseInt(lastActivity)
            if (timeDiff < 10 * 60 * 1000) onlineCount++
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей сайта:', error)
    }

    // Сортируем по дате регистрации (новые сверху)
    allUsers.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())

    setUsers(allUsers)
    setStats(prevStats => ({
      ...prevStats,
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => {
        const lastActivity = localStorage.getItem(`lastActivity_${u.id}`)
        return lastActivity && (Date.now() - parseInt(lastActivity)) < 24 * 60 * 60 * 1000
      }).length,
      totalCoins,
      totalTaps,
      vipUsers: vipCount,
      onlineUsers: onlineCount
    }))
  }

  const loadWithdrawRequests = () => {
    try {
      const requestsData = localStorage.getItem('withdrawRequests')
      if (requestsData) {
        const requests: WithdrawRequest[] = JSON.parse(requestsData)
        const sortedRequests = requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setWithdrawRequests(sortedRequests)
        
        const pendingCount = requests.filter(r => r.status === 'pending').length
        const totalAmount = requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0)
        
        setStats(prevStats => ({
          ...prevStats,
          pendingWithdraws: pendingCount,
          totalWithdrawAmount: totalAmount
        }))
      }
    } catch (error) {
      console.error('Ошибка при загрузке заявок на вывод:', error)
    }
  }

  const updateWithdrawStatus = (requestId: number, status: 'approved' | 'rejected') => {
    const updatedRequests = withdrawRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status,
          processedAt: new Date().toISOString(),
          processedBy: 'admin'
        }
      }
      return request
    })
    
    setWithdrawRequests(updatedRequests)
    localStorage.setItem('withdrawRequests', JSON.stringify(updatedRequests))
    loadWithdrawRequests() // Обновляем статистику
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toString().includes(searchQuery)
  )

  const getUserStatus = (userId: string) => {
    const lastActivity = localStorage.getItem(`lastActivity_${userId}`)
    if (!lastActivity) return 'offline'
    
    const timeDiff = Date.now() - parseInt(lastActivity)
    if (timeDiff < 10 * 60 * 1000) return 'online'
    if (timeDiff < 60 * 60 * 1000) return 'away'
    return 'offline'
  }

  const isVIPUser = (userId: string) => {
    return localStorage.getItem(`vipStatus_${userId}`) === 'true'
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  const StatCard = ({ title, value, icon, color = 'blue' }: {
    title: string
    value: number | string
    icon: string
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'yellow'
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600', 
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      yellow: 'from-yellow-500 to-yellow-600'
    }

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold text-white">{typeof value === 'number' ? formatNumber(value) : value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
              <Icon name={icon as any} size={24} className="text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Панель администратора</h1>
              <p className="text-slate-400 text-sm">🚀 Космическая кликер-игра</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              <Icon name="Users" size={16} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="withdraws" className="data-[state=active]:bg-slate-700">
              <Icon name="Banknote" size={16} className="mr-2" />
              Вывод
              {stats.pendingWithdraws > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {stats.pendingWithdraws}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Всего пользователей" value={stats.totalUsers} icon="Users" color="blue" />
              <StatCard title="Активных за день" value={stats.activeUsers} icon="UserCheck" color="green" />
              <StatCard title="Онлайн сейчас" value={stats.onlineUsers} icon="Wifi" color="green" />
              <StatCard title="VIP пользователей" value={stats.vipUsers} icon="Crown" color="yellow" />
              <StatCard title="Всего монет" value={stats.totalCoins} icon="Coins" color="orange" />
              <StatCard title="Всего заработано" value={stats.totalTaps} icon="TrendingUp" color="purple" />
              <StatCard title="Заявок на вывод" value={stats.pendingWithdraws} icon="AlertCircle" color="orange" />
              <StatCard title="Выведено средств" value={`${stats.totalWithdrawAmount}₽`} icon="Banknote" color="green" />
            </div>

            {/* Последние регистрации */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="UserPlus" size={20} />
                  Последние регистрации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{user.username[0].toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">
                          {format(new Date(user.registeredAt), 'dd MMM, HH:mm', { locale: ru })}
                        </p>
                        {isVIPUser(user.id.toString()) && (
                          <Badge variant="secondary" className="bg-yellow-600 text-white">
                            👑 VIP
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Поиск пользователей */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Поиск пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="text-slate-300">Поиск по имени, username или ID</Label>
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Введите для поиска..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button onClick={loadUsersData} variant="outline" className="self-end border-slate-600">
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Обновить
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Список пользователей */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Все пользователи ({filteredUsers.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => {
                    const status = getUserStatus(user.id.toString())
                    const isVIP = isVIPUser(user.id.toString())
                    
                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="font-bold">{user.username[0].toUpperCase()}</span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-700 ${
                              status === 'online' ? 'bg-green-500' : 
                              status === 'away' ? 'bg-yellow-500' : 'bg-slate-500'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{user.username}</p>
                              {isVIP && <span className="text-yellow-500">👑</span>}
                            </div>
                            <p className="text-sm text-slate-400">{user.email} • ID: {user.id}</p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={status === 'online' ? 'default' : 'secondary'}>
                              {status === 'online' ? 'Онлайн' : status === 'away' ? 'Отошёл' : 'Оффлайн'}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-400 space-y-1">
                            <div>💰 {formatNumber(user.gameStats.coins)} монет</div>
                            <div>💎 {formatNumber(user.gameStats.totalEarned)} заработано</div>
                            <div>⚡ {user.gameStats.tapsLeft}/{user.gameStats.maxTaps} тапов</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-400">Пользователи не найдены</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraws" className="space-y-6">
            {/* Статистика выводов */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Ожидают обработки" 
                value={withdrawRequests.filter(r => r.status === 'pending').length} 
                icon="Clock" 
                color="orange" 
              />
              <StatCard 
                title="Одобрено заявок" 
                value={withdrawRequests.filter(r => r.status === 'approved').length} 
                icon="CheckCircle" 
                color="green" 
              />
              <StatCard 
                title="Отклонено заявок" 
                value={withdrawRequests.filter(r => r.status === 'rejected').length} 
                icon="XCircle" 
                color="purple" 
              />
            </div>

            {/* Список заявок на вывод */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Заявки на вывод средств ({withdrawRequests.length})</span>
                  <Button 
                    onClick={() => { loadWithdrawRequests(); loadUsersData(); }} 
                    variant="outline" 
                    className="border-slate-600"
                  >
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Обновить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {withdrawRequests.map((request) => {
                    const getPaymentSystemName = (system: string) => {
                      switch(system) {
                        case 'yumoney': return 'ЮMoney'
                        case 'card': return 'Банковская карта'
                        case 'phone': return 'Сотовая связь'
                        default: return system
                      }
                    }

                    const getStatusColor = (status: string) => {
                      switch(status) {
                        case 'pending': return 'bg-yellow-600'
                        case 'approved': return 'bg-green-600'
                        case 'rejected': return 'bg-red-600'
                        default: return 'bg-slate-600'
                      }
                    }

                    const getStatusText = (status: string) => {
                      switch(status) {
                        case 'pending': return 'Ожидает'
                        case 'approved': return 'Одобрено'
                        case 'rejected': return 'Отклонено'
                        default: return status
                      }
                    }
                    
                    return (
                      <div key={request.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                              <Icon name="Banknote" size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{request.username}</p>
                              <p className="text-sm text-slate-400">{request.email} • ID: {request.userId}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-slate-400">Сумма</p>
                            <p className="text-white font-medium">{request.amount}₽</p>
                            <p className="text-xs text-slate-500">{formatNumber(request.coins)} монет</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Платёжная система</p>
                            <p className="text-white">{getPaymentSystemName(request.paymentSystem)}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Реквизиты</p>
                            <p className="text-white font-mono text-xs">{request.paymentDetails}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Дата подачи</p>
                            <p className="text-white text-xs">
                              {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}
                            </p>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex gap-2 pt-2 border-t border-slate-600">
                            <Button
                              onClick={() => updateWithdrawStatus(request.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white flex-1"
                            >
                              <Icon name="Check" size={16} className="mr-2" />
                              Одобрить
                            </Button>
                            <Button
                              onClick={() => updateWithdrawStatus(request.id, 'rejected')}
                              variant="destructive"
                              className="flex-1"
                            >
                              <Icon name="X" size={16} className="mr-2" />
                              Отклонить
                            </Button>
                          </div>
                        )}

                        {request.processedAt && (
                          <div className="pt-2 border-t border-slate-600">
                            <p className="text-xs text-slate-400">
                              Обработано {format(new Date(request.processedAt), 'dd MMM yyyy, HH:mm', { locale: ru })}
                              {request.processedBy && ` администратором ${request.processedBy}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  
                  {withdrawRequests.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="Banknote" size={48} className="mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-400">Заявок на вывод пока нет</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Настройки игры</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">Здесь будут настройки игры, баланса и других параметров.</p>
                <p className="text-slate-500 mt-2">🚀 В разработке...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}