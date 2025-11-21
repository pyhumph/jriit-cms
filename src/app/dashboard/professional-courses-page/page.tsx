'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface BenefitCard {
  icon: string
  title: string
  description: string
}

export default function ProfessionalCoursesPageEditor() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Hero Section
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')

  // Choose Your Path Section
  const [pathTitle, setPathTitle] = useState('Choose Your Professional Path')
  const [pathDescription, setPathDescription] = useState('Our professional courses are designed in partnership with industry leaders to provide you with the most current and relevant skills.')

  // Why Choose Section
  const [whyChooseTitle, setWhyChooseTitle] = useState('Why Choose Professional Certifications?')
  const [whyChooseDescription, setWhyChooseDescription] = useState('Professional certifications validate your expertise and open doors to new career opportunities.')

  // Benefit Cards
  const [benefitCards, setBenefitCards] = useState<BenefitCard[]>([
    {
      icon: 'FaGlobe',
      title: 'Global Recognition',
      description: 'Industry-standard certifications recognized worldwide by employers and organizations.'
    },
    {
      icon: 'FaNetworkWired',
      title: 'Career Advancement',
      description: 'Boost your career prospects with specialized skills and knowledge in high-demand areas.'
    },
    {
      icon: 'FaShieldAlt',
      title: 'Expert Training',
      description: 'Learn from industry experts with hands-on experience and real-world scenarios.'
    }
  ])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      fetchPageContent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  const fetchPageContent = async () => {
    try {
      setLoading(true)

      // Fetch hero section
      const heroResponse = await fetch('/api/page-components?pageName=professional-course&componentName=header')
      if (heroResponse.ok) {
        const heroData = await heroResponse.json()
        if (heroData.success && heroData.components && heroData.components.length > 0) {
          const hero = heroData.components[0]
          setHeroTitle(hero.title || '')
          setHeroSubtitle(hero.content || '')
        }
      }

      // Fetch "Choose Your Path" section
      const pathResponse = await fetch('/api/page-components?pageName=professional-course&componentName=choose-path')
      if (pathResponse.ok) {
        const pathData = await pathResponse.json()
        if (pathData.success && pathData.components && pathData.components.length > 0) {
          const path = pathData.components[0]
          setPathTitle(path.title || 'Choose Your Professional Path')
          setPathDescription(path.content || '')
        }
      }

      // Fetch "Why Choose" section
      const whyResponse = await fetch('/api/page-components?pageName=professional-course&componentName=why-choose')
      if (whyResponse.ok) {
        const whyData = await whyResponse.json()
        if (whyData.success && whyData.components && whyData.components.length > 0) {
          const why = whyData.components[0]
          setWhyChooseTitle(why.title || 'Why Choose Professional Certifications?')
          setWhyChooseDescription(why.content || '')
          
          // Parse benefit cards from settings
          if (why.settings) {
            try {
              const settings = typeof why.settings === 'string' ? JSON.parse(why.settings) : why.settings
              if (settings.benefitCards && Array.isArray(settings.benefitCards)) {
                setBenefitCards(settings.benefitCards)
              }
            } catch (e) {
              console.error('Error parsing benefit cards:', e)
            }
          }
        }
      }

    } catch (error) {
      console.error('Error fetching page content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Save hero section
      await saveOrUpdateComponent('header', {
        title: heroTitle,
        content: heroSubtitle
      })

      // Save "Choose Your Path" section
      await saveOrUpdateComponent('choose-path', {
        title: pathTitle,
        content: pathDescription
      })

      // Save "Why Choose" section with benefit cards
      await saveOrUpdateComponent('why-choose', {
        title: whyChooseTitle,
        content: whyChooseDescription,
        settings: JSON.stringify({ benefitCards })
      })

      setNotification({ type: 'success', message: 'Professional Courses page content saved successfully!' })
      setTimeout(() => setNotification(null), 5000)
      fetchPageContent() // Refresh
    } catch (error) {
      console.error('Error saving:', error)
      setNotification({ type: 'error', message: 'Failed to save page content' })
      setTimeout(() => setNotification(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const saveOrUpdateComponent = async (componentName: string, data: any) => {
    // First, check if component exists
    const checkResponse = await fetch(`/api/page-components?pageName=professional-course&componentName=${componentName}`)
    const checkData = await checkResponse.json()

    if (checkData.success && checkData.components && checkData.components.length > 0) {
      // Update existing
      const componentId = checkData.components[0].id
      await fetch(`/api/page-components/${componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageName: 'professional-course',
          componentName,
          ...data,
          isActive: true
        })
      })
    } else {
      // Create new
      await fetch('/api/page-components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageName: 'professional-course',
          componentName,
          ...data,
          isActive: true,
          order: 0
        })
      })
    }
  }

  const updateBenefitCard = (index: number, field: keyof BenefitCard, value: string) => {
    const updated = [...benefitCards]
    updated[index] = { ...updated[index], [field]: value }
    setBenefitCards(updated)
  }

  const addBenefitCard = () => {
    setBenefitCards([...benefitCards, { icon: 'FaStar', title: '', description: '' }])
  }

  const removeBenefitCard = (index: number) => {
    setBenefitCards(benefitCards.filter((_, i) => i !== index))
  }

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
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in ${
          notification.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div>
            {notification.type === 'success' ? (
              <CheckIcon className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <span className="font-medium">{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-4 hover:opacity-80"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professional Courses Page Editor</h1>
          <p className="text-gray-600 mt-2">Edit the content sections for the Professional Courses landing page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Hero Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Professional Courses"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Industry-recognized certifications and training programs..."
              />
            </div>
          </div>
        </div>

        {/* Choose Your Path Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Choose Your Professional Path Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={pathTitle}
                onChange={(e) => setPathTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description
              </label>
              <textarea
                value={pathDescription}
                onChange={(e) => setPathDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Why Choose Professional Certifications Section</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={whyChooseTitle}
                onChange={(e) => setWhyChooseTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description
              </label>
              <textarea
                value={whyChooseDescription}
                onChange={(e) => setWhyChooseDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Benefit Cards */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Benefit Cards</h3>
                <button
                  onClick={addBenefitCard}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Card
                </button>
              </div>

              <div className="space-y-4">
                {benefitCards.map((card, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-800">Card {index + 1}</h4>
                      <button
                        onClick={() => removeBenefitCard(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon (React Icon Name)
                        </label>
                        <input
                          type="text"
                          value={card.icon}
                          onChange={(e) => updateBenefitCard(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="FaGlobe, FaShieldAlt, etc."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Available icons: FaGlobe, FaNetworkWired, FaShieldAlt, FaCertificate, FaStar, FaTrophy, FaUsers, FaLightbulb
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updateBenefitCard(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Global Recognition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={card.description}
                          onChange={(e) => updateBenefitCard(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Industry-standard certifications recognized worldwide..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

