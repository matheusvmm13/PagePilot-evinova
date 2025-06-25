import { FastifyReply } from "fastify";

export class ResponseHandler {
  static success<T>(reply: FastifyReply, data: T, statusCode: number = 200) {
    return reply.status(statusCode).send({
      success: true,
      data,
    });
  }

  static error(reply: FastifyReply, message: string, statusCode: number = 400) {
    return reply.status(statusCode).send({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }

  static notFound(reply: FastifyReply, resource: string) {
    return this.error(reply, `${resource} not found`, 404);
  }

  static conflict(reply: FastifyReply, message: string) {
    return this.error(reply, message, 409);
  }

  static validationError(reply: FastifyReply, message: string) {
    return this.error(reply, message, 422);
  }

  static serverError(
    reply: FastifyReply,
    message: string = "Internal server error"
  ) {
    return this.error(reply, message, 500);
  }
}
