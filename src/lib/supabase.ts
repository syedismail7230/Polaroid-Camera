import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export async function getVenue(id: string) {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateVenue(id: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('venues')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function savePhoto(photoData: any) {
  const { data, error } = await supabase
    .from('photos')
    .insert([photoData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVenuePhotos(venueId: string) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('venue_id', venueId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getVenueAnalytics(venueId: string) {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('venue_id', venueId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateAnalytics(venueId: string, date: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('analytics')
    .upsert([
      {
        venue_id: venueId,
        date,
        ...updates
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}