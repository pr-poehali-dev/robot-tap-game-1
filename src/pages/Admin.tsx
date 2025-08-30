import React, { useState, useEffect } from 'react'
import AdminLogin from '@/components/AdminLogin'
import AdminPanel from '@/components/AdminPanel'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Логирование для отладки роутинга
    console.log('Admin page loaded, current path:', window.location.pathname)
    
    // Проверяем, авторизован ли админ (используем изолированные ключи)
    const checkAuth = () => {
      const authStatus = localStorage.getItem('titan_admin_authenticated')
      const loginTime = localStorage.getItem('titan_admin_login_time')
      
      if (authStatus === 'true' && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime)
        // Сессия действует 24 часа
        if (timeDiff < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true)
        } else {
          // Сессия истекла
          localStorage.removeItem('titan_admin_authenticated')
          localStorage.removeItem('titan_admin_login_time')
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('titan_admin_authenticated')
    localStorage.removeItem('titan_admin_login_time')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Загрузка админки...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </>
  )
}