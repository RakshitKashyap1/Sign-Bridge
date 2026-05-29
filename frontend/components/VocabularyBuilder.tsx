import { FC, useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, CameraOff, Circle, Square, Trash2, RefreshCw } from 'lucide-react';
import { useCameraContext } from '../hooks/useCamera';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const VocabularyBuilder: FC = () => {
  const { t } = useTranslation();
  const { stream, isActive, startCamera, stopCamera } = useCameraContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState('');
  const [recording, setRecording] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState<Blob[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gestures, setGestures] = useState<any[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchGestures();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const fetchGestures = async () => {
    try {
      const res = await axios.get(`${API_URL}/vocabulary/gestures`);
      setGestures(res.data.gestures);
    } catch {
      // backend not available
    }
  };

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) setCapturedFrames((prev) => [...prev, blob]);
    }, 'image/jpeg');
  }, []);

  const startRecording = () => {
    setCapturedFrames([]);
    setResult(null);
    setRecording(true);
    intervalRef.current = setInterval(captureFrame, 250);
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRecording(false);
  };

  const saveGesture = async () => {
    if (!label.trim() || capturedFrames.length === 0) return;
    setIsSaving(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('label', label.trim());
      capturedFrames.forEach((blob) => {
        formData.append('files', blob, 'frame.jpg');
      });

      const res = await axios.post(`${API_URL}/vocabulary/record-from-frames`, formData);
      setResult(res.data.message);
      setCapturedFrames([]);
      setLabel('');
      await fetchGestures();
    } catch {
      setResult('Failed to save gesture');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteGesture = async (gestureLabel: string) => {
    try {
      await axios.delete(`${API_URL}/vocabulary/gestures/${gestureLabel}`);
      await fetchGestures();
    } catch {
      // ignore
    }
  };

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
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
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
                {!recording ? (
                  <Button onClick={startRecording} size="lg">
                    <Circle className="w-5 h-5 mr-2 text-red-500" />
                    {t('startRecording')}
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="outline" size="lg">
                    <Square className="w-5 h-5 mr-2" />
                    {t('stopRecording')}
                  </Button>
                )}
              </>
            )}
          </div>

          {capturedFrames.length > 0 && (
            <p className="text-sm text-gray-500">
              {capturedFrames.length} frames captured
            </p>
          )}
        </div>
      </Card>

      {capturedFrames.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <label htmlFor="gesture-label" className="block text-lg font-medium">
              {t('gestureLabel')}
            </label>
            <input
              id="gesture-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t('gestureLabelPlaceholder')}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus-visible focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button onClick={saveGesture} size="lg" disabled={isSaving || !label.trim()}>
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('saveGesture')
              )}
            </Button>
            {result && (
              <p className="text-primary-600 font-medium">{result}</p>
            )}
          </div>
        </Card>
      )}

      {gestures.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">{t('savedGestures')}</h3>
          <ul className="space-y-2">
            {gestures.map((g) => (
              <li key={g.label} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{g.label}</span>
                  <span className="text-sm text-gray-500 ml-3">
                    ({g.num_frames} frames)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteGesture(g.label)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
