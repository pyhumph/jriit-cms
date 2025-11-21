'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  NewspaperIcon, 
  CalendarDaysIcon, 
  AcademicCapIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  CogIcon,
  PlusIcon,
  ArrowRightIcon,
  EyeIcon,
  PencilIcon,
  SparklesIcon,
  PlayIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  posts: number
  news: number
  events: number
  pages: number
  programs: number
  departments: number
  faculty: number
  testimonials: number
  media: number
}

const quickActions = [
  {
    name: 'Manage Homepage',
    description: 'Edit hero section, components, and layout',
    href: '/dashboard/homepage',
    icon: SparklesIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Hero Section',
    description: 'Update banners and slides',
    href: '/dashboard/hero',
    icon: PlayIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    name: 'News & Events',
    description: 'Manage announcements and events',
    href: '/dashboard/news',
    icon: NewspaperIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Programs',
    description: 'Update academic programs',
    href: '/dashboard/programs',
    icon: AcademicCapIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    name: 'Global Settings',
    description: 'Site-wide configuration',
    href: '/dashboard/settings',
    icon: CogIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    name: 'Media Library',
    description: 'Manage images and files',
    href: '/dashboard/media',
    icon: PhotoIcon,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  }
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    posts: 0,
    news: 0,
    events: 0,
    pages: 0,
    programs: 0,
    departments: 0,
    faculty: 0,
    testimonials: 0,
    media: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Only fetch from endpoints that exist and work
        const [postsRes, newsRes, eventsRes, pagesRes, programsRes, departmentsRes, facultyRes, testimonialsRes, mediaRes] = await Promise.allSettled([
          fetch('/api/posts?limit=1'),
          fetch('/api/news?limit=1'),
          fetch('/api/events?limit=1'),
          fetch('/api/pages?limit=1'),
          fetch('/api/programs?limit=1'),
          fetch('/api/departments'),
          fetch('/api/faculty?limit=1'),
          fetch('/api/testimonials?limit=1'),
          fetch('/api/media?limit=1'),
        ])

        const stats: DashboardStats = {
          posts: 0,
          news: 0,
          events: 0,
          pages: 0,
          programs: 0,
          departments: 0,
          faculty: 0,
          testimonials: 0,
          media: 0,
        }

        // Process each response
        if (postsRes.status === 'fulfilled' && postsRes.value.ok) {
          const posts = await postsRes.value.json()
          stats.posts = posts.pagination?.total || 0
        }

        if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
          const news = await newsRes.value.json()
          stats.news = news.pagination?.total || 0
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
          const events = await eventsRes.value.json()
          stats.events = events.pagination?.total || 0
        }

        if (pagesRes.status === 'fulfilled' && pagesRes.value.ok) {
          const pages = await pagesRes.value.json()
          stats.pages = pages.pagination?.total || 0
        }

        if (programsRes.status === 'fulfilled' && programsRes.value.ok) {
          const programs = await programsRes.value.json()
          stats.programs = programs.pagination?.total || 0
        }

        if (departmentsRes.status === 'fulfilled' && departmentsRes.value.ok) {
          const departments = await departmentsRes.value.json()
          stats.departments = departments.length || 0
        }

        if (facultyRes.status === 'fulfilled' && facultyRes.value.ok) {
          const faculty = await facultyRes.value.json()
          stats.faculty = faculty.pagination?.total || 0
        }

        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.ok) {
          const testimonials = await testimonialsRes.value.json()
          stats.testimonials = testimonials.pagination?.total || 0
        }

        if (mediaRes.status === 'fulfilled' && mediaRes.value.ok) {
          const media = await mediaRes.value.json()
          stats.media = media.pagination?.total || 0
        }

        setStats(stats)
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Set default stats if all fail
        setStats({
          posts: 0,
          news: 0,
          events: 0,
          pages: 0,
          programs: 0,
          departments: 0,
          faculty: 0,
          testimonials: 0,
          media: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Manage your JRIIT website content and keep it up-to-date
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-1">
                {Object.values(stats).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-blue-100 text-sm">Total Content Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <NewspaperIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">News</p>
              <p className="text-2xl font-bold text-gray-900">{stats.news}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AcademicCapIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.programs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <Link 
            href="/dashboard/homepage"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group flex items-center p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Website Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New post published</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Event updated</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Settings changed</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New faculty member added</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Preview</h3>
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Live Website</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Online</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">http://localhost:3001</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                View Website
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <PencilIcon className="h-4 w-4 mr-2" />
                Quick Edit
              </button>
              <button className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <MegaphoneIcon className="h-4 w-4 mr-2" />
                Announcements
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">
              Welcome to your JRIIT CMS! Start by managing your homepage components, 
              adding news and events, or updating your programs and faculty information.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/dashboard/homepage"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Manage Homepage
              </Link>
              <Link 
                href="/dashboard/settings"
                className="inline-flex items-center px-4 py-2 border border-green-300 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50"
              >
                <CogIcon className="h-4 w-4 mr-2" />
                Global Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}