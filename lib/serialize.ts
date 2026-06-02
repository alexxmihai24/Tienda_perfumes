import type { Product } from '@prisma/client'

/**
 * Prisma devuelve `price` como Decimal, que no es serializable al cruzar la
 * frontera Server → Client Component. Convertimos a number antes de pasarlo.
 */
export type SerializedProduct = Omit<Product, 'price'> & { price: number }

export function serializeProduct(product: Product): SerializedProduct {
  return { ...product, price: Number(product.price) }
}

export function serializeProducts(products: Product[]): SerializedProduct[] {
  return products.map(serializeProduct)
}
