'use client'

import { useState, useEffect } from 'react'
import { 
  PlayIcon, 
  PhotoIcon, 
  PencilIcon, 
  EyeIcon, 
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  mediaType: 'image' | 'video'
  mediaUrl: string
  ctaText: string
  ctaLink: string
  isActive: boolean
  order: number
}

const initialSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Welcome to JRIIT',
    subtitle: 'Empowering Future Technology Leaders',
    description: 'Join us in shaping the future of technology through innovative education and cutting-edge programs.',
    mediaType: 'video',
    mediaUrl: '/assets/JR INSTITUTE DRONE.mp4',
    ctaText: 'Explore Programs',
    ctaLink: '/programs',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    title: 'Excellence in Education',
    subtitle: 'Leading the Way in IT Education',
    description: 'Discover our world-class programs in Computer Science, Cybersecurity, and Information Technology.',
    mediaType: 'image',
    mediaUrl: '/assets/hero-img-1.jpg',
    ctaText: 'Apply Now',
    ctaLink: '/admission',
    isActive: true,
    order: 2
  },
  {
    id: '3',
    title: 'Innovation Hub',
    subtitle: 'Where Ideas Come to Life',
    description: 'Experience hands-on learning with state-of-the-art facilities and industry partnerships.',
    mediaType: 'image',
    mediaUrl: '/assets/hero-img-2.jpg',
    ctaText: 'Campus Tour',
    ctaLink: '/campus-tour',
    isActive: false,
    order: 3
  }
]

export default function HeroManagement() {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async (slide: HeroSlide) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingSlide) {
      setSlides(prev => prev.map(s => s.id === slide.id ? slide : s))
    } else {
      setSlides(prev => [...prev, { ...slide, id: Date.now().toString() }])
    }
    
    setEditingSlide(null)
    setLoading(false)
  }

  const handleDelete = (id: string) => {
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    setSlides(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const index = sorted.findIndex(s => s.id === id)
      
      if (direction === 'up' && index > 0) {
        [sorted[index], sorted[index - 1]] = [sorted[index - 1], sorted[index]]
      } else if (direction === 'down' && index < sorted.length - 1) {
        [sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]]
      }
      
      return sorted.map((slide, i) => ({ ...slide, order: i + 1 }))
    })
  }

  const toggleActive = (id: string) => {
    setSlides(prev => prev.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Section Management</h1>
            <p className="text-gray-600 mt-1">Manage your homepage hero slides and banners</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button 
              onClick={() => setEditingSlide({
                id: '',
                title: '',
                subtitle: '',
                description: '',
                mediaType: 'image',
                mediaUrl: '',
                ctaText: '',
                ctaLink: '',
                isActive: true,
                order: slides.length + 1
              })}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Slide
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            {slides.filter(s => s.isActive).length > 0 ? (
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-4">
                      {slides.filter(s => s.isActive)[0]?.title}
                    </h2>
                    <p className="text-xl mb-6">
                      {slides.filter(s => s.isActive)[0]?.subtitle}
                    </p>
                    <p className="text-lg mb-8 max-w-2xl">
                      {slides.filter(s => s.isActive)[0]?.description}
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
                      {slides.filter(s => s.isActive)[0]?.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <PlayIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>No active slides to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        {slides
          .sort((a, b) => a.order - b.order)
          .map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    {slide.mediaType === 'video' ? (
                      <PlayIcon className="h-8 w-8 text-gray-400" />
                    ) : (
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{slide.title}</h3>
                    <span className="text-sm text-gray-500">#{slide.order}</span>
                    {slide.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{slide.subtitle}</p>
                  <p className="text-sm text-gray-500 mb-3">{slide.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Media: {slide.mediaType}</span>
                    <span>CTA: {slide.ctaText}</span>
                    <span>Link: {slide.ctaLink}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReorder(slide.id, 'up')}
                  disabled={index === 0}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUpIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleReorder(slide.id, 'down')}
                  disabled={index === slides.length - 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDownIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleActive(slide.id)}
                  className={`p-2 rounded-lg ${
                    slide.isActive 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingSlide(slide)}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setEditingSlide(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingSlide.id ? 'Edit Slide' : 'Add New Slide'}
                  </h3>
                  <button
                    onClick={() => setEditingSlide(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleSave(editingSlide)
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingSlide.title}
                      onChange={(e) => setEditingSlide({...editingSlide, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={editingSlide.subtitle}
                      onChange={(e) => setEditingSlide({...editingSlide, subtitle: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingSlide.description}
                      onChange={(e) => setEditingSlide({...editingSlide, description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                    <select
                      value={editingSlide.mediaType}
                      onChange={(e) => setEditingSlide({...editingSlide, mediaType: e.target.value as 'image' | 'video'})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
                    <input
                      type="url"
                      value={editingSlide.mediaUrl}
                      onChange={(e) => setEditingSlide({...editingSlide, mediaUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                      <input
                        type="text"
                        value={editingSlide.ctaText}
                        onChange={(e) => setEditingSlide({...editingSlide, ctaText: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                      <input
                        type="text"
                        value={editingSlide.ctaLink}
                        onChange={(e) => setEditingSlide({...editingSlide, ctaLink: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingSlide.isActive}
                      onChange={(e) => setEditingSlide({...editingSlide, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active (visible on homepage)
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingSlide(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Slide'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

