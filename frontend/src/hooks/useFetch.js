import { useState, useEffect } from 'react';

export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFunction();

        if (!isMounted) return;

        // response may be an axios response (has .data), a fetch Response (use json),
        // or the function might already return parsed JSON.
        let payload = null;

        if (response && typeof response === 'object' && 'data' in response) {
          payload = response.data;
        } else if (response && typeof response.json === 'function') {
          // fetch Response
          payload = await response.json();
        } else {
          payload = response;
        }

        // If paginated (DRF), use results; otherwise use payload directly
        if (payload && Array.isArray(payload)) {
          setData(payload);
        } else if (payload && payload.results) {
          setData(payload.results);
        } else {
          setData(payload);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred while fetching data');
          console.error('Fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
};
