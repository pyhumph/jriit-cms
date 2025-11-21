'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function ApiTestPage() {
  const { data: session } = useSession()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/posts/test')
      const data = await response.json()
      setResults({ endpoint: 'Authentication Test', data })
    } catch (error) {
      setResults({ endpoint: 'Authentication Test', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testGetPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setResults({ endpoint: 'Get Posts', data })
    } catch (error) {
      setResults({ endpoint: 'Get Posts', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testCreatePost = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Post from API',
          slug: 'test-post-' + Date.now(),
          content: 'This is a test post created via API',
          excerpt: 'Test excerpt',
          published: false,
        }),
      })
      const data = await response.json()
      setResults({ endpoint: 'Create Post', data })
    } catch (error) {
      setResults({ endpoint: 'Create Post', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Test Page</h1>
        <p className="text-gray-600">Test the Posts API endpoints</p>
      </div>

      {session && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-green-800">✅ Authenticated</h3>
          <p className="text-sm text-green-700">
            Logged in as: {session.user.name} ({session.user.email})
          </p>
          <p className="text-sm text-green-700">Role: {session.user.role}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={testAuth}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Authentication'}
        </button>

        <button
          onClick={testGetPosts}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Posts'}
        </button>

        <button
          onClick={testCreatePost}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Test Post'}
        </button>
      </div>

      {results && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {results.endpoint} Results
            </h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(results.data || results.error, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}




















