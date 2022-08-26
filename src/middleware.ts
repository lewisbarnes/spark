// middleware.ts
import { NextResponse, NextRequest, userAgent } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { device } = userAgent(request);
		return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/s/:path*',
}