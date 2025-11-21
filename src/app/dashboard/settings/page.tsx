'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import {
  CogIcon,
  CheckIcon as SaveIcon,
  EnvelopeIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
  ClockIcon,
  ServerIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ChartBarIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

interface GlobalSettings {
  // Site Information
  siteName: string
  siteTagline: string
  siteDescription: string
  logo: string | null
  favicon: string | null
  
  // Theme Settings
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontFamily: string
  fontSize: string
  
  // Contact Information
  contactEmail: string
  contactPhone: string
  contactAddress: string
  contactHours: string
  
  // Social Media
  facebookUrl: string | null
  twitterUrl: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  youtubeUrl: string | null
  tiktokUrl: string | null
  
  // SEO Settings
  defaultMetaTitle: string
  defaultMetaDescription: string
  defaultMetaKeywords: string
  googleAnalyticsId: string | null
  googleTagManagerId: string | null
  facebookPixelId: string | null
  
  // Security Settings
  maintenanceMode: boolean
  maintenanceMessage: string | null
  allowRegistration: boolean
  requireEmailVerification: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  requireStrongPassword: boolean
  
  // File Upload Settings
  maxFileSize: number
  allowedFileTypes: string
  maxImageWidth: number
  maxImageHeight: number
  imageQuality: number
  enableImageOptimization: boolean
  
  // Performance Settings
  enableCaching: boolean
  cacheDuration: number
  enableCompression: boolean
  enableCDN: boolean
  cdnUrl: string | null
  
  // Email Settings
  smtpHost: string | null
  smtpPort: number | null
  smtpUsername: string | null
  smtpPassword: string | null
  smtpSecure: boolean
  fromEmail: string
  fromName: string
  
  // Notification Settings
  enableEmailNotifications: boolean
  enablePushNotifications: boolean
  enableSmsNotifications: boolean
  notificationEmail: string | null
  
  // System Settings
  timezone: string
  dateFormat: string
  timeFormat: string
  currency: string
  language: string
  enableDebugMode: boolean
  logLevel: string
  
  // Backup Settings
  enableAutoBackup: boolean
  backupFrequency: string
  backupRetention: number
  backupLocation: string
  
  // API Settings
  enableApiAccess: boolean
  apiRateLimit: number
  apiKeyExpiration: number
  enableCors: boolean
  corsOrigins: string | null
  
  // Analytics Settings
  enableAnalytics: boolean
  analyticsProvider: string
  trackingId: string | null
  enableHeatmaps: boolean
  enableSessionRecording: boolean
  
  // Advanced Settings
  enableWebhooks: boolean
  webhookUrl: string | null
  enableScheduledTasks: boolean
  enableQueueProcessing: boolean
  maxConcurrentJobs: number
  
  // Legal Settings
  privacyPolicyUrl: string | null
  termsOfServiceUrl: string | null
  cookiePolicyUrl: string | null
  gdprCompliance: boolean
  cookieConsent: boolean
  
  // Academic Settings
  academicYear: string
  semester: string
  admissionOpen: boolean
  admissionDeadline: string | null
  maxStudents: number | null
  
  // System Information
  version: string
  lastUpdated: string
  uptime: string
  memoryUsage: string
  diskUsage: string
  cpuUsage: string
}

const defaultSettings: GlobalSettings = {
  // Site Information
  siteName: 'JRIIT - Junior Institute of Information Technology',
  siteTagline: 'Empowering Future Technology Leaders',
  siteDescription: 'Leading institute for Information Technology education in Tanzania',
  logo: null,
  favicon: null,
  
  // Theme Settings
  theme: 'light',
  primaryColor: '#d946ef',
  secondaryColor: '#9333ea',
  accentColor: '#fbbf24',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderRadius: '8px',
  fontFamily: 'Inter',
  fontSize: '16px',
  
  // Contact Information
  contactEmail: 'info@jriit.ac.tz',
  contactPhone: '+255 754 360 590',
  contactAddress: 'Sakina Area Arusha Tanzania, P. O. Box 7071 Namanga Road',
  contactHours: 'Monday - Friday: 8:00 AM - 5:00 PM',
  
  // Social Media
  facebookUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  tiktokUrl: null,
  
  // SEO Settings
  defaultMetaTitle: 'JRIIT - IT Education Tanzania',
  defaultMetaDescription: 'Leading institute for Information Technology education in Tanzania',
  defaultMetaKeywords: 'IT education, computer science, Tanzania, JRIIT',
  googleAnalyticsId: null,
  googleTagManagerId: null,
  facebookPixelId: null,
  
  // Security Settings
  maintenanceMode: false,
  maintenanceMessage: null,
  allowRegistration: true,
  requireEmailVerification: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  requireStrongPassword: true,
  
  // File Upload Settings
  maxFileSize: 10,
  allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
  maxImageWidth: 1920,
  maxImageHeight: 1080,
  imageQuality: 85,
  enableImageOptimization: true,
  
  // Performance Settings
  enableCaching: true,
  cacheDuration: 3600,
  enableCompression: true,
  enableCDN: false,
  cdnUrl: null,
  
  // Email Settings
  smtpHost: null,
  smtpPort: 587,
  smtpUsername: null,
  smtpPassword: null,
  smtpSecure: true,
  fromEmail: 'noreply@jriit.ac.tz',
  fromName: 'JRIIT',
  
  // Notification Settings
  enableEmailNotifications: true,
  enablePushNotifications: false,
  enableSmsNotifications: false,
  notificationEmail: 'admin@jriit.ac.tz',
  
  // System Settings
  timezone: 'Africa/Dar_es_Salaam',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24',
  currency: 'TZS',
  language: 'en',
  enableDebugMode: false,
  logLevel: 'info',
  
  // Backup Settings
  enableAutoBackup: true,
  backupFrequency: 'daily',
  backupRetention: 30,
  backupLocation: 'local',
  
  // API Settings
  enableApiAccess: true,
  apiRateLimit: 1000,
  apiKeyExpiration: 365,
  enableCors: true,
  corsOrigins: null,
  
  // Analytics Settings
  enableAnalytics: true,
  analyticsProvider: 'google',
  trackingId: null,
  enableHeatmaps: false,
  enableSessionRecording: false,
  
  // Advanced Settings
  enableWebhooks: false,
  webhookUrl: null,
  enableScheduledTasks: true,
  enableQueueProcessing: true,
  maxConcurrentJobs: 10,
  
  // Legal Settings
  privacyPolicyUrl: null,
  termsOfServiceUrl: null,
  cookiePolicyUrl: null,
  gdprCompliance: false,
  cookieConsent: true,
  
  // Academic Settings
  academicYear: '2024-2025',
  semester: '1',
  admissionOpen: true,
  admissionDeadline: '2024-12-31',
  maxStudents: null,
  
  // System Information
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  uptime: '99.9%',
  memoryUsage: '45%',
  diskUsage: '67%',
  cpuUsage: '23%'
}

export default function Settings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, setTheme, actualTheme } = useTheme()
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    } else {
      fetchSettings()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // For now, use default settings
      // In a real app, this would fetch from the database
      setSettings(defaultSettings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // In a real app, this would save to the database
      console.log('Saving settings:', settings)
      setHasChanges(false)
        // Show success message
        alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(defaultSettings)
      setHasChanges(true)
    }
  }

  const handleChange = (key: keyof GlobalSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'contact', name: 'Contact', icon: EnvelopeIcon },
    { id: 'seo', name: 'SEO', icon: MagnifyingGlassIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'performance', name: 'Performance', icon: RocketLaunchIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'System', icon: ServerIcon },
    { id: 'academic', name: 'Academic', icon: AcademicCapIcon },
    { id: 'advanced', name: 'Advanced', icon: CpuChipIcon }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
            <p className="text-gray-600 mt-1">Manage your website settings and preferences</p>
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
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Reset
            </button>
        <button
          onClick={handleSave}
              disabled={!hasChanges || saving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <SaveIcon className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
        </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                {tab.name}
              </button>
                )
              })}
          </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* General Settings */}
          {activeTab === 'general' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
            <div className="space-y-6">
                  {/* Site Information */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Site Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                          onChange={(e) => handleChange('siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Tagline</label>
                    <input
                      type="text"
                      value={settings.siteTagline}
                          onChange={(e) => handleChange('siteTagline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                        <textarea
                          rows={3}
                          value={settings.siteDescription}
                          onChange={(e) => handleChange('siteDescription', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo and Favicon */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                    <input
                          type="url"
                          value={settings.logo || ''}
                          onChange={(e) => handleChange('logo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                    <input
                          type="url"
                          value={settings.favicon || ''}
                          onChange={(e) => handleChange('favicon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/favicon.ico"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance Settings</h2>
                <div className="space-y-6">
                  {/* Theme Selection */}
              <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: SunIcon },
                          { value: 'dark', label: 'Dark', icon: MoonIcon },
                          { value: 'auto', label: 'Auto', icon: ComputerDesktopIcon }
                        ].map((themeOption) => {
                          const IconComponent = themeOption.icon
                          return (
                            <button
                              key={themeOption.value}
                              onClick={() => {
                                setTheme(themeOption.value as 'light' | 'dark' | 'auto')
                                handleChange('theme', themeOption.value)
                              }}
                              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                                theme === themeOption.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <IconComponent className="h-6 w-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">{themeOption.label}</span>
                            </button>
                          )
                        })}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Color Scheme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.primaryColor}
                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={settings.secondaryColor}
                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.secondaryColor}
                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={settings.accentColor}
                            onChange={(e) => handleChange('accentColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                    <input
                            type="text"
                            value={settings.accentColor}
                            onChange={(e) => handleChange('accentColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Typography</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                        <select
                          value={settings.fontFamily}
                          onChange={(e) => handleChange('fontFamily', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Montserrat">Montserrat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <select
                          value={settings.fontSize}
                          onChange={(e) => handleChange('fontSize', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="14px">Small (14px)</option>
                          <option value="16px">Medium (16px)</option>
                          <option value="18px">Large (18px)</option>
                          <option value="20px">Extra Large (20px)</option>
                        </select>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Settings */}
          {activeTab === 'contact' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                        rows={3}
                      value={settings.contactAddress}
                        onChange={(e) => handleChange('contactAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                      <input
                        type="text"
                        value={settings.contactHours}
                        onChange={(e) => handleChange('contactHours', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                </div>
              </div>
            </div>
          )}

            {/* System Information */}
            {activeTab === 'system' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">System Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ServerIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Version</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{settings.version}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Uptime</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{settings.uptime}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CpuChipIcon className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Memory Usage</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{settings.memoryUsage}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ServerIcon className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Disk Usage</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{settings.diskUsage}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CpuChipIcon className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">CPU Usage</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{settings.cpuUsage}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Last Updated</span>
                    </div>
                    <p className="text-sm text-gray-600">{new Date(settings.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

            {/* Add more tabs as needed */}
          {activeTab === 'seo' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Meta Title</label>
                    <input
                      type="text"
                      value={settings.defaultMetaTitle}
                      onChange={(e) => handleChange('defaultMetaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Meta Description</label>
                    <textarea
                      rows={3}
                      value={settings.defaultMetaDescription}
                      onChange={(e) => handleChange('defaultMetaDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
              </div>
            </div>
          )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
              <div>
                      <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500">Enable maintenance mode to restrict access</p>
                  </div>
                    <button
                      onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
              <div>
                      <h3 className="text-sm font-medium text-gray-900">Allow Registration</h3>
                      <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                    <button
                      onClick={() => handleChange('allowRegistration', !settings.allowRegistration)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.allowRegistration ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  )
}