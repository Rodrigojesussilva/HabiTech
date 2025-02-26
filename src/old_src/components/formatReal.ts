export const formatCurrency = (value: string) => {
    // Remove todos os caracteres que não sejam números
    const onlyNumbers = value.replace(/\D/g, "");
    // Formata o número como R$
    const formattedValue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(parseFloat(onlyNumbers) / 100);

    return formattedValue;
};