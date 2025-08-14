import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import Credentials from '@auth/core/providers/credentials';

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    Credentials({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(creds) {
        const email = (creds?.email as string | undefined)?.toLowerCase();
        const password = creds?.password as string | undefined;
        if (!email || !password) return null;

        // Demo-only: users defined in env as JSON [{email,password,name}]
        try {
          const raw = process.env.LOGIN_USERS_JSON ?? '[]';
          const users = JSON.parse(raw) as Array<{ email: string; password: string; name?: string }>;
          const found = users.find((u) => u.email?.toLowerCase() === email && u.password === password);
          if (!found) return null;
          return { id: email, email, name: found.name ?? email } as any;
        } catch {
          return null;
        }
      }
    })
  ],
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
  secret: process.env.AUTH_SECRET,
  debug: process.env.AUTH_DEBUG === 'true',
  logger: {
    error(...args: unknown[]) {
      console.error('[Auth] error', ...args);
    }
  }
});

