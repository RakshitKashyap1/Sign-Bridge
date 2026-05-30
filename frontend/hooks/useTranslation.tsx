import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface TranslationResult {
  text: string;
  gesture: string | null;
  confidence: number;
  audio_base64: string | null;
}

interface TranslationContextType {
  result: TranslationResult | null;
  isLoading: boolean;
  error: string | null;
  translateGesture: (file: File) => Promise<void>;
  translateText: (text: string, language?: string) => Promise<any>;
  translateSpeech: (blob: Blob, language?: string) => Promise<any>;
  clearResult: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateGesture = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post<TranslationResult>(`${API_URL}/translateGesture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch {
      setError('Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const translateText = async (text: string, language = 'en') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/translateText`, { text, language });
      return response.data;
    } catch {
      setError('Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const translateSpeech = async (blob: Blob, language = 'en-US') => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'speech.webm');
      formData.append('language', language);
      const response = await axios.post(`${API_URL}/translateSpeech`, formData);
      return response.data;
    } catch {
      setError('Speech translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return (
    <TranslationContext.Provider value={{ result, isLoading, error, translateGesture, translateText, translateSpeech, clearResult }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslationContext must be used within TranslationProvider');
  return context;
};