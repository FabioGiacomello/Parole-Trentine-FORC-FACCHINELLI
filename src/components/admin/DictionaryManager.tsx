import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Trash2, 
  Edit2, 
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { WordEditor } from './WordEditor';

interface DictionaryEntry {
  id: string;
  dialect_word: string;
  italian_word: string;
  category: string;
  definition: string | null;
  examples: string[] | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 20;

export function DictionaryManager() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const fetchEntries = async () => {
    setLoading(true);
    
    let query = supabase
      .from('dictionary_entries')
      .select('*', { count: 'exact' });
    
    if (searchQuery) {
      query = query.or(`dialect_word.ilike.%${searchQuery}%,italian_word.ilike.%${searchQuery}%`);
    }
    
    const { data, error, count } = await query
      .order('dialect_word')
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);
    
    if (error) {
      console.error('Error fetching entries:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile caricare i vocaboli.'
      });
    } else {
      setEntries(data || []);
      setTotalCount(count || 0);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [page, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo vocabolo?')) return;
    
    const { error } = await supabase
      .from('dictionary_entries')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile eliminare il vocabolo.'
      });
    } else {
      toast({
        title: 'Vocabolo eliminato',
        description: 'Il vocabolo è stato rimosso dal dizionario.'
      });
      fetchEntries();
    }
  };

  const handleSave = () => {
    setEditingEntry(null);
    setIsCreating(false);
    fetchEntries();
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (editingEntry || isCreating) {
    return (
      <WordEditor
        entry={editingEntry}
        onSave={handleSave}
        onCancel={() => {
          setEditingEntry(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca vocaboli..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuovo vocabolo
        </Button>
      </div>

      <div className="card-elevated rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/50">
          <p className="text-sm text-muted-foreground">
            {totalCount} vocaboli totali
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nessun vocabolo trovato.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">
                      {entry.dialect_word}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground">
                      {entry.italian_word}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {entry.category}
                    </Badge>
                  </div>
                  {entry.definition && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {entry.definition}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingEntry(entry)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Precedente
            </Button>
            <span className="text-sm text-muted-foreground">
              Pagina {page + 1} di {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Successiva
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
