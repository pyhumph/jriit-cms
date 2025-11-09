'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import ImagePicker from '@/components/ImagePicker'

interface Department {
  id: string
  name: string
  slug: string
}

interface LearningItem {
  icon: string
  title: string
  description: string
  color?: string
}

interface Program {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  duration: string | null
  degree: string | null
  departmentId: string | null
  requirements: string | null
  curriculum: string | null
  careerOpportunities: string | null
  featuredImage: string | null
  isActive: boolean
  isFeatured: boolean
  order: number
  department: {
    id: string
    name: string
  } | null
  // Detail page fields
  detailPageLayout?: string | null
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImage?: string | null
  overviewTitle?: string | null
  overviewContent?: string | null
  learningTitle?: string | null
  learningItems?: string | null
  modulesTitle?: string | null
  modules?: string | null
  detailsDuration?: string | null
  detailsFormat?: string | null
  detailsSchedule?: string | null
  detailsPrerequisites?: string | null
  careerTitle?: string | null
  careerOpportunitiesJson?: string | null
  ctaTitle?: string | null
  ctaDescription?: string | null
  customContent?: string | null
}

const COURSE_CATEGORIES = [
  'Information Technology',
  'Cyber Security',
  'Computer Science',
  'Computer Engineering',
  'Electronics & Telecommunications',
  'Business Administration',
  'Accountancy',
  'Travel & Tourism Management',
  'Short Courses',
  'Professional Courses',
]

const LAYOUT_OPTIONS = [
  { value: 'standard', label: 'Standard Layout' },
  { value: 'custom-applications', label: 'Custom Applications (MS Office)' },
  { value: 'custom-adobe', label: 'Custom Adobe' },
]

export default function EditProgramPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const programId = params.id as string

  const [activeTab, setActiveTab] = useState<'basic' | 'detail'>('basic')
  const [departments, setDepartments] = useState<Department[]>([])
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    duration: '',
    degree: '',
    departmentId: '',
    courseCategory: '',
    requirements: '',
    curriculum: '',
    careerOpportunities: '',
    featuredImage: '',
    isActive: true,
    isFeatured: false,
    order: 0,
  })

  // Custom content interfaces
  interface Application {
    icon: string
    name: string
    description: string
    features: string[]
    color?: string
  }

  interface SkillLevel {
    title: string
    duration: string
    apps: string[]
  }

  interface HeroApplication {
    name: string
    icon: string
    slug: string
    color?: string
  }

  interface ApplicationCard {
    name: string
    icon: string
    description: string
    features: string[]
    color?: string
  }

  interface LearningLevel {
    level: string
    duration: string
    modules: string[]
  }

  // Detail page content state
  const [detailPageData, setDetailPageData] = useState({
    detailPageLayout: 'standard' as 'standard' | 'custom-applications' | 'custom-adobe',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    overviewTitle: 'Program Overview',
    overviewContent: '',
    learningTitle: "What You'll Learn",
    learningItems: [] as LearningItem[],
    modulesTitle: 'Course Modules',
    modules: [] as string[],
    detailsDuration: '',
    detailsFormat: '',
    detailsSchedule: '',
    detailsPrerequisites: '',
    careerTitle: 'Career Opportunities',
    careerOpportunities: [] as string[],
    ctaTitle: 'Ready to Start?',
    ctaDescription: '',
    // Custom content (parsed from JSON) - legacy
    applications: [] as Application[],
    skillLevels: [] as SkillLevel[],
    // New custom layout fields
    heroApplications: [] as HeroApplication[],
    suiteTitle: '',
    suiteDescription: '',
    applicationCards: [] as ApplicationCard[],
    learningPathTitle: '',
    learningPathDesc: '',
    learningLevels: [] as LearningLevel[],
  })

  // Track if we've already loaded the program to prevent refetching on tab switch
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    // Only fetch if we have a session, programId, and haven't loaded yet
    if (session && programId && !hasLoaded) {
      fetchProgram()
      fetchDepartments()
      setHasLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, programId])

  // Debug: Log when detailPageData changes
  useEffect(() => {
    console.log('Dashboard: detailPageData state changed:', {
      detailPageLayout: detailPageData.detailPageLayout,
      heroTitle: detailPageData.heroTitle ? `"${detailPageData.heroTitle.substring(0, 30)}..."` : 'EMPTY',
      overviewContent: detailPageData.overviewContent ? `HAS_CONTENT (${detailPageData.overviewContent.length} chars)` : 'EMPTY',
      learningItemsCount: detailPageData.learningItems.length,
      modulesCount: detailPageData.modules.length,
      careerOpportunitiesCount: detailPageData.careerOpportunities.length,
    })
  }, [detailPageData])

  const fetchProgram = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/programs/${programId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.program) {
          const prog = data.program
          
          // Debug: Log what we received
          console.log('Dashboard: Program fetched from API')
          console.log('  slug:', prog.slug)
          console.log('  detailPageLayout:', prog.detailPageLayout)
          console.log('  heroTitle:', prog.heroTitle ? `"${prog.heroTitle.substring(0, 50)}..."` : 'NULL')
          console.log('  overviewContent:', prog.overviewContent ? `HAS_CONTENT (${prog.overviewContent.length} chars)` : 'NULL')
          console.log('  learningItems:', prog.learningItems ? 'HAS_CONTENT' : 'NULL')
          console.log('  modules:', prog.modules ? 'HAS_CONTENT' : 'NULL')
          console.log('  customContent:', prog.customContent ? 'HAS_CONTENT' : 'NULL')
          
          setProgram(prog)
          
          // Basic form data
          setFormData({
            name: prog.name || '',
            slug: prog.slug || '',
            shortDescription: prog.shortDescription || '',
            description: prog.description || '',
            duration: prog.duration || '',
            degree: prog.degree || '',
            departmentId: prog.departmentId || '',
            courseCategory: prog.department?.name || '',
            requirements: prog.requirements || '',
            curriculum: prog.curriculum || '',
            careerOpportunities: prog.careerOpportunities || '',
            featuredImage: prog.featuredImage || '',
            isActive: prog.isActive ?? true,
            isFeatured: prog.isFeatured ?? false,
            order: prog.order || 0,
          })

          // Detail page data - Parse JSON fields and populate form
          try {
            const learningItems = prog.learningItems ? JSON.parse(prog.learningItems) : []
            const modules = prog.modules ? JSON.parse(prog.modules) : []
            const careerOpportunities = prog.careerOpportunitiesJson ? JSON.parse(prog.careerOpportunitiesJson) : []
            
            // Parse customContent for custom layouts (legacy)
            let applications: Application[] = []
            let skillLevels: SkillLevel[] = []
            if (prog.customContent) {
              try {
                const customContent = typeof prog.customContent === 'string' 
                  ? JSON.parse(prog.customContent) 
                  : prog.customContent
                applications = Array.isArray(customContent.applications) ? customContent.applications : []
                skillLevels = Array.isArray(customContent.skillLevels) ? customContent.skillLevels : []
              } catch (e) {
                console.error('Error parsing customContent:', e)
              }
            }

            // Parse new custom layout fields
            let heroApplications: HeroApplication[] = []
            let applicationCards: ApplicationCard[] = []
            let learningLevels: LearningLevel[] = []
            
            if (prog.heroApplications) {
              try {
                heroApplications = Array.isArray(JSON.parse(prog.heroApplications)) 
                  ? JSON.parse(prog.heroApplications) 
                  : []
              } catch (e) {
                console.error('Error parsing heroApplications:', e)
              }
            }

            if (prog.applicationCards) {
              try {
                applicationCards = Array.isArray(JSON.parse(prog.applicationCards)) 
                  ? JSON.parse(prog.applicationCards) 
                  : []
              } catch (e) {
                console.error('Error parsing applicationCards:', e)
              }
            }

            if (prog.learningLevels) {
              try {
                learningLevels = Array.isArray(JSON.parse(prog.learningLevels)) 
                  ? JSON.parse(prog.learningLevels) 
                  : []
              } catch (e) {
                console.error('Error parsing learningLevels:', e)
              }
            }
            
            const detailData = {
              detailPageLayout: (prog.detailPageLayout as any) || 'standard',
              heroTitle: prog.heroTitle || '',
              heroSubtitle: prog.heroSubtitle || '',
              heroImage: prog.heroImage || '',
              overviewTitle: prog.overviewTitle || 'Program Overview',
              overviewContent: prog.overviewContent || '',
              learningTitle: prog.learningTitle || "What You'll Learn",
              learningItems: Array.isArray(learningItems) ? learningItems : [],
              modulesTitle: prog.modulesTitle || 'Course Modules',
              modules: Array.isArray(modules) ? modules : [],
              detailsDuration: prog.detailsDuration || '',
              detailsFormat: prog.detailsFormat || '',
              detailsSchedule: prog.detailsSchedule || '',
              detailsPrerequisites: prog.detailsPrerequisites || '',
              careerTitle: prog.careerTitle || 'Career Opportunities',
              careerOpportunities: Array.isArray(careerOpportunities) ? careerOpportunities : [],
              ctaTitle: prog.ctaTitle || 'Ready to Start?',
              ctaDescription: prog.ctaDescription || '',
              // Legacy custom content
              applications: applications,
              skillLevels: skillLevels,
              // New custom layout fields
              heroApplications: heroApplications,
              suiteTitle: prog.suiteTitle || '',
              suiteDescription: prog.suiteDescription || '',
              applicationCards: applicationCards,
              learningPathTitle: prog.learningPathTitle || '',
              learningPathDesc: prog.learningPathDesc || '',
              learningLevels: learningLevels,
            }
            
            console.log('Dashboard: Setting detail page data:', {
              detailPageLayout: detailData.detailPageLayout,
              heroTitle: detailData.heroTitle ? `"${detailData.heroTitle.substring(0, 30)}..."` : 'EMPTY',
              learningItemsCount: detailData.learningItems.length,
              modulesCount: detailData.modules.length,
            })
            
            setDetailPageData(detailData)
          } catch (e) {
            console.error('Error parsing detail page JSON:', e)
            console.error('Raw learningItems:', prog.learningItems)
            console.error('Raw modules:', prog.modules)
          }
        } else {
          console.error('API response missing program:', data)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error:', response.status, errorData)
        setStatusMessage({ type: 'error', message: `Failed to load program: ${errorData.error || response.statusText}` })
      }
    } catch (error) {
      console.error('Error fetching program:', error)
      setStatusMessage({ type: 'error', message: 'Failed to load program' })
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleCourseCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      courseCategory: category,
    }))
    
    const dept = departments.find(d => d.name === category)
    if (dept) {
      setFormData(prev => ({
        ...prev,
        departmentId: dept.id,
      }))
    }
  }

  const addLearningItem = () => {
    setDetailPageData(prev => ({
      ...prev,
      learningItems: [...prev.learningItems, { icon: '', title: '', description: '', color: 'blue' }],
    }))
  }

  const removeLearningItem = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      learningItems: prev.learningItems.filter((_, i) => i !== index),
    }))
  }

  const updateLearningItem = (index: number, field: keyof LearningItem, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      learningItems: prev.learningItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const addModule = () => {
    setDetailPageData(prev => ({
      ...prev,
      modules: [...prev.modules, ''],
    }))
  }

  const removeModule = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }))
  }

  const updateModule = (index: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      modules: prev.modules.map((m, i) => (i === index ? value : m)),
    }))
  }

  const addCareerOpportunity = () => {
    setDetailPageData(prev => ({
      ...prev,
      careerOpportunities: [...prev.careerOpportunities, ''],
    }))
  }

  const removeCareerOpportunity = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities.filter((_, i) => i !== index),
    }))
  }

  const updateCareerOpportunity = (index: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities.map((c, i) => (i === index ? value : c)),
    }))
  }

  // Custom content helper functions
  const addApplication = () => {
    setDetailPageData(prev => ({
      ...prev,
      applications: [...prev.applications, { icon: '', name: '', description: '', features: [], color: 'blue' }],
    }))
  }

  const removeApplication = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      applications: prev.applications.filter((_, i) => i !== index),
    }))
  }

  const updateApplication = (index: number, field: keyof Application, value: string | string[]) => {
    setDetailPageData(prev => ({
      ...prev,
      applications: prev.applications.map((app, i) =>
        i === index ? { ...app, [field]: value } : app
      ),
    }))
  }

  const addApplicationFeature = (appIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      applications: prev.applications.map((app, i) =>
        i === appIndex ? { ...app, features: [...app.features, ''] } : app
      ),
    }))
  }

  const removeApplicationFeature = (appIndex: number, featureIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      applications: prev.applications.map((app, i) =>
        i === appIndex
          ? { ...app, features: app.features.filter((_, fi) => fi !== featureIndex) }
          : app
      ),
    }))
  }

  const updateApplicationFeature = (appIndex: number, featureIndex: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      applications: prev.applications.map((app, i) =>
        i === appIndex
          ? { ...app, features: app.features.map((f, fi) => (fi === featureIndex ? value : f)) }
          : app
      ),
    }))
  }

  const addSkillLevel = () => {
    setDetailPageData(prev => ({
      ...prev,
      skillLevels: [...prev.skillLevels, { title: '', duration: '', apps: [] }],
    }))
  }

  const removeSkillLevel = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      skillLevels: prev.skillLevels.filter((_, i) => i !== index),
    }))
  }

  const updateSkillLevel = (index: number, field: keyof SkillLevel, value: string | string[]) => {
    setDetailPageData(prev => ({
      ...prev,
      skillLevels: prev.skillLevels.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      ),
    }))
  }

  const addSkillLevelApp = (levelIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      skillLevels: prev.skillLevels.map((level, i) =>
        i === levelIndex ? { ...level, apps: [...level.apps, ''] } : level
      ),
    }))
  }

  const removeSkillLevelApp = (levelIndex: number, appIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      skillLevels: prev.skillLevels.map((level, i) =>
        i === levelIndex
          ? { ...level, apps: level.apps.filter((_, ai) => ai !== appIndex) }
          : level
      ),
    }))
  }

  const updateSkillLevelApp = (levelIndex: number, appIndex: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      skillLevels: prev.skillLevels.map((level, i) =>
        i === levelIndex
          ? { ...level, apps: level.apps.map((a, ai) => (ai === appIndex ? value : a)) }
          : level
      ),
    }))
  }

  // New custom layout helper functions
  const addHeroApplication = () => {
    setDetailPageData(prev => ({
      ...prev,
      heroApplications: [...prev.heroApplications, { name: '', icon: '', slug: '', color: 'white' }],
    }))
  }

  const removeHeroApplication = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      heroApplications: prev.heroApplications.filter((_, i) => i !== index),
    }))
  }

  const updateHeroApplication = (index: number, field: keyof HeroApplication, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      heroApplications: prev.heroApplications.map((app, i) =>
        i === index ? { ...app, [field]: value } : app
      ),
    }))
  }

  const addApplicationCard = () => {
    setDetailPageData(prev => ({
      ...prev,
      applicationCards: [...prev.applicationCards, { name: '', icon: '', description: '', features: [], color: 'blue' }],
    }))
  }

  const removeApplicationCard = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      applicationCards: prev.applicationCards.filter((_, i) => i !== index),
    }))
  }

  const updateApplicationCard = (index: number, field: keyof ApplicationCard, value: string | string[]) => {
    setDetailPageData(prev => ({
      ...prev,
      applicationCards: prev.applicationCards.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      ),
    }))
  }

  const addApplicationCardFeature = (cardIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      applicationCards: prev.applicationCards.map((card, i) =>
        i === cardIndex ? { ...card, features: [...card.features, ''] } : card
      ),
    }))
  }

  const removeApplicationCardFeature = (cardIndex: number, featureIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      applicationCards: prev.applicationCards.map((card, i) =>
        i === cardIndex
          ? { ...card, features: card.features.filter((_, fi) => fi !== featureIndex) }
          : card
      ),
    }))
  }

  const updateApplicationCardFeature = (cardIndex: number, featureIndex: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      applicationCards: prev.applicationCards.map((card, i) =>
        i === cardIndex
          ? { ...card, features: card.features.map((f, fi) => (fi === featureIndex ? value : f)) }
          : card
      ),
    }))
  }

  const addLearningLevel = () => {
    setDetailPageData(prev => ({
      ...prev,
      learningLevels: [...prev.learningLevels, { level: '', duration: '', modules: [] }],
    }))
  }

  const removeLearningLevel = (index: number) => {
    setDetailPageData(prev => ({
      ...prev,
      learningLevels: prev.learningLevels.filter((_, i) => i !== index),
    }))
  }

  const updateLearningLevel = (index: number, field: keyof LearningLevel, value: string | string[]) => {
    setDetailPageData(prev => ({
      ...prev,
      learningLevels: prev.learningLevels.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      ),
    }))
  }

  const addLearningLevelModule = (levelIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      learningLevels: prev.learningLevels.map((level, i) =>
        i === levelIndex ? { ...level, modules: [...level.modules, ''] } : level
      ),
    }))
  }

  const removeLearningLevelModule = (levelIndex: number, moduleIndex: number) => {
    setDetailPageData(prev => ({
      ...prev,
      learningLevels: prev.learningLevels.map((level, i) =>
        i === levelIndex
          ? { ...level, modules: level.modules.filter((_, mi) => mi !== moduleIndex) }
          : level
      ),
    }))
  }

  const updateLearningLevelModule = (levelIndex: number, moduleIndex: number, value: string) => {
    setDetailPageData(prev => ({
      ...prev,
      learningLevels: prev.learningLevels.map((level, i) =>
        i === levelIndex
          ? { ...level, modules: level.modules.map((m, mi) => (mi === moduleIndex ? value : m)) }
          : level
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      setStatusMessage({ type: 'error', message: 'Name and slug are required' })
      return
    }

    try {
      setSaving(true)
      setStatusMessage({ type: 'info', message: 'Updating program...' })

      // Build update payload - only include fields from the active tab
      const updatePayload: any = {
        ...formData,
        departmentId: formData.departmentId || null,
      }

      // Only include detail page fields if we're on the detail tab
      // OR if detail page data has been modified (has non-default values)
      if (activeTab === 'detail') {
        // Prepare detail page JSON fields
        const learningItemsJson = detailPageData.learningItems.length > 0
          ? JSON.stringify(detailPageData.learningItems)
          : null
        const modulesJson = detailPageData.modules.length > 0
          ? JSON.stringify(detailPageData.modules)
          : null
        const careerOpportunitiesJson = detailPageData.careerOpportunities.length > 0
          ? JSON.stringify(detailPageData.careerOpportunities)
          : null

        // Add detail page fields
        updatePayload.detailPageLayout = detailPageData.detailPageLayout || null
        updatePayload.heroTitle = detailPageData.heroTitle || null
        updatePayload.heroSubtitle = detailPageData.heroSubtitle || null
        updatePayload.heroImage = detailPageData.heroImage || null
        updatePayload.overviewTitle = detailPageData.overviewTitle || null
        updatePayload.overviewContent = detailPageData.overviewContent || null
        updatePayload.learningTitle = detailPageData.learningTitle || null
        updatePayload.learningItems = learningItemsJson
        updatePayload.modulesTitle = detailPageData.modulesTitle || null
        updatePayload.modules = modulesJson
        updatePayload.detailsDuration = detailPageData.detailsDuration || null
        updatePayload.detailsFormat = detailPageData.detailsFormat || null
        updatePayload.detailsSchedule = detailPageData.detailsSchedule || null
        updatePayload.detailsPrerequisites = detailPageData.detailsPrerequisites || null
        updatePayload.careerTitle = detailPageData.careerTitle || null
        updatePayload.careerOpportunitiesJson = careerOpportunitiesJson
        updatePayload.ctaTitle = detailPageData.ctaTitle || null
        updatePayload.ctaDescription = detailPageData.ctaDescription || null
        
        // Convert custom content arrays to JSON string (legacy)
        if (detailPageData.detailPageLayout !== 'standard') {
          const customContent = {
            applications: detailPageData.applications || [],
            skillLevels: detailPageData.skillLevels || [],
          }
          updatePayload.customContent = JSON.stringify(customContent)
        } else {
          updatePayload.customContent = null
        }

        // Save new custom layout fields
        if (detailPageData.detailPageLayout === 'custom-applications' || detailPageData.detailPageLayout === 'custom-adobe') {
          updatePayload.heroApplications = detailPageData.heroApplications.length > 0
            ? JSON.stringify(detailPageData.heroApplications)
            : null
          updatePayload.suiteTitle = detailPageData.suiteTitle || null
          updatePayload.suiteDescription = detailPageData.suiteDescription || null
          updatePayload.applicationCards = detailPageData.applicationCards.length > 0
            ? JSON.stringify(detailPageData.applicationCards)
            : null
          updatePayload.learningPathTitle = detailPageData.learningPathTitle || null
          updatePayload.learningPathDesc = detailPageData.learningPathDesc || null
          updatePayload.learningLevels = detailPageData.learningLevels.length > 0
            ? JSON.stringify(detailPageData.learningLevels)
            : null
        } else {
          // Clear custom layout fields for standard layout
          updatePayload.heroApplications = null
          updatePayload.suiteTitle = null
          updatePayload.suiteDescription = null
          updatePayload.applicationCards = null
          updatePayload.learningPathTitle = null
          updatePayload.learningPathDesc = null
          updatePayload.learningLevels = null
        }
      }
      // If on basic tab, don't send detail page fields at all (partial update)

      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      })

      if (response.ok) {
        setStatusMessage({ type: 'success', message: 'Program updated successfully!' })
        setTimeout(() => {
          router.push('/dashboard/programs')
        }, 1500)
      } else {
        const error = await response.json()
        setStatusMessage({ type: 'error', message: error.error || 'Failed to update program' })
      }
    } catch (error) {
      console.error('Error updating program:', error)
      setStatusMessage({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading program...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Program not found</p>
          <button
            onClick={() => router.push('/dashboard/programs')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Back to Programs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Program</h1>
            <p className="mt-1 text-gray-600">Update program details</p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`rounded-xl p-4 ${
            statusMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : statusMessage.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <p>{statusMessage.message}</p>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'detail'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detail Page Content
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.courseCategory}
                    onChange={(e) => handleCourseCategoryChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a course category</option>
                    {COURSE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Settings</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Detail Page Content Tab */}
          {activeTab === 'detail' && (
            <div className="space-y-6">
              {/* Layout Selector */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Layout Configuration</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Layout</label>
                  <select
                    value={detailPageData.detailPageLayout}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, detailPageLayout: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {LAYOUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Standard layout works for most programs. Custom layouts are for special cases like MS Office or Adobe programs.
                  </p>
                </div>
              </div>

              {/* Hero Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={detailPageData.heroTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, heroTitle: e.target.value }))}
                    placeholder="e.g., Master Computer Hardware"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={detailPageData.heroSubtitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    placeholder="e.g., Build expertise in hardware systems"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <ImagePicker
                    label="Hero Image"
                    value={detailPageData.heroImage}
                    onChange={(url) => setDetailPageData(prev => ({ ...prev, heroImage: url }))}
                  />
                </div>
              </div>

              {/* Overview Section - Hidden for custom layouts */}
              {detailPageData.detailPageLayout === 'standard' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Overview Section</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overview Title</label>
                  <input
                    type="text"
                    value={detailPageData.overviewTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, overviewTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overview Content</label>
                  <textarea
                    value={detailPageData.overviewContent}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, overviewContent: e.target.value }))}
                    rows={6}
                    placeholder="Enter the program overview description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              )}

              {/* Learning Items - Hidden for custom layouts */}
              {detailPageData.detailPageLayout === 'standard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">What You'll Learn</h2>
                  <button
                    type="button"
                    onClick={addLearningItem}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={detailPageData.learningTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, learningTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-4">
                  {detailPageData.learningItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-700">Learning Item {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeLearningItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide icon)</label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateLearningItem(index, 'icon', e.target.value)}
                          placeholder="e.g., Cpu, MemoryStick"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                        <input
                          type="text"
                          value={item.color || 'blue'}
                          onChange={(e) => updateLearningItem(index, 'color', e.target.value)}
                          placeholder="e.g., blue, red, green, purple, custom-pink"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">Color name (e.g., blue, red, green, purple) or Tailwind class (e.g., custom-pink)</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateLearningItem(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateLearningItem(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  {detailPageData.learningItems.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No learning items added yet. Click "Add Item" to get started.</p>
                  )}
                </div>
              </div>
              )}

              {/* Course Modules - Hidden for custom layouts */}
              {detailPageData.detailPageLayout === 'standard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">Course Modules</h2>
                  <button
                    type="button"
                    onClick={addModule}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Module
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={detailPageData.modulesTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, modulesTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  {detailPageData.modules.map((module, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={module}
                        onChange={(e) => updateModule(index, e.target.value)}
                        placeholder={`Module ${index + 1} name`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeModule(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {detailPageData.modules.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No modules added yet. Click "Add Module" to get started.</p>
                  )}
                </div>
              </div>
              )}

              {/* Program Details Sidebar - Hidden for custom layouts */}
              {detailPageData.detailPageLayout === 'standard' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Program Details (Sidebar)</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={detailPageData.detailsDuration}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsDuration: e.target.value }))}
                      placeholder="e.g., 6 months"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <input
                      type="text"
                      value={detailPageData.detailsFormat}
                      onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsFormat: e.target.value }))}
                      placeholder="e.g., Online, In-person"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                  <input
                    type="text"
                    value={detailPageData.detailsSchedule}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsSchedule: e.target.value }))}
                    placeholder="e.g., Monday-Friday, 9am-5pm"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
                  <textarea
                    value={detailPageData.detailsPrerequisites}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, detailsPrerequisites: e.target.value }))}
                    rows={3}
                    placeholder="Enter prerequisites..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              )}

              {/* Career Opportunities - Hidden for custom layouts */}
              {detailPageData.detailPageLayout === 'standard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">Career Opportunities</h2>
                  <button
                    type="button"
                    onClick={addCareerOpportunity}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Career
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={detailPageData.careerTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, careerTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  {detailPageData.careerOpportunities.map((career, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={career}
                        onChange={(e) => updateCareerOpportunity(index, e.target.value)}
                        placeholder={`Career opportunity ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeCareerOpportunity(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {detailPageData.careerOpportunities.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No career opportunities added yet. Click "Add Career" to get started.</p>
                  )}
                </div>
              </div>
              )}

              {/* Custom Content (for custom layouts) - Legacy */}
              {detailPageData.detailPageLayout !== 'standard' && (
                <div className="space-y-6">
                  {/* Hero Applications Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">
                        Hero Applications (Quick Links)
                      </h2>
                      <button
                        type="button"
                        onClick={addHeroApplication}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Application
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      These applications appear in the hero section floating cards (first 4 will be shown).
                    </p>
                    <div className="space-y-4">
                      {detailPageData.heroApplications.map((app, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Hero App {index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeHeroApplication(index)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                              <input
                                type="text"
                                value={app.name}
                                onChange={(e) => updateHeroApplication(index, 'name', e.target.value)}
                                placeholder="e.g., Microsoft Word"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide)</label>
                              <input
                                type="text"
                                value={app.icon}
                                onChange={(e) => updateHeroApplication(index, 'icon', e.target.value)}
                                placeholder="e.g., FileText"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                              <input
                                type="text"
                                value={app.slug}
                                onChange={(e) => updateHeroApplication(index, 'slug', e.target.value)}
                                placeholder="e.g., word"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                              <input
                                type="text"
                                value={app.color || 'white'}
                                onChange={(e) => updateHeroApplication(index, 'color', e.target.value)}
                                placeholder="e.g., white, yellow, blue, red"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <p className="mt-1 text-xs text-gray-500">Color for hero section icon (e.g., white, yellow-400, blue, red)</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {detailPageData.heroApplications.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                          No hero applications added yet. Click "Add Application" to get started.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Complete Suite Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Complete Suite Section
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={detailPageData.suiteTitle}
                        onChange={(e) => setDetailPageData(prev => ({ ...prev, suiteTitle: e.target.value }))}
                        placeholder="e.g., Complete Application Suite"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                      <textarea
                        value={detailPageData.suiteDescription}
                        onChange={(e) => setDetailPageData(prev => ({ ...prev, suiteDescription: e.target.value }))}
                        rows={2}
                        placeholder="e.g., Learn industry-standard applications used by millions worldwide"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <h3 className="font-semibold text-gray-800">Application Cards</h3>
                      <button
                        type="button"
                        onClick={addApplicationCard}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Application Card
                      </button>
                    </div>
                    <div className="space-y-4">
                      {detailPageData.applicationCards.map((card, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Application Card {index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeApplicationCard(index)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                              <input
                                type="text"
                                value={card.name}
                                onChange={(e) => updateApplicationCard(index, 'name', e.target.value)}
                                placeholder="e.g., Microsoft Word"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide)</label>
                              <input
                                type="text"
                                value={card.icon}
                                onChange={(e) => updateApplicationCard(index, 'icon', e.target.value)}
                                placeholder="e.g., FileText"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={card.description}
                                onChange={(e) => updateApplicationCard(index, 'description', e.target.value)}
                                rows={2}
                                placeholder="Brief description of the application"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Color (optional)</label>
                              <input
                                type="text"
                                value={card.color || 'blue'}
                                onChange={(e) => updateApplicationCard(index, 'color', e.target.value)}
                                placeholder="blue, purple, red, etc."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                              <div className="space-y-2">
                                {card.features.map((feature, featureIndex) => (
                                  <div key={featureIndex} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={feature}
                                      onChange={(e) => updateApplicationCardFeature(index, featureIndex, e.target.value)}
                                      placeholder={`Feature ${featureIndex + 1}`}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeApplicationCardFeature(index, featureIndex)}
                                      className="p-2 text-red-600 hover:text-red-700"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addApplicationCardFeature(index)}
                                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                  <PlusIcon className="h-4 w-4 mr-1" />
                                  Add Feature
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {detailPageData.applicationCards.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                          No application cards added yet. Click "Add Application Card" to get started.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Learning Path Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Learning Path Section
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={detailPageData.learningPathTitle}
                        onChange={(e) => setDetailPageData(prev => ({ ...prev, learningPathTitle: e.target.value }))}
                        placeholder="e.g., Learning Path"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                      <textarea
                        value={detailPageData.learningPathDesc}
                        onChange={(e) => setDetailPageData(prev => ({ ...prev, learningPathDesc: e.target.value }))}
                        rows={2}
                        placeholder="e.g., Progress from beginner to advanced with our structured curriculum"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <h3 className="font-semibold text-gray-800">Learning Levels</h3>
                      <button
                        type="button"
                        onClick={addLearningLevel}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Learning Level
                      </button>
                    </div>
                    <div className="space-y-4">
                      {detailPageData.learningLevels.map((level, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Level {index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeLearningLevel(index)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Level Title</label>
                              <input
                                type="text"
                                value={level.level}
                                onChange={(e) => updateLearningLevel(index, 'level', e.target.value)}
                                placeholder="e.g., Beginner Level"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                              <input
                                type="text"
                                value={level.duration}
                                onChange={(e) => updateLearningLevel(index, 'duration', e.target.value)}
                                placeholder="e.g., 2 months"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Modules</label>
                              <div className="space-y-2">
                                {level.modules.map((module, moduleIndex) => (
                                  <div key={moduleIndex} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={module}
                                      onChange={(e) => updateLearningLevelModule(index, moduleIndex, e.target.value)}
                                      placeholder={`Module ${moduleIndex + 1}`}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeLearningLevelModule(index, moduleIndex)}
                                      className="p-2 text-red-600 hover:text-red-700"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addLearningLevelModule(index)}
                                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                  <PlusIcon className="h-4 w-4 mr-1" />
                                  Add Module
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {detailPageData.learningLevels.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                          No learning levels added yet. Click "Add Learning Level" to get started.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Section - Last section for custom layouts */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Call-to-Action Section</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
                  <input
                    type="text"
                    value={detailPageData.ctaTitle}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, ctaTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
                  <textarea
                    value={detailPageData.ctaDescription}
                    onChange={(e) => setDetailPageData(prev => ({ ...prev, ctaDescription: e.target.value }))}
                    rows={3}
                    placeholder="Enter CTA description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Update Program
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
