/**
 * SIMPLE IN-MEMORY CACHE
 * For development - replace with Redis in production
 */

export interface CachedTest {
  id: string
  productName: string
  status: string
  createdAt: string
  [key: string]: any
}

export interface CachedResults {
  testId: string
  status: string
  completedAt?: string
  error?: string
  [key: string]: any
}

// Declare global cache types
declare global {
  var testCache: Map<string, CachedTest> | undefined
  var testResults: Map<string, CachedResults> | undefined
}

// Initialize if needed
if (typeof global !== 'undefined') {
  global.testCache = global.testCache || new Map()
  global.testResults = global.testResults || new Map()
}

export const testCache = global.testCache || new Map<string, CachedTest>()
export const testResults = global.testResults || new Map<string, CachedResults>()

// Cache management functions
export function clearTestCache() {
  console.log('🗑️ Clearing test cache...')
  testCache.clear()
  testResults.clear()
  console.log('✅ Test cache cleared')
}

export function clearTestCacheForTest(testId: string) {
  console.log(`🗑️ Clearing cache for test: ${testId}`)
  testCache.delete(testId)
  testResults.delete(testId)
  console.log(`✅ Cache cleared for test: ${testId}`)
}

export function getCacheStats() {
  return {
    testCacheSize: testCache.size,
    testResultsSize: testResults.size,
    testCacheKeys: Array.from(testCache.keys()),
    testResultsKeys: Array.from(testResults.keys())
  }
}

