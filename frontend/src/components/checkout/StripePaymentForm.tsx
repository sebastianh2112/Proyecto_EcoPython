'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ordersApi } from '@/lib/api'
import { useCheckoutStore, useCartStore } from '@/lib/store'

interface Props {
  clientSecret: string
  ordenId: number
}

export default function StripePaymentForm({ clientSecret, ordenId }: Props) {
  const router = useRouter()
  const clear = useCheckoutStore((s) => s.clear)
  const clearCart = useCartStore((s) => s.clearCart)
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setLoading(false)
      return
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Error al procesar el pago.')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      try {
        await ordersApi.confirmPayment(paymentIntent.id, ordenId)
        clear()
        clearCart()
        router.push(`/checkout/confirmacion?orden_id=${ordenId}`)
      } catch {
        setError('Pago procesado pero no se pudo confirmar la orden. Contacta soporte.')
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div
        className="border border-[var(--color-hairline-soft)] bg-[var(--color-soft-cloud)] p-4"
        style={{ borderRadius: 'var(--radius-sm)' }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#111111',
                fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                fontSmoothing: 'antialiased',
                '::placeholder': { color: '#9e9ea0' },
              },
              invalid: {
                color: '#d30005',
                iconColor: '#d30005',
              },
            },
          }}
        />
      </div>

      {error && <p className="text-sm text-[var(--color-sale)]">{error}</p>}

      <p className="text-xs text-[var(--color-stone)]">
        Modo test: tarjeta{' '}
        <code className="font-mono bg-[var(--color-soft-cloud)] px-1">4242 4242 4242 4242</code>,
        cualquier fecha futura, cualquier CVC.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn-primary disabled:opacity-40"
        >
          {loading ? 'Procesando pago...' : 'Pagar ahora'}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => router.back()}
          className="btn-secondary text-sm"
        >
          Volver
        </button>
      </div>
    </form>
  )
}
