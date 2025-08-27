import { useState } from 'react'
import AuthModal from '@/components/AuthModal'
import { useRealTimeStats } from '@/hooks/useRealTimeStats'
import RobotStatsDisplay from '@/components/RobotStatsDisplay'

// Импорты декомпозированных компонентов
import LandingHeader from '@/components/landing/LandingHeader'
import HowToPlaySection from '@/components/landing/HowToPlaySection'
import RobotsShowcaseSection from '@/components/landing/RobotsShowcaseSection'
import EarningMethodsSection from '@/components/landing/EarningMethodsSection'
import GameFeaturesSection from '@/components/landing/GameFeaturesSection'
import CallToActionSection from '@/components/landing/CallToActionSection'
import LandingFooter from '@/components/landing/LandingFooter'

interface LandingPageProps {
  onLogin: (form: { username: string; email: string; password: string }) => void
  onRegister: (form: { username: string; email: string; password: string }) => void
  registrationCount: number
  onlineCount: number
}

export default function LandingPage({ onLogin, onRegister, registrationCount, onlineCount }: LandingPageProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register')
  
  const { stats, formatNumber } = useRealTimeStats()

  const handleOpenLogin = () => {
    setAuthModalTab('login')
    setIsAuthModalOpen(true)
  }

  const handleOpenRegister = () => {
    setAuthModalTab('register')
    setIsAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <LandingHeader 
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        registrationCount={registrationCount}
        onlineCount={onlineCount}
      />

      <div className="container mx-auto px-4 py-12 space-y-16">
        <HowToPlaySection />
        <RobotsShowcaseSection />
        <EarningMethodsSection />
        <GameFeaturesSection />
        <CallToActionSection onOpenRegister={handleOpenRegister} />
      </div>

      <LandingFooter />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </div>
  )
}