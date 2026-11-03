import axios from "axios"

export type CepAddress = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

type BrasilApiAddress = {
  cep?: string
  street?: string
  neighborhood?: string
  city?: string
  state?: string
}

type ViaCepAddress = {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

const requestOptions = { timeout: 8_000 }
const cepCacheKey = "habitech-cep-cache:v1"
const CEP_NOT_FOUND_MESSAGE = "CEP inválido ou não encontrado. Confira os 8 dígitos e tente novamente."

function readCachedAddress(cep: string): CepAddress | undefined {
  try {
    const cache = JSON.parse(localStorage.getItem(cepCacheKey) || "{}") as Record<string, CepAddress>
    const address = cache[cep]
    return address && typeof address.logradouro === "string" ? address : undefined
  } catch {
    return undefined
  }
}

function cacheAddress(address: CepAddress): void {
  try {
    const cache = JSON.parse(localStorage.getItem(cepCacheKey) || "{}") as Record<string, CepAddress>
    cache[address.cep.replace(/\D/g, "")] = address
    localStorage.setItem(cepCacheKey, JSON.stringify(cache))
  } catch {
    // A consulta continua funcionando mesmo se o armazenamento local estiver cheio.
  }
}

/** Consulta CEP diretamente do navegador; não depende da API C# local. */
export async function buscarEnderecoPorCep(cep: string): Promise<CepAddress> {
  const cepLimpo = cep.replace(/\D/g, "")
  if (!/^\d{8}$/.test(cepLimpo)) {
    throw new Error("Informe um CEP com 8 dígitos.")
  }
  const cachedAddress = readCachedAddress(cepLimpo)
  if (!navigator.onLine && cachedAddress) return cachedAddress

  try {
    const { data } = await axios.get<BrasilApiAddress>(
      `https://brasilapi.com.br/api/cep/v1/${cepLimpo}`,
      requestOptions,
    )
    const address = {
      cep: data.cep ?? cepLimpo,
      logradouro: data.street ?? "",
      complemento: "",
      bairro: data.neighborhood ?? "",
      cidade: data.city ?? "",
      uf: data.state ?? "",
    }
    cacheAddress(address)
    return address
  } catch (brasilApiError) {
    try {
      const { data } = await axios.get<ViaCepAddress>(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
        requestOptions,
      )
      if (data.erro) throw new Error(CEP_NOT_FOUND_MESSAGE)
      const address = {
        cep: data.cep ?? cepLimpo,
        logradouro: data.logradouro ?? "",
        complemento: data.complemento ?? "",
        bairro: data.bairro ?? "",
        cidade: data.localidade ?? "",
        uf: data.uf ?? "",
      }
      cacheAddress(address)
      return address
    } catch (viaCepError) {
      if (cachedAddress) return cachedAddress
      // ViaCEP responde HTTP 200 com { erro: true } para CEP inexistente.
      // Preserve essa informação em vez de classificá-la como falha de conexão.
      if (viaCepError instanceof Error && viaCepError.message === CEP_NOT_FOUND_MESSAGE) {
        throw viaCepError
      }
      if (axios.isAxiosError(viaCepError) && viaCepError.response?.status === 400) {
        throw new Error(CEP_NOT_FOUND_MESSAGE)
      }
      if (axios.isAxiosError(brasilApiError) && brasilApiError.response?.status === 404
        && axios.isAxiosError(viaCepError) && viaCepError.response?.status === 404) {
        throw new Error(CEP_NOT_FOUND_MESSAGE)
      }
      throw new Error("Não foi possível consultar o CEP. Verifique sua conexão e tente novamente.")
    }
  }
}
