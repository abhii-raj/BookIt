'use client'
import backIcon from '@/public/Vector.svg'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Vector from '@/public/Vector.png'

import HeaderLogo from '@/app/components/HeaderLogo'

interface Experience {
  _id: string
  title: string
  location: string
  price: number
  description: string
  image: string
  category: string
}

interface TimeSlot {
  time: string
  label: string
  maxCapacity: number
  bookedCount: number
  slotsLeft: number
  available: boolean
}

export default function ExperienceDetail() {
  const params = useParams()
  const router = useRouter()
  const experienceId = params.id as string

  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [booking, setBooking] = useState(false)
  const [selectedSlotsLeft, setSelectedSlotsLeft] = useState<number | null>(null)
  const [uiMessage, setUiMessage] = useState<string>('')

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

  // Generate next 5 days
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: date.toISOString().split('T')[0],
      full: date
    }
  })

  useEffect(() => {
    fetchExperience()
    setSelectedDate(dates[0].value)
  }, [])

  useEffect(() => {
    if (selectedDate && experienceId) {
      fetchTimeSlots()
    }
  }, [selectedDate, experienceId])

  const fetchExperience = async () => {
    try {
      const response = await fetch(`${baseURL}/api/experiences`)
      const data = await response.json()
      const exp = data.find((e: Experience) => e._id === experienceId)
      setExperience(exp || null)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching experience:', error)
      setLoading(false)
    }
  }

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(`${baseURL}/api/slots/${experienceId}/${selectedDate}`)
      const data = await response.json()
      setTimeSlots(data)
      // If a time was selected previously, refresh its available count
      if (selectedTime) {
        const current = data.find((s: TimeSlot) => s.time === selectedTime)
        setSelectedSlotsLeft(current ? current.slotsLeft : null)
        if (current && quantity > current.slotsLeft) {
          setQuantity(Math.max(1, current.slotsLeft))
          setUiMessage('No more slots available for this time')
          setTimeout(() => setUiMessage(''), 2500)
        }
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
    }
  }

  const handleConfirm = () => {
    if (!selectedTime || !experience) {
      alert('Please select a time slot')
      return
    }

    // Navigate to checkout with booking details in URL params
    const params = new URLSearchParams({
      experienceId: experience._id,
      experienceName: experience.title,
      date: selectedDate,
      time: selectedTime,
      quantity: quantity.toString(),
      price: experience.price.toString(),
      subtotal: subtotal.toString(),
      taxes: taxes.toString(),
      total: total.toString()
    })
    
    router.push(`/checkout?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Experience not found</div>
      </div>
    )
  }

  const subtotal = experience.price * quantity
  const taxes = Math.round(subtotal * 0.06)
  const total = subtotal + taxes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderLogo/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-[#656565] cursor-pointer  mb-4"
        >
          <Image src={Vector} alt=""  className='pr-1'/>
          Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Experience details */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={experience.image}
                alt={experience.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and description */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
            <p className="text-[#656565] mb-6">{experience.description}</p>

            {/* Choose date */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Choose date</h2>
              <div className="flex gap-2 overflow-x-auto">
                {dates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={` py-1  px-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedDate === date.value
                        ? 'bg-[#FFD643] text-black font-medium'
                        : 'bg-white text-gray-700 border border-gray-300 '
                    }`}
                  >
                    {date.display}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose time */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Choose time</h2>
              <div className=" flex overflow-x-auto  gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => {
                      if (!slot.available) return
                      setSelectedTime(slot.time)
                      setSelectedSlotsLeft(slot.slotsLeft)
                      if (quantity > slot.slotsLeft) {
                        setQuantity(Math.max(1, slot.slotsLeft))
                        setUiMessage('No more slots available for this time')
                        setTimeout(() => setUiMessage(''), 2500)
                      }
                    }}
                    disabled={!slot.available}
                    className={`px-1 py-1.5 rounded-lg text-sm transition-colors relative ${
                      selectedTime === slot.time
                        ? 'bg-[#FFD643] text-black font-medium'
                        : slot.available
                        ? 'bg-white text-gray-700 border border-gray-300 '
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    
                    <div className='flex  justify-between'>                  
                          <div className='pr-2'>{slot.label}</div>
                    { slot.available && (
                      <div className=" text-red-500 pr-1 ">{slot.slotsLeft} left</div>
                    )}
                    {!slot.available && (
                      <div className='pr-1'>Sold out</div>
                    )}
                    </div>
            

                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">All times are in IST (GMT +5:30)</p>
            </div>

            {/* About */}
            <div className="b  p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-[#838383] bg-[#EEEEEE] rounded-lg p-2 text-[#838383] bg-[#EEEEEE] text-sm">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>

          {/* Right column - Booking summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#EFEFEF] rounded-lg  pt-6 px-6 py-6 sticky top-6">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-[#656565]">
                  <span>Starts at</span>
                  <span className="text-2xl font-bold text-gray-900">₹{experience.price}</span>
                </div>
              </div>

              <div className="border-t  mb-4">
                {uiMessage && (
                  <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {uiMessage}
                  </div>
                )}
                <div className="flex items-center justify-between ">
                  <span className="text-sm text-[#656565]">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-4 h-4 border border-gray-300 hover:border-gray-400 flex items-center justify-center"
                    >
                      <span className='text-[#161616]'>-</span>
                    </button>
                    <span className="text-[#161616] font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => {
                        const cap = selectedSlotsLeft ?? Infinity
                        if (quantity + 1 > cap) {
                          setUiMessage('No more slots available')
                          setTimeout(() => setUiMessage(''), 2500)
                          return
                        }
                        setQuantity(quantity + 1)
                      }}
                      className="w-4 h-4  border border-gray-300 hover:border-gray-400 flex items-center justify-center"
                    >
                      <span className='text-[#161616]'>+</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t  mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#656565]">Subtotal</span>
                  <span className="text-[#161616] font-medium">₹{subtotal}</span>
                </div>
              </div>
              <div className="border-t  mb-4 space-y-2">
                <div className="flex items-center justify-between  text-sm">
                  <span className="text-[#656565]">Taxes</span>
                  <span className="text-[#161616] font-medium">₹{taxes}</span>
                </div>
              </div>

              <div className="border-b-1 border-[#D9D9D9] ..."></div>

              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-[#161616] font-bold">Total</span>
                  <span className="text-2xl text-[#161616]  font-bold">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedTime || booking || (selectedSlotsLeft !== null && quantity > selectedSlotsLeft) || selectedSlotsLeft === 0}
                className={`w-full py-3 font-medium rounded-lg transition-colors disabled:cursor-not-allowed ${
                  selectedTime
                    ? 'bg-[#FFD643] text-black hover:bg-[#FFD643]'
                    : 'bg-gray-200 text-gray-800 opacity-50'
                }`}
              >
                {booking ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
