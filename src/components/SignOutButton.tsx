import { signOut } from "@/auth";

export function SignOutButton() {
  const signOutHandler = async () => {
    "use server";
    await signOut();
  };

  return (
    <button
        type="button"
        onClick={signOutHandler}
        className="w-full px-4 py-2 font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary-400 disabled:cursor-not-allowed"
    >
      Sign out
    </button>
  );
}
