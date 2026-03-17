/**
 * Validação de telefone brasileiro
 * Aceita formatos: (XX) 9XXXX-XXXX, (XX) XXXXX-XXX, XXXXXXXXXX, etc
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

/**
 * Validação de nome
 */
export const validateName = (name) => {
  return name && name.trim().length > 0 && name.length <= 100;
};

/**
 * Formata telefone para exibição
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) 9${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Remove caracteres especiais do telefone
 */
export const cleanPhone = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trata erro do Supabase e retorna mensagem amigável
 */
export const handleErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Erro ao processar a solicitação';
};
