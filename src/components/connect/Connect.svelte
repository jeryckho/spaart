<script>
	export let pw = null;
	export let onConnect = (_) => {};
	const innerConnect = () => onConnect(pw);
</script>

<div class="row">
	<input type="password" bind:value={pw} />
	<button type="button" on:click={innerConnect} disabled={!pw}>Connect</button>
</div>
