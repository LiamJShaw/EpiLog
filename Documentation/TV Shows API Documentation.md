# TV Shows API Documentation

## Endpoints Overview

This documentation provides detailed information about the endpoints available for interacting with the TV Shows database through the API. It includes endpoints for retrieving TV shows, searching, and getting detailed information, including episodes and seasons.

## Get TV Shows

Retrieves a list of TV shows with various filtering, sorting, and pagination options.

**Endpoint:** `GET /api/tv`

### Query Parameters

| Parameter  | Type    | Description                                                                                                        | Default     |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------ | ----------- |
| `page`     | integer | The number of the page to retrieve.                                                                                | `1`         |
| `pageSize` | integer | The number of records per page.                                                                                    | `10`        |
| `sortBy`   | string  | The field to sort by. Can be `title`, `tvMazeId`, `genres`, `averageRuntime`, `premiered`, `status`, or `updated`. | `premiered` |
| `order`    | string  | The sorting order. Can be `asc` for ascending or `desc` for descending.                                            | `asc`       |
| `genre`    | string  | Filters the TV shows by genre.                                                                                     |             |
| `status`   | string  | Filters the TV shows by status (e.g., `Running`, `Ended`).                                                         |             |

### Response

The response is a paginated JSON array of TV shows, each containing detailed information such as `tvMazeId`, `title`, `genres`, `averageRuntime`, `premiered`, `image`, `status`, `summary`, and `updated`. Pagination metadata is included in the response headers.

### Example Request

```
GET /api/tv?page=1&pageSize=10&sortBy=title&order=asc
```

## Get TV Show Information

Fetch detailed information about a specific TV show.

**Endpoint:** `GET /api/tv/:id`

### Path Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | The unique ID of the TV show. |

### Response

A JSON object containing detailed information about the TV show, including `tvMazeId`, `title`, `genres`, `averageRuntime`, `premiered`, `image`, `status`, `summary`, and `updated`.

## Search TV Shows

Search for TV shows based on various criteria.

**Endpoint:** `GET /api/tv/search`

### Query Parameters

| Parameter         | Type    | Description                                             |
| ----------------- | ------- | ------------------------------------------------------- |
| `query`           | string  | The search keyword(s) for the TV show name.             |
| `genre`           | string  | Optional. Filter TV shows by genre.                     |
| `status`          | string  | Optional. Filter TV shows by status.                    |
| `premieredAfter`  | date    | Optional. Filter shows that premiered after this date.  |
| `premieredBefore` | date    | Optional. Filter shows that premiered before this date. |
| `page`            | integer | Optional. The page of search results to retrieve.       |
| `pageSize`        | integer | Optional. The number of search results per page.        |

### Response

A paginated JSON array of TV shows matching the search criteria, along with pagination metadata in the response headers.

## Get All Episodes for a TV Show

Retrieve all episodes of a specific TV show.

**Endpoint:** `GET /api/tv/:id/episodes`

### Path Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | The unique ID of the TV show. |

### Response

A JSON array of objects, each representing an episode with detailed information.

## Get All Seasons for a TV Show

Retrieve all seasons of a specific TV show, including episodes per season.

**Endpoint:** `GET /api/tv/:id/seasons`

### Path Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | The unique ID of the TV show. |

### Response

A JSON array of objects, each representing a season with detailed information and episodes.

## Get Total Runtime of a TV Show

Calculate and return the total runtime of all episodes across all seasons for a specific TV show.

**Endpoint:** `GET /api/tv/:id/runtime`

### Path Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `id`      | string | The unique ID of the TV show. |

### Response

A JSON object containing the `totalRuntime` in minutes.
