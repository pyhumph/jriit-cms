'use client'

import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'auto', label: 'Auto', icon: ComputerDesktopIcon }
  ] as const

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {themes.map((themeOption) => {
        const IconComponent = themeOption.icon
        return (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              theme === themeOption.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title={`Switch to ${themeOption.label} theme`}
          >
            <IconComponent className="h-4 w-4" />
            <span className="hidden sm:inline">{themeOption.label}</span>
          </button>
        )
      })}
    </div>
  )
}


