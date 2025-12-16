
"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg p-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-all ${
          theme === 'light' 
            ? 'bg-slate-100 dark:bg-slate-800 text-yellow-500 shadow-sm' 
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="Chế độ sáng"
      >
        <Sun size={20} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full transition-all ${
          theme === 'system' 
            ? 'bg-slate-100 dark:bg-slate-800 text-blue-500 shadow-sm' 
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="Theo hệ thống"
      >
        <Laptop size={20} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-all ${
          theme === 'dark' 
            ? 'bg-slate-100 dark:bg-slate-800 text-indigo-500 shadow-sm' 
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="Chế độ tối"
      >
        <Moon size={20} />
      </button>
    </div>
  )
}
