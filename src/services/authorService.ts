import { authorModel } from "../models/authorModel";
import { bookModel } from "../models/bookModel";
import { Author } from "../types/author";
import { Book } from "../types/books";

type PaginationParams = {
  page: number;
  limit: number;
};

type PaginatedResponse = {
  items: Author[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export class AuthorService {
  async getAllAuthors(
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse> {
    const allAuthors = await authorModel.findAll();
    const { page, limit } = params;

    const total = allAuthors.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const authors = allAuthors.slice(startIndex, endIndex);

    return {
      items: authors,
      pagination: { page, limit, total, totalPages },
    };
  }

  async getAuthorById(id: string): Promise<Author | null> {
    return authorModel.findById(id);
  }

  async createAuthor(
    data: Omit<Author, "id" | "createdAt" | "updatedAt">
  ): Promise<Author> {
    const existingAuthor = await authorModel.findByName(data.name);
    if (existingAuthor) {
      throw new Error(`Author with name "${data.name}" already exists`);
    }

    return authorModel.create(data);
  }

  async updateAuthor(
    id: string,
    data: Partial<Omit<Author, "id" | "createdAt">>
  ): Promise<Author | null> {
    const existingAuthor = await authorModel.findById(id);
    if (!existingAuthor) {
      throw new Error(`Author with ID "${id}" not found`);
    }

    if (data.name && data.name !== existingAuthor.name) {
      const duplicateAuthor = await authorModel.findByName(data.name);
      if (duplicateAuthor) {
        throw new Error(`Author with name "${data.name}" already exists`);
      }
    }

    return authorModel.update(id, data);
  }

  async deleteAuthor(id: string): Promise<boolean> {
    const existingAuthor = await authorModel.findById(id);
    if (!existingAuthor) {
      throw new Error(`Author with ID "${id}" not found`);
    }

    const authorBooks = await bookModel.findByAuthorId(id);
    if (authorBooks.length > 0) {
      throw new Error(
        `Cannot delete author - they have ${authorBooks.length} book(s) associated`
      );
    }

    return authorModel.delete(id);
  }

  async getAuthorBooks(id: string): Promise<Book[]> {
    const author = await authorModel.findById(id);
    if (!author) {
      throw new Error(`Author with ID "${id}" not found`);
    }

    return bookModel.findByAuthorId(id);
  }

  async searchAuthors(searchTerm: string): Promise<Author[]> {
    return authorModel.searchByName(searchTerm);
  }
}

export const authorService = new AuthorService();
