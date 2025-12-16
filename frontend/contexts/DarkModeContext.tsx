// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';

// interface DarkModeContextType {
//   isDarkMode: boolean;
//   toggleDarkMode: () => void;
// }

// const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// export function DarkModeProvider({ children }: { children: React.ReactNode }) {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // Initialize from localStorage or system preference
//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setMounted(true);
    
//     const stored = localStorage.getItem('darkMode');
//     if (stored !== null) {
//       setIsDarkMode(stored === 'true');
//     } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       setIsDarkMode(true);
//     }
//   }, []);

//   // Apply dark class to HTML element
//   useEffect(() => {
//     if (!mounted) return;
    
//     const html = document.documentElement;
//     if (isDarkMode) {
//       html.classList.add('dark');
//       localStorage.setItem('darkMode', 'true');
//     } else {
//       html.classList.remove('dark');
//       localStorage.setItem('darkMode', 'false');
//     }
//   }, [isDarkMode, mounted]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(prev => !prev);
//   };

//   // Prevent flash
//   if (!mounted) {
//     return null;
//   }

//   return (
//     <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// }

// export function useDarkMode() {
//   const context = useContext(DarkModeContext);
//   if (context === undefined) {
//     throw new Error('useDarkMode must be used within a DarkModeProvider');
//   }
//   return context;
// }