import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { NewBookForm } from "@/ui/NewBookForm";

export default function NewBookPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-grow items-baseline">
        <div className="container w-full max-w-2xl px-4 py-8 mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Add a new book</h1>
          <NewBookForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
