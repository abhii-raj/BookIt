const { connectDB, Experience } = require('./index')

const experiencesData = [
  {
    title: 'Kayaking',
    location: 'Udupi',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    category: 'water-sports'
  },
  {
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    price: 899,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'nature'
  },
  {
    title: 'Coffee Trail',
    location: 'Coorg',
    price: 1299,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    category: 'nature'
  },
  {
    title: 'Kayaking',
    location: 'Udupi, Karnataka',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=300&fit=crop',
    category: 'water-sports'
  },
  {
    title: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    price: 899,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=400&h=300&fit=crop',
    category: 'nature'
  },
  {
    title: 'Boat Cruise',
    location: 'Sunderbaan',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=400&h=300&fit=crop',
    category: 'water-sports'
  },
  {
    title: 'Bunjee Jumping',
    location: 'Manali',
    price: 999,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=400&h=300&fit=crop',
    category: 'adventure'
  },
  {
    title: 'Coffee Trail',
    location: 'Coorg',
    price: 1299,
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    category: 'nature'
  }
]

async function seedDatabase() {
  try {
    await connectDB()
    
    // Clear existing experiences
    await Experience.deleteMany({})
    console.log('Cleared existing experiences')
    
    // Insert new experiences
    await Experience.insertMany(experiencesData)
    console.log('✅ Database seeded successfully with', experiencesData.length, 'experiences')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
