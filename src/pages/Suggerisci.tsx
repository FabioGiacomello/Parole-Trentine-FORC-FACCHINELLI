import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Lightbulb, 
  Send, 
  Loader2,
  BookOpen,
  CheckCircle2,
  Upload,
  Volume2,
  X
} from 'lucide-react';

const categories = [
  { value: 'sostantivo', label: 'Sostantivo' },
  { value: 'verbo', label: 'Verbo' },
  { value: 'aggettivo', label: 'Aggettivo' },
  { value: 'avverbio', label: 'Avverbio' },
  { value: 'preposizione', label: 'Preposizione' },
  { value: 'congiunzione', label: 'Congiunzione' },
  { value: 'esclamazione', label: 'Esclamazione' },
  { value: 'pronome', label: 'Pronome' },
  { value: 'locuzione', label: 'Locuzione' },
];

export default function Suggerisci() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    dialect_word: '',
    italian_word: '',
    category: '',
    definition: '',
    examples: '',
    pronunciation: '',
    submitter_name: '',
    submitter_email: ''
  });
  const { toast } = useToast();

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File troppo grande',
          description: 'Il file audio deve essere inferiore a 5MB.'
        });
        return;
      }
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dialect_word.trim() || !formData.italian_word.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campi obbligatori',
        description: 'Inserisci sia la parola in dialetto che la traduzione italiana.'
      });
      return;
    }
    
    setLoading(true);
    
    let audioUrl: string | null = null;
    
    // Upload audio if provided
    if (audioFile) {
      const fileName = `suggestions/${Date.now()}_${audioFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, audioFile);
      
      if (uploadError) {
        console.error('Error uploading audio:', uploadError);
        toast({
          variant: 'destructive',
          title: 'Errore upload audio',
          description: 'Impossibile caricare il file audio. Il suggerimento verrà inviato senza audio.'
        });
      } else {
        const { data: urlData } = supabase.storage
          .from('audio')
          .getPublicUrl(fileName);
        audioUrl = urlData.publicUrl;
      }
    }
    
    const examplesArray = formData.examples
      .split('\n')
      .map(e => e.trim())
      .filter(e => e.length > 0);
    
    type GrammarCategory = 'sostantivo' | 'verbo' | 'aggettivo' | 'avverbio' | 'preposizione' | 'congiunzione' | 'esclamazione' | 'pronome' | 'locuzione';
    
    const { error } = await supabase
      .from('suggestions')
      .insert([{
        dialect_word: formData.dialect_word.trim(),
        italian_word: formData.italian_word.trim(),
        category: formData.category as GrammarCategory || null,
        definition: formData.definition.trim() || null,
        examples: examplesArray.length > 0 ? examplesArray : null,
        pronunciation: formData.pronunciation.trim() || null,
        submitter_name: formData.submitter_name.trim() || null,
        submitter_email: formData.submitter_email.trim() || null,
        status: 'pending'
      }]);
    
    if (error) {
      console.error('Error submitting suggestion:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile inviare il suggerimento. Riprova.'
      });
    } else {
      setSubmitted(true);
      toast({
        title: 'Suggerimento inviato!',
        description: 'Grazie per il tuo contributo. Lo esamineremo presto.'
      });
    }
    
    setLoading(false);
  };

  const handleReset = () => {
    setSubmitted(false);
    setAudioFile(null);
    setFormData({
      dialect_word: '',
      italian_word: '',
      category: '',
      definition: '',
      examples: '',
      pronunciation: '',
      submitter_name: '',
      submitter_email: ''
    });
  };

  return (
    <Layout>
      <section className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Suggerisci una Parola
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Conosci una parola del dialetto trentino che non è nel dizionario? 
              Aiutaci ad arricchirlo con il tuo contributo!
            </p>
          </div>

          {submitted ? (
            /* Success State */
            <div className="card-elevated p-8 rounded-2xl border border-border text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-600 mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3">
                Grazie per il tuo contributo!
              </h2>
              <p className="text-muted-foreground mb-6">
                Il tuo suggerimento è stato inviato con successo. 
                Il nostro team lo esaminerà e, se approvato, verrà aggiunto al dizionario.
              </p>
              <Button onClick={handleReset} className="gap-2">
                <BookOpen className="h-4 w-4" />
                Suggerisci un'altra parola
              </Button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="card-elevated p-6 md:p-8 rounded-2xl border border-border animate-slide-up">
              <div className="space-y-6">
                {/* Required Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dialect_word" className="text-sm font-medium">
                      Parola in dialetto <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dialect_word"
                      placeholder="es. ciòcola"
                      value={formData.dialect_word}
                      onChange={(e) => setFormData(prev => ({ ...prev, dialect_word: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="italian_word" className="text-sm font-medium">
                      Traduzione italiana <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="italian_word"
                      placeholder="es. cioccolato"
                      value={formData.italian_word}
                      onChange={(e) => setFormData(prev => ({ ...prev, italian_word: e.target.value }))}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Pronunciation */}
                <div className="space-y-2">
                  <Label htmlFor="pronunciation" className="text-sm font-medium">
                    Pronuncia (trascrizione fonetica)
                  </Label>
                  <Input
                    id="pronunciation"
                    placeholder="es. ciò-co-la (come si pronuncia la parola)"
                    value={formData.pronunciation}
                    onChange={(e) => setFormData(prev => ({ ...prev, pronunciation: e.target.value }))}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Scrivi come si pronuncia la parola, ad esempio dividendo le sillabe o usando accenti
                  </p>
                </div>

                {/* Audio Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Audio pronuncia (MP3)
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label
                        htmlFor="audio-upload"
                        className="flex items-center justify-center gap-2 h-12 px-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        {audioFile ? (
                          <>
                            <Volume2 className="h-4 w-4 text-primary" />
                            <span className="text-sm truncate">{audioFile.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Carica file audio (max 5MB)</span>
                          </>
                        )}
                      </label>
                      <input
                        id="audio-upload"
                        type="file"
                        accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a"
                        onChange={handleAudioChange}
                        className="hidden"
                      />
                    </div>
                    {audioFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setAudioFile(null)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Puoi registrare la pronuncia corretta e caricarla qui (formati: MP3, WAV, M4A)
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Categoria grammaticale
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleziona una categoria (opzionale)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Definition */}
                <div className="space-y-2">
                  <Label htmlFor="definition" className="text-sm font-medium">
                    Definizione
                  </Label>
                  <Textarea
                    id="definition"
                    placeholder="Descrivi il significato della parola... (opzionale)"
                    value={formData.definition}
                    onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Examples */}
                <div className="space-y-2">
                  <Label htmlFor="examples" className="text-sm font-medium">
                    Esempi d'uso
                  </Label>
                  <Textarea
                    id="examples"
                    placeholder="Inserisci uno o più esempi, uno per riga... (opzionale)"
                    value={formData.examples}
                    onChange={(e) => setFormData(prev => ({ ...prev, examples: e.target.value }))}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Un esempio per riga
                  </p>
                </div>

                {/* Submitter Info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Informazioni di contatto (opzionali, per eventuali chiarimenti)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="submitter_name" className="text-sm font-medium">
                        Nome
                      </Label>
                      <Input
                        id="submitter_name"
                        placeholder="Il tuo nome"
                        value={formData.submitter_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitter_name: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="submitter_email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="submitter_email"
                        type="email"
                        placeholder="La tua email"
                        value={formData.submitter_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitter_email: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Invia suggerimento
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}