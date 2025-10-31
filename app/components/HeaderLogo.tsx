import React from 'react'
import hdLogo from '@/public/hdlogo.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { create } from 'zustand'

// Define the Zustand store at the top
export const useSearchStore = create<{
  searchQuery: string
  setSearchQuery: (query: string) => void
}>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}))

const HeaderLogo = () => {
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useSearchStore()

  const handleSearch = () => {
    // Navigate to home page when search is clicked
    if (window.location.pathname !== '/') {
      router.push('/')
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer flex-shrink-0" 
              onClick={() => router.push('/')}
            >
              <div className="w-16 h-8 sm:w-20 sm:h-10 bg-transparent rounded-full flex items-center justify-center">
                <Image src={hdLogo} alt="Highway Delite" className="w-full h-full object-contain"/>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 w-full sm:flex-1 sm:max-w-2xl sm:mx-4 md:mx-8">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-sm sm:text-base text-black bg-[#EDEDED] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FFD643]"
              />
              <button 
                onClick={handleSearch}
                className="px-4 sm:px-6 py-2 bg-[#FFD643] text-black text-sm sm:text-base font-medium rounded-lg hover:bg-[#ffd020] transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </header>
  )
}

export default HeaderLogo