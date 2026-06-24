'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Check } from 'lucide-react'
import { cartApi } from '@/lib/api'
import { useCartStore, useAuthStore } from '@/lib/store'
import type { Product } from '@/types'

export function AddToCartButton({ product }: { product: Product }) {
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle')
  const [mounted, setMounted] = useState(false)
  const setCart = useCartStore((s) => s.setCart)
  const openCart = useCartStore((s) => s.openCart)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => setMounted(true), [])

  if (!mounted || !isAuthenticated()) {
    return (
      <Link href="/cuenta/login">
        <button className="btn-primary w-full">Inicia sesión para comprar</button>
      </Link>
    )
  }

  const handleAdd = async () => {
    setState('adding')
    try {
      const cart = await cartApi.add(product.id)
      setCart(cart)
      openCart()
      setState('added')
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={state !== 'idle'}
      className="btn-primary w-full gap-2"
    >
      {state === 'adding' ? (
        'Agregando...'
      ) : state === 'added' ? (
        <>
          <Check size={16} strokeWidth={2} />
          Agregado al carrito
        </>
      ) : (
        <>
          <ShoppingBag size={16} strokeWidth={1.5} />
          Agregar al carrito
        </>
      )}
    </button>
  )
}
