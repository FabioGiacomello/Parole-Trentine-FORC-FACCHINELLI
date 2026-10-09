import { Layout } from '@/components/layout/Layout';
import { Heart, Mic, MonitorSmartphone, PenLine, Users } from 'lucide-react';

const team = [
  { role: 'Ideazione', name: 'Alfredo Gonella', icon: PenLine },
  { role: 'Consulenza linguistica', name: 'Patrizia Cordin', icon: Users },
  { role: 'Lettura degli audio', name: 'Paola Bortolameotti, Alberto Cosa, Giordano Dainese', icon: Mic },
  { role: 'Collaborazione alla raccolta lessicale', name: 'Da completare', icon: Users },
  {
    role: 'Supporto informatico',
    name: "Classe IV * dell'Istituto Tecnico Tecnologico Buonarroti di Trento, con la guida del professor Murtas",
    icon: MonitorSmartphone
  }
];

export default function ChiSiamo() {
  return (
    <Layout>
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Chi Siamo
            </h1>
            <p className="text-lg text-muted-foreground">
              Le persone che curano il Dizionario del dialetto di Trento
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {team.map((member, index) => (
            <div
              key={member.role}
              className="card-elevated rounded-2xl border border-border p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <member.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-muted-foreground mb-1">{member.role}</p>
                  <p className="font-medium text-foreground">{member.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ringraziamenti speciali */}
      <section className="container pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-8 md:p-10 text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Heart className="h-7 w-7" />
              </div>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ringraziamenti speciali
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Un sentito grazie a tutte le persone che hanno preso parte nel dare vita a questo
              progetto: studenti, docenti, ricercatori, parlanti del dialetto, famiglie e amici
              che hanno condiviso parole, storie ed esperienze. Senza il vostro contributo
              questo dizionario non esisterebbe.
            </p>
            <p className="text-sm text-muted-foreground mt-6 italic">
              Grazie di cuore a chiunque abbia donato anche solo una parola.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
