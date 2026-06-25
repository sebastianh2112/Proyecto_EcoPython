'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react'
import { useCartStore, useAuthStore } from '@/lib/store'
import { cartApi } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Novedades', href: '/productos?nuevo=1' },
  { label: 'Productos', href: '/productos' },
  { label: 'Categorías', href: '/categorias' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const itemCount = useCartStore((s) => s.itemCount())
  const toggleCart = useCartStore((s) => s.toggleCart)
  const setCart = useCartStore((s) => s.setCart)
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) return
    cartApi.get().then(setCart).catch(() => {})
  }, [accessToken, setCart])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-canvas)]">
      {/* Utility bar */}
      <div className="utility-bar hidden md:flex items-center justify-end px-6">
        <div className="flex items-center gap-4 text-xs font-medium">
          {user ? (
            <Link href="/cuenta" className="hover:underline">
              Hola, {user.first_name || user.username}
            </Link>
          ) : (
            <>
              <Link href="/cuenta/registro" className="hover:underline">Únete</Link>
              <Link href="/cuenta/login" className="hover:underline">Inicia sesión</Link>
            </>
          )}
        </div>
      </div>

      {/* Primary nav */}
      <nav className="primary-nav flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-display text-2xl tracking-tight leading-none uppercase select-none">
            ECOMMERCE by TECNOVANCE
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-ink)] hover:opacity-60 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:opacity-60 transition-opacity"
            aria-label="Buscar"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* Account */}
          <Link href={user ? '/cuenta' : '/cuenta/login'} className="p-2 hover:opacity-60 transition-opacity hidden md:block">
            <User size={20} strokeWidth={1.5} />
          </Link>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="p-2 hover:opacity-60 transition-opacity relative"
            aria-label="Carrito"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-ink)] text-[var(--color-canvas)] text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:opacity-60 transition-opacity md:hidden"
            aria-label="Menú"
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Search bar (expandable) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[var(--color-hairline-soft)]"
          >
            <form onSubmit={handleSearch} className="px-4 md:px-8 py-3 flex items-center gap-3">
              <Search size={16} className="text-[var(--color-mute)] flex-shrink-0" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="search-pill flex-1 text-sm"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-[var(--color-mute)] hover:text-[var(--color-ink)] font-medium"
              >
                Cancelar
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 top-[100px] z-40 bg-[var(--color-canvas)] md:hidden flex flex-col px-6 py-8 gap-6"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-display uppercase tracking-wide hover:opacity-60 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
            <hr className="divider" />
            {user ? (
              <Link href="/cuenta" onClick={() => setMenuOpen(false)} className="text-sm font-medium">
                Mi cuenta
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/cuenta/login" onClick={() => setMenuOpen(false)}>
                  <button className="btn-primary w-full">Iniciar sesión</button>
                </Link>
                <Link href="/cuenta/registro" onClick={() => setMenuOpen(false)}>
                  <button className="btn-secondary w-full">Crear cuenta</button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
