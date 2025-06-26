import { BaseModel } from "./baseModel";
import { Book } from "../types/books";

export class BookModel extends BaseModel {
  async findAll() {
    const books = await super.findAll();
    return books as Book[];
  }

  async findById(id: string) {
    const book = await super.findById(id);
    return book as Book | null;
  }

  async create(data: Omit<Book, "id" | "createdAt" | "updatedAt">) {
    const book = await super.create(data);
    return book as Book;
  }

  async update(id: string, updates: Partial<Omit<Book, "id" | "createdAt">>) {
    const book = await super.update(id, updates);
    return book as Book | null;
  }

  async findByAuthorId(authorId: string) {
    const books = await this.findAll();
    return books.filter((book) => book.authorId === authorId);
  }

  async findByTitle(title: string) {
    const books = await this.findAll();
    return (
      books.find((book) => book.title.toLowerCase() === title.toLowerCase()) ||
      null
    );
  }

  async searchByTitle(searchTerm: string) {
    const books = await this.findAll();
    if (searchTerm === "") {
      return [];
    }
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) as Book[];
  }

  async findByPublicationYear(year: number) {
    const books = await this.findAll();
    return books.filter((book) => book.publicationYear === year);
  }
}

export const bookModel = new BookModel();
