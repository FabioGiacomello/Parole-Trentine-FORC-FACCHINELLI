import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LEGAL, isLegalConfigured } from '@/lib/legal';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function Privacy() {
  const configured = isLegalConfigured();
  return (
    <Layout>
      <article className="container max-w-3xl py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Informativa privacy e cookie</h1>
          <p className="text-sm text-muted-foreground">
            Ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003 (Codice privacy),
            come modificato dal D.Lgs. 101/2018. Ultimo aggiornamento: {LEGAL.lastUpdated}.
          </p>
        </header>

        {!configured && (
          <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Dati del Titolare non ancora inseriti: compilare <code>src/lib/legal.ts</code> prima della pubblicazione.
          </p>
        )}

        <Section title="1. Titolare del trattamento">
          <p>
            {LEGAL.controllerName || '[denominazione del Titolare]'}, {LEGAL.controllerAddress || '[indirizzo]'}.
            Contatto per le richieste privacy: {LEGAL.controllerEmail || '[email]'}.
            {LEGAL.dpoContact && ` Responsabile della protezione dei dati (DPO): ${LEGAL.dpoContact}.`}
          </p>
        </Section>

        <Section title="2. Quali dati trattiamo, perché e su quale base">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Consultazione del dizionario.</strong> Non richiede registrazione. I contatori delle visualizzazioni
              delle parole sono aggregati e non sono collegati a una persona. Come ogni sito, il servizio di hosting può registrare
              dati tecnici di navigazione (es. indirizzo IP) per sicurezza e funzionamento. Base giuridica: legittimo
              interesse alla sicurezza e al corretto funzionamento del servizio (art. 6.1.f GDPR).
            </li>
            <li>
              <strong>Suggerimento di una parola.</strong> Parola, traduzione, categoria, definizione ed esempi che inserisci;
              nome ed email sono facoltativi e servono solo per eventuali chiarimenti. Base giuridica: tua richiesta e
              consenso per i dati di contatto facoltativi (art. 6.1.a e 6.1.b GDPR). Non inserire dati personali di terzi
              né informazioni sensibili nei campi di testo libero.
            </li>
            <li>
              <strong>Accesso area amministrativa.</strong> Riservato ai curatori: email, password (conservata in forma cifrata
              dal fornitore di autenticazione), ruolo e dati di sessione. Base giuridica: esecuzione dell'incarico e
              legittimo interesse alla sicurezza (art. 6.1.b e 6.1.f GDPR).
            </li>
            <li>
              <strong>Cronologia delle ricerche.</strong> Salvata solo nel tuo browser (archiviazione locale) per comodità; non viene
              inviata ai nostri server. Puoi cancellarla in qualsiasi momento dalla pagina Cronologia.
            </li>
          </ul>
        </Section>

        <Section title="3. Cookie e archiviazione locale">
          <p>
            Il sito <strong>non utilizza cookie di profilazione né strumenti di analisi o pubblicità di terze parti</strong>.
            Usa soltanto strumenti tecnici o funzionali, per i quali la normativa (art. 122 Codice privacy; Linee guida
            del Garante del 10 giugno 2021) non richiede il consenso preventivo ma solo questa informativa: la
            sessione di autenticazione dell'area amministrativa e la cronologia delle ricerche nel tuo browser.
            Per questo motivo non è presente un banner di consenso. I caratteri tipografici sono ospitati sul sito stesso: nessun
            dato viene inviato a Google Fonts o ad altri servizi esterni di font.
          </p>
          <p>Se in futuro verranno introdotti strumenti non tecnici, chiederemo il tuo consenso prima di attivarli.</p>
        </Section>

        <Section title="4. Destinatari e responsabili del trattamento">
          <p>
            I dati sono trattati da personale autorizzato e da fornitori nominati responsabili del trattamento
            (art. 28 GDPR): il fornitore di database e autenticazione (Supabase) e il fornitore di hosting (Netlify).
            I dati non sono diffusi né venduti. Se un fornitore tratta dati fuori dallo Spazio Economico Europeo, il
            trasferimento avviene con garanzie adeguate (decisione di adeguatezza o clausole contrattuali standard, artt. 44-46 GDPR).
          </p>
        </Section>

        <Section title="5. Conservazione">
          <p>
            I suggerimenti, con eventuali dati di contatto, sono conservati per il tempo necessario a valutarli e comunque non oltre{' '}
            {LEGAL.retentionSuggestionsMonths} mesi; la parola accettata entra nel dizionario in forma anonima. I dati
            dell'account amministrativo sono conservati finché l'incarico è attivo. I dati tecnici di hosting seguono i tempi
            del fornitore.
          </p>
        </Section>

        <Section title="6. I tuoi diritti">
          <p>
            Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione (artt. 15-22 GDPR) e revocare il
            consenso in ogni momento, senza pregiudicare i trattamenti precedenti. Scrivi a {LEGAL.controllerEmail || '[email]'}: rispondiamo
            entro un mese. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali
            (<a className="underline" href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">garanteprivacy.it</a>).
          </p>
          <p>Il conferimento dei dati facoltativi è libero; non è previsto alcun processo decisionale automatizzato né profilazione.</p>
        </Section>

        <Section title="7. Minori">
          <p>
            Il servizio non è rivolto a raccogliere dati di minori di 14 anni (art. 2-quinquies Codice privacy). I minori di 14 anni
            non devono inviare dati di contatto senza il consenso di chi esercita la responsabilità genitoriale.
          </p>
        </Section>

        <p className="text-sm">
          <Link to="/" className="underline">Torna al dizionario</Link>
        </p>
      </article>
    </Layout>
  );
}
