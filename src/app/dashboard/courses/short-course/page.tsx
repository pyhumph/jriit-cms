'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  PhotoIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface PageComponent {
  id: string
  pageName: string
  componentName: string
  title?: string
  subtitle?: string
  content?: string
  mediaType?: string
  mediaUrl?: string
  ctaText?: string
  ctaLink?: string
  isActive: boolean
  order: number
  settings?: string
  authorId: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
}

const PAGE_NAME = 'short-course'
const COURSE_NAME = 'Short Course'

const COMPONENT_CONFIG = {
  header: {
    name: 'Header',
    icon: PhotoIcon,
    color: 'blue',
    fields: ['title', 'subtitle', 'content', 'mediaUrl']
  },
  'career-skills': {
    name: 'Career Skills',
    icon: AcademicCapIcon,
    color: 'green',
    fields: ['title', 'content']
  },
  'admission-requirements': {
    name: 'Admission Requirements',
    icon: CheckCircleIcon,
    color: 'purple',
    fields: ['title', 'content']
  }
}

export default function ShortCoursePage() {
  const { data: session, status } = useSession()
  const [components, setComponents] = useState<PageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'authenticated') {
      fetchComponents()
    }
  }, [status])

  const fetchComponents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/page-components?pageName=${PAGE_NAME}`)
      const data = await response.json()

      if (data.success) {
        const existingComponents = data.components || []
        const requiredComponents = Object.keys(COMPONENT_CONFIG)
        
        const componentsMap = new Map(
          existingComponents.map((comp: PageComponent) => [comp.componentName, comp])
        )

        const missingComponents = requiredComponents.filter(
          name => !componentsMap.has(name)
        )

        if (missingComponents.length > 0 && session?.user?.id) {
          const createPromises = missingComponents.map(async (componentName) => {
            const config = COMPONENT_CONFIG[componentName as keyof typeof COMPONENT_CONFIG]
            const defaultData: Partial<PageComponent> = {
              pageName: PAGE_NAME,
              componentName,
              title: config.name,
              isActive: true,
              order: requiredComponents.indexOf(componentName)
            }

            if (componentName === 'header') {
              defaultData.title = 'Short'
              defaultData.subtitle = 'Course'
              defaultData.content = 'Learn. Grow. Achieve.'
            } else if (componentName === 'career-skills') {
              defaultData.title = 'SHORT-COURSE-READY SKILLS? CHECK.'
              defaultData.content = "In Short Courses at JRIIT, you'll gain focused, practical skills in a condensed timeframe. Our programs cover essential knowledge and hands-on training designed for quick learning and immediate application. These are the skills that make JRIIT short course graduates ready to apply their knowledge immediately.\n\nWhy? We emphasize practical, hands-on learning and immediate skill application. You'll receive detailed feedback on your learning progress and skill development, giving you a complete understanding of your growth.\n\nDiscover our short courses below and unlock the skills to achieve your goals quickly."
            } else if (componentName === 'admission-requirements') {
              defaultData.title = 'ADMISSION REQUIREMENTS'
              defaultData.content = 'The applicant should posses at least four (4) passes in non-religious subjects in the Certificate of Secondary Education Examination (CSEE) or should posses the National Vocational Award Level III (Trade Test Grade I) in a relevant field from a recognized institution with any Certificate of Secondary Education Examination (CSEE) OR Equivalent as approved by the ATC Governing Board.'
            }

            const createResponse = await fetch('/api/page-components', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(defaultData)
            })

            if (createResponse.ok) {
              const created = await createResponse.json()
              return created.component
            }
            return null
          })

          const created = await Promise.all(createPromises)
          const allComponents = [...existingComponents, ...created.filter(Boolean)]
          setComponents(allComponents.sort((a: PageComponent, b: PageComponent) => a.order - b.order))
        } else {
          setComponents(existingComponents.sort((a: PageComponent, b: PageComponent) => a.order - b.order))
        }
      }
    } catch (error) {
      console.error('Error fetching components:', error)
      setStatusMessage({ type: 'error', message: 'Failed to load components' })
    } finally {
      setLoading(false)
    }
  }

  const handleComponentUpdate = (id: string, field: string, value: string | boolean | number) => {
    setComponents(prev =>
      prev.map(comp => {
        if (comp.id === id) {
          const updated = { ...comp, [field]: value }
          setDirtyIds(prev => new Set(prev).add(id))
          return updated
        }
        return comp
      })
    )
  }

  const handleSaveChanges = async () => {
    const componentsToSave = components.filter(comp => dirtyIds.has(comp.id))

    if (componentsToSave.length === 0) {
      setStatusMessage({ type: 'info', message: 'No changes to save.' })
      return
    }

    try {
      setSaving(true)
      setStatusMessage({ type: 'info', message: 'Saving changes...' })

      const results = await Promise.allSettled(
        componentsToSave.map(async (component) => {
          const response = await fetch(`/api/page-components/${component.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pageName: component.pageName,
              componentName: component.componentName,
              title: component.title,
              subtitle: component.subtitle,
              content: component.content,
              mediaType: component.mediaType,
              mediaUrl: component.mediaUrl,
              ctaText: component.ctaText,
              ctaLink: component.ctaLink,
              isActive: component.isActive,
              order: component.order,
              settings: component.settings
            })
          })

          if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}))
            throw new Error(errorBody.error || 'Failed to save component')
          }

          return component.id
        })
      )

      const failed = results.filter(r => r.status === 'rejected')
      if (failed.length > 0) {
        setStatusMessage({
          type: 'error',
          message: `Failed to save ${failed.length} component(s). Please try again.`
        })
      } else {
        setDirtyIds(new Set())
        setStatusMessage({ type: 'success', message: 'All changes saved successfully!' })
        setEditingComponent(null)
        await fetchComponents()
      }
    } catch (error) {
      console.error('Error saving changes:', error)
      setStatusMessage({ type: 'error', message: 'An unexpected error occurred.' })
    } finally {
      setSaving(false)
      setTimeout(() => setStatusMessage(null), 5000)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading {COURSE_NAME} page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{COURSE_NAME} Page</h1>
            <p className="text-gray-600 mt-1">Manage content for the {COURSE_NAME} course page</p>
          </div>
          {dirtyIds.size > 0 && (
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Save Changes ({dirtyIds.size})
                </>
              )}
            </button>
          )}
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

      {/* Components */}
      <div className="space-y-6">
        {components.map((component) => {
          const config = COMPONENT_CONFIG[component.componentName as keyof typeof COMPONENT_CONFIG]
          if (!config) return null

          const Icon = config.icon
          const isEditing = editingComponent === component.id
          const isDirty = dirtyIds.has(component.id)

          return (
            <div
              key={component.id}
              className={`bg-white rounded-xl shadow-sm border-2 ${
                isDirty ? 'border-blue-300' : 'border-gray-200'
              } overflow-hidden`}
            >
              {/* Component Header */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-${config.color}-100 rounded-xl`}>
                      <Icon className={`h-6 w-6 text-${config.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                      <p className="text-sm text-gray-600">Component: {component.componentName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isDirty && (
                      <span className="text-xs text-blue-600 font-medium">Unsaved changes</span>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={component.isActive}
                        onChange={(e) => handleComponentUpdate(component.id, 'isActive', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <button
                      onClick={() => setEditingComponent(isEditing ? null : component.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Component Content */}
              {isEditing ? (
                <div className="p-6 space-y-4">
                  {config.fields.includes('title') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={component.title || ''}
                        onChange={(e) => handleComponentUpdate(component.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {config.fields.includes('subtitle') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={component.subtitle || ''}
                        onChange={(e) => handleComponentUpdate(component.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {config.fields.includes('content') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={component.content || ''}
                        onChange={(e) => handleComponentUpdate(component.id, 'content', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter content here. Use line breaks to separate paragraphs."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Tip: Use double line breaks to separate paragraphs
                      </p>
                    </div>
                  )}

                  {config.fields.includes('mediaUrl') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
                      <input
                        type="url"
                        value={component.mediaUrl || ''}
                        onChange={(e) => handleComponentUpdate(component.id, 'mediaUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setEditingComponent(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setEditingComponent(null)
                        handleSaveChanges()
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Component
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="space-y-3">
                    {component.title && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Title:</span>
                        <p className="text-gray-900 font-medium">{component.title}</p>
                      </div>
                    )}
                    {component.subtitle && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Subtitle:</span>
                        <p className="text-gray-700">{component.subtitle}</p>
                      </div>
                    )}
                    {component.content && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Content:</span>
                        <p className="text-gray-700 whitespace-pre-line">
                          {component.content.length > 200
                            ? `${component.content.substring(0, 200)}...`
                            : component.content}
                        </p>
                      </div>
                    )}
                    {component.mediaUrl && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Background Image:</span>
                        <p className="text-gray-700 text-sm break-all">{component.mediaUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Programs Section */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Programs Card Section</h3>
              <p className="text-sm text-gray-600">The programs displayed on the frontend</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AcademicCapIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-semibold text-blue-900 mb-2">Programs Management</h4>
                <p className="text-blue-800 mb-3">
                  The <strong>program cards</strong> displayed on the Short Courses frontend page show individual programs (like "Web Design", "Computer Hardware", etc.). These programs are created and managed in the{' '}
                  <a href="/dashboard/programs" className="underline font-medium hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                    Programs Management
                  </a>{' '}
                  page.
                </p>
                <p className="text-blue-800 mb-3">
                  <strong>To add programs to this page:</strong>
                </p>
                <ol className="list-decimal list-inside text-blue-800 mb-3 space-y-1 ml-2">
                  <li>Go to <a href="/dashboard/programs" className="underline font-medium hover:text-blue-600" target="_blank" rel="noopener noreferrer">Programs Management</a></li>
                  <li>Click "Create Program" to add a new program</li>
                  <li>Assign the program to the "Short Course" department</li>
                  <li>The program will automatically appear on the Short Courses frontend page</li>
                </ol>
                <p className="text-sm text-blue-700 italic">
                  Note: If the Programs Management page appears empty, it means no programs have been created yet. Click "Create Program" to add your first program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

