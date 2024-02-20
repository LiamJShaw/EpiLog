<script>
  import { onMount } from "svelte";

  let userData = null;
  let userShows = [];
  let userFilms = [];

  async function fetchUserData(userId) {
    // Simulating fetching data by replacing actual fetch calls with static data
    try {
      // Simulated user profile response
      const userProfileData = {
        userProfile: {
          _id: "65c28a4cde32c094c4006def",
          username: "Liam",
          email: "liam@shaw.com",
          role: "admin",
          tvList: ["65c543d52f4f9879b05502e0"],
          filmList: ["65c545c82f4f9879b0550316"],
          favouriteTVShows: [],
          favouriteFilms: [],
        },
      };

      // Setting userData from the simulated response
      userData = {
        id: userProfileData.userProfile._id,
        name: userProfileData.userProfile.username,
        email: userProfileData.userProfile.email,
        // Assuming totalWatchTime needs to be calculated or fetched separately
        totalWatchTime: "120,000 hours",
      };

      // Simulated TV list response
      const userTvListData = {
        tvList: [
          {
            _id: "65c543d52f4f9879b05502e0",
            tvShow: {
              _id: "65b2dc74dfbdc1b772760872",
              title: "Under the Dome",
            },
            status: "Watching",
            episodesWatched: 10,
            score: 8,
            notes: "Really enjoying this show!",
            startDate: "2023-01-01T00:00:00.000Z",
            finishDate: null,
            totalRewatches: 0,
          },
          {
            _id: "",
            tvShow: {
              _id: "65b2dc74dfbdc1b772760872",
              title: "Breaking Bad",
            },
            status: "Completed",
            episodesWatched: 100,
            score: 10,
            notes: "Really enjoying this show!",
            startDate: "2023-01-01T00:00:00.000Z",
            finishDate: null,
            totalRewatches: 1,
          },
        ],
      };

      // Setting userShows from the simulated TV list response
      userShows = userTvListData.tvList.map((show) => ({
        id: show._id,
        title: show.tvShow.title,
        status: show.status,
        episodesWatched: show.episodesWatched,
        score: show.score,
      }));

      // Simulated film list response
      const userFilmListData = {
        filmList: [
          {
            _id: "65c545c82f4f9879b0550316",
            film: {
              _id: "65b6c1508410cab9cf066faf",
              title: "You'll Never Find Me",
              genres: ["Thriller", "Horror"],
              releaseDate: "2024-03-14T00:00:00.000Z",
            },
            status: "Completed",
            score: 1,
            totalRewatches: 0,
            notes: "Hated this!",
            watchDate: "2023-01-01T00:00:00.000Z",
          },
        ],
      };

      // Setting userFilms from the simulated film list response
      userFilms = userFilmListData.filmList.map((film) => ({
        id: film._id,
        title: film.film.title,
        genres: film.film.genres.join(", "),
        status: film.status,
        score: film.score,
      }));
    } catch (error) {
      console.error("Error setting dummy data:", error.message);
    }
  }

  onMount(() => {
    fetchUserData("123"); // Dummy user ID
  });
</script>

{#if userData}
  <div class="user-profile">
    <h2>{userData.name}</h2>
    <p>Total Watch Time: {userData.totalWatchTime}</p>
    <p>Last Online:</p>
    <p>Birthday:</p>
    <p>Joined:</p>

    <h4>TV List</h4>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Episodes Watched</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {#each userShows as show}
          <tr>
            <td>{show.title}</td>
            <td>{show.status}</td>
            <td>{show.episodesWatched}</td>
            <td>{show.score}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h4>Film List</h4>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Genres</th>
          <th>Status</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {#each userFilms as film}
          <tr>
            <td>{film.title}</td>
            <td>{film.genres}</td>
            <td>{film.status}</td>
            <td>{film.score}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <p>Loading user data...</p>
{/if}

<style>
  .user-profile {
    padding: 1rem;
    margin: 1rem;
    border-radius: 5px;
    margin-top: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }
</style>
