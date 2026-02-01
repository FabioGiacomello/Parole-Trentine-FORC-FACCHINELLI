#!/bin/bash
###############################################################################
# Git History Simulation - EVOLUTION MODE
# Each commit modifies actual code showing realistic progression
###############################################################################

set -e

if [ ! -d ".git" ]; then
  echo "❌ Error: Must run from a Git repository"
  exit 1
fi

echo "🚀 Git History Simulation - Evolution Mode"
echo "==========================================="

# Team
NAMES=("Fabio Giacomello" "Emanuele Biasi" "Davide Prosser" "Cristopher Facchinelli")
EMAILS=("fabio@demo.com" "emanuele@demo.com" "davide@demo.com" "cristopher@demo.com")

START="2026-02-01"
END="2026-04-17"
TOTAL=0
declare -a COUNTS=(0 0 0 0)

# Helpers
set_git() {
  git config user.name "${NAMES[$1]}"
  git config user.email "${EMAILS[$1]}"
}

timestamp() {
  local h=$((RANDOM % 14 + 8))
  local m=$((RANDOM % 60))
  printf "%sT%02d:%02d:00+01:00" "$1" "$h" "$m"
}

commit() {
  local author=$1 msg="$2" date=$3
  local ts=$(timestamp "$date")
  set_git $author
  git add -A
  GIT_AUTHOR_DATE="$ts" GIT_COMMITTER_DATE="$ts" git commit -m "$msg" --date="$ts" --allow-empty
  TOTAL=$((TOTAL+1))
  COUNTS[$author]=$((${COUNTS[$author]}+1))
}

# CODE EVOLUTION FUNCTIONS
# February: Foundation
feb_fabio() {
  mkdir -p src
  case $((RANDOM % 5)) in
    0) cat > package.json << 'EOF'
{
  "name": "parole-trentine",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
EOF
    ;;
    1) cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "outDir": "./dist"
  },
  "include": ["src"]
}
EOF
    ;;
    2) mkdir -p src
       cat > src/App.tsx << 'EOF'
import React from 'react';

function App() {
  return (
    <div>
      <h1>Dizionario Trentino</h1>
    </div>
  );
}

export default App;
EOF
    ;;
    3) mkdir -p src
       cat > src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
    ;;
    4) mkdir -p src/pages
       cat > src/pages/Index.tsx << 'EOF'
import React from 'react';

const Index = () => {
  return <div><h1>Home</h1></div>;
};

export default Index;
EOF
    ;;
  esac
}

feb_emanuele() {
  mkdir -p src
  case $((RANDOM % 4)) in
    0) cat > tailwind.config.js << 'EOF'
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
EOF
    ;;
    1) cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
EOF
    ;;
    2) mkdir -p src/components/layout
       cat > src/components/layout/Header.tsx << 'EOF'
import React from 'react';

const Header = () => {
  return (
    <header className="p-4 bg-white shadow">
      <h1 className="text-xl font-bold">Dizionario Trentino</h1>
    </header>
  );
};

export default Header;
EOF
    ;;
    3) cat > src/components/layout/Footer.tsx << 'EOF'
import React from 'react';

const Footer = () => (
  <footer className="p-4 bg-gray-50 text-center">
    <p>© 2026 Dizionario Trentino</p>
  </footer>
);

export default Footer;
EOF
    ;;
  esac
}

feb_davide() {
  mkdir -p src supabase/migrations
  case $((RANDOM % 3)) in
    0) mkdir -p supabase/migrations
       cat > supabase/migrations/001_dictionary.sql << 'EOF'
CREATE TYPE grammar_category AS ENUM (
  'sostantivo', 'verbo', 'aggettivo', 'avverbio'
);

CREATE TABLE dictionary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dialect_word TEXT NOT NULL,
  italian_word TEXT NOT NULL,
  category grammar_category,
  definition TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE dictionary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON dictionary_entries
  FOR SELECT USING (true);
EOF
    ;;
    1) mkdir -p src/integrations/supabase
       cat > src/integrations/supabase/client.ts << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export { supabase };
EOF
    ;;
    2) cat > .env.example << 'EOF'
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
EOF
    ;;
  esac
}

feb_cristopher() {
  mkdir -p docs
  case $((RANDOM % 3)) in
    0) cat > README.md << 'EOF'
# Dizionario Trentino

Digital dictionary for Trentino dialect.

## Setup
```bash
npm install
npm run dev
```

## Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
EOF
    ;;
    1) cat > .gitignore << 'EOF'
node_modules
dist
.env
*.log
EOF
    ;;
    2) mkdir -p docs
       cat > docs/SETUP.md << 'EOF'
# Setup Guide

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Run: `npm run dev`
EOF
    ;;
  esac
}

# March: Core Features
mar_fabio() {
  mkdir -p src
  case $((RANDOM % 4)) in
    0) mkdir -p src/hooks src/types
       cat > src/types/dictionary.ts << 'EOF'
export type GrammarCategory = 
  | 'sostantivo' | 'verbo' | 'aggettivo' | 'avverbio';

export interface DictionaryEntry {
  id: string;
  dialect_word: string;
  italian_word: string;
  category: GrammarCategory;
  definition?: string;
}

export interface SearchFilters {
  category?: GrammarCategory;
}
EOF
    ;;
    1) cat > src/hooks/useDictionary.ts << 'EOF'
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DictionaryEntry } from '@/types/dictionary';

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);

  useEffect(() => {
    supabase
      .from('dictionary_entries')
      .select('*')
      .then(({ data }) => {
        if (data) setEntries(data);
      });
  }, []);

  const search = (query: string) => {
    return entries.filter(e =>
      e.dialect_word.toLowerCase().includes(query.toLowerCase())
    );
  };

  return { entries, search };
}
EOF
    ;;
    2) cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
EOF
    ;;
    3) mkdir -p src/contexts
       cat > src/contexts/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
EOF
    ;;
  esac
}

mar_emanuele() {
  mkdir -p src
  case $((RANDOM % 4)) in
    0) mkdir -p src/components/search
       cat > src/components/search/SearchBar.tsx << 'EOF'
import React, { useState } from 'react';

export const SearchBar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [query, setQuery] = useState('');
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="px-4 py-2 border rounded"
      />
    </form>
  );
};
EOF
    ;;
    1) mkdir -p src/components/dictionary
       cat > src/components/dictionary/WordCard.tsx << 'EOF'
import React from 'react';
import { DictionaryEntry } from '@/types/dictionary';

export const WordCard = ({ entry }: { entry: DictionaryEntry }) => (
  <div className="p-4 border rounded hover:shadow-md">
    <h3 className="font-bold">{entry.dialect_word}</h3>
    <p>{entry.italian_word}</p>
    {entry.definition && <p className="text-sm mt-2">{entry.definition}</p>}
  </div>
);
EOF
    ;;
    2) cat > src/pages/Admin.tsx << 'EOF'
import React from 'react';

const Admin = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Admin</h1>
  </div>
);

export default Admin;
EOF
    ;;
    3) cat > src/pages/Suggerisci.tsx << 'EOF'
import React from 'react';

const Suggerisci = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Suggerisci Parola</h1>
  </div>
);

export default Suggerisci;
EOF
    ;;
  esac
}

mar_davide() {
  mkdir -p src supabase/migrations
  case $((RANDOM % 3)) in
    0) cat > supabase/migrations/002_suggestions.sql << 'EOF'
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dialect_word TEXT NOT NULL,
  italian_word TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
EOF
    ;;
    1) cat > supabase/migrations/003_user_roles.sql << 'EOF'
CREATE TYPE app_role AS ENUM ('admin', 'moderator');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  role app_role NOT NULL
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
EOF
    ;;
    2) mkdir -p src/lib
       cat > src/lib/csvParser.ts << 'EOF'
export function parseCSV(text: string) {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: any = {};
    headers.forEach((h, i) => obj[h] = values[i]);
    return obj;
  });
}
EOF
    ;;
  esac
}

mar_cristopher() {
  case $((RANDOM % 3)) in
    0) mkdir -p src/hooks
       cat > src/hooks/useDictionary.ts << 'EOF'
/**
 * Hook for dictionary operations
 * @returns entries and search function
 */
import { useState, useEffect } from 'react';

export function useDictionary() {
  const [entries, setEntries] = useState<any[]>([]);

  /** Fetch from Supabase */
  useEffect(() => {
    // fetch logic
  }, []);

  /** Search entries */
  const search = (query: string) => {
    return entries.filter(e => 
      e.dialect_word.includes(query)
    );
  };

  return { entries, search };
}
EOF
    ;;
    1) cat >> README.md << 'EOF'

## Features
- Search words
- Browse categories
- User suggestions
EOF
    ;;
    2) mkdir -p docs
       cat > docs/ARCHITECTURE.md << 'EOF'
# Architecture

## Structure
- src/components - React components
- src/hooks - Custom hooks
- src/pages - Routes
- supabase - Database

## Data Flow
User → Search → Supabase → Results
EOF
    ;;
  esac
}

# April: Polish
apr_fabio() {
  mkdir -p src
  case $((RANDOM % 3)) in
    0) mkdir -p src/hooks
       cat > src/hooks/useDictionary.ts << 'EOF'
/**
 * Dictionary hook with caching and useMemo
 */
import { useState, useEffect, useMemo } from 'react';

export function useDictionary() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    // fetch
  }, []);

  const search = useMemo(() => {
    return (query: string, filters?: any) => {
      return entries.filter(e =>
        e.dialect_word.toLowerCase().includes(query.toLowerCase())
      );
    };
  }, [entries]);

  return { entries, search };
}
EOF
    ;;
    1) mkdir -p src/lib
       cat > src/lib/utils.ts << 'EOF'
export function debounce(fn: Function, ms: number) {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
EOF
    ;;
    2) cat > src/App.tsx << 'EOF'
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Index = lazy(() => import('./pages/Index'));
const Admin = lazy(() => import('./pages/Admin'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
EOF
    ;;
  esac
}

apr_emanuele() {
  mkdir -p src
  case $((RANDOM % 3)) in
    0) cat > tailwind.config.js << 'EOF'
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f0f9ff', 500: '#0ea5e9' },
      },
    },
  },
  darkMode: 'class',
}
EOF
    ;;
    1) cat > src/pages/ChiSiamo.tsx << 'EOF'
import React from 'react';

const ChiSiamo = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">Chi Siamo</h1>
    <p className="text-lg">Team del Dizionario Trentino</p>
  </div>
);

export default ChiSiamo;
EOF
    ;;
    2) cat > src/pages/Contatti.tsx << 'EOF'
import React from 'react';

const Contatti = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Contatti</h1>
    <form className="space-y-4">
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
      <textarea placeholder="Message" className="w-full p-2 border rounded" />
      <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded">
        Send
      </button>
    </form>
  </div>
);

export default Contatti;
EOF
    ;;
  esac
}

apr_davide() {
  mkdir -p src supabase/migrations
  case $((RANDOM % 3)) in
    0) cat > supabase/migrations/004_indexes.sql << 'EOF'
CREATE INDEX idx_dialect_word ON dictionary_entries(dialect_word);
CREATE INDEX idx_category ON dictionary_entries(category);
CREATE INDEX idx_suggestions_status ON suggestions(status);
EOF
    ;;
    1) cat >> src/lib/csvParser.ts << 'EOF'

export function validateEntry(entry: any) {
  if (!entry.dialect_word || !entry.italian_word) {
    throw new Error('Missing required fields');
  }
  return true;
}
EOF
    ;;
    2) cat > src/lib/api.ts << 'EOF'
import { supabase } from '@/integrations/supabase/client';

export async function getEntries() {
  const { data } = await supabase
    .from('dictionary_entries')
    .select('*')
    .order('dialect_word');
  return data;
}

export async function submitSuggestion(data: any) {
  return await supabase.from('suggestions').insert(data);
}
EOF
    ;;
  esac
}

apr_cristopher() {
  mkdir -p src
  case $((RANDOM % 3)) in
    0) cat > README.md << 'EOF'
# Dizionario Trentino

Complete digital dictionary for Trentino dialect.

## Features
- 🔍 Search dialect words
- 📚 Browse by category
- 💡 User suggestions
- 👤 Admin dashboard

## Quick Start
```bash
npm install && npm run dev
```

## Tech Stack
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Supabase
- React Query

## Team
- Fabio G. - Lead
- Emanuele B. - UI/UX
- Davide P. - Backend
- Cristopher F. - Docs
EOF
    ;;
    1) cat > CONTRIBUTING.md << 'EOF'
# Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## Code Style
- Use TypeScript
- Follow ESLint rules
- Add JSDoc comments
EOF
    ;;
    2) cat > src/components/dictionary/WordDetail.tsx << 'EOF'
import React from 'react';
import { DictionaryEntry } from '@/types/dictionary';

/**
 * WordDetail shows full entry information
 */
export const WordDetail = ({ entry }: { entry: DictionaryEntry }) => (
  <div className="p-6 border rounded-lg">
    <h2 className="text-2xl font-bold">{entry.dialect_word}</h2>
    <p className="text-gray-600">{entry.italian_word}</p>
    {entry.definition && (
      <p className="mt-4">{entry.definition}</p>
    )}
  </div>
);
EOF
    ;;
  esac
}

# MAIN LOOP
echo "📅 Processing: $START → $END"
echo ""

current="$START"
while [[ "$current" < "$END" ]] || [[ "$current" == "$END" ]]; do
  dow=$(date -j -f "%Y-%m-%d" "$current" +%u 2>/dev/null || date -d "$current" +%u)
  month=$(date -j -f "%Y-%m-%d" "$current" +%m 2>/dev/null || date -d "$current" +%m)
  
  # Friday sync
  if [ "$dow" -eq 5 ]; then
    for i in 0 1 2 3; do
      commit $i "Weekly sync - $(date -j -f "%Y-%m-%d" "$current" +%B)" "$current"
    done
  fi
  
  # 2-3 commits per day
  for ((c=0; c<$((RANDOM % 2 + 2)); c++)); do
    author=$((RANDOM % 4))
    
    if [ "$month" -eq 2 ]; then
      msg="Foundation work"
      case $author in
        0) feb_fabio; msg="Initialize React project structure" ;;
        1) feb_emanuele; msg="Add Tailwind CSS configuration" ;;
        2) feb_davide; msg="Create Supabase database schema" ;;
        3) feb_cristopher; msg="Write project documentation" ;;
      esac
    elif [ "$month" -eq 3 ]; then
      msg="Core features"
      case $author in
        0) mar_fabio; msg="Implement useDictionary hook" ;;
        1) mar_emanuele; msg="Create SearchBar component" ;;
        2) mar_davide; msg="Add suggestions table" ;;
        3) mar_cristopher; msg="Add JSDoc comments" ;;
      esac
    else
      msg="Polish and docs"
      case $author in
        0) apr_fabio; msg="Optimize with useMemo" ;;
        1) apr_emanuele; msg="Add dark mode support" ;;
        2) apr_davide; msg="Create database indexes" ;;
        3) apr_cristopher; msg="Update README" ;;
      esac
    fi
    
    commit $author "$msg" "$current"
  done
  
  current=$(date -j -v+1d -f "%Y-%m-%d" "$current" +%Y-%m-%d 2>/dev/null || date -d "$current + 1 day" +%Y-%m-%d)
done

echo ""
echo "✅ Complete!"
echo "Total: $TOTAL commits"
for i in 0 1 2 3; do
  echo "  ${NAMES[$i]}: ${COUNTS[$i]}"
done
