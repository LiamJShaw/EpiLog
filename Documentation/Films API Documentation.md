# Films API Documentation

## Overview

This documentation outlines the endpoints for interacting with the film database, including searching, retrieving, and listing films with various options.

## Endpoints

### Search Films

Searches for films based on various criteria.

**Endpoint:** `GET /api/films/search`

#### Query Parameters

| Parameter        | Type    | Description                                |
| ---------------- | ------- | ------------------------------------------ |
| `query`          | string  | Search query for film titles.              |
| `genre`          | string  | Filter films by genre.                     |
| `status`         | string  | Filter films by status (e.g., `Released`). |
| `releaseDateGte` | date    | Films released on or after this date.      |
| `releaseDateLte` | date    | Films released on or before this date.     |
| `page`           | integer | Page number for pagination.                |
| `pageSize`       | integer | Number of films per page for pagination.   |

#### Response

A JSON array of films matching the search criteria, including pagination metadata in the response headers.

### Upcoming Films

Retrieves a list of upcoming films.

**Endpoint:** `GET /api/films/upcoming`

#### Response

A JSON array of films with release dates in the future, sorted by release date ascending.

### Get Film Details

Fetches detailed information about a specific film.

**Endpoint:** `GET /api/films/:id`

#### Path Parameters

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `id`      | string | The unique identifier of the film. |

#### Response

A JSON object containing detailed information about the film.

### List All Films

Lists all films with options for pagination and sorting.

**Endpoint:** `GET /api/films`

#### Query Parameters

| Parameter  | Type    | Description                                                  |
| ---------- | ------- | ------------------------------------------------------------ |
| `page`     | integer | Page number for pagination.                                  |
| `pageSize` | integer | Number of films per page for pagination.                     |
| `sortBy`   | string  | Field to sort the films by.                                  |
| `order`    | string  | Sorting order, `asc` for ascending or `desc` for descending. |

#### Response

A JSON array of all films, including pagination metadata in the response headers.

## Pagination Metadata in Response Headers

- `X-Page-Number`: The current page number.
- `X-Page-Size`: The number of records per page.
- `X-Total-Item-Count`: The total number of items.
- `X-Total-Pages`: The total number of pages.

## Status Codes

- `200 OK`: The request was successful.
- `404 Not Found`: The requested resource was not found.
- `500 Internal Server Error`: An error occurred on the server.
