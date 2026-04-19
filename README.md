# personal-api

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002.svg?style=for-the-badge&logo=Hono&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-00FF74.svg?style=for-the-badge&logo=Vitest&logoColor=white)

A personal REST API built with [Hono](https://hono.dev/), providing various endpoints for personal information, GitHub stats, service status, sorting algorithms, and an implementation of the [HTCPCP/1.0](https://datatracker.ietf.org/doc/html/rfc2324) protocol.

## Setup

```bash
npm install
npm run dev
```

The API runs at `http://localhost:3000`.

## Scripts

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start dev server with hot reload |
| `npm run build`         | Compile TypeScript               |
| `npm start`             | Run compiled output              |
| `npm test`              | Run tests                        |
| `npm run test:coverage` | Run tests with coverage          |
| `npm run test:watch`    | Run tests in watch mode          |

## Environment Variables

| Variable       | Description                                             |
| -------------- | ------------------------------------------------------- |
| `GITHUB_TOKEN` | GitHub personal access token for the `/github` endpoint |

## Endpoints

### `GET /`

Lists all available endpoints dynamically based on registered routes.

### `GET /info`

Returns a greeting text.

### `GET /github`

Returns GitHub profile and repository data. Requires the `format` query parameter.

| Parameter | Values         | Description     |
| --------- | -------------- | --------------- |
| `format`  | `json`, `text` | Response format |

**`GET /github?format=json`** returns profile data including name, email, location, bio, top languages, follower count, public repos, and total star count.

**`GET /github?format=text`** returns a formatted plaintext summary.

### `GET /status`

Returns the status of all monitored services. Data is fetched from [Uptime Kuma](https://status.moritz-grimm.dev) and cached for 60 seconds.

Each entry includes `name`, `slug`, `href`, `status`, `ping`, and `uptime24h`.

### `GET /status/:monitor`

Returns the status of a single monitor. Accepts either the slug (e.g. `homepage`) or the full address (e.g. `www.moritz-grimm.dev`).

Returns `404` if the monitor is not found.

### `GET /algorithms`

Lists all available algorithms with their descriptions.

### `POST /algorithms/sorting/:algorithm`

Sorts an array of numbers using the specified algorithm.

**Available algorithms:** `bubble-sort`, `selection-sort`, `elon-sort`

**Request body:**

```json
{
    "arr": [5, 3, 1, 4, 2]
}
```

**Response:**

```json
{
    "time": 0.042,
    "result": [1, 2, 3, 4, 5]
}
```

| Status | Condition                                                     |
| ------ | ------------------------------------------------------------- |
| `200`  | Sorted successfully                                           |
| `400`  | Invalid/missing body or array, max array size (2000) exceeded |
| `404`  | Unknown algorithm                                             |
| `422`  | Array contains non-number values                              |

### `POST /algorithms/search/:algorithm`

Searches for a target value in a sorted array.

**Available algorithms:** `binary-search`

**Request body:**

```json
{
    "arr": [1, 2, 3, 4, 5],
    "target": 3
}
```

**Response:**

```json
{
    "time": 0.012,
    "result": 2
}
```

Returns the index of the target element, or `-1` if not found.

| Status | Condition                                                     |
| ------ | ------------------------------------------------------------- |
| `200`  | Search completed                                              |
| `400`  | Invalid/missing body or array, max array size (2000) exceeded |
| `404`  | Unknown algorithm                                             |
| `422`  | Array contains non-number values or is not sorted             |

### `GET /418`

Returns HTCPCP/1.0 protocol info. An implementation of [RFC 2324](https://datatracker.ietf.org/doc/html/rfc2324).

### `GET /418/:pot`

Returns the coffee status of a pot. Available pots: `pot-1`, `pot-2`, `pot-3`.

### `POST /418/:pot`

Brew coffee from a pot. Requires `Content-Type: message/coffeepot`.

Additions can be specified via the `Accept-Additions` header (e.g. `cream, sugar`).

**Available additions:** cream, half-and-half, milk, sugar, sweetener, vanilla, cinnamon, hazelnut, syrup

| Status | Condition           |
| ------ | ------------------- |
| `200`  | Brewing started     |
| `403`  | Pot is empty        |
| `404`  | Pot not found       |
| `406`  | Invalid addition    |
| `415`  | Wrong Content-Type  |
| `418`  | It's a teapot       |
| `503`  | Pot not operational |

### `PROPFIND /418/:pot`

Returns detailed pot info including name, age, capacity, available additions, status, and brewer version.

### `GET /impressum`

Returns a link to the legal notice (Impressum).

### `GET /privacy-policy`

Returns a link to the privacy policy.

### `GET /last-updated/:repo?`

Returns the date of the last commit for a given GitHub repository. Defaults to `personal-api` if no repo is specified. Cached for 1 hour.

Returns `404` if the repository is not found.
