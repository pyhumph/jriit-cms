'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import ImagePicker from '@/components/ImagePicker'

type DetailLayout =
  | 'standard'
  | 'custom-applications'
  | 'custom-adobe'
  | 'cyber-security'
  | 'business-administration'
  | 'travel-tourism'
  | 'short-course'

interface Department {
  id: string
  name: string
  slug: string
}

const COURSE_CATEGORIES = [
  'Information Technology',
  'Cyber Security',
  'Computer Science',
  'Computer Engineering',
  'Electronics & Telecommunications',
  'Business Administration',
  'Accountancy',
  'Travel & Tourism Management',
  'Short Courses',
  'Professional Courses',
]

const LAYOUT_OPTIONS = [
  { value: 'standard', label: 'Information Technology Layout' },
  { value: 'custom-applications', label: 'Custom Applications (MS Office)' },
  { value: 'custom-adobe', label: 'Custom Adobe' },
  { value: 'cyber-security', label: 'Cyber Security Layout' },
  { value: 'business-administration', label: 'Business Administration Layout' },
  { value: 'travel-tourism', label: 'Travel & Tourism Layout' },
  { value: 'short-course', label: 'Short Course Layout' },
]

// Mapping from Course Category to default Layout
const CATEGORY_TO_LAYOUT_MAP: Record<string, DetailLayout> = {
  'Information Technology': 'standard',
  'Cyber Security': 'cyber-security',
  'Computer Science': 'standard',
  'Computer Engineering': 'standard',
  'Electronics & Telecommunications': 'standard',
  'Business Administration': 'business-administration',
  'Accountancy': 'standard',
  'Travel & Tourism Management': 'travel-tourism',
  'Short Courses': 'short-course',
  'Professional Courses': 'standard', // Will be handled separately
}

export default function CreateProgramPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'detail'>('basic')

  // Basic form data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    duration: '',
    degree: '',
    departmentId: '',
    courseCategory: '',
    requirements: '',
    curriculum: '',
    careerOpportunities: '',
    featuredImage: '',
    isActive: true,
    isFeatured: false,
    order: 0,
  })

  // Detail page data
  const [detailPageData, setDetailPageData] = useState({
    detailPageLayout: '' as DetailLayout | '',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    overviewTitle: 'Program Overview',
    overviewContent: '',
    learningTitle: 'What You Will Learn',
    learningItems: '',
    modulesTitle: 'Course Modules',
    modules: '',
    detailsDuration: '',
    detailsFormat: '',
    detailsSchedule: '',
    detailsPrerequisites: '',
    careerTitle: 'Career Opportunities',
    careerOpportunities: '',
    ctaTitle: 'Ready to Start?',
    ctaDescription: '',
    // Professional Course fields
    level: '',
    keyCertifications: '',
    externalLink: '',
  })

  const isProfessionalCourse = formData.courseCategory === 'Professional Courses'
  const isBusinessLayout = detailPageData.detailPageLayout === 'business-administration'
  const isTravelTourismLayout = detailPageData.detailPageLayout === 'travel-tourism'
  const isShortCourseLayout = detailPageData.detailPageLayout === 'short-course'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      fetchDepartments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }))
  }

  const handleCourseCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      courseCategory: category,
    }))
    
    // Find department by name
    const dept = departments.find(d => d.name === category)
    if (dept) {
      setFormData(prev => ({
        ...prev,
        departmentId: dept.id,
      }))
    }

    // Auto-set layout based on category
    const defaultLayout = CATEGORY_TO_LAYOUT_MAP[category]
    if (defaultLayout) {
      setDetailPageData(prev => ({
        ...prev,
        detailPageLayout: defaultLayout,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      setStatusMessage({ type: 'error', message: 'Name and slug are required' })
      return
    }

    if (!formData.departmentId && !formData.courseCategory) {
      setStatusMessage({ type: 'error', message: 'Please select a course category' })
      return
    }

    try {
      setSaving(true)
      setStatusMessage({ type: 'info', message: 'Creating program...' })

      // Build payload
      const payload: Record<string, unknown> = {
        ...formData,
        departmentId: formData.departmentId || undefined,
      }

      // Professional Courses: Add specific fields
      if (isProfessionalCourse) {
        payload.level = detailPageData.level || null
        payload.externalLink = detailPageData.externalLink || null
        
        // Parse keyCertifications from textarea
        const keyCerts = detailPageData.keyCertifications
          ?.split('\n')
          .map(cert => cert.trim())
          .filter(cert => cert.length > 0) || []
        payload.keyCertifications = keyCerts.length > 0 ? JSON.stringify(keyCerts) : null
        
        // Clear detail page content for Professional Courses
        payload.detailPageLayout = null
      } else {
        // Add detail page fields for non-Professional Courses
        payload.detailPageLayout = detailPageData.detailPageLayout || null
        payload.heroTitle = detailPageData.heroTitle || null
        payload.heroSubtitle = detailPageData.heroSubtitle || null
        payload.heroImage = detailPageData.heroImage || null
        payload.overviewTitle = detailPageData.overviewTitle || null
        payload.overviewContent = detailPageData.overviewContent || null
        payload.learningTitle = detailPageData.learningTitle || null
        
        // Parse/convert modules field
        if (detailPageData.modules) {
          // Try to parse as JSON first
          try {
            const parsed = JSON.parse(detailPageData.modules)
            payload.modules = Array.isArray(parsed) ? JSON.stringify(parsed) : null
          } catch {
            // If not JSON, treat as line-separated text and convert to JSON array
            const modulesList = detailPageData.modules
              .split('\n')
              .map(m => m.trim())
              .filter(m => m.length > 0)
            payload.modules = modulesList.length > 0 ? JSON.stringify(modulesList) : null
          }
        } else {
          payload.modules = null
        }
        
        // Parse learningItems
        if (detailPageData.learningItems) {
          try {
            const parsed = JSON.parse(detailPageData.learningItems)
            payload.learningItems = JSON.stringify(parsed)
          } catch {
            payload.learningItems = null
          }
        } else {
          payload.learningItems = null
        }
        
        payload.modulesTitle = detailPageData.modulesTitle || null
        payload.detailsDuration = detailPageData.detailsDuration || null
        payload.detailsFormat = detailPageData.detailsFormat || null
        payload.detailsSchedule = detailPageData.detailsSchedule || null
        payload.detailsPrerequisites = detailPageData.detailsPrerequisites || null
        payload.careerTitle = detailPageData.careerTitle || null
        
        // Parse careerOpportunities
        if (detailPageData.careerOpportunities) {
          try {
            const parsed = JSON.parse(detailPageData.careerOpportunities)
            payload.careerOpportunities = JSON.stringify(parsed)
          } catch {
            payload.careerOpportunities = null
          }
        } else {
          payload.careerOpportunities = null
        }
        
        payload.ctaTitle = detailPageData.ctaTitle || null
        payload.ctaDescription = detailPageData.ctaDescription || null
      }

      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setStatusMessage({ type: 'success', message: 'Program created successfully!' })
        setTimeout(() => {
          router.push('/dashboard/programs')
        }, 1500)
      } else {
        const error = await response.json()
        setStatusMessage({ type: 'error', message: error.error || 'Failed to create program' })
      }
    } catch (error) {
      console.error('Error creating program:', error)
      setStatusMessage({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Program</h1>
            <p className="mt-1 text-gray-600">Add a new academic program</p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`rounded-xl p-4 ${
            statusMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : statusMessage.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <p>{statusMessage.message}</p>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Information
            </button>
            {!isProfessionalCourse && (
              <button
                type="button"
                onClick={() => setActiveTab('detail')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'detail'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Detail Page Content
              </button>
            )}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Computer Hardware"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., computer-hardware"
                  />
                  <p className="mt-1 text-xs text-gray-500">URL-friendly identifier (auto-generated from name)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.courseCategory}
                    onChange={(e) => handleCourseCategoryChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a course category</option>
                    {COURSE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description for program cards..."
                  />
                </div>

                {/* Program Card Image - For non-Professional Courses */}
                {!isProfessionalCourse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Card Image
                    </label>
                    <ImagePicker
                      value={formData.featuredImage}
                      onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                      label="Select Program Card Image"
                    />
                    {formData.featuredImage && (
                      <div className="mt-2">
                        <img 
                          src={formData.featuredImage} 
                          alt="Program card preview" 
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Settings</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              {/* Professional Course Specific Fields */}
              {isProfessionalCourse && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Professional Course Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 3-6 months"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <input
                      type="text"
                      value={detailPageData.level}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, level: e.target.value }))}
                      placeholder="e.g., Beginner to Advanced"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">External Link (Learn More URL)</label>
                    <input
                      type="url"
                      value={detailPageData.externalLink}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, externalLink: e.target.value }))}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Image
                    </label>
                    <ImagePicker
                      value={formData.featuredImage}
                      onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                      label="Select Program Image"
                    />
                    {formData.featuredImage && (
                      <div className="mt-2">
                        <img 
                          src={formData.featuredImage} 
                          alt="Program preview" 
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Certifications <span className="text-xs text-gray-500">(one per line)</span>
                    </label>
                    <textarea
                      value={detailPageData.keyCertifications}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, keyCertifications: e.target.value }))}
                      rows={6}
                      placeholder="A+ Certification for IT Fundamentals&#10;Network+ for Networking Skills&#10;Security+ for Cybersecurity"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter each certification on a new line. These will appear as bullet points on the frontend.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detail Page Content Tab */}
          {activeTab === 'detail' && !isProfessionalCourse && (
            <div className="space-y-6">
              {/* Layout Selector */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Layout Configuration</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Layout <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={detailPageData.detailPageLayout}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, detailPageLayout: e.target.value as DetailLayout }))}
                    required={!isProfessionalCourse}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a page layout</option>
                    {LAYOUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Layout is auto-selected based on Course Category. You can change it if needed.
                  </p>
                </div>
              </div>

              {/* Hero Section */}
              {detailPageData.detailPageLayout && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={detailPageData.heroTitle}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Master Computer Hardware"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                    <input
                      type="text"
                      value={detailPageData.heroSubtitle}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Learn to build, repair, and maintain computer systems"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                    <ImagePicker
                      value={detailPageData.heroImage}
                      onChange={(url) => setDetailPageData(prev => ({ ...prev, heroImage: url }))}
                      label="Select Hero Image"
                    />
                    {detailPageData.heroImage && (
                      <div className="mt-2">
                        <img 
                          src={detailPageData.heroImage} 
                          alt="Hero preview" 
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Overview Section */}
              {detailPageData.detailPageLayout && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Overview Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overview Title</label>
                    <input
                      type="text"
                      value={detailPageData.overviewTitle}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, overviewTitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overview Content</label>
                    <textarea
                      value={detailPageData.overviewContent}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, overviewContent: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed program overview..."
                    />
                  </div>
                </div>
              )}

              {/* Course Modules */}
              {detailPageData.detailPageLayout && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Course Modules</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modules Title</label>
                    <input
                      type="text"
                      value={detailPageData.modulesTitle}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, modulesTitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modules <span className="text-xs text-gray-500">(JSON array or one per line)</span>
                    </label>
                    <textarea
                      value={detailPageData.modules}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, modules: e.target.value }))}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      placeholder='["Module 1: Introduction", "Module 2: Advanced Topics", "Module 3: Practical Skills"]'
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter as JSON array: ["Module 1", "Module 2", ...]
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Section */}
              {detailPageData.detailPageLayout && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Call-to-Action Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
                    <input
                      type="text"
                      value={detailPageData.ctaTitle}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, ctaTitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
                    <textarea
                      value={detailPageData.ctaDescription}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, ctaDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Create Program
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
