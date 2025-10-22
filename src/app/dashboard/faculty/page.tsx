'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Faculty {
  id: string
  name: string
  title: string
  email: string
  phone: string | null
  bio: string
  photo: string | null
  department: {
    name: string
    id: string
  }
  specialization: string | null
  education: string | null
  experience: string | null
  achievements: string | null
  socialLinks: string | null
  isActive: boolean
  order: number
  author: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface FacultyStats {
  total: number
  active: number
  departments: number
  withPhotos: number
}

export default function FacultyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [stats, setStats] = useState<FacultyStats>({
    total: 0,
    active: 0,
    departments: 0,
    withPhotos: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      fetchFaculty()
    }
  }, [session, status, router])

  const fetchFaculty = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/faculty')
      if (response.ok) {
        const data = await response.json()
        setFaculty(data.faculty || [])
        
        // Calculate stats
        const total = data.faculty?.length || 0
        const active = data.faculty?.filter((member: Faculty) => member.isActive).length || 0
        const departments = new Set(data.faculty?.map((member: Faculty) => member.department.id) || []).size
        const withPhotos = data.faculty?.filter((member: Faculty) => member.photo).length || 0
        
        setStats({ total, active, departments, withPhotos })
      }
    } catch (error) {
      console.error('Error fetching faculty:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return
    
    try {
      const response = await fetch(`/api/faculty/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setFaculty(faculty.filter(member => member.id !== id))
        fetchFaculty() // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting faculty member:', error)
    }
  }

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && member.isActive) ||
                         (filterStatus === 'inactive' && !member.isActive)
    const matchesDepartment = filterDepartment === 'all' || member.department.id === filterDepartment
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const uniqueDepartments = Array.from(new Set(faculty.map(member => member.department.id)))
    .map(id => faculty.find(member => member.department.id === id)?.department)
    .filter(Boolean)

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Faculty...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
            Faculty Management
          </h1>
          <p className="mt-2 text-gray-600">Manage faculty members and staff</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/faculty/create')}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Faculty Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Faculty</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <UserIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Photos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.withPhotos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Faculty</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept?.id} value={dept?.id}>
                    {dept?.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name A-Z</option>
              <option value="title">Title</option>
              <option value="department">Department</option>
              <option value="specialization">Specialization</option>
            </select>
            <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Faculty List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty members found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first faculty member.</p>
            <button
              onClick={() => router.push('/dashboard/faculty/create')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Faculty Member
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFaculty.map((member) => (
              <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Faculty Photo */}
                  <div className="flex-shrink-0">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-20 w-20 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Faculty Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {member.name}
                        </h3>
                        <p className="text-blue-600 font-medium mb-2">{member.title}</p>
                        <p className="text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
                        
                        {/* Faculty Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            {member.department.name}
                          </div>
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {member.phone}
                            </div>
                          )}
                          {member.specialization && (
                            <div className="flex items-center">
                              <AcademicCapIcon className="h-4 w-4 mr-1" />
                              {member.specialization}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          {member.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <AcademicCapIcon className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <UserIcon className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/faculty/${member.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/faculty/${member.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
