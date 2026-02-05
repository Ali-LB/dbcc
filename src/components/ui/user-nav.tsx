"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import Link from "next/link";
import { Gear, User } from "@phosphor-icons/react";

export function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    const isAdmin =
      session.user && "role" in session.user && session.user.role === "ADMIN";

    return (
      <div className="flex items-center space-x-2">
        {isAdmin ? (
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <Gear className="mr-2" size={16} />
              Admin Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <User className="mr-2" size={16} />
              My Dashboard
            </Button>
          </Link>
        )}
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>
      </div>
    );
  }
  return <Button onClick={() => signIn()}>Sign In</Button>;
}
