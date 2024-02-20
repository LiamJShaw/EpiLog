<script>
  // You can import any necessary components or stores here
  // For example, import a store that holds featured TV shows and films
  // import { featuredShows, featuredFilms } from "../stores.js";

  // You might also import components for displaying lists of shows or films
  import ListItemCard from "../components/ListItemCard.svelte";

  // Placeholder data fetching function (replace with actual data fetching logic)
  // async function fetchFeaturedContent() {
  //   // Simulate fetching data
  //   // Update your stores or local component state with this data
  // }

  // // Fetch featured content on component mount
  // onMount(() => {
  //   fetchFeaturedContent();
  // });
</script>

<main>
  <section class="hero">
    <h1>EpiLog</h1>
    <p>Discover and track your favourite TV Shows and Films</p>
    <button>Get Started</button>
  </section>
</main>

<style>
  .hero {
    text-align: center;
    padding: 2em;
    background-color: #1d1d1d;
    color: white;
  }

  .featured-content {
    margin: 2em 0;
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1em;
    padding: 1em;
  }

  button {
    background-color: #ff3e00;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    cursor: pointer;
    border-radius: 5px;
  }

  button:hover {
    background-color: #e03500;
  }
</style>
