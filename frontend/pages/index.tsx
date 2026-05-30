import { useTranslation } from 'react-i18next';
import { CameraProvider } from '../hooks/useCamera';
import { TranslationProvider } from '../hooks/useTranslation';
import { useHistory } from '../hooks/useHistory';
import { Navigation } from '../components/Navigation';
import { GestureToText } from '../components/GestureToText';
import { TextToGesture } from '../components/TextToGesture';
import { SpeechToGesture } from '../components/SpeechToGesture';
import { VocabularyBuilder } from '../components/VocabularyBuilder';
import { RealTimeGesture } from '../components/RealTimeGesture';
import { ConversationMode } from '../components/ConversationMode';
import { HistoryPanel } from '../components/HistoryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

export default function Home() {
  const { t } = useTranslation();
  const { history, toggleFavorite, removeEntry, clearHistory } = useHistory();

  return (
    <TranslationProvider>
      <CameraProvider>
        <div className="min-h-screen bg-gray-50 high-contrast">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-primary-700">
              {t('title')}
            </h1>
            <p className="text-center text-gray-600 mb-8">{t('subtitle')}</p>
            
            <Tabs defaultValue="gesture" className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="gesture" className="text-sm md:text-lg py-3">
                  {t('gestureToText')}
                </TabsTrigger>
                <TabsTrigger value="realtime" className="text-sm md:text-lg py-3">
                  {t('realTime')}
                </TabsTrigger>
                <TabsTrigger value="conversation" className="text-sm md:text-lg py-3">
                  {t('conversation')}
                </TabsTrigger>
                <TabsTrigger value="text" className="text-sm md:text-lg py-3">
                  {t('textToGesture')}
                </TabsTrigger>
                <TabsTrigger value="speech" className="text-sm md:text-lg py-3">
                  {t('speechToGesture')}
                </TabsTrigger>
                <TabsTrigger value="vocabulary" className="text-sm md:text-lg py-3">
                  {t('vocabulary')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gesture">
                <GestureToText />
              </TabsContent>
              
              <TabsContent value="realtime">
                <RealTimeGesture />
              </TabsContent>

              <TabsContent value="conversation">
                <ConversationMode />
              </TabsContent>
              
              <TabsContent value="text">
                <TextToGesture />
              </TabsContent>

              <TabsContent value="speech">
                <SpeechToGesture />
              </TabsContent>

              <TabsContent value="vocabulary">
                <VocabularyBuilder />
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <HistoryPanel
                entries={history}
                onToggleFavorite={toggleFavorite}
                onRemove={removeEntry}
                onClear={clearHistory}
              />
            </div>
          </main>
        </div>
      </CameraProvider>
    </TranslationProvider>
  );
}