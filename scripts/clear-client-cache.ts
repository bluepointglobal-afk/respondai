/**
 * Client-side cache clearing utility
 * Can be run in browser console or imported in components
 */

export function clearClientCache() {
  console.log('🧹 Clearing client-side cache...')
  
  // Clear localStorage
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
    console.log(`  Removing localStorage key: ${key}`)
    localStorage.removeItem(key)
  })
  
  // Clear sessionStorage
  const sessionKeysToRemove = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key && (
      key.includes('test') || 
      key.includes('survey') || 
      key.includes('cache') ||
      key.includes('store')
    )) {
      sessionKeysToRemove.push(key)
    }
  }
  
  sessionKeysToRemove.forEach(key => {
    console.log(`  Removing sessionStorage key: ${key}`)
    sessionStorage.removeItem(key)
  })
  
  console.log('✅ Client-side cache cleared')
  
  // Clear server-side cache
  return fetch('/api/admin/clear-cache', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  }).then(response => {
    if (response.ok) {
      console.log('✅ Server-side cache cleared')
    } else {
      console.log('❌ Failed to clear server-side cache')
    }
  }).catch(err => {
    console.log('❌ Error clearing server-side cache:', err)
  })
}

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).clearClientCache = clearClientCache
  console.log('💡 Run clearClientCache() in console to clear all cache')
}

export default clearClientCache
