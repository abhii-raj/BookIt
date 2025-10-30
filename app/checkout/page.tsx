'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import HeaderLogo from '@/app/components/HeaderLogo'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; terms?: string; promo?: string }>({})

  const experienceId = searchParams.get('experienceId') || ''
  const experienceName = searchParams.get('experienceName') || ''
  const date = searchParams.get('date') || ''
  const time = searchParams.get('time') || ''
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const subtotal = parseInt(searchParams.get('subtotal') || '0')
  const taxes = parseInt(searchParams.get('taxes') || '0')
  const baseTotal = parseInt(searchParams.get('total') || '0')

  const total = baseTotal - discount

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setErrors({ ...errors, promo: 'Please enter a promo code' })
      return
    }

    // Simple promo code logic - in production, validate with API
    const code = promoCode.trim().toUpperCase()
    
    if (code === 'SAVE10') {
      setDiscount(Math.round(subtotal * 0.1))
      setErrors({ ...errors, promo: '' })
    } else if (code === 'WELCOME') {
      setDiscount(100)
      setErrors({ ...errors, promo: '' })
    } else {
      setErrors({ ...errors, promo: 'Invalid promo code' })
      setDiscount(0)
      setPromoCode('')
    }
  }

  const handlePayAndConfirm = async () => {
    // Clear previous errors
    const newErrors: { fullName?: string; email?: string; terms?: string } = {}

    // Validate required fields
    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name'
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address'
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // Validate terms agreement
    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the terms and safety policy to continue'
    }

    // If there are any errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setProcessing(true)

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

      // Create or get user
      const userResponse = await fetch(`${baseURL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          promoCode: promoCode.trim() || null
        })
      })

      let userId
      if (userResponse.ok) {
        const userData = await userResponse.json()
        userId = userData.id || userData._id
      } else {
        const error = await userResponse.json()
        throw new Error(error.error || 'Failed to register user')
      }

      // Create booking
      const bookingResponse = await fetch(`${baseURL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          experienceId,
          bookingDate: date,
          timeSlot: time,
          numberOfPeople: quantity,
          totalPrice: total
        })
      })

      const bookingData = await bookingResponse.json()

      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || 'Booking failed')
      }

      // Generate booking reference ID
      const bookingRef = bookingData.booking?._id?.slice(-8).toUpperCase() || 
                        Math.random().toString(36).substring(2, 10).toUpperCase()

      // Navigate to confirmation page
      router.push(`/confirmation?bookingId=${bookingRef}`)
    } catch (error: any) {
      setErrors({ ...errors, terms: `Booking failed: ${error.message}` })
      setProcessing(false)
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderLogo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#000000]  cursor-pointer mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Checkout
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Checkout form */}
          <div className="lg:col-span-2">
            <div className="bg-[#EFEFEF] rounded-lg shadow p-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#5B5B5B] mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors({ ...errors, fullName: '' })
                    }}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[#DDDDDD]  text-[#727272]  font-normal border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5B5B5B] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    placeholder="Your email"
                    className="w-full px-4 py-3 bg-[#DDDDDD] border-0 text-[#727272]  font-normal  rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#5B5B5B] mb-1">
                  Promo code <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value)
                      if (errors.promo) setErrors({ ...errors, promo: '' })
                    }}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 bg-[#DDDDDD] border-0 text-[#727272]  font-normal rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                    className="px-6 py-3 bg-[#161616] text-white font-medium rounded-lg "
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-1"> Discount applied</p>
                )}
                {errors.promo && (
                  <p className="text-red-600 text-sm mt-1">{errors.promo}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div>
                <div className="flex items-center ">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked)
                      if (errors.terms) setErrors({ ...errors, terms: '' })
                    }}
                    className="w-4 h-4 accent-[#161616] border-[#5B5B5B] rounded"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-[#656565]">
                    I agree to the terms and safety policy
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 text-sm mt-1">{errors.terms}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Booking summary */}
          <div className="lg:col-span-1 ">
            <div className="bg-[#EFEFEF] rounded-lg shadow p-6">
              <div className="space-y-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Experience</span>
                  <span className="font-medium text-[#161616]">{experienceName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Date</span>
                  <span className="font-medium text-[#161616]">{formatDate(date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Time</span>
                  <span className="font-medium text-[#161616]">{time}</span>
                </div>
                <div className="flex justify-between text-sm pb-1">
                  <span className="text-[#656565]">Qty</span>
                  <span className="font-medium text-[#161616]">{quantity}</span>
                </div>
              

              
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Subtotal</span>
                  <span className="font-medium text-[#161616]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#656565]">Taxes</span>
                  <span className="font-medium text-[#161616]">₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-₹{discount}</span>
                  </div>
                )}
              </div>
                <div className="border-b-1 border-[#D9D9D9] ..."></div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-[#161616]">Total</span>
                  <span className="text-2xl font-medium text-[#161616]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayAndConfirm}
                disabled={processing || !fullName || !email || !agreedToTerms}
                className="w-full py-3 bg-[#FFD643] text-[#161616] font-medium rounded-lg  transition-colors  disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
