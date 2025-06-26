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

describe("Authors API - GET", () => {
  beforeEach(async () => {
    await TestSetup.setup();
  });

  afterAll(async () => {
    await TestSetup.teardown();
  });

  describe("GET /v1/authors", () => {
    it("should return empty array when no authors exist", async () => {
      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: "/v1/authors",
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

    it("should return all authors with pagination", async () => {
      await authorModel.create(testAuthors[0] as Author);
      await authorModel.create(testAuthors[1] as Author);

      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: "/v1/authors",
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.items).toHaveLength(2);
      expect(result.data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });

      const authorNames = result.data.items.map(
        (author: Author) => author.name
      );
      expect(authorNames).toContain(testAuthors[0].name);
      expect(authorNames).toContain(testAuthors[1].name);
    });

    it("should handle pagination parameters", async () => {
      for (let i = 0; i < 15; i++) {
        await authorModel.create({
          name: `Author ${i + 1}`,
          bio: `Bio for author ${i + 1}`,
          birthYear: 1980 + i,
        });
      }

      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: "/v1/authors?page=2&limit=5",
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
      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: "/v1/authors?page=-1&limit=0",
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
    });

    it("should return correct content type header", async () => {
      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: "/v1/authors",
      });

      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });
  });

  describe("GET /v1/authors/:id", () => {
    it("should return author by ID", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);

      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: `/v1/authors/${author.id}`,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(author.id);
      expect(result.data.name).toBe(testAuthors[0].name);
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: "/v1/authors/invalid-uuid",
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /v1/authors/:id/books", () => {
    it("should return author's books", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);

      await bookModel.create({
        ...testBooks[0],
        authorId: author.id,
      } as Book);

      await bookModel.create({
        ...testBooks[1],
        authorId: author.id,
      } as Book);

      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: `/v1/authors/${author.id}/books`,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.books[0].authorId).toBe(author.id);
      expect(result.data.books[1].authorId).toBe(author.id);
    });

    it("should return empty array when author has no books", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);

      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: `/v1/authors/${author.id}/books`,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.books).toHaveLength(0);
    });

    it("should return 400 for invalid UUID", async () => {
      const response = await TestSetup.fastify.inject({
        method: "GET",
        url: "/v1/authors/invalid-uuid/books",
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
