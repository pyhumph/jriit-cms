'use client'

import { useState, useEffect } from 'react'

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

interface MediaItem {
  id: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string | null
  type: string
  mimeType: string
  size: number
  altText?: string | null
  caption?: string | null
  createdAt: string
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)

  // Load media library when modal opens
  useEffect(() => {
    if (showMediaLibrary) {
      loadMediaLibrary()
    }
  }, [showMediaLibrary])

  const loadMediaLibrary = async () => {
    setLoadingMedia(true)
    try {
      const response = await fetch('/api/media?type=IMAGE&limit=100')
      if (response.ok) {
        const data = await response.json()
        setMedia(data.media || [])
      }
    } catch (error) {
      console.error('Error loading media library:', error)
    } finally {
      setLoadingMedia(false)
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (data.success && data.url) {
        onChange(data.url)
        // Reload media library to show new upload
        if (showMediaLibrary) {
          loadMediaLibrary()
        }
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

  // Handle URL input
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
    }
  }

  // Get image preview URL (handle both relative and absolute URLs)
  const getImageUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    // For relative paths, assume they're from the CMS
    if (url.startsWith('/uploads/')) {
      return url // Will be served from public folder
    }
    return url
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={getImageUrl(value)}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E'
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Three Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1: Upload from Computer */}
        <div>
          <label className="block w-full cursor-pointer">
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                uploading
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <div className="text-gray-600">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-8 h-8 mx-auto mb-2 text-gray-400"
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
                    <div className="font-medium">Upload Image</div>
                    <div className="text-xs text-gray-500 mt-1">From computer</div>
                  </>
                )}
              </div>
            </div>
          </label>
        </div>

        {/* Option 2: Enter URL */}
        <div>
          <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit()
                }
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Use URL
            </button>
          </div>
        </div>

        {/* Option 3: Media Library */}
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowMediaLibrary(true)
            }}
            className="w-full border-2 border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg
              className="w-8 h-8 mx-auto mb-2 text-gray-400"
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
            <div className="font-medium text-gray-600">Media Library</div>
            <div className="text-xs text-gray-500 mt-1">Choose existing</div>
          </button>
        </div>
      </div>

      {/* Current Value Display */}
      {value && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <span className="font-medium">Current:</span>{' '}
          <code className="bg-white px-2 py-1 rounded border text-xs break-all">
            {value}
          </code>
        </div>
      )}

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibraryModal
          media={media}
          loading={loadingMedia}
          onSelect={(url) => {
            onChange(url)
            setShowMediaLibrary(false)
          }}
          onClose={() => setShowMediaLibrary(false)}
          onRefresh={loadMediaLibrary}
        />
      )}
    </div>
  )
}

// Media Library Modal Component
function MediaLibraryModal({
  media,
  loading,
  onSelect,
  onClose,
  onRefresh,
}: {
  media: MediaItem[]
  loading: boolean
  onSelect: (url: string) => void
  onClose: () => void
  onRefresh: () => void
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMedia = media.filter((item) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      item.originalName.toLowerCase().includes(search) ||
      item.filename.toLowerCase().includes(search) ||
      (item.altText && item.altText.toLowerCase().includes(search)) ||
      (item.caption && item.caption.toLowerCase().includes(search))
    )
  })

  const handleImageSelect = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onSelect(url)
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the content
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select an image to use
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search images..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No images found' : 'No images in library'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-gray-400">
                  Upload images using the &quot;Upload Image&quot; option
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => handleImageSelect(item.url, e)}
                  className="cursor-pointer group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-all hover:shadow-lg"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.altText || item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onDragStart={(e) => e.preventDefault()}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EBroken%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    {item.caption && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRefresh()
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

