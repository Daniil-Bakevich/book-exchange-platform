import { notFound } from "next/navigation";
import { User as UserNext } from "next-auth";

import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImageGallery } from "@/components/ImageGallery";
import { CommentSection } from "@/components/CommentSection";
import { Book } from "@/DTOs/Book";
import { User } from "@/DTOs/User";
import { Comment } from "@/DTOs/Comment";

type commentsWithAuthorsFiltered = {
  user: User;
  id: string;
  text: string;
  bookId: string;
  authorId: string;
  createdAt: string;
};

async function getBookData(id: string) {
  const API_URL = process.env.DB_URL;
  if (!API_URL) return null;

  const [bookRes, commentsRes] = await Promise.all([
    fetch(`${API_URL}/books/${id}`),
    fetch(`${API_URL}/comments?bookId=${id}`)
  ]);

  if (!bookRes.ok) return null;

  const book: Book = await bookRes.json();
  const baseComments: Comment[] = await commentsRes.json();

  if (baseComments.length === 0) {
    return { book, comments: [] };
  }

  const authorIds = [...new Set(baseComments.map(comment => comment.authorId))];

  const authorPromises = authorIds.map(authorId => fetch(`${API_URL}/users/${authorId}`));

  const authorResponses = await Promise.all(authorPromises);

  const authors: User[] = await Promise.all(authorResponses.map(res => res.json()));
  const authorsMap = new Map(authors.map(author => [author.id, author]));

  const commentsWithAuthors = baseComments
    .map(comment => ({
      ...comment,
      user: authorsMap.get(comment.authorId) || null
    }))
    .filter(comment => comment.user !== null) as commentsWithAuthorsFiltered[];

  return { book, comments: commentsWithAuthors };
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const { id } = await params;
  const bookData = await getBookData(id);

  if (!bookData) {
    notFound();
  }

  const { book, comments } = bookData;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <div className="container px-4 py-8 mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <ImageGallery images={book.images} title={book.title} />

            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">{book.title}</h1>
              <p className="mt-2 text-xl text-gray-600">by {book.author}</p>

              <div className="mt-6 prose max-w-none lg:prose-lg">
                <p>{book.description}</p>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Date of publication: {new Date(book.publicationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-16">
            <CommentSection
              initialComments={comments}
              bookId={book.id}
              currentUser={(session?.user as UserNext & { id: string }) || null}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
