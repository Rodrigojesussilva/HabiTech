import { z } from "zod";
import { FormConfig, FormField } from "@/utils/formUtils";

// Form validation schema
export const docsSchema = z.object({
    paisOrigem: z.string().optional(),
    documentacao: z.string().optional(),
    numeroProtocolo: z.string().optional(),
    numeroRnm: z.string().optional(),
    statusRnm: z.string().optional(),
    dataExpedicaoRnm: z.string().optional(),
    numeroCrnm: z.string().optional(),
    statusCrnm: z.string().optional(),
    dataExpedicaoCrnm: z.string().optional(),
    numeroPassaporte: z.string().optional(),
    uf: z.string().optional(),
    dataExpedicaoPassaporte: z.string().optional(),
    cidade: z.string().optional(),
    possuiCIN: z.string().optional(),
    dataExpedicaoCIN: z.string().optional(),
    cin: z.string().optional(),
    rg: z.string().optional(),
    orgaoExpedidor: z.string().optional(),
    estadoEmissaoRg: z.string().optional(),
    dataExpedicaoRg: z.string().optional(),
    cpf: z.string().optional(),
    fonteCpf: z.string().optional(),
    arrolamento_id: z.string().optional(),
    idLocal: z.string().optional(),
    tempoExpedicao: z.object({
        anos: z.number(),
        meses: z.number()
    }).optional(),
    dataExpedicaoCpf: z.string().optional(),
    tempoExpedicaoCpf: z.object({
        anos: z.number(),
        meses: z.number()
    }).optional(),
});

export type FormValues = z.infer<typeof docsSchema>;

// Default values
export const defaultValues: Partial<FormValues> = {
    paisOrigem: "Brazil",
    documentacao: "",
    numeroProtocolo: "",
    numeroRnm: "",
    statusRnm: "",
    dataExpedicaoRnm: "",
    numeroCrnm: "",
    statusCrnm: "",
    dataExpedicaoCrnm: "",
    numeroPassaporte: "",
    dataExpedicaoPassaporte: "",
    uf: "",
    cidade: "",
    possuiCIN: "",
    cin:"",
    rg: "",
    orgaoExpedidor: "",
    estadoEmissaoRg: "",
    dataExpedicaoRg: "",
    cpf: "",
    fonteCpf: "",
    idLocal: "not",
    tempoExpedicao: { anos: 0, meses: 0 },
    dataExpedicaoCpf: "",
    tempoExpedicaoCpf: { anos: 0, meses: 0 },
};

// Base form structure (without conditional fields)
export const docsDefinition: FormConfig = {
    title: "Documentação",
    sections: [

        {
            id: "documentacaoPessoalResponsavel",
            title: "Documentação da Pessoa Responsável",
            fields: [
                {
                    name: "paisOrigem",
                    label: "País de Origem",
                    type: "combobox" as const,
                    required: true,
                    options: [
                        { label: "Brasil", value: "Brazil" },
                        { label: "Andorra", value: "Andorra" },
                        { label: "United Arab Emirates", value: "United Arab Emirates" },
                        { label: "Afghanistan", value: "Afghanistan" },
                        { label: "Antigua and Barbuda", value: "Antigua and Barbuda" },
                        { label: "Anguilla", value: "Anguilla" },
                        { label: "Albania", value: "Albania" },
                        { label: "Armenia", value: "Armenia" },
                        { label: "Angola", value: "Angola" },
                        { label: "Antarctica", value: "Antarctica" },
                        { label: "Argentina", value: "Argentina" },
                        { label: "American Samoa", value: "American Samoa" },
                        { label: "Austria", value: "Austria" },
                        { label: "Australia", value: "Australia" },
                        { label: "Aruba", value: "Aruba" },
                        { label: "Aland", value: "Aland" },
                        { label: "Azerbaijan", value: "Azerbaijan" },
                        { label: "Bosnia and Herzegovina", value: "Bosnia and Herzegovina" },
                        { label: "Barbados", value: "Barbados" },
                        { label: "Bangladesh", value: "Bangladesh" },
                        { label: "Belgium", value: "Belgium" },
                        { label: "Burkina Faso", value: "Burkina Faso" },
                        { label: "Bulgaria", value: "Bulgaria" },
                        { label: "Bahrain", value: "Bahrain" },
                        { label: "Burundi", value: "Burundi" },
                        { label: "Benin", value: "Benin" },
                        { label: "Saint Barthelemy", value: "Saint Barthelemy" },
                        { label: "Bermuda", value: "Bermuda" },
                        { label: "Brunei", value: "Brunei" },
                        { label: "Bolivia", value: "Bolivia" },
                        { label: "Bonaire", value: "Bonaire" },
                        { label: "Bahamas", value: "Bahamas" },
                        { label: "Bhutan", value: "Bhutan" },
                        { label: "Bouvet Island", value: "Bouvet Island" },
                        { label: "Botswana", value: "Botswana" },
                        { label: "Belarus", value: "Belarus" },
                        { label: "Belize", value: "Belize" },
                        { label: "Canada", value: "Canada" },
                        { label: "Cocos (Keeling) Islands", value: "Cocos (Keeling) Islands" },
                        { label: "Democratic Republic of the Congo", value: "Democratic Republic of the Congo" },
                        { label: "Central African Republic", value: "Central African Republic" },
                        { label: "Republic of the Congo", value: "Republic of the Congo" },
                        { label: "Switzerland", value: "Switzerland" },
                        { label: "Ivory Coast", value: "Ivory Coast" },
                        { label: "Cook Islands", value: "Cook Islands" },
                        { label: "Chile", value: "Chile" },
                        { label: "Cameroon", value: "Cameroon" },
                        { label: "China", value: "China" },
                        { label: "Colombia", value: "Colombia" },
                        { label: "Costa Rica", value: "Costa Rica" },
                        { label: "Cuba", value: "Cuba" },
                        { label: "Cape Verde", value: "Cape Verde" },
                        { label: "Curacao", value: "Curacao" },
                        { label: "Christmas Island", value: "Christmas Island" },
                        { label: "Cyprus", value: "Cyprus" },
                        { label: "Czech Republic", value: "Czech Republic" },
                        { label: "Germany", value: "Germany" },
                        { label: "Djibouti", value: "Djibouti" },
                        { label: "Denmark", value: "Denmark" },
                        { label: "Dominica", value: "Dominica" },
                        { label: "Dominican Republic", value: "Dominican Republic" },
                        { label: "Algeria", value: "Algeria" },
                        { label: "Ecuador", value: "Ecuador" },
                        { label: "Estonia", value: "Estonia" },
                        { label: "Egypt", value: "Egypt" },
                        { label: "Western Sahara", value: "Western Sahara" },
                        { label: "Eritrea", value: "Eritrea" },
                        { label: "Spain", value: "Spain" },
                        { label: "Ethiopia", value: "Ethiopia" },
                        { label: "Finland", value: "Finland" },
                        { label: "Fiji", value: "Fiji" },
                        { label: "Falkland Islands", value: "Falkland Islands" },
                        { label: "Micronesia", value: "Micronesia" },
                        { label: "Faroe Islands", value: "Faroe Islands" },
                        { label: "France", value: "France" },
                        { label: "Gabon", value: "Gabon" },
                        { label: "United Kingdom", value: "United Kingdom" },
                        { label: "Grenada", value: "Grenada" },
                        { label: "Georgia", value: "Georgia" },
                        { label: "French Guiana", value: "French Guiana" },
                        { label: "Guernsey", value: "Guernsey" },
                        { label: "Ghana", value: "Ghana" },
                        { label: "Gibraltar", value: "Gibraltar" },
                        { label: "Greenland", value: "Greenland" },
                        { label: "Gambia", value: "Gambia" },
                        { label: "Guinea", value: "Guinea" },
                        { label: "Guadeloupe", value: "Guadeloupe" },
                        { label: "Equatorial Guinea", value: "Equatorial Guinea" },
                        { label: "Greece", value: "Greece" },
                        { label: "South Georgia and the South Sandwich Islands", value: "South Georgia and the South Sandwich Islands" },
                        { label: "Guatemala", value: "Guatemala" },
                        { label: "Guam", value: "Guam" },
                        { label: "Guinea-Bissau", value: "Guinea-Bissau" },
                        { label: "Guyana", value: "Guyana" },
                        { label: "Hong Kong", value: "Hong Kong" },
                        { label: "Heard Island and McDonald Islands", value: "Heard Island and McDonald Islands" },
                        { label: "Honduras", value: "Honduras" },
                        { label: "Croatia", value: "Croatia" },
                        { label: "Haiti", value: "Haiti" },
                        { label: "Hungary", value: "Hungary" },
                        { label: "Indonesia", value: "Indonesia" },
                        { label: "Ireland", value: "Ireland" },
                        { label: "Israel", value: "Israel" },
                        { label: "Isle of Man", value: "Isle of Man" },
                        { label: "India", value: "India" },
                        { label: "British Indian Ocean Territory", value: "British Indian Ocean Territory" },
                        { label: "Iraq", value: "Iraq" },
                        { label: "Iran", value: "Iran" },
                        { label: "Iceland", value: "Iceland" },
                        { label: "Italy", value: "Italy" },
                        { label: "Jersey", value: "Jersey" },
                        { label: "Jamaica", value: "Jamaica" },
                        { label: "Jordan", value: "Jordan" },
                        { label: "Japan", value: "Japan" },
                        { label: "Kenya", value: "Kenya" },
                        { label: "Kyrgyzstan", value: "Kyrgyzstan" },
                        { label: "Cambodia", value: "Cambodia" },
                        { label: "Kiribati", value: "Kiribati" },
                        { label: "Comoros", value: "Comoros" },
                        { label: "Saint Kitts and Nevis", value: "Saint Kitts and Nevis" },
                        { label: "North Korea", value: "North Korea" },
                        { label: "South Korea", value: "South Korea" },
                        { label: "Kuwait", value: "Kuwait" },
                        { label: "Cayman Islands", value: "Cayman Islands" },
                        { label: "Kazakhstan", value: "Kazakhstan" },
                        { label: "Laos", value: "Laos" },
                        { label: "Lebanon", value: "Lebanon" },
                        { label: "Saint Lucia", value: "Saint Lucia" },
                        { label: "Liechtenstein", value: "Liechtenstein" },
                        { label: "Sri Lanka", value: "Sri Lanka" },
                        { label: "Liberia", value: "Liberia" },
                        { label: "Lesotho", value: "Lesotho" },
                        { label: "Lithuania", value: "Lithuania" },
                        { label: "Luxembourg", value: "Luxembourg" },
                        { label: "Latvia", value: "Latvia" },
                        { label: "Libya", value: "Libya" },
                        { label: "Morocco", value: "Morocco" },
                        { label: "Monaco", value: "Monaco" },
                        { label: "Moldova", value: "Moldova" },
                        { label: "Montenegro", value: "Montenegro" },
                        { label: "Saint Martin", value: "Saint Martin" },
                        { label: "Madagascar", value: "Madagascar" },
                        { label: "Marshall Islands", value: "Marshall Islands" },
                        { label: "North Macedonia", value: "North Macedonia" },
                        { label: "Mali", value: "Mali" },
                        { label: "Myanmar (Burma)", value: "Myanmar (Burma)" },
                        { label: "Mongolia", value: "Mongolia" },
                        { label: "Macao", value: "Macao" },
                        { label: "Northern Mariana Islands", value: "Northern Mariana Islands" },
                        { label: "Martinique", value: "Martinique" },
                        { label: "Mauritania", value: "Mauritania" },
                        { label: "Montserrat", value: "Montserrat" },
                        { label: "Malta", value: "Malta" },
                        { label: "Mauritius", value: "Mauritius" },
                        { label: "Maldives", value: "Maldives" },
                        { label: "Malawi", value: "Malawi" },
                        { label: "Mexico", value: "Mexico" },
                        { label: "Malaysia", value: "Malaysia" },
                        { label: "Mozambique", value: "Mozambique" },
                        { label: "Namibia", value: "Namibia" },
                        { label: "New Caledonia", value: "New Caledonia" },
                        { label: "Niger", value: "Niger" },
                        { label: "Norfolk Island", value: "Norfolk Island" },
                        { label: "Nigeria", value: "Nigeria" },
                        { label: "Nicaragua", value: "Nicaragua" },
                        { label: "Netherlands", value: "Netherlands" },
                        { label: "Norway", value: "Norway" },
                        { label: "Nepal", value: "Nepal" },
                        { label: "Nauru", value: "Nauru" },
                        { label: "Niue", value: "Niue" },
                        { label: "New Zealand", value: "New Zealand" },
                        { label: "Oman", value: "Oman" },
                        { label: "Panama", value: "Panama" },
                        { label: "Peru", value: "Peru" },
                        { label: "French Polynesia", value: "French Polynesia" },
                        { label: "Papua New Guinea", value: "Papua New Guinea" },
                        { label: "Philippines", value: "Philippines" },
                        { label: "Pakistan", value: "Pakistan" },
                        { label: "Poland", value: "Poland" },
                        { label: "Saint Pierre and Miquelon", value: "Saint Pierre and Miquelon" },
                        { label: "Pitcairn Islands", value: "Pitcairn Islands" },
                        { label: "Puerto Rico", value: "Puerto Rico" },
                        { label: "Palestine", value: "Palestine" },
                        { label: "Portugal", value: "Portugal" },
                        { label: "Palau", value: "Palau" },
                        { label: "Paraguay", value: "Paraguay" },
                        { label: "Qatar", value: "Qatar" },
                        { label: "Reunion", value: "Reunion" },
                        { label: "Romania", value: "Romania" },
                        { label: "Serbia", value: "Serbia" },
                        { label: "Russia", value: "Russia" },
                        { label: "Rwanda", value: "Rwanda" },
                        { label: "Saudi Arabia", value: "Saudi Arabia" },
                        { label: "Solomon Islands", value: "Solomon Islands" },
                        { label: "Seychelles", value: "Seychelles" },
                        { label: "Sudan", value: "Sudan" },
                        { label: "Sweden", value: "Sweden" },
                        { label: "Singapore", value: "Singapore" },
                        { label: "Saint Helena", value: "Saint Helena" },
                        { label: "Slovenia", value: "Slovenia" },
                        { label: "Svalbard and Jan Mayen", value: "Svalbard and Jan Mayen" },
                        { label: "Slovakia", value: "Slovakia" },
                        { label: "Sierra Leone", value: "Sierra Leone" },
                        { label: "San Marino", value: "San Marino" },
                        { label: "Senegal", value: "Senegal" },
                        { label: "Somalia", value: "Somalia" },
                        { label: "Suriname", value: "Suriname" },
                        { label: "South Sudan", value: "South Sudan" },
                        { label: "Sao Tome and Principe", value: "Sao Tome and Principe" },
                        { label: "El Salvador", value: "El Salvador" },
                        { label: "Sint Maarten", value: "Sint Maarten" },
                        { label: "Syria", value: "Syria" },
                        { label: "Eswatini", value: "Eswatini" },
                        { label: "Turks and Caicos Islands", value: "Turks and Caicos Islands" },
                        { label: "Chad", value: "Chad" },
                        { label: "French Southern Territories", value: "French Southern Territories" },
                        { label: "Togo", value: "Togo" },
                        { label: "Thailand", value: "Thailand" },
                        { label: "Tajikistan", value: "Tajikistan" },
                        { label: "Tokelau", value: "Tokelau" },
                        { label: "East Timor", value: "East Timor" },
                        { label: "Turkmenistan", value: "Turkmenistan" },
                        { label: "Tunisia", value: "Tunisia" },
                        { label: "Tonga", value: "Tonga" },
                        { label: "Turkey", value: "Turkey" },
                        { label: "Trinidad and Tobago", value: "Trinidad and Tobago" },
                        { label: "Tuvalu", value: "Tuvalu" },
                        { label: "Taiwan", value: "Taiwan" },
                        { label: "Tanzania", value: "Tanzania" },
                        { label: "Ukraine", value: "Ukraine" },
                        { label: "Uganda", value: "Uganda" },
                        { label: "U.S. Minor Outlying Islands", value: "U.S. Minor Outlying Islands" },
                        { label: "United States", value: "United States" },
                        { label: "Uruguay", value: "Uruguay" },
                        { label: "Uzbekistan", value: "Uzbekistan" },
                        { label: "Vatican City", value: "Vatican City" },
                        { label: "Saint Vincent and the Grenadines", value: "Saint Vincent and the Grenadines" },
                        { label: "Venezuela", value: "Venezuela" },
                        { label: "British Virgin Islands", value: "British Virgin Islands" },
                        { label: "U.S. Virgin Islands", value: "U.S. Virgin Islands" },
                        { label: "Vietnam", value: "Vietnam" },
                        { label: "Vanuatu", value: "Vanuatu" },
                        { label: "Wallis and Futuna", value: "Wallis and Futuna" },
                        { label: "Samoa", value: "Samoa" },
                        { label: "Kosovo", value: "Kosovo" },
                        { label: "Yemen", value: "Yemen" },
                        { label: "Mayotte", value: "Mayotte" },
                        { label: "South Africa", value: "South Africa" },
                        { label: "Zambia", value: "Zambia" },
                        { label: "Zimbabwe", value: "Zimbabwe" },
                    ],
                },
            ],
        },
    ]
};
/**
 * Get additional conditional fields based on form values for Docs form
 * This centralizes all conditional field logic specific to Docs in one place
 * @param formValues Current form values from Docs form
 */
export function getConditionalFields(formValues: Partial<FormValues>): FormField[] {
    const conditionalFields: FormField[] = [];

    // Conditionally add fields based on "paisOrigem" value
    if (formValues.paisOrigem === "Brazil") {
        console.log("Brazil");
        // Fields for Brazilian documents
        conditionalFields.push(
            {
                name: "uf",
                label: "Estado (UF)",
                type: "combobox" as const,
                required: true,
                options: [

                ],
            },
            {
                name: "cidade",
                label: "Cidade",
                type: "combobox" as const,
                required: true,
                options: [

                ]
            },
            {
                name: "possuiCIN",
                label: "Possui CIN?",
                type: "radio",
                required: true,
                options: [
                    { label: "Sim", value: "sim" },
                    { label: "Não", value: "nao" }
                ]
            }

        );
        if (formValues.possuiCIN === "sim") {
            conditionalFields.push(
                {
                    name: "cin",
                    label: "Número do CIN",
                    type: "text",
                    required: true
                },
                {
                    name: "dataExpedicaoCIN",
                    label: "Data expedição CIN",
                    type: "date",
                    required: true
                }

            );
        }
        else if (formValues.possuiCIN === "nao") {
            conditionalFields.push(
                {
                    name: "rg",
                    label: "Número do RG",
                    type: "text",
                    required: true
                },
                {
                    name: "orgaoExpedidor",
                    label: "Órgão Expedidor",
                    type: "text",
                    required: true
                },
                {
                    name: "estadoEmissaoRg",
                    label: "Estado de Emissão do RG",
                    type: "combobox",
                    required: true,
                    options: [
                    ]
                },
                {
                    name: "dataExpedicaoRg",
                    label: "Data de Expedição do RG",
                    type: "date",
                    required: true,
                    mask: "99/99/9999",
                    placeholder: "DD/MM/AAAA"
                },
                {
                    name: "cpf",
                    label: "CPF",
                    type: "text",
                    required: true,
                    mask: "999.999.999-99"
                },
                {
                    name: "fonteCpf",
                    label: "Fonte para CPF",
                    type: "radio",
                    required: true,
                    options: [
                        { label: "CNH", value: "CNH" },
                        { label: "RG", value: "RG" },
                        { label: "Receita Federal", value: "receita federal" },                        
                    ]
                }

            );
        }
    } else if (formValues.paisOrigem && formValues.paisOrigem !== "Brazil") {
        // Fields for immigrants
        conditionalFields.push({
            name: "documentacao",
            label: "Documentação",
            type: "radio",
            required: true,
            options: [
                { label: "Protocolo", value: "Protocolo" },
                { label: "RNM", value: "RNM" },
                { label: "CRNM", value: "CRNM" },
                { label: "Passaporte", value: "Passaporte" }
            ]
        });

        // Additional fields based on documentacao selection
        if (formValues.documentacao === "Protocolo") {
            conditionalFields.push(
                {
                    name: "numeroProtocolo",
                    label: "Número do Protocolo",
                    type: "text",
                    required: true
                }

            );
        } else if (formValues.documentacao === "RNM") {
            conditionalFields.push(
                {
                    name: "numeroRnm",
                    label: "Número do RNM",
                    type: "text",
                    required: true
                },
                {
                    name: "statusRnm",
                    label: "Status do RNM",
                    type: "radio",
                    required: true,
                    options: [
                        { label: "Válido", value: "Valido" },
                        { label: "Inválido", value: "Invalido" },
                        { label: "Pendente", value: "Pendente" }
                    ]
                },
                {
                    name: "dataExpedicaoRnm",
                    label: "Data de Expedição",
                    type: "date",
                    required: true
                },
            );
        } else if (formValues.documentacao === "CRNM") {
            conditionalFields.push(
                {
                    name: "numeroCrnm",
                    label: "Número do CRNM",
                    type: "text",
                    required: true
                },
                {
                    name: "statusCrnm",
                    label: "Status do CRNM",
                    type: "radio",
                    required: true,
                    options: [
                        { label: "Válido", value: "Valido" },
                        { label: "Inválido", value: "Invalido" },
                        { label: "Pendente", value: "Pendente" }
                    ]
                },
                {
                    name: "dataExpedicaoCrnm",
                    label: "Data de Expedição",
                    type: "date",
                    required: true
                },
            );
        }
        else if (formValues.documentacao === "Passaporte") {
            conditionalFields.push(
                {
                    name: "numeroPassaporte",
                    label: "Número do Passaporte",
                    type: "text",
                    required: true
                },
                {
                    name: "dataExpedicaoPassaporte",
                    label: "Data de Expedição",
                    type: "date",
                    required: true
                },
            );
        }
    }

    return conditionalFields;
}


/**
 * Get complete form sections with merged static and conditional fields
 * This centralizes the merging logic of base and conditional fields
 * @param formValues Current form values from Docs form
 * @returns Array of form sections with merged fields
 */
export function getMergedFormSections(formValues: Partial<FormValues>) {
    // Get conditional fields based on current form values
    const conditionalFields = getConditionalFields(formValues);
    console.log("Conditional Fields", conditionalFields);

    // Create and return a merged form structure with base fields and conditional fields
    return [
        {
            ...docsDefinition.sections[0],
            fields: [
                ...docsDefinition.sections[0].fields,
                ...conditionalFields
            ]
        }
    ];
} 