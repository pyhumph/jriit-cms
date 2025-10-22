/**
 * Variable replacement utility for dynamic content
 * Replaces variables like {CURRENT_YEAR}, {SITE_NAME}, etc. in text content
 */

interface GlobalSettings {
  siteName?: string
  academicYear?: string
  currentYear?: number
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  facebookUrl?: string
  twitterUrl?: string
  instagramUrl?: string
  linkedinUrl?: string
  youtubeUrl?: string
}

/**
 * Replace variables in text content with actual values
 * @param content - Text content containing variables
 * @param settings - Global settings object
 * @returns Text with variables replaced
 */
export function replaceVariables(content: string, settings?: GlobalSettings): string {
  if (!content || !settings) return content

  let replacedContent = content

  // Replace current year
  if (settings.currentYear) {
    replacedContent = replacedContent.replace(/\{CURRENT_YEAR\}/g, settings.currentYear.toString())
  }

  // Replace academic year
  if (settings.academicYear) {
    replacedContent = replacedContent.replace(/\{ACADEMIC_YEAR\}/g, settings.academicYear)
  }

  // Replace site name
  if (settings.siteName) {
    replacedContent = replacedContent.replace(/\{SITE_NAME\}/g, settings.siteName)
  }

  // Replace contact information
  if (settings.contactEmail) {
    replacedContent = replacedContent.replace(/\{CONTACT_EMAIL\}/g, settings.contactEmail)
  }

  if (settings.contactPhone) {
    replacedContent = replacedContent.replace(/\{CONTACT_PHONE\}/g, settings.contactPhone)
  }

  if (settings.contactAddress) {
    replacedContent = replacedContent.replace(/\{CONTACT_ADDRESS\}/g, settings.contactAddress)
  }

  // Replace social media URLs
  if (settings.facebookUrl) {
    replacedContent = replacedContent.replace(/\{FACEBOOK_URL\}/g, settings.facebookUrl)
  }

  if (settings.twitterUrl) {
    replacedContent = replacedContent.replace(/\{TWITTER_URL\}/g, settings.twitterUrl)
  }

  if (settings.instagramUrl) {
    replacedContent = replacedContent.replace(/\{INSTAGRAM_URL\}/g, settings.instagramUrl)
  }

  if (settings.linkedinUrl) {
    replacedContent = replacedContent.replace(/\{LINKEDIN_URL\}/g, settings.linkedinUrl)
  }

  if (settings.youtubeUrl) {
    replacedContent = replacedContent.replace(/\{YOUTUBE_URL\}/g, settings.youtubeUrl)
  }

  return replacedContent
}

/**
 * Get current year
 * @returns Current year as number
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * Get academic year based on current date
 * @param currentYear - Current year (optional, defaults to current year)
 * @returns Academic year string (e.g., "2025-2026")
 */
export function getAcademicYear(currentYear?: number): string {
  const year = currentYear || getCurrentYear()
  const nextYear = year + 1
  return `${year}-${nextYear}`
}

/**
 * Process content with automatic year updates
 * @param content - Text content
 * @param settings - Global settings
 * @returns Processed content with all variables replaced
 */
export function processContent(content: string, settings?: GlobalSettings): string {
  // First, replace with provided settings
  let processedContent = replaceVariables(content, settings)

  // Then, ensure current year is always up to date
  const currentYear = getCurrentYear()
  processedContent = processedContent.replace(/\{CURRENT_YEAR\}/g, currentYear.toString())

  return processedContent
}

/**
 * Extract variables from content
 * @param content - Text content
 * @returns Array of unique variables found in content
 */
export function extractVariables(content: string): string[] {
  if (!content) return []

  const variableRegex = /\{([A-Z_]+)\}/g
  const variables: string[] = []
  let match

  while ((match = variableRegex.exec(content)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1])
    }
  }

  return variables
}

/**
 * Validate content for missing variables
 * @param content - Text content
 * @param settings - Global settings
 * @returns Object with validation results
 */
export function validateVariables(content: string, settings?: GlobalSettings): {
  isValid: boolean
  missingVariables: string[]
  warnings: string[]
} {
  const variables = extractVariables(content)
  const missingVariables: string[] = []
  const warnings: string[] = []

  for (const variable of variables) {
    switch (variable) {
      case 'CURRENT_YEAR':
        // Always available
        break
      case 'ACADEMIC_YEAR':
        if (!settings?.academicYear) {
          missingVariables.push(variable)
        }
        break
      case 'SITE_NAME':
        if (!settings?.siteName) {
          missingVariables.push(variable)
        }
        break
      case 'CONTACT_EMAIL':
        if (!settings?.contactEmail) {
          warnings.push(`Contact email not set - ${variable} will not be replaced`)
        }
        break
      case 'CONTACT_PHONE':
        if (!settings?.contactPhone) {
          warnings.push(`Contact phone not set - ${variable} will not be replaced`)
        }
        break
      default:
        warnings.push(`Unknown variable: ${variable}`)
    }
  }

  return {
    isValid: missingVariables.length === 0,
    missingVariables,
    warnings,
  }
}
