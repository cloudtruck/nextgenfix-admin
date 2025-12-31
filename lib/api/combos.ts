import apiClient from './client'
import type { MenuItem } from './menu'

// Discount configuration
export interface ComboDiscount {
  type: 'percentage' | 'fixed' | 'none'
  value: number
}

// Price warning
export interface PriceWarning {
  hasWarning: boolean
  lastChecked?: string
  message?: string
}

// Combo item with quantity
export interface ComboItem {
  menuItem: string | MenuItem // Can be ID or populated object
  quantity: number
  _id?: string
}

// Backend response type (with new schema)
interface ComboOfferBackend {
  _id: string
  name: string
  description: string
  image?: string
  items: ComboItem[] // New structure with quantity
  originalPrice: number // New field
  discount: ComboDiscount // New field
  price: number // Final price after discount
  priceWarning?: PriceWarning // New field
  isActive: boolean
  validFrom: string
  validUntil: string
  createdAt: string
  updatedAt: string
}

// Frontend type
export interface ComboOffer {
  _id: string
  name: string
  description: string
  image?: string
  items: ComboItem[] // New structure
  originalPrice: number // New field
  discount: ComboDiscount // New field
  price: number // Final price
  priceWarning?: PriceWarning // New field
  isActive: boolean
  validFrom: string
  validUntil: string
  createdAt: string
  updatedAt: string
}

// Transform backend response to frontend format (now 1:1 mapping)
const transformCombo = (backendCombo: ComboOfferBackend): ComboOffer => ({
  ...backendCombo,
})

export const getCombos = async () => {
  const response = await apiClient.get<{ combos: ComboOfferBackend[] }>('/combos')
  return {
    ...response.data,
    combos: response.data.combos.map(transformCombo)
  }
}

export const getComboById = async (id: string) => {
  const response = await apiClient.get<ComboOfferBackend>(`/combos/${id}`)
  return transformCombo(response.data)
}

export const createCombo = async (data: FormData | Omit<ComboOffer, '_id' | 'createdAt' | 'updatedAt'>) => {
  const response = await apiClient.post<ComboOfferBackend>('/combos', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    timeout: data instanceof FormData ? 120000 : 60000,
  })
  return transformCombo(response.data)
}

export const updateCombo = async (id: string, data: FormData | Partial<ComboOffer>) => {
  const response = await apiClient.put<ComboOfferBackend>(`/combos/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    timeout: data instanceof FormData ? 120000 : 60000,
  })
  return transformCombo(response.data)
}

export const deleteCombo = async (id: string) => {
  const response = await apiClient.delete(`/combos/${id}`)
  return response.data
}

export const toggleComboStatus = async (id: string) => {
  const response = await apiClient.put<ComboOfferBackend>(`/combos/${id}/toggle`)
  return transformCombo(response.data)
}

// Get all combos (admin only, includes inactive)
export const getAllCombos = async () => {
  const response = await apiClient.get<{ combos: ComboOfferBackend[] }>('/combos/admin/all')
  return {
    ...response.data,
    combos: response.data.combos.map(transformCombo)
  }
}

// Check price mismatches
export const checkPriceMismatches = async () => {
  const response = await apiClient.get('/combos/admin/check-prices')
  return response.data
}
