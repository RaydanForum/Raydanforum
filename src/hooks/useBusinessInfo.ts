import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BusinessInfo } from '../lib/seo';

export function useBusinessInfo() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setBusinessInfo(data);
    } catch (err) {
      console.error('Error fetching business info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch business info');
    } finally {
      setLoading(false);
    }
  };

  return { businessInfo, loading, error, refetch: fetchBusinessInfo };
}
