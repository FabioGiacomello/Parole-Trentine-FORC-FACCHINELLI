import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trentino-red">
            Parole Trentine
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-trentino-red transition">Home</Link>
            <Link to="/progetto" className="hover:text-trentino-red transition">Progetto</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
