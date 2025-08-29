export interface GameStats {
  coins: number
  dailyBonus: number
  tapsLeft: number
  maxTaps: number
  level: number
  robotPower: number
  totalEarned: number
  lastDailyBonusTime?: string
  energyDepletedAt?: number | null
  robotsOwned?: Record<string, number>
  autoTapData?: {
    chargingStarted: number | null
    activatedAt: number | null
    expiresAt: number | null
  }
}

export interface User {
  id: string
  username: string
  email: string
  password: string
  gameStats: GameStats
  registeredAt: string
  verificationStatus?: 'pending' | 'approved' | 'rejected' | null
  isVerified?: boolean
}