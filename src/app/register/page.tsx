"use client";

import Link from "next/link";
import { RegisterForm } from "@/app/ui/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create an account
        </h1>

        <RegisterForm />
        
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
