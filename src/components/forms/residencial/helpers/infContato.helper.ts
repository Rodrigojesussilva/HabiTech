
export function formatarTelefoneAuto(value: string): string {
    if (!value) return "";

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
        // Celular
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        // Fixo
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length <= 2) {
        return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    }
}

export function validarDataNascimento(
  dataNascimento: string | undefined
): { isValid: boolean; error?: string } {
  if (!dataNascimento) {
    return { isValid: true }; // Campo vazio é considerado válido
  }

  const data = new Date(dataNascimento);
  const hoje = new Date();

  // ❌ Data inválida
  if (isNaN(data.getTime())) {
    return { isValid: false, error: "Data inválida." };
  }

  // ❌ Data futura
  if (data > hoje) {
    return { isValid: false, error: "Data de nascimento não pode ser futura." };
  }

  // ✅ Data válida
  return { isValid: true };
}


