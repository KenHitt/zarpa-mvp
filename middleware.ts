import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

function isProtectedAdmin(path: string) {
  if (path === '/admin/login') return false;
  return path.startsWith('/admin');
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

  if (isProtectedAdmin(path) && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = { matcher: ['/partner/:path*', '/admin', '/admin/:path*'] };
