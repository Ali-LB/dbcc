import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'ADMIN';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    // If user is not admin and trying to access admin routes, redirect to user dashboard
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user is admin and accessing /dashboard, redirect to admin dashboard
    if (req.nextUrl.pathname === '/dashboard' && isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/dashboard'],
}; 