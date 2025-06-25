import { FastifyReply, FastifyRequest } from "fastify";
import { bookService } from "../services/bookService";
import { ResponseHandler } from "./responseHandler";
import { CreateBookSchema, UpdateBookSchema } from "../types/books";

export class BookHandlers {
  static async getAllBooks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const page = Number((request.query as { page: string }).page) || 1;
      const limit = Number((request.query as { limit: string }).limit) || 10;

      const result = await bookService.getAllBooks({ page, limit });
      return ResponseHandler.success(reply, result);
    } catch (error) {
      return ResponseHandler.serverError(reply, (error as Error).message);
    }
  }

  static async getBookById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const book = await bookService.getBookById(id);

      if (!book) {
        return ResponseHandler.notFound(reply, "Book");
      }

      return ResponseHandler.success(reply, book);
    } catch (error) {
      return ResponseHandler.serverError(reply, (error as Error).message);
    }
  }

  static async createBook(
    request: FastifyRequest<{ Body: typeof CreateBookSchema._type }>,
    reply: FastifyReply
  ) {
    try {
      const book = await bookService.createBook(
        request.body as typeof CreateBookSchema._type
      );
      return ResponseHandler.success(reply, book, 201);
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

  static async updateBook(
    request: FastifyRequest<{
      Params: { id: string };
      Body: typeof UpdateBookSchema._type;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const book = await bookService.updateBook(
        id,
        request.body as typeof UpdateBookSchema._type
      );

      if (!book) {
        return ResponseHandler.notFound(reply, "Book");
      }

      return ResponseHandler.success(reply, book);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("not found")) {
        return ResponseHandler.notFound(reply, "Book");
      }
      if (message.includes("already exists")) {
        return ResponseHandler.conflict(reply, message);
      }
      return ResponseHandler.serverError(reply, message);
    }
  }

  static async deleteBook(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const deleted = await bookService.deleteBook(id);

      if (!deleted) {
        return ResponseHandler.notFound(reply, "Book");
      }

      return ResponseHandler.success(reply, {
        message: "Book deleted successfully",
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("not found")) {
        return ResponseHandler.notFound(reply, "Book");
      }
      return ResponseHandler.serverError(reply, message);
    }
  }

  static async searchBooks(
    request: FastifyRequest<{ Querystring: { q: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { q } = request.query;
      const books = await bookService.searchBooks(q);
      return ResponseHandler.success(reply, { books });
    } catch (error) {
      return ResponseHandler.serverError(reply, (error as Error).message);
    }
  }

  static async getBooksByYear(
    request: FastifyRequest<{ Params: { year: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { year } = request.params;
      const books = await bookService.getBooksByYear(year);
      return ResponseHandler.success(reply, { books });
    } catch (error) {
      return ResponseHandler.serverError(reply, (error as Error).message);
    }
  }
}
