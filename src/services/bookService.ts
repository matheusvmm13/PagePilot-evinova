import { authorModel } from "../models/authorModel";
import { bookModel } from "../models/bookModel";
import { Book } from "../types/books";

type PaginationParams = {
  page: number;
  limit: number;
};

type PaginatedResponse = {
  items: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export interface BookWithAuthor extends Book {
  author: {
    id: string;
    name: string;
  };
}

export class BookService {
  async getAllBooks(
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse> {
    const allBooks = await bookModel.findAll();
    const { page, limit } = params;

    const total = allBooks.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const books = allBooks.slice(startIndex, endIndex);
    const booksWithAuthors = await this.addAuthorInfo(books);

    return {
      items: booksWithAuthors,
      pagination: { page, limit, total, totalPages },
    };
  }

  async getBookById(id: string): Promise<BookWithAuthor | null> {
    const book = await bookModel.findById(id);
    if (!book) return null;

    const booksWithAuthors = await this.addAuthorInfo([book]);
    return booksWithAuthors[0];
  }

  async createBook(
    data: Omit<Book, "id" | "createdAt" | "updatedAt">
  ): Promise<BookWithAuthor> {
    // Validate author exists
    const author = await authorModel.findById(data.authorId);
    if (!author) {
      throw new Error(`Author with ID "${data.authorId}" not found`);
    }

    // Check if book with same title already exists
    const existingBook = await bookModel.findByTitle(data.title);
    if (existingBook) {
      throw new Error(`Book with title "${data.title}" already exists`);
    }

    const book = await bookModel.create(data);
    const booksWithAuthors = await this.addAuthorInfo([book]);
    return booksWithAuthors[0];
  }

  async updateBook(
    id: string,
    data: Partial<Omit<Book, "id" | "createdAt">>
  ): Promise<BookWithAuthor | null> {
    const existingBook = await bookModel.findById(id);
    if (!existingBook) {
      throw new Error(`Book with ID "${id}" not found`);
    }

    // If authorId is being updated, validate the new author exists
    if (data.authorId && data.authorId !== existingBook.authorId) {
      const author = await authorModel.findById(data.authorId);
      if (!author) {
        throw new Error(`Author with ID "${data.authorId}" not found`);
      }
    }

    // If title is being updated, check for duplicates
    if (data.title && data.title !== existingBook.title) {
      const duplicateBook = await bookModel.findByTitle(data.title);
      if (duplicateBook) {
        throw new Error(`Book with title "${data.title}" already exists`);
      }
    }

    const updatedBook = await bookModel.update(id, data);
    if (!updatedBook) return null;

    const booksWithAuthors = await this.addAuthorInfo([updatedBook]);
    return booksWithAuthors[0];
  }

  async deleteBook(id: string): Promise<boolean> {
    const existingBook = await bookModel.findById(id);
    if (!existingBook) {
      throw new Error(`Book with ID "${id}" not found`);
    }

    return bookModel.delete(id);
  }

  async searchBooks(searchTerm: string): Promise<BookWithAuthor[]> {
    const books = await bookModel.searchByTitle(searchTerm);
    return this.addAuthorInfo(books);
  }

  async getBooksByYear(year: number): Promise<BookWithAuthor[]> {
    const books = await bookModel.findByPublicationYear(year);
    return this.addAuthorInfo(books);
  }

  private async addAuthorInfo(books: Book[]): Promise<BookWithAuthor[]> {
    const authorIds = [...new Set(books.map((book) => book.authorId))];
    const authors = await Promise.all(
      authorIds.map((id) => authorModel.findById(id))
    );

    const authorMap = new Map(
      authors.filter(Boolean).map((author) => [author!.id, author!])
    );

    return books.map((book) => ({
      ...book,
      author: {
        id: authorMap.get(book.authorId)?.id || book.authorId,
        name: authorMap.get(book.authorId)?.name || "Unknown Author",
      },
    }));
  }
}

export const bookService = new BookService();
