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
) {
  const pathNascimento = `families[${familyIndex}].dataNascimentoResp`;
  const pathIdade = `families[${familyIndex}].idadeResp`;

  if (!dataNascimento) return;

  const data = new Date(dataNascimento);
  const hoje = new Date();

  // ❌ Data inválida
  if (isNaN(data.getTime())) {
    alert("Data inválida.");
    setValue(pathNascimento, "", { shouldValidate: false, shouldDirty: false });
    setValue(pathIdade, "", { shouldValidate: false, shouldDirty: false });
    return;
  }

  // ❌ Data futura
  if (data > hoje) {
    alert("Data de nascimento não pode ser futura.");
    setValue(pathNascimento, "", { shouldValidate: false, shouldDirty: false });
    setValue(pathIdade, "", { shouldValidate: false, shouldDirty: false });
    return;
  }
}






