export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genreIds: number[];
  publicationDate: string;
  images: string[];
  ownerId: string;
  statusId: number;
}
