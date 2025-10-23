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
  ArrowPathIcon
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
  testimonials: UsersIcon,
  downloads: DocumentTextIcon,
  events: MegaphoneIcon,
  news: MegaphoneIcon,
  partnerships: UsersIcon,
  philosophy: BookOpenIcon,
  history: BookOpenIcon,
  showcase: PhotoIcon
}

const componentColors: Record<string, { color: string; bgColor: string }> = {
  hero: { color: 'text-red-600', bgColor: 'bg-red-50' },
  'breaking-news': { color: 'text-green-600', bgColor: 'bg-green-50' },
  about: { color: 'text-blue-600', bgColor: 'bg-blue-50' },
  programs: { color: 'text-purple-600', bgColor: 'bg-purple-50' },
  statistics: { color: 'text-orange-600', bgColor: 'bg-orange-50' },
  gallery: { color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  testimonials: { color: 'text-pink-600', bgColor: 'bg-pink-50' },
  downloads: { color: 'text-gray-600', bgColor: 'bg-gray-50' },
  events: { color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  news: { color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  partnerships: { color: 'text-amber-600', bgColor: 'bg-amber-50' },
  philosophy: { color: 'text-violet-600', bgColor: 'bg-violet-50' },
  history: { color: 'text-slate-600', bgColor: 'bg-slate-50' },
  showcase: { color: 'text-rose-600', bgColor: 'bg-rose-50' }
}

export default function HomepageManagement() {
  const [components, setComponents] = useState<HomepageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch components on mount
  useEffect(() => {
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/homepage-components')
      const data = await response.json()
      
      if (data.success) {
        setComponents(data.components)
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

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/homepage-components/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive })
      })
      
      if (response.ok) {
        setComponents(prev => 
          prev.map(comp => 
            comp.id === id 
              ? { ...comp, isActive }
              : comp
          )
        )
      }
    } catch (error) {
      console.error('Error updating component status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this component?')) return
    
    try {
      const response = await fetch(`/api/homepage-components/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setComponents(prev => prev.filter(comp => comp.id !== id))
      }
    } catch (error) {
      console.error('Error deleting component:', error)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    const styles = {
      true: 'bg-green-100 text-green-800',
      false: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[isActive.toString() as keyof typeof styles]}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    )
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
          <p className="text-gray-600">Loading homepage components...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Homepage Management</h1>
            <p className="text-gray-600 mt-1">Manage all components of your website homepage</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview Homepage
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
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlayIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hero Slides</p>
              <p className="text-2xl font-bold text-gray-900">
                {components.filter(c => c.type === 'hero').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Components</p>
              <p className="text-2xl font-bold text-gray-900">{components.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {components.map((component) => {
          const IconComponent = componentIcons[component.type] || PlayIcon
          const colors = componentColors[component.type] || { color: 'text-gray-600', bgColor: 'bg-gray-50' }
          
          return (
            <div key={component.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${colors.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${colors.color}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{component.type.replace('-', ' ')}</p>
                  </div>
                </div>
                {getStatusBadge(component.isActive)}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Content:</p>
                <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                  {component.title && (
                    <p className="font-medium mb-1">{component.title}</p>
                  )}
                  {component.subtitle && (
                    <p className="text-gray-600 mb-1">{component.subtitle}</p>
                  )}
                  {component.content && (
                    <p className="text-gray-500 text-xs italic">
                      {component.content.length > 100 
                        ? `${component.content.substring(0, 100)}...` 
                        : component.content
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Updated: {formatDate(component.updatedAt)}</span>
                <span>Order: {component.order}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(component.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <select
                    value={component.isActive.toString()}
                    onChange={(e) => handleStatusChange(component.id, e.target.value === 'true')}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <CogIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Global Settings</p>
              <p className="text-sm text-gray-600">Update site-wide settings</p>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <MegaphoneIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Announcements</p>
              <p className="text-sm text-gray-600">Manage site announcements</p>
            </div>
          </button>

          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <EyeIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Live Preview</p>
              <p className="text-sm text-gray-600">See changes in real-time</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
