"use client";

import { useSession } from "next-auth/react";

// Правильный импорт для клиентских компонентов
import { signIn as clientSignIn, signOut as clientSignOut } from "next-auth/react";

function LoginButton() {
  return <button onClick={() => clientSignIn()}>Sign In</button>;
}

export default function LogoutButton() {
  const { data: session } = useSession();
  console.log(session);
  if (!session) return <div>Not logged in</div>;

  return <button onClick={() => clientSignOut()}>Sign Out</button>;
}
