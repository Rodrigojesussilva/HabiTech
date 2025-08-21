/**
 * Verifica se o usuário atual pode editar um registro
 * @param recordCreatedBy Email do usuário que criou o registro
 * @param currentUserEmail Email do usuário atual
 * @returns true se o usuário pode editar, false caso contrário
 */
export function canUserEdit(recordCreatedBy: string, currentUserEmail: string): boolean {
  if (!recordCreatedBy || !currentUserEmail) return false;
  return recordCreatedBy === currentUserEmail;
}

/**
 * Obtém o email do usuário atual do localStorage
 * @returns Email do usuário ou string vazia se não estiver logado
 */
export function getCurrentUserEmail(): string {
  return localStorage.getItem('userEmail') || '';
}

/**
 * Extrai o nome da empresa do email
 * @param email Email do usuário
 * @returns Nome da empresa (urbhis, diagonal, cobrape)
 */
export function getUserCompanyFromEmail(email: string): string {
  if (!email) return '';
  const [prefix] = email.split('@');
  return prefix;
} 