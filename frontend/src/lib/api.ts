import axios, { AxiosError } from 'axios'
import type { AuthTokens, Cart, Product, PaginatedResponse, Category, Order, Address } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach access token from sessionStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const access = sessionStorage.getItem('access_token')
    if (access) config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & { _retry?: boolean }
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true
      try {
        const refresh = sessionStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh })
        sessionStorage.setItem('access_token', data.access)
        if (original.headers) original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        window.location.href = '/cuenta/login'
      }
    }
    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthTokens>('/auth/login/', { username, password }).then(r => r.data),

  register: (data: { username: string; email: string; first_name: string; last_name: string; password: string; password2: string }) =>
    api.post<AuthTokens>('/auth/register/', data).then(r => r.data),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),

  me: () => api.get('/auth/me/').then(r => r.data),
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params?: { q?: string; category?: string; page?: number }) =>
    api.get<PaginatedResponse<Product>>('/products/', { params }).then(r => r.data),

  detail: (slug: string) =>
    api.get<Product>(`/products/${slug}/`).then(r => r.data),
}

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get<Category[]>('/categories/').then(r => r.data),
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get<Cart>('/cart/').then(r => r.data),

  add: (product_id: number, quantity = 1) =>
    api.post<Cart>('/cart/add/', { product_id, quantity }).then(r => r.data),

  remove: (itemId: number) =>
    api.delete<Cart>(`/cart/remove/${itemId}/`).then(r => r.data),
}

// ─── Addresses ────────────────────────────────────────────────────────────────
export const addressApi = {
  list: () => api.get<Address[]>('/addresses/').then(r => r.data),

  create: (data: Omit<Address, 'id' | 'default' | 'created_at'>) =>
    api.post<Address>('/addresses/', data).then(r => r.data),

  update: (id: number, data: Partial<Address>) =>
    api.put<Address>(`/addresses/${id}/`, data).then(r => r.data),

  remove: (id: number) => api.delete(`/addresses/${id}/`),

  setDefault: (id: number) =>
    api.post<Address>(`/addresses/${id}/default/`).then(r => r.data),
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  list: () => api.get<Order[]>('/orders/').then(r => r.data),

  create: () => api.post<Order>('/orders/create/').then(r => r.data),

  setAddress: (addressId: number) =>
    api.post<Order>(`/orders/address/${addressId}/`).then(r => r.data),

  paymentIntent: () =>
    api.post<{ client_secret: string }>('/orders/payment-intent/').then(r => r.data),

  confirmPayment: (payment_intent_id: string, orden_id: number) =>
    api.post<Order>('/orders/confirm-payment/', { payment_intent_id, orden_id }).then(r => r.data),

  cancel: () => api.post('/orders/cancel/'),
}

// ─── Promo ────────────────────────────────────────────────────────────────────
export const promoApi = {
  validate: (codigo: string) =>
    api.post<{ valid: boolean; codigo?: string; descuento?: string; message?: string }>(
      '/promo/validate/', { codigo }
    ).then(r => r.data),
}
