<script context="module">
	import { queries, token } from "../stores/store";
</script>
<script>
   import { customQuery } from "../lib/api";

	let toLoad;

	let Query = {
		Name: "New",
		Method: "GET",
		Root: "https://api.spacetraders.io/v2",
		Path: "",
		useAuth: true,
		HasPathParams: false,
		PathParams: "{}",
		HasQueryParams: false,
		QueryParams: "{}",
		HasBody: false,
		Body: "{}",
		Answer: "{}"
	};	

	const onQuery = async () => {
		try {
			const done = await customQuery({ ...Query, token: $token });
			Query.Answer = JSON.stringify(done?.body, null, " ");		
		} catch (error) {
			Query.Answer = JSON.stringify(error?.response?.body, null, " ");		
		}
	}
</script>

<nav class="panel">
	<div class="panel-heading">Query</div>
	<div class="panel-block">
		Name : &nbsp;
		<input
			class="button is-small is-rounded"
			bind:value={Query.Name}
		/>
	</div>
	<div class="panel-block">
		Method : &nbsp;
		<select
			class="button is-small is-rounded is-link"
			bind:value={Query.Method}
		>
			{#each ["GET", "POST", "PATCH", "PUT", "DELETE"] as Method (Method)}
				<option value={Method}>
					{Method}
				</option>
			{/each}
		</select>
	</div>
	<div class="panel-block">
		Server : &nbsp;
		<input
			class="button is-small is-rounded"
			bind:value={Query.Root}
			placeholder="Server"
		/>
	</div>
	<div class="panel-block">
		Path : &nbsp;
		<input
			class="button is-small is-rounded"
			bind:value={Query.Path}
			placeholder="/my/ships"
		/>
	</div>
	<div class="panel-block">
		<label class="checkbox">
			<input type="checkbox" bind:checked={Query.useAuth} />
			Use Auth
		</label>
	</div>
	<div class="panel-block">
		<label class="checkbox">
			<input type="checkbox" bind:checked={Query.HasPathParams} />
			Params
		</label>
	</div>
	{#if Query.HasPathParams}
		<div class="panel-block">
			<textarea
				class="input is-small"
				bind:value={Query.PathParams}
				placeholder="/my/ships"
			/>
		</div>		
	{/if}
	<div class="panel-block">
		<label class="checkbox">
			<input type="checkbox" bind:checked={Query.HasQueryParams} />
			Query String
		</label>
	</div>
	{#if Query.HasQueryParams}
		<div class="panel-block">
			<textarea
				class="input is-small"
				bind:value={Query.QueryParams}
			/>
		</div>		
	{/if}
	<div class="panel-block">
		<label class="checkbox">
			<input type="checkbox" bind:checked={Query.HasBody} />
			Body
		</label>
	</div>
	{#if Query.HasBody}
		<div class="panel-block">
			<textarea
				class="input is-small"
				bind:value={Query.Body}
			/>
		</div>		
	{/if}
	<div class="panel-block">
		Actions : &nbsp;
		<div class="buttons has-addons">
			<button
				class="button is-small is-rounded is-info"
				type="button"
				on:click={onQuery}
			>
				Send
			</button>
			<button
				class="button is-small is-rounded is-success"
				type="button"
				on:click={() => { Query.Answer = "{}"; }}
			>
				Clean
			</button>
			<button
				class="button is-small is-rounded is-warning"
				type="button"
				on:click={() => {
					$queries[Query.Name] = {...Query};
				}}
			>
			Save
			</button>
			{#if Object.keys($queries).length}
			<button
				class="button is-small is-rounded is-primary"
				type="button"
				on:click={() => {
					Query = {...$queries[toLoad]};
					console.log(Query);
				}}
			>
			Load
			</button>
			<select class="button is-small is-rounded" bind:value={toLoad}>
				{#each Object.keys($queries).sort() as action (action)}
					<option value={action}>
						{action}
					</option>
				{/each}</select
			>
			{/if}
		</div>
	</div>
	{#if Query.Answer !== "{}"}
		<div class="panel-block">
			<pre>{Query.Answer}</pre>
		</div>	
	{/if}

</nav>
