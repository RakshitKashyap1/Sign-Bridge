import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Loader2 } from 'lucide-react';
import { useTranslationContext } from '../hooks/useTranslation';
import { useHistory } from '../hooks/useHistory';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Avatar3D } from './Avatar3D';
import type { TextTranslationResult } from '../lib/types';

export const TextToGesture: FC = () => {
  const { t, i18n } = useTranslation();
  const { translateText, isLoading, error } = useTranslationContext();
  const { addEntry } = useHistory();
  const [text, setText] = useState('');
  const [result, setResult] = useState<TextTranslationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const lang = i18n.language === 'hi' ? 'hi' : 'en';
    const data = await translateText(text, lang);
    if (data) {
      setResult(data);
      const anims = data.avatar_animations?.join(', ') || '';
      addEntry({
        type: 'text_to_gesture',
        input: text,
        output: `${data.sign_sequence?.length || 0} signs mapped`,
        details: anims || undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text-input" className="block text-lg font-medium mb-2">
              {t('textToGesture')}
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('enterText')}
              className="w-full h-32 px-4 py-3 text-lg border border-gray-300 rounded-lg focus-visible focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              aria-label={t('enterText')}
            />
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit" size="lg" disabled={isLoading || !text.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {t('translate')}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
      
      {result && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">{t('textToGesture')}</h3>
          <div className="space-y-4">
            <p className="text-gray-600">{t('originalText')}: {result.original_text}</p>
            <div className="space-y-2">
              <p className="font-medium">{t('signSequence')}:</p>
              <ul className="list-disc list-inside pl-4">
                {result.sign_sequence.map((item, idx) => (
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
            {result.avatar_animations.length > 0 && (
              <div className="space-y-4">
                <p className="font-medium">{t('avatarAnimations')}:</p>
                <div className="flex flex-wrap gap-2">
                  {result.avatar_animations.map((anim, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {anim}
                    </span>
                  ))}
                </div>
                <Avatar3D animationNames={result.avatar_animations} />
              </div>
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