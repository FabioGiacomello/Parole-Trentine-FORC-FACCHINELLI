import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WordViewStat {
  dialectWord: string;
  italianWord: string;
  viewCount: number;
}

export function useWordViews() {
  const [mostViewed, setMostViewed] = useState<WordViewStat[]>([]);

  const fetchMostViewed = async () => {
    const { data, error } = await supabase
      .from('word_views')
      .select('dialect_word, italian_word, view_count')
      .order('view_count', { ascending: false })
      .limit(5);

    if (!error && data) {
      setMostViewed(data.map(d => ({
        dialectWord: d.dialect_word,
        italianWord: d.italian_word,
        viewCount: d.view_count,
      })));
    }
  };

  useEffect(() => {
    fetchMostViewed();
  }, []);

  const incrementWordView = async (dialectWord: string, italianWord: string) => {
    await supabase.rpc('increment_word_view', {
      p_dialect_word: dialectWord.toLowerCase(),
      p_italian_word: italianWord,
    });
    fetchMostViewed();
  };

  const getMostViewedWords = (limit = 5): WordViewStat[] => {
    return mostViewed.slice(0, limit);
  };

  return {
    incrementWordView,
    getMostViewedWords,
  };
}
