import { Link } from 'react-router-dom';
import { Book, Instagram, Mail, MonitorSmartphone, Award } from 'lucide-react';

const partnerLogos = [
  { src: '/Partener/Logo_3LINLAB.jpeg', alt: '3LINLAB' },
  { src: '/Partener/BILINGUALISM MATTERS.jpeg', alt: 'Bilingualism Matters' },
  { src: '/Partener/images.png', alt: 'Partner' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Book className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  e-Trentin
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dizionario del dialetto di Trento online
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Un progetto dedicato alla preservazione e diffusione del dialetto trentino.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MonitorSmartphone className="h-4 w-4" />
              Compatibile con PC, tablet e smartphone
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Navigazione</h4>
            <nav className="flex flex-col gap-2">
              <a
                href="https://instagram.com/trentino_pills"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Instagram className="h-4 w-4" />
                Trentino Pills
              </a>
              <Link
                to="/suggerisci"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Suggerisci una parola
              </Link>
              <Link
                to="/chi-siamo"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                Chi siamo
              </Link>
            </nav>
          </div>

          {/* Logos */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Partner</h4>
            <div className="flex items-center gap-3 flex-wrap">
              {partnerLogos.map((logo) => (
                <div
                  key={logo.src}
                  className="flex h-16 w-16 items-center justify-center rounded-lg bg-white border border-border p-1.5"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Dizionario Trentino. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
