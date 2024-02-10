# User API Documentation

## Overview

This documentation details the user-related endpoints provided by the API, including user registration, login, logout, and profile access.

## User Registration

Allows new users to register.

**Endpoint:** `POST /api/user/register`

### Request Body

| Field      | Type   | Description           |
| ---------- | ------ | --------------------- |
| `username` | string | User's username.      |
| `password` | string | User's password.      |
| `email`    | string | User's email address. |

### Response

- `200 OK`: Registration successful.
- `500 Internal Server Error`: Registration failed with an error message.

### Example Request

```json
{
  "username": "johndoe",
  "password": "password123",
  "email": "john.doe@example.com"
}
```

## User Login

Authenticates a user and returns a JWT token for accessing protected routes.

**Endpoint:** `POST /api/user/login`

### Request Body

| Field      | Type   | Description      |
| ---------- | ------ | ---------------- |
| `username` | string | User's username. |
| `password` | string | User's password. |

### Response

Returns a JWT token upon successful authentication.

- `200 OK`: Logged in successfully with the token included.
- `401 Unauthorized`: Authentication failed.

### Example Request

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

## User Logout

Logs out the current user.

**Endpoint:** `GET /api/user/logout`

### Response

- `200 OK`: Logged out successfully and redirected.

## User Profile

Retrieves the profile information for the currently authenticated user.

**Endpoint:** `GET /api/user/:userID/profile`

### Path Parameters

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `userID`  | string | The unique identifier of the user. |

### Response

Returns the user's profile information.

- `200 OK`: Successfully retrieved the user profile.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Error retrieving the user profile.

## Public User Profile

Retrieves publicly accessible profile information of any user. If authenticated as the profile owner, returns additional information.

**Endpoint:** `GET /api/user/profile/:userId`

### Path Parameters

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `userId`  | string | The unique identifier of the user. |

### Response

- `200 OK`: Successfully retrieved the public user profile.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Error retrieving the user profile.
