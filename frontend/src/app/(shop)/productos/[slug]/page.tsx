import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { productsApi } from '@/lib/api'
import { AddToCartButton } from '@/components/product/AddToCartButton'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await productsApi.detail(slug)
    return { title: product.title, description: product.description }
  } catch {
    return { title: 'Producto no encontrado' }
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  let product
  try {
    product = await productsApi.detail(slug)
  } catch {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-mute)] mb-8">
        <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/productos" className="hover:text-[var(--color-ink)] transition-colors">Productos</Link>
        <span>/</span>
        <span className="text-[var(--color-ink)] truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image */}
        <div className="product-card-image relative" style={{ aspectRatio: '1/1' }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-stone)] bg-[var(--color-soft-cloud)]">
              <span className="text-6xl opacity-20">📦</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {product.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/productos?category=${encodeURIComponent(cat.title)}`}
                  className="text-xs font-semibold uppercase tracking-widest text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          )}

          <h1 className="heading-xl text-2xl md:text-3xl font-semibold leading-snug">
            {product.title}
          </h1>

          <p className="text-2xl font-semibold">
            ${parseFloat(product.price).toFixed(2)}
          </p>

          {product.description && (
            <p className="text-sm text-[var(--color-ash)] leading-relaxed">
              {product.description}
            </p>
          )}

          <AddToCartButton product={product} />

          <Link href="/productos" className="text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors underline underline-offset-2">
            ← Volver a productos
          </Link>
        </div>
      </div>
    </div>
  )
}
