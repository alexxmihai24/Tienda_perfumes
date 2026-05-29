import { z } from 'zod'

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(10),
      })
    )
    .min(1)
    .max(20),
})

export const productSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).min(1).max(5),
  notesTop: z.array(z.string()).min(1).max(5),
  notesHeart: z.array(z.string()).min(1).max(5),
  notesBase: z.array(z.string()).min(1).max(5),
  collection: z.string().optional(),
  featured: z.boolean().default(false),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductInput = z.infer<typeof productSchema>
