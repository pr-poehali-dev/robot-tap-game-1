import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Настройки игры</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Здесь будут настройки игры, баланса и других параметров.</p>
          <p className="text-slate-500 mt-2">🚀 В разработке...</p>
        </CardContent>
      </Card>
    </div>
  )
}