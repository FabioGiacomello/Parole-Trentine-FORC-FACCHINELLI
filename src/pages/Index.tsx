import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { WordDetail } from '@/components/dictionary/WordDetail';
import { useDictionary } from '@/hooks/useDictionary';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useWordViews } from '@/hooks/useWordViews';
import { DictionaryEntry, SearchFilters } from '@/types/dictionary';
import { Book, Sigma, Sparkles, Users, Volume2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Index() {
  const { entries, search, getSimilarWords, categories, totalCount, loading } = useDictionary();
  const { addToHistory } = useSearchHistory();
  const { incrementWordView, getMostViewedWords } = useWordViews();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + 1;
      return acc;
    }, {});

    return [
      { label: 'Nomi', value: counts.sostantivo ?? 0 },
      { label: 'Verbi', value: counts.verbo ?? 0 },
      { label: 'Aggettivi', value: counts.aggettivo ?? 0 },
      { label: 'Avverbi', value: counts.avverbio ?? 0 },
      { label: 'Locuzioni', value: counts.locuzione ?? 0 },
    ];
  }, [entries, totalCount]);

  const wordOfTheDay = useMemo(() => {
    if (!entries.length) return null;
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return entries[dayOfYear % entries.length];
  }, [entries]);

  const mostViewed = getMostViewedWords(5);

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (!urlQuery || !entries.length) return;

    const searchResults = search(urlQuery, { searchDirection: 'both' });
    setResults(searchResults);
    setCurrentQuery(urlQuery);
    setHasSearched(true);
  }, [searchParams, entries, search]);

  const handleSearch = (query: string, filters: SearchFilters, isLetterFilter = false) => {
    if (!query.trim()) {
      setResults([]);
      setCurrentQuery('');
      setHasSearched(false);
      return;
    }
    const searchResults = search(query, filters, isLetterFilter);
    setResults(searchResults);
    setCurrentQuery(query);
    setHasSearched(true);
    if (query.trim()) {
      addToHistory(query, searchResults.length);
    }
  };

  const handleSelectWord = (entry: DictionaryEntry) => {
    addToHistory(entry.dialectWord, 1);
    incrementWordView(entry.dialectWord, entry.italianWord);
    setSelectedWord(entry);
  };

  const handleCloseDetail = () => {
    setSelectedWord(null);
  };

  const features = [
    {
      icon: Book,
      title: 'Dizionario completo',
      description: 'Migliaia di vocaboli con definizioni dettagliate e esempi d\'uso.'
    },
    {
      icon: Volume2,
      title: 'Pronuncia audio',
      description: 'Ascolta la pronuncia corretta di ogni parola dialettale.'
    },
    {
      icon: Users,
      title: 'Contributi della comunità',
      description: 'Aiutaci ad arricchire il dizionario con le tue segnalazioni.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-gradient">Dizionario</span>
              <br />
              <span className="text-foreground">e-Trentin</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Dizionario del dialetto di Trento online.
              Ricerca bidirezionale rapida tra dialetto e italiano.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {loading ? 'Caricamento vocabolario...' : `${totalCount} vocaboli nel dizionario`}
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <SearchBar 
              onSearch={handleSearch} 
              categories={categories}
              isLarge={!hasSearched}
            />
          </div>
        </div>
      </section>

      {/* Results or Features */}
      <section className="container py-12">
        {hasSearched ? (
          <SearchResults 
            results={results} 
            query={currentQuery}
            onSelectWord={handleSelectWord}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated p-6 rounded-xl border border-border animate-fade-in"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Information Area */}
      <section className="container py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-elevated rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Parola del giorno</h2>
            </div>
            {wordOfTheDay ? (
              <div className="space-y-2">
                <p className="text-2xl font-semibold">{wordOfTheDay.dialectWord}</p>
                <p className="text-muted-foreground">{wordOfTheDay.italianWord}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{wordOfTheDay.category}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nessuna parola disponibile al momento.</p>
            )}
          </div>

          <div className="card-elevated rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sigma className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">I numeri del dizionario</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categoryCounts.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "rounded-lg border border-border p-3",
                    index === categoryCounts.length - 1 && categoryCounts.length % 2 !== 0
                      ? "col-span-2"
                      : ""
                  )}
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Most Viewed Words */}
      <section className="container pb-16">
        <div className="card-elevated rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Parole più cercate</h2>
          </div>
          {mostViewed.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {mostViewed.map((item) => (
                <li key={item.dialectWord} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="font-medium">{item.dialectWord}</span>
                  <span className="text-muted-foreground">{item.viewCount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Non ci sono ancora parole visualizzate.
            </p>
          )}
        </div>
      </section>

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetail
          entry={selectedWord}
          similarWords={getSimilarWords(selectedWord)}
          onClose={handleCloseDetail}
          onSelectSimilar={handleSelectWord}
        />
      )}
    </Layout>
  );
}
