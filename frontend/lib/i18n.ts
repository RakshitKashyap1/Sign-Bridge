import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          title: "SignBridge",
          subtitle: "Real-time Sign Language Communication Bridge",
          gestureToText: "Gesture to Text/Speech",
          textToGesture: "Text to Gesture",
          speechToGesture: "Speech to Gesture",
          startRecording: "Start Recording",
          stopRecording: "Stop Recording",
          speechPrompt: "Press record and speak to translate to sign language",
          speechResult: "Speech Translation Result",
          transcribedText: "Transcribed Text",
          vocabulary: "Vocabulary Builder",
          gestureLabel: "Gesture Label",
          gestureLabelPlaceholder: "e.g. hello, thank_you, ...",
          saveGesture: "Save Gesture",
          savedGestures: "Saved Gestures",
          startCamera: "Start Camera",
          stopCamera: "Stop Camera",
          translate: "Translate",
          translatedText: "Translated Text",
          confidence: "Confidence",
          enterText: "Enter text to translate...",
          language: "Language",
          english: "English",
          hindi: "Hindi",
          noHandsDetected: "No hands detected",
          loading: "Loading...",
          error: "Error",
          demoMode: "Demo Mode",
          settings: "Settings",
          accessibility: "Accessibility",
          highContrast: "High Contrast Mode",
          largeText: "Large Text",
        }
      },
      hi: {
        translation: {
          title: "साइनब्रिज",
          subtitle: "रियल-टाइम साइन लैंग्वेज संचार सेतु",
          gestureToText: "गेस्चर से टेक्स्ट/स्पीच",
          textToGesture: "टेक्स्ट से गेस्चर",
          speechToGesture: "वाणी से गेस्चर",
          startRecording: "रिकॉर्डिंग शुरू करें",
          stopRecording: "रिकॉर्डिंग बंद करें",
          speechPrompt: "रिकॉर्ड दबाएँ और सांकेतिक भाषा में अनुवाद करने के लिए बोलें",
          speechResult: "वाणी अनुवाद परिणाम",
          transcribedText: "लिखित पाठ",
          vocabulary: "शब्दकोश निर्माता",
          gestureLabel: "गेस्चर लेबल",
          gestureLabelPlaceholder: "जैसे नमस्ते, धन्यवाद, ...",
          saveGesture: "गेस्चर सहेजें",
          savedGestures: "सहेजे गए गेस्चर",
          startCamera: "कैमरा शुरू करें",
          stopCamera: "कैमरा बंद करें",
          translate: "अनुवाद करें",
          translatedText: "अनुवादित टेक्स्ट",
          confidence: "विश्वास",
          enterText: "अनुवाद के लिए टेक्स्ट दर्ज करें...",
          language: "भाषा",
          english: "अंग्रेज़ी",
          hindi: "हिंदी",
          noHandsDetected: "कोई हाथ नहीं पाया गया",
          loading: "लोड हो रहा है...",
          error: "त्रुटि",
          demoMode: "डेमो मोड",
          settings: "सेटिंग्स",
          accessibility: "पहुँच योग्यता",
          highContrast: "उच्च कंट्रास्ट मोड",
          largeText: "बड़ा टेक्स्ट",
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;