<script>
	export let onClick = (_) => {};
	export let item;
	export let detail = undefined;
</script>

<p class="level-item has-text-centered">
	{#if detail}
		<div>
			<p class="heading">
				<a
					class="link is-info"
					on:click|preventDefault={() => {
						onClick(item);
					}}
					href={item}>{item}</a
				>
			</p>
			<p>{detail}</p>
		</div>
	{:else}
		<a
			class="link is-info"
			on:click|preventDefault={() => {
				onClick(item);
			}}
			href={item}>{item}</a
		>
	{/if}
</p>
