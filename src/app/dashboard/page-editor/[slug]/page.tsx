'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon
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

interface WebsitePage {
  path: string
  name: string
  slug: string
  type: string
  components: PageComponent[]
  websitePage?: any
  componentCount: number
  lastUpdated?: number
}

export default function PageEditor() {
  const params = useParams()
  const slug = params.slug as string
  
  const [page, setPage] = useState<WebsitePage | null>(null)
  const [components, setComponents] = useState<PageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [showAddComponent, setShowAddComponent] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchPageData()
    }
  }, [slug])

  const fetchPageData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/website-scraper?slug=${slug}`)
      const data = await response.json()
      
      if (data.success && data.pages.length > 0) {
        const pageData = data.pages[0]
        setPage(pageData)
        setComponents(pageData.components || [])
      } else {
        setError('Page not found')
      }
    } catch (error) {
      console.error('Error fetching page data:', error)
      setError('Failed to fetch page data')
    } finally {
      setLoading(false)
    }
  }

  const handleComponentUpdate = async (componentId: string, updates: Partial<PageComponent>) => {
    try {
      const response = await fetch(`/api/page-components/${componentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        setComponents(prev => 
          prev.map(comp => 
            comp.id === componentId 
              ? { ...comp, ...updates }
              : comp
          )
        )
        setEditingComponent(null)
      }
    } catch (error) {
      console.error('Error updating component:', error)
    }
  }

  const handleComponentDelete = async (componentId: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return
    
    try {
      const response = await fetch(`/api/page-components/${componentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setComponents(prev => prev.filter(comp => comp.id !== componentId))
      }
    } catch (error) {
      console.error('Error deleting component:', error)
    }
  }

  const handleStatusToggle = async (componentId: string, isActive: boolean) => {
    await handleComponentUpdate(componentId, { isActive })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getMediaIcon = (mediaType?: string) => {
    switch (mediaType) {
      case 'image':
        return <PhotoIcon className="h-4 w-4" />
      case 'video':
        return <VideoCameraIcon className="h-4 w-4" />
      default:
        return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading page editor...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Page not found'}</p>
          <button 
            onClick={fetchPageData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{page.name}</h1>
              <p className="text-gray-600">{page.path}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button 
              onClick={() => setShowAddComponent(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Component
            </button>
          </div>
        </div>
      </div>

      {/* Page Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Page Type</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{page.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Components</p>
            <p className="text-lg font-semibold text-gray-900">{components.length}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Active Components</p>
            <p className="text-lg font-semibold text-green-600">
              {components.filter(c => c.isActive).length}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {page.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="space-y-4">
        {components.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600 mb-6">This page doesn't have any components yet.</p>
            <button 
              onClick={() => setShowAddComponent(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add First Component
            </button>
          </div>
        ) : (
          components
            .sort((a, b) => a.order - b.order)
            .map((component) => (
              <div key={component.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Component Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getMediaIcon(component.mediaType)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {component.componentName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Order: {component.order} • Updated: {formatDate(component.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        component.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {component.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => setEditingComponent(editingComponent === component.id ? null : component.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Component Content */}
                <div className="p-6">
                  {component.title && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <p className="text-gray-900">{component.title}</p>
                    </div>
                  )}
                  
                  {component.subtitle && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <p className="text-gray-900">{component.subtitle}</p>
                    </div>
                  )}
                  
                  {component.content && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{component.content}</p>
                    </div>
                  )}
                  
                  {component.mediaUrl && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media</label>
                      <div className="flex items-center space-x-2">
                        {getMediaIcon(component.mediaType)}
                        <span className="text-sm text-gray-600">{component.mediaUrl}</span>
                      </div>
                    </div>
                  )}
                  
                  {component.ctaText && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action</label>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-900">{component.ctaText}</span>
                        {component.ctaLink && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <LinkIcon className="h-4 w-4" />
                            <span className="text-sm">{component.ctaLink}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Component Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleStatusToggle(component.id, !component.isActive)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          component.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {component.isActive ? (
                          <>
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        Preview
                      </button>
                      <button 
                        onClick={() => setEditingComponent(component.id)}
                        className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded text-xs font-medium"
                      >
                        <PencilIcon className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleComponentDelete(component.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium"
                      >
                        <TrashIcon className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                {editingComponent === component.id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Component</h4>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const updates = {
                        title: formData.get('title') as string,
                        subtitle: formData.get('subtitle') as string,
                        content: formData.get('content') as string,
                        mediaType: formData.get('mediaType') as string,
                        mediaUrl: formData.get('mediaUrl') as string,
                        ctaText: formData.get('ctaText') as string,
                        ctaLink: formData.get('ctaLink') as string,
                        order: parseInt(formData.get('order') as string) || 0
                      }
                      handleComponentUpdate(component.id, updates)
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            name="title"
                            defaultValue={component.title || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                          <input
                            type="text"
                            name="subtitle"
                            defaultValue={component.subtitle || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                          <textarea
                            name="content"
                            rows={3}
                            defaultValue={component.content || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                          <select
                            name="mediaType"
                            defaultValue={component.mediaType || 'none'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="none">None</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
                          <input
                            type="url"
                            name="mediaUrl"
                            defaultValue={component.mediaUrl || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                          <input
                            type="text"
                            name="ctaText"
                            defaultValue={component.ctaText || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                          <input
                            type="url"
                            name="ctaLink"
                            defaultValue={component.ctaLink || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                          <input
                            type="number"
                            name="order"
                            defaultValue={component.order}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setEditingComponent(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  )
}

