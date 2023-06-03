<script>
	export let symbol = null;
	export let faction = null;
	export let mail = null;
	export let onRegister = (_) => {};
	const innerRegister = () => onRegister({symbol, faction, mail});
</script>

<div class="row">
	<input type="text" bind:value={symbol} placeholder="YOUR_NAME"/>
	<input type="text" bind:value={faction} placeholder="COSMIC"/>
	<input type="text" bind:value={mail} placeholder="your@mail"/>
	<button class="button" type="button" on:click={innerRegister} disabled={!symbol || !faction}>Register</button>
</div>
