'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  BookOpenIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Department {
  id: string
  name: string
  slug: string
  description: string
  headOfDepartment: string
  email: string
  phone: string | null
  office: string | null
  isActive: boolean
  order: number
  programs: {
    id: string
    name: string
  }[] | null
  faculty: {
    id: string
    name: string
    title: string
  }[] | null
  author: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface DepartmentStats {
  total: number
  active: number
  totalPrograms: number
  totalFaculty: number
}

export default function DepartmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [stats, setStats] = useState<DepartmentStats>({
    total: 0,
    active: 0,
    totalPrograms: 0,
    totalFaculty: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      fetchDepartments()
    }
  }, [session, status, router])

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data.departments || [])
        
        // Calculate stats
        const total = data.departments?.length || 0
        const active = data.departments?.filter((dept: Department) => dept.isActive).length || 0
        const totalPrograms = data.departments?.reduce((sum: number, dept: Department) => sum + (dept.programs?.length || 0), 0) || 0
        const totalFaculty = data.departments?.reduce((sum: number, dept: Department) => sum + (dept.faculty?.length || 0), 0) || 0
        
        setStats({ total, active, totalPrograms, totalFaculty })
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return
    
    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDepartments(departments.filter(dept => dept.id !== id))
        fetchDepartments() // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting department:', error)
    }
  }

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && department.isActive) ||
                         (filterStatus === 'inactive' && !department.isActive)
    
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Departments...</p>
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
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
            Departments Management
          </h1>
          <p className="mt-2 text-gray-600">Manage academic departments and faculty</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/departments/create')}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Department
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
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
              <BookOpenIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <UserGroupIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Faculty</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFaculty}</p>
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
                placeholder="Search departments..."
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
                <option value="all">All Departments</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              <option value="programs">Most Programs</option>
              <option value="faculty">Most Faculty</option>
              <option value="order">Custom Order</option>
            </select>
            <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Departments List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first department.</p>
            <button
              onClick={() => router.push('/dashboard/departments/create')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Department
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDepartments.map((department) => (
              <div key={department.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Department Icon */}
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BuildingOfficeIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Department Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {department.name}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{department.description}</p>
                        
                        {/* Department Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {department.headOfDepartment}
                          </div>
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            {department.email}
                          </div>
                          {department.phone && (
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {department.phone}
                            </div>
                          )}
                          {department.office && (
                            <div className="flex items-center">
                              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                              {department.office}
                            </div>
                          )}
                        </div>

                        {/* Programs and Faculty Count */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center text-blue-600">
                            <BookOpenIcon className="h-4 w-4 mr-1" />
                            {department.programs?.length || 0} Programs
                          </div>
                          <div className="flex items-center text-green-600">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {department.faculty?.length || 0} Faculty
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          {department.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <AcademicCapIcon className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/departments/${department.id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/dashboard/departments/${department.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(department.id)}
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
