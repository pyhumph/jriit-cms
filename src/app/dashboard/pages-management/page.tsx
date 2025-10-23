'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  CogIcon
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
  id: string
  name: string
  slug: string
  title?: string
  description?: string
  metaTitle?: string
  metaDescription?: string
  isActive: boolean
  order: number
  authorId: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
}

const websitePages = [
  { name: 'Homepage', slug: 'homepage', icon: '🏠' },
  { name: 'About', slug: 'about', icon: 'ℹ️' },
  { name: 'Programs', slug: 'programs', icon: '🎓' },
  { name: 'Contact', slug: 'contact', icon: '📞' },
  { name: 'Admission', slug: 'admission', icon: '📝' },
  { name: 'News', slug: 'news', icon: '📰' },
  { name: 'Events', slug: 'events', icon: '📅' },
  { name: 'Gallery', slug: 'gallery', icon: '🖼️' },
  { name: 'Blog', slug: 'blog', icon: '📝' },
  { name: 'Services', slug: 'services', icon: '⚙️' }
]

export default function PagesManagement() {
  const [components, setComponents] = useState<PageComponent[]>([])
  const [pages, setPages] = useState<WebsitePage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPage, setSelectedPage] = useState<string>('homepage')
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['homepage']))

  // Fetch components on mount
  useEffect(() => {
    fetchComponents()
    fetchPages()
  }, [])

  const fetchComponents = async () => {
    try {
      setLoading(true)
      // Use the simple API that provides mock data
      const response = await fetch('/api/website-scraper-simple')
      const data = await response.json()
      
      if (data.success) {
        // Extract all components from all pages
        const allComponents = data.pages.flatMap(page => page.components)
        setComponents(allComponents)
        console.log('Using mock data for components:', data.message)
      } else {
        setError('Failed to fetch components')
      }
    } catch (error) {
      console.error('Error fetching components:', error)
      setError('Failed to fetch components')
    } finally {
      setLoading(false)
    }
  }

  const fetchPages = async () => {
    try {
      // Use the simple API for pages as well
      const response = await fetch('/api/website-scraper-simple')
      const data = await response.json()
      
      if (data.success) {
        // Convert the pages data to the expected format
        const websitePages = data.pages.map(page => ({
          id: page.slug,
          name: page.name,
          slug: page.slug,
          title: page.name,
          description: `Content for ${page.name} page`,
          isActive: true,
          order: 0,
          authorId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            id: '1',
            name: 'System',
            email: 'system@jriit.com'
          }
        }))
        setPages(websitePages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    }
  }

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      // For mock data, just update the local state
      setComponents(prev => 
        prev.map(comp => 
          comp.id === id 
            ? { ...comp, isActive }
            : comp
        )
      )
      console.log('Mock: Component status updated locally')
    } catch (error) {
      console.error('Error updating component status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return
    
    try {
      // For mock data, just update the local state
      setComponents(prev => prev.filter(comp => comp.id !== id))
      console.log('Mock: Component deleted locally')
    } catch (error) {
      console.error('Error deleting component:', error)
    }
  }

  const togglePageExpansion = (pageSlug: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pageSlug)) {
        newSet.delete(pageSlug)
      } else {
        newSet.add(pageSlug)
      }
      return newSet
    })
  }

  const getPageComponents = (pageSlug: string) => {
    return components.filter(comp => comp.pageName === pageSlug)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading page components...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchComponents}
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Website Pages Management</h1>
            <p className="text-gray-600 mt-1">Manage content for all website pages</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview Website
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Component
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900">{websitePages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <GlobeAltIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Components</p>
              <p className="text-2xl font-bold text-gray-900">
                {components.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CogIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Components</p>
              <p className="text-2xl font-bold text-gray-900">
                {components.filter(c => !c.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PencilIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Components</p>
              <p className="text-2xl font-bold text-gray-900">{components.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pages and Components */}
      <div className="space-y-6">
        {websitePages.map((page) => {
          const pageComponents = getPageComponents(page.slug)
          const isExpanded = expandedPages.has(page.slug)
          
          return (
            <div key={page.slug} className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Page Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => togglePageExpansion(page.slug)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{page.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{page.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pageComponents.length} component{pageComponents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {pageComponents.filter(c => c.isActive).length} active
                    </span>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Page Components */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-6">
                  {pageComponents.length === 0 ? (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No components found for this page</p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Add Component
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {pageComponents.map((component) => (
                        <div key={component.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{component.componentName}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {component.componentName.replace('-', ' ')}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              component.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {component.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {component.title && (
                            <p className="text-sm text-gray-700 mb-2 font-medium">{component.title}</p>
                          )}
                          {component.subtitle && (
                            <p className="text-sm text-gray-600 mb-2">{component.subtitle}</p>
                          )}
                          {component.content && (
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                              {component.content.length > 100 
                                ? `${component.content.substring(0, 100)}...` 
                                : component.content
                              }
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>Order: {component.order}</span>
                            <span>Updated: {formatDate(component.updatedAt)}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                              <EyeIcon className="h-3 w-3 mr-1" />
                              Preview
                            </button>
                            <button className="flex-1 inline-flex items-center justify-center px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                              <PencilIcon className="h-3 w-3 mr-1" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(component.id)}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Status:</span>
                              <select
                                value={component.isActive.toString()}
                                onChange={(e) => handleStatusChange(component.id, e.target.value === 'true')}
                                className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
