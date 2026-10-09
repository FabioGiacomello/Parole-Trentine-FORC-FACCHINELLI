import { useState } from 'react';
import { Search, ArrowLeftRight, Filter, History, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SearchFilters, GrammarCategory } from '@/types/dictionary';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters, isLetterFilter?: boolean) => void;
  categories: GrammarCategory[];
  isLarge?: boolean;
}

const categoryLabels: Record<GrammarCategory, string> = {
  sostantivo: 'Sostantivo',
  verbo: 'Verbo',
  aggettivo: 'Aggettivo',
  avverbio: 'Avverbio',
  pronome: 'Pronome',
  preposizione: 'Preposizione',
  congiunzione: 'Congiunzione',
  esclamazione: 'Esclamazione',
  locuzione: 'Locuzione',
  articolo: 'Articolo',
  numerale: 'Numerale',
  interiezione: 'Interiezione',
  altro: 'Altro',
};

const directionLabels = {
  'both': 'Entrambe le direzioni',
  'dialect-to-italian': 'Dialetto → Italiano',
  'italian-to-dialect': 'Italiano → Dialetto',
};

export function SearchBar({ onSearch, categories, isLarge = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    searchDirection: 'both',
  });
  const [selectedLetter, setSelectedLetter] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(query, filters);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn(
        "flex flex-col gap-4",
        isLarge ? "max-w-3xl mx-auto" : ""
      )}>
        {/* Main Search Input */}
        <div className={cn(
          "relative flex items-center gap-2",
          isLarge ? "search-glow rounded-2xl" : ""
        )}>
          <div className="relative flex-1 min-w-0">
            <Search className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
              isLarge ? "h-5 w-5 md:h-6 md:w-6" : "h-5 w-5"
            )} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cerca una parola in dialetto o italiano..."
              className={cn(
                "pl-12 pr-10 border-2 border-border focus:border-primary",
                isLarge
                  ? "h-12 md:h-16 text-base md:text-lg rounded-2xl"
                  : "h-12 rounded-xl"
              )}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedLetter('');
                  onSearch('', filters);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cancella ricerca"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              type="submit"
              size="lg"
              className={cn(
                isLarge
                  ? "rounded-2xl h-12 md:h-16 px-5 md:px-8"
                  : "rounded-xl"
              )}
            >
              Cerca
            </Button>
            <Link to="/cronologia">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Cronologia"
                title="Cronologia"
                className={cn(
                  isLarge
                    ? "rounded-2xl h-12 w-12 md:h-16 md:w-16"
                    : "rounded-xl h-12 w-12"
                )}
              >
                <History className={isLarge ? "h-5 w-5 md:h-6 md:w-6" : "h-5 w-5"} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 overflow-x-auto">
          {/* Direction Toggle */}
          <Select
            value={filters.searchDirection}
            onValueChange={(value: SearchFilters['searchDirection']) =>
              setFilters(prev => ({ ...prev, searchDirection: value }))
            }
          >
            <SelectTrigger className="w-auto min-w-[160px] md:min-w-[200px] h-10 rounded-lg text-xs md:text-sm flex-shrink-0">
              <ArrowLeftRight className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(directionLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 rounded-lg text-xs md:text-sm flex-shrink-0">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{filters.category ? categoryLabels[filters.category] : 'Categorie'}</span>
                <span className="sm:hidden">Cat</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="grid gap-1">
                <Button
                  variant={!filters.category ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}
                >
                  Tutte le categorie
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={filters.category === cat ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                  >
                    {categoryLabels[cat]}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Letter Search Dropdown */}
          <Select
            value={selectedLetter}
            onValueChange={(letter) => {
              setSelectedLetter(letter);
              setQuery(letter);
              onSearch(letter, filters, true);
            }}
          >
            <SelectTrigger className="w-auto min-w-[140px] md:min-w-[160px] h-10 rounded-lg text-xs md:text-sm flex-shrink-0">
              <SelectValue placeholder="Ricerca per lettera" />
            </SelectTrigger>
            <SelectContent>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                <SelectItem key={letter} value={letter.toLowerCase()}>
                  {letter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLetter && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Rimuovi ricerca per lettera"
              title="Rimuovi ricerca per lettera"
              onClick={() => {
                setSelectedLetter('');
                onSearch('', filters);
              }}
              className="h-10 w-10 text-muted-foreground flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
