import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
} from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

let cachedHandler: NextMiddleware | null = null;

function getHandler(): NextMiddleware {
  if (!cachedHandler) {
    cachedHandler = clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const signInUrl = new URL("/sign-in", req.url);
        await auth.protect({ unauthenticatedUrl: signInUrl.toString() });
      }
    });
  }
  return cachedHandler;
}

export default function proxy(req: NextRequest, ev: NextFetchEvent) {
  const hasClerk =
    !!process.env.CLERK_SECRET_KEY &&
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    if (isProtectedRoute(req)) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return getHandler()(req, ev);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
