import { FastifyInstance } from "fastify";
import { BookHandlers } from "../handlers/index";
import { PaginatedResponseSchema } from "../types/common";
import {
  CreateBookSchema,
  UpdateBookSchema,
  BookResponseSchema,
  BooksListResponseSchema,
} from "../types/books";

export default async function bookRoutes(fastify: FastifyInstance) {
  // GET /books - List all books with pagination
  fastify.get(
    "/",
    {
      schema: {
        summary: "List all books",
        tags: ["Books"],
        querystring: PaginatedResponseSchema,
        response: {
          200: BooksListResponseSchema,
        },
      },
    },
    BookHandlers.getAllBooks
  );

  // GET /books/:id - Get book by ID
  fastify.get(
    "/:id",
    {
      schema: {
        summary: "Get book by ID",
        tags: ["Books"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: BookResponseSchema,
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    BookHandlers.getBookById
  );

  // POST /books - Create new book
  fastify.post(
    "/",
    {
      schema: {
        summary: "Create a new book",
        tags: ["Books"],
        body: CreateBookSchema,
        response: {
          201: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: BookResponseSchema,
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    BookHandlers.createBook
  );

  // PUT /books/:id - Update book
  fastify.put(
    "/:id",
    {
      schema: {
        summary: "Update a book",
        tags: ["Books"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        body: UpdateBookSchema,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: BookResponseSchema,
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    BookHandlers.updateBook
  );

  // DELETE /books/:id - Delete book
  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Delete a book",
        tags: ["Books"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
      },
    },
    BookHandlers.deleteBook
  );

  // GET /books/search?q=term - Search books
  fastify.get(
    "/search",
    {
      schema: {
        summary: "Search books",
        tags: ["Books"],
        querystring: {
          type: "object",
          properties: {
            q: { type: "string", minLength: 1 },
          },
          required: ["q"],
        },
      },
    },
    BookHandlers.searchBooks
  );

  // GET /books/year/:year - Get books by publication year
  fastify.get(
    "/year/:year",
    {
      schema: {
        summary: "Get books by publication year",
        tags: ["Books"],
        params: {
          type: "object",
          properties: {
            year: {
              type: "number",
              minimum: 1500,
              maximum: new Date().getFullYear(),
            },
          },
          required: ["year"],
        },
      },
    },
    BookHandlers.getBooksByYear
  );
}
