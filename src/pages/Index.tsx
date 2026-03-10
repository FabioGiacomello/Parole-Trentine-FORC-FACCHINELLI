import { useState } from 'react'
import SearchBar from '../components/search/SearchBar'
import WordCard from '../components/dictionary/WordCard'
import { useDictionary } from '../hooks/useDictionary'

export default function Index() {
  const [term, setTerm] = useState('')
  const { searchWords } = useDictionary()
  const results = searchWords(term)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-center mb-8 text-trentino-red">
        Parole Trentine
      </h1>
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar onSearch={setTerm} />
      </div>
      <div className="max-w-4xl mx-auto grid gap-6">
        {results.map(word => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>
    </div>
  )
}
