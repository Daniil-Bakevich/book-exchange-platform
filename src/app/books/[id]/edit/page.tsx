import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { EditBookForm } from "@/ui/EditBookForm";

export default function EditBookPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-grow items-baseline">
        <div className="container w-full max-w-2xl px-4 py-8 mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Edit a book</h1>
          <EditBookForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
