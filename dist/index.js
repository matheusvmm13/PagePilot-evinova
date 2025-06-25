"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const fastify = (0, fastify_1.default)({
    logger: true,
});
// Register plugins
fastify.register(cors_1.default);
fastify.register(helmet_1.default);
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
    logger_1.default.info(`Server is running on http://localhost:${port}`);
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
