'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { useAuthStore, useCheckoutStore } from '@/lib/store'
import { addressApi, ordersApi } from '@/lib/api'
import AddressSelector from '@/components/checkout/AddressSelector'
import type { Address } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { selectedAddressId, setSelectedAddress, setOrder } = useCheckoutStore()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/cuenta/login')
      return
    }

    addressApi
      .list()
      .then((data) => {
        setAddresses(data)
        const def = data.find((a) => a.default)
        if (def) setSelectedAddress(def.id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated, router, setSelectedAddress])

  const handleAddressCreated = (address: Address) => {
    setAddresses((prev) => [...prev, address])
    setSelectedAddress(address.id)
  }

  const handleContinue = async () => {
    if (!selectedAddressId) return
    setSubmitting(true)
    setError('')
    try {
      await ordersApi.create()
      const order = await ordersApi.setAddress(selectedAddressId)
      setOrder(order)
      router.push('/checkout/pago')
    } catch {
      setError('No se pudo continuar. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-[var(--color-soft-cloud)] animate-pulse mb-8" />
        <div className="border border-[var(--color-hairline-soft)] p-6 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[var(--color-soft-cloud)] animate-pulse" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="heading-xl mb-2">Checkout</h1>

      <div className="flex items-center gap-2 text-sm mb-8">
        <span className="font-semibold text-[var(--color-ink)]">1. Dirección</span>
        <span className="text-[var(--color-hairline)]">—</span>
        <span className="text-[var(--color-stone)]">2. Pago</span>
      </div>

      <div className="border border-[var(--color-hairline-soft)] p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={16} strokeWidth={1.5} className="text-[var(--color-ash)]" />
          <h2 className="heading-md">Dirección de envío</h2>
        </div>

        {addresses.length === 0 && (
          <p className="text-sm text-[var(--color-mute)] mb-4">
            No tienes direcciones guardadas. Agrega una para continuar.
          </p>
        )}

        <AddressSelector
          addresses={addresses}
          selectedId={selectedAddressId}
          onSelect={setSelectedAddress}
          onAddressCreated={handleAddressCreated}
        />

        {error && (
          <p className="mt-4 text-sm text-[var(--color-sale)]">{error}</p>
        )}

        <div className="mt-6 pt-4 border-t border-[var(--color-hairline-soft)] flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleContinue}
            disabled={!selectedAddressId || submitting}
            className="btn-primary disabled:opacity-40"
          >
            {submitting ? 'Procesando...' : 'Continuar al pago'}
          </button>
          <button
            onClick={() => router.back()}
            disabled={submitting}
            className="btn-secondary text-sm"
          >
            Volver al carrito
          </button>
        </div>
      </div>
    </main>
  )
}
