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
        
        if (isMounted) {
          // Handle different response formats
          if (response.data) {
            // If response has 'results' (pagination), use that, otherwise use data directly
            setData(response.data.results || response.data);
          }
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
