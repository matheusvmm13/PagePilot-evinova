import { FastifyInstance } from "fastify";
import { buildFastify } from "../../index";
import { authorModel } from "../../models/authorModel";
import { bookModel } from "../../models/bookModel";

export class TestSetup {
  static fastify: FastifyInstance;

  static async setup() {
    this.fastify = buildFastify(true);
    await this.fastify.ready();
    await this.clearData();
  }

  static async teardown() {
    await this.fastify.close();
  }

  static async clearData() {
    await authorModel.clear();
    await bookModel.clear();
  }

  static async createTestAuthor(data: any = {}) {
    return await authorModel.create({
      name: data.name || "Test Author",
      bio: data.bio || "Test bio",
      birthYear: data.birthYear || 1980,
    });
  }

  static async createTestBook(authorId: string, data: any = {}) {
    return await bookModel.create({
      title: data.title || "Test Book",
      summary: data.summary || "Test summary",
      publicationYear: data.publicationYear || 2020,
      authorId,
    });
  }
}
