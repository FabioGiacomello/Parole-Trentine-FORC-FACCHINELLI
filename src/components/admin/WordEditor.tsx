import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import type { Gender, GrammarCategory, Number } from '@/types/dictionary';

interface DictionaryEntry {
  id: string;
  dialect_word: string;
  italian_word: string;
  category: string;
  gender: string | null;
  number: string | null;
  source_category: string | null;
  definition: string | null;
  examples: string[] | null;
}

interface WordEditorProps {
  entry: DictionaryEntry | null;
  onSave: () => void;
  onCancel: () => void;
}

const CATEGORIES: GrammarCategory[] = [
  'sostantivo',
  'verbo',
  'aggettivo',
  'avverbio',
  'preposizione',
  'congiunzione',
  'esclamazione',
  'pronome',
  'locuzione',
  'articolo',
  'numerale',
  'interiezione',
  'altro'
];

export function WordEditor({ entry, onSave, onCancel }: WordEditorProps) {
  const [dialectWord, setDialectWord] = useState(entry?.dialect_word || '');
  const [italianWord, setItalianWord] = useState(entry?.italian_word || '');
  const [category, setCategory] = useState<GrammarCategory>((entry?.category as GrammarCategory) || 'sostantivo');
  const [gender, setGender] = useState<Gender | ''>((entry?.gender as Gender) || '');
  const [number, setNumber] = useState<Number | ''>((entry?.number as Number) || '');
  const [definition, setDefinition] = useState(entry?.definition || '');
  const [examples, setExamples] = useState(entry?.examples?.join('\n') || '');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dialectWord.trim() || !italianWord.trim()) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Parola dialettale e italiana sono obbligatorie.'
      });
      return;
    }
    
    setSaving(true);
    
    const data = {
      dialect_word: dialectWord.trim(),
      italian_word: italianWord.trim(),
      category,
      gender: category === 'sostantivo' ? gender || null : null,
      number: category === 'sostantivo' ? number || null : null,
      source_category: entry?.category === category ? entry.source_category : null,
      definition: definition.trim() || null,
      examples: examples.split('\n').map(e => e.trim()).filter(Boolean)
    };
    
    let error;
    
    if (entry) {
      const result = await supabase
        .from('dictionary_entries')
        .update(data)
        .eq('id', entry.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('dictionary_entries')
        .insert([data]);
      error = result.error;
    }
    
    setSaving(false);
    
    if (error) {
      console.error('Errore nel salvataggio della voce:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile salvare il vocabolo.'
      });
    } else {
      toast({
        title: entry ? 'Vocabolo aggiornato' : 'Vocabolo creato',
        description: 'Le modifiche sono state salvate.'
      });
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Indietro
        </Button>
        <h2 className="font-display text-xl font-semibold">
          {entry ? 'Modifica vocabolo' : 'Nuovo vocabolo'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="card-elevated p-6 rounded-xl border border-border space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dialectWord">Parola dialettale *</Label>
            <Input
              id="dialectWord"
              value={dialectWord}
              onChange={(e) => setDialectWord(e.target.value)}
              placeholder="es. cagnina"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="italianWord">Traduzione italiana *</Label>
            <Input
              id="italianWord"
              value={italianWord}
              onChange={(e) => setItalianWord(e.target.value)}
              placeholder="es. cagnolina"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria grammaticale</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as GrammarCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {category === 'sostantivo' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Genere</Label>
              <Select
                value={gender || 'none'}
                onValueChange={(value) => setGender(value === 'none' ? '' : value as Gender)}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non specificato</SelectItem>
                  <SelectItem value="maschile">Maschile (sm)</SelectItem>
                  <SelectItem value="femminile">Femminile (sf)</SelectItem>
                  <SelectItem value="neutro">Neutro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Numero</Label>
              <Select
                value={number || 'none'}
                onValueChange={(value) => setNumber(value === 'none' ? '' : value as Number)}
              >
                <SelectTrigger id="number">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non specificato</SelectItem>
                  <SelectItem value="singolare">Singolare</SelectItem>
                  <SelectItem value="plurale">Plurale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="definition">Definizione</Label>
          <Textarea
            id="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Spiega il significato della parola..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="examples">Esempi d'uso (uno per riga)</Label>
          <Textarea
            id="examples"
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            placeholder="L'è na bèla cagnina&#10;La cagnina la córe"
            rows={4}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salva
          </Button>
        </div>
      </form>
    </div>
  );
}
