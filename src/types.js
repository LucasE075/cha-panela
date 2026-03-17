/**
 * Tipos de dados para referência
 * Note: Este é um documento de referência. Para máxima type safety, considere usar TypeScript no futuro.
 */

// Guest/Convidado
/**
 * @typedef {Object} Guest
 * @property {number} id - ID único do convidado
 * @property {string} nome - Nome do convidado
 * @property {string} celular - Telefone do convidado
 * @property {string} presenca - Status: 'pendente', 'confirmado', 'recusado'
 * @property {string} presente - Presente escolhido (opcional)
 * @property {string} created_at - Data de criação
 * @property {string} updated_at - Data de última atualização
 */

// Form State
/**
 * @typedef {Object} FormState
 * @property {Object} values - Valores do formulário
 * @property {Object} errors - Erros de validação
 * @property {Object} touched - Campos tocados
 * @property {Function} handleChange - Handler para input change
 * @property {Function} handleBlur - Handler para input blur
 * @property {Function} resetForm - Reseta formulário
 */
