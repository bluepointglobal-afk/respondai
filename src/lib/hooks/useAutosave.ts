import { useEffect, useRef, useState } from 'react'

export function useAutosave(
  data: any,
  onSave: (data: any) => void | Promise<void>,
  delay: number = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialRender = useRef(true)

  useEffect(() => {
    // Skip autosave on initial render
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for autosave
    timeoutRef.current = setTimeout(() => {
      console.log('💾 Autosaving...')
      onSave(data)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, onSave])
}

export function useSaveIndicator() {
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  
  const markUnsaved = () => setSaveState('unsaved')
  const markSaving = () => setSaveState('saving')
  const markSaved = () => setSaveState('saved')
  
  return { saveState, markUnsaved, markSaving, markSaved }
}
