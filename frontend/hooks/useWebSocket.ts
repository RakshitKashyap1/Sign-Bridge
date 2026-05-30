import { useRef, useCallback, useState } from 'react';

export interface WsPrediction {
  text: string;
  gesture: string | null;
  confidence: number;
}

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const predictionRef = useRef<WsPrediction | null>(null);
  const listenersRef = useRef<Set<(p: WsPrediction) => void>>(new Set());

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws/gesture';
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (event) => {
      const prediction: WsPrediction = JSON.parse(event.data);
      predictionRef.current = prediction;
      listenersRef.current.forEach((fn) => fn(prediction));
    };
    wsRef.current = ws;
  }, []);

  const sendFrame = useCallback((blob: Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(blob);
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  }, []);

  const subscribe = useCallback((fn: (p: WsPrediction) => void) => {
    listenersRef.current.add(fn);
    if (predictionRef.current) fn(predictionRef.current);
    return () => { listenersRef.current.delete(fn); };
  }, []);

  return { connected, connect, disconnect, sendFrame, subscribe };
}
