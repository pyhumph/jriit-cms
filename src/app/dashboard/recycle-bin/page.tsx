'use client'

import { useState, useEffect } from 'react'
import { TrashIcon, ArrowPathIcon, ExclamationTriangleIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface RecycleBinItem {
  id: string
  itemType: string
  itemName: string
  deletedAt: string
  deletedBy?: string
}

export default function RecycleBinPage() {
  const [items, setItems] = useState<RecycleBinItem[]>([])
  const [filteredItems, setFilteredItems] = useState<RecycleBinItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    fetchRecycleBinItems()
  }, [])

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredItems(items)
    } else {
      setFilteredItems(items.filter(item => item.itemType === filterType))
    }
  }, [filterType, items])

  const fetchRecycleBinItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recycle-bin')
      const data = await response.json()
      
      if (data.success) {
        setItems(data.items)
        setFilteredItems(data.items)
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch recycle bin:', error)
      setLoading(false)
    }
  }

  const handleRestore = async (itemType: string, itemId: string, itemName: string) => {
    if (!confirm(`Restore "${itemName}"?`)) return

    try {
      const response = await fetch('/api/recycle-bin/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemId })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('Item restored successfully!')
        fetchRecycleBinItems() // Refresh list
      } else {
        alert(`Failed to restore item: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Restore error:', error)
      alert('Failed to restore item')
    }
  }

  const handlePermanentDelete = async (itemType: string, itemId: string, itemName: string) => {
    if (!confirm(`⚠️ PERMANENTLY DELETE "${itemName}"?\n\nThis action cannot be undone!`)) return

    try {
      const response = await fetch('/api/recycle-bin/permanent-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemId })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('Item permanently deleted')
        fetchRecycleBinItems() // Refresh list
      } else {
        alert(`Failed to delete item: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete item')
    }
  }

  const getItemTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'program': 'Program',
      'department': 'Department',
      'faculty': 'Faculty',
      'page': 'Page',
      'media': 'Media',
      'news': 'News',
      'event': 'Event',
      'homepage-component': 'Homepage Component',
      'page-component': 'Page Component',
      'post': 'Post',
      'hero-slide': 'Hero Slide'
    }
    return labels[type] || type
  }

  const getItemTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'program': 'bg-blue-100 text-blue-800',
      'department': 'bg-indigo-100 text-indigo-800',
      'faculty': 'bg-cyan-100 text-cyan-800',
      'page': 'bg-green-100 text-green-800',
      'media': 'bg-purple-100 text-purple-800',
      'news': 'bg-yellow-100 text-yellow-800',
      'event': 'bg-pink-100 text-pink-800',
      'homepage-component': 'bg-orange-100 text-orange-800',
      'page-component': 'bg-teal-100 text-teal-800',
      'post': 'bg-lime-100 text-lime-800',
      'hero-slide': 'bg-rose-100 text-rose-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const uniqueTypes = Array.from(new Set(items.map(item => item.itemType)))

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <TrashIcon className="mr-2 h-8 w-8" />
          Recycle Bin
        </h1>
        <p className="text-gray-600">
          Deleted items are stored here. You can restore or permanently delete them.
        </p>
      </div>

      {/* Filter */}
      {items.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types ({items.length})</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {getItemTypeLabel(type)} ({items.filter(item => item.itemType === type).length})
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <TrashIcon className="mx-auto mb-4 w-16 h-16 text-gray-300" />
          <p className="text-lg font-medium">
            {filterType === 'all' ? 'Recycle bin is empty' : `No ${getItemTypeLabel(filterType).toLowerCase()} items in recycle bin`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deleted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={`${item.itemType}-${item.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getItemTypeColor(item.itemType)}`}>
                      {getItemTypeLabel(item.itemType)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-md">
                      {item.itemName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.deletedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleRestore(item.itemType, item.id, item.itemName)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        <ArrowPathIcon className="w-4 h-4 mr-1" />
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item.itemType, item.id, item.itemName)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        Delete Forever
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

