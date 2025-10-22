'use client'

import { useState } from 'react'
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
  PlusIcon
} from '@heroicons/react/24/outline'

interface HomepageComponent {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  status: 'active' | 'inactive' | 'draft'
  lastUpdated: string
  preview: string
}

const homepageComponents: HomepageComponent[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Main banner with video/image, title, and call-to-action',
    icon: PlayIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    status: 'active',
    lastUpdated: '2 hours ago',
    preview: 'Welcome to JRIIT - Empowering Future Technology Leaders'
  },
  {
    id: 'breaking-news',
    name: 'Breaking News & Updates',
    description: 'Scrolling news ticker with latest announcements',
    icon: MegaphoneIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    status: 'active',
    lastUpdated: '1 hour ago',
    preview: 'Admissions Open for 2025-2026 Academic Year'
  },
  {
    id: 'about',
    name: 'About JRIIT',
    description: 'Introduction section with institute overview',
    icon: BookOpenIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    status: 'active',
    lastUpdated: '3 days ago',
    preview: 'Leading institute for Information Technology education'
  },
  {
    id: 'programs',
    name: 'Programs Showcase',
    description: 'Featured degree programs and courses',
    icon: ClipboardDocumentListIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    status: 'active',
    lastUpdated: '1 day ago',
    preview: 'Computer Science, IT, Cybersecurity, and more'
  },
  {
    id: 'statistics',
    name: 'Statistics Section',
    description: 'Key numbers and achievements',
    icon: ChartBarIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    status: 'active',
    lastUpdated: '5 days ago',
    preview: '500+ Students, 50+ Programs, 95% Success Rate'
  },
  {
    id: 'gallery',
    name: 'Photo Gallery',
    description: 'Campus photos and student life images',
    icon: PhotoIcon,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    status: 'active',
    lastUpdated: '2 days ago',
    preview: 'Campus facilities, classrooms, and student activities'
  },
  {
    id: 'testimonials',
    name: 'Student Testimonials',
    description: 'Reviews and feedback from students',
    icon: UsersIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    status: 'active',
    lastUpdated: '1 week ago',
    preview: 'What our students say about JRIIT'
  },
  {
    id: 'downloads',
    name: 'Quick Downloads',
    description: 'Important documents and forms',
    icon: DocumentTextIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    status: 'active',
    lastUpdated: '4 days ago',
    preview: 'Brochures, application forms, and guides'
  }
]

export default function HomepageManagement() {
  const [components, setComponents] = useState<HomepageComponent[]>(homepageComponents)

  const handleStatusChange = (id: string, status: 'active' | 'inactive' | 'draft') => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id 
          ? { ...comp, status, lastUpdated: 'Just now' }
          : comp
      )
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
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
                {components.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PencilIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft Components</p>
              <p className="text-2xl font-bold text-gray-900">
                {components.filter(c => c.status === 'draft').length}
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
                {components.filter(c => c.status === 'inactive').length}
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
        {components.map((component) => (
          <div key={component.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${component.bgColor}`}>
                  <component.icon className={`h-6 w-6 ${component.color}`} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                  <p className="text-sm text-gray-600">{component.description}</p>
                </div>
              </div>
              {getStatusBadge(component.status)}
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 italic">
                &ldquo;{component.preview}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Last updated: {component.lastUpdated}</span>
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
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <select
                  value={component.status}
                  onChange={(e) => handleStatusChange(component.id, e.target.value as 'active' | 'inactive' | 'draft')}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        ))}
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
