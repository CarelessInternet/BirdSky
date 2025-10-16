import { createAuthClient } from 'better-auth/react';

const client = createAuthClient();
const { signIn, signOut, useSession } = client;

export { signIn, signOut, useSession };
export type Session = typeof client.$Infer.Session;

// No caching :( https://github.com/better-auth/better-auth/issues/986#issuecomment-2558582677.
