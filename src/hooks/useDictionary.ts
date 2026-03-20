import { useState } from 'react'
import { sampleWords } from '../data/sampleDictionary'

/**
 * Hook for dictionary search
 * @returns searchWords function
 */
export function useDictionary() {
  /**
   * Search words by term
   * @param term - Search query
   * @returns Filtered words
   */
  const searchWords = (term: string) => {
    if (!term.trim()) return sampleWords
    return sampleWords.filter(w =>
      w.word.toLowerCase().includes(term.toLowerCase())
    )
  }

  return { searchWords }
}
