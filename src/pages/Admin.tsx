import { useAuth } from '../contexts/AuthContext'

export default function Admin() {
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return <p className="text-center py-12">Non autorizzato</p>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-trentino-red mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Parole Totali</h3>
          <p className="text-3xl font-bold text-trentino-red mt-2">0</p>
        </div>
      </div>
    </div>
  )
}
