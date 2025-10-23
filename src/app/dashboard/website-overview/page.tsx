'use client'

import { useState, useEffect } from 'react'
import { 
  GlobeAltIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  PhotoIcon,
  CalendarIcon,
  PhoneIcon,
  CogIcon,
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  VideoCameraIcon,
  NewspaperIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface WebsitePage {
  path: string
  name: string
  slug: string
  type: string
  components: any[]
  websitePage?: any
  componentCount: number
  lastUpdated?: number
}

interface GroupedPages {
  [key: string]: WebsitePage[]
}

const PAGE_TYPE_ICONS = {
  main: GlobeAltIcon,
  about: UsersIcon,
  program: AcademicCapIcon,
  academic: BookOpenIcon,
  service: CogIcon,
  media: PhotoIcon,
  'it-program': ComputerDesktopIcon,
  'cyber-program': ShieldCheckIcon,
  'cs-program': ComputerDesktopIcon,
  'ce-program': ComputerDesktopIcon,
  'ba-program': BuildingOfficeIcon,
  'accountancy-program': CurrencyDollarIcon,
  'ttm-program': MapPinIcon
}

const PAGE_TYPE_COLORS = {
  main: 'bg-blue-100 text-blue-800',
  about: 'bg-purple-100 text-purple-800',
  program: 'bg-green-100 text-green-800',
  academic: 'bg-indigo-100 text-indigo-800',
  service: 'bg-orange-100 text-orange-800',
  media: 'bg-pink-100 text-pink-800',
  'it-program': 'bg-cyan-100 text-cyan-800',
  'cyber-program': 'bg-red-100 text-red-800',
  'cs-program': 'bg-blue-100 text-blue-800',
  'ce-program': 'bg-yellow-100 text-yellow-800',
  'ba-program': 'bg-emerald-100 text-emerald-800',
  'accountancy-program': 'bg-green-100 text-green-800',
  'ttm-program': 'bg-teal-100 text-teal-800'
}

export default function WebsiteOverview() {
  const [pages, setPages] = useState<WebsitePage[]>([])
  const [groupedPages, setGroupedPages] = useState<GroupedPages>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['main']))
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWebsitePages()
  }, [])

  const fetchWebsitePages = async () => {
    try {
      setLoading(true)
      // Try the simple API first
      const response = await fetch('/api/website-scraper-simple')
      const data = await response.json()
      
      if (data.success) {
        setPages(data.pages)
        setGroupedPages(data.groupedPages)
        if (data.message) {
          console.log('Using mock data:', data.message)
        }
      } else {
        setError('Failed to fetch website pages')
      }
    } catch (error) {
      console.error('Error fetching website pages:', error)
      setError('Failed to fetch website pages')
    } finally {
      setLoading(false)
    }
  }

  const toggleTypeExpansion = (type: string) => {
    setExpandedTypes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(type)) {
        newSet.delete(type)
      } else {
        newSet.add(type)
      }
      return newSet
    })
  }

  const getTypeIcon = (type: string) => {
    const IconComponent = PAGE_TYPE_ICONS[type as keyof typeof PAGE_TYPE_ICONS] || DocumentTextIcon
    return <IconComponent className="h-5 w-5" />
  }

  const getTypeColor = (type: string) => {
    return PAGE_TYPE_COLORS[type as keyof typeof PAGE_TYPE_COLORS] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.path.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || page.type === selectedType
    return matchesSearch && matchesType
  })

  const filteredGroupedPages = Object.keys(groupedPages).reduce((acc, type) => {
    if (selectedType === 'all' || type === selectedType) {
      acc[type] = groupedPages[type].filter(page => 
        page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.path.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return acc
  }, {} as GroupedPages)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading website overview...</p>
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
            onClick={fetchWebsitePages}
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
            <h1 className="text-2xl font-bold text-gray-900">Website Overview</h1>
            <p className="text-gray-600 mt-1">Manage all website pages and content</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview Website
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Page
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GlobeAltIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Components</p>
              <p className="text-2xl font-bold text-gray-900">
                {pages.reduce((sum, page) => sum + page.componentCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Page Types</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(groupedPages).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Main Pages</p>
              <p className="text-2xl font-bold text-gray-900">
                {groupedPages.main?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="lg:w-64">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {Object.keys(groupedPages).map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} ({groupedPages[type].length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pages by Type */}
      <div className="space-y-6">
        {Object.entries(filteredGroupedPages).map(([type, typePages]) => {
          if (typePages.length === 0) return null
          
          const isExpanded = expandedTypes.has(type)
          const IconComponent = PAGE_TYPE_ICONS[type as keyof typeof PAGE_TYPE_ICONS] || DocumentTextIcon
          
          return (
            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Type Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                onClick={() => toggleTypeExpansion(type)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {type.replace('-', ' ')} Pages
                      </h3>
                      <p className="text-sm text-gray-600">
                        {typePages.length} page{typePages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {typePages.reduce((sum, page) => sum + page.componentCount, 0)} components
                    </span>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Pages List */}
              {isExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {typePages.map((page) => (
                      <div key={page.slug} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{page.name}</h4>
                            <p className="text-sm text-gray-600">{page.path}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(page.type)}`}>
                            {page.type}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Components: {page.componentCount}</span>
                            <span>Updated: {formatDate(page.lastUpdated || 0)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button className="flex-1 inline-flex items-center justify-center px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                          <button className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium">
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* All Pages Table View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Pages</h3>
          <p className="text-sm text-gray-600">Complete list of all website pages</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Components</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{page.name}</div>
                      <div className="text-sm text-gray-500">{page.path}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(page.type)}`}>
                      {page.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {page.componentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(page.lastUpdated || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
