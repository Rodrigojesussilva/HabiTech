import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMergedFormSections } from "@/components/forms/arrolamento/definitions/anexos.definition";
import Swal from 'sweetalert2';
import FormSectionRenderer from "@/components/formController/FormSectionRenderer";
import survey_resource from "@/service/survey_resource.api"
import { SURVEY_RESOURCE_BASE_URL, SURVEY_RESOURCE_URL } from "@/service/constants"
import useViewMode from '@/hooks/useViewMode'
import { useCameraModal } from "@/components/camera/useCameraModal";
import { useAtualizaOnClickBotao } from "@/components/camera/useAtualizaOnClickBotao";

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

  const isViewMode = useViewMode();
  const isCompletedNow = () => localStorage.getItem('arrolamentoCompleted') === 'true';

  const [open, setOpen] = useState(false)
  const form = useFormContext();
  const formValues = form.watch(`families[${familyIndex}]`) || {};
  const formSections = getMergedFormSections(formValues);

  const [attachmentsByField, setAttachmentsByField] = useState<Record<string, AttachmentItem[]>>({})
  const params = useParams<{ id: string }>()
  const routeArrolamentoId = params.id || ''
  const arrolamentoIdLS = localStorage.getItem('arrolamentoId') || ''
  // ... dentro do AnexosForm:
  const { abrirCamera } = useCameraModal();
  const camposComOnClick = useAtualizaOnClickBotao(
    formSections[0]?.fields || [],
    familyIndex,
    abrirCamera
  );
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
    const currentId = routeArrolamentoId || localStorage.getItem('arrolamentoId') || arrolamentoIdLS
    const token = getAuthToken() || authToken
    return { currentId, token }
  }

  const localKey = (sid: string) => `arrolamento_attachments_${sid}`

  const saveLocalAttachment = (sid: string, field: string, item: AttachmentItem) => {
    try {
      const key = localKey(sid)
      const current = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, AttachmentItem[]>
      if (!current[field]) current[field] = []
      current[field].push(item)
      localStorage.setItem(key, JSON.stringify(current))
      console.log('[Arrolamento][Anexos] Persistido localmente:', { key, field, item })
    } catch (e) {
      console.warn('[Arrolamento][Anexos] Falha ao salvar localmente:', e)
    }
  }
  const removeLocalAttachment = (sid: string, field: string, id: string) => {
    try {
      const key = localKey(sid)
      const current = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, AttachmentItem[]>
      if (current[field]) {
        current[field] = current[field].filter(a => a.id !== id)
        localStorage.setItem(key, JSON.stringify(current))
        console.log('[Arrolamento][Anexos] Removido localmente:', { key, field, id })
      }
    } catch (e) {
      console.warn('[Arrolamento][Anexos] Falha ao remover localmente:', e)
    }
  }
  const loadFromLocal = (sid: string) => {
    try {
      const key = localKey(sid)
      const parsed = JSON.parse(localStorage.getItem(key) || '{}')
      if (parsed && typeof parsed === 'object') {
        setAttachmentsByField(parsed)
        console.log('[Arrolamento][Anexos] Carregado anexos do localStorage:', { key, parsed })
      }
    } catch (e) {
      console.warn('[Arrolamento][Anexos] Falha ao carregar do localStorage:', e)
    }
  }

  const loadAttachments = async () => {
    const { currentId, token } = ensureIds()
    if (!currentId) {
      console.warn('[Arrolamento][Anexos] loadAttachments: id ausente; pulando.')
      return
    }
    if (!token) {
      console.warn('[Arrolamento][Anexos] loadAttachments: token ausente; usando fallback local.')
      loadFromLocal(currentId)
      return
    }
    try {
      // signed_url primeiro
      const response = await survey_resource.GetArrolamentoAttachments({ id: currentId, authorization_token: token, download_mode: 'signed_url' as any }, async (req: any) => {
        const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
        if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
        const res = await fetch(`${url}?download_mode=signed_url`, { method: req.method, headers })
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      const list = (response as any)?.attachments || []
      if (!Array.isArray(list) || list.length === 0) throw new Error('Empty signed_url response; fallback metadata_only')
      const grouped: Record<string, AttachmentItem[]> = {}
      for (const f of list) {
        const meta = f.metadado || {}
        if (meta.section !== SECTION_KEY) continue
        const key = meta.field || 'outros'
        if (!grouped[key]) grouped[key] = []
        grouped[key].push({ id: f.id, filename: f.filename || f.name || 'arquivo', mime: f.mime, size: f.size, url: f.url, metadado: meta })
      }
      setAttachmentsByField(grouped)
    } catch (e) {
      console.warn('[Arrolamento][Anexos] signed_url indisponível, fallback:', e)
      try {
        const { currentId, token } = ensureIds()
        if (!token) loadFromLocal(currentId)
        else {
          const response2 = await survey_resource.GetArrolamentoAttachments({ id: currentId, authorization_token: token, download_mode: 'metadata_only' as any }, async (req: any) => {
            const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
            if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
            const res = await fetch(`${url}?download_mode=metadata_only`, { method: req.method, headers })
            if (!res.ok) throw new Error(await res.text())
            return res.json()
          })
          const list2 = (response2 as any)?.attachments || []
          const grouped2: Record<string, AttachmentItem[]> = {}
          for (const f of list2) {
            const meta = f.metadado || {}
            if (meta.section !== SECTION_KEY) continue
            const key = meta.field || 'outros'
            if (!grouped2[key]) grouped2[key] = []
            grouped2[key].push({ id: f.id, filename: f.filename || f.name || 'arquivo', mime: f.mime, size: f.size, metadado: meta })
          }
          setAttachmentsByField(grouped2)
        }
      } catch (e2) {
        console.error('[Arrolamento][Anexos] Fallback metadata/local falhou:', e2)
        const { currentId } = ensureIds()
        loadFromLocal(currentId)
      }
    } finally {
    }
  }

  useEffect(() => { loadAttachments() }, [routeArrolamentoId])

  const handleUpload = async (file: File, fieldName: string) => {
    if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Anexos] Upload bloqueado: viewMode/completed'); return; }
    try {
      const { currentId, token } = ensureIds()
      console.log('[Arrolamento][Anexos] handleUpload ids:', { currentId, tokenPresent: Boolean(token) })
      if (!currentId) {
        Swal.fire({ icon: 'error', title: 'Arrolamento não identificado', text: 'ID do arrolamento ausente. Salve metadados primeiro.' })
        return
      }
      const reader = new FileReader()
      const base64: string = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1] || '')
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const metadado = {
        survey_id: currentId,
        visit_count: form.getValues('visitNumber') || '',
        section: SECTION_KEY,
        family_index: familyIndex,
        field: fieldName,
        filename: file.name,
        mime: file.type,
        uploaded_by: createdBy,
        uploaded_at: new Date().toISOString(),
      }
      console.log('[Arrolamento][Anexos] Enviando arquivo:', { fieldName, name: file.name, size: file.size, type: file.type, metadado })

      const uploaded = await survey_resource.SendFileToUpload(
        SURVEY_RESOURCE_URL,
        currentId,
        base64,
        metadado as any,
        token
      )

      try {
        const id = uploaded?.file?.id || uploaded?.id || `temp_${Date.now()}`
        const url = uploaded?.file?.url || uploaded?.url
        const dataUrl = `data:${file.type};base64,${base64}`
        const newItem: AttachmentItem = { id, filename: file.name, mime: file.type, size: file.size, url, dataUrl, metadado }
        setAttachmentsByField(prev => {
          const next = { ...prev }
          if (!next[fieldName]) next[fieldName] = []
          next[fieldName] = [...(next[fieldName] || []), newItem]
          return next
        })
        saveLocalAttachment(currentId, fieldName, newItem)
      } catch (e) {
        console.warn('[Arrolamento][Anexos] Não foi possível refletir resposta do upload na UI:', e)
      }

      if (token) await loadAttachments()
      else console.warn('[Arrolamento][Anexos] upload OK mas token ausente; não foi possível recarregar a lista de anexos.')
      Swal.fire({ icon: 'success', title: 'Anexo enviado!', timer: 1200, showConfirmButton: false })
    } catch (e) {
      console.error('[Arrolamento][Anexos] Erro no upload:', e)
      Swal.fire({ icon: 'error', title: 'Erro ao enviar anexo' })
    }
  }

  const handleRemove = async (attachmentId: string, fieldName: string) => {
    if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Anexos] Remove bloqueado: viewMode/completed'); return; }
    try {
      const { currentId, token } = ensureIds()
      if (!currentId) return
      if (token) {
        await survey_resource.RemoveArrolamentoAttachment({ id: currentId, attachments: [attachmentId], authorization_token: token }, async (req: any) => {
          const url = `${SURVEY_RESOURCE_BASE_URL}${req.path}`
          const headers: Record<string, string> = { 'Content-Type': 'application/json' }
          const tokenHeader = (req.headers && (req.headers as any)['authorization_token']) as string | undefined
          if (tokenHeader) headers['Authorization'] = `Bearer ${tokenHeader}`
          const res = await fetch(url, { method: req.method, headers, body: JSON.stringify(req.body || {}) })
          if (!res.ok) throw new Error(await res.text())
          return res.json()
        })
      }
      setAttachmentsByField(prev => {
        const next = { ...prev }
        next[fieldName] = (next[fieldName] || []).filter(a => a.id !== attachmentId)
        return next
      })
      removeLocalAttachment(currentId, fieldName, attachmentId)
    } catch (e) {
      console.error('[Arrolamento][Anexos] Erro ao remover anexo:', e)
    }
  }

  const openAttachment = async (fieldName: string, id: string) => {
    const items = attachmentsByField[fieldName] || []
    const a = items.find(x => x.id === id)
    if (!a) return
    const filename = a.metadado?.filename || a.filename || 'anexo'
    try {
      let blob: Blob | null = null
      if (a.url) {
        const res = await fetch(a.url)
        if (!res.ok) throw new Error(await res.text())
        blob = await res.blob()
      } else if (a.dataUrl) {
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
    } catch (e) {
      console.error('[Arrolamento][Anexos] Falha ao baixar anexo:', e)
      Swal.fire({ icon: 'error', title: 'Erro ao baixar anexo' })
    }
  }

  const renderAttachmentList = (fieldName: string) => {
    const items = attachmentsByField[fieldName] || []
    if (!items.length) return null
    return (
      <ul className="mt-2 space-y-1">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded border px-2 py-1 text-xs">
            <button type="button" className="truncate mr-2 text-blue-700 hover:underline text-left" onClick={() => openAttachment(fieldName, a.id)} title={a.filename}>{a.filename}</button>
            <span className="flex items-center gap-2">
              {!isViewMode && !isCompletedNow() && (
                <button type="button" className="text-red-600" onClick={() => handleRemove(a.id, fieldName)}>remover</button>
              )}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  const handleSendAll = async () => {
    if (isViewMode || isCompletedNow()) { console.log('[Arrolamento][Anexos] SendAll bloqueado: viewMode/completed'); return; }
    try {
      console.log('[Arrolamento][Anexos] Iniciando envio em lote...')
      const { currentId, token } = ensureIds()
      console.log('[Arrolamento][Anexos] IDs:', { currentId, tokenPresent: Boolean(token) })
      if (!currentId) {
        Swal.fire({ icon: 'error', title: 'Arrolamento não identificado', text: 'ID do arrolamento ausente. Salve metadados primeiro.' })
        return
      }

      const fields = ['anexoComprovanteRenda', 'anexoCarteiraTrabalho', 'anexoArea']
      let sent = 0
      for (const fname of fields) {
        const value: any = form.getValues(`families[${familyIndex}].${fname}`)
        console.log(`[Arrolamento][Anexos] Campo ${fname} valor:`, value)
        if (value && value instanceof File) {
          console.log(`[Arrolamento][Anexos] Enviando arquivo de ${fname}:`, { name: value.name, size: value.size, type: value.type })
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
      console.error('[Arrolamento][Anexos] Falha no envio em lote:', e)
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
                section={{ ...formSections[0], fields: camposComOnClick }}
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
                  <div className="text-xs font-medium text-gray-600">Comprovante de renda</div>
                  {renderAttachmentList('anexoComprovanteRenda')}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">Carteira de trabalho</div>
                  {renderAttachmentList('anexoCarteiraTrabalho')}
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600">Área</div>
                  {renderAttachmentList('anexoArea')}
                </div>
              </div>

              {!isViewMode && !isCompletedNow() && (
                <div className="mt-3">
                  <button type="button" onClick={handleSendAll} className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition">
                    Enviar Anexos
                  </button>
                </div>
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default AnexosForm; 