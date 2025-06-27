import { FastifyInstance } from "fastify";
import logger from "../logger";

export default async function utilityRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get(
    "/health",
    {
      schema: {
        summary: "API Health Status",
        tags: ["Utility"],
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    async () => {
      logger.info("Health check requested");
      return { status: "ok", timestamp: new Date().toISOString() };
    }
  );

  // API version info
  fastify.get(
    "/v1",
    {
      schema: {
        summary: "API Version Information",
        tags: ["Utility"],
        response: {
          200: {
            type: "object",
            properties: {
              version: { type: "string" },
              status: { type: "string" },
              endpoints: {
                type: "object",
                properties: {
                  authors: { type: "string" },
                  books: { type: "string" },
                  health: { type: "string" },
                  docs: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async () => {
      return {
        version: "1.0.0",
        status: "active",
        endpoints: {
          authors: "/v1/authors",
          books: "/v1/books",
          health: "/health",
          docs: "/docs",
        },
      };
    }
  );
}
