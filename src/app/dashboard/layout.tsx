'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  HomeIcon, 
  PhotoIcon, 
  CogIcon, 
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  NewspaperIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  SparklesIcon,
  PlayIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ThemeToggle'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'Website Overview', href: '/dashboard/website-overview', icon: GlobeAltIcon, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { name: 'Pages Management', href: '/dashboard/pages-management', icon: ClipboardDocumentListIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { name: 'Homepage', href: '/dashboard/homepage', icon: SparklesIcon, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { name: 'News & Events', href: '/dashboard/news', icon: NewspaperIcon, color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'Programs', href: '/dashboard/programs', icon: AcademicCapIcon, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { name: 'Departments', href: '/dashboard/departments', icon: BuildingOfficeIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { name: 'Faculty', href: '/dashboard/faculty', icon: UserGroupIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  { name: 'Media Library', href: '/dashboard/media', icon: PhotoIcon, color: 'text-teal-600', bgColor: 'bg-teal-50' },
  { name: 'Global Settings', href: '/dashboard/settings', icon: CogIcon, color: 'text-gray-600', bgColor: 'bg-gray-50' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">JRIIT CMS</h1>
              <p className="text-blue-100 text-sm">Content Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${item.bgColor} ${item.color} shadow-md`
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 bg-current rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {session.user.name?.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="mt-4 group flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">Manage your website content</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500">{session.user.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-lg">
                  {session.user.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}