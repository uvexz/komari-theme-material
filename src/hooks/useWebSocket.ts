import { useEffect, useState, useCallback } from 'react';
import type { NodeStatus } from '../types';

export function useWebSocket(url: string) {
  const [data, setData] = useState<Record<string, NodeStatus>>({});
  const [online, setOnline] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnected(true);
      ws.send('get');
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.status === 'success' && response.data) {
          setData(response.data.data || {});
          setOnline(response.data.online || []);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, 5000);
    };

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('get');
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [url]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return { data, online, connected };
}
