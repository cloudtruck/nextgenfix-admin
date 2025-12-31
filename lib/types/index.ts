export interface Admin {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'super_admin' | 'manager' | 'support'
  permissions: string[]
  isActive: boolean
  lastLogin?: string | Date
  profilePicture?: string
}

export interface User {
  _id: string
  name: string
  email?: string
  phone?: string
  tier: 'bronze' | 'silver' | 'gold'
  tierProgress: {
    monthlyOrders: number
    monthlySpend: number
  }
  referralCode: string
  referredBy?: string
  isActive: boolean
  createdAt: string | Date
}

export interface MenuItem {
  _id: string
  name: string
  description: string
  category: string
  price: number
  discountedPrice?: number
  image?: string
  allergens: string[]
  nutritionInfo?: {
    calories: number
  }
  preparationTime?: number
  recommendedItems: string[]
  moodTag?: 'good' | 'angry' | 'in_love' | 'sad' | null
  hungerLevelTag?: 'little_hungry' | 'quite_hungry' | 'very_hungry' | 'super_hungry' | null
  isAvailable: boolean
  isVegetarian: boolean
}

export interface OrderItem {
  menuItem: MenuItem
  quantity: number
  price: number
}

export interface Order {
  _id: string
  userId: string
  type: 'scheduled' | 'dining'
  items: OrderItem[]
  subtotal: number
  tierDiscount: number
  couponDiscount: number
  tax: number
  deliveryCharges: number
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  scheduledTime?: string | Date
  tableNumber?: string
  createdAt: string | Date
}
