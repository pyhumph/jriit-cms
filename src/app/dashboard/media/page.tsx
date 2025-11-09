'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface MediaItem {
  id: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string | null
  type: string
  mimeType: string
  size: number
  width?: number | null
  height?: number | null
  altText?: string | null
  caption?: string | null
  createdAt: string
  uploader?: {
    id: string
    name: string
    email: string
  }
}

export default function MediaLibraryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session) {
      fetchMedia()
    }
  }, [session, status, router])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      // Only filter by type on server-side, search is done client-side for instant feedback
      if (selectedType !== 'all') {
        params.append('type', selectedType)
      }
      params.append('limit', '100')

      const response = await fetch(`/api/media?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setMedia(data.media || [])
      } else {
        console.error('Failed to fetch media')
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  // Refetch when type changes (but not on every search query change)
  useEffect(() => {
    if (session) {
      fetchMedia()
    }
    // Only refetch when type changes, not on search query changes
    // Search is handled client-side for instant feedback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType])

  // Handle file upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        // Refresh media list
        await fetchMedia()
        alert('Image uploaded successfully!')
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  // Handle delete
  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMedia()
        alert('Image deleted successfully!')
      } else {
        const error = await response.json()
        alert('Delete failed: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Delete failed. Please try again.')
    }
  }

  // Filter media by search query and type (client-side for instant feedback)
  const filteredMedia = media.filter((item) => {
    // Filter by type first
    if (selectedType !== 'all' && item.type !== selectedType) {
      return false
    }
    
    // Then filter by search query
    if (searchQuery) {
      const search = searchQuery.toLowerCase()
      return (
        item.originalName.toLowerCase().includes(search) ||
        item.filename.toLowerCase().includes(search) ||
        (item.altText && item.altText?.toLowerCase().includes(search)) ||
        (item.caption && item.caption?.toLowerCase().includes(search))
      )
    }
    return true
  })

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading media library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
        <p className="text-gray-600">Manage your uploaded images and files</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Upload Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <div
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>Upload Image</span>
              </>
            )}
          </div>
        </label>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="IMAGE">Images Only</option>
            <option value="DOCUMENT">Documents</option>
            <option value="VIDEO">Videos</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="text-gray-600 text-sm">
          Total: <span className="font-semibold">{media.length}</span> items
          {filteredMedia.length !== media.length && (
            <span className="ml-2">
              (Showing: <span className="font-semibold">{filteredMedia.length}</span>)
            </span>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading media...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery ? 'No images found' : 'No images uploaded yet'}
          </p>
          {!searchQuery && (
            <p className="text-sm text-gray-400">
              Click "Upload Image" to add your first image
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 group">
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.altText || item.originalName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EBroken%3C/text%3E%3C/svg%3E'
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.url)
                      alert('URL copied to clipboard!')
                    }}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors mr-2"
                  >
                    Copy URL
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="p-3 space-y-2">
                <div
                  className="font-medium text-sm truncate"
                  title={item.originalName}
                >
                  {item.originalName}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatSize(item.size)}</span>
                  {item.width && item.height && (
                    <span>
                      {item.width} × {item.height}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(item.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.url)
                      alert('URL copied to clipboard!')
                    }}
                    className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.originalName)}
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
