'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import ImagePicker from '@/components/ImagePicker'

interface Department {
  id: string
  name: string
  slug: string
}

interface LearningItem {
  icon: string
  title: string
  description: string
}

interface Program {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  duration: string | null
  degree: string | null
  departmentId: string | null
  requirements: string | null
  curriculum: string | null
  careerOpportunities: string | null
  featuredImage: string | null
  isActive: boolean
  isFeatured: boolean
  order: number
  department: {
    id: string
    name: string
  } | null
  // Detail page fields
  detailPageLayout?: string | null
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImage?: string | null
  overviewTitle?: string | null
  overviewContent?: string | null
  learningTitle?: string | null
  learningItems?: string | null
  modulesTitle?: string | null
  modules?: string | null
  detailsDuration?: string | null
  detailsFormat?: string | null
  detailsSchedule?: string | null
  detailsPrerequisites?: string | null
  careerTitle?: string | null
  careerOpportunitiesJson?: string | null
  ctaTitle?: string | null
  ctaDescription?: string | null
  customContent?: string | null
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
  { value: 'standard', label: 'Standard Layout' },
  { value: 'custom-applications', label: 'Custom Applications (MS Office)' },
  { value: 'custom-adobe', label: 'Custom Adobe' },
]

export default function EditProgramPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const programId = params.id as string

  const [activeTab, setActiveTab] = useState<'basic' | 'detail'>('basic')
  const [departments, setDepartments] = useState<Department[]>([])
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

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

  // Detail page content state
  const [detailPageData, setDetailPageData] = useState({
    detailPageLayout: 'standard' as 'standard' | 'custom-applications' | 'custom-adobe',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    overviewTitle: 'Program Overview',
    overviewContent: '',
    learningTitle: "What You'll Learn",
    learningItems: [] as LearningItem[],
    modulesTitle: 'Course Modules',
    modules: [] as string[],
    detailsDuration: '',
    detailsFormat: '',
    detailsSchedule: '',
    detailsPrerequisites: '',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [] as string[],
    ctaTitle: 'Ready to Start?',
    ctaDescription: '',
    customContent: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session && programId) {
      fetchProgram()
      fetchDepartments()
    }
  }, [session, status, router, programId])

  // Debug: Log when detailPageData changes
  useEffect(() => {
    console.log('Dashboard: detailPageData state changed:', {
      detailPageLayout: detailPageData.detailPageLayout,
      heroTitle: detailPageData.heroTitle ? `"${detailPageData.heroTitle.substring(0, 30)}..."` : 'EMPTY',
      overviewContent: detailPageData.overviewContent ? `HAS_CONTENT (${detailPageData.overviewContent.length} chars)` : 'EMPTY',
      learningItemsCount: detailPageData.learningItems.length,
      modulesCount: detailPageData.modules.length,
      careerOpportunitiesCount: detailPageData.careerOpportunities.length,
    })
  }, [detailPageData])

  const fetchProgram = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/programs/${programId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.program) {
          const prog = data.program
          
          // Debug: Log what we received
          console.log('Dashboard: Program fetched from API')
          console.log('  slug:', prog.slug)
          console.log('  detailPageLayout:', prog.detailPageLayout)
          console.log('  heroTitle:', prog.heroTitle ? `"${prog.heroTitle.substring(0, 50)}..."` : 'NULL')
          console.log('  overviewContent:', prog.overviewContent ? `HAS_CONTENT (${prog.overviewContent.length} chars)` : 'NULL')
          console.log('  learningItems:', prog.learningItems ? 'HAS_CONTENT' : 'NULL')
          console.log('  modules:', prog.modules ? 'HAS_CONTENT' : 'NULL')
          console.log('  customContent:', prog.customContent ? 'HAS_CONTENT' : 'NULL')
          
          setProgram(prog)
          
          // Basic form data
          setFormData({
            name: prog.name || '',
            slug: prog.slug || '',
            shortDescription: prog.shortDescription || '',
            description: prog.description || '',
            duration: prog.duration || '',
            degree: prog.degree || '',
            departmentId: prog.departmentId || '',
            courseCategory: prog.department?.name || '',
            requirements: prog.requirements || '',
            curriculum: prog.curriculum || '',
            careerOpportunities: prog.careerOpportunities || '',
            featuredImage: prog.featuredImage || '',
            isActive: prog.isActive ?? true,
            isFeatured: prog.isFeatured ?? false,
            order: prog.order || 0,
          })

          // Detail page data - Parse JSON fields and populate form
          try {
            const learningItems = prog.learningItems ? JSON.parse(prog.learningItems) : []
            const modules = prog.modules ? JSON.parse(prog.modules) : []
            const careerOpportunities = prog.careerOpportunitiesJson ? JSON.parse(prog.careerOpportunitiesJson) : []
            
            const detailData = {
              detailPageLayout: (prog.detailPageLayout as any) || 'standard',
              heroTitle: prog.heroTitle || '',
              heroSubtitle: prog.heroSubtitle || '',
              heroImage: prog.heroImage || '',
              overviewTitle: prog.overviewTitle || 'Program Overview',
              overviewContent: prog.overviewContent || '',
              learningTitle: prog.learningTitle || "What You'll Learn",
              learningItems: Array.isArray(learningItems) ? learningItems : [],
              modulesTitle: prog.modulesTitle || 'Course Modules',
              modules: Array.isArray(modules) ? modules : [],
              detailsDuration: prog.detailsDuration || '',
              detailsFormat: prog.detailsFormat || '',
              detailsSchedule: prog.detailsSchedule || '',
              detailsPrerequisites: prog.detailsPrerequisites || '',
              careerTitle: prog.careerTitle || 'Career Opportunities',
              careerOpportunities: Array.isArray(careerOpportunities) ? careerOpportunities : [],
              ctaTitle: prog.ctaTitle || 'Ready to Start?',
              ctaDescription: prog.ctaDescription || '',
              customContent: prog.customContent || '',
            }
            
            console.log('Dashboard: Setting detail page data:', {
              detailPageLayout: detailData.detailPageLayout,
              heroTitle: detailData.heroTitle ? `"${detailData.heroTitle.substring(0, 30)}..."` : 'EMPTY',
              learningItemsCount: detailData.learningItems.length,
              modulesCount: detailData.modules.length,
            })
            
            setDetailPageData(detailData)
          } catch (e) {
            console.error('Error parsing detail page JSON:', e)
            console.error('Raw learningItems:', prog.learningItems)
            console.error('Raw modules:', prog.modules)
          }
        } else {
          console.error('API response missing program:', data)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error:', response.status, errorData)
        setStatusMessage({ type: 'error', message: `Failed to load program: ${errorData.error || response.statusText}` })
      }
    } catch (error) {
      console.error('Error fetching program:', error)
      setStatusMessage({ type: 'error', message: 'Failed to load program' })
    } finally {
      setLoading(false)
    }
  }

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

  const handleCourseCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      courseCategory: category,
    }))
    
    const dept = departments.find(d => d.name === category)
    if (dept) {
      setFormData(prev => ({
        ...prev,
        departmentId: dept.id,
      }))
    }
  }

  const addLearningItem = () => {
    setDetailPageData(prev => ({
      ...prev,
      learningItems: [...prev.learningItems, { icon: '', title: '', description: '' }],
    }))
  }

  const removeLearningItem = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      learningItems: prev.learningItems.filter((_, i) => i !== index),
    }))
  }

  const updateLearningItem = (index: number, field: keyof LearningItem, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      learningItems: prev.learningItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const addModule = () => {
    setDetailPageData(prev => ({
      ...prev,
      modules: [...prev.modules, ''],
    }))
  }

  const removeModule = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }))
  }

  const updateModule = (index: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      modules: prev.modules.map((m, i) => (i === index ? value : m)),
    }))
  }

  const addCareerOpportunity = () => {
    setDetailPageData(prev => ({
      ...prev,
      careerOpportunities: [...prev.careerOpportunities, ''],
    }))
  }

  const removeCareerOpportunity = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities.filter((_, i) => i !== index),
    }))
  }

  const updateCareerOpportunity = (index: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities.map((c, i) => (i === index ? value : c)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      setStatusMessage({ type: 'error', message: 'Name and slug are required' })
      return
    }

    try {
      setSaving(true)
      setStatusMessage({ type: 'info', message: 'Updating program...' })

      // Build update payload - only include fields from the active tab
      const updatePayload: any = {
        ...formData,
        departmentId: formData.departmentId || null,
      }

      // Only include detail page fields if we're on the detail tab
      // OR if detail page data has been modified (has non-default values)
      if (activeTab === 'detail') {
        // Prepare detail page JSON fields
        const learningItemsJson = detailPageData.learningItems.length > 0
          ? JSON.stringify(detailPageData.learningItems)
          : null
        const modulesJson = detailPageData.modules.length > 0
          ? JSON.stringify(detailPageData.modules)
          : null
        const careerOpportunitiesJson = detailPageData.careerOpportunities.length > 0
          ? JSON.stringify(detailPageData.careerOpportunities)
          : null

        // Add detail page fields
        updatePayload.detailPageLayout = detailPageData.detailPageLayout || null
        updatePayload.heroTitle = detailPageData.heroTitle || null
        updatePayload.heroSubtitle = detailPageData.heroSubtitle || null
        updatePayload.heroImage = detailPageData.heroImage || null
        updatePayload.overviewTitle = detailPageData.overviewTitle || null
        updatePayload.overviewContent = detailPageData.overviewContent || null
        updatePayload.learningTitle = detailPageData.learningTitle || null
        updatePayload.learningItems = learningItemsJson
        updatePayload.modulesTitle = detailPageData.modulesTitle || null
        updatePayload.modules = modulesJson
        updatePayload.detailsDuration = detailPageData.detailsDuration || null
        updatePayload.detailsFormat = detailPageData.detailsFormat || null
        updatePayload.detailsSchedule = detailPageData.detailsSchedule || null
        updatePayload.detailsPrerequisites = detailPageData.detailsPrerequisites || null
        updatePayload.careerTitle = detailPageData.careerTitle || null
        updatePayload.careerOpportunitiesJson = careerOpportunitiesJson
        updatePayload.ctaTitle = detailPageData.ctaTitle || null
        updatePayload.ctaDescription = detailPageData.ctaDescription || null
        updatePayload.customContent = detailPageData.customContent || null
      }
      // If on basic tab, don't send detail page fields at all (partial update)

      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      })

      if (response.ok) {
        setStatusMessage({ type: 'success', message: 'Program updated successfully!' })
        setTimeout(() => {
          router.push('/dashboard/programs')
        }, 1500)
      } else {
        const error = await response.json()
        setStatusMessage({ type: 'error', message: error.error || 'Failed to update program' })
      }
    } catch (error) {
      console.error('Error updating program:', error)
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
          <p className="mt-4 text-gray-600 font-medium">Loading program...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Program not found</p>
          <button
            onClick={() => router.push('/dashboard/programs')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Back to Programs
          </button>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Program</h1>
            <p className="mt-1 text-gray-600">Update program details</p>
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
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'detail'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detail Page Content
            </button>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  />
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Program Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree/Certificate</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites/Requirements</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum (JSON or text)</label>
                  <textarea
                    value={formData.curriculum}
                    onChange={(e) => setFormData(prev => ({ ...prev, curriculum: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Career Opportunities</label>
                  <textarea
                    value={formData.careerOpportunities}
                    onChange={(e) => setFormData(prev => ({ ...prev, careerOpportunities: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
            </div>
          )}

          {/* Detail Page Content Tab */}
          {activeTab === 'detail' && (
            <div className="space-y-6">
              {/* Layout Selector */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Layout Configuration</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Layout</label>
                  <select
                    value={detailPageData.detailPageLayout}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, detailPageLayout: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {LAYOUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Standard layout works for most programs. Custom layouts are for special cases like MS Office or Adobe programs.
                  </p>
                </div>
              </div>

              {/* Hero Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={detailPageData.heroTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, heroTitle: e.target.value }))}
                    placeholder="e.g., Master Computer Hardware"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={detailPageData.heroSubtitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    placeholder="e.g., Build expertise in hardware systems"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <ImagePicker
                    label="Hero Image"
                    value={detailPageData.heroImage}
                    onChange={(url) => setDetailPageData(prev => ({ ...prev, heroImage: url }))}
                  />
                </div>
              </div>

              {/* Overview Section */}
              <div className="space-y-4">
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
                    placeholder="Enter the program overview description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Learning Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">What You'll Learn</h2>
                  <button
                    type="button"
                    onClick={addLearningItem}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={detailPageData.learningTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, learningTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-4">
                  {detailPageData.learningItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-700">Learning Item {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeLearningItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide icon)</label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateLearningItem(index, 'icon', e.target.value)}
                          placeholder="e.g., Cpu, MemoryStick"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateLearningItem(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateLearningItem(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  {detailPageData.learningItems.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No learning items added yet. Click "Add Item" to get started.</p>
                  )}
                </div>
              </div>

              {/* Course Modules */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">Course Modules</h2>
                  <button
                    type="button"
                    onClick={addModule}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Module
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={detailPageData.modulesTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, modulesTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  {detailPageData.modules.map((module, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={module}
                        onChange={(e) => updateModule(index, e.target.value)}
                        placeholder={`Module ${index + 1} name`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeModule(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {detailPageData.modules.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No modules added yet. Click "Add Module" to get started.</p>
                  )}
                </div>
              </div>

              {/* Program Details Sidebar */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Program Details (Sidebar)</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={detailPageData.detailsDuration}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsDuration: e.target.value }))}
                      placeholder="e.g., 6 months"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <input
                      type="text"
                      value={detailPageData.detailsFormat}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsFormat: e.target.value }))}
                      placeholder="e.g., Online, In-person"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                  <input
                    type="text"
                    value={detailPageData.detailsSchedule}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsSchedule: e.target.value }))}
                    placeholder="e.g., Monday-Friday, 9am-5pm"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
                  <textarea
                    value={detailPageData.detailsPrerequisites}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsPrerequisites: e.target.value }))}
                    rows={3}
                    placeholder="Enter prerequisites..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Career Opportunities */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">Career Opportunities</h2>
                  <button
                    type="button"
                    onClick={addCareerOpportunity}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Career
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={detailPageData.careerTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, careerTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  {detailPageData.careerOpportunities.map((career, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={career}
                        onChange={(e) => updateCareerOpportunity(index, e.target.value)}
                        placeholder={`Career opportunity ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeCareerOpportunity(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {detailPageData.careerOpportunities.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No career opportunities added yet. Click "Add Career" to get started.</p>
                  )}
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
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
                    placeholder="Enter CTA description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Custom Content (for custom layouts) */}
              {detailPageData.detailPageLayout !== 'standard' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Custom Content</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Content (JSON)</label>
                    <textarea
                      value={detailPageData.customContent}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, customContent: e.target.value }))}
                      rows={8}
                      placeholder='{"applications": [...], "skillLevels": [...]}'
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">Enter JSON for custom layout content (applications array, skillLevels, etc.)</p>
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
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Update Program
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
