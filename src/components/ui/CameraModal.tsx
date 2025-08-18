import React, { useRef } from "react";
import Webcam from "react-webcam";

interface CameraModalProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000000cc",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        style={{ width: "100%", maxWidth: "400px" }}
      />
      <button onClick={capture} style={{ marginTop: 16 }}>Capturar</button>
      <button onClick={onClose} style={{ marginTop: 8 }}>Cancelar</button>
    </div>
  );
};

export default CameraModal;
