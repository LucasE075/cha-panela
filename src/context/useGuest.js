import { useContext } from 'react';
import { GuestContext } from './GuestContext';

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest deve ser usado dentro de um GuestProvider');
  }
  return context;
}
