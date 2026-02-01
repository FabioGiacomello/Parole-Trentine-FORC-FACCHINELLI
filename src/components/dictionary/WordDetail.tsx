import { DictionaryEntry, GrammarCategory } from '@/types/dictionary';
import { Volume2, X, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WordCard } from './WordCard';

interface WordDetailProps {
  entry: DictionaryEntry;
  similarWords: DictionaryEntry[];
  onClose: () => void;
  onSelectSimilar: (entry: DictionaryEntry) => void;
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
};

export function WordDetail({ entry, similarWords, onClose, onSelectSimilar }: WordDetailProps) {
  const playAudio = () => {
    if (entry.audioUrl) {
      const audio = new Audio(entry.audioUrl);
      audio.play();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-medium overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-3xl font-bold text-foreground">
                {entry.dialectWord}
              </h2>
              {entry.audioUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={playAudio}
                  className="rounded-full"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xl text-muted-foreground">{entry.italianWord}</span>
              <Badge variant="secondary" className="font-normal">
                {categoryLabels[entry.category]}
              </Badge>
              {entry.gender && (
                <Badge variant="outline" className="font-normal">
                  {entry.gender}
                </Badge>
              )}
              {entry.number && (
                <Badge variant="outline" className="font-normal">
                  {entry.number}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Definition */}
          {entry.definition && (
            <section>
              <h3 className="font-display text-lg font-semibold mb-2">Definizione</h3>
              <p className="text-foreground">{entry.definition}</p>
            </section>
          )}

          {/* Examples */}
          {entry.examples && entry.examples.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-semibold mb-3">Esempi d'uso</h3>
              <ul className="space-y-2">
                {entry.examples.map((example, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-primary font-medium">{index + 1}.</span>
                    <span className="italic text-foreground">{example}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Image Placeholder */}
          {entry.imageUrl && (
            <section>
              <h3 className="font-display text-lg font-semibold mb-3">Immagine</h3>
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Immagine disponibile</p>
                </div>
              </div>
            </section>
          )}

          {/* Related Words */}
          {entry.relatedWords && entry.relatedWords.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-semibold mb-3">Parole correlate</h3>
              <div className="flex flex-wrap gap-2">
                {entry.relatedWords.map(word => (
                  <Badge 
                    key={word} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10"
                  >
                    {word}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Similar Words - AI Suggestions */}
          {similarWords.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <span>Parole simili</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  Suggerite
                </Badge>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {similarWords.slice(0, 4).map(similar => (
                  <WordCard
                    key={similar.id}
                    entry={similar}
                    onClick={() => onSelectSimilar(similar)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
