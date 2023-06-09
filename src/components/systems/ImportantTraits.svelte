<script context="module">
	import { waypoints } from "../../stores/store";
</script>

<script>
	import Trait from "./Trait.svelte";

	export let waypointSymbol;

	$: waypoint = $waypoints[waypointSymbol];
	$: traits = waypoint.traits.map((t) => t.symbol);
</script>

<div class="icon-text">
	<span class="icon has-text-success" title="scanned">
		<i class="fa-solid fa-map-marker" />
	</span>
	{#each traits as trait}
		<Trait {trait} />
	{/each}
</div>
