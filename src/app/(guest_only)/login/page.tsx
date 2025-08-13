import { LoginForm } from "@/ui/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Sign in to your account
        </h1>

        <LoginForm />

        <p className="text-sm text-center text-gray-600">
          Don't have an account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
