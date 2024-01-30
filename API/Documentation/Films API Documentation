# Films API Documentation

## Get Films

Retrieves a list of films with various filtering, sorting, and pagination options.

`GET /api/films`

### Query Parameters

| Parameter | Type    | Description                                                                                                 | Default       |
| --------- | ------- | ----------------------------------------------------------------------------------------------------------- | ------------- |
| `page`    | integer | The number of the page to retrieve.                                                                         | `1`           |
| `limit`   | integer | The number of records per page.                                                                             | `10`          |
| `sortBy`  | string  | The field to sort by. Can be `title`, `tmdbId`, `genres`, `releaseDate`, `runtime`, `status`, or `tagline`. | `releaseDate` |
| `order`   | string  | The sorting order. Can be `asc` for ascending or `desc` for descending.                                     | `asc`         |
| `genre`   | string  | Filters the films by genre.                                                                                 |               |
| `status`  | string  | Filters the films by status (e.g., `Released`, `Upcoming`).                                                 |               |

### Response

The response is a JSON array of films, each containing the following fields:

- `tmdbId` (integer): The ID of the film in The Movie Database (TMDb).
- `title` (string): The title of the film.
- `genres` (array of strings): The genres of the film.
- `releaseDate` (date): The release date of the film.
- `runtime` (integer): The runtime of the film in minutes.
- `status` (string): The status of the film (e.g., `Released`, `Upcoming`).
- `overview` (string): A brief overview of the film.
- `backdropPath` (string): The URL to a backdrop image of the film.
- `posterPath` (string): The URL to a poster image of the film.
- `tagline` (string): The tagline of the film.
- `imdbId` (string): The IMDb ID of the film.

The response also includes pagination metadata in the headers:

- `X-Page-Number`: The current page number.
- `X-Page-Size`: The number of records per page.
- `X-Total-Item-Count`: The total number of films matching the query.
- `X-Total-Pages`: The total number of pages.

### Examples

Get the first page of films, with a limit of 10 per page, sorted by title in ascending order  
 `GET /api/films?page=1&limit=10&sortBy=title&order=asc`

Get the top 100 most recently released action films  
 `GET /api/films?genre=Action&status=Released&sortBy=releaseDate&order=desc&limit=100`

## GET Film Information

### Endpoint

`GET /api/films/:id`

Fetch detailed information about a specific film.

### Path Parameters

| Parameter | Type    | Description                               |
| --------- | ------- | ----------------------------------------- |
| `id`      | integer | The ID of the film in The Movie Database. |

### Response

The response is a JSON object containing detailed information about the film.

- `tmdbId` (integer): The ID of the film in The Movie Database (TMDb).
- `title` (string): The title of the film.
- `genres` (array of strings): The genres of the film.
- `releaseDate` (date): The release date of the film.
- `runtime` (integer): The runtime of the film in minutes.
- `status` (string): The status of the film (e.g., `Released`, `Upcoming`).
- `overview` (string): A brief overview of the film.
- `backdropPath` (string): The URL to a backdrop image of the film.
- `posterPath` (string): The URL to a poster image of the film.
- `tagline` (string): The tagline of the film.
- `imdbId` (string): The IMDb ID of the film.

## Search Films

### Endpoint

`GET /api/films/search`

Search for films based on various criteria such as title, genre, status, and release date.

`GET /api/films/search?query={query}&genre={genre}&status={status}&releaseAfter={releaseAfter}&releaseBefore={releaseBefore}&page={page}&pageSize={pageSize}`

### Query Parameters

| Parameter       | Type   | Description                                                                         |
| --------------- | ------ | ----------------------------------------------------------------------------------- |
| `query`         | string | The search keyword(s) for the film title.                                           |
| `genre`         | string | Optional. Filter films by genre.                                                    |
| `status`        | string | Optional. Filter films by status (e.g., 'Released', 'Upcoming').                    |
| `releaseAfter`  | date   | Optional. Filter films that released after this date.                               |
| `releaseBefore` | date   | Optional. Filter films that released before this date.                              |
| `page`          | int    | Optional. Specify the page of search results to retrieve. Default is 1.             |
| `pageSize`      | int    | Optional. Specify the number of search results to retrieve per page. Default is 10. |

### Response

The response is a paginated JSON array containing films that match the search criteria. Each object in the array represents a film with detailed information.

### Pagination Metadata

Pagination metadata is included in the response headers:

- `X-Page-Number`: The current page number.
- `X-Page-Size`: The number of items per page.
- `X-Total-Item-Count`: The total number of items matching the search criteria.

## Examples

1. Search for films with the title keyword "Inception"  
   `GET /api/films/search?query=Inception&page=1&pageSize=10`

2. Search for films in the "Action" genre that were released 2010 onwards  
   `GET /api/films/search?genre=Action&releaseAfter=2010-01-01`

3. Search for films with a "Released" status, sorted by release date  
   `GET /api/films/search?status=Released&sortBy=releaseDate&order=desc`

4. Search for upcoming films in the "Science Fiction" genre  
   `GET /api/films/search?genre=Science Fiction&status=Upcoming`
