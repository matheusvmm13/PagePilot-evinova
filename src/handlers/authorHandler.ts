import { FastifyReply, FastifyRequest } from "fastify";
import { authorService } from "../services";
import { ResponseHandler } from "./responseHandler";
import { CreateAuthorSchema, UpdateAuthorSchema } from "../types/author";

export class AuthorHandlers {
  static async getAllAuthors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const page = Number((request.query as { page: string }).page) || 1;
      const limit = Number((request.query as { limit: string }).limit) || 10;

      const result = await authorService.getAllAuthors({ page, limit });
      return ResponseHandler.success(reply, result);
    } catch (error) {
      return ResponseHandler.serverError(reply, (error as Error).message);
    }
  }

  static async getAuthorById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const author = await authorService.getAuthorById(id);

      if (!author) {
        return ResponseHandler.notFound(reply, "Author");
      }

      return ResponseHandler.success(reply, author);
    } catch (error) {
      return ResponseHandler.serverError(reply, (error as Error).message);
    }
  }

  static async createAuthor(
    request: FastifyRequest<{ Body: typeof CreateAuthorSchema }>,
    reply: FastifyReply
  ) {
    try {
      const author = await authorService.createAuthor(
        request.body as typeof CreateAuthorSchema._type
      );
      return ResponseHandler.success(reply, author, 201);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("already exists")) {
        return ResponseHandler.conflict(reply, message);
      }
      return ResponseHandler.serverError(reply, message);
    }
  }

  static async updateAuthor(
    request: FastifyRequest<{
      Params: { id: string };
      Body: typeof UpdateAuthorSchema._type;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const author = await authorService.updateAuthor(
        id,
        request.body as typeof UpdateAuthorSchema._type
      );

      if (!author) {
        return ResponseHandler.notFound(reply, "Author");
      }

      return ResponseHandler.success(reply, author);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("not found")) {
        return ResponseHandler.notFound(reply, "Author");
      }
      if (message.includes("already exists")) {
        return ResponseHandler.conflict(reply, message);
      }
      return ResponseHandler.serverError(reply, message);
    }
  }

  static async deleteAuthor(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const deleted = await authorService.deleteAuthor(id);

      if (!deleted) {
        return ResponseHandler.notFound(reply, "Author");
      }

      return ResponseHandler.success(reply, {
        message: "Author deleted successfully",
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("not found")) {
        return ResponseHandler.notFound(reply, "Author");
      }
      if (message.includes("Cannot delete author")) {
        return ResponseHandler.conflict(reply, message);
      }
      return ResponseHandler.serverError(reply, message);
    }
  }

  static async getAuthorBooks(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const books = await authorService.getAuthorBooks(id);
      return ResponseHandler.success(reply, { books });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("not found")) {
        return ResponseHandler.notFound(reply, "Author");
      }
      return ResponseHandler.serverError(reply, message);
    }
  }

  static async searchAuthors(
    request: FastifyRequest<{ Querystring: { q: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { q } = request.query;
      const authors = await authorService.searchAuthors(q);
      return ResponseHandler.success(reply, { authors });
    } catch (error) {
      return ResponseHandler.serverError(reply, (error as Error).message);
    }
  }
}
