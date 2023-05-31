<script>
	export let tag = null;
	export let faction = null;
	export let mail = null;
	export let onRegister = (_) => {};
	const innerRegister = () => onRegister({tag});
</script>

<div class="row">
	<input type="text" bind:value={tag} placeholder="YOUR_NAME"/>
	<input type="text" bind:value={faction} placeholder="COSMIC"/>
	<input type="text" bind:value={mail} placeholder="your@mail"/>
	<button class="button" type="button" on:click={innerRegister} disabled={!tag || !faction}>Register</button>
</div>
