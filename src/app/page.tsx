import { auth } from "~/lib/auth/server";
import { headers } from "next/headers";
import Login from "./Login";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <Login />;
  }

  return <p>Signed in as {session.user.name}</p>;
}
