<script>
  export let title;
  export let image;
  export let summary;
</script>

<div class="card">
  <img src={image} alt={title} />
  <h2>{title}</h2>
  <p>{summary}</p>
</div>
