import { useState, useCallback } from 'react'
import { User } from '@/types/user'
import { useGameLogic } from './useGameLogic'

interface AuthForm {
  username: string
  email: string
  password: string
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState<AuthForm>({ username: '', email: '', password: '' })

  const { initialGameStats } = useGameLogic(currentUser, () => {})

  const handleRegister = useCallback(() => {
    if (!authForm.username.trim() || !authForm.email.trim() || !authForm.password.trim()) {
      alert('Заполните все поля')
      return
    }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const existingUser = users.find((u: User) => u.username === authForm.username.trim())
    
    if (existingUser) {
      alert('Пользователь с таким именем уже существует')
      return
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username: authForm.username.trim(),
      email: authForm.email.trim(),
      password: authForm.password.trim(),
      gameStats: { ...initialGameStats },
      registeredAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('robotGameUsers', JSON.stringify(users))
    localStorage.setItem('currentUserId', newUser.id)
    
    setCurrentUser(newUser)
    setAuthForm({ username: '', email: '', password: '' })
    
    return users.length
  }, [authForm, initialGameStats])

  const handleLogin = useCallback(() => {
    if (!authForm.username.trim() || !authForm.password.trim()) {
      alert('Заполните все поля')
      return
    }
    
    const users = JSON.parse(localStorage.getItem('robotGameUsers') || '[]')
    const user = users.find((u: User) => 
      u.username === authForm.username.trim() && 
      (u.password === authForm.password.trim() || u.email === authForm.password.trim())
    )
    
    if (user) {
      localStorage.setItem('currentUserId', user.id)
      setCurrentUser(user)
      setAuthForm({ username: '', email: '', password: '' })
    } else {
      alert('Неверный логин или пароль')
    }
  }, [authForm])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('currentUserId')
    setCurrentUser(null)
  }, [])

  return {
    currentUser,
    setCurrentUser,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    handleRegister,
    handleLogin,
    handleLogout
  }
}