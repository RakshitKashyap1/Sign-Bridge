import { FC, useRef, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { useCameraContext } from '../hooks/useCamera';
import { useTranslationContext } from '../hooks/useTranslation';
import { useHistory } from '../hooks/useHistory';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const GestureToText: FC = () => {
  const { t } = useTranslation();
  const { stream, isActive, error: cameraError, startCamera, stopCamera } = useCameraContext();
  const { result, isLoading, error, translateGesture } = useTranslationContext();
  const { addEntry } = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [demoMode, setDemoMode] = useState(false);
  const prevResultRef = useRef(result);

  useEffect(() => {
    if (result && result !== prevResultRef.current) {
      prevResultRef.current = result;
      if (result.text) {
        addEntry({
          type: 'gesture_to_text',
          input: result.gesture || 'unknown',
          output: result.text,
          confidence: result.confidence,
        });
      }
    }
  }, [result, addEntry]);

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' });
            await translateGesture(file);
          }
        }, 'image/jpeg');
      }
    }
  }, [translateGesture]);

  if (videoRef.current && stream) {
    videoRef.current.srcObject = stream;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {!isActive ? (
            <div className="w-full max-w-md aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">{t('startCamera')}</p>
            </div>
          ) : (
            <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
          
          <div className="flex space-x-4">
            {!isActive ? (
              <Button onClick={startCamera} size="lg">
                <Camera className="w-5 h-5 mr-2" />
                {t('startCamera')}
              </Button>
            ) : (
              <>
                <Button onClick={stopCamera} variant="outline" size="lg">
                  <CameraOff className="w-5 h-5 mr-2" />
                  {t('stopCamera')}
                </Button>
                <Button onClick={captureFrame} size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : null}
                  {t('translate')}
                </Button>
              </>
            )}
          </div>
          
          {cameraError && (
            <p className="text-red-500 text-center">{cameraError}</p>
          )}
        </div>
      </Card>
      
      {result && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">{t('translatedText')}</h3>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-primary-700">{result.text || t('noHandsDetected')}</p>
            {result.confidence > 0 && (
              <p className="text-sm text-gray-600">
                {t('confidence')}: {(result.confidence * 100).toFixed(1)}%
              </p>
            )}
            {result.audio_base64 && (
              <audio controls src={`data:audio/mp3;base64,${result.audio_base64}`} />
            )}
          </div>
        </Card>
      )}
      
      {error && (
        <Card className="p-4 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}
      
      {demoMode && (
        <Card className="p-4 bg-blue-50">
          <p className="text-blue-600">{t('demoMode')}: Using pre-recorded assets</p>
        </Card>
      )}
    </div>
  );
};