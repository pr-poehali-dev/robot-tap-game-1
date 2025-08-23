import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'

interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
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
  )
}