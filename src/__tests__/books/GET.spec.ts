import { FastifyInstance } from "fastify";
import { buildFastify } from "../../index";
import { authorModel } from "../../models/authorModel";
import { bookModel } from "../../models/bookModel";
import { testAuthors, testBooks } from "../helpers/testData";
import { Author } from "../../types/author";
import { Book } from "../../types/books";

// Mock the logger to avoid console output during tests
jest.mock("../../logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe("Books API - GET", () => {
  let fastify: FastifyInstance;
  let testAuthor: Author;

  beforeEach(async () => {
    fastify = buildFastify();
    await fastify.ready();
    await authorModel.clear();
    await bookModel.clear();

    testAuthor = await authorModel.create(testAuthors[0] as Author);
  });

  afterEach(async () => {
    await fastify.close();
  });

  describe("GET /v1/books", () => {
    it("should return empty array when no books exist", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual({
        success: true,
        data: {
          items: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        },
        timestamp: expect.any(String),
      });
    });

    it("should return all books with author information", async () => {
      await bookModel.create({
        ...testBooks[0],
        authorId: testAuthor.id,
      } as Book);

      await bookModel.create({
        ...testBooks[1],
        authorId: testAuthor.id,
      } as Book);

      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books",
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      console.log(result.data.items);

      expect(result.success).toBe(true);
      expect(result.data.items).toHaveLength(2);
      expect(result.data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });

      expect(result.data.items[0].author).toBeDefined();
      expect(result.data.items[0].author.name).toBe(testAuthor.name);
      expect(result.data.items[1].author).toBeDefined();
      expect(result.data.items[1].author.name).toBe(testAuthor.name);
    });

    it("should handle pagination parameters", async () => {
      for (let i = 0; i < 15; i++) {
        await bookModel.create({
          title: `Book ${i + 1}`,
          summary: `Summary for book ${i + 1}`,
          publicationYear: 2020 + i,
          authorId: testAuthor.id,
        });
      }

      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books?page=2&limit=5",
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.data.items).toHaveLength(5);
      expect(result.data.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3,
      });
    });

    it("should handle invalid pagination parameters", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books?page=-1&limit=0",
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
    });

    it("should return correct content type header", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books",
      });

      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });
  });

  describe("GET /v1/books/:id", () => {
    it("should return book by ID with author information", async () => {
      const book = await bookModel.create({
        ...testBooks[0],
        authorId: testAuthor.id,
      } as Book);

      const response = await fastify.inject({
        method: "GET",
        url: `/v1/books/${book.id}`,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(book.id);
      expect(result.data.title).toBe(testBooks[0].title);
      expect(result.data.author).toBeDefined();
      expect(result.data.author.name).toBe(testAuthor.name);
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books/invalid-uuid",
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /v1/books/search", () => {
    it("should search books by title", async () => {
      await bookModel.create({
        title: "The Great Gatsby",
        summary: "A story about an American rich man",
        publicationYear: 1925,
        authorId: testAuthor.id,
      });

      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books/search?q=Gatsby",
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      console.log(result);

      expect(result.success).toBe(true);
      expect(result.data.books).toHaveLength(1);
      expect(result.data.books[0].title).toBe("The Great Gatsby");
    });

    it("should return empty array when no matches found", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books/search?q=nonexistent",
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.books).toHaveLength(0);
    });

    it("should handle search without query parameter", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books/search",
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
    });
  });

  describe("GET /v1/books/year/:year", () => {
    it("should return books by publication year", async () => {
      await bookModel.create({
        title: "Book 2020",
        summary: "A book from 2020",
        publicationYear: 2020,
        authorId: testAuthor.id,
      });

      await bookModel.create({
        title: "Book 2021",
        summary: "A book from 2021",
        publicationYear: 2021,
        authorId: testAuthor.id,
      });

      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books/year/2020",
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.books).toHaveLength(1);
      expect(result.data.books[0].title).toBe("Book 2020");
      expect(result.data.books[0].publicationYear).toBe(2020);
    });

    it("should return empty array for year with no books", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books/year/1999",
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.books).toHaveLength(0);
    });

    it("should return 400 for invalid year parameter", async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/v1/books/year/invalid",
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
