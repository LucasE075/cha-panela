import { useEffect } from 'react';

export function useScrollToTop() {
  useEffect(() => {
    // Scroll imediato
    window.scrollTo(0, 0);
    
    // Scroll com delay para garantir (em caso de renderização lenta)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
}
