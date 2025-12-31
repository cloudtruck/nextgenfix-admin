import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Admin } from '../types'

interface AuthState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
  login: (admin: Admin, token: string) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (admin, token) => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('adminToken', token)
          }
        } catch {
          // noop
        }
        set({ admin, token, isAuthenticated: true })
      },

      logout: () => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('adminToken')
            localStorage.removeItem('adminInfo')
          }
        } catch {
          // noop
        }
        set({ admin: null, token: null, isAuthenticated: false })
      },

      hasPermission: (permission) => {
        const { admin } = get()
        if (!admin) return false
        if (admin.role === 'super_admin') return true
        return admin.permissions?.includes(permission) || false
      },
    }),
    {
      name: 'admin-auth',
    }
  )
)
