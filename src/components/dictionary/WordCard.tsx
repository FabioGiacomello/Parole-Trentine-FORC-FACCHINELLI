import { Word } from '../../data/sampleDictionary'

export default function WordCard({ word }: { word: Word }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold text-trentino-red">{word.word}</h3>
        {word.category && (
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {word.category}
          </span>
        )}
      </div>
      <p className="text-gray-700 mt-3">{word.definition}</p>
      {word.example && (
        <p className="text-gray-500 italic mt-3 border-l-4 border-trentino-red pl-4">
          "{word.example}"
        </p>
      )}
    </div>
  )
}
