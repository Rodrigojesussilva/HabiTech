export function calcularIdade(dataNascimento: string): string {
  if (!dataNascimento || typeof dataNascimento !== "string") return "";

  const parts = dataNascimento.split("-");
  if (parts.length !== 3) return "";

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age.toString();
}

export function validarDataNascimento(
  dataNascimento: string | undefined,
  familyIndex: number,
  setValue: any
): { isValid: boolean; errorType?: 'invalid' | 'future' } {
  const pathNascimento = `families[${familyIndex}].dataNascimentoResp`;
  const pathIdade = `families[${familyIndex}].idadeRespR`;

  // Se não há data, considera válido (ou ajuste conforme sua regra de negócio)
  if (!dataNascimento || dataNascimento === "") {
    setValue(pathNascimento, "", { shouldValidate: true, shouldDirty: true });
    setValue(pathIdade, "", { shouldValidate: true, shouldDirty: true });
    return { isValid: true };
  }

  const data = new Date(dataNascimento);
  const hoje = new Date();

  // ❌ Data inválida
  if (isNaN(data.getTime())) {
    setValue(pathNascimento, "", { shouldValidate: true, shouldDirty: true });
    setValue(pathIdade, "", { shouldValidate: true, shouldDirty: true });
    return { isValid: false, errorType: 'invalid' };
  }

  // ❌ Data futura
  if (data > hoje) {
    setValue(pathNascimento, "", { shouldValidate: true, shouldDirty: true });
    setValue(pathIdade, "", { shouldValidate: true, shouldDirty: true });
    return { isValid: false, errorType: 'future' };
  }

  return { isValid: true };
}





