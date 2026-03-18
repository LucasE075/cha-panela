import { useState, useCallback, useEffect } from 'react';
import { GuestContext } from './GuestContext';

export function GuestProvider({ children }) {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setCurrentGuest = useCallback((guestData) => {
    if (guestData?.id) {
      // Salvar no localStorage para persistência (usa 'convidado' para compatibilidade)
      localStorage.setItem('convidado', JSON.stringify(guestData));
      setGuest(guestData);
    } else {
      console.warn('GuestProvider - Tentativa de salvar guest sem ID:', guestData);
    }
  }, []);

  const clearGuest = useCallback(() => {
    setGuest(null);
    localStorage.removeItem('convidado');
  }, []);

  // Carregar guest do localStorage ao inicializar (uma única vez)
  useEffect(() => {
    const initializeGuest = () => {
      try {
        const stored = localStorage.getItem('convidado');
        if (stored) {
          const guestData = JSON.parse(stored);
          setGuest(guestData);
        }
      } catch (err) {
        console.error('GuestProvider - Erro ao carregar guest do localStorage:', err);
        localStorage.removeItem('convidado');
      }
    };

    initializeGuest();
    setLoading(false);
  }, []); // Array vazio para executar apenas uma vez na montagem

  const value = {
    guest,
    loading,
    error,
    setCurrentGuest,
    clearGuest,
    setLoading,
    setError,
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
}
