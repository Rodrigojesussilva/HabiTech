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
  setValue: Function
) {
  if (!dataNascimento || typeof dataNascimento !== "string") return;

  // Verifica se o formato geral é YYYY-MM-DD
  const isFormatoValido = /^\d{4}-\d{2}-\d{2}$/.test(dataNascimento);
  if (!isFormatoValido) {
    alert("Data inválida. Use o formato DD-MM-AAAA.");
    setValue(`families[${familyIndex}].dataNascimentoResp`, "", { shouldValidate: true });
    setValue(`families[${familyIndex}].idadeResp`, "", { shouldValidate: true });
    return;
  }

  // Verifica se o ano tem exatamente 4 dígitos
  const ano = dataNascimento.split("-")[0];
  if (ano.length !== 4) {
    alert("Ano inválido. O ano deve ter exatamente 4 dígitos.");
    setValue(`families[${familyIndex}].dataNascimentoResp`, "", { shouldValidate: true });
    setValue(`families[${familyIndex}].idadeResp`, "", { shouldValidate: true });
    return;
  }

  const hoje = new Date().toISOString().split("T")[0];

  if (dataNascimento > hoje) {
    alert("Data de nascimento não pode ser futura.");
    setValue(`families[${familyIndex}].dataNascimentoResp`, "", { shouldValidate: true });
    setValue(`families[${familyIndex}].idadeResp`, "", { shouldValidate: true });
    return;
  }

  const idade = calcularIdade(dataNascimento);
  setValue(`families[${familyIndex}].idadeResp`, idade, { shouldValidate: true });
}

