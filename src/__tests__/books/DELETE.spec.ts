import { authorModel } from "../../models/authorModel";
import { bookModel } from "../../models/bookModel";
import { testAuthors, testBooks } from "../helpers/testData";
import { Author } from "../../types/author";
import { Book } from "../../types/books";
import { TestSetup } from "../helpers/testSetup";

// Mock the logger to avoid console output during tests
jest.mock("../../logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe("Books API - DELETE", () => {
  let testAuthor: Author;
  let testBook: Book;

  beforeEach(async () => {
    await TestSetup.setup();

    testAuthor = await authorModel.create(testAuthors[0] as Author);
    testBook = await bookModel.create({
      ...testBooks[0],
      authorId: testAuthor.id,
    } as Book);
  });

  afterAll(async () => {
    await TestSetup.teardown();
  });

  describe("DELETE /v1/books/:id", () => {
    it("should delete a book successfully", async () => {
      const response = await TestSetup.fastify.inject({
        method: "DELETE",
        url: `/v1/books/${testBook.id}`,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.message).toBe("Book deleted successfully");
      expect(result.timestamp).toBeDefined();

      const deletedBook = await bookModel.findById(testBook.id);
      expect(deletedBook).toBeNull();
    });

    it("should return 404 for non-existent book", async () => {
      const nonExistentId = "123e4567-e89b-12d3-a456-426614174000";

      const response = await TestSetup.fastify.inject({
        method: "DELETE",
        url: `/v1/books/${nonExistentId}`,
      });

      expect(response.statusCode).toBe(404);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Book not found");
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await TestSetup.fastify.inject({
        method: "DELETE",
        url: "/v1/books/invalid-uuid",
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain('params/id must match format "uuid"');
    });

    it("should return 400 for malformed UUID", async () => {
      const response = await TestSetup.fastify.inject({
        method: "DELETE",
        url: "/v1/books/not-a-uuid-at-all",
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain('params/id must match format "uuid"');
    });

    it("should verify cascade behavior (book deletion doesn't affect author)", async () => {
      const book2 = await bookModel.create({
        ...testBooks[1],
        authorId: testAuthor.id,
      } as Book);

      const response = await TestSetup.fastify.inject({
        method: "DELETE",
        url: `/v1/books/${testBook.id}`,
      });

      expect(response.statusCode).toBe(200);

      const author = await authorModel.findById(testAuthor.id);
      expect(author).not.toBeNull();
      expect(author?.name).toBe(testAuthor.name);

      const remainingBook = await bookModel.findById(book2.id);
      expect(remainingBook).not.toBeNull();
      expect(remainingBook?.title).toBe(testBooks[1].title);
    });

    it("should handle empty UUID parameter", async () => {
      const response = await TestSetup.fastify.inject({
        method: "DELETE",
        url: "/v1/books/",
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
    });

    it("should handle UUID with extra parameters", async () => {
      const response = await TestSetup.fastify.inject({
        method: "DELETE",
        url: `/v1/books/${testBook.id}?extra=param`,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.message).toBe("Book deleted successfully");
    });
  });
});
