import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CameraContextType {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  facingMode: 'user' | 'environment';
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  toggleCamera: () => Promise<void>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: ReactNode }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode,
        },
        audio: false,
      });
      setStream(mediaStream);
      setIsActive(true);
    } catch (err) {
      setError('Camera access denied or not available');
      setIsActive(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
  }, [stream]);

  const toggleCamera = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);

    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: nextMode },
        audio: false,
      });
      setFacingMode(nextMode);
      setStream(mediaStream);
      setIsActive(true);
    } catch (err) {
      setError('Camera access denied or not available');
    }
  }, [stream, facingMode]);

  return (
    <CameraContext.Provider value={{ stream, isActive, error, facingMode, startCamera, stopCamera, toggleCamera }}>
      {children}
    </CameraContext.Provider>
  );
}

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error('useCameraContext must be used within CameraProvider');
  return context;
};