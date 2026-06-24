'use client'

import { useState } from 'react'
import { Plus, MapPin } from 'lucide-react'
import AddressForm from './AddressForm'
import type { Address } from '@/types'

interface Props {
  addresses: Address[]
  selectedId: number | null
  onSelect: (id: number) => void
  onAddressCreated: (address: Address) => void
}

export default function AddressSelector({ addresses, selectedId, onSelect, onAddressCreated }: Props) {
  const [showForm, setShowForm] = useState(false)

  const handleAddressCreated = (address: Address) => {
    onAddressCreated(address)
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((addr) => {
        const isSelected = selectedId === addr.id
        return (
          <label
            key={addr.id}
            className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
              isSelected
                ? 'border-[var(--color-ink)] bg-[var(--color-canvas)]'
                : 'border-[var(--color-hairline-soft)] bg-[var(--color-canvas)] hover:border-[var(--color-hairline)]'
            }`}
          >
            <input
              type="radio"
              name="address"
              checked={isSelected}
              onChange={() => onSelect(addr.id)}
              className="mt-0.5 flex-shrink-0 accent-[var(--color-ink)]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <MapPin size={13} strokeWidth={1.5} className="text-[var(--color-stone)] flex-shrink-0" />
                <span className="text-sm font-medium">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                </span>
                {addr.default && (
                  <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 bg-[var(--color-soft-cloud)] text-[var(--color-ash)] border border-[var(--color-hairline-soft)]">
                    Principal
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-mute)] mt-0.5 pl-5">
                {addr.city}{addr.state ? `, ${addr.state}` : ''}, {addr.country}
                {addr.postal_code ? ` ${addr.postal_code}` : ''}
              </p>
              {addr.reference && (
                <p className="text-xs text-[var(--color-stone)] mt-0.5 pl-5">
                  Ref: {addr.reference}
                </p>
              )}
            </div>
          </label>
        )
      })}

      {showForm ? (
        <AddressForm
          onSuccess={handleAddressCreated}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors w-fit py-1"
        >
          <Plus size={14} strokeWidth={2} />
          Agregar nueva dirección
        </button>
      )}
    </div>
  )
}
