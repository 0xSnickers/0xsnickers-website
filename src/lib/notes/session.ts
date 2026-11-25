import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function notesConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.NOTES_AUTHOR_ID);
}

export async function notesSession(writable = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured.');

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(nextCookies) {
        if (!writable) return;
        for (const { name, value, options } of nextCookies) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

export async function requireAuthor(writable = false) {
  if (!notesConfigured() || !process.env.NOTES_AUTHOR_ID) redirect('/admin/login');
  const supabase = await notesSession(writable);
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (claims?.sub !== process.env.NOTES_AUTHOR_ID || claims?.app_metadata?.notes_author !== true) {
    redirect('/admin/login');
  }
  return supabase;
}
