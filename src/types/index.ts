import { Static } from "@sinclair/typebox";
import {
  CommonHeadersSchema,
  ErrorResponseSchema,
  PaginatedResponseSchema,
  SuccessResponseSchema,
} from "./common";
import {
  AuthorResponseSchema,
  AuthorsListResponseSchema,
  CreateAuthorSchema,
  UpdateAuthorSchema,
} from "./author";
import {
  BookResponseSchema,
  BooksListResponseSchema,
  CreateBookSchema,
  UpdateBookSchema,
} from "./books";

// Common types
export type ErrorResponse = Static<typeof ErrorResponseSchema>;
export type SuccessResponse = Static<typeof SuccessResponseSchema>;
export type PaginatedResponse = Static<typeof PaginatedResponseSchema>;
export type CommonHeaders = Static<typeof CommonHeadersSchema>;

// Author types
export type CreateAuthor = Static<typeof CreateAuthorSchema>;
export type UpdateAuthor = Static<typeof UpdateAuthorSchema>;
export type AuthorResponse = Static<typeof AuthorResponseSchema>;
export type AuthorsListResponse = Static<typeof AuthorsListResponseSchema>;

// Book types
export type CreateBook = Static<typeof CreateBookSchema>;
export type UpdateBook = Static<typeof UpdateBookSchema>;
export type BookResponse = Static<typeof BookResponseSchema>;
export type BooksListResponse = Static<typeof BooksListResponseSchema>;
