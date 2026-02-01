import { DictionaryEntry } from '@/types/dictionary';
import { WordCard } from '@/components/dictionary/WordCard';

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
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          Nessun risultato trovato per "<span className="font-medium text-foreground">{query}</span>"
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Prova a cercare con termini diversi o{' '}
          <a href="/contatti" className="text-primary hover:underline">
            suggerisci una nuova parola
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {results.length} risultat{results.length === 1 ? 'o' : 'i'} per "{query}"
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(entry => (
          <WordCard
            key={entry.id}
            entry={entry}
            onClick={() => onSelectWord(entry)}
          />
        ))}
      </div>
    </div>
  );
}
