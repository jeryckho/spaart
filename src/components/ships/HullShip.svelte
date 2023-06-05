<script>
	import { ships } from "../../stores/ships";

	export let symbol;
	let ship;

	$: ship = $ships.find((current) => current.symbol === symbol);
	$: Frame = ship?.frame;
	$: Reactor = ship?.reactor;
	$: Engine = ship?.engine;
	$: Modules = ship?.modules;
	$: Mounts = ship?.mounts;
</script>

<div class="panel-block">
	<span class="icon is-small">
		<i class="fa-solid fa-user-astronaut" />
	</span> &nbsp; 
	<span title={Frame.description}>{Frame.symbol}</span>
</div>

<div class="panel-block">
	<span class="icon is-small">
		<i class="fa-solid fa-bolt" />
	</span> &nbsp; 
	<span title={Reactor.description}>{Reactor.symbol}</span>
</div>

<div class="panel-block">
	<span class="icon is-small">
		<i class="fa-solid fa-fire-flame-simple" />
	</span> &nbsp; 
	<span title={Engine.description}>{Engine.symbol}</span>
</div>

{#each Modules as Module}
	<div class="panel-block">
		<span class="icon is-small">
			<i class="fa-solid fa-box" />
		</span> &nbsp; 
		<span title={Module.description}>{Module.symbol}</span> ({Module.requirements.slots}/{Frame.moduleSlots})
	</div>	
{/each}

{#each Mounts as Mount}
	<div class="panel-block">
		<span class="icon is-small">
			<i class="fa-solid fa-cubes" />
		</span> &nbsp; 
		<span title={Mount.description}>{Mount.symbol}</span> ({Mount.requirements.slots ?? 1}/{Frame.mountingPoints})
	</div>	
{/each}
