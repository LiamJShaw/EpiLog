# Film List API Documentation

## Overview

This documentation describes the endpoints for managing a user's film list on the platform. It covers how to add, retrieve, update, and remove films from the list.

## Get User's Film List

**Endpoint:** `GET /api/user/list/film`

### Authorization

Authenticated users only. Requires JWT token.

### Response

Returns a list of films in the user's film list, including details like title, genres, and release date.

## Add a Film to User's List

**Endpoint:** `POST /api/user/list/film/add`

### Authorization

Authenticated users only. Requires JWT token.

### Request Body

| Field            | Type    | Description                                                             |
| ---------------- | ------- | ----------------------------------------------------------------------- |
| `filmId`         | string  | The unique identifier of the film.                                      |
| `status`         | string  | User's current status with the film (e.g., "Watched", "Plan to Watch"). |
| `score`          | integer | User's rating for the film.                                             |
| `notes`          | string  | Any additional notes on the film.                                       |
| `watchDate`      | date    | The date the user watched the film.                                     |
| `totalRewatches` | integer | Number of times the user has rewatched the film.                        |

### Response

- `200 OK`: Successfully added the film to the user's list.
- `404 Not Found`: Film not found.
- `409 Conflict`: Film already in the user's list.

## Get a Specific Film List Item

**Endpoint:** `GET /api/user/list/film/:filmListItemId`

### Authorization

Authenticated users only. Requires JWT token.

### Path Parameters

| Parameter        | Type   | Description                             |
| ---------------- | ------ | --------------------------------------- |
| `filmListItemId` | string | The unique identifier of the list item. |

### Response

- `200 OK`: Successfully retrieved the film list item.
- `404 Not Found`: Film list item not found or does not belong to the user.

## Remove a Film from User's List

**Endpoint:** `DELETE /api/user/list/film/:filmListItemId`

### Authorization

Authenticated users only. Requires JWT token.

### Path Parameters

| Parameter        | Type   | Description                                           |
| ---------------- | ------ | ----------------------------------------------------- |
| `filmListItemId` | string | The unique identifier of the list item to be removed. |

### Response

- `200 OK`: Successfully removed the film from the user's list.
- `404 Not Found`: Film list item not found or does not belong to the user.

## Update a Film List Item

**Endpoint:** `PUT /api/user/list/film/:filmListItemId`

### Authorization

Authenticated users only. Requires JWT token.

### Path Parameters

| Parameter        | Type   | Description                                           |
| ---------------- | ------ | ----------------------------------------------------- |
| `filmListItemId` | string | The unique identifier of the list item to be updated. |

### Request Body

Similar to adding a film to the list, but used for updating existing entries.

### Response

- `200 OK`: Successfully updated the film list item.
- `404 Not Found`: Film list item not found or does not belong to the user.
