'use client'

import { useState, useEffect } from 'react'
import { 
  PlayIcon, 
  MegaphoneIcon, 
  BookOpenIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  PhotoIcon,
  DocumentTextIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ArrowPathIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SaveIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface HomepageComponent {
  id: string
  name: string
  type: string
  title?: string
  subtitle?: string
  content?: string
  mediaType?: string
  mediaUrl?: string
  ctaText?: string
  ctaLink?: string
  cta2Text?: string
  cta2Link?: string
  cta3Text?: string
  cta3Link?: string
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

const componentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  hero: PlayIcon,
  'breaking-news': MegaphoneIcon,
  about: BookOpenIcon,
  programs: ClipboardDocumentListIcon,
  statistics: ChartBarIcon,
  gallery: PhotoIcon,
  news: DocumentTextIcon,
  events: MegaphoneIcon,
  testimonials: UsersIcon,
  contact: CogIcon
}

const componentColors: Record<string, string> = {
  hero: 'bg-red-50 text-red-600 border-red-200',
  'breaking-news': 'bg-orange-50 text-orange-600 border-orange-200',
  about: 'bg-blue-50 text-blue-600 border-blue-200',
  programs: 'bg-green-50 text-green-600 border-green-200',
  statistics: 'bg-purple-50 text-purple-600 border-purple-200',
  gallery: 'bg-pink-50 text-pink-600 border-pink-200',
  news: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  events: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  testimonials: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  contact: 'bg-gray-50 text-gray-600 border-gray-200'
}

export default function HomepagePage() {
  const [components, setComponents] = useState<HomepageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      setLoading(true)
      
      // Try the real content API first
      let response = await fetch('/api/fetch-real-content?type=all')
      let data = await response.json()
      
      // If real content API fails, try the mock API
      if (!data.success) {
        console.log('Real content API failed, trying mock API...')
        response = await fetch('/api/website-content-mock?type=all')
        data = await response.json()
      }
      
      if (data.success) {
        setComponents(data.components)
        console.log('Fetched components:', data.components.length)
      } else {
        console.error('Failed to fetch components:', data.error)
      }
    } catch (error) {
      console.error('Error fetching components:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/homepage-components/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ components }),
      })

      const data = await response.json()

      if (data.success) {
        setHasChanges(false)
        setEditingComponent(null)
        // Show success message
        alert('Changes saved successfully!')
      } else {
        alert('Failed to save changes: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving components:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleComponentUpdate = (id: string, field: string, value: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ))
    setHasChanges(true)
  }

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    setComponents(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const index = sorted.findIndex(comp => comp.id === id)
      
      if (direction === 'up' && index > 0) {
        [sorted[index], sorted[index - 1]] = [sorted[index - 1], sorted[index]]
      } else if (direction === 'down' && index < sorted.length - 1) {
        [sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]]
      }
      
      // Update order values
      return sorted.map((comp, idx) => ({ ...comp, order: idx + 1 }))
    })
    setHasChanges(true)
  }

  const handleToggleActive = (id: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, isActive: !comp.isActive } : comp
    ))
    setHasChanges(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Homepage Components...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Homepage Management</h1>
              <p className="text-gray-600 mt-1">Manage all homepage components and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              {hasChanges && (
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <SaveIcon className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Components List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Homepage Components</h2>
                <p className="text-sm text-gray-600 mt-1">Click on any component to edit its content</p>
              </div>
              <div className="p-6">
                {components.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No components found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {components
                      .sort((a, b) => a.order - b.order)
                      .map((component) => {
                        const Icon = componentIcons[component.type] || DocumentTextIcon
                        const colorClass = componentColors[component.type] || 'bg-gray-50 text-gray-600 border-gray-200'
                        
                        return (
                          <div
                            key={component.id}
                            className={`border rounded-xl p-4 transition-all duration-200 ${
                              editingComponent === component.id 
                                ? 'ring-2 ring-blue-500 border-blue-300' 
                                : 'border-gray-200 hover:border-gray-300'
                            } ${!component.isActive ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg border ${colorClass}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900">{component.name}</h3>
                                  <p className="text-sm text-gray-600">Type: {component.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleReorder(component.id, 'up')}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Move up"
                                >
                                  <ChevronUpIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReorder(component.id, 'down')}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Move down"
                                >
                                  <ChevronDownIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setEditingComponent(
                                    editingComponent === component.id ? null : component.id
                                  )}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                  title="Edit component"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleActive(component.id)}
                                  className={`p-1 ${component.isActive ? 'text-green-600' : 'text-gray-400'}`}
                                  title={component.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Component Content Preview */}
                            <div className="text-sm text-gray-600 space-y-1">
                              {component.title && <p><strong>Title:</strong> {component.title}</p>}
                              {component.subtitle && <p><strong>Subtitle:</strong> {component.subtitle}</p>}
                              {component.content && <p><strong>Content:</strong> {component.content.substring(0, 100)}...</p>}
                              {component.ctaText && <p><strong>CTA:</strong> {component.ctaText}</p>}
                            </div>

                            {/* Edit Form */}
                            {editingComponent === component.id && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                      type="text"
                                      value={component.title || ''}
                                      onChange={(e) => handleComponentUpdate(component.id, 'title', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                    <input
                                      type="text"
                                      value={component.subtitle || ''}
                                      onChange={(e) => handleComponentUpdate(component.id, 'subtitle', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                  <textarea
                                    value={component.content || ''}
                                    onChange={(e) => handleComponentUpdate(component.id, 'content', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>

                                {/* CTA Buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA 1 Text</label>
                                    <input
                                      type="text"
                                      value={component.ctaText || ''}
                                      onChange={(e) => handleComponentUpdate(component.id, 'ctaText', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA 2 Text</label>
                                    <input
                                      type="text"
                                      value={component.cta2Text || ''}
                                      onChange={(e) => handleComponentUpdate(component.id, 'cta2Text', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA 3 Text</label>
                                    <input
                                      type="text"
                                      value={component.cta3Text || ''}
                                      onChange={(e) => handleComponentUpdate(component.id, 'cta3Text', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setEditingComponent(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={fetchComponents}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh Components
                </button>
                
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>

                {hasChanges && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      You have unsaved changes. Click "Save Changes" to persist them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}