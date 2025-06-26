import { authorModel } from "../authorModel";
import { testAuthors } from "../../__tests__/helpers/testData";
import { Author } from "../../types/author";

describe("AuthorModel", () => {
  beforeEach(async () => {
    await authorModel.clear();
  });

  describe("create", () => {
    it("should create a new author successfully", async () => {
      const authorData = {
        name: "J.K. Rowling",
        bio: "British author best known for the Harry Potter series",
        birthYear: 1965,
      };

      const author = await authorModel.create(authorData);

      expect(author).toBeDefined();
      expect(author.id).toBeDefined();
      expect(author.name).toBe(authorData.name);
      expect(author.bio).toBe(authorData.bio);
      expect(author.birthYear).toBe(authorData.birthYear);
      expect(author.createdAt).toBeInstanceOf(Date);
      expect(author.updatedAt).toBeInstanceOf(Date);
    });

    it("should create author using test data", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);

      expect(author.name).toBe(testAuthors[0].name);
      expect(author.bio).toBe(testAuthors[0].bio);
      expect(author.birthYear).toBe(testAuthors[0].birthYear);
    });

    it("should set timestamps correctly", async () => {
      const beforeCreate = new Date();
      const author = await authorModel.create(testAuthors[0] as Author);
      const afterCreate = new Date();

      expect(author.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(author.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
      expect(author.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(author.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
    });
  });

  describe("findAll", () => {
    it("should return empty array when no authors exist", async () => {
      const authors = await authorModel.findAll();

      expect(authors).toEqual([]);
    });

    it("should return all authors", async () => {
      const author1 = await authorModel.create(testAuthors[0] as Author);
      const author2 = await authorModel.create(testAuthors[1] as Author);

      const authors = await authorModel.findAll();

      expect(authors).toHaveLength(2);
      expect(authors).toContainEqual(author1);
      expect(authors).toContainEqual(author2);
    });

    it("should return authors in creation order", async () => {
      const author1 = await authorModel.create(testAuthors[0] as Author);
      const author2 = await authorModel.create(testAuthors[1] as Author);
      const author3 = await authorModel.create(testAuthors[2] as Author);

      const authors = await authorModel.findAll();

      expect(authors[0].id).toBe(author1.id);
      expect(authors[1].id).toBe(author2.id);
      expect(authors[2].id).toBe(author3.id);
    });
  });

  describe("findById", () => {
    it("should return author by ID", async () => {
      const createdAuthor = await authorModel.create(testAuthors[0] as Author);
      const foundAuthor = await authorModel.findById(createdAuthor.id);

      expect(foundAuthor).toEqual(createdAuthor);
    });

    it("should return null for non-existent ID", async () => {
      const nonExistentId = "123e4567-e89b-12d3-a456-426614174000";
      const author = await authorModel.findById(nonExistentId);

      expect(author).toBeNull();
    });

    it("should return null for invalid UUID format", async () => {
      const author = await authorModel.findById("invalid-uuid");

      expect(author).toBeNull();
    });
  });

  describe("update", () => {
    it("should update author successfully", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);
      const originalUpdatedAt = author.updatedAt;

      const updates = {
        name: "Updated Name",
        bio: "Updated bio",
      };

      const updatedAuthor = await authorModel.update(author.id, updates);

      expect(updatedAuthor).not.toBeNull();
      expect(updatedAuthor?.name).toBe(updates.name);
      expect(updatedAuthor?.bio).toBe(updates.bio);
      expect(updatedAuthor?.birthYear).toBe(author.birthYear);
      expect(updatedAuthor?.createdAt).toEqual(author.createdAt);
    });

    it("should return null for non-existent author", async () => {
      const nonExistentId = "123e4567-e89b-12d3-a456-426614174000";
      const result = await authorModel.update(nonExistentId, {
        name: "New Name",
      });

      expect(result).toBeNull();
    });

    it("should update only specified fields", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);
      const originalName = author.name;
      const originalBio = author.bio;

      const result = await authorModel.update(author.id, { birthYear: 1990 });

      expect(result).not.toBeNull();
      expect(result?.name).toBe(originalName); // Unchanged
      expect(result?.bio).toBe(originalBio); // Unchanged
      expect(result?.birthYear).toBe(1990); // Changed
    });

    it("should handle empty updates", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);
      const originalUpdatedAt = author.updatedAt;

      const result = await authorModel.update(author.id, {});

      expect(result).not.toBeNull();
      expect(result).toEqual(author);
    });
  });

  describe("delete", () => {
    it("should delete author successfully", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);
      const result = await authorModel.delete(author.id);

      expect(result).toBe(true);

      const deletedAuthor = await authorModel.findById(author.id);
      expect(deletedAuthor).toBeNull();
    });
  });

  describe("findByName", () => {
    it("should find author by exact name", async () => {
      const author = await authorModel.create(testAuthors[0] as Author);
      const foundAuthor = await authorModel.findByName(author.name);

      expect(foundAuthor).toEqual(author);
    });

    it("should return null for non-existent name", async () => {
      const result = await authorModel.findByName("Non-existent Author");

      expect(result).toBeNull();
    });

    it("should handle multiple authors with similar names", async () => {
      await authorModel.create({
        name: "John Smith",
        bio: "Bio 1",
        birthYear: 1980,
      });
      await authorModel.create({
        name: "Jane Smith",
        bio: "Bio 2",
        birthYear: 1985,
      });

      const foundAuthor = await authorModel.findByName("John Smith");

      expect(foundAuthor?.name).toBe("John Smith");
      expect(foundAuthor?.bio).toBe("Bio 1");
    });
  });

  describe("searchByName", () => {
    it("should find authors by partial name match", async () => {
      await authorModel.create({
        name: "John Smith",
        bio: "Bio 1",
        birthYear: 1980,
      });
      await authorModel.create({
        name: "Jane Smith",
        bio: "Bio 2",
        birthYear: 1985,
      });
      await authorModel.create({
        name: "Bob Johnson",
        bio: "Bio 3",
        birthYear: 1990,
      });

      const results = await authorModel.searchByName("Smith");

      expect(results).toHaveLength(2);
      expect(results[0].name).toBe("John Smith");
      expect(results[1].name).toBe("Jane Smith");
    });

    it("should return empty array for no matches", async () => {
      await authorModel.create({
        name: "John Smith",
        bio: "Bio 1",
        birthYear: 1980,
      });

      const results = await authorModel.searchByName("Johnson");

      expect(results).toHaveLength(0);
    });

    it("should return empty array for empty search term", async () => {
      await authorModel.create({
        name: "John Smith",
        bio: "Bio 1",
        birthYear: 1980,
      });

      const results = await authorModel.searchByName("");
      console.log("results", results);

      expect(results).toHaveLength(0);
    });

    it("should handle single character search", async () => {
      await authorModel.create({
        name: "John Smith",
        bio: "Bio 1",
        birthYear: 1980,
      });
      await authorModel.create({
        name: "Jane Smith",
        bio: "Bio 2",
        birthYear: 1985,
      });

      const results = await authorModel.searchByName("J");

      expect(results).toHaveLength(2);
    });
  });

  describe("clear", () => {
    it("should clear all authors", async () => {
      await authorModel.create(testAuthors[0] as Author);
      await authorModel.create(testAuthors[1] as Author);

      expect(await authorModel.findAll()).toHaveLength(2);

      await authorModel.clear();

      expect(await authorModel.findAll()).toHaveLength(0);
    });

    it("should handle clearing empty model", async () => {
      expect(await authorModel.findAll()).toHaveLength(0);

      await authorModel.clear();

      expect(await authorModel.findAll()).toHaveLength(0);
    });
  });

  describe("count", () => {
    it("should return correct count", async () => {
      expect(await authorModel.count()).toBe(0);

      await authorModel.create(testAuthors[0] as Author);
      expect(await authorModel.count()).toBe(1);

      await authorModel.create(testAuthors[1] as Author);
      expect(await authorModel.count()).toBe(2);

      await authorModel.delete((await authorModel.findAll())[0].id);
      expect(await authorModel.count()).toBe(1);
    });
  });
});
