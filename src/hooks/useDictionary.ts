import { useState } from 'react'
import { sampleWords } from '../data/sampleDictionary'

export function useDictionary() {
  const searchWords = (term: string) => {
    if (!term.trim()) return sampleWords
    return sampleWords.filter(w =>
      w.word.toLowerCase().includes(term.toLowerCase())
    )
  }

  return { searchWords }
}
