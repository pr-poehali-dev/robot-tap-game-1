import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Icon from '@/components/ui/icon'

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (photo: File) => void
}

export default function VerificationModal({ isOpen, onClose, onSubmit }: VerificationModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedPhoto(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async () => {
    if (!selectedPhoto) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(selectedPhoto)
      onClose()
    } catch (error) {
      console.error('Ошибка отправки:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedPhoto(null)
    setPreviewUrl('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Icon name="Shield" className="text-blue-500" size={24} />
            Верификация аккаунта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Образец позы */}
          <div className="text-center">
            <div className="mb-4">
              <img 
                src="/img/16b4f45c-5ce5-4c66-a7c5-acb6e58f7975.jpg" 
                alt="Образец позы" 
                className="w-32 h-32 mx-auto rounded-lg border-2 border-blue-200"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">Имитировать жест</h3>
            <p className="text-sm text-muted-foreground">
              Чтобы подтвердить свой профиль, загрузите фотографию, максимально имитирующую эту позу.
            </p>
          </div>

          {/* Загрузка фото */}
          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                {previewUrl ? (
                  <div className="space-y-2">
                    <img 
                      src={previewUrl} 
                      alt="Предпросмотр" 
                      className="w-24 h-24 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-green-600">Фото выбрано</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Icon name="Upload" size={32} className="mx-auto text-blue-400" />
                    <p className="text-sm text-muted-foreground">
                      Нажмите для выбора фото
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Кнопки */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedPhoto || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Отправляю...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}