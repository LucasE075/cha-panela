// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  INTRODUCAO: '/introducao',
  PRESENTES: '/presentes',
  CONFIRMACAO: '/confirmacao',
  AREA_CONVIDADO: '/area-convidado',
};

// Mensagens padrão
export const MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_PHONE: 'Número de telefone inválido',
  PHONE_REQUIRED: 'Informe seu número de telefone',
  ERROR_LOADING: 'Erro ao carregar dados',
  ERROR_SAVING: 'Erro ao salvar dados',
  SUCCESS_SAVED: 'Dados salvos com sucesso!',
};

// Validações
export const VALIDATION = {
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 11,
  MAX_NAME_LENGTH: 100,
};

// Status de presença
export const ATTENDANCE_STATUS = {
  PENDING: 'pendente',
  CONFIRMED: 'confirmado',
  DECLINED: 'recusado',
};
