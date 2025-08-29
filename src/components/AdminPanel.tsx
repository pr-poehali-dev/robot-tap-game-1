import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Icon from '@/components/ui/icon'
import { User } from '@/types/user'
import { AdminStats, WithdrawRequest } from '@/types/admin'
import AdminHeader from './AdminHeader'
import AdminOverview from './AdminOverview'
import AdminUsers from './AdminUsers'
import AdminWithdraws from './AdminWithdraws'
import AdminSettings from './AdminSettings'
import VerificationAdmin from './admin/VerificationAdmin'

interface AdminPanelProps {
  onLogout: () => void
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([])
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([])
  const [stats, setStats] = useState<AdminStats>({
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
    const allUsers: User[] = []
    let totalCoins = 0
    let totalTaps = 0
    let vipCount = 0
    let onlineCount = 0

    try {
      const usersData = localStorage.getItem('robotGameUsers')
      if (usersData) {
        const users: User[] = JSON.parse(usersData)
        
        for (const user of users) {
          allUsers.push(user)
          
          totalCoins += user.gameStats.coins || 0
          totalTaps += user.gameStats.totalEarned || 0
          
          const isVIP = localStorage.getItem(`vipStatus_${user.id}`) === 'true'
          if (isVIP) vipCount++
          
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
    loadWithdrawRequests()
  }

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

  const handleRefresh = () => {
    loadWithdrawRequests()
    loadUsersData()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AdminHeader onLogout={onLogout} />

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
            <TabsTrigger value="verification" className="data-[state=active]:bg-slate-700">
              <Icon name="Shield" size={16} className="mr-2" />
              Верификация
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverview 
              stats={stats}
              users={users}
              isVIPUser={isVIPUser}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsers
              users={users}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRefresh={loadUsersData}
              getUserStatus={getUserStatus}
              isVIPUser={isVIPUser}
              formatNumber={formatNumber}
            />
          </TabsContent>

          <TabsContent value="withdraws" className="space-y-6">
            <AdminWithdraws
              withdrawRequests={withdrawRequests}
              onRefresh={handleRefresh}
              onUpdateStatus={updateWithdrawStatus}
              formatNumber={formatNumber}
            />
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <VerificationAdmin />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}