'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ShoppingBag, MapPin } from 'lucide-react'
import { useAuthStore, useCheckoutStore, useCartStore } from '@/lib/store'
import { ordersApi } from '@/lib/api'
import StripePaymentForm from '@/components/checkout/StripePaymentForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function PagoPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const order = useCheckoutStore((s) => s.order)
  const cart = useCartStore((s) => s.cart)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/cuenta/login')
      return
    }
    // Read order as snapshot — not reactive, so clearing the store
    // during payment won't trigger a redirect back to /checkout
    const currentOrder = useCheckoutStore.getState().order
    if (!currentOrder) {
      router.replace('/checkout')
      return
    }

    ordersApi
      .paymentIntent()
      .then((data) => setClientSecret(data.client_secret))
      .catch(() => setError('No se pudo iniciar el pago. Intenta de nuevo.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-[var(--color-sale)]">{error}</p>
        <button
          onClick={() => router.replace('/checkout')}
          className="btn-secondary mt-4 text-sm"
        >
          Volver al checkout
        </button>
      </main>
    )
  }

  if (!order || !clientSecret) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-[var(--color-soft-cloud)] animate-pulse mb-8" />
        <div className="flex flex-col gap-5">
          <div className="h-40 bg-[var(--color-soft-cloud)] animate-pulse" />
          <div className="h-28 bg-[var(--color-soft-cloud)] animate-pulse" />
          <div className="h-36 bg-[var(--color-soft-cloud)] animate-pulse" />
        </div>
      </main>
    )
  }

  const { direccion } = order

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="heading-xl mb-2">Checkout</h1>

      <div className="flex items-center gap-2 text-sm mb-8">
        <span className="text-[var(--color-stone)]">1. Dirección</span>
        <span className="text-[var(--color-hairline)]">—</span>
        <span className="font-semibold text-[var(--color-ink)]">2. Pago</span>
      </div>

      <div className="flex flex-col gap-5">
        <div className="border border-[var(--color-hairline-soft)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={16} strokeWidth={1.5} className="text-[var(--color-ash)]" />
            <h2 className="heading-md">Resumen de la orden</h2>
          </div>

          <ul className="flex flex-col gap-2 mb-4">
            {(cart?.items ?? []).map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-[var(--color-ink)]">
                  {item.product.title}{' '}
                  <span className="text-[var(--color-stone)]">&times; {item.quantity}</span>
                </span>
                <span className="text-[var(--color-ink)]">
                  ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--color-hairline-soft)] pt-3 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{order.total_display}</span>
          </div>
        </div>

        {direccion && (
          <div className="border border-[var(--color-hairline-soft)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} strokeWidth={1.5} className="text-[var(--color-ash)]" />
              <h2 className="heading-md">Envío a</h2>
            </div>
            <p className="text-sm text-[var(--color-ink)]">{direccion.line1}</p>
            {direccion.line2 && (
              <p className="text-sm text-[var(--color-stone)]">{direccion.line2}</p>
            )}
            <p className="text-sm text-[var(--color-stone)]">
              {direccion.city}, {direccion.state} {direccion.postal_code}
            </p>
            <p className="text-sm text-[var(--color-stone)]">{direccion.country}</p>
          </div>
        )}

        <div className="border border-[var(--color-hairline-soft)] p-6">
          <h2 className="heading-md mb-5">Datos de pago</h2>
          <Elements stripe={stripePromise}>
            <StripePaymentForm clientSecret={clientSecret} ordenId={order.id} />
          </Elements>
        </div>
      </div>
    </main>
  )
}
