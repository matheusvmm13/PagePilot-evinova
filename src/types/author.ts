import { Type } from "@sinclair/typebox";
import { BaseEntity } from "./common";

export interface Author extends BaseEntity {
  name: string;
  bio: string;
  birthYear: number;
}

// Author creation schema
export const CreateAuthorSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  bio: Type.String({ minLength: 1, maxLength: 1000 }),
  birthYear: Type.Number({ minimum: 1800, maximum: new Date().getFullYear() }),
});

// Author update schema
export const UpdateAuthorSchema = Type.Partial(CreateAuthorSchema);

// Author response schema
export const AuthorResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  bio: Type.String(),
  birthYear: Type.Number(),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

// Authors list response schema
export const AuthorsListResponseSchema = Type.Object({
  authors: Type.Array(AuthorResponseSchema),
  pagination: Type.Object({
    page: Type.Number(),
    limit: Type.Number(),
    total: Type.Number(),
    totalPages: Type.Number(),
  }),
});
