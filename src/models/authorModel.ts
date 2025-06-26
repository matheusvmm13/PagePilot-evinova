import { BaseModel } from "./baseModel";
import { Author } from "../types/author";

export class AuthorModel extends BaseModel {
  async findAll() {
    const authors = await super.findAll();
    return authors as Author[];
  }

  async findById(id: string) {
    const author = await super.findById(id);
    return author as Author | null;
  }

  async create(data: Omit<Author, "id" | "createdAt" | "updatedAt">) {
    const author = await super.create(data);
    return author as Author;
  }

  async update(id: string, updates: Partial<Omit<Author, "id" | "createdAt">>) {
    const author = await super.update(id, updates);
    return author as Author | null;
  }

  async findByName(name: string) {
    const authors = await this.findAll();
    return (
      authors.find(
        (author) => author.name.toLowerCase() === name.toLowerCase()
      ) || null
    );
  }

  async searchByName(searchTerm: string) {
    const authors = await this.findAll();
    if (searchTerm === "") {
      return [];
    }
    return authors.filter((author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) as Author[];
  }
}

export const authorModel = new AuthorModel();
