import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

// GET /api/settings/global - Get global settings (public)
export async function GET() {
  try {
    const settings = await prisma.globalSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!settings) {
      return NextResponse.json({ error: 'Global settings not found' }, { status: 404 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings/global - Update global settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const updateSchema = z.object({
      siteName: z.string().optional(),
      siteTagline: z.string().optional(),
      siteDescription: z.string().optional(),
      logo: z.string().optional(),
      favicon: z.string().optional(),
      academicYear: z.string().optional(),
      currentYear: z.number().optional(),
      copyrightText: z.string().optional(),
      contactEmail: z.string().email().optional(),
      contactPhone: z.string().optional(),
      contactAddress: z.string().optional(),
      contactCity: z.string().optional(),
      contactState: z.string().optional(),
      contactZip: z.string().optional(),
      contactCountry: z.string().optional(),
      facebookUrl: z.string().url().optional(),
      twitterUrl: z.string().url().optional(),
      instagramUrl: z.string().url().optional(),
      linkedinUrl: z.string().url().optional(),
      youtubeUrl: z.string().url().optional(),
      maintenanceMode: z.boolean().optional(),
      maintenanceMessage: z.string().optional(),
      announcementBanner: z.string().optional(),
      announcementLink: z.string().optional(),
      showAnnouncement: z.boolean().optional(),
      defaultMetaTitle: z.string().optional(),
      defaultMetaDescription: z.string().optional(),
      defaultMetaKeywords: z.string().optional(),
      googleAnalyticsId: z.string().optional(),
    })

    const validatedData = updateSchema.parse(body)

    const settings = await prisma.globalSettings.upsert({
      where: { id: 'global-settings' },
      update: validatedData,
      create: {
        id: 'global-settings',
        ...validatedData,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating global settings:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
