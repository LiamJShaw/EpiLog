import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";

// Access environment variables
// For VITE_ prefixed variables, use import.meta.env.VITE_VARIABLE_NAME
// For server-side variables (not prefixed with VITE_), use process.env.VARIABLE_NAME
const githubClientId = import.meta.env.VITE_GITHUB_ID;
const githubClientSecret = process.env.GITHUB_SECRET;

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      // Add your callback URL here
      callbackUrl: `${import.meta.env.VITE_BASE_URL}/auth/callback/github`
    })
  ],
  // Add any additional SvelteKitAuth options here
});
