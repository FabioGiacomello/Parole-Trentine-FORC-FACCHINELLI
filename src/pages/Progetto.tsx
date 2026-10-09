import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Info,
  ListChecks,
  Search,
  Settings,
  ExternalLink,
  Sparkles,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const secondarySections = [
  {
    title: 'Indicazioni per la ricerca',
    description:
      "La ricerca supporta modalità bidirezionale (dialetto/italiano), filtri grammaticali e consultazione per lettera dell'alfabeto.",
    icon: Search,
  },
  {
    title: 'Abbreviazioni',
    description:
      'Le categorie grammaticali sono consultabili in forma abbreviata (ad esempio: sm, sf, np, vb, avv) e in forma estesa.',
    icon: Info,
  },
];

const sources = [
  {
    title: 'Lessico Trentino',
    description: 'Università di Trento — banca dati lessicale.',
    url: 'https://lessicotrentino.lett.unitn.it/fmi/webd/Lemma?homeurl=https://www.unitn.it/',
    logo: '/logos/lessico-trentino.png',
  },
  {
    title: 'Alpilink',
    description: 'Progetto sulle lingue minoritarie alpine.',
    url: 'https://alpilink.it/progetto/',
    logo: '/logos/alpilink.png',
  },
  {
    title: 'Diaolin',
    description: 'Risorse linguistiche del trentino.',
    url: 'https://www.diaolin.com/wordpress/?page_id=131',
    logo: '/logos/diaolin.png',
  },
  {
    title: 'Dialet Dictionary',
    description: 'Profilo Instagram dedicato ai dialetti.',
    url: 'https://www.instagram.com/dialet.dictionary/?hl=it',
    logo: '/logos/dialet-dictionary.png',
  },
  {
    title: 'Museo San Michele',
    description: 'Usi e Costumi della Gente Trentina.',
    url: 'https://www.museosanmichele.it',
    logo: '/logos/museo-san-michele.png',
  },
];

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function Progetto() {
  const location = useLocation();
  const creditiRef = useRef<HTMLElement | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section') ?? location.hash.replace('#', '');
    if (!section) return;

    const target = section === 'crediti' ? creditiRef.current : null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlight(section);
      const t = setTimeout(() => setHighlight(null), 2500);
      return () => clearTimeout(t);
    }
  }, [location]);

  return (
    <Layout>
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Il Progetto</h1>
            <p className="text-lg text-muted-foreground">
              Struttura, obiettivi e strumenti del Dizionario del dialetto di Trento.
            </p>
          </div>
        </div>
      </section>

      {/* Presentazione full-width */}
      <section className="container py-12">
        <article className="card-elevated rounded-2xl border border-border p-8 md:p-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">Presentazione</h2>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Il progetto <strong>e-Trentin</strong> rende consultabile online il dizionario del
            dialetto di Trento con un'interfaccia semplice e accessibile. Pensato per studenti,
            ricercatori e curiosi, permette di esplorare il lessico locale in modo bidirezionale
            (dialetto ↔ italiano), con filtri grammaticali, ricerca per lettera e una raccolta
            sempre crescente di lemmi. L'obiettivo è preservare e diffondere la ricchezza
            linguistica del territorio trentino, valorizzandone la storia culturale.
          </p>
        </article>
      </section>

      {/* Secondary sections grid */}
      <section className="container pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          {secondarySections.map((section, index) => (
            <article
              key={section.title}
              className="card-elevated rounded-2xl border border-border p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                <section.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Suggerisci CTA + Admin CTA */}
      <section className="container pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Suggerisci - primary color */}
          <article className="rounded-2xl border-2 border-primary bg-primary/5 p-6 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
              <ListChecks className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">Suggerisci una parola</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Proponi nuovi lemmi o correzioni tramite il portale dedicato ai suggerimenti.
            </p>
            <Link to="/suggerisci">
              <Button className="w-full sm:w-auto gap-2">
                <Sparkles className="h-4 w-4" />
                Apri portale suggerimenti
              </Button>
            </Link>
          </article>

          {/* Admin */}
          <article className="rounded-2xl border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20 p-6 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white mb-4">
              <Settings className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2 text-orange-950 dark:text-orange-50">Admin</h2>
            <p className="text-sm text-orange-900 dark:text-orange-200 mb-4">
              Sezione amministrativa per la gestione dei contenuti del dizionario e la revisione
              dei contributi ricevuti.
            </p>
            <Link to="/admin">
              <Button className="w-full sm:w-auto gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <Settings className="h-4 w-4" />
                Accedi all'area admin
              </Button>
            </Link>
          </article>
        </div>
      </section>


      {/* Sources Section with previews */}
      <section
        id="crediti"
        ref={creditiRef}
        className={`container py-12 border-t border-border transition-all duration-500 ${
          highlight === 'crediti' ? 'ring-4 ring-primary/40 rounded-3xl' : ''
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-6 w-6 text-primary" />
          <h2 className="font-display text-2xl md:text-3xl font-bold">Fonti</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-elevated rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
            >
              <div className="aspect-video w-full bg-muted overflow-hidden relative flex items-center justify-center p-4">
                <img
                  src={source.logo}
                  alt={`Logo ${source.title}`}
                  className="h-16 w-16 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold">{source.title}</h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">{source.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{getDomain(source.url)}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
