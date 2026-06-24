'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store'
import { cartApi } from '@/lib/api'

export function CartDrawer() {
  const { cart, isOpen, closeCart, setCart } = useCartStore()

  const handleRemove = async (itemId: number) => {
    try {
      const updated = await cartApi.remove(itemId)
      setCart(updated)
    } catch {
      // ignore
    }
  }

  const total = cart?.items.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity
  }, 0) ?? 0

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[384px] bg-[var(--color-canvas)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-hairline-soft)]">
              <h2 className="text-base font-medium">Carrito</h2>
              <button
                onClick={closeCart}
                className="p-1 hover:opacity-60 transition-opacity"
                aria-label="Cerrar carrito"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} strokeWidth={1} className="text-[var(--color-stone)]" />
                  <p className="text-sm text-[var(--color-mute)]">Tu carrito está vacío</p>
                  <button onClick={closeCart} className="btn-secondary text-sm px-6 py-2 h-auto">
                    Seguir comprando
                  </button>
                </div>
              ) : (
                cart.items.map((item) => {
                  const lineTotal = parseFloat(item.product.price) * item.quantity

                  return (
                    <div key={item.id} className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 bg-[var(--color-soft-cloud)] flex-shrink-0 relative overflow-hidden">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--color-stone)]">
                            <ShoppingBag size={24} strokeWidth={1} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug truncate">{item.product.title}</p>
                        <p className="text-xs text-[var(--color-mute)] mt-0.5">Cant: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">${lineTotal.toFixed(2)}</p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1 self-start hover:opacity-60 transition-opacity text-[var(--color-mute)]"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="px-5 pb-6 pt-4 border-t border-[var(--color-hairline-soft)] flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-mute)]">Total estimado</span>
                  <span className="font-semibold text-base">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[var(--color-mute)]">Envío e impuestos calculados en el checkout</p>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="btn-primary w-full">Ir al checkout</button>
                </Link>
                <button onClick={closeCart} className="btn-secondary w-full text-sm">
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
