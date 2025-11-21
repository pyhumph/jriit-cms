'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PlayIcon,
  PencilIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  PhotoIcon,
  DocumentTextIcon,
  LinkIcon,
  CogIcon
} from '@heroicons/react/24/outline'

interface HomepageComponent {
  id: string
  name: string
  type: string
  title: string
  subtitle: string
  content: string
  mediaType: 'image' | 'video' | 'none'
  mediaUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  isActive: boolean
  order: number
  settings: string
  authorId: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
}

export default function HomepageEditor() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [components, setComponents] = useState<HomepageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    } else {
      fetchComponents()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        setComponents(data.components)
        console.log('Successfully fetched components:', data.components.length, 'from', data.source || 'scraper')
      } else {
        console.error('Failed to fetch components:', data.error)
        setComponents([])
      }
    } catch (error) {
      console.error('Error fetching components:', error)
      setComponents([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/homepage-components/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ components })
      })

      const data = await response.json()

      if (data.success) {
        setHasChanges(false)
        alert('Homepage components saved successfully!')
        // Refresh the components to get the updated data
        await fetchComponents()
      } else {
        alert('Error saving components: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving components:', error)
      alert('Error saving components. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleComponentChange = (id: string, field: keyof HomepageComponent, value: string | number | boolean) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id 
          ? { ...comp, [field]: value }
          : comp
      )
    )
    setHasChanges(true)
  }

  const handleEdit = (id: string) => {
    setEditingComponent(id)
  }

  const handleCancelEdit = () => {
    setEditingComponent(null)
  }

  const handleSaveComponent = () => {
    setEditingComponent(null)
    // Component is already updated in state
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      setComponents(prev => prev.filter(comp => comp.id !== id))
      setHasChanges(true)
    }
  }

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const currentIndex = components.findIndex(comp => comp.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= components.length) return

    const newComponents = [...components]
    const [movedComponent] = newComponents.splice(currentIndex, 1)
    newComponents.splice(newIndex, 0, movedComponent)

    // Update order values
    const updatedComponents = newComponents.map((comp, index) => ({
      ...comp,
      order: index + 1
    }))

    setComponents(updatedComponents)
    setHasChanges(true)
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'hero': return PlayIcon
      case 'programs': return DocumentTextIcon
      case 'about': return PhotoIcon
      case 'statistics': return CogIcon
      case 'news': return DocumentTextIcon
      case 'accreditation': return CheckIcon
      case 'philosophy': return DocumentTextIcon
      case 'history': return DocumentTextIcon
      case 'partnerships': return LinkIcon
      case 'events': return PlayIcon
      case 'campus-news': return DocumentTextIcon
      case 'stuff': return CogIcon
      case 'downloads': return DocumentTextIcon
      case 'showcase': return PhotoIcon
      default: return CogIcon
    }
  }

  const getComponentColor = (type: string) => {
    switch (type) {
      case 'hero': return 'text-red-600 bg-red-50'
      case 'programs': return 'text-blue-600 bg-blue-50'
      case 'about': return 'text-green-600 bg-green-50'
      case 'statistics': return 'text-purple-600 bg-purple-50'
      case 'news': return 'text-orange-600 bg-orange-50'
      case 'accreditation': return 'text-yellow-600 bg-yellow-50'
      case 'philosophy': return 'text-indigo-600 bg-indigo-50'
      case 'history': return 'text-pink-600 bg-pink-50'
      case 'partnerships': return 'text-cyan-600 bg-cyan-50'
      case 'events': return 'text-teal-600 bg-teal-50'
      case 'campus-news': return 'text-emerald-600 bg-emerald-50'
      case 'stuff': return 'text-violet-600 bg-violet-50'
      case 'downloads': return 'text-gray-600 bg-gray-50'
      case 'showcase': return 'text-rose-600 bg-rose-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading homepage components...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
            <p className="text-gray-600 mt-1">Edit and manage your homepage components</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${
                previewMode
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
            <button
              onClick={fetchComponents}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Components List */}
      <div className="space-y-4">
        {components.map((component, index) => {
          const IconComponent = getComponentIcon(component.type)
          const colorClasses = getComponentColor(component.type)
          const isEditing = editingComponent === component.id

          return (
            <div
              key={component.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
                isEditing ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Component Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${colorClasses}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                      <p className="text-sm text-gray-500">Order: {component.order}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReorder(component.id, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(component.id, 'down')}
                      disabled={index === components.length - 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleComponentChange(component.id, 'isActive', !component.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        component.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {component.isActive ? 'Active' : 'Inactive'}
                    </button>
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveComponent}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(component.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(component.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Component Content */}
              {isEditing ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={component.title}
                        onChange={(e) => handleComponentChange(component.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={component.subtitle}
                        onChange={(e) => handleComponentChange(component.id, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        rows={3}
                        value={component.content}
                        onChange={(e) => handleComponentChange(component.id, 'content', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                      <select
                        value={component.mediaType}
                        onChange={(e) => handleComponentChange(component.id, 'mediaType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="none">None</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
                      <input
                        type="url"
                        value={component.mediaUrl || ''}
                        onChange={(e) => handleComponentChange(component.id, 'mediaUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                      <input
                        type="text"
                        value={component.ctaText || ''}
                        onChange={(e) => handleComponentChange(component.id, 'ctaText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="EXPLORE COURSES"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                      <input
                        type="url"
                        value={component.ctaLink || ''}
                        onChange={(e) => handleComponentChange(component.id, 'ctaLink', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#programs"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA 2 Text</label>
                      <input
                        type="text"
                        value={component.cta2Text || ''}
                        onChange={(e) => handleComponentChange(component.id, 'cta2Text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="PRICING & SCHOLARSHIPS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA 2 Link</label>
                      <input
                        type="url"
                        value={component.cta2Link || ''}
                        onChange={(e) => handleComponentChange(component.id, 'cta2Link', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/fees"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA 3 Text</label>
                      <input
                        type="text"
                        value={component.cta3Text || ''}
                        onChange={(e) => handleComponentChange(component.id, 'cta3Text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="WHY JRIIT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA 3 Link</label>
                      <input
                        type="url"
                        value={component.cta3Link || ''}
                        onChange={(e) => handleComponentChange(component.id, 'cta3Link', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#about"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Content</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Title:</strong> {component.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Subtitle:</strong> {component.subtitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Content:</strong> {component.content}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Media & Actions</h4>
                      {component.mediaType !== 'none' && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Media:</strong> {component.mediaType} - {component.mediaUrl}
                        </p>
                      )}
                      {component.ctaText && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>CTA:</strong> {component.ctaText} → {component.ctaLink}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(component.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {components.length === 0 && (
        <div className="text-center py-12">
          <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
          <p className="text-gray-500 mb-4">Start by fetching components from your website</p>
          <button
            onClick={fetchComponents}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Fetch Components
          </button>
        </div>
      )}
    </div>
  )
}
