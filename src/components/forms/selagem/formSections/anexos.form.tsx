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
  dataUrl?: string
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
  console.log("[Selagem][Anexos] loading state:", loading);
  const params = useParams<{ id: string }>()
  const routeSelagemId = params.id || ''
  const selagemIdLS = localStorage.getItem('selagemId') || ''
  console.log('[Selagem][Anexos][Init] routeSelagemId:', routeSelagemId, 'selagemIdLS:', selagemIdLS, 'familyIndex:', familyIndex)
  // Busca robusta do token em múltiplas chaves
  const getAuthToken = (): string => {
    const keys = ['authToken', 'authorization_token', 'token', 'access_token', 'jwt', 'idToken']
    for (const k of keys) {
      const v = localStorage.getItem(k)
      if (v) {
        console.log('[Selagem][Anexos][Auth] token source:', k, 'length:', v.length)
        return v
      }
    }
    console.warn('[Selagem][Anexos][Auth] token not found in localStorage')
    return ''
  }
  const authToken = getAuthToken()
  const createdBy = localStorage.getItem('userEmail') || ''
  console.log('[Selagem][Anexos][Init] createdBy:', createdBy)

  const ensureIds = () => {
    // Prioriza o id da rota; se ausente, usa localStorage
    const currentSelagemId = routeSelagemId || localStorage.getItem('selagemId') || selagemIdLS
    const token = getAuthToken() || authToken
    console.log('[Selagem][Anexos][ensureIds] currentSelagemId:', currentSelagemId, 'tokenPresent:', Boolean(token))
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
      console.log('[Selagem][Anexos][Local][Save] key:', key, 'field:', field, 'item:', item)
    } catch (e) {
      console.warn('[Selagem][Anexos][Local][Save] failed:', e)
    }
  }

  const removeLocalAttachment = (sid: string, field: string, id: string) => {
    try {
      const key = localKey(sid)
      const current = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, AttachmentItem[]>
      if (current[field]) {
        current[field] = (current[field] || []).filter(a => a.id !== id)
        localStorage.setItem(key, JSON.stringify(current))
        console.log('[Selagem][Anexos][Local][Remove] key:', key, 'field:', field, 'id:', id)
      }
    } catch (e) {
      console.warn('[Selagem][Anexos][Local][Remove] failed:', e)
    }
  }

  const loadFromLocal = (sid: string) => {
    try {
      const key = localKey(sid)
      const parsed = JSON.parse(localStorage.getItem(key) || '{}')
      if (parsed && typeof parsed === 'object') {
        setAttachmentsByField(parsed)
        console.log('[Selagem][Anexos][Local][Load] key:', key, 'parsed:', parsed)
      }
    } catch (e) {
      console.warn('[Selagem][Anexos][Local][Load] failed:', e)
    }
  }

  const loadAttachments = async () => {
    const { currentSelagemId, token } = ensureIds()
    console.log('[Selagem][Anexos][Load] begin. id:', currentSelagemId, 'tokenPresent:', Boolean(token))
    if (!currentSelagemId) {
      console.warn('[Selagem][Anexos][Load] selagemId missing; skipping')
      return
    }
    /*if (!token) {
      console.warn('[Selagem][Anexos][Load] token missing; using local fallback')
      loadFromLocal(currentSelagemId)
      return
    }*/
    try {
      setLoading(true)
      // Primeira tentativa: pedir URLs assinadas
      const response = await survey_resource.GetSelagemAttachments({ id: currentSelagemId, authorization_token: token, download_mode: 'signed_url' as any }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
        console.log('[Selagem][Anexos][Load][HTTP] GET signed_url url:', `${url}?download_mode=signed_url`, 'headersAuth:', Boolean(headers['Authorization']))
        const res = await fetch(`${url}?download_mode=signed_url`, { method: req.method, headers })
        console.log('[Selagem][Anexos][Load][HTTP] GET signed_url status:', res.status)
        if (!res.ok) {
          const txt = await res.text()
          console.warn('[Selagem][Anexos][Load][HTTP] GET signed_url error:', res.status, txt)
          throw new Error(txt)
        }
        const json = await res.json()
        console.log('[Selagem][Anexos][Load][HTTP] GET signed_url ok, json:', json)
        console.log('[Selagem][Anexos][Load][HTTP] GET signed_url ok, attachments count:', Array.isArray((json as any)?.attachments) ? (json as any).attachments.length : 'n/a')
        return json
      })
      const list = (response as any)?.attachments || []
      console.log('[Selagem][Anexos][Load] signed_url attachments raw length:', list.length)
      if (!Array.isArray(list) || list.length === 0) {
        // Fallback: metadata_only
        throw new Error('Empty signed_url response; falling back to metadata_only')
      }
      const grouped: Record<string, AttachmentItem[]> = {}
      const parseMetadata = (m: unknown) => {
        if (!m) return {};
        if (typeof m === 'string') {
          try { return JSON.parse(m); } catch { return {}; }
        }
        return m as Record<string, any>;
      };
      for (const f of list) {
        console.log('[Selagem][Anexos][Load] map item raw:', f);
        const meta = parseMetadata(f.metadata.metadata || f.metadado || {})
        const fieldKey = meta.field || 'outros'
        const filename = meta.filename || f.name || 'arquivo'
        const mime = f.mime_type || f.mime
        const size = f.size
        console.log('[Selagem][Anexos][Load] map item:', { id: f.id, filename, section: meta.section, field: fieldKey, hasUrl: Boolean(f.url) })
        //if (meta.section !== SECTION_KEY) continue
        if (!grouped[fieldKey]) grouped[fieldKey] = []
        grouped[fieldKey].push({
          id: f.id,
          filename,
          mime,
          size,
          url: f.metadata.download_link,
          metadado: meta,
        })
      }
      console.log('[Selagem][Anexos][Load] grouped keys:', Object.keys(grouped))
      setAttachmentsByField(grouped)
    } catch (e) {
      console.warn('[Selagem][Anexos][Load] signed_url unavailable, fallback metadata_only. reason:', e)
      try {
        const { currentSelagemId, token } = ensureIds()
        if (!token) {
          console.log('[Selagem][Anexos][Load] token still missing; local fallback')
          loadFromLocal(currentSelagemId)
        } else {
          const response2 = await survey_resource.GetSelagemAttachments({ id: currentSelagemId, authorization_token: token, download_mode: 'metadata_only' as any }, async (req: any) => {
            const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
            if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
            console.log('[Selagem][Anexos][Load][HTTP] GET metadata_only url:', `${url}?download_mode=metadata_only`, 'headersAuth:', Boolean(headers['Authorization']))
            const res = await fetch(`${url}?download_mode=metadata_only`, { method: req.method, headers })
            console.log('[Selagem][Anexos][Load][HTTP] GET metadata_only status:', res.status)
            if (!res.ok) {
              const txt = await res.text()
              console.warn('[Selagem][Anexos][Load][HTTP] GET metadata_only error:', res.status, txt)
              throw new Error(txt)
            }
            const json = await res.json()
            console.log('[Selagem][Anexos][Load][HTTP] GET metadata_only ok, attachments count:', Array.isArray((json as any)?.attachments) ? (json as any).attachments.length : 'n/a')
            return json
          })
          const list2 = (response2 as any)?.attachments || []
          console.log('[Selagem][Anexos][Load] metadata_only attachments raw length:', list2.length)
          const grouped2: Record<string, AttachmentItem[]> = {}
          for (const f of list2) {
            const meta = f.metadata || f.metadado || {}
            const fieldKey = meta.field || 'outros'
            const filename = f.name || f.filename || 'arquivo'
            const mime = f.mime_type || f.mime
            const size = f.size
            console.log('[Selagem][Anexos][Load] map item (metadata_only):', { id: f.id, filename, section: meta.section, field: fieldKey })
            if (meta.section !== SECTION_KEY) continue
            if (!grouped2[fieldKey]) grouped2[fieldKey] = []
            grouped2[fieldKey].push({
              id: f.id,
              filename,
              mime,
              size,
              url: undefined,
              metadado: meta,
            })
          }
          console.log('[Selagem][Anexos][Load] grouped2 keys:', Object.keys(grouped2))
          setAttachmentsByField(grouped2)
        }
      } catch (e2) {
        console.error('[Selagem][Anexos][Load] metadata/local fallback failed:', e2)
        // const { currentSelagemId } = ensureIds()
        //loadFromLocal(currentSelagemId)
      }
    } finally {
      setLoading(false)
      console.log('[Selagem][Anexos][Load] end. loading=false')
    }
  }

  useEffect(() => {
    console.log('[Selagem][Anexos][Effect] routeSelagemId changed:', routeSelagemId)
    loadAttachments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSelagemId])

  useEffect(() => {
    console.log('[Selagem][Anexos][Effect] open changed:', open)
    if (open) {
      loadAttachments()
    }
  }, [open])

  const handleUpload = async (file: File, fieldName: string) => {
    try {
      const { currentSelagemId, token } = ensureIds()
      console.log('[Selagem][Anexos][Upload] ids:', { currentSelagemId, tokenPresent: Boolean(token) })
      if (!currentSelagemId) {
        Swal.fire({ icon: 'error', title: 'Selagem não identificada', text: 'ID da selagem ausente. Salve metadados primeiro.' })
        return
      }
      console.log('[Selagem][Anexos][Upload] file:', { name: file.name, size: file.size, type: file.type })
      // FileReader opcional: gerar dataUrl apenas para preview/offline
      const reader = new FileReader()
      const previewDataUrl: string = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
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
      console.log('[Selagem][Anexos][Upload] metadado:', metadado)

      // Envia via multipart (v2), sem Authorization
      const uploaded = await survey_resource.SendFileToUploadV2Multipart(
        SURVEY_RESOURCE_URL,
        currentSelagemId,
        file,
        metadado as any,
      )
      console.log('[Selagem][Anexos][Upload] response:', uploaded)

      // Atualiza UI local mesmo sem token (baseado na resposta ou fallback)
      try {
        const id = uploaded?.file?.id || uploaded?.id || `temp_${Date.now()}`
        const url = uploaded?.file?.url || uploaded?.url
        const newItem: AttachmentItem = { id, filename: file.name, mime: file.type, size: file.size, url, dataUrl: previewDataUrl, metadado }
        setAttachmentsByField(prev => {
          const next = { ...prev }
          if (!next[fieldName]) next[fieldName] = []
          next[fieldName] = [...(next[fieldName] || []), newItem]
          return next
        })
        console.log('[Selagem][Anexos][Upload] UI updated for field:', fieldName, 'id:', id, 'hasUrl:', Boolean(url))
        // Persistir localmente para carregamento futuro sem token
        //saveLocalAttachment(currentSelagemId, fieldName, newItem)
      } catch (e) {
        console.warn('[Selagem][Anexos][Upload] could not reflect response in UI:', e)
      }

      if (token) {
        await loadAttachments()
      } else {
        console.warn('[Selagem][Anexos][Upload] upload OK but token missing; could not reload list.')
      }
      Swal.fire({ icon: 'success', title: 'Anexo enviado!', timer: 1200, showConfirmButton: false })
    } catch (e) {
      console.error('[Selagem][Anexos][Upload] error:', e)
      Swal.fire({ icon: 'error', title: 'Erro ao enviar anexo' })
    }
  }

  const handleRemove = async (attachmentId: string, fieldName: string) => {
    try {
      const { currentSelagemId, token } = ensureIds()
      console.log('[Selagem][Anexos][Remove] id:', attachmentId, 'field:', fieldName, 'selagemId:', currentSelagemId, 'tokenPresent:', Boolean(token))
      if (!currentSelagemId) return
      //if (token) {
      await survey_resource.RemoveSelagemAttachment({ id: currentSelagemId, attachments: [attachmentId], authorization_token: token }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
        console.log('[Selagem][Anexos][Remove][HTTP] POST url:', url, 'headersAuth:', Boolean(headers['Authorization']))
        const res = await fetch(url, { method: req.method, headers, body: JSON.stringify(req.body || {}) })
        console.log('[Selagem][Anexos][Remove][HTTP] status:', res.status)
        if (!res.ok) {
          const txt = await res.text()
          console.warn('[Selagem][Anexos][Remove][HTTP] error:', res.status, txt)
          throw new Error(txt)
        }
        return res.json()
      })
      //}
      // Remoção local e atualização de estado
      setAttachmentsByField(prev => {
        const next = { ...prev }
        next[fieldName] = (next[fieldName] || []).filter(a => a.id !== attachmentId)
        return next
      })
      removeLocalAttachment(currentSelagemId, fieldName, attachmentId)
      console.log('[Selagem][Anexos][Remove] removed locally:', attachmentId)
    } catch (e) {
      console.error('[Selagem][Anexos][Remove] error:', e)
    }
  }

  const openAttachment = async (fieldName: string, id: string) => {
    const items = attachmentsByField[fieldName] || []
    const a = items.find(x => x.id === id)
    console.log('[Selagem][Anexos][Open] field:', fieldName, 'id:', id, 'found:', Boolean(a))
    if (!a) return
    const filename = a.metadado?.filename || a.filename || 'anexo'
    console.log('[Selagem][Anexos][Open] filename:', filename)
    try {
      let blob: Blob | null = null
      console.log('[Selagem][Anexos][Open] a:', a)
      if (a.url) {
        console.log('[Selagem][Anexos][Open] fetching signed URL')
        const res = await fetch(a.url)
        console.log('[Selagem][Anexos][Open] fetch status:', res.status)
        if (!res.ok) throw new Error(await res.text())
        blob = await res.blob()
      } else if (a.dataUrl) {
        console.log('[Selagem][Anexos][Open] using dataUrl')
        const resp = await fetch(a.dataUrl)
        blob = await resp.blob()
      }
      if (!blob) throw new Error('Sem dados para download')
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
      console.log('[Selagem][Anexos][Open] download triggered for:', filename)
    } catch (e) {
      console.error('[Selagem][Anexos] Falha ao baixar anexo:', e)
      Swal.fire({ icon: 'error', title: 'Erro ao baixar anexo' })
    }
  }

  const renderAttachmentList = (fieldName: string) => {
    const items = attachmentsByField[fieldName] || []
    console.log('[Selagem][Anexos][RenderList] field:', fieldName, 'count:', items.length)
    if (!items.length) return null
    return (
      <ul className="mt-2 space-y-1">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded border px-2 py-1 text-xs">
            <button type="button" className="truncate mr-2 text-blue-700 hover:underline text-left" onClick={() => openAttachment(fieldName, a.id)} title={a.filename}>{a.filename}</button>
            <span className="flex items-center gap-2">
              <button type="button" className="text-red-600" onClick={() => handleRemove(a.id, fieldName)}>remover</button>
            </span>
          </li>
        ))}
      </ul>
    )
  }

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
              <div className="grid grid-cols-1 gap-2">
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