import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/selagem/definitions/anexos.definition";
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import Swal from 'sweetalert2';
import survey_resource from "@/service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL, SURVEY_RESOURCE_URL } from "@/service/constants"

interface AnexosFormProps {
  id?: string;
  sectionIndex?: number;
  familyIndex: number;
}

type AttachmentItem = {
  id: string
  filename: string
  mime?: string
  size?: number
  url?: string
  metadado?: Record<string, any>
}

const SECTION_KEY = 'anexos'

const AnexosForm = ({ sectionIndex: sectionNumber, familyIndex }: AnexosFormProps) => {
  const [open, setOpen] = useState(false)
  const form = useFormContext();
  const formValues = form.watch(`families[${familyIndex}]`) || {};
  const formSections = getMergedFormSections(formValues);

  const [attachmentsByField, setAttachmentsByField] = useState<Record<string, AttachmentItem[]>>({})
  const [loading, setLoading] = useState(false)

  const params = useParams<{ id: string }>()
  const routeSelagemId = params.id || ''
  const selagemIdLS = localStorage.getItem('selagemId') || ''
  // Busca robusta do token em múltiplas chaves
  const getAuthToken = (): string => {
    const keys = ['authToken', 'authorization_token', 'token', 'access_token', 'jwt', 'idToken']
    for (const k of keys) {
      const v = localStorage.getItem(k)
      if (v) return v
    }
    return ''
  }
  const authToken = getAuthToken()
  const createdBy = localStorage.getItem('userEmail') || ''

  const ensureIds = () => {
    // Prioriza o id da rota; se ausente, usa localStorage
    const currentSelagemId = routeSelagemId || localStorage.getItem('selagemId') || selagemIdLS
    const token = getAuthToken() || authToken
    return { currentSelagemId, token }
  }

  const localKey = (sid: string) => `selagem_attachments_${sid}`
  const saveLocalAttachment = (sid: string, field: string, item: AttachmentItem) => {
    try {
      const key = localKey(sid)
      const current = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, AttachmentItem[]>
      if (!current[field]) current[field] = []
      current[field].push(item)
      localStorage.setItem(key, JSON.stringify(current))
      console.log('[Anexos] Persistido localmente:', { key, field, item })
    } catch (e) {
      console.warn('[Anexos] Falha ao salvar localmente:', e)
    }
  }
  const loadFromLocal = (sid: string) => {
    try {
      const key = localKey(sid)
      const parsed = JSON.parse(localStorage.getItem(key) || '{}')
      if (parsed && typeof parsed === 'object') {
        setAttachmentsByField(parsed)
        console.log('[Anexos] Carregado anexos do localStorage:', { key, parsed })
      }
    } catch (e) {
      console.warn('[Anexos] Falha ao carregar do localStorage:', e)
    }
  }

  const loadAttachments = async () => {
    const { currentSelagemId, token } = ensureIds()
    if (!currentSelagemId) {
      console.warn('[Anexos] loadAttachments: selagemId ausente; pulando.')
      return
    }
    if (!token) {
      console.warn('[Anexos] loadAttachments: token ausente; usando fallback local.')
      loadFromLocal(currentSelagemId)
      return
    }
    try {
      setLoading(true)
      const response = await survey_resource.GetSelagemAttachments({ id: currentSelagemId, authorization_token: token, download_mode: 'metadata_only' as any }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
        const res = await fetch(url, { method: req.method, headers })
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      const list = (response as any)?.attachments || []
      const grouped: Record<string, AttachmentItem[]> = {}
      for (const f of list) {
        const meta = f.metadado || {}
        if (meta.section !== SECTION_KEY) continue
        const key = meta.field || 'outros'
        if (!grouped[key]) grouped[key] = []
        grouped[key].push({
          id: f.id,
          filename: f.filename || f.name || 'arquivo',
          mime: f.mime,
          size: f.size,
          url: f.url,
          metadado: meta,
        })
      }
      setAttachmentsByField(grouped)
    } catch (e) {
      console.error('[Anexos] Erro ao carregar anexos do backend, caindo para localStorage:', e)
      loadFromLocal(currentSelagemId)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAttachments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSelagemId])

  const handleUpload = async (file: File, fieldName: string) => {
    try {
      const { currentSelagemId, token } = ensureIds()
      console.log('[Anexos] handleUpload ids:', { currentSelagemId, tokenPresent: Boolean(token) })
      if (!currentSelagemId) {
        Swal.fire({ icon: 'error', title: 'Selagem não identificada', text: 'ID da selagem ausente. Salve metadados primeiro.' })
        return
      }
      const reader = new FileReader()
      const base64: string = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1] || '')
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const metadado = {
        survey_id: currentSelagemId,
        visit_count: form.getValues('visitNumber') || '',
        section: SECTION_KEY,
        family_index: familyIndex,
        field: fieldName,
        filename: file.name,
        mime: file.type,
        uploaded_by: createdBy,
        uploaded_at: new Date().toISOString(),
      }
      console.log('[Anexos] Enviando arquivo:', { fieldName, name: file.name, size: file.size, type: file.type, metadado })

      const uploaded = await survey_resource.SendFileToUpload(
        SURVEY_RESOURCE_URL,
        currentSelagemId,
        base64,
        metadado as any,
        token
      )

      // Atualiza UI local mesmo sem token (baseado na resposta ou fallback)
      try {
        const id = uploaded?.file?.id || uploaded?.id || `temp_${Date.now()}`
        const url = uploaded?.file?.url || uploaded?.url
        const newItem: AttachmentItem = { id, filename: file.name, mime: file.type, size: file.size, url, metadado }
        setAttachmentsByField(prev => {
          const next = { ...prev }
          if (!next[fieldName]) next[fieldName] = []
          next[fieldName] = [ ...(next[fieldName] || []), newItem ]
          return next
        })
        // Persistir localmente para carregamento futuro sem token
        saveLocalAttachment(currentSelagemId, fieldName, newItem)
      } catch (e) {
        console.warn('[Anexos] Não foi possível refletir resposta do upload na UI:', e)
      }

      if (token) {
        await loadAttachments()
      } else {
        console.warn('[Anexos] upload OK mas token ausente; não foi possível recarregar a lista de anexos.')
      }
      Swal.fire({ icon: 'success', title: 'Anexo enviado!', timer: 1200, showConfirmButton: false })
    } catch (e) {
      console.error('Erro no upload:', e)
      Swal.fire({ icon: 'error', title: 'Erro ao enviar anexo' })
    }
  }

  const handleRemove = async (attachmentId: string) => {
    try {
      const { currentSelagemId, token } = ensureIds()
      if (!currentSelagemId || !token) return
      await survey_resource.RemoveSelagemAttachment({ id: currentSelagemId, attachments: [attachmentId], authorization_token: token }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
        const res = await fetch(url, { method: req.method, headers, body: JSON.stringify(req.body || {}) })
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      await loadAttachments()
    } catch (e) {
      console.error('Erro ao remover anexo:', e)
    }
  }

  // REMOVIDO: upload no onChange. Vamos concentrar no botão abaixo
  // useEffect(() => { ... })

  const handleSendAll = async () => {
    try {
      console.log('[Anexos] Iniciando envio em lote...')
      const { currentSelagemId, token } = ensureIds()
      console.log('[Anexos] IDs:', { currentSelagemId, tokenPresent: Boolean(token) })
      if (!currentSelagemId) {
        Swal.fire({ icon: 'error', title: 'Selagem não identificada', text: 'ID da selagem ausente. Salve metadados primeiro.' })
        return
      }

      const fields = ['anexoSelo', 'anexoFachada', 'anexoMorador', 'anexoOutros']
      let sent = 0
      for (const fname of fields) {
        const value: any = form.getValues(`families[${familyIndex}].${fname}`)
        console.log(`[Anexos] Campo ${fname} valor:`, value)
        if (value && value instanceof File) {
          console.log(`[Anexos] Enviando arquivo de ${fname}:`, { name: value.name, size: value.size, type: value.type })
          await handleUpload(value, fname)
          sent++
        }
      }

      if (sent === 0) {
        Swal.fire({ icon: 'info', title: 'Nenhum arquivo selecionado', timer: 1200, showConfirmButton: false })
        return
      }

      if (token) await loadAttachments()
      Swal.fire({ icon: 'success', title: `Enviado(s) ${sent} arquivo(s)!`, timer: 1500, showConfirmButton: false })
    } catch (e) {
      console.error('[Anexos] Falha no envio em lote:', e)
      Swal.fire({ icon: 'error', title: 'Erro no envio dos anexos' })
    }
  }

  const renderAttachmentList = (fieldName: string) => {
    const items = attachmentsByField[fieldName] || []
    if (!items.length) return null
    return (
      <ul className="mt-2 space-y-1">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded border px-2 py-1 text-xs">
            <span className="truncate mr-2">{a.filename}</span>
            <span className="flex items-center gap-2">
              {a.url && (
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">abrir</a>
              )}
              <button type="button" className="text-red-600" onClick={() => handleRemove(a.id)}>remover</button>
            </span>
          </li>
        ))}
      </ul>
    )
  }


  return (
    <div className="text-left">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div className="section-header cursor-pointer bg-gray-100 p-2.5 mb-2.5 rounded-2xl">
            <h4 className="text-xl font-semibold mb-4" data-secao={formSections[0].title}>{`Seção ${sectionNumber ? sectionNumber + 1 : 1} - ${formSections[0].title}`}</h4>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {formSections.map((section, sectionIndex) => (
            <div key={section.id} className="mb-2">
              <FormSectionRenderer
                section={section}
                formControl={form.control}
                getFieldNumber={(_, fieldIndex) => `${sectionNumber ? sectionNumber + 1 : 1}.${fieldIndex + 1}`}
                sectionIndex={sectionIndex}
                formValues={formValues}
                showSectionLabel={false}
                familyIndex={familyIndex}
              />
              {/* listas por campo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <div className="text-xs font-medium text-gray-600">Anexos-Selo</div>
                  {renderAttachmentList('anexoSelo')}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">Anexos-Fachada</div>
                  {renderAttachmentList('anexoFachada')}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">Anexos-Morador</div>
                  {renderAttachmentList('anexoMorador')}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">Anexos-Outros</div>
                  {renderAttachmentList('anexoOutros')}
                </div>
              </div>

              <div className="mt-3">
                <button type="button" onClick={handleSendAll} className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition">
                  Enviar Anexos
                </button>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default AnexosForm; 