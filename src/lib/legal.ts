/**
 * Dati del Titolare del trattamento mostrati nell'informativa privacy.
 * DA COMPILARE a cura del Titolare prima della pubblicazione: lasciare i valori
 * vuoti fa comparire un avviso sulla pagina /privacy.
 */
export const LEGAL = {
  controllerName: '',
  controllerAddress: '',
  controllerEmail: '',
  dpoContact: '',
  retentionSuggestionsMonths: 24,
  lastUpdated: '3 novembre 2026',
} as const;

export const isLegalConfigured = (): boolean =>
  Boolean(LEGAL.controllerName && LEGAL.controllerAddress && LEGAL.controllerEmail);
