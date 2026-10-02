import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for Firebase collection CRUD operations
 * @param {Object} service - A CRUD service from services/firebase.js
 * @param {string} orderField - Field to order by
 * @param {string} orderDir - 'asc' or 'desc'
 */
export function useFirestoreCollection(service, orderField, orderDir) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getAll(orderField, orderDir);
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Firestore fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [service, orderField, orderDir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
