"use client";

import { useRouter } from "next/navigation";

export function BackButton({ text = "Back" }: { text?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
    >
      {text}
    </button>
  );
}
