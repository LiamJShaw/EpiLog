<script>
    import { SignIn, SignOut } from "@auth/sveltekit/components";
    import { page } from "$app/stores";
</script>
  
  {#if $page.data.session}
    <SignOut />
  {:else}
    <SignIn provider="github" />
  {/if}