import { useState, useEffect } from 'react'

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300)
    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Cerca..."
      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-trentino-red"
    />
  )
}
