export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  has_address: boolean
}

export interface Category {
  id: number
  title: string
  description: string
}

export interface Product {
  id: number
  title: string
  description?: string
  price: string
  slug: string
  image_url: string | null
  categories: Category[]
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface CartProduct {
  id: number
  product: Product
  quantity: number
  created_at: string
}

export interface Cart {
  id: number
  cart_id: string
  subtotal: string
  total: string
  items: CartProduct[]
  created_at: string
}

export interface Address {
  id: number
  line1: string
  line2: string
  city: string
  state: string
  country: string
  reference: string
  postal_code: string
  default: boolean
  created_at: string
}

export interface OrderProduct {
  id: number
  title: string
  price: string
  quantity: number
}

export interface Order {
  id: number
  ordenID: string
  status: 'CREATED' | 'PAYED' | 'COMPLETED' | 'CANCELED'
  status_display: string
  total: string
  total_display: string
  envio_total: string
  direccion: Address | null
  products: OrderProduct[]
  created_at: string
}

export interface AuthTokens {
  access: string
  refresh: string
  user: User
}
