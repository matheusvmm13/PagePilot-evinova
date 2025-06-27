import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import logger from "./logger";
import { authorRoutes, bookRoutes, utilityRoutes } from "./routes";

declare module "fastify" {
  interface FastifyRequest {
    startTime?: number;
  }
}

export function buildFastify(registerRoutes = false) {
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

  if (registerRoutes) {
    fastify.register(authorRoutes, { prefix: "/v1/authors" });
    fastify.register(bookRoutes, { prefix: "/v1/books" });
    fastify.register(utilityRoutes);
  }

  return fastify;
}

async function startServer() {
  const fastify = buildFastify();

  try {
    await fastify.register(cors, { origin: true });
    await fastify.register(helmet, { contentSecurityPolicy: false });

    await fastify.register(swagger, {
      openapi: {
        info: {
          title: "PagePilot API",
          description: "API documentation for the PagePilot backend service.",
          version: "1.0.0",
        },
        servers: [{ url: "http://localhost:3000" }],
        tags: [
          { name: "Authors", description: "Author related end-points" },
          { name: "Books", description: "Book related end-points" },
          { name: "Utility", description: "Utility and health checks" },
        ],
      },
    });

    await fastify.register(swaggerUI, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
    });

    // Register routes
    fastify.register(authorRoutes, { prefix: "/v1/authors" });
    fastify.register(bookRoutes, { prefix: "/v1/books" });
    fastify.register(utilityRoutes);

    const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT || 3000;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port: Number(port), host });
    logger.info(`Server is running on http://${host}:${port}/v1`);
    logger.info(`Swagger docs available at http://${host}:${port}/docs`);
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") startServer();
