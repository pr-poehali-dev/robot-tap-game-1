import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import AdminStatCard from './AdminStatCard'
import { User } from '@/types/user'
import { AdminStats } from '@/types/admin'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface AdminOverviewProps {
  stats: AdminStats
  users: User[]
  isVIPUser: (userId: string) => boolean
}

export default function AdminOverview({ stats, users, isVIPUser }: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard title="Всего пользователей" value={stats.totalUsers} icon="Users" color="blue" />
        <AdminStatCard title="Активных за день" value={stats.activeUsers} icon="UserCheck" color="green" />
        <AdminStatCard title="Онлайн сейчас" value={stats.onlineUsers} icon="Wifi" color="green" />
        <AdminStatCard title="VIP пользователей" value={stats.vipUsers} icon="Crown" color="yellow" />
        <AdminStatCard title="Всего монет" value={stats.totalCoins} icon="Coins" color="orange" />
        <AdminStatCard title="Всего заработано" value={stats.totalTaps} icon="TrendingUp" color="purple" />
        <AdminStatCard title="Заявок на вывод" value={stats.pendingWithdraws} icon="AlertCircle" color="orange" />
        <AdminStatCard title="Выведено средств" value={`${stats.totalWithdrawAmount}₽`} icon="Banknote" color="green" />
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
    </div>
  )
}