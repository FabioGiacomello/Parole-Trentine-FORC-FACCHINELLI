import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GrammarCategory } from '@/types/dictionary';
import { 
  Check, 
  X, 
  Loader2,
  MessageSquare,
  Clock,
  User,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  Inbox,
  CheckCircle2,
  XCircle,
  Volume2
} from 'lucide-react';

interface Suggestion {
  id: string;
  dialect_word: string;
  italian_word: string;
  category: string | null;
  definition: string | null;
  examples: string[] | null;
  submitter_name: string | null;
  submitter_email: string | null;
  status: string;
  admin_notes: string | null;
  pronunciation: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export function SuggestionsManager() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [showReviewed, setShowReviewed] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Errore nel caricamento dei suggerimenti:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile caricare i suggerimenti.'
      });
    } else {
      setSuggestions(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleApprove = async (suggestion: Suggestion) => {
    setProcessingId(suggestion.id);
    
    const { error: insertError } = await supabase
      .from('dictionary_entries')
      .insert([{
        dialect_word: suggestion.dialect_word,
        italian_word: suggestion.italian_word,
        category: (suggestion.category as GrammarCategory) || 'sostantivo',
        definition: suggestion.definition,
        examples: suggestion.examples,
        pronunciation: suggestion.pronunciation,
      }]);
    
    if (insertError) {
      console.error('Errore aggiunta voce al dizionario:', insertError);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile aggiungere al dizionario.'
      });
      setProcessingId(null);
      return;
    }
    
    const { error: updateError } = await supabase
      .from('suggestions')
      .update({ 
        status: 'approved',
        admin_notes: adminNotes[suggestion.id] || null,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', suggestion.id);
    
    if (updateError) {
      console.error('Errore aggiornamento stato suggerimento:', updateError);
    }
    
    toast({
      title: 'Suggerimento approvato',
      description: `"${suggestion.dialect_word}" è stato aggiunto al dizionario.`
    });
    
    setProcessingId(null);
    fetchSuggestions();
  };

  const handleReject = async (suggestion: Suggestion) => {
    setProcessingId(suggestion.id);
    
    const { error } = await supabase
      .from('suggestions')
      .update({ 
        status: 'rejected',
        admin_notes: adminNotes[suggestion.id] || null,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', suggestion.id);
    
    if (error) {
      console.error('Errore nel rifiuto del suggerimento:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile rifiutare il suggerimento.'
      });
    } else {
      toast({
        title: 'Suggerimento rifiutato',
        description: `"${suggestion.dialect_word}" è stato rifiutato.`
      });
      fetchSuggestions();
    }
    
    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('suggestions')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile eliminare il suggerimento.'
      });
    } else {
      toast({
        title: 'Eliminato',
        description: 'Suggerimento eliminato con successo.'
      });
      fetchSuggestions();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="gap-1 bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Approvato
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
            <XCircle className="h-3 w-3" />
            Rifiutato
          </Badge>
        );
      default:
        return (
          <Badge className="gap-1 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-500/20">
            <Clock className="h-3 w-3" />
            In attesa
          </Badge>
        );
    }
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const reviewedSuggestions = suggestions.filter(s => s.status !== 'pending');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Caricamento suggerimenti...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending suggestions */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Inbox className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">
              In attesa di revisione
            </h2>
            <p className="text-sm text-muted-foreground">
              {pendingSuggestions.length} suggeriment{pendingSuggestions.length === 1 ? 'o' : 'i'} da valutare
            </p>
          </div>
        </div>
        
        {pendingSuggestions.length === 0 ? (
          <div className="card-elevated p-12 rounded-2xl border border-border text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 text-muted-foreground mb-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-medium mb-2">
              Nessun suggerimento in attesa
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Tutti i suggerimenti sono stati revisionati. Controlla più tardi per nuove proposte.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id}
                className="card-elevated p-6 rounded-2xl border border-border hover:border-primary/20 transition-colors"
              >
                <div className="flex flex-col xl:flex-row xl:items-start gap-6">
                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Word header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <span className="font-display text-xl font-bold text-primary">
                            {suggestion.dialect_word}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-lg font-medium text-foreground">
                            {suggestion.italian_word}
                          </span>
                        </div>
                        {suggestion.category && (
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        )}
                      </div>
                      {getStatusBadge(suggestion.status)}
                    </div>
                    
                    {/* Definition */}
                    {suggestion.definition && (
                      <div className="bg-muted/30 rounded-xl p-4">
                        <p className="text-sm text-foreground leading-relaxed">
                          {suggestion.definition}
                        </p>
                      </div>
                    )}
                    
                    {/* Pronunciation */}
                    {suggestion.pronunciation && (
                      <div className="flex items-center gap-2 text-sm">
                        <Volume2 className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Pronuncia:</span>
                        <span className="font-medium text-foreground">{suggestion.pronunciation}</span>
                      </div>
                    )}

                    {/* Examples */}
                    {suggestion.examples && suggestion.examples.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Esempi
                        </p>
                        <ul className="space-y-1">
                          {suggestion.examples.map((example, i) => (
                            <li key={i} className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="italic">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Submitter info */}
                    <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground border-t border-border">
                      {suggestion.submitter_name && (
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {suggestion.submitter_name}
                        </span>
                      )}
                      {suggestion.submitter_email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {suggestion.submitter_email}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(suggestion.created_at).toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="xl:w-72 space-y-3">
                    <Textarea
                      placeholder="Note admin (opzionale)..."
                      value={adminNotes[suggestion.id] || ''}
                      onChange={(e) => setAdminNotes(prev => ({
                        ...prev,
                        [suggestion.id]: e.target.value
                      }))}
                      rows={3}
                      className="text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(suggestion)}
                        disabled={processingId === suggestion.id}
                        className="flex-1 gap-2"
                      >
                        {processingId === suggestion.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Approva
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(suggestion)}
                        disabled={processingId === suggestion.id}
                        className="flex-1 gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                      >
                        <X className="h-4 w-4" />
                        Rifiuta
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed suggestions */}
      {reviewedSuggestions.length > 0 && (
        <div>
          <button
            onClick={() => setShowReviewed(!showReviewed)}
            className="flex items-center gap-3 mb-4 w-full text-left group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-muted transition-colors">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                Già revisionati
              </h2>
              <p className="text-sm text-muted-foreground">
                {reviewedSuggestions.length} suggeriment{reviewedSuggestions.length === 1 ? 'o' : 'i'}
              </p>
            </div>
            {showReviewed ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          
          {showReviewed && (
            <div className="card-elevated rounded-2xl border border-border divide-y divide-border overflow-hidden animate-fade-in">
              {reviewedSuggestions.map((suggestion) => (
                <div 
                  key={suggestion.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
                    <span className="font-semibold text-foreground truncate">
                      {suggestion.dialect_word}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground truncate">{suggestion.italian_word}</span>
                    {getStatusBadge(suggestion.status)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(suggestion.created_at).toLocaleDateString('it-IT')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(suggestion.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}