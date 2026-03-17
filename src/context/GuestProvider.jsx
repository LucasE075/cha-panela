import { useState, useCallback, useEffect } from 'react';
import { GuestContext } from './GuestContext';

export function GuestProvider({ children }) {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setCurrentGuest = useCallback((guestData) => {
    setGuest(guestData);
    if (guestData?.id) {
      // Salvar no localStorage para persistência (usa 'convidado' para compatibilidade)
      localStorage.setItem('convidado', JSON.stringify(guestData));
    }
  }, []);

  const clearGuest = useCallback(() => {
    setGuest(null);
    localStorage.removeItem('convidado');
  }, []);

  const loadGuestFromStorage = useCallback(() => {
    const stored = localStorage.getItem('convidado');
    if (stored) {
      try {
        const guestData = JSON.parse(stored);
        setGuest(guestData);
        return guestData;
      } catch (err) {
        console.error('Erro ao carregar convidado do localStorage:', err);
        localStorage.removeItem('convidado');
      }
    }
    return null;
  }, []);

  // Carregar guest do localStorage ao inicializar
  useEffect(() => {
    console.log('GuestProvider - Carregando guest do localStorage');
    const loaded = loadGuestFromStorage();
    console.log('GuestProvider - Guest carregado:', loaded);
    setLoading(false);
  }, [loadGuestFromStorage]);

  const value = {
    guest,
    loading,
    error,
    setCurrentGuest,
    clearGuest,
    loadGuestFromStorage,
    setLoading,
    setError,
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
}
