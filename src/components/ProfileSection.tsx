import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { User } from '@/types/user'
import VerificationModal from './VerificationModal'

interface ProfileSectionProps {
  currentUser: User | null
  onLogout: () => void
  onUpdateUser?: (user: User) => void
}

export default function ProfileSection({ currentUser, onLogout, onUpdateUser }: ProfileSectionProps) {
  const [showVerificationModal, setShowVerificationModal] = useState(false)

  const handleVerificationSubmit = async (photo: File) => {
    if (!currentUser || !onUpdateUser) return

    // Имитируем отправку фото и обновление статуса
    const updatedUser: User = {
      ...currentUser,
      verificationStatus: 'pending'
    }
    
    // Сохраняем в localStorage для имитации
    const verificationData = {
      userId: currentUser.id,
      username: currentUser.username,
      photoFile: photo.name,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }
    
    const existingRequests = JSON.parse(localStorage.getItem('verificationRequests') || '[]')
    existingRequests.push(verificationData)
    localStorage.setItem('verificationRequests', JSON.stringify(existingRequests))
    
    onUpdateUser(updatedUser)
  }
  if (!currentUser) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="User" size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            {currentUser.username}
            {currentUser.isVerified && (
              <Icon name="BadgeCheck" size={20} className="text-blue-500" />
            )}
          </h2>
          <Badge variant="secondary">Уровень {currentUser.gameStats.level}</Badge>
          <p className="text-sm text-muted-foreground mt-2">ID: {currentUser.id}</p>
          
          {/* Кнопка верификации */}
          {!currentUser.isVerified && currentUser.verificationStatus !== 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowVerificationModal(true)}
              className="mt-3"
            >
              <Icon name="Shield" size={16} className="mr-2" />
              Верификация
            </Button>
          )}
          
          {currentUser.verificationStatus === 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              disabled
              className="mt-3"
            >
              <Icon name="Clock" size={16} className="mr-2" />
              На рассмотрении
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-primary">{currentUser.gameStats.totalEarned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Всего заработано</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-secondary">{(currentUser.gameStats.totalEarned / 10000).toFixed(2)} ₽</div>
            <div className="text-sm text-muted-foreground">В рублях</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {currentUser.username === 'admin' && (
          <Button 
            onClick={() => window.location.href = '/admin'} 
            variant="outline" 
            className="w-full"
          >
            <Icon name="Shield" className="mr-2" />
            Админка (тест)
          </Button>
        )}
        
        <Button onClick={onLogout} variant="destructive" className="w-full">
          <Icon name="LogOut" className="mr-2" />
          Выйти из аккаунта
        </Button>
      </div>

      {/* Модальное окно верификации */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSubmit={handleVerificationSubmit}
      />
    </div>
  )
}