import { useEffect, useState } from 'react';
import { getSiteSettings } from '../lib/supabase';

export interface SiteSettings {
  id?: boolean;
  company_display_name: string;
  hero_headline: string;
  hero_subheadline: string;
  main_whatsapp: string;
  main_email: string;
  support_email: string;
  sales_email: string;
  commercial_email: string;
  financial_email: string;
  instagram_url: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  about_text_short: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await getSiteSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { settings, loading };
}
