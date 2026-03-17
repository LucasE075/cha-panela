import { useState, useCallback, useEffect } from 'react';
import { MusicContext } from './MusicContext';

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(() => {
    // Recuperar estado inicial de música do sessionStorage
    const savedState = sessionStorage.getItem('musicPlaying');
    return savedState === 'true';
  });

  // Gerenciar áudio global e sessionStorage
  useEffect(() => {
    const audioElement = document.getElementById('global-music');
    
    if (audioElement) {
      sessionStorage.setItem('musicPlaying', isPlaying);
      
      if (isPlaying) {
        audioElement.play().catch(err => {
          console.warn('Erro ao reproduzir áudio:', err);
          setIsPlaying(false);
        });
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying]);

  const toggleMusic = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const value = {
    isPlaying,
    toggleMusic,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}
