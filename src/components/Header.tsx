import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const session = await auth();

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link href="/" className="text-xl font-bold text-primary">
          BookSwap
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-gray-600 hover:text-primary">
            Main
          </Link>

          {session?.user ? (
            <>
              <Link href="/profile" className="text-gray-600 hover:text-primary">
                Profile
              </Link>
              <div className="hidden sm:block">
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 font-medium text-white rounded-md bg-primary-600 hover:bg-primary-700"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
