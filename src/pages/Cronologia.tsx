import { Layout } from '@/components/layout/Layout';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { Button } from '@/components/ui/button';
import { Clock, X, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

export default function Cronologia() {
  const { history, removeFromHistory, clearHistory } = useSearchHistory();

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Cronologia Ricerche
            </h1>
            <p className="text-lg text-muted-foreground">
              Le tue ultime ricerche salvate localmente
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-12">
        <div className="max-w-2xl mx-auto">
          {history.length === 0 ? (
            <div className="card-elevated p-12 rounded-2xl border border-border text-center animate-fade-in">
              <Clock className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">
                Nessuna ricerca recente
              </h2>
              <p className="text-muted-foreground mb-6">
                Le tue ricerche appariranno qui per un accesso rapido
              </p>
              <Button asChild>
                <Link to="/">
                  <Search className="h-4 w-4 mr-2" />
                  Inizia a cercare
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {history.length} ricerch{history.length === 1 ? 'a' : 'e'} salvat{history.length === 1 ? 'a' : 'e'}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearHistory}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancella tutto
                </Button>
              </div>

              <div className="space-y-3">
                {history.map((item, index) => (
                  <div 
                    key={`${item.query}-${item.timestamp.getTime()}`}
                    className="card-elevated p-4 rounded-xl border border-border flex items-center justify-between gap-4 animate-fade-in group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link 
                      to={`/?q=${encodeURIComponent(item.query)}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {item.query}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.resultCount} risultat{item.resultCount === 1 ? 'o' : 'i'}</span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(item.timestamp, { 
                                addSuffix: true, 
                                locale: it 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromHistory(item.query)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-muted-foreground mt-8">
                La cronologia è salvata localmente sul tuo dispositivo
              </p>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
