import { useState } from 'react'
import SearchBar from '../components/search/SearchBar'
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
          <div key={word.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-trentino-red">{word.word}</h3>
            <p className="text-gray-700 mt-2">{word.definition}</p>
            {word.example && (
              <p className="text-gray-500 italic mt-2">"{word.example}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
