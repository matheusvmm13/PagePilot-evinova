import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import logger from "./logger";
import { authorRoutes, bookRoutes } from "./routes";

dotenv.config();

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Health check
  fastify.get("/health", async (request, reply) => {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // API info
  fastify.get("/", async (request, reply) => {
    return {
      message: "PagePilot API",
      version: "1.0.0",
      endpoints: {
        authors: "/authors",
        books: "/books",
        health: "/health",
      },
    };
  });

  // Register routes
  await fastify.register(authorRoutes, { prefix: "/authors" });
  await fastify.register(bookRoutes, { prefix: "/books" });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || "0.0.0.0";

  try {
    await fastify.listen({ port: Number(port), host });
    logger.info(
      `🚀 PagePilot API server is running on http://localhost:${port}`
    );
    logger.info(`👤 Authors API: http://localhost:${port}/authors`);
    logger.info(`📚 Books API: http://localhost:${port}/books`);
    logger.info(`❤️ Health check: http://localhost:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Start the server
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
