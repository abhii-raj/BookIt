'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import hdLogo from "@/public/hdlogo.png"
import HeaderLogo from "./components/HeaderLogo";

import { useSearchStore } from "./components/HeaderLogo";


interface Experience {
  _id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
      const response = await fetch(`${base}/api/experiences`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }
      const data = await response.json();
      setExperiences(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setLoading(false);
    }
  };

  const { searchQuery }  = useSearchStore() as  {searchQuery : string};

  const filteredExperiences = experiences.filter(exp =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderLogo/>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-[#656565]">Loading experiences...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredExperiences.map((experience) => (
              <div
                key={experience._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=' + experience.title;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-xs text-[#656565] rounded">
                      {experience.location}
                    </span>
                  </div>

                  <p className="text-sm text-[#656565] mb-4 line-clamp-2">
                    {experience.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">From</span>
                      <span className="text-xl font-bold text-gray-900 ml-1">₹{experience.price}</span>
                    </div>
                    <a
                      href={`/experiences/${experience._id}`}
                      className="px-4 py-2 bg-yellow-400 text-black text-sm font-medium rounded hover:bg-yellow-500 transition-colors inline-block"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-[#656565]">No experiences found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
