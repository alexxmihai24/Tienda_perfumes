
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Ambre Noir',
    slug: 'ambre-noir',
    description:
      'Oud de Laos, ambar gris y sandalo de Mysore. Una composicion que evoluciona sobre la piel durante 12 horas.',
    price: 189,
    stock: 50,
    images: ['/products/ambre-noir.jpg'],
    notesTop: ['Bergamota', 'Cardamomo'],
    notesHeart: ['Oud de Laos', 'Rosa de Damasco'],
    notesBase: ['Ambar Gris', 'Sandalo de Mysore', 'Benjui'],
    collection: 'Noir',
    featured: true,
    active: true,
  },
  {
    name: 'Santal Mystique',
    slug: 'santal-mystique',
    description:
      'Sandalo de Mysore, cedro del Atlas y vainilla Bourbon. Envolvente y sensorial.',
    price: 145,
    stock: 80,
    images: ['/products/santal-mystique.jpg'],
    notesTop: ['Pera', 'Azafran'],
    notesHeart: ['Sandalo de Mysore', 'Cedro del Atlas'],
    notesBase: ['Vainilla Bourbon', 'Almizcle Blanco'],
    collection: 'Essence',
    featured: true,
    active: true,
  },
  {
    name: 'Oud Imperial',
    slug: 'oud-imperial',
    description:
      'Oud cultivado, rosa de Taif y nagarmotha. La firma de los grandes ateliers.',
    price: 220,
    stock: 30,
    images: ['/products/oud-imperial.jpg'],
    notesTop: ['Pimienta Rosa', 'Incienso'],
    notesHeart: ['Rosa de Taif', 'Oud Cultivado'],
    notesBase: ['Nagarmotha', 'Pachuli', 'Vetiver'],
    collection: 'Noir',
    featured: true,
    active: true,
  },
  {
    name: "Fleur d'Azahar",
    slug: 'fleur-azahar',
    description:
      'Azahar de Sevilla, neroli y musgo de roble. Fresco, floral y atemporal.',
    price: 125,
    stock: 60,
    images: ['/products/fleur-azahar.jpg'],
    notesTop: ['Azahar', 'Neroli', 'Bergamota'],
    notesHeart: ['Jazmin', 'Ylang-Ylang'],
    notesBase: ['Musgo de Roble', 'Cedro', 'Almizcle'],
    collection: 'Lumiere',
    featured: false,
    active: true,
  },
  {
    name: 'Rose Absolue',
    slug: 'rose-absolue',
    description:
      'Rosa de mayo absoluta, canela de Ceilan y ambar calido. Romantico y atemporal.',
    price: 165,
    stock: 45,
    images: ['/products/rose-absolue.jpg'],
    notesTop: ['Grosella Negra', 'Pera'],
    notesHeart: ['Rosa de Mayo', 'Canela de Ceilan'],
    notesBase: ['Ambar', 'Pachuli', 'Vainilla'],
    collection: 'Lumiere',
    featured: false,
    active: true,
  },
  {
    name: 'Vetiver Obscur',
    slug: 'vetiver-obscur',
    description:
      'Vetiver de Haiti, bergamota y madera de ebano. Para quienes buscan la profundidad.',
    price: 155,
    stock: 35,
    images: ['/products/vetiver-obscur.jpg'],
    notesTop: ['Bergamota', 'Limon'],
    notesHeart: ['Vetiver de Haiti', 'Iris'],
    notesBase: ['Madera de Ebano', 'Oud', 'Almizcle Gris'],
    collection: 'Noir',
    featured: false,
    active: true,
  },
]

async function main() {
  console.log('Seeding Azahara...')
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      // Update all mutable fields so re-seeding syncs existing rows
      // (e.g. migrating image URLs from Unsplash to local /products paths).
      update: p,
      create: p,
    })
  }
  console.log('Seed complete — 6 products created')
}

main().finally(() => prisma.$disconnect())
