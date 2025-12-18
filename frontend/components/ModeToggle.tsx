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
    <div className="flex items-center bg-background/60 dark:bg-background/60 backdrop-blur-xl border rounded-full p-0.5 lg:p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 lg:p-2 rounded-full transition-all ${
          theme === 'light' 
            ? 'bg-card text-yellow-500 shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Chế độ sáng"
      >
        <Sun size={16} className="lg:w-[18px] lg:h-[18px]" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 lg:p-2 rounded-full transition-all hidden sm:flex ${
          theme === 'system' 
            ? 'bg-card text-blue-500 shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Theo hệ thống"
      >
        <Laptop size={16} className="lg:w-[18px] lg:h-[18px]" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 lg:p-2 rounded-full transition-all ${
          theme === 'dark' 
            ? 'bg-card text-indigo-500 shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Chế độ tối"
      >
        <Moon size={16} className="lg:w-[18px] lg:h-[18px]" />
      </button>
    </div>
  )
}