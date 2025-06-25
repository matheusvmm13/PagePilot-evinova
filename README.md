# EXPRESS TYPESCRIPT API

This is boilerplate of a Node.js API using Express and Typescript.


## Installing dependencies

```
npm install
```

## Building the application

```
npm run docker:build
```

## Running the application

```
npm run docker:up
```

## Closing the application

```
npm docker:down
```

## Testing

With the application running:

```
npm test
```

## Development

### Running in development mode

```
npm run dev
```

### Auto-fix and format

```
npm run lint
```

## Docker

### Running from Dockerfile

From the app directory run:

```
docker build . -t <image name>
docker run -dp 3000:3000 <image name>
```

### Running from dockercompose.yaml

From the app directory run:

```
docker-compose build
docker-compose up
```

## Documentation

---

## API endpoints:

### Rest Endpoint:

`http://localhost:3000`

## **Get Something**

Returns json data with something.

| URL          | Method | Params | Query                                      | Success response | Error response |
| ------------ | ------ | ------ | ------------------------------------------ | ---------------- | -------------- |
| `/countries` | GET    | None   | `filter=[string], order=['asc' or 'desc']` | Status 200       | Status 404     |
