import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value

  if (request.nextUrl.pathname !== '/admin/admin-login' && role !== '1') {
    return NextResponse.redirect(new URL('/admin/admin-login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
