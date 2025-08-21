import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AuthFormProps {
  authMode: 'login' | 'register'
  authForm: { username: string; email: string; password: string }
  onAuthFormChange: (form: { username: string; email: string; password: string }) => void
  onLogin: () => void
  onRegister: () => void
  onModeChange: (mode: 'login' | 'register') => void
}

export default function AuthForm({ 
  authMode, 
  authForm, 
  onAuthFormChange, 
  onLogin, 
  onRegister, 
  onModeChange 
}: AuthFormProps) {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {authMode === 'login' ? 'Вход в игру' : 'Регистрация'}
            </h2>
            <p className="text-muted-foreground">
              {authMode === 'login' ? 'Войдите чтобы продолжить игру' : 'Создайте аккаунт и начните зарабатывать'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={authForm.username}
                onChange={(e) => onAuthFormChange({ ...authForm, username: e.target.value })}
                placeholder="Введите имя"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => onAuthFormChange({ ...authForm, email: e.target.value })}
                  placeholder="Введите email"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => onAuthFormChange({ ...authForm, password: e.target.value })}
                placeholder="Введите пароль"
              />
            </div>

            <Button 
              onClick={authMode === 'login' ? onLogin : onRegister}
              onTouchStart={() => {}} 
              className="w-full touch-manipulation select-none active:scale-95 transition-transform"
              type="button"
            >
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <Button 
              variant="ghost"
              onClick={() => {
                onModeChange(authMode === 'login' ? 'register' : 'login')
                onAuthFormChange({ username: '', email: '', password: '' })
              }}
              className="w-full"
            >
              {authMode === 'login' ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Войти'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}