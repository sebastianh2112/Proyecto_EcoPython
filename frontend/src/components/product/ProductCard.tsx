'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { clsx } from 'clsx'
import type { Product } from '@/types'
import { cartApi } from '@/lib/api'
import { useCartStore, useAuthStore } from '@/lib/store'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [adding, setAdding] = useState(false)
  const [mounted, setMounted] = useState(false)
  const setCart = useCartStore((s) => s.setCart)
  const openCart = useCartStore((s) => s.openCart)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => setMounted(true), [])

  const primaryCategory = product.categories[0]

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated()) return
    setAdding(true)
    try {
      const cart = await cartApi.add(product.id)
      setCart(cart)
      openCart()
    } catch {
      // silently fail
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link href={`/productos/${product.slug}`} className="product-card group block">
      {/* Image */}
      <div className="product-card-image relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-stone)]">
            <ShoppingBag size={40} strokeWidth={1} />
          </div>
        )}

        {/* Add-to-cart overlay button */}
        {mounted && isAuthenticated() && (
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={clsx(
              'absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              'bg-[var(--color-canvas)] rounded-full w-10 h-10 flex items-center justify-center',
              'hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)]',
              'disabled:cursor-not-allowed disabled:opacity-40',
            )}
            aria-label="Agregar al carrito"
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="product-card-meta">
        {primaryCategory && (
          <p className="text-xs text-[var(--color-mute)] uppercase tracking-wide font-medium">
            {primaryCategory.title}
          </p>
        )}
        <p className="text-sm font-medium text-[var(--color-ink)] leading-snug line-clamp-2">
          {product.title}
        </p>
        <span className="text-sm font-medium">
          ${parseFloat(product.price).toFixed(2)}
        </span>
      </div>
    </Link>
  )
}
