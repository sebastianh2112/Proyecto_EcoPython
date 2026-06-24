'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface FormState {
  username: string
  email: string
  first_name: string
  last_name: string
  password: string
  password2: string
}

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState<FormState>({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password2: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    try {
      const data = await authApi.register(form)
      setAuth(data.user, data.access, data.refresh)
      router.push('/')
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail || 'Error al crear la cuenta. Intenta con otro usuario o email.')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = { display: 'flex' as const, flexDirection: 'column' as const, gap: '4px' }
  const labelStyle = { fontSize: '14px', fontWeight: 500 as const }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div className="hidden md:flex flex-1 bg-[var(--color-soft-cloud)] items-center justify-center p-12">
        <h1 className="display-campaign text-[var(--color-ink)]">
          Únete<br />hoy.
        </h1>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ marginBottom: '32px' }}>
            <Link href="/" className="font-display text-xl uppercase tracking-tight">ECOMMERCE by TECNOVANCE</Link>
            <h2 className="heading-xl" style={{ marginTop: '16px' }}>Crear cuenta</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-mute)', marginTop: '4px' }}>
              ¿Ya tienes cuenta?{' '}
              <Link href="/cuenta/login" style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontWeight: 500 }}>
                Inicia sesión
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="first_name">Nombre</label>
                <input id="first_name" type="text" required value={form.first_name} onChange={set('first_name')} className="form-input" placeholder="Juan" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="last_name">Apellido</label>
                <input id="last_name" type="text" required value={form.last_name} onChange={set('last_name')} className="form-input" placeholder="Pérez" />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="username">Usuario</label>
              <input id="username" type="text" autoComplete="username" required value={form.username} onChange={set('username')} className="form-input" placeholder="juan_perez" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} className="form-input" placeholder="juan@ejemplo.com" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="password">Contraseña</label>
              <input id="password" type="password" autoComplete="new-password" required value={form.password} onChange={set('password')} className="form-input" placeholder="Mínimo 8 caracteres" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="password2">Confirmar contraseña</label>
              <input id="password2" type="password" autoComplete="new-password" required value={form.password2} onChange={set('password2')} className="form-input" placeholder="••••••••" />
            </div>

            {error && <p style={{ fontSize: '14px', color: 'var(--color-sale)' }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '8px',
                backgroundColor: 'var(--color-ink)',
                color: 'var(--color-canvas)',
                border: 'none',
                borderRadius: '30px',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
