"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle({ compact = false }: { compact?: boolean }) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={compact ? "w-[84px] h-7 bg-muted/20 rounded-full animate-pulse" : "w-[100px] h-[36px] lg:h-[40px] bg-muted/20 rounded-full animate-pulse"} />
  }



  return (
    <div className="relative flex items-center bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full p-1 w-fit">

      {/* Sliding active indicator */}
      <div
        className={`absolute h-[calc(100%-8px)] ${compact ? 'w-7' : 'w-[32px] lg:w-[40px]'} bg-white dark:bg-[#2A2A2A] shadow-sm rounded-full transition-transform duration-300 ease-out ${
          theme === 'light' ? 'translate-x-0' :
            theme === 'system' ? `${compact ? 'translate-x-7' : 'translate-x-[32px] lg:translate-x-[40px]'}` :
              `${compact ? 'translate-x-14' : 'translate-x-[64px] lg:translate-x-[80px]'}`
        }`}
      />

      {/* Button: Light */}
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 ${compact ? 'p-1.5 w-7' : 'p-1.5 lg:p-2 w-8 lg:w-10'} flex justify-center rounded-full transition-colors ${
          theme === 'light' ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Chế độ sáng"
        aria-label="Chế độ sáng"
      >
        <Sun size={compact ? 14 : 16} className={compact ? '' : 'lg:w-[18px] lg:h-[18px]'} />
      </button>

      {/* Button: System */}
      <button
        onClick={() => setTheme("system")}
        className={`relative z-10 ${compact ? 'p-1.5 w-7' : 'p-1.5 lg:p-2 w-8 lg:w-10'} flex justify-center rounded-full transition-colors ${
          theme === 'system' ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Theo hệ thống"
        aria-label="Theo hệ thống"
      >
        <Laptop size={compact ? 14 : 16} className={compact ? '' : 'lg:w-[18px] lg:h-[18px]'} />
      </button>

      {/* Button: Dark */}
      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 ${compact ? 'p-1.5 w-7' : 'p-1.5 lg:p-2 w-8 lg:w-10'} flex justify-center rounded-full transition-colors ${
          theme === 'dark' ? 'text-indigo-500' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Chế độ tối"
        aria-label="Chế độ tối"
      >
        <Moon size={compact ? 14 : 16} className={compact ? '' : 'lg:w-[18px] lg:h-[18px]'} />
      </button>
    </div>
  )
}