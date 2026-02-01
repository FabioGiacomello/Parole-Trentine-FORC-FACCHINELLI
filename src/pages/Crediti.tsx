import { Layout } from '@/components/layout/Layout';
import { ExternalLink, Heart, Users, BookOpen, Camera } from 'lucide-react';

const contributors = [
  {
    category: 'Ideazione',
    people: ['Alfredo Gonella'],
  },
  {
    category: 'Consulenza linguistica',
    people: ['Patrizia Cordin'],
  },
  {
    category: 'Lettura degli audio',
    people: ['Paola Bortolameotti', 'Alberto Cosa', 'Giordano Dainese'],
  },
  {
    category: 'Collaborazione alla raccolta lessicale',
    people: ['Da completare'],
  },
  {
    category: 'Supporto informatico',
    people: [
      "Classe IV * dell'Istituto Tecnico Tecnologico Buonarroti di Trento",
      'Con la guida del professor Murtas'
    ],
  },
];

const resources = [
  {
    name: 'Museo degli Usi e Costumi della Gente Trentina',
    description: 'Fotografie di oggetti tradizionali',
    url: 'https://www.museosanmichele.it/',
    icon: Camera,
  },
  {
    name: 'Trentino Pills',
    description: 'Ideazione e promozione del progetto',
    url: 'https://instagram.com/trentino_pills',
    icon: Heart,
  },
];

export default function Crediti() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Crediti
            </h1>
            <p className="text-lg text-muted-foreground">
              Le persone e le risorse che rendono possibile questo progetto
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Contributors */}
          <div className="card-elevated p-8 rounded-2xl border border-border animate-slide-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Users className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl font-bold">
                Collaboratori
              </h2>
            </div>

            <div className="space-y-8">
              {contributors.map((group, index) => (
                <div key={group.category} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    {group.category}
                  </h3>
                  <ul className="space-y-2">
                    {group.people.map(person => (
                      <li key={person} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-foreground">{person}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="card-elevated p-8 rounded-2xl border border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <BookOpen className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl font-bold">
                Risorse e Riferimenti
              </h2>
            </div>

            <div className="grid gap-4">
              {resources.map((resource, index) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all animate-fade-in"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <resource.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {resource.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Special Thanks */}
          <div className="text-center py-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <Heart className="h-5 w-5 text-destructive" />
              <span className="font-display text-lg font-semibold">Ringraziamenti speciali</span>
            </div>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A tutti coloro che quotidianamente contribuiscono alla preservazione 
              del nostro dialetto, tramandandolo alle nuove generazioni.
            </p>
          </div>

          {/* License */}
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              I contenuti di questo dizionario sono rilasciati per fini culturali e didattici.
            </p>
            <p className="mt-2">
              Per utilizzi commerciali o editoriali, contattaci per informazioni.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
