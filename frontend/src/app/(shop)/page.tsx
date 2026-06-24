import Link from 'next/link'
import { productsApi, categoriesApi } from '@/lib/api'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product, Category } from '@/types'

async function getHomeData() {
  try {
    const [productsRes, categories] = await Promise.all([
      productsApi.list({ page: 1 }),
      categoriesApi.list(),
    ])
    return { products: productsRes.results, categories }
  } catch {
    return { products: [], categories: [] }
  }
}

export default async function HomePage() {
  const { products, categories } = await getHomeData()
  const featured = products.slice(0, 4)
  const rest = products.slice(4, 12)

  return (
    <>
      {/* Hero — campaign tile */}
      <section className="relative bg-[var(--color-soft-cloud)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 flex flex-col gap-6" style={{ maxWidth: 600 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-mute)]">
            Colección 2025
          </p>
          <h1 className="display-campaign text-[var(--color-ink)]">
            Todo lo que<br />necesitas,<br />aquí.
          </h1>
          <p className="text-base text-[var(--color-ash)] max-w-[380px]">
            Descubre nuestra selección de productos premium. Calidad sin compromisos.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/productos">
              <button className="btn-primary">Ver colección</button>
            </Link>
            <Link href="/categorias">
              <button className="btn-secondary">Categorías</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category pills */}
      {categories.length > 0 && (
        <section className="py-8 border-b border-[var(--color-hairline-soft)]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Link href="/productos">
                <button className="filter-chip active whitespace-nowrap">Todos</button>
              </Link>
              {categories.map((cat: Category) => (
                <Link key={cat.id} href={`/productos?category=${encodeURIComponent(cat.title)}`}>
                  <button className="filter-chip whitespace-nowrap">{cat.title}</button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-6">
              <h2 className="heading-xl">Destacados</h2>
              <Link href="/productos" className="text-sm font-medium underline underline-offset-2 hover:opacity-60 transition-opacity">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product: Product, i: number) => (
                <ProductCard key={product.id} product={product} priority={i < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand strip */}
      <section className="bg-[var(--color-ink)] text-[var(--color-canvas)] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="display-campaign" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
            Envío gratis<br />en tu primera compra.
          </h2>
          <Link href="/cuenta/registro">
            <button className="text-sm font-medium border border-[var(--color-canvas)] text-[var(--color-canvas)] rounded-[var(--radius-lg)] px-8 py-4 hover:bg-[var(--color-canvas)] hover:text-[var(--color-ink)] transition-colors">
              Crear cuenta gratis
            </button>
          </Link>
        </div>
      </section>

      {/* More products */}
      {rest.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="heading-xl mb-6">Más productos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {rest.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {products.length === 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center gap-4 text-center">
            <p className="text-[var(--color-mute)]">Pronto habrá productos disponibles.</p>
            <Link href="/cuenta/login">
              <button className="btn-secondary">Iniciar sesión</button>
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
