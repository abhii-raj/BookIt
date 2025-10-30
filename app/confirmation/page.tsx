'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import HeaderLogo from '@/app/components/HeaderLogo'

import Image from 'next/image'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId') || 'HUF56&SO'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderLogo />

      {/* Confirmation Content */}
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#24AC39] rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
       
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#161616] font-medium mb-2">
          Booking Confirmed
        </h1>

        {/* Booking Reference */}
        <p className="text-[#656565]  mb-8">
          Ref ID: {bookingId}
        </p>

        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-[#E3E3E3] text-[#656565] font-regular rounded-lg "
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
