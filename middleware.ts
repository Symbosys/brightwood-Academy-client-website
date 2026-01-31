import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = "secret";
const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);

async function decrypt(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Define route types
    const isProtectedRoute = ["/admin", "/admin-admission", "/notices", "/inquiries"].some((route) =>
        path === route || path.startsWith(`${route}/`)
    );
    const isAuthRoute = path === "/login";

    // Get session
    const token = req.cookies.get("session")?.value;
    const session = token ? await decrypt(token) : null;

    // 1. Redirect to /login if unauthenticated and accessing protected route
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. Redirect to /admin if authenticated and accessing auth route
    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
