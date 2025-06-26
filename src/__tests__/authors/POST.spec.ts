import { FastifyInstance } from "fastify";
import { buildFastify } from "../../index";
import { authorModel } from "../../models/authorModel";
import { testAuthors, invalidAuthorData } from "../helpers/testData";
import { Author } from "../../types/author";

// Mock the logger to avoid console output during tests
jest.mock("../../logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe("Authors API - POST", () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = buildFastify();
    await fastify.ready();
    await authorModel.clear();
  });

  afterEach(async () => {
    await fastify.close();
  });

  describe("POST /v1/authors", () => {
    it("should create a new author successfully", async () => {
      const authorData = {
        name: "J.K. Rowling",
        bio: "British author best known for the Harry Potter series",
        birthYear: 1965,
      };

      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: authorData,
      });

      expect(response.statusCode).toBe(201);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe(authorData.name);
      expect(result.data.bio).toBe(authorData.bio);
      expect(result.data.birthYear).toBe(authorData.birthYear);
      expect(result.data.id).toBeDefined();
      expect(result.data.createdAt).toBeDefined();
      expect(result.data.updatedAt).toBeDefined();
    });

    it("should create author using test data", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: testAuthors[0],
      });

      expect(response.statusCode).toBe(201);
      const result = JSON.parse(response.payload);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe(testAuthors[0].name);
      expect(result.data.bio).toBe(testAuthors[0].bio);
      expect(result.data.birthYear).toBe(testAuthors[0].birthYear);
    });

    it("should validate required fields - missing name", async () => {
      const invalidData = {
        bio: "Valid bio",
        birthYear: 1980,
      };

      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: invalidData,
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain(
        "body must have required property 'name'"
      );
    });

    it("should validate required fields - missing bio", async () => {
      const invalidData = {
        name: "Valid name",
        birthYear: 1980,
      };

      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: invalidData,
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain(
        "body must have required property 'bio'"
      );
    });

    it("should validate required fields - missing birthYear", async () => {
      const invalidData = {
        name: "Valid name",
        bio: "Valid bio",
      };

      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: invalidData,
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain(
        "body must have required property 'birthYear'"
      );
    });

    it("should validate empty name", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: invalidAuthorData[0],
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain(
        "body/name must NOT have fewer than 1 characters"
      );
    });

    it("should validate empty bio", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: invalidAuthorData[1],
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain(
        "body/bio must NOT have fewer than 1 characters"
      );
    });

    it("should validate birth year range - too old", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: invalidAuthorData[2],
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain("body/birthYear must be >= 1800");
    });

    it("should validate birth year range - future year", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: invalidAuthorData[3],
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain("body/birthYear must be <= 2025");
    });

    it("should validate name length - too long", async () => {
      const longName = "A".repeat(101);
      const authorData = {
        name: longName,
        bio: "Valid bio",
        birthYear: 1980,
      };

      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: authorData,
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain(
        "body/name must NOT have more than 100 characters"
      );
    });

    it("should validate bio length - too long", async () => {
      const longBio = "A".repeat(1001);
      const authorData = {
        name: "Valid name",
        bio: longBio,
        birthYear: 1980,
      };

      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: authorData,
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain(
        "body/bio must NOT have more than 1000 characters"
      );
    });

    it("should return correct content type header", async () => {
      const authorData = {
        name: "Test Author",
        bio: "Test bio",
        birthYear: 1980,
      };

      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: authorData,
      });

      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
    });

    it("should handle malformed JSON", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: "invalid json",
        headers: {
          "content-type": "application/json",
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it("should handle empty payload", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/v1/authors",
        payload: {},
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);

      expect(result.error).toContain("Bad Request");
      expect(result.message).toContain("body must have required property");
    });
  });
});
