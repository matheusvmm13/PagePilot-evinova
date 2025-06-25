import { FastifyInstance } from "fastify";
import { AuthorHandlers } from "../handlers/index";
import { PaginatedResponseSchema } from "../types/common";
import {
  CreateAuthorSchema,
  UpdateAuthorSchema,
  AuthorResponseSchema,
  AuthorsListResponseSchema,
} from "../types/author";

export default async function authorRoutes(fastify: FastifyInstance) {
  // GET /authors - List all authors with pagination
  fastify.get(
    "/",
    {
      schema: {
        querystring: PaginatedResponseSchema,
        response: {
          200: AuthorsListResponseSchema,
        },
      },
    },
    AuthorHandlers.getAllAuthors
  );

  // GET /authors/:id - Get author by ID
  fastify.get(
    "/:id",
    {
      schema: {
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
              data: AuthorResponseSchema,
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    AuthorHandlers.getAuthorById
  );

  // POST /authors - Create new author
  fastify.post(
    "/",
    {
      schema: {
        body: CreateAuthorSchema,
        response: {
          201: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: AuthorResponseSchema,
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    AuthorHandlers.createAuthor
  );

  // PUT /authors/:id - Update author
  fastify.put(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        body: UpdateAuthorSchema,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: AuthorResponseSchema,
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    AuthorHandlers.updateAuthor
  );

  // DELETE /authors/:id - Delete author
  fastify.delete(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
      },
    },
    AuthorHandlers.deleteAuthor
  );

  // GET /authors/:id/books - Get all books by author
  fastify.get(
    "/:id/books",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
      },
    },
    AuthorHandlers.getAuthorBooks
  );

  // GET /authors/search?q=term - Search authors
  fastify.get(
    "/search",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string", minLength: 1 },
          },
          required: ["q"],
        },
      },
    },
    AuthorHandlers.searchAuthors
  );
}
