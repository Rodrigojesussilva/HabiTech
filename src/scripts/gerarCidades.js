/*
Salve esse script em scripts/gerarCidades.js

Antes, instale o node-fetch (para Node < 18):
npm install node-fetch@2

Crie a pasta src/components/forms/selagem se ainda não existir.

Execute:
node scripts/gerarCidades.js
*/

// scripts/gerarCidades.js
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

const ESTADOS_API = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

async function fetchEstados() {
  const res = await fetch(ESTADOS_API);
  if (!res.ok) throw new Error('Erro ao buscar estados');
  const data = await res.json();
  return data.map(e => e.sigla);
}

async function fetchCidades(uf) {
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao buscar cidades de ${uf}`);
  const data = await res.json();
  return data.map(c => ({ label: c.nome, value: c.nome }));
}

async function gerarArquivo() {
  try {
    const estados = await fetchEstados();
    const cidadesPorEstado = {};

    for (const uf of estados) {
      console.log(`Buscando cidades de ${uf}...`);
      const cidades = await fetchCidades(uf);
      cidadesPorEstado[uf] = cidades;
    }

    // Conteúdo do arquivo TS gerado
    const conteudo = `// Este arquivo é gerado automaticamente via script gerarCidades.js\n\nexport const cidadesLocais = ${JSON.stringify(cidadesPorEstado, null, 2)};\n`;

    // Use barras normais "/" ou barras duplas "\\" no caminho
    const caminhoArquivo = 'src/components/forms/selagem/estados.ts';

    writeFileSync(caminhoArquivo, conteudo, 'utf-8');
    console.log(`Arquivo ${caminhoArquivo} gerado com sucesso!`);
  } catch (error) {
    console.error('Erro:', error);
  }
}

gerarArquivo();
