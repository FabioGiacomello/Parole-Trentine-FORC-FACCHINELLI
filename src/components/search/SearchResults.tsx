import { DictionaryEntry } from '@/types/dictionary';
import { WordCard } from '@/components/dictionary/WordCard';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  results: DictionaryEntry[];
  query: string;
  onSelectWord: (entry: DictionaryEntry) => void;
}

export function SearchResults({ results, query, onSelectWord }: SearchResultsProps) {
  if (!query) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground mb-1">
          Nessun risultato per "<span className="text-primary">{query}</span>"
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Prova con un altro termine oppure
        </p>
        <Link to="/suggerisci" className="text-primary hover:underline text-sm font-medium">
          suggerisci questa parola al dizionario
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {results.length} risultat{results.length === 1 ? 'o' : 'i'} per "{query}"
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((entry, index) => (
          <div
            key={entry.id}
            className="animate-slide-in-up"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            <WordCard
              entry={entry}
              onClick={() => onSelectWord(entry)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
