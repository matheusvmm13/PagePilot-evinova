import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Register plugins
fastify.register(cors);
fastify.register(helmet);

// Add a test endpoint
fastify.get("/", async (request, reply) => {
  return { message: "PagePilot API is running!" };
});

fastify.get("/health", async (request, reply) => {
  return { status: "OK", timestamp: new Date().toISOString() };
});

// Register routes
// fastify.register(routes);

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

try {
  fastify.listen({ port: Number(port), host }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server is running on ${address}`);
  });
  logger.info(`Server is running on http://localhost:${port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
