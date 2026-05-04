import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Allow public routes
        if (
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname.startsWith("/demo") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/register") ||
          pathname.startsWith("/_next") ||
          pathname === "/favicon.ico"
        ) {
          return true;
        }
        
        // Require auth for all dashboard routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
