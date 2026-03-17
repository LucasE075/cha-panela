import { useContext } from 'react';
import { MusicContext } from './MusicContext';

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic deve ser usado dentro de um MusicProvider');
  }
  return context;
}
