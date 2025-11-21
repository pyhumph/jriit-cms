'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// This page redirects to the new Professional Courses Page Editor
export default function ProfessionalCourseRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/dashboard/professional-courses-page')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Professional Courses Page Editor...</p>
      </div>
    </div>
  )
}
