import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCameraContext } from '../hooks/useCamera';
import { useTranslationContext } from '../hooks/useTranslation';
import { useWebSocket } from '../hooks/useWebSocket';
import { useHistory } from '../hooks/useHistory';
import { Avatar3D } from './Avatar3D';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Camera, CameraOff, Send, Loader2, RotateCw } from 'lucide-react';
import type { WsPrediction } from '../hooks/useWebSocket';

interface ChatMessage {
  id: string;
  role: 'signer' | 'typer';
  text: string;
  timestamp: number;
}

export function ConversationMode() {
  const { t, i18n } = useTranslation();
  const { stream, isActive, startCamera, stopCamera, toggleCamera, facingMode } = useCameraContext();
  const { translateText, isLoading } = useTranslationContext();
  const { connected, connect, disconnect, sendFrame, subscribe } = useWebSocket();
  const { addEntry } = useHistory();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState<WsPrediction | null>(null);
  const [animNames, setAnimNames] = useState<string[]>([]);

  useEffect(() => {
    return subscribe((p) => setPrediction(p));
  }, [subscribe]);

  useEffect(() => {
    if (prediction?.text) {
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'signer',
        text: prediction.text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
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

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const captureLoop = useCallback((time: number) => {
    rafRef.current = requestAnimationFrame(captureLoop);
    if (time - lastFrameRef.current < 200) return;
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
  }, [sendFrame]);

  const handleCameraStart = async () => {
    await startCamera();
    connect();
    rafRef.current = requestAnimationFrame(captureLoop);
  };

  const handleCameraStop = () => {
    cancelAnimationFrame(rafRef.current);
    disconnect();
    stopCamera();
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const lang = i18n.language === 'hi' ? 'hi' : 'en';
    const data = await translateText(inputText, lang);
    if (data) {
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'typer',
        text: inputText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
      addEntry({
        type: 'text_to_gesture',
        input: inputText,
        output: `${data.sign_sequence?.length || 0} signs mapped`,
        details: data.avatar_animations?.join(', ') || undefined,
      });
      if (data.avatar_animations?.length > 0) {
        setAnimNames(data.avatar_animations);
      }
    }
    setInputText('');
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      disconnect();
    };
  }, [disconnect]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">✋ Sign</h3>
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-3">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                <p className="text-white text-sm">{t('startCamera')}</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {!isActive ? (
              <Button onClick={handleCameraStart} size="sm">
                <Camera className="w-4 h-4 mr-1" />
                {t('startCamera')}
              </Button>
            ) : (
              <>
                <Button onClick={handleCameraStop} variant="outline" size="sm">
                  <CameraOff className="w-4 h-4 mr-1" />
                  {t('stopCamera')}
                </Button>
                <Button onClick={toggleCamera} variant="outline" size="sm">
                  <RotateCw className="w-4 h-4 mr-1" />
                  {facingMode === 'user' ? t('front') : t('back')}
                </Button>
              </>
            )}
          </div>
          {connected && (
            <p className="text-center text-xs text-green-600 font-medium mt-2">● {t('live')}</p>
          )}
          {prediction?.text && (
            <p className="text-center text-lg font-bold text-primary-700 mt-2">{prediction.text}</p>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">📝 Type</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('enterText')}
            className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none mb-3"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button onClick={handleSend} size="sm" disabled={isLoading || !inputText.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
            {t('translate')}
          </Button>
          {animNames.length > 0 && (
            <div className="mt-3">
              <Avatar3D animationNames={animNames} />
            </div>
          )}
        </Card>
      </div>

      <div className="p-4 max-h-64 overflow-y-auto bg-white rounded-lg shadow border border-gray-200" ref={chatRef}>
        <h3 className="text-lg font-semibold mb-3">{t('history')}</h3>
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">{t('speechPrompt')}</p>
        )}
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'signer' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  msg.role === 'signer'
                    ? 'bg-primary-100 text-primary-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <span className="text-xs font-medium block mb-1 opacity-60">
                  {msg.role === 'signer' ? '✋' : '📝'}
                </span>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
