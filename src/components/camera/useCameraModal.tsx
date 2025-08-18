import { useState } from "react";
import CameraModal from "@/components/ui/CameraModal"; // seu componente já criado

export function useCameraModal() {
  const [campoAberto, setCampoAberto] = useState<string | null>(null);

  function abrirCamera(nomeCampo: string) {
    setCampoAberto(nomeCampo);
  }

  function fecharCamera() {
    setCampoAberto(null);
  }

  function onCapture(imagemBase64: string) {
    console.log("Imagem capturada para o campo:", campoAberto);
    console.log(imagemBase64);
    // Aqui você pode atualizar seu formulário com a imagem
    fecharCamera();
  }

  const modalCamera = campoAberto ? (
    <CameraModal onCapture={onCapture} onClose={fecharCamera} />
  ) : null;

  return {
    abrirCamera,
    modalCamera,
  };
}
