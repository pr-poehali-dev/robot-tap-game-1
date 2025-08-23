import { Card, CardContent } from '@/components/ui/card'
import Icon from '@/components/ui/icon'

interface AdminStatCardProps {
  title: string
  value: number | string
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'yellow'
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}

export default function AdminStatCard({ title, value, icon, color = 'blue' }: AdminStatCardProps) {
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