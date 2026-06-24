'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, Tag, Check, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { cartApi, promoApi } from '@/lib/api'

interface PromoState {
  status: 'idle' | 'loading' | 'valid' | 'invalid'
  message: string
  descuento: string
}

export default function CarritoPage() {
  const { cart, setCart } = useCartStore()

  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<PromoState>({ status: 'idle', message: '', descuento: '' })
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  // Sync cart on mount in case drawer hasn't fetched it yet
  useEffect(() => {
    cartApi.get().then(setCart).catch(() => undefined)
  }, [setCart])

  const handleRemove = async (itemId: number) => {
    setRemovingId(itemId)
    try {
      const updated = await cartApi.remove(itemId)
      setCart(updated)
      setPromo({ status: 'idle', message: '', descuento: '' })
      setPromoInput('')
    } finally {
      setRemovingId(null)
    }
  }

  const handleDecrement = async (item: { id: number; product: { id: number }; quantity: number }) => {
    if (updatingId === item.id) return
    if (item.quantity <= 1) {
      handleRemove(item.id)
      return
    }
    setUpdatingId(item.id)
    try {
      // Backend remove reduces by 1 per call when quantity > 1 is not supported natively.
      // Instead: remove the item and re-add with quantity - 1.
      await cartApi.remove(item.id)
      const updated = await cartApi.add(item.product.id, item.quantity - 1)
      setCart(updated)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleIncrement = async (item: { id: number; product: { id: number }; quantity: number }) => {
    if (updatingId === item.id) return
    setUpdatingId(item.id)
    try {
      const updated = await cartApi.add(item.product.id, 1)
      setCart(updated)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleValidatePromo = async () => {
    if (!promoInput.trim()) return
    setPromo({ status: 'loading', message: '', descuento: '' })
    try {
      const res = await promoApi.validate(promoInput.trim())
      if (res.valid) {
        setPromo({ status: 'valid', message: res.message ?? 'Código aplicado', descuento: res.descuento ?? '' })
      } else {
        setPromo({ status: 'invalid', message: res.message ?? 'Código inválido', descuento: '' })
      }
    } catch {
      setPromo({ status: 'invalid', message: 'No se pudo validar el código', descuento: '' })
    }
  }

  const subtotal = cart?.items.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity
  }, 0) ?? 0

  const discount = promo.status === 'valid' && promo.descuento
    ? parseFloat(promo.descuento)
    : 0

  // descuento from backend comes as percentage (e.g. "10.00") or fixed amount.
  // Treat as percentage if <= 100, else as fixed dollar amount.
  const discountAmount = discount > 0 && discount <= 100
    ? subtotal * (discount / 100)
    : discount

  const total = Math.max(0, subtotal - discountAmount)

  const isEmpty = !cart || cart.items.length === 0

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="heading-xl mb-8">Tu carrito</h1>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <ShoppingBag size={56} strokeWidth={1} className="text-[var(--color-stone)]" />
          <p className="text-[var(--color-mute)]">Tu carrito está vacío</p>
          <Link href="/productos">
            <button className="btn-primary">Ver productos</button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Item list ── */}
          <section className="flex-1 flex flex-col divide-y divide-[var(--color-hairline-soft)]">
            {cart.items.map((item) => {
              const lineTotal = parseFloat(item.product.price) * item.quantity
              const isRemoving = removingId === item.id
              const isUpdating = updatingId === item.id

              return (
                <article
                  key={item.id}
                  className={`flex gap-4 py-5 transition-opacity ${isRemoving ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[var(--color-soft-cloud)] relative overflow-hidden">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.title}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-stone)]">
                        <ShoppingBag size={28} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/productos/${item.product.slug}`}
                        className="text-sm font-medium leading-snug hover:underline line-clamp-2"
                      >
                        {item.product.title}
                      </Link>
                      <span className="text-sm font-semibold flex-shrink-0">
                        ${lineTotal.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--color-mute)] mt-1">
                      ${parseFloat(item.product.price).toFixed(2)} c/u
                    </p>

                    {/* Quantity controls + remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-0 border border-[var(--color-hairline)] rounded-full overflow-hidden h-8">
                        <button
                          onClick={() => handleDecrement(item)}
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-soft-cloud)] disabled:opacity-40 transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={12} strokeWidth={2} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium select-none">
                          {isUpdating ? '…' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item)}
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-soft-cloud)] disabled:opacity-40 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} strokeWidth={2} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={isRemoving}
                        className="flex items-center gap-1 text-xs text-[var(--color-mute)] hover:text-[var(--color-sale)] transition-colors disabled:opacity-40"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 size={13} strokeWidth={1.5} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          {/* ── Order summary ── */}
          <aside className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="border border-[var(--color-hairline-soft)] p-6 flex flex-col gap-5">
              <h2 className="heading-md">Resumen del pedido</h2>

              {/* Promo code */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[var(--color-ash)] uppercase tracking-wide">
                  Código promocional
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-stone)]" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase())
                        if (promo.status !== 'idle') setPromo({ status: 'idle', message: '', descuento: '' })
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleValidatePromo()}
                      placeholder="CODIGO"
                      disabled={promo.status === 'valid'}
                      className="w-full h-9 pl-9 pr-3 text-sm border border-[var(--color-hairline)] focus:outline-none focus:border-[var(--color-ink)] disabled:opacity-50 disabled:bg-[var(--color-soft-cloud)] transition-colors"
                    />
                  </div>
                  {promo.status === 'valid' ? (
                    <button
                      onClick={() => {
                        setPromo({ status: 'idle', message: '', descuento: '' })
                        setPromoInput('')
                      }}
                      className="h-9 px-3 border border-[var(--color-hairline)] text-xs hover:bg-[var(--color-soft-cloud)] transition-colors flex items-center gap-1 text-[var(--color-mute)]"
                    >
                      <X size={12} />
                      Quitar
                    </button>
                  ) : (
                    <button
                      onClick={handleValidatePromo}
                      disabled={!promoInput.trim() || promo.status === 'loading'}
                      className="h-9 px-4 bg-[var(--color-ink)] text-[var(--color-canvas)] text-xs font-medium disabled:opacity-40 transition-opacity"
                    >
                      {promo.status === 'loading' ? '...' : 'Aplicar'}
                    </button>
                  )}
                </div>

                {/* Feedback message */}
                {promo.status === 'valid' && (
                  <p className="flex items-center gap-1.5 text-xs text-[var(--color-success)]">
                    <Check size={12} strokeWidth={2.5} />
                    {promo.message}
                    {promo.descuento && ` (${promo.descuento}% off)`}
                  </p>
                )}
                {promo.status === 'invalid' && (
                  <p className="flex items-center gap-1.5 text-xs text-[var(--color-sale)]">
                    <X size={12} strokeWidth={2.5} />
                    {promo.message}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-hairline-soft)] text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-mute)]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[var(--color-success)]">
                    <span>Descuento</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-[var(--color-mute)]">
                  <span>Envío</span>
                  <span>Calculado en checkout</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-[var(--color-hairline-soft)]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA */}
              <Link href="/checkout" className="w-full">
                <button className="btn-primary w-full">Ir al checkout</button>
              </Link>
              <Link href="/productos" className="w-full">
                <button className="btn-secondary w-full text-sm">Seguir comprando</button>
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
