import Link from 'next/link'
import { categoriesApi } from '@/lib/api'
import type { Category } from '@/types'

export const dynamic = 'force-dynamic'

async function getCategories(): Promise<Category[]> {
  try {
    return await categoriesApi.list()
  } catch {
    return []
  }
}

export default async function CategoriasPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-mute)] mb-2">
          Explorar
        </p>
        <h1 className="display-campaign text-[var(--color-ink)]" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
          Categorías
        </h1>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[var(--color-hairline-soft)]">
          {categories.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/productos?category=${encodeURIComponent(cat.title)}`}
              className="group block"
            >
              <div
                className="bg-[var(--color-soft-cloud)] min-h-[220px] p-8 flex flex-col justify-between transition-colors duration-300 group-hover:bg-[var(--color-ink)]"
              >
                <div>
                  {cat.product_count !== undefined && (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-stone)] group-hover:text-[var(--color-stone)] mb-4">
                      {cat.product_count} producto{cat.product_count !== 1 ? 's' : ''}
                    </p>
                  )}
                  <h2
                    className="font-display uppercase leading-none text-[var(--color-ink)] group-hover:text-[var(--color-canvas)] transition-colors duration-300"
                    style={{ fontSize: 'clamp(32px, 3.5vw, 44px)' }}
                  >
                    {cat.title}
                  </h2>
                  <p className="text-sm text-[var(--color-ash)] group-hover:text-[var(--color-stone)] mt-3 leading-relaxed transition-colors duration-300 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] group-hover:text-[var(--color-canvas)] transition-colors duration-300">
                    Ver productos
                  </span>
                  <span
                    className="text-[var(--color-ink)] group-hover:text-[var(--color-canvas)] transition-all duration-300 group-hover:translate-x-1 inline-block text-lg"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="text-[var(--color-mute)]">No hay categorías disponibles.</p>
          <Link href="/productos">
            <button className="btn-secondary">Ver todos los productos</button>
          </Link>
        </div>
      )}
    </div>
  )
}
