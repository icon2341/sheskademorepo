import {authMiddleware} from "@clerk/nextjs";
import {NextRequest, NextResponse} from "next/server";
import {redirectToSignIn} from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
	ignoredRoutes: ["/api/guest/event/(.*)", "/api/guest/event"],
	publicRoutes: ["/", "/product", "/event/(.*)", "/api/guest/event/(.*)", "/api/guest/event"],
	afterAuth: async (auth, req: NextRequest) => {
		const {userId, sessionClaims} = auth;

		if (userId && req.nextUrl.pathname === "/onboarding") {
			return NextResponse.next();
		}

		// If user is logged in and tries to access "/signup" or "/signin", redirect to "/home"
		if (userId && (req.nextUrl.pathname === "/signup" || req.nextUrl.pathname === "/signin")) {
			const dashboardUrl = new URL("/home", req.url);
			return NextResponse.redirect(dashboardUrl);
		}

		// User isn;'t logged in and the route is private, redirect to sign in
		if (!userId && !auth.isPublicRoute) return redirectToSignIn({returnBackUrl: req.url});

		// Catch users who don't have the `onboardingComplete: true` in PublicMetadata
		// Redirect them to the /onboarding out to compelte onboarding

		if (userId && (!sessionClaims?.metadata?.onboardingComplete ?? false)) {
			const onboardingUrl = new URL ("/onboarding", req.url);
			return NextResponse.redirect(onboardingUrl);
		}

		// User is logged in and the route is protected - let them view

		if (userId && !auth.isPublicRoute) return NextResponse.next();

		// if route is public, anybody can view it
		if(auth.isPublicRoute) return NextResponse.next();
	}
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};