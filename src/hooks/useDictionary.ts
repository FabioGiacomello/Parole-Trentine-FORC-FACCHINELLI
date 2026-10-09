import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DictionaryEntry, SearchFilters, GrammarCategory, Gender, Number } from '@/types/dictionary';

const PAGE_SIZE = 1000;

const normalizeSearchText = (text: string) => text.normalize('NFC').toLocaleLowerCase();

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error, count } = await supabase
        .from('dictionary_entries')
        .select('*', { count: 'exact' })
        .order('dialect_word', { ascending: true })
        .order('id', { ascending: true })
        .range(0, PAGE_SIZE - 1);
      
      if (error) {
        console.error('Errore nel caricamento del dizionario:', error);
      } else if (data) {
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(Math.ceil((count ?? data.length) / PAGE_SIZE) - 1, 0) }, (_, index) =>
            supabase
              .from('dictionary_entries')
              .select('*')
              .order('dialect_word', { ascending: true })
              .order('id', { ascending: true })
              .range((index + 1) * PAGE_SIZE, (index + 2) * PAGE_SIZE - 1)
          )
        );
        const failedPage = remainingPages.find(page => page.error);
        if (failedPage?.error) {
          console.error('Errore nel caricamento delle pagine del dizionario:', failedPage.error);
          setLoading(false);
          return;
        }

        const allData = data.concat(...remainingPages.map(page => page.data ?? []));
        setEntries(allData.map(e => ({
          id: e.id,
          dialectWord: e.dialect_word,
          italianWord: e.italian_word,
          category: e.category as GrammarCategory,
          gender: e.gender ? e.gender as Gender : undefined,
          number: e.number ? e.number as Number : undefined,
          definition: e.definition || undefined,
          examples: e.examples || undefined,
          audioUrl: e.audio_url || undefined,
          imageUrl: e.image_url || undefined,
          relatedWords: e.related_words || undefined,
          createdAt: new Date(e.created_at),
          updatedAt: new Date(e.updated_at)
        })));
      }
      setLoading(false);
    };
    
    fetchEntries();
  }, []);

  const search = (query: string, filters: SearchFilters, isLetterFilter = false): DictionaryEntry[] => {
    if (!query.trim()) return [];
    const normalizedQuery = normalizeSearchText(query.trim());

    return entries.filter(entry => {
      if (filters.category && entry.category !== filters.category) return false;

      const matchFn = isLetterFilter
        ? (text: string) => normalizeSearchText(text).startsWith(normalizedQuery)
        : (text: string) => normalizeSearchText(text).includes(normalizedQuery);

      const matchesDialect = matchFn(entry.dialectWord);
      const matchesItalian = matchFn(entry.italianWord);
      const matchesExamples = isLetterFilter
        ? false
        : entry.examples?.some(ex => normalizeSearchText(ex).includes(normalizedQuery));
      const matchesDefinition = isLetterFilter
        ? false
        : normalizeSearchText(entry.definition ?? '').includes(normalizedQuery);

      switch (filters.searchDirection) {
        case 'dialect-to-italian':
          return matchesDialect || matchesExamples;
        case 'italian-to-dialect':
          return matchesItalian || matchesDefinition;
        default:
          return matchesDialect || matchesItalian || matchesExamples || matchesDefinition;
      }
    });
  };

  const getSimilarWords = (entry: DictionaryEntry): DictionaryEntry[] => {
    return entries.filter(e => 
      e.id !== entry.id && (
        entry.relatedWords?.includes(e.dialectWord) ||
        e.category === entry.category
      )
    ).slice(0, 5);
  };

  const getEntryById = (id: string): DictionaryEntry | undefined => entries.find(e => e.id === id);

  const categories: GrammarCategory[] = useMemo(() => [...new Set(entries.map(e => e.category))], [entries]);

  return { entries, search, getSimilarWords, getEntryById, categories, totalCount: entries.length, loading };
}
