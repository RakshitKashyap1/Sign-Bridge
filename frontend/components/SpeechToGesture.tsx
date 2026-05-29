import { FC, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useTranslationContext } from '../hooks/useTranslation';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const SpeechToGesture: FC = () => {
  const { t, i18n } = useTranslation();
  const { translateSpeech, isLoading, error } = useTranslationContext();
  const [result, setResult] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
        const data = await translateSpeech(blob, lang);
        setResult(data);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      // permission denied or no mic
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg text-gray-600">{t('speechPrompt')}</p>
          <div className="flex space-x-4">
            {!recording ? (
              <Button onClick={startRecording} size="lg" disabled={isLoading}>
                <Mic className="w-5 h-5 mr-2" />
                {t('startRecording')}
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="outline" size="lg">
                <Square className="w-5 h-5 mr-2" />
                {t('stopRecording')}
              </Button>
            )}
          </div>
          {isLoading && (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-gray-500">{t('loading')}</span>
            </div>
          )}
        </div>
      </Card>

      {result && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">{t('speechResult')}</h3>
          <div className="space-y-4">
            {result.transcribed_text && (
              <div>
                <p className="text-sm text-gray-500">{t('transcribedText')}:</p>
                <p className="text-lg font-medium">{result.transcribed_text}</p>
              </div>
            )}
            {result.sign_sequence && result.sign_sequence.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">{t('signSequence')}:</p>
                <ul className="list-disc list-inside pl-4">
                  {result.sign_sequence.map((item: any, idx: number) => (
                    <li key={idx} className="py-1">
                      {item.word}
                      {item.sign_data ? (
                        <span className="text-primary-600 ml-2">✓</span>
                      ) : (
                        <span className="text-gray-400 ml-2">{t('noHandsDetected')}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.avatar_animations && result.avatar_animations.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">{t('avatarAnimations')}:</p>
                <div className="flex flex-wrap gap-2">
                  {result.avatar_animations.map((anim: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {anim}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.message && (
              <p className="text-yellow-600">{result.message}</p>
            )}
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}
    </div>
  );
};
