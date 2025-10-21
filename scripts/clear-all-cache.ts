import { clearTestCache, getCacheStats } from '../src/lib/cache'

async function clearAllCache() {
  console.log('🗑️ Comprehensive cache clearing utility')
  
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
    
    // Clear browser localStorage (if running in browser context)
    if (typeof window !== 'undefined') {
      console.log('\n🌐 Clearing browser localStorage...')
      
      // Clear test creation store
      localStorage.removeItem('test-creation-store')
      localStorage.removeItem('test-creation')
      
      // Clear any other potential cache keys
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (
          key.includes('test') || 
          key.includes('survey') || 
          key.includes('cache') ||
          key.includes('store')
        )) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => {
        console.log(`  Removing: ${key}`)
        localStorage.removeItem(key)
      })
    }
    
    // Show cache stats after clearing
    console.log('\n✅ All cache cleared successfully!')
    const newStats = getCacheStats()
    console.log('  Test Cache Size:', newStats.testCacheSize)
    console.log('  Test Results Size:', newStats.testResultsSize)
    
    console.log('\n🎯 Next steps:')
    console.log('  1. Refresh your browser')
    console.log('  2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)')
    console.log('  3. Start a new test from scratch')
    console.log('  4. The old survey data should no longer appear')
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error)
  }
}

// Run if called directly
if (require.main === module) {
  clearAllCache().catch(console.error)
}

export { clearAllCache }
