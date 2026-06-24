'use client'

import { useState } from 'react'
import { addressApi } from '@/lib/api'
import type { Address } from '@/types'

interface Props {
  onSuccess: (address: Address) => void
  onCancel: () => void
}

const EMPTY_FIELDS = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  reference: '',
}

export default function AddressForm({ onSuccess, onCancel }: Props) {
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fields.line1.trim() || !fields.city.trim() || !fields.country.trim()) {
      setError('Calle, ciudad y país son obligatorios')
      return
    }
    setLoading(true)
    setError('')
    try {
      const address = await addressApi.create(fields)
      onSuccess(address)
    } catch {
      setError('No se pudo guardar la dirección. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[var(--color-hairline-soft)] p-4 flex flex-col gap-3 bg-[var(--color-soft-cloud)]"
    >
      <p className="text-sm font-medium">Nueva dirección</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs text-[var(--color-ash)] mb-1">
            Calle y número <span className="text-[var(--color-sale)]">*</span>
          </label>
          <input
            name="line1"
            value={fields.line1}
            onChange={handleChange}
            placeholder="Ej. Av. Principal 123"
            className="w-full h-9 px-3 text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-[var(--color-ash)] mb-1">
            Apartamento / interior
          </label>
          <input
            name="line2"
            value={fields.line2}
            onChange={handleChange}
            placeholder="Ej. Apto 4B (opcional)"
            className="w-full h-9 px-3 text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--color-ash)] mb-1">
            Ciudad <span className="text-[var(--color-sale)]">*</span>
          </label>
          <input
            name="city"
            value={fields.city}
            onChange={handleChange}
            placeholder="Ej. San José"
            className="w-full h-9 px-3 text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--color-ash)] mb-1">
            Provincia / Estado
          </label>
          <input
            name="state"
            value={fields.state}
            onChange={handleChange}
            placeholder="Ej. San José"
            className="w-full h-9 px-3 text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--color-ash)] mb-1">
            País <span className="text-[var(--color-sale)]">*</span>
          </label>
          <input
            name="country"
            value={fields.country}
            onChange={handleChange}
            placeholder="Ej. Costa Rica"
            className="w-full h-9 px-3 text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--color-ash)] mb-1">
            Código postal
          </label>
          <input
            name="postal_code"
            value={fields.postal_code}
            onChange={handleChange}
            placeholder="Ej. 10101"
            className="w-full h-9 px-3 text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-[var(--color-ash)] mb-1">
            Referencia
          </label>
          <input
            name="reference"
            value={fields.reference}
            onChange={handleChange}
            placeholder="Ej. Frente al parque central (opcional)"
            className="w-full h-9 px-3 text-sm border border-[var(--color-hairline)] bg-[var(--color-canvas)] focus:outline-none focus:border-[var(--color-ink)] transition-colors"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-[var(--color-sale)]">{error}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-sm h-9 px-5 disabled:opacity-40"
        >
          {loading ? 'Guardando...' : 'Guardar dirección'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary text-sm h-9 px-4"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
