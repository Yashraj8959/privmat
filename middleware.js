import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/data-vault(.*)',
  '/fake-data(.*)',
])
export default clerkMiddleware(async (auth, req)=>{
  const {userId} = await auth()
  console.log("🔐 Clerk middleware: userId =", userId);
  console.log("🛡️ Protected route match:", isProtectedRoute(req));

  if (!userId && isProtectedRoute(req)) {
    console.log("🔒 Redirecting to sign-in...");

    const {redirectToSignIn}= await auth()
    return redirectToSignIn()
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static and Next internals
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};