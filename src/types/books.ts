import { Type } from "@sinclair/typebox";
import { BaseEntity } from "./common";

// Book entity interface
export interface Book extends BaseEntity {
  title: string;
  summary: string;
  publicationYear: number;
  authorId: string;
}

// Book creation schema
export const CreateBookSchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 200 }),
  summary: Type.String({ minLength: 1, maxLength: 2000 }),
  publicationYear: Type.Number({
    minimum: 1500,
    maximum: new Date().getFullYear(),
  }),
  authorId: Type.String({ format: "uuid" }),
});

// Book update schema
export const UpdateBookSchema = Type.Partial(CreateBookSchema);

// Book response schema (with author info)
export const BookResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  summary: Type.String(),
  publicationYear: Type.Number(),
  authorId: Type.String({ format: "uuid" }),
  author: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

// Books list response schema
export const BooksListResponseSchema = Type.Object({
  books: Type.Array(BookResponseSchema),
  pagination: Type.Object({
    page: Type.Number(),
    limit: Type.Number(),
    total: Type.Number(),
    totalPages: Type.Number(),
  }),
});
