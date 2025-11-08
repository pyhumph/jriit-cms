import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const DEFAULT_PAGE_LIMIT = 50
const MAX_PAGE_LIMIT = 100
const ORDERABLE_FIELDS = ['updatedAt', 'createdAt', 'order', 'title'] as const

type OrderableField = (typeof ORDERABLE_FIELDS)[number]

type ParsedBoolean = boolean | undefined

const coerceBoolean = (value: unknown): ParsedBoolean => {
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

const parseDateInput = (value: unknown): Date | null | undefined => {
  if (value === undefined) return undefined
  if (value === null) return null
  const date = new Date(value as string)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const parseBoolean = (value: string | null): ParsedBoolean => {
  if (value === null) return undefined
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false
  return undefined
}

const parseNumber = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const published = parseBoolean(searchParams.get('published'))
    const isHomepage = parseBoolean(searchParams.get('isHomepage'))
    const showInMenu = parseBoolean(searchParams.get('showInMenu'))
    const authorId = searchParams.get('authorId') || undefined
    const parentId = searchParams.get('parentId') || undefined
    const slug = searchParams.get('slug') || undefined
    const searchQuery = searchParams.get('search') || undefined

    const takeParam = parseNumber(searchParams.get('take'), DEFAULT_PAGE_LIMIT)
    const limitParam = parseNumber(searchParams.get('limit'), takeParam)
    const effectiveTakeParam = searchParams.get('limit') ? (limitParam ?? takeParam) : takeParam
    const take = Math.min(Math.max(effectiveTakeParam ?? DEFAULT_PAGE_LIMIT, 1), MAX_PAGE_LIMIT)
    const skip = Math.max(parseNumber(searchParams.get('skip'), 0), 0)

    const orderFieldParam = searchParams.get('orderBy') as OrderableField | null
    const orderField: OrderableField = ORDERABLE_FIELDS.includes(orderFieldParam ?? 'updatedAt')
      ? (orderFieldParam as OrderableField)
      : 'updatedAt'
    const orderDirection = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
    const orderBy = { [orderField]: orderDirection } as Prisma.PageOrderByWithRelationInput

    const where: Prisma.PageWhereInput = {
      ...(published !== undefined ? { published } : {}),
      ...(isHomepage !== undefined ? { isHomepage } : {}),
      ...(showInMenu !== undefined ? { showInMenu } : {}),
      ...(authorId ? { authorId } : {}),
      ...(parentId ? { parentId } : {}),
      ...(slug ? { slug } : {})
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery } },
        { slug: { contains: searchQuery } }
      ]
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.page.count({ where })
    ])

    return NextResponse.json({ success: true, pages, total })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pages'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
      published: rawPublished,
      publishedAt,
      isHomepage: rawIsHomepage,
      showInMenu: rawShowInMenu,
      order: rawOrder,
      parentId,
      viewCount: rawViewCount
    } = body

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const publishedFlag = coerceBoolean(rawPublished)
    const isHomepageFlag = coerceBoolean(rawIsHomepage)
    const showInMenuFlag = coerceBoolean(rawShowInMenu)
    const orderValue = coerceNumber(rawOrder) ?? 0
    const viewCountValue = coerceNumber(rawViewCount)
    const publishDate = parseDateInput(publishedAt)

    const parentIdValue = typeof parentId === 'string' && parentId.trim().length > 0 ? parentId : null

    const pageData: Prisma.PageUncheckedCreateInput = {
      slug,
      title,
      content,
      excerpt,
      featuredImage,
      template,
      metaTitle,
      metaDescription,
      metaKeywords,
      published: publishedFlag ?? false,
      publishedAt: publishDate ?? (publishedFlag ? new Date() : null),
      authorId: session.user.id,
      isHomepage: isHomepageFlag ?? false,
      showInMenu: showInMenuFlag ?? true,
      order: orderValue,
      viewCount: viewCountValue,
      parentId: parentIdValue ?? undefined
    }

    const page = await prisma.page.create({
      data: pageData
    })

    return NextResponse.json({ success: true, page }, { status: 201 })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    }

    console.error('Error creating page:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create page'
    }, { status: 500 })
  }
}
