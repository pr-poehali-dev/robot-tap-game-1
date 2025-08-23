import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Icon from '@/components/ui/icon'
import { User } from '@/types/user'

interface AdminUsersProps {
  users: User[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onRefresh: () => void
  getUserStatus: (userId: string) => string
  isVIPUser: (userId: string) => boolean
  formatNumber: (num: number) => string
}

export default function AdminUsers({
  users,
  searchQuery,
  onSearchChange,
  onRefresh,
  getUserStatus,
  isVIPUser,
  formatNumber
}: AdminUsersProps) {
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toString().includes(searchQuery)
  )

  return (
    <div className="space-y-6">
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
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Введите для поиска..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button onClick={onRefresh} variant="outline" className="self-end border-slate-600">
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
    </div>
  )
}