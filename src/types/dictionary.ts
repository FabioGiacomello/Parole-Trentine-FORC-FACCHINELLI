export type GrammarCategory = 
  | 'sostantivo' 
  | 'verbo' 
  | 'aggettivo' 
  | 'avverbio' 
  | 'pronome' 
  | 'preposizione' 
  | 'congiunzione' 
  | 'esclamazione'
  | 'locuzione'
  | 'articolo'
  | 'numerale'
  | 'interiezione'
  | 'altro';

export type Gender = 'maschile' | 'femminile' | 'neutro';
export type Number = 'singolare' | 'plurale';

export interface DictionaryEntry {
  id: string;
  dialectWord: string;
  italianWord: string;
  category: GrammarCategory;
  gender?: Gender;
  number?: Number;
  definition?: string;
  examples?: string[];
  audioUrl?: string;
  imageUrl?: string;
  relatedWords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  category?: GrammarCategory;
  searchDirection: 'dialect-to-italian' | 'italian-to-dialect' | 'both';
}

export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultCount: number;
}

export interface Suggestion {
  id: string;
  dialectWord: string;
  italianWord: string;
  category?: GrammarCategory;
  examples?: string[];
  submittedBy: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  notes?: string;
}
