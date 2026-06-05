import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

// Define public routes that don't require Clerk authentication
const isPublicRoute = createRouteMatcher([
  '/', 
  '/about(.*)',
  '/contact(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/send-digest(.*)'
]);

export const onRequest = clerkMiddleware((auth, context, next) => {
  const { userId, redirectToSignIn } = auth();

  // If the user is unauthenticated and attempting to access a protected route, redirect them
  if (!userId && !isPublicRoute(context.request)) {
    return redirectToSignIn();
  }

  // Continue processing the request
  return next();
});
