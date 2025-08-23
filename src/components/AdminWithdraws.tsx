import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import AdminStatCard from './AdminStatCard'
import { WithdrawRequest } from '@/types/admin'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface AdminWithdrawsProps {
  withdrawRequests: WithdrawRequest[]
  onRefresh: () => void
  onUpdateStatus: (requestId: number, status: 'approved' | 'rejected') => void
  formatNumber: (num: number) => string
}

export default function AdminWithdraws({
  withdrawRequests,
  onRefresh,
  onUpdateStatus,
  formatNumber
}: AdminWithdrawsProps) {
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
    <div className="space-y-6">
      {/* Статистика выводов */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard 
          title="Ожидают обработки" 
          value={withdrawRequests.filter(r => r.status === 'pending').length} 
          icon="Clock" 
          color="orange" 
        />
        <AdminStatCard 
          title="Одобрено заявок" 
          value={withdrawRequests.filter(r => r.status === 'approved').length} 
          icon="CheckCircle" 
          color="green" 
        />
        <AdminStatCard 
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
              onClick={onRefresh}
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
            {withdrawRequests.map((request) => (
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
                      onClick={() => onUpdateStatus(request.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Одобрить
                    </Button>
                    <Button
                      onClick={() => onUpdateStatus(request.id, 'rejected')}
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
            ))}
            
            {withdrawRequests.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Banknote" size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">Заявок на вывод пока нет</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}