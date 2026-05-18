import { createContext, useContext, useState, ReactNode } from 'react';

interface CameraContextType {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: ReactNode }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsActive(true);
    } catch (err) {
      setError('Camera access denied or not available');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };

  return (
    <CameraContext.Provider value={{ stream, isActive, error, startCamera, stopCamera }}>
      {children}
    </CameraContext.Provider>
  );
}

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error('useCameraContext must be used within CameraProvider');
  return context;
};