import { createClient } from '@/lib/supabase/server';

export async function getAdminSession() {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { user: null, isAdmin: false };

  const { data: admin } = await db.from('admins').select('id,email').eq('auth_user_id', user.id).maybeSingle();
  return { user, isAdmin: !!admin, admin };
}
