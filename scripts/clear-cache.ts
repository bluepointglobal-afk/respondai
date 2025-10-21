import { clearTestCache, getCacheStats } from '../src/lib/cache'

async function clearCache() {
  console.log('🗑️ Cache clearing utility')
  
  try {
    // Show current cache stats
    console.log('\n📊 Current cache status:')
    const stats = getCacheStats()
    console.log('  Test Cache Size:', stats.testCacheSize)
    console.log('  Test Results Size:', stats.testResultsSize)
    console.log('  Test Cache Keys:', stats.testCacheKeys)
    console.log('  Test Results Keys:', stats.testResultsKeys)
    
    // Clear all cache
    console.log('\n🧹 Clearing all cache...')
    clearTestCache()
    
    // Show cache stats after clearing
    console.log('\n✅ Cache cleared successfully!')
    const newStats = getCacheStats()
    console.log('  Test Cache Size:', newStats.testCacheSize)
    console.log('  Test Results Size:', newStats.testResultsSize)
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error)
  }
}

// Run if called directly
if (require.main === module) {
  clearCache().catch(console.error)
}

export { clearCache }
