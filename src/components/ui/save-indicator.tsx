'use client'

import { Check, Loader2, Cloud } from 'lucide-react'

interface SaveIndicatorProps {
  state: 'saved' | 'saving' | 'unsaved'
}

export function SaveIndicator({ state }: SaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {state === 'saved' && (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
            All changes saved
          </span>
        </>
      )}
      
      {state === 'saving' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-blue-500">Saving...</span>
        </>
      )}
      
      {state === 'unsaved' && (
        <>
          <Cloud className="h-4 w-4 text-orange-500" />
          <span className="text-orange-500">
            Unsaved changes
          </span>
        </>
      )}
    </div>
  )
}
