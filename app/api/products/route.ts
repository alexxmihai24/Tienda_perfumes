import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ data: products })
  } catch (error) {
    console.error('[GET /api/products]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
