import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LogoutButton } from "@/components/LogoutButton";
import { User } from "@/DTOs/User";
import { Book } from "@/DTOs/Book";
import Link from "next/link";
import EditProfileModal from "@/components/EditProfileModal";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
  if (!userResponse.ok) {
    await signOut({ redirectTo: "/login" });
  }

  const user: User = await userResponse.json();

  const booksResponse = await fetch(`http://localhost:3001/books?ownerId=${userId}`);
  const books: Book[] = await booksResponse.json();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        <div className="container w-full px-4 py-8 mx-auto space-y-8">
          <div className="flex items-center justify-between pb-6 border-b">
            <div className="flex items-center space-x-4">
              <Image
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <EditProfileModal user={user} />
              <LogoutButton />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Your books</h2>
            {books.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book) => (
                  <Link href={`/books/${book.id}`} key={book.id}>
                    <div className="overflow-hidden bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative w-full h-48">
                        <Image
                          src={book.images[0]}
                          alt={`Cover of ${book.title}`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-500">{book.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-md">
                <p>You don't have any added books yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
