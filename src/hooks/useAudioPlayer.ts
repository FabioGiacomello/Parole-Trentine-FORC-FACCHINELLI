import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveAudioUrl, hasAudio } from '@/lib/audio';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'error';

/** Riproduce la pronuncia di una voce; ferma e libera l'audio allo smontaggio o al cambio parola. */
export function useAudioPlayer(dialectWord: string, audioUrl?: string) {
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [available, setAvailable] = useState(Boolean(audioUrl));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const release = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    audioRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('idle');
    setAvailable(Boolean(audioUrl));
    if (!audioUrl) {
      hasAudio(dialectWord).then(found => { if (!cancelled) setAvailable(found); });
    }
    return () => {
      cancelled = true;
      release();
    };
  }, [dialectWord, audioUrl, release]);

  const play = useCallback(async () => {
    if (status === 'playing') {
      release();
      setStatus('idle');
      return;
    }
    release();
    setStatus('loading');
    const url = await resolveAudioUrl(dialectWord, audioUrl);
    if (!url) {
      setStatus('error');
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setStatus('idle');
    audio.onerror = () => {
      console.error('Errore di caricamento audio:', url, audio.error);
      setStatus('error');
    };
    try {
      await audio.play();
      setStatus('playing');
    } catch (error) {
      // Autoplay bloccato, file mancante o formato non supportato
      if ((error as DOMException).name === 'AbortError') return;
      console.error('Impossibile riprodurre l\'audio:', url, error);
      setStatus('error');
    }
  }, [dialectWord, audioUrl, status, release]);

  return { play, status, available };
}
