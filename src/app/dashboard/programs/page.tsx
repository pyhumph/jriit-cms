'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal'

interface Program {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  duration: string
  degree: string
  department: {
    name: string
    id: string
  }
  requirements: string | null
  curriculum: string | null
  careerOpportunities: string | null
  featuredImage: string | null
  isActive: boolean
  isFeatured: boolean
  order: number
  author: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface ProgramStats {
  total: number
  active: number
  featured: number
  departments: number
}

export default function ProgramsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [stats, setStats] = useState<ProgramStats>({
    total: 0,
    active: 0,
    featured: 0,
    departments: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [programToDelete, setProgramToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      fetchPrograms()
      fetchDepartments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data.map((dept: any) => ({ id: dept.id, name: dept.name })))
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`/api/programs?limit=1000&_t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.programs || [])
        
        // Calculate stats
        const total = data.programs?.length || 0
        const active = data.programs?.filter((program: Program) => program.isActive).length || 0
        const featured = data.programs?.filter((program: Program) => program.isFeatured).length || 0
        const deptCount = new Set(data.programs?.map((program: Program) => program.department?.id).filter(Boolean) || []).size
        
        setStats({ total, active, featured, departments: deptCount })
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (program: Program) => {
    setProgramToDelete({ id: program.id, name: program.name })
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async (permanent: boolean) => {
    if (!programToDelete) return
    
    setIsDeleting(true)
    try {
      const endpoint = permanent 
        ? '/api/recycle-bin/permanent-delete'
        : `/api/programs/${programToDelete.id}`
      
      const body = permanent 
        ? JSON.stringify({ itemType: 'program', itemId: programToDelete.id })
        : undefined
      
      const response = await fetch(endpoint, {
        method: permanent ? 'POST' : 'DELETE',
        headers: permanent ? { 'Content-Type': 'application/json' } : undefined,
        body
      })
      
      if (response.ok) {
        // Immediately remove from UI
        setPrograms(programs.filter(program => program.id !== programToDelete.id))
        
        // Wait a bit then refresh to ensure backend is updated
        setTimeout(() => {
          fetchPrograms()
        }, 100)
        
        alert(permanent ? 'Program permanently deleted' : 'Program moved to Recycle Bin')
      } else {
        const error = await response.json()
        alert(`Failed to delete program: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting program:', error)
      alert('Failed to delete program')
    } finally {
      setIsDeleting(false)
      setProgramToDelete(null)
    }
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (program.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (program.degree?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && program.isActive) ||
                         (filterStatus === 'inactive' && !program.isActive)
    const matchesDepartment = filterDepartment === 'all' || program.department?.id === filterDepartment
    
    return matchesSearch && matchesStatus && matchesDepartment
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'degree':
        return (a.degree || '').localeCompare(b.degree || '')
      case 'department':
        return (a.department?.name || '').localeCompare(b.department?.name || '')
      case 'duration':
        return (a.duration || '').localeCompare(b.duration || '')
      default:
        return 0
    }
  })

  // Get unique departments from fetched departments list
  const uniqueDepartments = departments

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Programs...</p>
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
            <BookOpenIcon className="h-8 w-8 text-blue-600 mr-3" />
            Programs Management
          </h1>
          <p className="mt-2 text-gray-600">Manage academic programs and courses</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/programs/create')}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Program
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
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
              <StarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <BuildingOfficeIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
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
                placeholder="Search programs..."
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
                <option value="all">All Programs</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Course Category Filter */}
            <div className="relative">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Course Categories</option>
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
              <option value="degree">Degree</option>
              <option value="department">Department</option>
              <option value="duration">Duration</option>
            </select>
            <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first academic program.</p>
            <button
              onClick={() => router.push('/dashboard/programs/create')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Program
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Featured Image */}
                  <div className="flex-shrink-0">
                    {program.featuredImage ? (
                      <img
                        src={program.featuredImage}
                        alt={program.name}
                        className="h-20 w-20 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-200 rounded-xl flex items-center justify-center">
                        <BookOpenIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Program Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {program.name}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{program.shortDescription}</p>
                        
                        {/* Program Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {program.degree}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {program.duration}
                          </div>
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            {program.department?.name || 'No Category'}
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          {program.isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <AcademicCapIcon className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                          {program.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <StarIcon className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/programs/${program.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(program)}
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

      {/* Delete Confirmation Modal */}
      {programToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setProgramToDelete(null)
          }}
          onConfirm={handleDeleteConfirm}
          itemName={programToDelete.name}
          itemType="program"
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
