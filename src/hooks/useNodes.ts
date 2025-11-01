import { useEffect, useState } from 'react';
import type { NodeInfo } from '../types';

export function useNodes() {
  const [nodes, setNodes] = useState<NodeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/nodes')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setNodes(result.data);
        } else {
          setError('Failed to load nodes');
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { nodes, loading, error };
}
