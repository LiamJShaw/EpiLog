## Overview

This app is designed to be a comprehensive platform for users to track and manage their TV show and film watching.

## Features

### User Accounts

Each user account is personalised and contains several key components:

#### TV List

- **Watching:** As well as how many episodes watched
- **Completed**
- **Plan To Watch**
- **Dropped**

#### Film List

- **Completed:** Films that the user has watched.
- **Plan To Watch:** Films the user plans to watch.

#### Custom Lists

- Users can create custom lists for TV shows or films.
- These lists are independent of the predefined states.
- Users have the option to exclude items in custom lists from appearing in their main lists.

### Profile Page

A central hub for users to view their activity and achievements.

#### Components:

- **TV List:** Displaying the user’s TV watching history and plans.
- **Film List:** Showcasing the films watched and those on the watchlist.
- **Stats:** Comprehensive statistics providing insights into the user’s watching habits.
  - **Film Stats:**
    - Total time watched
    - Favourite genre, decade, and year
  - **TV Stats:**
    - Total time watched
    - Number of episodes watched
    - Number of different series watched
    - Favourite genre, decade, and year.

## Development and Deployment

### Tools and Technologies

#### Frontend

- Svelte for the client
- Bootstrap?
- Tailwind?
- Component library?

#### Backend

- Node and Express
- MongoDB

##### APIs

- TV API: https://www.tvmaze.com/api
- Film API: https://developer.themoviedb.org
- Wrapper for film API: https://github.com/grantholle/moviedb-promise

### Deployment

- Fly.dev

## Achievement-Based Badges (Ideas)

Awarded for reaching certain milestones or achievements.

- **Genre-specific badges** (e.g., watching a certain number of a specific genre).
- **Completion badges** (e.g., completing all films in a series).
- **Binge Watcher:** Awarded for watching a certain number of episodes within a 24-hour period.
- **Critic's Choice:** Earned by rating a significant number of shows or films.
- **Genre Master:** Given for watching an extensive range of shows or films in a particular genre.
- **Time Traveller:** For watching shows or films from a wide range of decades
