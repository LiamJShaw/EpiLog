# TV List API Documentation

## Overview

This documentation outlines the endpoints for managing a user's TV list, including adding, retrieving, updating, and removing TV shows from their list.

## Get User's TV List

Retrieves the TV list for the authenticated user.

**Endpoint:** `GET /api/user/list/tv`

### Authorization

Requires JWT authentication.

### Response

A JSON array of TV list items, each containing details about the TV show and the user's interaction with it.

## Add a TV Show to User's List

Allows adding a new TV show to the authenticated user's list.

**Endpoint:** `POST /api/user/list/tv/add`

### Authorization

Requires JWT authentication.

### Request Body

| Field             | Type    | Description                                          |
| ----------------- | ------- | ---------------------------------------------------- |
| `tvShowId`        | string  | The unique identifier of the TV show.                |
| `status`          | string  | The user's status with the TV show.                  |
| `episodesWatched` | integer | The number of episodes watched.                      |
| `score`           | integer | The user's rating for the TV show.                   |
| `notes`           | string  | Any notes the user has about the TV show.            |
| `startDate`       | date    | When the user started watching the show.             |
| `finishDate`      | date    | When the user finished watching the show.            |
| `totalRewatches`  | integer | The number of times the user has rewatched the show. |

### Response

- `200 OK`: TV show added successfully.
- `409 Conflict`: TV show already in the user's list.
- `404 Not Found`: TV show not found.

## Get a Specific TV List Item

Retrieves details of a specific TV list item for the authenticated user.

**Endpoint:** `GET /api/user/list/tv/:tvListItemId`

### Path Parameters

| Parameter      | Type   | Description                             |
| -------------- | ------ | --------------------------------------- |
| `tvListItemId` | string | The unique identifier of the list item. |

### Authorization

Requires JWT authentication.

### Response

- `200 OK`: Successfully retrieved the TV list item.
- `404 Not Found`: TV list item not found or does not belong to the user.

## Remove a TV Show from User's List

Removes a TV show from the authenticated user's list.

**Endpoint:** `DELETE /api/user/list/tv/:tvListItemId`

### Path Parameters

| Parameter      | Type   | Description                             |
| -------------- | ------ | --------------------------------------- |
| `tvListItemId` | string | The unique identifier of the list item. |

### Authorization

Requires JWT authentication.

### Response

- `200 OK`: TV show removed from the list.
- `404 Not Found`: TV list item not found or does not belong to the user.

## Update a TV List Item

Updates details of a specific TV list item for the authenticated user.

**Endpoint:** `PUT /api/user/list/tv/:tvListItemId`

### Path Parameters

| Parameter      | Type   | Description                             |
| -------------- | ------ | --------------------------------------- |
| `tvListItemId` | string | The unique identifier of the list item. |

### Authorization

Requires JWT authentication.

### Request Body

Fields similar to adding a TV show to the list, allowing updates to `status`, `episodesWatched`, `score`, `notes`, `startDate`, `finishDate`, and `totalRewatches`.

### Response

- `200 OK`: TV list item updated successfully.
- `404 Not Found`: TV list item not found or does not belong to the user.
