import { useState } from 'react';
import { supabase } from '@/services/supabase/supabaseClient';

export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = async (callback) => {
    try {
      setLoading(true);
      setError(null);
      const result = await callback();
      return result;
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findByPhone = async (phone) => {
    return query(async () => {
      const { data, error } = await supabase
        .from('convidados')
        .select('*')
        .eq('celular', phone)
        .maybeSingle();

      if (error) throw error;
      return data;
    });
  };

  const createGuest = async (guestData) => {
    return query(async () => {
      const { data, error } = await supabase
        .from('convidados')
        .insert(guestData)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    });
  };

  const updateGuest = async (guestId, updates) => {
    return query(async () => {
      const { data, error } = await supabase
        .from('convidados')
        .update(updates)
        .eq('id', guestId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    });
  };

  return {
    loading,
    error,
    query,
    findByPhone,
    createGuest,
    updateGuest,
  };
}
