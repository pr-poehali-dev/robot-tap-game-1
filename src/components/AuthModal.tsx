import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Icon from '@/components/ui/icon'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
  onLogin: (form: { username: string; email: string; password: string }) => void
  onRegister: (form: { username: string; email: string; password: string }) => void
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'register', onLogin, onRegister }: AuthModalProps) {
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(authForm)
    onClose()
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister(authForm)
    onClose()
  }

  const resetForm = () => {
    setAuthForm({ username: '', email: '', password: '' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            YaTitan
          </DialogTitle>
          <DialogDescription className="text-center">
            Робот Кликер Будущего! 🚀
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register" onClick={resetForm}>
              <Icon name="UserPlus" size={16} className="mr-2" />
              Регистрация
            </TabsTrigger>
            <TabsTrigger value="login" onClick={resetForm}>
              <Icon name="LogIn" size={16} className="mr-2" />
              Вход
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Создать аккаунт</h3>
              <p className="text-sm text-muted-foreground">
                Зарегистрируйтесь и начните зарабатывать реальные деньги!
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input
                  id="reg-username"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  placeholder="Введите имя"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                size="lg"
              >
                <Icon name="Rocket" size={18} className="mr-2" />
                Начать Играть!
              </Button>
            </form>

            <div className="text-xs text-center text-foreground mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded">
              <Icon name="Shield" size={14} className="inline mr-1 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">
                ✅ Ваши данные защищены. Начните зарабатывать уже сегодня!
              </span>
            </div>
          </TabsContent>

          <TabsContent value="login" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Вход в игру</h3>
              <p className="text-sm text-muted-foreground">
                Войдите чтобы продолжить зарабатывать
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-username">Имя пользователя</Label>
                <Input
                  id="login-username"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  placeholder="Введите имя"
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="lg"
              >
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти в Игру
              </Button>
            </form>

            <div className="text-xs text-center text-muted-foreground mt-4">
              Нет аккаунта? Переключитесь на регистрацию выше ☝️
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}