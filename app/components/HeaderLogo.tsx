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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => router.push('/')}
            >
              <div className="w-20 h-10 bg-transparent rounded-full flex items-center justify-center mr-2">
                <Image src={hdLogo} alt="Highway Delite"/>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 flex-1 max-w-2xl mx-8">
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
                className="flex-1 px-4 py-2 border border-gray-300 text-black bg-[#EDEDED] rounded-lg focus:outline-none focus:ring-1"
              />
              <button 
                onClick={handleSearch}
                className="px-6 py-2 bg-[#FFD643] text-black font-medium rounded-lg  "
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