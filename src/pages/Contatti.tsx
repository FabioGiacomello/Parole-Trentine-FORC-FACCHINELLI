import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, Instagram, CheckCircle } from 'lucide-react';
import { GrammarCategory } from '@/types/dictionary';
import { useToast } from '@/hooks/use-toast';

const categoryOptions: { value: GrammarCategory; label: string }[] = [
  { value: 'sostantivo', label: 'Sostantivo' },
  { value: 'verbo', label: 'Verbo' },
  { value: 'aggettivo', label: 'Aggettivo' },
  { value: 'avverbio', label: 'Avverbio' },
  { value: 'pronome', label: 'Pronome' },
  { value: 'locuzione', label: 'Locuzione' },
  { value: 'esclamazione', label: 'Esclamazione' },
];

export default function Contatti() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dialectWord: '',
    italianWord: '',
    category: '' as GrammarCategory | '',
    examples: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Suggerimento inviato!",
      description: "Grazie per il tuo contributo. Lo esamineremo al più presto.",
    });
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="container py-24">
          <div className="max-w-md mx-auto text-center animate-fade-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-6">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">
              Grazie per il contributo!
            </h1>
            <p className="text-muted-foreground mb-8">
              Il tuo suggerimento è stato ricevuto. Lo esamineremo e, se approvato, 
              verrà aggiunto al dizionario.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Invia un altro suggerimento
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Contatti & Segnalazioni
            </h1>
            <p className="text-lg text-muted-foreground">
              Aiutaci a rendere il dizionario più completo
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card-elevated p-8 rounded-2xl border border-border">
                <h2 className="font-display text-2xl font-bold mb-6">
                  Suggerisci una parola
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Il tuo nome</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Mario Rossi"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="mario@email.it"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dialectWord">Parola in dialetto *</Label>
                      <Input
                        id="dialectWord"
                        value={formData.dialectWord}
                        onChange={e => setFormData(prev => ({ ...prev, dialectWord: e.target.value }))}
                        placeholder="es. ciuciàr"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="italianWord">Traduzione italiana *</Label>
                      <Input
                        id="italianWord"
                        value={formData.italianWord}
                        onChange={e => setFormData(prev => ({ ...prev, italianWord: e.target.value }))}
                        placeholder="es. succhiare"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria grammaticale</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: GrammarCategory) => 
                        setFormData(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona una categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examples">Esempi d'uso</Label>
                    <Textarea
                      id="examples"
                      value={formData.examples}
                      onChange={e => setFormData(prev => ({ ...prev, examples: e.target.value }))}
                      placeholder="Inserisci una o più frasi di esempio (una per riga)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Note aggiuntive</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Varianti dialettali, zona geografica d'uso, ecc."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      'Invio in corso...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Invia suggerimento
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card-elevated p-6 rounded-xl border border-border">
                <h3 className="font-display text-lg font-semibold mb-4">
                  Seguici sui social
                </h3>
                <a 
                  href="https://instagram.com/trentino_pills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">@trentino_pills</p>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                  </div>
                </a>
              </div>

              <div className="card-elevated p-6 rounded-xl border border-border">
                <h3 className="font-display text-lg font-semibold mb-4">
                  Come funziona
                </h3>
                <ol className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                      1
                    </span>
                    <span>Compila il modulo con la parola dialettale e la sua traduzione</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                      2
                    </span>
                    <span>Il nostro team esamina il suggerimento</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                      3
                    </span>
                    <span>Se approvato, la parola viene aggiunta al dizionario</span>
                  </li>
                </ol>
              </div>

              <div className="card-elevated p-6 rounded-xl border border-border bg-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-semibold">
                    Altre segnalazioni?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Per errori, correzioni o domande generali puoi contattarci 
                  tramite Instagram o compilare il modulo indicando nelle note 
                  la natura della segnalazione.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
