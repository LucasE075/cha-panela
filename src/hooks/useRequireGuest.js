import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '@/context';

export function useRequireGuest() {
  const navigate = useNavigate();
  const { guest, loading } = useGuest();

  useEffect(() => {
    if (!loading && !guest) {
      navigate('/');
    }
  }, [guest, loading, navigate]);

  return { guest, loading };
}
