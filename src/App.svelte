<script>
	import "bulma/css/bulma.css";
	import "./assets/fontawesome/css/fontawesome.css";
	import "./assets/fontawesome/css/solid.css";

	// import Show from "./components/Show.svelte";
	import Connect from "./components/connect/Connect.svelte";
	import CustomQuery from "./components/CustomQuery.svelte";
	import LevelItem from "./components/LevelItem.svelte";
	import ListContracts from "./components/contracts/ListContracts.svelte";
	import ListShips from "./components/ships/ListShips.svelte";
	import Register from "./components/connect/Register.svelte";
	import Show from "./components/Show.svelte";
	import ShowShip from "./components/ships/ShowShip.svelte";
	import Status from "./components/Status.svelte";
	import ShowAgent from "./components/ShowAgent.svelte";
	import ShowSurveys from "./components/ShowSurveys.svelte";
	import ShowSystems from "./components/systems/ShowSystems.svelte";
	import ShowWaypoint from "./components/systems/ShowWaypoint.svelte";

	import { page, pageSet } from "./stores/page";
	import { ships } from "./stores/ships";
	import { contracts } from "./stores/contracts";
	import { token, agent, surveys, systems } from "./stores/store";

	import { registerNewAgent } from "./lib/api";

	let show;
	let selected = "Ships";
	let back;
	let waypointData;

	const onConnect = (x) => {
		$token = x;
	};

	const onRegister = async (x) => {
		try {
			const done = await registerNewAgent(x);
			$token = done?.body?.data?.token;
		} catch (error) {
			console.log("Arf");
		}
	}

	const onStatus = (x) => {
		show = x;
	};
	const onListShips = (x) => {
		$ships = x?.body?.data ?? [];
	};
	const onListContracts = (x) => {
		$contracts = x?.body?.data ?? []
	};
	const onClick = (s) => {
		$page = pageSet($page, { selected: s });
	};
	const credFormat = (ag) =>
		`(${ag?.credits?.toLocaleString?.("en-US") ?? "?"})`;

	$: {
		back = $page.back;
		waypointData = $page.waypointData;
		selected = $page.selected;
	}
</script>

<main class="container">
	{#if $token}
		<nav class="level">
			<LevelItem item="Ships" detail={`(${$ships.length})`} {onClick} />
			<LevelItem item="Surveys" detail={`(${$surveys.length})`} {onClick} />
			<LevelItem
				item="Systems"
				detail={`(${Object.keys($systems).length})`}
				{onClick}
			/>
			<LevelItem item="Misc" detail={credFormat($agent)} {onClick} />
		</nav>

		<div class:is-hidden={selected !== "Ships"}>
			{#each $ships as ship}
				<nav class="panel">
					<ShowShip symbol={ship.symbol} />
				</nav>
			{/each}
		</div>

		<div class:is-hidden={selected !== "Misc"}>
			<ShowAgent />
			<CustomQuery />
			<ListShips {onListShips} />
			<ListContracts {onListContracts} />
			<Status {onStatus} />
			<Show value={show} />
		</div>

		<div class:is-hidden={selected !== "Systems"}>
			<ShowSystems
				showTitle={true}
			/>
		</div>

		<div class:is-hidden={selected !== "Surveys"}>
			<ShowSurveys />
		</div>

		<div class:is-hidden={selected !== "Waypoint"}>
			<ShowWaypoint
				showTitle={true}
				systemSymbol={waypointData?.systemSymbol}
				waypointSymbol={waypointData?.waypointSymbol}
			/>
		</div>
	{:else}
		<Connect pw={$token} {onConnect} />
		<hr />
		<Register {onRegister}/>
	{/if}
</main>
