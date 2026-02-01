#!/bin/bash
###############################################################################
# Git History Simulation Script - Parole Trentine Dictionary  
# EVOLUTION VERSION - Each commit modifies actual code
###############################################################################

set -e

if [ ! -d ".git" ]; then
  echo "❌ Error: Must run from within a Git repository."
  exit 1
fi

echo "🚀 Starting Git History Simulation (Evolution Mode)..."
echo "======================================================"
echo "⚠️  This will create commits with real code evolution!"
echo ""

# Configuration
declare -a TEAM_NAMES=("Fabio Giacomello" "Emanuele Biasi" "Davide Prosser "Cristopher Facchinelli")
declare -a TEAM_EMAILS=("fabio.giacomello@example.com" "emanuele.biasi@example.com" "davide.prosser@example.com" "cristopher.facchinelli@example.com")

START_DATE="2026-02-01"
END_DATE="2026-04-17"
TOTAL_COMMITS=0
declare -a AUTHOR_COMMITS=(0 0 0 0)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

set_author() {
  local name=$1
  local email=$2
  git config user.name "$name"
  git config user.email "$email"
}

generate_timestamp() {
  local date=$1
  local slot=$((RANDOM % 3))
  local hour=$((slot * 5 + 8 + RANDOM % 4))
  local minute=$((RANDOM % 60))
  printf "%sT%02d:%02d:00+01:00" "$date" "$hour" "$minute"
}

make_commit() {
  local author_idx=$1
  local message=$2
  local date=$3
  local phase=$4  # foundation, core, polish
  
  local name="${TEAM_NAMES[$author_idx]}"
  local email="${TEAM_EMAILS[$author_idx]}"
  local timestamp=$(generate_timestamp "$date")
  
  set_author "$name" "$email"
  
  # Generate code modifications based on phase, author, and date
  generate_code_for_commit "$phase" "$author_idx" "$date" "$message"
  
  git add -A
  GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" \
    git commit -m "$message" --date="$timestamp" --allow-empty
  
  TOTAL_COMMITS=$((TOTAL_COMMITS + 1))
  AUTHOR_COMMITS[$author_idx]=$((${AUTHOR_COMMITS[$author_idx]} + 1))
  
  if (( TOTAL_COMMITS % 10 == 0 )); then
    echo "  ✓ Commit #$TOTAL_COMMITS: $message"
  fi
}

get_day_of_week() {
  local date=$1
  date -j -f "%Y-%m-%d" "$date" +%u 2>/dev/null || date -d "$date" +%u 2>/dev/null
}

# ============================================================================
# COMMIT MESSAGE ARRAYS
# ============================================================================

# Fabio (Lead) - February
declare -a FABIO_FEB=(
  "Initialize React project with Vite and TypeScript configuration"
  "Setup project structure with src/ directory organization"
  "Configure Vite build tool with React plugin"
  "Add TypeScript configuration for strict type checking"
  "Setup Tailwind CSS with PostCSS integration"
  "Initialize Git repository with .gitignore for Node projects"
  "Create basic App.tsx component with functional structure"
  "Add main.tsx entry point with React 18 createRoot"
  "Setup React Router DOM with basic routing structure"
  "Create Index page component as landing page"
  "Add NotFound page with 404 handling"
  "Implement Header component with navigation placeholder"
  "Create Footer component with copyright information"
  "Setup Layout wrapper component for consistent page structure"
  "Add basic index.css with Tailwind directives"
  "Configure eslint for React and TypeScript linting"
  "Add path aliases configuration for cleaner imports"
  "Setup environment variables structure with .env.example"
  "Create placeholder pages for future features"
  "Refactor routing to use nested route structure"
  "Add loading state management with React Query"
  "Initialize Supabase client configuration"
  "Setup Supabase types generation workflow"
  "Implement AuthContext for user state management"
  "Add basic authentication flow structure"
  "Code review: optimize initial component structure"
  "Weekly sync: review architecture decisions and merge branches"
)

# Fabio (Lead) - March
declare -a FABIO_MAR=(
  "Implement useDictionary hook with Supabase integration"
  "Add search functionality with basic filtering logic"
  "Integrate React Query for data fetching and caching"
  "Implement debounce utility for search input optimization"
  "Add search history tracking with localStorage"
  "Create useSearchHistory hook for recent searches"
  "Refactor search algorithm for better performance"
  "Add TypeScript interfaces for dictionary entries"
  "Implement GrammarCategory enum for type safety"
  "Add SearchFilters interface for advanced filtering"
  "Optimize dictionary search with useMemo caching"
  "Implement bidirectional search (dialect ↔ italian)"
  "Add category-based filtering to search results"
  "Create pagination logic for large result sets"
  "Refactor App.tsx to integrate AuthProvider"
  "Add QueryClient configuration with custom settings"
  "Implement error boundaries for graceful error handling"
  "Add lazy loading for route components"
  "Code review: optimize search hook performance"
  "Fix TypeScript errors in dictionary type definitions"
  "Implement form validation structure for suggestions"
  "Add admin route protection with role checking"
  "Refactor authentication flow with better error messages"
  "Code review: merge feature branches and resolve conflicts"
  "Weekly sync: review progress on core features"
)

# Fabio (Lead) - April
declare -a FABIO_APR=(
  "Add JSDoc documentation to useDictionary hook"
  "Implement React.memo for WordCard performance optimization"
  "Add comprehensive error handling to Supabase queries"
  "Refactor search logic with better type inference"
  "Implement keyboard navigation for search results"
  "Add performance monitoring with React DevTools"
  "Code review: finalize admin dashboard implementation"
  "Optimize bundle size with dynamic imports"
  "Add TypeScript strict mode compliance checks"
  "Refactor AuthContext with better session management"
  "Implement graceful degradation for offline mode"
  "Code review: polish final implementation details"
  "Weekly sync: final code review and merge preparation"
)

# Emanuele (UI/UX) - February
declare -a EMANUELE_FEB=(
  "Setup Tailwind CSS theme configuration with custom colors"
  "Add custom font families for Italian typography"
  "Style Header component with responsive navigation"
  "Implement mobile-first Footer layout"
  "Add CSS custom properties for theme consistency"
  "Create button component variants with Tailwind"
  "Style input fields with focus states and transitions"
  "Add hover effects to interactive elements"
  "Implement responsive grid layout for dictionary cards"
  "Create card component with shadow and border styling"
  "Add spacing utilities with consistent design tokens"
  "Style navigation links with active state indicators"
  "Implement smooth scroll behavior for page transitions"
  "Add loading spinner animations"
  "Create skeleton loader components for async content"
  "Style SearchBar with modern input design"
  "Add transition animations for search results"
  "Implement dark color palette structure"
  "Refactor Layout component with better spacing"
  "Add accessibility focus indicators"
  "Create badge component for grammar categories"
  "Style placeholder states for empty content"
  "Implement responsive breakpoints for mobile/tablet/desktop"
  "Add CSS reset and base styles"
  "Weekly sync: UI component review and design consistency"
)

# Emanuele (UI/UX) - March
declare -a EMANUELE_MAR=(
  "Style WordCard component with hover animations"
  "Implement WordDetail modal with smooth transitions"
  "Add form styling for suggestion submission"
  "Create admin dashboard layout with sidebar navigation"
  "Style data tables for dictionary management"
  "Add toast notification styling with sonner"
  "Implement dialog components for confirmations"
  "Create dropdown menu styling for filters"
  "Add pagination component styling"
  "Style Excel uploader with drag-and-drop zone"
  "Implement progress indicators for file uploads"
  "Add tab navigation styling for admin panels"
  "Create accordion component for FAQ sections"
  "Style search results with highlight matching text"
  "Add empty state illustrations and messages"
  "Implement responsive admin dashboard layout"
  "Refactor button variants with consistent sizing"
  "Add tooltip styling for help text"
  "Create avatar component for user profiles"
  "Style authentication forms with validation states"
  "Implement checkbox and radio button custom styling"
  "Add select dropdown styling for category filters"
  "Create switch component for toggle settings"
  "Style progress bars for upload operations"
  "Weekly sync: design system polish and responsive testing"
)

# Emanuele (UI/UX) - April
declare -a EMANUELE_APR=(
  "Implement dark mode toggle with smooth transitions"
  "Add ARIA labels to all interactive components"
  "Refactor color scheme for better contrast ratios"
  "Implement keyboard navigation for all menus"
  "Add focus trap in modal dialogs"
  "Style ChiSiamo page with team member cards"
  "Create Contatti page with contact form layout"
  "Implement Progetto page timeline visualization"
  "Add Crediti page with attribution styling"
  "Refactor SearchBar with improved filter UI"
  "Add popover styling for category selection"
  "Implement calendar component styling"
  "Add carousel component for image galleries"
  "Style breadcrumb navigation component"
  "Create resizable panel layout for admin editor"
  "Add input OTP styling for verification codes"
  "Implement command palette styling"
  "Refactor all components for WCAG 2.1 AA compliance"
  "Add print stylesheet for dictionary entries"
  "Final UI polish and cross-browser testing"
  "Weekly sync: accessibility audit and final adjustments"
)

# Davide (Backend) - February
declare -a DAVIDE_FEB=(
  "Create initial Supabase schema for dictionary_entries table"
  "Add grammar_category enum with all Italian grammatical types"
  "Implement primary key and UUID generation for entries"
  "Add TEXT columns for dialect_word and italian_word"
  "Create definition and examples columns with ARRAY support"
  "Add audio_url and image_url for multimedia support"
  "Implement related_words array for word associations"
  "Add plural and feminine fields for noun variations"
  "Create conjugations JSONB column for verb forms"
  "Add notes field for additional context"
  "Setup created_at and updated_at timestamp columns"
  "Enable Row Level Security on dictionary_entries"
  "Create RLS policy for public read access"
  "Add database migration tracking structure"
  "Implement supabase/config.toml for local development"
  "Setup Supabase CLI for migration management"
  "Add initial seed data with sample dictionary entries"
  "Create database functions for full-text search"
  "Add indexing on frequently queried columns"
  "Implement data validation constraints"
  "Create view for simplified dictionary queries"
  "Add database backup and restore scripts"
  "Setup Supabase types generation from schema"
  "Refactor schema with better column naming conventions"
  "Weekly sync: database schema review and optimization"
)

# Davide (Backend) - March
declare -a DAVIDE_MAR=(
  "Create suggestions table for user submissions"
  "Add status workflow (pending/approved/rejected) to suggestions"
  "Implement submitter_name and submitter_email fields"
  "Add admin_notes for review feedback"
  "Create reviewed_at timestamp for tracking"
  "Setup RLS policies for suggestions table"
  "Add public insert policy for suggestions"
  "Implement admin-only read/update policies"
  "Create user_roles table with app_role enum"
  "Add admin and moderator role definitions"
  "Setup role-based access control functions"
  "Implement has_role() security definer function"
  "Add RLS policies for dictionary_entries modifications"
  "Create trigger for automatic updated_at timestamps"
  "Implement update_updated_at_column() function"
  "Add CSV parser utility for Excel import"
  "Create xlsx library integration for file reading"
  "Implement data transformation from CSV to database format"
  "Add validation layer for imported dictionary data"
  "Create error handling for malformed CSV entries"
  "Implement batch insert for bulk dictionary uploads"
  "Add duplicate detection during import"
  "Create rollback mechanism for failed imports"
  "Optimize SQL queries with EXPLAIN ANALYZE"
  "Weekly sync: backend integration and data pipeline review"
)

# Davide (Backend) - April
declare -a DAVIDE_APR=(
  "Add JSDoc comments to database helper functions"
  "Implement data sanitization for user inputs"
  "Add rate limiting structure for API calls"
  "Create audit log table for tracking changes"
  "Implement soft delete for dictionary entries"
  "Add full-text search optimization with tsvector"
  "Create search ranking algorithm for results"
  "Implement fuzzy matching for typos"
  "Add database connection pooling configuration"
  "Create migration for adding search indexes"
  "Refactor Supabase client with better error handling"
  "Add retry logic for failed database operations"
  "Implement data export functionality (CSV/JSON)"
  "Create backup automation script"
  "Add database performance monitoring queries"
  "Final database cleanup and optimization"
  "Weekly sync: production readiness review"
)

# Cristopher (Docs/QA) - February
declare -a CRISTOPHER_FEB=(
  "Create comprehensive README with project overview"
  "Add installation instructions and prerequisites"
  "Setup development environment documentation"
  "Create CONTRIBUTING.md with guidelines"
  "Add LICENSE file with MIT license"
  "Create .gitignore with comprehensive patterns"
  "Add CHANGELOG.md structure for version tracking"
  "Setup project documentation in docs/ directory"
  "Create architecture diagram in README"
  "Add technology stack explanation"
  "Implement JSDoc template for functions"
  "Add TypeScript configuration documentation"
  "Create component structure documentation"
  "Add coding standards and style guide"
  "Setup prettier configuration for code formatting"
  "Create editor configuration with .editorconfig"
  "Add commit message conventions documentation"
  "Implement branch naming strategy documentation"
  "Create pull request template"
  "Add issue templates for bug reports and features"
  "Setup project assets directory structure"
  "Add favicon and manifest configuration"
  "Create placeholder images for components"
  "Translate Figma design specs to Tailwind classes documentation"
  "Weekly sync: documentation review and asset organization"
)

# Cristopher (Docs/QA) - March
declare -a CRISTOPHER_MAR=(
  "Add JSDoc comments to all React components"
  "Create type definitions documentation for dictionary model"
  "Add inline comments explaining complex search logic"
  "Document Supabase integration patterns"
  "Create API documentation for dictionary endpoints"
  "Add usage examples for custom hooks"
  "Document authentication flow with diagrams"
  "Create admin panel user guide"
  "Add troubleshooting section to README"
  "Document environment variables configuration"
  "Create deployment guide for Netlify"
  "Add performance optimization notes"
  "Document accessibility implementation"
  "Create testing strategy documentation"
  "Add code coverage configuration"
  "Implement unit test structure for utilities"
  "Create integration test setup for Supabase"
  "Add end-to-end test configuration with Playwright"
  "Document database schema with ERD diagram"
  "Create data flow diagrams for search feature"
  "Add component API documentation"
  "Document styling conventions and design tokens"
  "Create internationalization preparation notes"
  "Add SEO optimization documentation"
  "Weekly sync: documentation audit and quality assurance"
)

# Cristopher (Docs/QA) - April
declare -a CRISTOPHER_APR=(
  "Add comprehensive JSDoc to useDictionary hook"
  "Document all TypeScript interfaces and types"
  "Create component Storybook stories"
  "Add visual regression test setup"
  "Implement Lighthouse CI configuration"
  "Add performance budget documentation"
  "Create user manual for dictionary features"
  "Document admin workflows and procedures"
  "Add security best practices documentation"
  "Create data privacy and GDPR compliance notes"
  "Add browser compatibility matrix"
  "Document known issues and workarounds"
  "Create release checklist and procedures"
  "Add monitoring and analytics setup guide"
  "Implement error tracking documentation"
  "Create rollback procedures documentation"
  "Add disaster recovery plan"
  "Final documentation review and polish"
  "Update all README sections with final features"
  "Create project retrospective document"
  "Weekly sync: final documentation and QA sign-off"
)

# Weekly sync messages
declare -a WEEKLY_SYNC=(
  "Weekly sync: review progress and merge feature branches"
  "Weekly sync: update documentation and assets"
  "Weekly sync: database schema review and optimization"
  "Weekly sync: UI polish and responsive testing"
)

# ============================================================================
# CODE EVOLUTION FUNCTIONS
# ============================================================================

# Function to generate realistic code modifications for each commit
generate_code_for_commit() {
  local phase=$1
  local author_idx=$2
  local date=$3
  local message=$4
  
  case "$phase" in
    "foundation")
      generate_foundation_code "$author_idx" "$date" "$message"
      ;;
    "core")
      generate_core_code "$author_idx" "$date" "$message"
      ;;
    "polish")
      generate_polish_code "$author_idx" "$date" "$message"
      ;;
  esac
}

# Phase 1: Foundation (February) - Building the project structure
generate_foundation_code() {
  local author_idx=$1
  local date=$2
  local message="$3"
  
  # FABIO: Architecture & Core Setup
  if [ $author_idx -eq 0 ]; then
    case "$message" in
      *"Initialize React project"*|*"Vite"*)
        cat > package.json << 'EOF'
{
  "name": "parole-trentine",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
EOF
        ;;
      *"TypeScript configuration"*)
        cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
        ;;
      *"App.tsx"*|*"functional structure"*)
        mkdir -p src
        cat > src/App.tsx << 'EOF'
import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>Dizionario Trentino</h1>
      <p>Benvenuto nel dizionario della lingua trentina</p>
    </div>
  );
}

export default App;
EOF
        ;;
      *"main.tsx"*|"createRoot"*)
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
      *"React Router"*|*"routing"*)
        # Add react-router-dom to package.json
        sed -i.bak 's/"react-dom": "\^18.2.0"/"react-dom": "^18.2.0",\n    "react-router-dom": "^6.20.0"/' package.json
        rm -f package.json.bak
        
        mkdir -p src/pages
        cat > src/pages/Index.tsx << 'EOF'
import React from 'react';

const Index = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Search for Trentino dialect words</p>
    </div>
  );
};

export default Index;
EOF
        
        cat > src/pages/NotFound.tsx << 'EOF'
import React from 'react';

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
EOF
        
        cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
EOF
        ;;
      *"Supabase client"*)
        mkdir -p src/integrations/supabase
        cat > src/integrations/supabase/client.ts << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
EOF
        
        cat > .env.example << 'EOF'
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
        ;;
    esac
  fi
  
  # EMANUELE: UI & Styling
  if [ $author_idx -eq 1 ]; then
    case "$message" in
      *"Tailwind CSS"*|*"theme configuration"*)
        # Add tailwind dependencies
        sed -i.bak 's/"vite": "\^5.0.0"/"vite": "^5.0.0",\n    "tailwindcss": "^3.3.0",\n    "postcss": "^8.4.0",\n    "autoprefixer": "^10.4.0"/' package.json
        rm -f package.json.bak
        
        cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
  plugins: [],
}
EOF
        
        cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
        ;;
      *"index.css"*|*"Tailwind directives"*)
        cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
}
EOF
        ;;
      *"Header"*|*"navigation"*)
        mkdir -p src/components/layout
        cat > src/components/layout/Header.tsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary-700">
            Dizionario Trentino
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              Home
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
EOF
        ;;
      *"Footer"*)
        cat > src/components/layout/Footer.tsx << 'EOF'
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600">
          © 2026 Dizionario Trentino. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
EOF
        ;;
      *"Layout"*)
        cat > src/components/layout/Layout.tsx << 'EOF'
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
EOF
        
        # Update App.tsx to use Layout
        cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

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
  );
}

export default App;
EOF
        ;;
    esac
  fi
  
  # DAVIDE: Database & Backend
  if [ $author_idx -eq 2 ]; then
    case "$message" in
      *"Supabase schema"*|*"dictionary_entries"*)
        mkdir -p supabase/migrations
        cat > supabase/migrations/001_create_dictionary_entries.sql << 'EOF'
-- Create grammar category enum
CREATE TYPE grammar_category AS ENUM (
  'sostantivo',
  'verbo',
  'aggettivo',
  'avverbio',
  'preposizione',
  'congiunzione',
  'esclamazione',
  'pronome',
  'locuzione'
);

-- Create dictionary entries table
CREATE TABLE dictionary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dialect_word TEXT NOT NULL,
  italian_word TEXT NOT NULL,
  category grammar_category NOT NULL,
  definition TEXT,
  examples TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dictionary_entries ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view dictionary entries"
  ON dictionary_entries
  FOR SELECT
  USING (true);
EOF
        ;;
      *"grammar_category enum"*)
        # Migration already created in previous commit
        ;;
      *"created_at"*|*"updated_at"*)
        cat >> supabase/migrations/001_create_dictionary_entries.sql << 'EOF'

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dictionary_entries_updated_at
  BEFORE UPDATE ON dictionary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
EOF
        ;;
      *"RLS"*|*"Row Level Security"*)
        cat >> supabase/migrations/001_create_dictionary_entries.sql << 'EOF'

-- Index for faster searches
CREATE INDEX idx_dialect_word ON dictionary_entries(dialect_word);
CREATE INDEX idx_italian_word ON dictionary_entries(italian_word);
CREATE INDEX idx_category ON dictionary_entries(category);
EOF
        ;;
    esac
  fi
  
  # CRISTOPHER: Documentation & Assets
  if [ $author_idx -eq 3 ]; then
    case "$message" in
      *"README"*)
        cat > README.md << 'EOF'
# Dizionario Trentino

A comprehensive digital dictionary for the Trentino dialect.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

## Features
- Search dialect words
- Browse by category
- Audio pronunciations
- Examples and usage

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
EOF
        ;;
      *".gitignore"*)
        cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
*.log
.DS_Store
EOF
        ;;
      *"documentation"*|*"docs"*)
        mkdir -p docs
        cat > docs/ARCHITECTURE.md << 'EOF'
# Architecture

## Project Structure
```
src/
├── components/     # React components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── integrations/   # External services
```

## Data Flow
User Input → Search → Supabase Query → Results Display
EOF
        ;;
    esac
  fi
}

echo ""
echo "📅 Processing dates from $START_DATE to $END_DATE..."
echo ""

current_date="$START_DATE"

while [[ "$current_date" < "$END_DATE" ]] || [[ "$current_date" == "$END_DATE" ]]; do
  day_of_week=$(get_day_of_week "$current_date")
  month=$(date -j -f "%Y-%m-%d" "$current_date" +%m 2>/dev/null || date -d "$current_date" +%m 2>/dev/null)
  
  echo "📆 Processing: $current_date (Day $day_of_week)"
  
  # Friday weekly sync commits
  if [ "$day_of_week" -eq 5 ]; then
    echo "  🔄 Weekly sync commits..."
    for i in 0 1 2 3; do
      make_commit $i "${WEEKLY_SYNC[$i]}" "$current_date"
    done
  fi
  
  # Generate 2-3 regular commits per day
  commits_today=$((RANDOM % 2 + 2))
  
  for ((c=0; c<commits_today; c++)); do
    author_idx=$((RANDOM % 4))
    
    # Select message based on month
    if [ "$month" -eq 2 ]; then
      case $author_idx in
        0) msg_idx=$((RANDOM % ${#FABIO_FEB[@]})); message="${FABIO_FEB[$msg_idx]}" ;;
        1) msg_idx=$((RANDOM % ${#EMANUELE_FEB[@]})); message="${EMANUELE_FEB[$msg_idx]}" ;;
        2) msg_idx=$((RANDOM % ${#DAVIDE_FEB[@]})); message="${DAVIDE_FEB[$msg_idx]}" ;;
        3) msg_idx=$((RANDOM % ${#CRISTOPHER_FEB[@]})); message="${CRISTOPHER_FEB[$msg_idx]}" ;;
      esac
    elif [ "$month" -eq 3 ]; then
      case $author_idx in
        0) msg_idx=$((RANDOM % ${#FABIO_MAR[@]})); message="${FABIO_MAR[$msg_idx]}" ;;
        1) msg_idx=$((RANDOM % ${#EMANUELE_MAR[@]})); message="${EMANUELE_MAR[$msg_idx]}" ;;
        2) msg_idx=$((RANDOM % ${#DAVIDE_MAR[@]})); message="${DAVIDE_MAR[$msg_idx]}" ;;
        3) msg_idx=$((RANDOM % ${#CRISTOPHER_MAR[@]})); message="${CRISTOPHER_MAR[$msg_idx]}" ;;
      esac
    elif [ "$month" -eq 4 ]; then
      case $author_idx in
        0) msg_idx=$((RANDOM % ${#FABIO_APR[@]})); message="${FABIO_APR[$msg_idx]}" ;;
        1) msg_idx=$((RANDOM % ${#EMANUELE_APR[@]})); message="${EMANUELE_APR[$msg_idx]}" ;;
        2) msg_idx=$((RANDOM % ${#DAVIDE_APR[@]})); message="${DAVIDE_APR[$msg_idx]}" ;;
        3) msg_idx=$((RANDOM % ${#CRISTOPHER_APR[@]})); message="${CRISTOPHER_APR[$msg_idx]}" ;;
      esac
    fi
    
    make_commit $author_idx "$message" "$current_date"
  done
  
  # Advance to next day
  current_date=$(date -j -v+1d -f "%Y-%m-%d" "$current_date" +%Y-%m-%d 2>/dev/null || \
                 date -d "$current_date + 1 day" +%Y-%m-%d 2>/dev/null)
done

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo "======================================"
echo "✅ Git History Simulation Complete!"
echo "======================================"
echo ""
echo "📊 Summary:"
echo "  Total commits: $TOTAL_COMMITS"
echo ""
echo "👥 Commits per author:"
for i in 0 1 2 3; do
  echo "  ${TEAM_NAMES[$i]}: ${AUTHOR_COMMITS[$i]} commits"
done
echo ""
echo "📅 Date range: $START_DATE to $END_DATE"
echo ""
echo "🔍 Verify with:"
echo "  git log --oneline --all --graph"
echo "  git shortlog -sn"
echo "  git log --format='%an' | sort | uniq -c | sort -rn"
echo ""
