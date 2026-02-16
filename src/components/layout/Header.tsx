import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <Link to="/" className="text-2xl font-bold text-trentino-red">
          Parole Trentine
        </Link>
      </nav>
    </header>
  )
}
