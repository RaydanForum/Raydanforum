import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SEOMetadata } from '../lib/seo';

export function useSEOMetadata(pagePath: string) {
  const [seoMetadata, setSEOMetadata] = useState<SEOMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSEOMetadata();
  }, [pagePath]);

  const fetchSEOMetadata = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('page_path', pagePath)
        .maybeSingle();

      if (error) throw error;
      setSEOMetadata(data);
    } catch (err) {
      console.error('Error fetching SEO metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  return { seoMetadata, loading, refetch: fetchSEOMetadata };
}
