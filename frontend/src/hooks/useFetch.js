import { useState, useEffect } from 'react';

const CACHE_TTL_MS = 10 * 60 * 1000;
const inFlightRequests = new Map();

const normalizePayload = async (response) => {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }

  if (response && typeof response.json === 'function') {
    return await response.json();
  }

  return response;
};

const getCollectionFromPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.results)) {
      return payload.results;
    }

    if (payload.data && Array.isArray(payload.data)) {
      return payload.data;
    }

    if (payload.data && payload.data.results && Array.isArray(payload.data.results)) {
      return payload.data.results;
    }
  }

  return null;
};

const getCacheKey = (fetchFunction, dependencies = []) => {
  const functionSignature = fetchFunction?.toString?.() || String(fetchFunction || 'anonymous');
  const dependencyKey = JSON.stringify(dependencies ?? []);
  return `${functionSignature}:${dependencyKey}`;
};

const getCachedValue = (cacheKey) => {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const isFresh = parsed.expiresAt > Date.now();
    return isFresh ? parsed.value : null;
  } catch {
    return null;
  }
};

const setCachedValue = (cacheKey, value) => {
  try {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify({
        value,
        expiresAt: Date.now() + CACHE_TTL_MS,
      })
    );
  } catch {
    // Ignore storage errors in restricted browser contexts
  }
};

export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = getCacheKey(fetchFunction, dependencies);

    const hydrateFromCache = () => {
      const cachedData = getCachedValue(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        setError(null);
        return true;
      }
      return false;
    };

    const fetchData = async () => {
      try {
        const cachedResult = hydrateFromCache();
        if (cachedResult) return;

        setLoading(true);
        setError(null);

        if (inFlightRequests.has(cacheKey)) {
          const cachedPromise = inFlightRequests.get(cacheKey);
          const response = await cachedPromise;
          if (!isMounted) return;
          setData(response);
          return;
        }

        const request = (async () => {
          const response = await fetchFunction();
          const payload = await normalizePayload(response);

          const collection = getCollectionFromPayload(payload);
          const normalizedPayload = collection !== null ? collection : payload;

          setCachedValue(cacheKey, normalizedPayload);
          return normalizedPayload;
        })();

        inFlightRequests.set(cacheKey, request);

        const resolvedData = await request;

        if (!isMounted) return;

        setData(resolvedData);
        setError(null);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred while fetching data');
          console.error('Fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        inFlightRequests.delete(cacheKey);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
};
