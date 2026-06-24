'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useAuthStore, useCheckoutStore, useCartStore } from '@/lib/store'
import { ordersApi } from '@/lib/api'
import type { Order } from '@/types'

function ConfirmacionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ordenId = searchParams.get('orden_id')

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clear = useCheckoutStore((s) => s.clear)
  const clearCart = useCartStore((s) => s.clearCart)

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/cuenta/login')
      return
    }
    if (!ordenId) {
      router.replace('/')
      return
    }

    clear()
    clearCart()

    ordersApi
      .list()
      .then((orders) => {
        const found = orders.find((o) => o.id === Number(ordenId))
        setOrder(found ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="h-16 w-16 bg-[var(--color-soft-cloud)] rounded-full animate-pulse mx-auto mb-6" />
        <div className="h-8 w-64 bg-[var(--color-soft-cloud)] animate-pulse mx-auto mb-3" />
        <div className="h-4 w-48 bg-[var(--color-soft-cloud)] animate-pulse mx-auto" />
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
      <CheckCircle
        size={64}
        strokeWidth={1.2}
        className="mx-auto mb-6 text-[var(--color-success)]"
      />

      <h1 className="heading-xl mb-2">¡Pago confirmado!</h1>
      <p className="text-[var(--color-mute)] text-sm mb-8">
        Tu orden fue procesada con éxito. Te enviaremos una confirmación cuando sea despachada.
      </p>

      {order && (
        <div className="border border-[var(--color-hairline-soft)] p-6 text-left mb-8">
          <div className="flex justify-between text-sm mb-4">
            <span className="text-[var(--color-mute)]">Número de orden</span>
            <span className="font-mono text-xs text-[var(--color-ink)] truncate max-w-[200px]">
              {order.ordenID}
            </span>
          </div>

          <ul className="flex flex-col gap-2 mb-4">
            {(order.products ?? []).map((p) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span className="text-[var(--color-ink)]">
                  {p.title}{' '}
                  <span className="text-[var(--color-stone)]">&times; {p.quantity}</span>
                </span>
                <span>${p.price}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--color-hairline-soft)] pt-3 flex justify-between text-sm font-semibold">
            <span>Total pagado</span>
            <span>{order.total_display}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <button className="btn-primary">Seguir comprando</button>
        </Link>
      </div>
    </main>
  )
}

export default function ConfirmacionPage() {
  return (
    <Suspense>
      <ConfirmacionContent />
    </Suspense>
  )
}
