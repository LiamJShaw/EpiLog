# TV Shows API Documentation

## Get TV Shows

Retrieves a list of TV shows with various filtering, sorting, and pagination options.

`GET /api/tvshows`

### Query Parameters

| Parameter | Type    | Description                                                                                                       | Default     |
| --------- | ------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| `page`    | integer | The number of the page to retrieve.                                                                               | `1`         |
| `limit`   | integer | The number of records per page.                                                                                   | `10`        |
| `sortBy`  | string  | The field to sort by. Can be `name`, `tvMazeId`, `genres`, `averageRuntime`, `premiered`, `status`, or `updated`. | `premiered` |
| `order`   | string  | The sorting order. Can be `asc` for ascending or `desc` for descending.                                           | `asc`       |
| `genre`   | string  | Filters the TV shows by genre.                                                                                    |             |
| `status`  | string  | Filters the TV shows by status (e.g., `Running`, `Ended`).                                                        |             |

### Response

The response is a JSON array of TV shows, each containing the following fields:

- `tvMazeId` (integer): The ID of the TV show in the TVMaze database.
- `name` (string): The name of the TV show.
- `genres` (array of strings): The genres of the TV show.
- `averageRuntime` (integer): The average runtime of episodes in minutes.
- `premiered` (date): The premiere date of the TV show.
- `image` (string): The URL to a medium-sized image of the TV show.
- `status` (string): The status of the TV show (e.g., `Running`, `Ended`).
- `summary` (string): A brief summary of the TV show.
- `updated` (number): The timestamp of the last update of the TV show data.

The response also includes pagination metadata in the headers:

- `X-Page-Number`: The current page number.
- `X-Page-Size`: The number of records per page.
- `X-Total-Item-Count`: The total number of TV shows matching the query.
- `X-Total-Pages`: The total number of pages.

### Examples

Get the first page of TV shows, with a limit of 10 per page, sorted by name in ascending order.
`GET /api/tvshows?page=1&limit=10&sortBy=name&order=asc`

Get the top 100 most recently aired crime TV shows.
`GET /api/tvshows?genre=Crime&status=Running&sortBy=premiered&order=desc&limit=100`

## GET TV Show Information (with optional live data from TVMaze)

### Endpoint

`GET /api/tvshows/:id`

Fetch detailed information about a specific TV show. This endpoint provides the option to retrieve the most up-to-date information directly from the TVMaze API.

`GET /api/tvshows/:id?liveInfo=[true|false]`

### Path Parameters

| Parameter | Type    | Description                                   |
| --------- | ------- | --------------------------------------------- |
| `id`      | integer | The ID of the TV show in the TVMaze database. |

### Query Parameters

| Parameter  | Type    | Description                                                                              |
| ---------- | ------- | ---------------------------------------------------------------------------------------- |
| `liveInfo` | boolean | Optional. If true, fetches information from the TVMaze API instead of the local database |

### Response

The response is a JSON object containing detailed information about the TV show. If `liveInfo` is true, the information is fetched live from the TVMaze API. Otherwise, it's retrieved from the local database.

- `tvMazeId` (integer): The ID of the TV show in the TVMaze database.
- `name` (string): The name of the TV show.
- `genres` (array of strings): The genres of the TV show.
- `averageRuntime` (integer): The average runtime of episodes in minutes.
- `premiered` (date): The premiere date of the TV show.
- `image` (string): The URL to a medium-sized image of the TV show.
- `status` (string): The status of the TV show (e.g., `Running`, `Ended`).
- `summary` (string): A brief summary of the TV show.
- `updated` (number): The timestamp of the last update of the TV show data.

## Search TV Shows

### Endpoint

`GET /api/tvshows/search`

Search for TV shows based on various criteria such as name, genre, status, and premiere date.

`GET /api/tvshows/search?query={query}&genre={genre}&status={status}&premieredAfter={premieredAfter}&premieredBefore={premieredBefore}&page={page}&pageSize={pageSize}`

### Query Parameters

| Parameter         | Type   | Description                                                                         |
| ----------------- | ------ | ----------------------------------------------------------------------------------- |
| `query`           | string | The search keyword(s) for the TV show name.                                         |
| `genre`           | string | Optional. Filter TV shows by genre.                                                 |
| `status`          | string | Optional. Filter TV shows by status (e.g., 'Running', 'Ended').                     |
| `premieredAfter`  | date   | Optional. Filter TV shows that premiered after this date.                           |
| `premieredBefore` | date   | Optional. Filter TV shows that premiered before this date.                          |
| `page`            | int    | Optional. Specify the page of search results to retrieve. Default is 1.             |
| `pageSize`        | int    | Optional. Specify the number of search results to retrieve per page. Default is 10. |

### Response

The response is a paginated JSON array containing TV shows that match the search criteria. Each object in the array represents a TV show with detailed information.

### Pagination Metadata

Pagination metadata is included in the response headers:

- `X-Page-Number`: The current page number.
- `X-Page-Size`: The number of items per page.
- `X-Total-Item-Count`: The total number of items matching the search criteria.

# Get All Episodes of a TV Show

This endpoint returns all episodes of a specific TV show.

`GET /api/tvshows/:id/episodes`

### URL Parameters

| Parameter | Required | Description                   |
| --------- | -------- | ----------------------------- |
| id        | Yes      | The unique ID of the TV show. |

### Response

The response will be a JSON array of objects, each representing an episode of the TV show. Each object contains detailed information about the episode, including the name, season number, episode number, airdate, and more.

# Get All Seasons of a TV Show

This endpoint returns all seasons of a specific TV show, including the number of episodes in each season.

`GET /api/tvshows/:id/seasons`

### URL Parameters

| Parameter | Required | Description                   |
| --------- | -------- | ----------------------------- |
| id        | Yes      | The unique ID of the TV show. |

### Response

The response will be a JSON array of objects, each representing a season of the TV show. Each object contains detailed information about the season, including the season number, premiere date, end date, and the number of episodes.

# Get Total Runtime of a TV Show

This endpoint returns the total runtime of all episodes across all seasons for a specific TV show.
It is useful for getting a quick overview of how long it would take to watch the entire TV show.

`GET /api/tvshows/:id/runtime`

### URL Parameters

| Parameter | Required | Description                          |
| --------- | -------- | ------------------------------------ |
| id        | Yes      | The unique TVMaze ID of the TV show. |

## Response

The response will be a JSON object containing the total runtime.

### Response Object

| Field        | Type    | Description                                  |
| ------------ | ------- | -------------------------------------------- |
| totalRuntime | Integer | The total runtime of the TV show in minutes. |

### Status Codes

The endpoint returns the following status codes in the API:

| Status Code | Description                  |
| ----------- | ---------------------------- |
| 200         | Request was successful.      |
| 404         | TV show not found on TVMaze. |
