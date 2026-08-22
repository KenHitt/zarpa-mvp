import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };
type SupabaseMiddlewareClient = ReturnType<typeof createServerClient>;

function isProtectedAdmin(path: string) {
  if (path === '/admin/login') return false;
  return path.startsWith('/admin');
}

function isProtectedAdminApi(path: string) {
  // Logout queda abierto a cualquier sesión para no bloquear el cierre de sesión.
  if (path === '/api/admin/logout') return false;
  return path.startsWith('/api/admin');
}

async function hasAdminRole(db: SupabaseMiddlewareClient, userId: string) {
  const { data } = await db.from('admins').select('id').eq('auth_user_id', userId).maybeSingle();
  return !!data;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const db = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(items: CookieToSet[]) {
          items.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await db.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path.startsWith('/partner/dashboard') && !user) {
    return NextResponse.redirect(new URL('/partner/login', request.url));
  }

  if (isProtectedAdminApi(path)) {
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    if (!(await hasAdminRole(db, user.id))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
  }

  if (isProtectedAdmin(path)) {
    if (!user) return NextResponse.redirect(new URL('/admin/login', request.url));
    if (!(await hasAdminRole(db, user.id))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = { matcher: ['/partner/:path*', '/admin', '/admin/:path*', '/api/admin/:path*'] };
