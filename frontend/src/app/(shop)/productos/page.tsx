import Link from 'next/link'
import { productsApi, categoriesApi } from '@/lib/api'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product, Category } from '@/types'

interface Props {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}

async function getData(q?: string, category?: string, page?: string) {
  try {
    const [productsRes, categories] = await Promise.all([
      productsApi.list({ q, category, page: page ? parseInt(page) : 1 }),
      categoriesApi.list(),
    ])
    return {
      products: productsRes.results,
      total: productsRes.count,
      categories,
      next: productsRes.next,
      previous: productsRes.previous,
    }
  } catch {
    return { products: [], total: 0, categories: [], next: null, previous: null }
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const { products, total, categories, next, previous } = await getData(
    params.q,
    params.category,
    params.page,
  )
  const currentPage = params.page ? parseInt(params.page) : 1

  const buildUrl = (p: number) => {
    const sp = new URLSearchParams()
    if (params.q) sp.set('q', params.q)
    if (params.category) sp.set('category', params.category)
    sp.set('page', String(p))
    return `/productos?${sp.toString()}`
  }

  const isActiveCategory = (cat: Category) =>
    params.category?.toLowerCase() === cat.title.toLowerCase()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="heading-xl">
          {params.q
            ? `"${params.q}"`
            : params.category
            ? params.category
            : 'Todos los productos'}
        </h1>
        {total > 0 && (
          <p className="text-sm text-[var(--color-mute)] mt-1">
            {total} resultado{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <Link href={`/productos${params.q ? `?q=${params.q}` : ''}`}>
            <button className={`filter-chip ${!params.category ? 'active' : ''}`}>Todos</button>
          </Link>
          {categories.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/productos?category=${encodeURIComponent(cat.title)}${params.q ? `&q=${params.q}` : ''}`}
            >
              <button className={`filter-chip ${isActiveCategory(cat) ? 'active' : ''}`}>
                {cat.title}
              </button>
            </Link>
          ))}
        </div>
      )}

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product: Product, i: number) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="text-[var(--color-mute)]">
            {params.q ? `Sin resultados para "${params.q}"` : 'No hay productos disponibles.'}
          </p>
          <Link href="/productos">
            <button className="btn-secondary">Ver todos los productos</button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {(previous || next) && (
        <div className="flex items-center justify-center gap-3 mt-12">
          {previous && (
            <Link href={buildUrl(currentPage - 1)}>
              <button className="filter-chip">← Anterior</button>
            </Link>
          )}
          <span className="text-sm text-[var(--color-mute)] px-2">Página {currentPage}</span>
          {next && (
            <Link href={buildUrl(currentPage + 1)}>
              <button className="filter-chip">Siguiente →</button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
