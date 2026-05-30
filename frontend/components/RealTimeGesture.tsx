import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCameraContext } from '../hooks/useCamera';
import { useWebSocket } from '../hooks/useWebSocket';
import { useHistory } from '../hooks/useHistory';
import { Button } from './ui/Button';
import { Camera, CameraOff, RotateCw } from 'lucide-react';
import type { WsPrediction } from '../hooks/useWebSocket';

export function RealTimeGesture() {
  const { t } = useTranslation();
  const { stream, isActive, startCamera, stopCamera, toggleCamera, facingMode } = useCameraContext();
  const { connected, connect, disconnect, sendFrame, subscribe } = useWebSocket();
  const { addEntry } = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const FPS = 5;
  const interval = 1000 / FPS;
  const [prediction, setPrediction] = useState<WsPrediction | null>(null);

  useEffect(() => {
    const unsub = subscribe((p) => setPrediction(p));
    return unsub;
  }, [subscribe]);

  useEffect(() => {
    if (prediction?.text) {
      addEntry({
        type: 'gesture_to_text',
        input: prediction.gesture || 'unknown',
        output: prediction.text,
        confidence: prediction.confidence,
      });
    }
  }, [prediction, addEntry]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const captureLoop = useCallback((time: number) => {
    rafRef.current = requestAnimationFrame(captureLoop);
    if (time - lastFrameRef.current < interval) return;
    lastFrameRef.current = time;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) sendFrame(blob);
    }, 'image/jpeg', 0.7);
  }, [sendFrame, interval]);

  const handleStart = async () => {
    await startCamera();
    connect();
    rafRef.current = requestAnimationFrame(captureLoop);
  };

  const handleStop = () => {
    cancelAnimationFrame(rafRef.current);
    disconnect();
    stopCamera();
    setPrediction(null);
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      disconnect();
    };
  }, [disconnect]);

  return (
    <div className="space-y-6">
      <div className="relative bg-black rounded-lg overflow-hidden max-w-xl mx-auto">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
        />
        <canvas ref={canvasRef} className="hidden" />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <p className="text-white text-lg">{t('startCamera')}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {!isActive ? (
          <Button onClick={handleStart} size="lg">
            <Camera className="w-5 h-5 mr-2" />
            {t('startCamera')}
          </Button>
        ) : (
          <>
            <Button onClick={handleStop} variant="outline" size="lg">
              <CameraOff className="w-5 h-5 mr-2" />
              {t('stopCamera')}
            </Button>
            <Button onClick={toggleCamera} variant="outline" size="lg" title={t('switchCamera')}>
              <RotateCw className="w-5 h-5 mr-2" />
              {facingMode === 'user' ? t('front') : t('back')}
            </Button>
          </>
        )}
      </div>

      {connected && (
        <div className="text-center text-sm text-green-600 font-medium">
          ● {t('live')}
        </div>
      )}

      {prediction && prediction.text && (
        <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-2xl font-bold text-center text-primary-700">{prediction.text}</p>
          {prediction.confidence > 0 && (
            <p className="text-sm text-gray-500 text-center mt-1">
              {t('confidence')}: {(prediction.confidence * 100).toFixed(1)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}
