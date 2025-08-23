export interface WithdrawRequest {
  id: number
  userId: string
  username: string
  email: string
  amount: number
  coins: number
  paymentSystem: 'yumoney' | 'card' | 'phone'
  paymentDetails: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  processedAt: string | null
  processedBy: string | null
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalCoins: number
  totalTaps: number
  vipUsers: number
  onlineUsers: number
  pendingWithdraws: number
  totalWithdrawAmount: number
}