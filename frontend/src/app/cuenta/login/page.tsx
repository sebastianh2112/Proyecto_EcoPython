'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.login(form.username, form.password)
      setAuth(data.user, data.access, data.refresh)
      router.push('/')
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel — brand */}
      <div className="hidden md:flex flex-1 bg-[var(--color-ink)] items-center justify-center p-12">
        <h1 className="display-campaign text-[var(--color-canvas)]">
          Bienvenido<br />de vuelta.
        </h1>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>

          <div style={{ marginBottom: '32px' }}>
            <Link href="/" className="font-display text-xl uppercase tracking-tight">ECOMMERCE by TECNOVANCE</Link>
            <h2 className="heading-xl" style={{ marginTop: '16px' }}>Inicia sesión</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-mute)', marginTop: '4px' }}>
              ¿No tienes cuenta?{' '}
              <Link href="/cuenta/registro" style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontWeight: 500 }}>
                Regístrate
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500 }} htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="form-input"
                placeholder="tu_usuario"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500 }} htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p style={{ fontSize: '14px', color: 'var(--color-sale)' }}>{error}</p>
            )}

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
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
