import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const normalizePublishedAt = (value: unknown): Date | null | undefined => {
  if (value === null) return null
  if (value === undefined) return undefined
  const date = new Date(value as string)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const coerceBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined) return undefined
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase()
    if (lower === 'true') return true
    if (lower === 'false') return false
  }
  if (typeof value === 'number') {
    return value !== 0
  }
  return undefined
}

const coerceNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

const findPageByIdentifier = async (identifier: string) => {
  const bySlug = await prisma.page.findUnique({ where: { slug: identifier } })
  if (bySlug) return bySlug
  return prisma.page.findUnique({ where: { id: identifier } })
}

export async function GET(_: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    const page = await findPageByIdentifier(params.identifier)

    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, page })
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch page' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      slug,
      title,
      content,
      excerpt,
      featuredImage,
      template,
      metaTitle,
      metaDescription,
      metaKeywords,
      published,
      publishedAt,
      isHomepage,
      showInMenu,
      order,
      parentId,
      viewCount
    } = body as Record<string, unknown>

    if (slug !== undefined && (!slug || typeof slug !== 'string')) {
      return NextResponse.json({ error: 'Slug must be a non-empty string' }, { status: 400 })
    }

    if (title !== undefined && (!title || typeof title !== 'string')) {
      return NextResponse.json({ error: 'Title must be a non-empty string' }, { status: 400 })
    }

    if (content !== undefined && typeof content !== 'string') {
      return NextResponse.json({ error: 'Content must be a string' }, { status: 400 })
    }

    const publishedFlag = coerceBoolean(published)
    const isHomepageFlag = coerceBoolean(isHomepage)
    const showInMenuFlag = coerceBoolean(showInMenu)
    const orderValue = coerceNumber(order)
    const viewCountValue = coerceNumber(viewCount)
    const publishedAtValue = normalizePublishedAt(publishedAt)

    const data: Prisma.PageUncheckedUpdateInput = {
      ...(slug !== undefined ? { slug: slug as string } : {}),
      ...(title !== undefined ? { title: title as string } : {}),
      ...(content !== undefined ? { content: content as string } : {}),
      ...(excerpt !== undefined ? { excerpt: excerpt as string | null } : {}),
      ...(featuredImage !== undefined ? { featuredImage: featuredImage as string | null } : {}),
      ...(template !== undefined ? { template: template as string | null } : {}),
      ...(metaTitle !== undefined ? { metaTitle: metaTitle as string | null } : {}),
      ...(metaDescription !== undefined ? { metaDescription: metaDescription as string | null } : {}),
      ...(metaKeywords !== undefined ? { metaKeywords: metaKeywords as string | null } : {}),
      ...(publishedFlag !== undefined ? { published: publishedFlag } : {}),
      ...(isHomepageFlag !== undefined ? { isHomepage: isHomepageFlag } : {}),
      ...(showInMenuFlag !== undefined ? { showInMenu: showInMenuFlag } : {}),
      ...(orderValue !== undefined ? { order: orderValue } : {}),
      ...(parentId !== undefined ? { parentId: (parentId as string) || null } : {}),
      ...(viewCountValue !== undefined ? { viewCount: viewCountValue } : {}),
      ...(publishedAt !== undefined ? { publishedAt: publishedAtValue ?? null } : {})
    }

    const page = await prisma.page.update({
      where: { id: params.identifier },
      data
    })

    return NextResponse.json({ success: true, page })
  } catch (error: unknown) {
    const prismaError = typeof error === 'object' && error !== null && 'code' in error ? (error as { code?: string }) : null

    if (prismaError?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }
    if (prismaError?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    }

    console.error('Error updating page:', error)
    return NextResponse.json({ success: false, error: 'Failed to update page' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.page.delete({ where: { id: params.identifier } })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const prismaError = typeof error === 'object' && error !== null && 'code' in error ? (error as { code?: string }) : null

    if (prismaError?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    console.error('Error deleting page:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete page' }, { status: 500 })
  }
}
