import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { User } from './GameSection'

interface TasksSectionProps {
  currentUser: User | null
}

export default function TasksSection({ currentUser }: TasksSectionProps) {
  if (!currentUser) {
    return null
  }

  const tasks = [
    { 
      title: "Сделать 50 тапов", 
      reward: 500, 
      completed: (currentUser.gameStats.totalEarned - currentUser.gameStats.coins + (currentUser.gameStats.maxTaps - currentUser.gameStats.tapsLeft)) >= 50
    },
    { title: "Войти в игру", reward: 100, completed: true },
    { title: "Улучшить робота", reward: 1000, completed: currentUser.gameStats.level > 1 },
    { title: "Заработать 10,000 монет", reward: 5000, completed: currentUser.gameStats.totalEarned >= 10000 }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Ежедневные задания</h2>
      
      {tasks.map((task, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={task.completed ? "CheckCircle" : "Circle"} 
                className={task.completed ? "text-green-500" : "text-muted-foreground"} 
              />
              <div>
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm text-secondary">+{task.reward} монет</div>
              </div>
            </div>
            <Button 
              size="sm" 
              disabled={task.completed}
              variant={task.completed ? "outline" : "default"}
            >
              {task.completed ? "Выполнено" : "Выполнить"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}