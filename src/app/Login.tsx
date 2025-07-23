"use client";

import { Button } from "~/components/ui/button";
import { signIn } from "~/lib/auth/client";

export default function Login() {
  return (
    <Button
      onClick={async () => {
        await signIn.social({ provider: "github", callbackURL: "/" });
      }}
    >
      Login With GitHub
    </Button>
  );
}
