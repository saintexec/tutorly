const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'HMAC_SECRET',
  'NEXT_PUBLIC_APP_URL',
] as const;

export function validateEnv() {
  // Bypass validation during Next.js build phase
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-export') {
    return;
  }

  // Also skip if we are running in next build command context
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME && !process.env.VERCEL) {
    // This is typically the build step running in CI/CD before Vercel environment variables are available or runtime starts
    return;
  }

  const missing: string[] = [];
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    const errorMsg = `CRITICAL CONFIGURATION ERROR: Missing required environment variables: ${missing.join(', ')}. Please configure them in your Vercel or local environment.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// Auto-run validation
validateEnv();
