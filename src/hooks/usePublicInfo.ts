import { useEffect, useState } from 'react';
import type { PublicInfo } from '../types';

export function usePublicInfo() {
  const [publicInfo, setPublicInfo] = useState<PublicInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setPublicInfo(result.data);
        }
      })
      .catch(err => {
        console.error('Failed to load public info:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { publicInfo, loading };
}
