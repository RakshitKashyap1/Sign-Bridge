import { useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '../lib/i18n';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // sw registration failed — offline not available
      });
    }
  }, []);

  return <Component {...pageProps} />;
}