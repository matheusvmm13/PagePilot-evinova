# PagePilot Backend API

A Node.js API built with Fastify and TypeScript for managing books and authors.

## Table of Contents

- [Quick Start](#quick-start)
- [Development](#development)
- [Docker](#docker)
- [API Documentation](#api-documentation)
  - [Swagger Documentation](#swagger-documentation)
  - [Base URL & Health](#base-url--health)
  - [Authors](#authors)
  - [Books](#books)
  - [Error Handling](#error-handling)
- [Validation](#validation)
- [Future Improvements](#future-improvements)

## Quick Start

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run with Docker
npm run docker:up
```

## Development

```bash
# Development mode
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

## Docker

```bash
# Build and run
npm run docker:up

# Stop
npm run docker:down

# Build only
npm run docker:build
```

## API Documentation

### Swagger Documentation

**Interactive API Documentation:** `http://localhost:3000/docs`

The API includes comprehensive Swagger/OpenAPI documentation that you can explore all available endpoints, test them directly from the browser, and view detailed schema information.

### Base URL & Health

**Base URL:** `http://localhost:3000`

| Endpoint  | Method | Description       |
| --------- | ------ | ----------------- |
| `/v1`     | GET    | API version info  |
| `/health` | GET    | API health status |

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

### Authors

| Endpoint                    | Method | Description        | Query Params    |
| --------------------------- | ------ | ------------------ | --------------- |
| `GET /v1/authors`           | GET    | List all authors   | `page`, `limit` |
| `GET /v1/authors/:id`       | GET    | Get author by ID   | -               |
| `POST /v1/authors`          | POST   | Create new author  | -               |
| `PUT /v1/authors/:id`       | PUT    | Update author      | -               |
| `DELETE /v1/authors/:id`    | DELETE | Delete author      | -               |
| `GET /v1/authors/:id/books` | GET    | Get author's books | -               |
| `GET /v1/authors/search`    | GET    | Search authors     | `q`             |

**Example Request (Create Author):**

```json
{
  "name": "Marie Smith",
  "bio": "A prolific writer...",
  "birthYear": 1980
}
```

**Example Response (List Authors):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Marie Smith",
        "bio": "A prolific writer...",
        "birthYear": 1980,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Books

| Endpoint                   | Method | Description     | Query Params    |
| -------------------------- | ------ | --------------- | --------------- |
| `GET /v1/books`            | GET    | List all books  | `page`, `limit` |
| `GET /v1/books/:id`        | GET    | Get book by ID  | -               |
| `POST /v1/books`           | POST   | Create new book | -               |
| `PUT /v1/books/:id`        | PUT    | Update book     | -               |
| `DELETE /v1/books/:id`     | DELETE | Delete book     | -               |
| `GET /v1/books/search`     | GET    | Search books    | `q`             |
| `GET /v1/books/year/:year` | GET    | Books by year   | -               |

**Example Request (Create Book):**

```json
{
  "title": "The Great Novel",
  "summary": "An awesome story...",
  "publicationYear": 2020,
  "authorId": "author-uuid"
}
```

**Example Response (List Books):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "The Great Novel",
        "summary": "An awesome story...",
        "publicationYear": 2020,
        "authorId": "author-uuid",
        "author": {
          "id": "author-uuid",
          "name": "Marie Smith"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Handling

**Error Response Format:**

```json
{
  "success": false,
  "error": "Error message description",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate name/title)
- `422` - Validation Error
- `500` - Internal Server Error

## Validation

This API uses **TypeBox** for schema validation, providing:

**Validation Rules:**

- **Author:** `name` (1-100 chars), `bio` (1-1000 chars), `birthYear` (1800-current)
- **Book:** `title` (1-200 chars), `summary` (1-2000 chars), `publicationYear` (1500-current), `authorId` (UUID)

### **Schema Examples**

**Author Creation Schema:**

```typescript
const CreateAuthorSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  bio: Type.String({ minLength: 1, maxLength: 1000 }),
  birthYear: Type.Number({ minimum: 1800, maximum: new Date().getFullYear() }),
});
```

**Book Response Schema:**

```typescript
const BookResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  summary: Type.String(),
  publicationYear: Type.Number(),
  authorId: Type.String({ format: "uuid" }),
  author: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});
```

**Route Integration:**

```typescript
fastify.post(
  "/",
  {
    schema: {
      body: CreateAuthorSchema,
      response: {
        201: AuthorResponseSchema,
      },
    },
  },
  handler
);
```

### **Automatic Validation**

- **Request Validation** - Incoming data is validated against schemas
- **Response Validation** - Outgoing data is validated before sending
- **Type Safety** - TypeScript types are automatically inferred
- **Error Handling** - Invalid requests return 422 with detailed errors

## Future Improvements

### Architecture Enhancements

- **Database Integration**: MongoDB/PostgreSQL with ORM
- **Repository Pattern**: For database abstraction and testing
- **Authentication**: JWT tokens and user access
- **Rate Limiting**: API request throttling
- **Caching**: For performance optimization

### Current Benefits

- **Clean Architecture**: Routes → Handlers → Services → Models
- **Type Safety**: Full TypeScript with TypeBox schemas
- **Schema Validation**: Runtime validation with TypeBox
- **In-Memory Storage**: Fast development and testing
- **UUID Generation**: Proper ID management
- **Error Handling**: Centralized error management
- **API Documentation**: OpenAPI/Swagger integration
- **Docker Support**: Containerized deployment ready
- **Extensible Design**: Easy to add new features

This foundation would allow for an easy migration to more complex architectures as requirements evolve.
