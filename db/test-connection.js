const { connectDB } = require('./index')

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...')
    await connectDB()
    console.log('✅ MongoDB connection successful!')
    process.exit(0)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
