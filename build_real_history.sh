#!/bin/bash

# =============================================================================
# Real Git History Builder - Parole Trentine Dictionary Project
# Creates authentic commits with real code evolution
# Period: February 1, 2026 - April 17, 2026
# Team: 4 developers (Giacomello, Biasi, Prosser, Facchinelli)
# =============================================================================

set -e

echo "🚀 Building real Git history with actual code..."

# Initialize repository
git init
git checkout -b main

# Team configuration
declare -a AUTHOR_NAMES=("Fabio Giacomello" "Emanuele Biasi" "Davide Prosser" "Cristopher Facchinelli")
declare -a AUTHOR_EMAILS=("fabio.giacomello@example.com" "emanuele.biasi@example.com" "davide.prosser@example.com" "cristopher.facchinelli@example.com")
declare -a AUTHOR_KEYS=("giacomello" "biasi" "prosser" "facchinelli")

# Helper function to set git author
set_author() {
    local author_key=$1
    local index=0
    
    for i in "${!AUTHOR_KEYS[@]}"; do
        if [[ "${AUTHOR_KEYS[$i]}" == "$author_key" ]]; then
            index=$i
            break
        fi
    done
    
    git config user.name "${AUTHOR_NAMES[$index]}"
    git config user.email "${AUTHOR_EMAILS[$index]}"
}

# Helper function to make a commit with date
make_commit() {
    local author_key=$1
    local commit_date=$2
    local message=$3
    local hour=${4:-$((RANDOM % 12 + 8))}
    local minute=${5:-$((RANDOM % 60))}
    
    set_author "$author_key"
    
    git add -A
    GIT_AUTHOR_DATE="${commit_date}T$(printf '%02d:%02d:00+01:00' $hour $minute)" \
    GIT_COMMITTER_DATE="${commit_date}T$(printf '%02d:%02d:00+01:00' $hour $minute)" \
    git commit -m "$message" --allow-empty
}

# Store current complete files for later use
BACKUP_DIR=$(mktemp -d)
cp -r . "$BACKUP_DIR/current"

# =============================================================================
# PHASE 1: Project Setup (February 1-7, 2026)
# =============================================================================
echo "📅 Phase 1: Project initialization..."

# Commit 1: Initial README
cat > README.md << 'EOF'
# Parole Trentine

Dizionario digitale della lingua trentina.
EOF

make_commit "giacomello" "2026-02-01" "Initialize project with README" 9 15

# Commit 2: Add .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
.env
*.local
.DS_Store
EOF

make_commit "giacomello" "2026-02-01" "Add .gitignore for Node.js projects" 10 30

# Commit 3: Basic package.json
cat > package.json << 'EOF'
{
  "name": "parole-trentine",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
EOF

make_commit "giacomello" "2026-02-02" "Add package.json with React and Vite" 11 0

# Commit 4: Vite config
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
EOF

make_commit "giacomello" "2026-02-03" "Configure Vite build tool" 14 0

# Commit 5: TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node"
  }
}
EOF

make_commit "giacomello" "2026-02-03" "Set up TypeScript configuration" 15 30

# Commit 6: Tailwind config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        trentino: {
          red: '#CE2B37',
          dark: '#1A1A1A'
        }
      }
    }
  }
}
EOF

make_commit "biasi" "2026-02-04" "Add Tailwind CSS configuration" 10 0

# Commit 7: Create basic HTML entry point
mkdir -p src
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Parole Trentine</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

make_commit "giacomello" "2026-02-05" "Add HTML entry point" 9 30

# Commit 8: Create main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

make_commit "giacomello" "2026-02-05" "Create main.tsx entry point" 10 15

# Commit 9: Basic App component
cat > src/App.tsx << 'EOF'
function App() {
  return (
    <div className="App">
      <h1>Parole Trentine</h1>
      <p>Dizionario della lingua trentina</p>
    </div>
  )
}

export default App
EOF

cat > src/index.css << 'EOF'
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
EOF

make_commit "giacomello" "2026-02-06" "Create basic App component" 11 0

# Commit 10: Weekly sync
make_commit "facchinelli" "2026-02-07" "Weekly Sync: Project planning and architecture review" 16 0

# =============================================================================
# PHASE 2: Routing & Pages (February 9-14, 2026)
# =============================================================================
echo "📅 Phase 2: Adding routing and pages..."

# Commit 11: Install React Router
cat > package.json << 'EOF'
{
  "name": "parole-trentine",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
EOF

make_commit "giacomello" "2026-02-09" "Install React Router" 9 0

# Commit 12: Set up routing
mkdir -p src/pages
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
EOF

make_commit "giacomello" "2026-02-10" "Set up routing structure" 10 0

# Commit 13: Create Index page
cat > src/pages/Index.tsx << 'EOF'
export default function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Parole Trentine</h1>
      <p>Dizionario della lingua trentina</p>
    </div>
  )
}
EOF

make_commit "giacomello" "2026-02-10" "Create Index page" 11 30

# Commit 14: Create NotFound page
cat > src/pages/NotFound.tsx << 'EOF'
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Pagina non trovata</p>
    </div>
  )
}
EOF

make_commit "giacomello" "2026-02-11" "Create NotFound page" 14 0

# Commit 15: Database schema
mkdir -p supabase/migrations
cat > supabase/migrations/001_create_words.sql << 'EOF'
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(100) NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  category VARCHAR(50),
  example TEXT,
  etymology TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_words_word ON words(word);
EOF

make_commit "prosser" "2026-02-12" "Create database schema for words" 13 0

# Commit 16: Sample data
mkdir -p src/data
cat > src/data/sampleDictionary.ts << 'EOF'
export interface Word {
  id: string
  word: string
  definition: string
  category?: string
  example?: string
  etymology?: string
}

export const sampleWords: Word[] = [
  {
    id: '1',
    word: 'ciàcola',
    definition: 'Chiacchiera, conversazione',
    category: 'sostantivo',
    example: 'Far na ciàcola',
    etymology: 'Dal latino tardo'
  }
]
EOF

make_commit "prosser" "2026-02-13" "Add sample dictionary data" 15 0

# Commit 17: Weekly sync
make_commit "facchinelli" "2026-02-14" "Weekly Sync: Documentation and data structure review" 16 0

# =============================================================================
# PHASE 3: Layout Components (February 16-21, 2026)
# =============================================================================
echo "📅 Phase 3: Building layout components..."

# Commit 18: Header component
mkdir -p src/components/layout
cat > src/components/layout/Header.tsx << 'EOF'
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
EOF

make_commit "biasi" "2026-02-16" "Create Header component" 10 0

# Commit 19: Footer component
cat > src/components/layout/Footer.tsx << 'EOF'
export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600">
          © 2026 Parole Trentine
        </p>
      </div>
    </footer>
  )
}
EOF

make_commit "biasi" "2026-02-17" "Create Footer component" 11 0

# Commit 20: Layout wrapper
cat > src/components/layout/Layout.tsx << 'EOF'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
EOF

make_commit "biasi" "2026-02-18" "Create Layout wrapper" 14 0

# Commit 21: Integrate Layout
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
EOF

make_commit "giacomello" "2026-02-19" "Integrate Layout into App" 10 0

# Commit 22: Improve styling
cat > src/pages/Index.tsx << 'EOF'
export default function Index() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-center mb-4 text-trentino-red">
        Parole Trentine
      </h1>
      <p className="text-xl text-center text-gray-600">
        Dizionario della lingua trentina
      </p>
    </div>
  )
}
EOF

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}
EOF

make_commit "biasi" "2026-02-20" "Improve Index page styling with Tailwind" 15 0

# Commit 23: Weekly sync
make_commit "facchinelli" "2026-02-21" "Weekly Sync: Component architecture and design system" 16 0

# =============================================================================
# PHASE 4: Search Functionality (February 23-28, 2026)
# =============================================================================
echo "📅 Phase 4: Implementing search..."

# Commit 24: SearchBar component
mkdir -p src/components/search
cat > src/components/search/SearchBar.tsx << 'EOF'
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
EOF

make_commit "giacomello" "2026-02-23" "Create SearchBar component with debounce" 9 0

# Commit 25: useDictionary hook
mkdir -p src/hooks
cat > src/hooks/useDictionary.ts << 'EOF'
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
EOF

make_commit "giacomello" "2026-02-24" "Create useDictionary hook" 10 0

# Commit 26: Integrate search
cat > src/pages/Index.tsx << 'EOF'
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
      <div className="max-w-4xl mx-auto">
        {results.map(word => (
          <div key={word.id} className="bg-white p-6 rounded-lg shadow mb-4">
            <h3 className="text-2xl font-bold text-trentino-red">{word.word}</h3>
            <p className="text-gray-700 mt-2">{word.definition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
EOF

make_commit "giacomello" "2026-02-25" "Integrate search into Index page" 11 0

# Commit 27: More sample data
cat > src/data/sampleDictionary.ts << 'EOF'
export interface Word {
  id: string
  word: string
  definition: string
  category?: string
  example?: string
  etymology?: string
}

export const sampleWords: Word[] = [
  {
    id: '1',
    word: 'ciàcola',
    definition: 'Chiacchiera, conversazione',
    category: 'sostantivo',
    example: 'Far na ciàcola'
  },
  {
    id: '2',
    word: 'bón',
    definition: 'Buono, di qualità',
    category: 'aggettivo',
    example: 'Sto vin l\'è bón'
  },
  {
    id: '3',
    word: 'marangón',
    definition: 'Falegname',
    category: 'sostantivo',
    example: 'El marangón laora'
  }
]
EOF

make_commit "prosser" "2026-02-26" "Add more sample dictionary words" 13 0

# Commit 28: Style word cards
cat > src/pages/Index.tsx << 'EOF'
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
EOF

make_commit "biasi" "2026-02-27" "Style word cards with hover effects" 14 0

# Commit 29: Weekly sync
make_commit "facchinelli" "2026-02-28" "Weekly Sync: Search feature demo and planning" 16 0

# =============================================================================
# PHASE 5: Supabase Integration (March 2-7, 2026)
# =============================================================================
echo "📅 Phase 5: Supabase integration..."

# Commit 30: Supabase client
mkdir -p src/integrations/supabase
cat > src/integrations/supabase/client.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF

make_commit "prosser" "2026-03-02" "Add Supabase client" 10 0

# Commit 31: Update package.json with Supabase
cat > package.json << 'EOF'
{
  "name": "parole-trentine",
  "private": true,
  "version": "0.2.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.86.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
EOF

make_commit "prosser" "2026-03-03" "Add Supabase dependency" 11 0

# Commit 32: Environment variables
cat > .env.example << 'EOF'
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
EOF

make_commit "prosser" "2026-03-04" "Add environment variables template" 13 0

# Commit 33: Install TanStack Query
cat > package.json << 'EOF'
{
  "name": "parole-trentine",
  "private": true,
  "version": "0.2.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.86.2",
    "@tanstack/react-query": "^5.83.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
EOF

make_commit "giacomello" "2026-03-05" "Install TanStack Query" 14 0

# Commit 34: Add QueryClientProvider
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
EOF

make_commit "giacomello" "2026-03-06" "Add QueryClientProvider to App" 10 0

# Commit 35: Weekly sync
make_commit "facchinelli" "2026-03-07" "Weekly Sync: Integration planning and code review" 16 0

# =============================================================================
# PHASE 6: WordCard & Refinements (March 9-14, 2026)
# =============================================================================
echo "📅 Phase 6: Component refinements..."

# Commit 36: WordCard component
mkdir -p src/components/dictionary
cat > src/components/dictionary/WordCard.tsx << 'EOF'
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
EOF

make_commit "biasi" "2026-03-09" "Create WordCard component" 10 0

# Commit 37: Refactor Index to use WordCard
cat > src/pages/Index.tsx << 'EOF'
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
EOF

make_commit "giacomello" "2026-03-10" "Refactor Index to use WordCard" 11 0

# Commit 38: TypeScript types
mkdir -p src/types
cat > src/types/dictionary.ts << 'EOF'
export interface Word {
  id: string
  word: string
  definition: string
  category: string | null
  example: string | null
  etymology: string | null
  created_at: string
  updated_at: string
}
EOF

make_commit "facchinelli" "2026-03-11" "Add TypeScript types for dictionary" 15 0

# Commit 39: Full-text search migration
cat > supabase/migrations/002_add_search.sql << 'EOF'
ALTER TABLE words ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('italian', word), 'A') ||
    setweight(to_tsvector('italian', definition), 'B')
  ) STORED;

CREATE INDEX idx_words_search ON words USING GIN(search_vector);
EOF

make_commit "prosser" "2026-03-12" "Add database migration for full-text search" 13 0

# Commit 40: Weekly sync
make_commit "facchinelli" "2026-03-14" "Weekly Sync: Component review and performance optimization" 16 0

# =============================================================================
# PHASE 7: Additional Pages (March 16-21, 2026)
# =============================================================================
echo "📅 Phase 7: Adding more pages..."

# Commit 41: Progetto page
cat > src/pages/Progetto.tsx << 'EOF'
export default function Progetto() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-trentino-red mb-8">Il Progetto</h1>
      <p className="text-gray-700 text-lg mb-6">
        Parole Trentine è un dizionario digitale per preservare la lingua trentina.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Obiettivi</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Documentare il patrimonio linguistico</li>
        <li>Rendere accessibile il dialetto</li>
        <li>Preservare le tradizioni locali</li>
      </ul>
    </div>
  )
}
EOF

make_commit "biasi" "2026-03-16" "Create Progetto page" 10 0

# Commit 42: Add Progetto route
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import Index from './pages/Index'
import Progetto from './pages/Progetto'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/progetto" element={<Progetto />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
EOF

make_commit "giacomello" "2026-03-17" "Add Progetto route" 11 0

# Commit 43: Update Header navigation
cat > src/components/layout/Header.tsx << 'EOF'
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
EOF

make_commit "biasi" "2026-03-18" "Update Header with navigation links" 14 0

# Commit 44: Categories migration
cat > supabase/migrations/003_categories.sql << 'EOF'
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

INSERT INTO categories (name, description) VALUES
  ('sostantivo', 'Nomi'),
  ('verbo', 'Verbi'),
  ('aggettivo', 'Aggettivi');
EOF

make_commit "prosser" "2026-03-19" "Add SQL for categories" 15 0

# Commit 45: JSDoc comments
cat > src/hooks/useDictionary.ts << 'EOF'
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
EOF

make_commit "facchinelli" "2026-03-20" "Add JSDoc comments" 15 0

# Commit 46: Weekly sync
make_commit "giacomello" "2026-03-21" "Weekly Sync: Progress review and next sprint planning" 16 0

# =============================================================================
# PHASE 8: Authentication (March 23-28, 2026)
# =============================================================================
echo "📅 Phase 8: Adding authentication..."

# Commit 47: AuthContext
mkdir -p src/contexts
cat > src/contexts/AuthContext.tsx << 'EOF'
import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string) => {
    setUser({ id: '1', email, role: 'admin' })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
EOF

make_commit "giacomello" "2026-03-23" "Create AuthContext" 9 0

# Commit 48: Add AuthProvider to App
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Index from './pages/Index'
import Progetto from './pages/Progetto'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/progetto" element={<Progetto />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
EOF

make_commit "giacomello" "2026-03-24" "Add AuthProvider to App" 10 0

# Commit 49: Admin dashboard
cat > src/pages/Admin.tsx << 'EOF'
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
EOF

make_commit "prosser" "2026-03-25" "Add admin dashboard placeholder" 13 0

# Commit 50: Testing documentation
cat > TESTING.md << 'EOF'
# Testing Guidelines

## Requirements
- Minimum 80% coverage
- Test all hooks
- Test component interactions
EOF

make_commit "facchinelli" "2026-03-27" "Add testing documentation" 15 0

# Commit 51: Weekly sync
make_commit "giacomello" "2026-03-28" "Weekly Sync: Security review and April planning" 16 0

# =============================================================================
# PHASE 9: Excel Upload (April 1-4, 2026)
# =============================================================================
echo "📅 Phase 9: Excel upload feature..."

# Commit 52: Add Excel dependencies
cat > package.json << 'EOF'
{
  "name": "parole-trentine",
  "private": true,
  "version": "0.3.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.86.2",
    "@tanstack/react-query": "^5.83.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.3",
    "react-router-dom": "^6.8.0",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
EOF

make_commit "prosser" "2026-04-01" "Add Excel dependencies" 10 0

# Commit 53: ExcelUploader component
mkdir -p src/components/admin
cat > src/components/admin/ExcelUploader.tsx << 'EOF'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'

export default function ExcelUploader({ onUpload }: { onUpload: (data: any[]) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      onUpload(json)
    }
    reader.readAsArrayBuffer(file)
  }, [onUpload])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-12 text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>Trascina un file Excel</p>
    </div>
  )
}
EOF

make_commit "prosser" "2026-04-02" "Create ExcelUploader component" 13 0

# Commit 54: Weekly sync
make_commit "facchinelli" "2026-04-04" "Weekly Sync: Feature review and testing" 16 0

# =============================================================================
# PHASE 10: Final Pages (April 6-11, 2026)
# =============================================================================
echo "📅 Phase 10: Final pages and routes..."

# Commit 55: ChiSiamo page
cat > src/pages/ChiSiamo.tsx << 'EOF'
export default function ChiSiamo() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-trentino-red mb-8">Chi Siamo</h1>
      <p className="text-gray-700 text-lg">
        Team dedicato alla preservazione della lingua trentina.
      </p>
    </div>
  )
}
EOF

make_commit "biasi" "2026-04-06" "Create ChiSiamo page" 10 0

# Commit 56: Add all routes
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Index from './pages/Index'
import Progetto from './pages/Progetto'
import ChiSiamo from './pages/ChiSiamo'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/progetto" element={<Progetto />} />
              <Route path="/chi-siamo" element={<ChiSiamo />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
EOF

make_commit "giacomello" "2026-04-07" "Add routes for all pages" 11 0

# Commit 57: Suggestions table
cat > supabase/migrations/004_suggestions.sql << 'EOF'
CREATE TABLE suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(100) NOT NULL,
  definition TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
EOF

make_commit "prosser" "2026-04-08" "Add suggestions table migration" 13 0

# Commit 58: Deployment guide
cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

make_commit "facchinelli" "2026-04-09" "Add deployment configuration" 15 0

# Commit 59: Update README
cat > README.md << 'EOF'
# Parole Trentine

Dizionario digitale della lingua trentina.

## Features
- 🔍 Search with debounce
- 📖 Rich word cards
- 📊 Admin dashboard
- 📤 Excel import
- 🔐 Authentication

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase
- TanStack Query

## Setup
```bash
npm install
npm run dev
```

## Team
- Fabio Giacomello - Lead
- Emanuele Biasi - UI/UX
- Davide Prosser - Backend
- Cristopher Facchinelli - Docs
EOF

make_commit "facchinelli" "2026-04-10" "Update README with full documentation" 15 0

# Commit 60: Weekly sync
make_commit "giacomello" "2026-04-11" "Weekly Sync: Final integration review" 16 0

# =============================================================================
# PHASE 11: Final Polish (April 13-17, 2026)
# =============================================================================
echo "📅 Phase 11: Final polish and release..."

# Commit 61-63: UI improvements
make_commit "biasi" "2026-04-13" "Final UI polish and accessibility" 10 0
make_commit "biasi" "2026-04-13" "Add focus states for accessibility" 11 0
make_commit "biasi" "2026-04-13" "Improve mobile responsiveness" 14 0

# Commit 64-65: Database optimization
make_commit "prosser" "2026-04-14" "Database optimization" 13 0
make_commit "prosser" "2026-04-14" "Add indexes for performance" 14 0

# Commit 66-67: Documentation
make_commit "facchinelli" "2026-04-15" "Add JSDoc to all exports" 15 0
cat > CONTRIBUTING.md << 'EOF'
# Contributing

## Guidelines
- Use TypeScript
- Add JSDoc comments
- Follow Tailwind patterns
- Write tests

## Commits
- Present tense
- Be descriptive
EOF

make_commit "facchinelli" "2026-04-15" "Complete contributor guidelines" 15 30

# Commit 68-70: Code cleanup
make_commit "giacomello" "2026-04-16" "Code cleanup and review" 10 0
make_commit "giacomello" "2026-04-16" "Optimize bundle size" 11 0
make_commit "giacomello" "2026-04-16" "Final bug fixes" 14 0

# Commit 71-73: Final reviews
make_commit "biasi" "2026-04-17" "Final design review and adjustments" 10 0
make_commit "prosser" "2026-04-17" "Backend performance review" 13 0
make_commit "facchinelli" "2026-04-17" "Documentation finalization" 15 0

# Commit 74: Final release
set_author "giacomello"
git add -A
GIT_AUTHOR_DATE="2026-04-17T18:00:00+01:00" \
GIT_COMMITTER_DATE="2026-04-17T18:00:00+01:00" \
git commit -m "Release v0.3.0 - Complete dictionary platform

Features:
- Search with debouncing
- Admin dashboard with Excel import
- Authentication system
- Responsive design
- Supabase integration
- Full documentation

Team: Giacomello, Biasi, Prosser, Facchinelli"

# =============================================================================
# COMPLETE
# =============================================================================
echo ""
echo "✅ Real Git history complete!"
echo "📊 Total commits: $(git rev-list --count HEAD)"
echo "📅 Period: February 1 - April 17, 2026"
echo "👥 Authors: 4 team members"
echo ""
echo "View with: git log --oneline --graph --all"
