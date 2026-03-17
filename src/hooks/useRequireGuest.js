import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '@/context';

export function useRequireGuest() {
  const navigate = useNavigate();
  const { guest, loading } = useGuest();

  useEffect(() => {
    // Só redireciona se terminou de carregar E não há guest
    if (loading === false && !guest) {
      console.warn('useRequireGuest - Usuário não autenticado, redirecionando para login');
      navigate('/');
    }
  }, [guest, loading, navigate]);

  return { guest, loading };
}
