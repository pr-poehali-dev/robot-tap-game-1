import Icon from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'

interface RobotStatsDisplayProps {
  totalRobots: number
  robotBreakdown: Record<string, number>
}

const robotNames: Record<string, { name: string; icon: string }> = {
  basic: { name: 'Базовый робот', icon: '🤖' },
  worker: { name: 'Рабочий робот', icon: '👷‍♂️' },
  engineer: { name: 'Инженер', icon: '👨‍💻' },
  scientist: { name: 'Учёный', icon: '👨‍🔬' },
  commander: { name: 'Командир', icon: '👨‍✈️' },
  cyborg: { name: 'Киборг', icon: '🦾' },
  student: { name: 'Работа школьника', icon: '🎓' },
  quantum: { name: 'Квантовый титан', icon: '⚡' }
}

export default function RobotStatsDisplay({ totalRobots, robotBreakdown }: RobotStatsDisplayProps) {
  const hasRobots = totalRobots > 0
  const robotTypes = Object.entries(robotBreakdown).filter(([_, count]) => count > 0)

  return (
    <div className="flex items-center gap-2 group cursor-help relative">
      <Icon name="Bot" size={16} />
      <span>Роботов создано: <strong>{totalRobots || 0}</strong></span>
      
      {hasRobots && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 text-sm whitespace-nowrap border border-white/20">
            <div className="text-xs text-gray-300 mb-2 text-center">Детальная статистика:</div>
            <div className="space-y-1">
              {robotTypes.map(([robotId, count]) => {
                const robot = robotNames[robotId]
                return (
                  <div key={robotId} className="flex items-center gap-2 justify-between min-w-0">
                    <div className="flex items-center gap-1 text-xs">
                      <span>{robot?.icon || '🤖'}</span>
                      <span className="truncate">{robot?.name || robotId}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs h-5 px-1.5">
                      {count}
                    </Badge>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-white/20 mt-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Всего:</span>
                <span>{totalRobots}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}