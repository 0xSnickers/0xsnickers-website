'use server';

import { redirect } from 'next/navigation';
import { notesConfigured, notesSession } from '@/lib/notes/session';

export async function signIn(form: FormData) {
  if (!notesConfigured()) redirect('/admin/login?error=configuration');

  const supabase = await notesSession(true);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(form.get('email') ?? '').trim(),
    password: String(form.get('password') ?? ''),
  });
  if (error) redirect('/admin/login?error=credentials');
  if (data.user?.id !== process.env.NOTES_AUTHOR_ID || data.user.app_metadata.notes_author !== true) {
    await supabase.auth.signOut();
    redirect('/admin/login?error=credentials');
  }
  redirect('/admin/notes');
}

export async function signOut() {
  if (notesConfigured()) {
    const supabase = await notesSession(true);
    await supabase.auth.signOut({ scope: 'local' });
  }
  redirect('/admin/login');
}
