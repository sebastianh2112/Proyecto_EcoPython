import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, Cart, Order } from '@/types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: User, access: string, refresh: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, access, refresh) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('access_token', access)
          sessionStorage.setItem('refresh_token', refresh)
        }
        set({ user, accessToken: access, refreshToken: refresh })
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('access_token')
          sessionStorage.removeItem('refresh_token')
        }
        set({ user: null, accessToken: null, refreshToken: null })
      },
      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)

interface CartStore {
  cart: Cart | null
  isOpen: boolean
  setCart: (cart: Cart) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  itemCount: () => number
}

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: null,
  isOpen: false,
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  itemCount: () => {
    const cart = get().cart
    if (!cart) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))

interface CheckoutStore {
  selectedAddressId: number | null
  order: Order | null
  setSelectedAddress: (id: number) => void
  setOrder: (order: Order) => void
  clear: () => void
}

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  selectedAddressId: null,
  order: null,
  setSelectedAddress: (id) => set({ selectedAddressId: id }),
  setOrder: (order) => set({ order }),
  clear: () => set({ selectedAddressId: null, order: null }),
}))
