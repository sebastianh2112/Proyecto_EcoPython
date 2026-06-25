'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, MapPin, CreditCard, Settings, ChevronRight, LogOut, ArrowLeft } from 'lucide-react'
import { useAuthStore, useCartStore } from '@/lib/store'
import { authApi } from '@/lib/api'

const ACCOUNT_SECTIONS = [
  {
    icon: Package,
    label: 'Mis pedidos',
    description: 'Seguimiento y historial de compras',
    demo: true,
  },
  {
    icon: MapPin,
    label: 'Mis direcciones',
    description: 'Gestiona tus direcciones de envío',
    demo: true,
  },
  {
    icon: CreditCard,
    label: 'Métodos de pago',
    description: 'Tarjetas y formas de pago guardadas',
    demo: true,
  },
  {
    icon: Settings,
    label: 'Configuración',
    description: 'Preferencias y seguridad de la cuenta',
    demo: true,
  },
]

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-ink)',
        color: 'var(--color-canvas)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 600,
        letterSpacing: '-0.5px',
        flexShrink: 0,
      }}
    >
      {initials || '?'}
    </div>
  )
}

export default function CuentaPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const clearCart = useCartStore((s) => s.clearCart)
  const [loggingOut, setLoggingOut] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !user) {
      router.replace('/cuenta/login')
    }
  }, [hydrated, user, router])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      if (refreshToken) await authApi.logout(refreshToken)
    } catch {
      // proceed regardless
    } finally {
      clearAuth()
      clearCart()
      router.push('/')
    }
  }

  if (!hydrated || !user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '14px', color: 'var(--color-mute)' }}>Cargando...</span>
      </div>
    )
  }

  const displayName = user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.username

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>

      {/* Back link */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          color: 'var(--color-mute)',
          textDecoration: 'none',
          marginBottom: '32px',
        }}
      >
        <ArrowLeft size={15} strokeWidth={1.5} />
        Volver a la tienda
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
        <UserAvatar name={displayName} />
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, lineHeight: 1.2, margin: 0 }}>
            {displayName}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-mute)', marginTop: '4px' }}>
            {user.email}
          </p>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-hairline-soft)', marginBottom: '40px' }} />

      {/* Section grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', marginBottom: '48px' }}>
        {ACCOUNT_SECTIONS.map(({ icon: Icon, label, description, demo }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
              border: '1px solid var(--color-hairline-soft)',
              borderRadius: '12px',
              cursor: 'default',
              opacity: demo ? 0.5 : 1,
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-hairline-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{label}</span>
                {demo && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--color-mute)',
                      backgroundColor: 'var(--color-hairline-soft)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Próximamente
                  </span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-mute)', marginTop: '2px' }}>
                {description}
              </p>
            </div>
            <ChevronRight size={16} strokeWidth={1.5} style={{ color: 'var(--color-stone)', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ borderTop: '1px solid var(--color-hairline-soft)', paddingTop: '32px' }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            padding: '10px 0',
            fontSize: '14px',
            fontWeight: 500,
            color: loggingOut ? 'var(--color-mute)' : 'var(--color-ink)',
            cursor: loggingOut ? 'not-allowed' : 'pointer',
          }}
        >
          <LogOut size={16} strokeWidth={1.5} />
          {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  )
}
