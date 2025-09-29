import { useEffect, useState } from 'react';

export default function useProviderTypes() {
  const [providerTypes, setProviderTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
 // Helper to get JWT token from localStorage (adjust if you store it elsewhere)
 function getAuthToken() {
   return localStorage.getItem('token');
 }

  useEffect(() => {
    setLoading(true);
    const fetchProviderTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/provider-types', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch provider types');
        }
        const data = await response.json();
        setProviderTypes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviderTypes();
  }, []);

  return { providerTypes, loading, error };
}
