import { useTranslation } from 'react-i18next';
import { CameraProvider } from '../hooks/useCamera';
import { TranslationProvider } from '../hooks/useTranslation';
import { Navigation } from '../components/Navigation';
import { GestureToText } from '../components/GestureToText';
import { TextToGesture } from '../components/TextToGesture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

export default function Home() {
  const { t } = useTranslation();

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
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="gesture" className="text-lg py-3">
                  {t('gestureToText')}
                </TabsTrigger>
                <TabsTrigger value="text" className="text-lg py-3">
                  {t('textToGesture')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gesture">
                <GestureToText />
              </TabsContent>
              
              <TabsContent value="text">
                <TextToGesture />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </CameraProvider>
    </TranslationProvider>
  );
}