import Cleave from 'cleave.js';

const applyCleaveMask = (familyIndex: number) => {
    const input = document.querySelector(
        `input[name="families[${familyIndex}].criancas0a3"]`
    ) as HTMLInputElement | null;

    if (input && !input.dataset.cleaveAttached) {
        // Aplicando a máscara de número
        new Cleave(input, {
            numeral: true, // Ativa a máscara numérica
            numeralThousandsGroupStyle: 'thousand', // Separador de milhar
            numeralDecimalMark: ',', // Marca decimal, se necessário
            delimiter: '.', // Separador de milhar
        });
        input.dataset.cleaveAttached = "true"; // Garantir que a máscara só seja aplicada uma vez
    }
};

export default applyCleaveMask;