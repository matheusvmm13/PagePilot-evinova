import { Type } from "@sinclair/typebox";

export const ErrorResponseSchema = Type.Object({
  success: Type.Boolean(),
  error: Type.String(),
  message: Type.String(),
  timestamp: Type.String({ format: "date-time" }),
});

export const SuccessResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Any(),
  timestamp: Type.String({ format: "date-time" }),
});

export const PaginatedResponseSchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, default: 10 })),
});

export const CommonHeadersSchema = Type.Object({
  "user-agent": Type.Optional(Type.String()),
  "x-request-id": Type.Optional(Type.String()),
});

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
