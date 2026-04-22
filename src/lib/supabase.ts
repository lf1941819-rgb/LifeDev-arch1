import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

// Auth Services
export const authService = {
  async signIn(email: string, pass: string) {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase not configured' };
    return await supabase.auth.signInWithPassword({ email, password: pass });
  },
  async signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  },
  async getSession() {
    const supabase = getSupabase();
    if (!supabase) return { data: { session: null } };
    return await supabase.auth.getSession();
  },
  async getProfile(userId: string) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: 'Not configured' };
    return await supabase.from('profiles').select('*').eq('id', userId).single();
  }
};

// Lead Services
export async function submitLead(data: any) {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn('Supabase not configured. Lead data:', data);
    return { error: 'Supabase not configured' };
  }
  return await supabase.from('contact_leads').insert([{ ...data, source: window.location.hostname, status: 'new' }]);
}

export async function getLeads() {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Not configured' };
  return await supabase.from('contact_leads').select('*').order('created_at', { ascending: false });
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  return await supabase.from('contact_leads').update({ status }).eq('id', id);
}

// Portfolio Services
export async function getPortfolioItems() {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Not configured' };
  return await supabase.from('portfolio_items').select('*').order('created_at', { ascending: false });
}

export async function upsertPortfolioItem(item: any) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  return await supabase.from('portfolio_items').upsert([item]);
}

export async function deletePortfolioItem(id: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  return await supabase.from('portfolio_items').delete().eq('id', id);
}

// Posts Services
export async function getPosts() {
  const supabase = getSupabase();
  if (!supabase) return { data: [], error: 'Not configured' };
  return await supabase.from('content_posts').select('*').order('created_at', { ascending: false });
}

export async function upsertPost(post: any) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  return await supabase.from('content_posts').upsert([post]);
}

export async function deletePost(id: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  return await supabase.from('content_posts').delete().eq('id', id);
}

// Storage Services
export async function uploadImage(file: File, bucket: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) return { error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { publicUrl };
}

// Settings Services
export async function getSiteSettings() {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Not configured' };
  return await supabase.from('site_settings').select('*').single();
}

export async function updateSiteSettings(settings: any) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  // settings.id is true in the singleton pattern
  return await supabase.from('site_settings').upsert({ ...settings, id: true });
}

// Payment Services
export async function createPaymentRequest(payment: any) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  return await supabase.from('payment_requests').insert([payment]).select().single();
}

export async function getPaymentRequest(id: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  return await supabase.from('payment_requests').select('*').eq('id', id).single();
}

export async function updatePaymentStatus(id: string, status: string, external_ref?: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Not configured' };
  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (external_ref) updateData.external_reference = external_ref;
  return await supabase.from('payment_requests').update(updateData).eq('id', id);
}
