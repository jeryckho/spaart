<script>
	export let value;
</script>

<div class="panel-block" class:is-hidden={!value}>
	<div class="notification is-danger">
		<button class="delete" on:click={()=> { value = undefined; }}></button>
		<pre><code class="box">{JSON.stringify(value, null, "\t") ?? ""}</code></pre>
	 </div>
</div>
