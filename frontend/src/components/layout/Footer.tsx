import Link from 'next/link'

const LINKS = {
  Tienda: [
    { label: 'Novedades', href: '/productos?q=new' },
    { label: 'Todos los productos', href: '/productos' },
    { label: 'Categorías', href: '/categorias' },
  ],
  Cuenta: [
    { label: 'Inicia sesión', href: '/cuenta/login' },
    { label: 'Regístrate', href: '/cuenta/registro' },
    { label: 'Mis pedidos', href: '/cuenta/ordenes' },
  ],
  Ayuda: [
    { label: 'Envíos', href: '/ayuda/envios' },
    { label: 'Devoluciones', href: '/ayuda/devoluciones' },
    { label: 'Contacto', href: '/contacto' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-canvas)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl uppercase tracking-tight">ECOMMERCE by TECNOVANCE</span>
          <p className="text-xs text-[var(--color-stone)] mt-3 leading-relaxed max-w-[200px]">
            Productos de calidad, directo a tu puerta.
          </p>
        </div>

        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-stone)] mb-3">
              {section}
            </h3>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-hairline)] hover:text-[var(--color-canvas)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-charcoal)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[var(--color-stone)]">
          <p>© {new Date().getFullYear()} ECOMMERCE by TECNOVANCE. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-[var(--color-canvas)] transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-[var(--color-canvas)] transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
