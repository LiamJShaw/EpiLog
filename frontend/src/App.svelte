<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  //   import BrowseTV from "./pages/BrowseTV.svelte";
  //   import BrowseFilms from "./pages/BrowseFilms.svelte";
  import UserProfile from "./pages/UserProfile.svelte";

  export let url = "";
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/browse/tv">Browse TV</Link>
    <Link to="/browse/films">Browse Film</Link>
    <Link to="/users/1">Profile</Link>
  </nav>
  <div>
    <Route path="/" component={Home} />
    <!-- <Route path="/browse/tv" component={BrowseTV} />
    <Route path="/browse/films" component={BrowseFilms} /> -->
    <Route path="/users/:id" component={UserProfile} />
  </div>
</Router>
