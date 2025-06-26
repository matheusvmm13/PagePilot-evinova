import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import logger from "./logger";
import authorRoutes from "./routes/authors";
import bookRoutes from "./routes/books";

declare module "fastify" {
  interface FastifyRequest {
    startTime?: number;
  }
}

export function buildFastify() {
  const fastify = Fastify({
    logger: false,
  });

  // Request timing and logging
  fastify.addHook("onRequest", (request, reply, done) => {
    request.startTime = Date.now();
    logger.info(`Request: ${request.method} ${request.url}`);
    done();
  });

  fastify.addHook("onResponse", (request, reply, done) => {
    const duration = Date.now() - (request.startTime || Date.now());
    logger.info(
      `${request.method} ${request.url} → ${
        reply.statusCode
      } (${duration.toFixed(2)}ms)`
    );
    done();
  });

  // Register routes
  fastify.register(authorRoutes, { prefix: "/v1/authors" });
  fastify.register(bookRoutes, { prefix: "/v1/books" });

  // Health check
  fastify.get("/health", async () => {
    logger.info("Health check requested");
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // API version info
  fastify.get("/v1", async () => {
    return {
      version: "1.0.0",
      status: "active",
      endpoints: {
        authors: "/v1/authors",
        books: "/v1/books",
        health: "/health",
      },
    };
  });

  return fastify;
}

// Server startup
async function startServer() {
  const fastify = buildFastify();

  try {
    await fastify.register(cors, { origin: true });
    await fastify.register(helmet, { contentSecurityPolicy: false });

    const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT || 3000;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port: Number(port), host });
    logger.info(`Server is running on http://${host}:${port}`);
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
}

startServer();
