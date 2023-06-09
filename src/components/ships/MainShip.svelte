<script context="module">
	import {
		agent,
		contracts,
		keepers,
		page,
		ships,
		surveys,
		systems,
		token,
		waypoints,
	} from "../../stores/store";
	import {
		IArrayReplace,
		IHashAdd,
		IHashPatch,
		IObjectPatch,
	} from "../../stores/utils";
</script>
<script>
	import Copy from "../Copy.svelte";
	import Show from "../Show.svelte";

	import {
		createSurvey,
		deliverContract,
		dockShip,
		extractResources,
		getMarket,
		getShip,
		getShipCargo,
		jumpShip,
		listWaypoints,
		navigateShip,
		orbitShip,
		patchShipNav,
		purchaseCargo,
		refuelShip,
		sellCargo,
		transferCargo,
	} from "../../lib/api";

	export let symbol;

	let ship;
	let err;
	let mission;
	let selFM;
	let selXfr;
	let iDest;
	let hideDest = true;
	let iJump;
	let hideJump = true;
	let hideCtx = true;
	let Cooldown;
	let Coolmove;
	let showCargo = false;
	let MyActions = [];

	const onWaypoint = ({ systemSymbol, waypointSymbol }) => {
		$page = IObjectPatch($page, {
			selected: "Waypoint",
			back: "Ships",
			waypointData: { systemSymbol, waypointSymbol }
		});
	};

	const timeDiff = (dStart, dEnd) =>
		Math.floor((dEnd.getTime() - dStart.getTime()) / 1000);

	const setCoolmove = (nv) => {
		if (nv) {
			const departure = new Date(nv.departureTime);
			const Now = new Date();
			const arrival = new Date(nv.arrival);
			Coolmove = {
				totalSeconds: timeDiff(departure, arrival),
				remainingSeconds: Math.max(0, timeDiff(Now, arrival) + 1),
			};
		}
	};

	const setCooldown = (cd) => {
		if (cd) {
			Cooldown = cd;
			Cooldown.remainingSeconds++;
		}
	};

	let tick = 0;
	setInterval(() => {
		tick += 1;
	}, 1000);

	const onOrbit = async () => {
		try {
			const done = await orbitShip({
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { nav: done?.body?.data?.nav });
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onDock = async () => {
		try {
			const done = await dockShip({
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { nav: done?.body?.data?.nav });
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onCargo = async () => {
		try {
			const done = await getShipCargo({
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { cargo: done?.body?.data });
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onShip = async () => {
		try {
			const done = await getShip({
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashAdd($ships, [done?.body?.data]);
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onSell = async (data) => {
		try {
			const done = await sellCargo({
				...data,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { cargo: done?.body?.data?.cargo });
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onFuel = async () => {
		try {
			const done = await refuelShip({
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { fuel: done?.body?.data?.fuel });
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onXfr = async (data) => {
		try {
			const done = await transferCargo({
				...data,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { cargo: done?.body?.data?.cargo });
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onTransfer = async ({shipSymbol, tradeSymbol, units, destShipSymbol}) => {
		try {
			const done = await transferCargo({
				shipSymbol,
				tradeSymbol,
				units,
				destShipSymbol,
				token: $token,
			});
			$ships = IHashPatch($ships, shipSymbol, { cargo: done?.body?.data?.cargo });
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onSetNav = async (data) => {
		try {
			const done = await patchShipNav({
				...data,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { nav: done?.body?.data });
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onExtract = async () => {
		try {
			let survey;
			if (Contexts.Survey) {
				const Now = new Date().toJSON();
				$surveys = $surveys.filter((s) => s.expiration > Now);
				survey = $surveys.find((s) => s.signature === Contexts.Survey);
				if (!survey) Contexts.Survey = "";
			}
			const done = await extractResources({
				survey,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { cargo: done?.body?.data?.cargo });
			setCooldown(done?.body?.data?.cooldown);
		} catch (error) {
			if (error?.response?.body?.error?.code === 4224) {
				Contexts.Survey = "";
				const Bad = /\s([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)\s/.exec(error?.response?.body?.error?.message);
				if (Bad) {
					$surveys = $surveys.filter((s) => s.signature !== Bad[1]);
				}
				await onExtract();
			} else {
				err = error?.response?.body;
				setCooldown(error?.response?.body?.error?.data?.cooldown);
			}
		}
	};

	const onSurvey = async () => {
		try {
			const done = await createSurvey({
				shipSymbol: ship.symbol,
				token: $token,
			});
			if (done?.body?.data?.surveys) {
				const Now = new Date().toJSON();
				$surveys = [...done?.body?.data?.surveys, ...$surveys].filter(
					(s) => s.expiration > Now
				);
			}
			setCooldown(done?.body?.data?.cooldown);
			// err = done?.body?.data?.surveys;
		} catch (error) {
			err = error?.response?.body;
			setCooldown(error?.response?.body?.error?.data?.cooldown);
		}
	};

	const onJump = async ({systemSymbol}) => {
		try {
			const done = await jumpShip({
				systemSymbol,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, {
				nav: done?.body?.data?.nav,
			});
			setCooldown(done?.body?.data?.cooldown);
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onNavigate = async ({waypointSymbol, avoidUpdate=false}) => {
		try {
			const done = await navigateShip({
				waypointSymbol,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, {
				fuel: done?.body?.data?.fuel,
				nav: done?.body?.data?.nav,
			});
			setCoolmove(done?.body?.data?.nav?.route);
			if (avoidUpdate === false) {
				setTimeout(onShip, 1000*Coolmove.remainingSeconds);
			}
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onDeliver = async (data) => {
		try {
			const done = await deliverContract({
				...data,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, symbol, { cargo: done?.body?.data?.cargo });
			$contracts = IArrayReplace($contracts, data.contractId, done?.body?.data?.contract, "id");
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onBuy = async (data) => {
		try {
			const done = await purchaseCargo({
				...data,
				shipSymbol: ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, ship.symbol, { cargo: done?.body?.data?.cargo });
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onWPSystems = async (data) => {
		try {
			const done = await listWaypoints({
				...data,
				limit: 20,
				token: $token,
			});
			$waypoints = IHashAdd($waypoints, done?.body?.data);
		} catch (error) {
			err = error?.response?.body;
		}
	};
	const onMarket = async ({systemSymbol, waypointSymbol}) => {
		try {
			const done = await getMarket({
				systemSymbol,
				waypointSymbol,
				token: $token,
			});
			$waypoints = IHashPatch($waypoints, waypointSymbol, {
				market: done?.body?.data,
			});
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onAction = async () => {
		if (mission in Actions) {
			await  Actions[mission].fn();
		}
	};

	const onSellAll = async () => {
		const toSell = ship.cargo.inventory.filter(
			(i) => !$keepers.includes(i.symbol)
		);
		if (toSell.length) {
			await onDock();
			for (const item of toSell) {
				await onSell({
					symbol: item.symbol,
					units: item.units,
				});
			}
			await onOrbit();
		}
	}

	const onExtractSell = async () => {
		await onExtract();
		await onSellAll();
	};


	/*{
		From: {
			Where
			What
		}
		To: {
			Where
		}

	}*/
	const sleep = s => new Promise(r => setTimeout(r, 1000*s));
	const onBuyMoveDeliverBack = async () => {
		const Check = (el) => {if (mission!="AutoDeliver" || el != err) throw "Done" };
		try {
			let Context = JSON.parse(Contexts[Actions[mission].Ctx]);
			while (true) {
				const Prev = err;
				await onDock();
				Check(Prev);
				await onBuy({
					units: ship.cargo.capacity - ship.cargo.units,
					symbol: Context?.From?.What
				});
				Check(Prev);
				await onGateTo({
					waypointSymbol: Context?.To?.Where,
					avoidUpdate: true
				});
				Check(Prev);
				await endOfTransit();
				Check(Prev);
				await onDock();
				Check(Prev);
				await onDeliver({
					tradeSymbol: Context?.From?.What,
					units: ship.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units,
					contractId: $contracts.find((v) => v.terms.deliver.some((d) => d.destinationSymbol === ship.nav.waypointSymbol && d.tradeSymbol === Context?.From?.What) && v.accepted && !v.fulfilled).id,
				});
				Check(Prev);
				await onGateTo({
					waypointSymbol: Context?.From?.Where,
					avoidUpdate: true
				});
				Check(Prev);
				await endOfTransit();
				Check(Prev);
			}
		} catch (error) {
			err = error;
		}
	}

	/*{
		From: {
			Where
			What
			OnWait?
		}
		To: {
			Where
			Max
			Refuel?
		}
	}*/
	const onAutoSellAway = async () => {
		const Check = (el) => {if (mission!="SellAway" || el != err) {console.log(err); throw "Done";} };
		try {
			let Context = JSON.parse(Contexts[Actions[mission].Ctx]);
			while (true) {
				const Prev = err;
				//On retourne au (DEPART)
				await onGateTo({
					waypointSymbol: Context?.From?.Where,
					avoidUpdate: true
				});
				Check(Prev);
				await endOfTransit();
				await onShip();
				Check(Prev);
				//On remplit (QUOI)
				let Dispo = ship.cargo.capacity - ship.cargo.units;
				do {
					const [...GetFrom] = near.filter(s=>s.cargo.inventory.find(i=>i.symbol===Context?.From?.What));
					if (GetFrom.length>0) {
						const [Best] = GetFrom.sort((b,a) => a.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units - b.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units);
						const canX = Math.min(Dispo, Best.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units);
						await onTransfer({
							shipSymbol: Best.symbol,
							tradeSymbol: Context?.From?.What,
							units: canX,
							destShipSymbol: ship.symbol
						});
						Dispo = Dispo - canX;
						Check(Prev);
						await sleep(1)
					} else {
						await onCargo();
						switch (Context?.From?.OnWait) {
							case "ExtractSell":
								if (ship.cargo.units < ship.cargo.capacity) {
									await onExtract();
									await onSellAll();
									await endOfCooldown();
								} else {
									await onSellAll();
									await sleep(30);
								}
								break;
						
							default:
								await sleep(30);
								break;
						}
						// if (Context?.From?.What === )
						await onCargo();
						Check(Prev);
					}
				} while (Dispo>0);
				await onCargo();
				Check(Prev);
				//On va au (POINT DE VENTE)
				await onGateTo({
					waypointSymbol: Context?.To?.Where,
					avoidUpdate: true
				});
				Check(Prev);
				await endOfTransit();
				Check(Prev);
				//On se dock
				await onDock();
				Check(Prev);
				//On vend (QUOI) par paquet de (COMBIEN)
				let HowMany = ship.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units;
				do {
					const canSell = Math.min(HowMany, Context?.To?.Max);
					await onSell({
						symbol: Context?.From?.What,
						units: canSell,
					});
					HowMany = HowMany - canSell;
				} while (HowMany>0);
				//On (REFUEL) ou pas
				if (Context?.To?.Max) {
					await onFuel();
					Check(Prev);
				}
			}
		} catch (error) {
			err = error;
		}
	}

	/*{
		From: {
			Where
			What
			OnWait?
		}
		To: {
			Where
			Max
			Refuel?
		}
	}*/
	const onAutoDeliverAway = async () => {
		const Check = (el) => {if (mission!="DeliverAway" || el != err) {console.log(err); throw "Done" }};
		try {
			let Context = JSON.parse(Contexts[Actions[mission].Ctx]);
			while (true) {
				const Prev = err;
				//On retourne au (DEPART)
				await onGateTo({
					waypointSymbol: Context?.From?.Where,
					avoidUpdate: true
				});
				Check(Prev);
				await endOfTransit();
				await onShip();
				Check(Prev);
				//On remplit (QUOI)
				let Dispo = ship.cargo.capacity - ship.cargo.units;
				do {
					const [...GetFrom] = near.filter(s=>s.cargo.inventory.find(i=>i.symbol===Context?.From?.What));
					if (GetFrom.length>0) {
						const [Best] = GetFrom.sort((b,a) => a.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units - b.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units);
						const canX = Math.min(Dispo, Best.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units);
						await onTransfer({
							shipSymbol: Best.symbol,
							tradeSymbol: Context?.From?.What,
							units: canX,
							destShipSymbol: ship.symbol
						});
						Dispo = Dispo - canX;
						Check(Prev);
						await sleep(1)
					} else {
						await onCargo();
						switch (Context?.From?.OnWait) {
							case "ExtractSell":
								if (ship.cargo.units < ship.cargo.capacity) {
									await onExtract();
									await onSellAll();
									await endOfCooldown();
								} else {
									await onSellAll();
									await sleep(30);
								}
								break;
						
							default:
								await sleep(30);
								break;
						}
						// if (Context?.From?.What === )
						await onCargo();
						Check(Prev);
					}
				} while (Dispo>0);
				await onCargo();
				Check(Prev);
				//On va au (POINT DE VENTE)
				await onGateTo({
					waypointSymbol: Context?.To?.Where,
					avoidUpdate: true
				});
				Check(Prev);
				await endOfTransit();
				Check(Prev);
				//On se dock
				await onDock();
				Check(Prev);
				//On deliver (QUOI)
				await onDeliver({
					tradeSymbol: Context?.From?.What,
					units: ship.cargo.inventory.find(i=>i.symbol===Context?.From?.What).units,
					contractId: $contracts.find((v) => v.terms.deliver.some((d) => d.destinationSymbol === ship.nav.waypointSymbol && d.tradeSymbol === Context?.From?.What) && v.accepted && !v.fulfilled).id,
				});
				//On (REFUEL) ou pas
				if (Context?.To?.Max) {
					await onFuel();
					Check(Prev);
				}
			}
		} catch (error) {
			err = error;
		}
	}

	const arrayRotate = (arr, count) => {
		const len = arr.length;
		arr.push(...arr.splice(0, (-count % len + len) % len));
		return arr;
	}

	const fWP2Sys = (wp) => {
		const [first, second] = wp.split("-");
		return `${first}-${second}`;
	}

	const endOfTransit = () => sleep((Coolmove?.remainingSeconds > 0) ? Coolmove.remainingSeconds : 0);
	const endOfCooldown = () => sleep((Cooldown?.remainingSeconds > 0) ? Cooldown.remainingSeconds : 0);

	const onGateTo = async ({waypointSymbol, avoidUpdate=false}) => {
		let Gate;
		const Check = (el) => {if (el != err) throw "Done" };
		if (waypointSymbol === ship.nav.waypointSymbol) return;
		if (waypointSymbol.startsWith(ship.nav.systemSymbol)) {
			if (ship.nav.status !== "IN_ORBIT") onOrbit();
			return onNavigate({waypointSymbol, avoidUpdate});
		}
		if (Gate = $systems?.[ship.nav.systemSymbol].waypoints.find(w=>w.type==="JUMP_GATE")) {
			const Prev = err;
			if (ship.nav.status !== "IN_ORBIT") onOrbit();
			Check(Prev);
			await onNavigate({waypointSymbol: Gate.symbol, avoidUpdate: true});
			Check(Prev);
			await endOfTransit();
			Check(Prev);
			await onJump({ systemSymbol: fWP2Sys(waypointSymbol) })
			Check(Prev);
			return onNavigate({waypointSymbol, avoidUpdate});
		} else {
			return onNavigate({waypointSymbol, avoidUpdate});
		}
	}
		
	const onUpdateMarkets = async () => {
		try {
			const Check = (el) => {if (mission!="UpdateMarkets" || el != err) throw "Done" };
			let Markets = Object.values($waypoints).filter((wp)=> wp.systemSymbol === ship.nav.systemSymbol  && wp.traits.map(t=>t.symbol).includes("MARKETPLACE"));
			if (Markets.length < 2) throw "Scan system";
			const pos = Markets.findIndex(m=>m.symbol === ship.nav.waypointSymbol);
			if (pos > 0) {
				Markets = arrayRotate(Markets, Markets.length - pos);
			}
			while (true) {
				const Prev = err;
				for (const Market of Markets) {
					if (Market.symbol !== ship.nav.waypointSymbol) {
						await onGateTo({
							waypointSymbol: Market.symbol,
							avoidUpdate: true
						});
						Check(Prev);
						await endOfTransit();
						Check(Prev);
					}
					await onMarket({
						waypointSymbol: ship.nav.waypointSymbol,
						systemSymbol: ship.nav.systemSymbol
					});
					Check(Prev);
				}
			}
		} catch (error) {
			err = error;
		}
	}

	const majTime = (t) => {
		if (Coolmove?.remainingSeconds && Coolmove?.remainingSeconds > 0) {
			Coolmove.remainingSeconds--;
		}
		if (Cooldown?.remainingSeconds && Cooldown?.remainingSeconds > 0) {
			Cooldown.remainingSeconds--;
			if (
				Cooldown.remainingSeconds === 0 &&
				ship.nav.status !== "IN_TRANSIT"
			) {
				switch (mission) {
					case "Extract_Max":
						if (ship.cargo.units < ship.cargo.capacity) onExtract();
						break;

					case "Extract_Sell":
						if (ship.cargo.units < ship.cargo.capacity)
							onExtractSell();
						break;

					case "Survey_All":
						onSurvey();
						break;

					default:
						break;
				}
			}
		}
	};

	let Contexts = {
		Survey: "",
		SearchSurvey: "",
		DeliverAway: "",
		SellAway: "",
		UpdateMarkets: ""
	}

	let Actions = {
		Extract_Once: {
			ok: (s) => s.mounts.some(m => m.symbol.startsWith("MOUNT_MINING_LASER")),
			fn: onExtract,
			Ctx: "Survey"
		},
		Extract_Max: {
			ok: (s) => s.mounts.some(m => m.symbol.startsWith("MOUNT_MINING_LASER")),
			fn: onExtract,
			Ctx: "Survey"			
		},
		Extract_Sell: {
			ok: (s) => s.mounts.some(m => m.symbol.startsWith("MOUNT_MINING_LASER")),
			fn: onExtractSell,
			Ctx: "Survey"
		},
		Survey: {
			ok: (s) => s.mounts.some(m => m.symbol.startsWith("MOUNT_SURVEYOR")),
			fn: onSurvey,
			Ctx: "SearchSurvey"
		},
		Survey_All: {
			ok: (s) => s.mounts.some(m => m.symbol.startsWith("MOUNT_SURVEYOR")),
			fn: onSurvey,
			Ctx: "SearchSurvey"
		},
		DeliverAway: {
			ok: (s) => (s.cargo.capacity > 0),
			fn: onAutoDeliverAway,
			Ctx: "DeliverAway"
		},
		SellAway: {
			ok: (s) => (s.cargo.capacity > 0),
			fn: onAutoSellAway,
			Ctx: "SellAway"
		},
		UpdateMarkets: {
			ok: (s) => true,
			fn: onUpdateMarkets,
			Ctx: "UpdateMarkets"
		}
	};

	$: ship = $ships?.[symbol];
	$: majTime(tick);
	$: inCoolDown =
		Cooldown?.remainingSeconds !== 0 &&
		Cooldown?.remainingSeconds !== undefined;
	$: near = Object.values($ships).filter(
		(v) =>
			v.symbol !== ship.symbol &&
			v.nav.waypointSymbol === ship.nav.waypointSymbol &&
			v.nav.status === ship.nav.status
	);
	$: {
		MyActions = [];
		for (const [ActionName, Action] of Object.entries(Actions)) 
			if (Action.ok(ship)) 
				MyActions.push(ActionName);
	}
	// MyActions = Actions.reduce((Res, action),{})
</script>

<div class="panel-block">
	Status : {ship.nav.status} &nbsp;
	<div class="buttons has-addons">
		{#if ship.nav.status === "DOCKED"}
			<button
				class="button is-small is-rounded is-info"
				type="button"
				on:click={onOrbit}>
				<span class="icon is-small">
					<i
						class="fa-solid fa-arrow-turn-up"
					/>
				</span>
			</button>
		{:else if ship.nav.status === "IN_ORBIT"}
			<button
				class="button is-small is-rounded is-link"
				type="button"
				on:click={onDock}
			>
			<span class="icon is-small">
				<i
					class="fa-solid fa-anchor"
				/>
			</span>
		</button>
		{/if}
	</div>
	{#if ship.nav.status === "IN_TRANSIT"}
		{#if Coolmove?.remainingSeconds}
			<progress
				title={`${Coolmove.remainingSeconds}/${Coolmove.totalSeconds}`}
				class="progress is-small is-info"
				value={Coolmove.remainingSeconds}
				max={Coolmove.totalSeconds}>{Coolmove.remainingSeconds}</progress
			>
		{:else}
			{(setCoolmove(ship?.nav?.route), "")}
		{/if}
	{/if}
</div>

<div class="panel-block">
	Actions : &nbsp;
	<div class="buttons has-addons">
		<select class="button is-small is-rounded" bind:value={mission}>
			{#each MyActions as action}
				<option value={action}>
					{action}
				</option>
			{/each}</select
		>
		<button
			class="button is-small is-rounded is-info"
			type="button"
			on:click={() => {
				hideCtx = !hideCtx;
			}}
		>
			<span class="icon is-small">
				<i
					class="fa-solid"
					class:fa-angle-right={hideCtx}
					class:fa-angle-left={!hideCtx}
				/>
			</span>
		</button>
		{#if !hideCtx}
			<input
				class="button is-small is-rounded"
				bind:value={Contexts[Actions[mission].Ctx]}
				placeholder="Survey Signature"
			/>
		{/if}
		<button
			class="button is-small is-rounded is-success"
			type="button"
			disabled={inCoolDown || ship.nav.status !== "IN_ORBIT"}
			on:click={onAction}
		>
			<span class="icon is-small">
				<i class="fa-solid fa-check" />
			</span>
		</button>
	</div>
</div>

{#if Cooldown?.remainingSeconds}
	<div class="panel-block">
		<progress
			title={`${Cooldown.remainingSeconds}/${Cooldown.totalSeconds}`}
			class="progress is-small is-success"
			value={Cooldown.remainingSeconds}
			max={Cooldown.totalSeconds}>{Cooldown.remainingSeconds}</progress
		>
	</div>
{/if}

<div class="panel-block">
	<table class="table is-narrow">
		<tbody>
			<tr>
				<td>Position :</td>
				{#if ship.nav.status === "IN_TRANSIT"}
				<td>
					<button
						class="button is-small is-rounded"
						on:click={() => {
							onWaypoint({
								systemSymbol: ship.nav.route.departure.systemSymbol,
								waypointSymbol: ship.nav.route.departure.symbol,
							});
						}}
					>
						<span class="icon is-small">
							<i class="fa-solid fa-eye" />
						</span>
					</button>
					<Copy value={ship.nav.route.departure.symbol} />
					&nbsp;
					<span class="icon is-small">
						<i class="fa-solid fa-shuttle-space" />
					</span>
					&nbsp;
					<Copy value={ship.nav.route.destination.symbol} />
					<button
						class="button is-small is-rounded"
						on:click={() => {
							onWaypoint({
								systemSymbol: ship.nav.route.destination.systemSymbol,
								waypointSymbol: ship.nav.route.destination.symbol,
							});
						}}
					>
						<span class="icon is-small">
							<i class="fa-solid fa-eye" />
						</span>
					</button>
				</td>
			
				{:else}
				<td>
					<button
						class="button is-small is-rounded"
						on:click={() => {
							onWaypoint({
								systemSymbol: ship.nav.systemSymbol,
								waypointSymbol: ship.nav.waypointSymbol,
							});
						}}
					>
						<span class="icon is-small">
							<i class="fa-solid fa-eye" />
						</span>
					</button>
					<Copy value={ship.nav.waypointSymbol} />
				</td>
				<td>
					<div class="buttons has-addons">
						{#if !hideDest}
							<select
								class="button is-small is-rounded is-link"
								bind:value={selFM}
								on:change={() => onSetNav({ flightMode: selFM })}
							>
								{#each ["DRIFT", "STEALTH", "CRUISE", "BURN"] as flightMode}
									<option
										value={flightMode}
										selected={flightMode === ship.nav.flightMode}
									>
										{flightMode}
									</option>
								{/each}</select
							>
							<input
								class="button is-small is-rounded"
								type="text"
								placeholder="waypoint"
								bind:value={iDest}
							/>{/if}
						<button
							class="button is-small is-rounded is-warning"
							on:click={() => {
								if (hideDest) {
									iDest = undefined;
									hideDest = false;
								} else {
									hideDest = true;
									if (iDest) onGateTo({ waypointSymbol: iDest });
									iDest = undefined;
								}
							}}
						>
							<span class="icon is-small">
								<i
									class="fa-solid fa-rocket"
									class:fa-beat-fade={iDest}
								/>
							</span>
						</button>
					</div>
				</td>
				<td>
					<div class="buttons has-addons">
						{#if !hideJump}
							<input
								class="button is-small is-rounded"
								type="text"
								placeholder="system"
								bind:value={iJump}
							/>{/if}
						<button
							class="button is-small is-rounded is-warning"
							on:click={() => {
								if (hideJump) {
									iJump = undefined;
									hideJump = false;
								} else {
									hideJump = true;
									if (iJump) onJump({ systemSymbol: fWP2Sys(iJump) });
									iJump = undefined;
								}
							}}
						>
							<span class="icon is-small">
								<i
									class="fa-solid fa-elevator"
									class:fa-beat-fade={iJump}
								/>
							</span>
						</button>
					</div>
				</td>
				{/if}
			</tr>
		</tbody>
	</table>
</div>

{#if ship.fuel.capacity > 0}
	<div class="panel-block">
		Fuel : {ship.fuel.current} / {ship.fuel.capacity} &nbsp;
		<button
			class="button is-small is-rounded is-info"
			disabled={ship.nav.status !== "DOCKED"}
			on:click={onFuel}
		>
			<span class="icon is-small">
				<i
					class={`fa-solid fa-battery-${
						["empty", "quarter", "half", "three-quarters", "full"][
							Math.round((4 * ship.fuel.current) / ship.fuel.capacity)
						]
					}`}
				/>
			</span>
		</button>
	</div>
{/if}

{#if ship.cargo.capacity > 0}
	<div class="panel-block">
		<button
			class="button is-small is-rounded"
			on:click={() => {
				showCargo = !showCargo;
			}}
		>
			<span class="icon is-small">
				<i class={`fa-solid fa-${showCargo ? "angle-down" : "angle-right"}`} />
			</span>
		</button>
		&nbsp; Cargo : {ship.cargo.units} / {ship.cargo.capacity} &nbsp;
		<button class="button is-small is-rounded" on:click={onCargo}>
			<span class="icon is-small">
				<i class="fa-solid fa-refresh" />
			</span>
		</button>
	</div>

	{#if showCargo}
		<div class="panel-block">
			<table class="table">
				<tbody>
					{#each ship.cargo.inventory as item}
						<tr>
							<td>
								{#if $keepers.includes(item.symbol)}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<span
										class="icon has-text-danger"
										on:click={() => {
											$keepers = $keepers.filter(
												(k) => k !== item.symbol
											);
										}}
									>
										<i class="fa-solid fa-ban" />
									</span>
								{:else}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<span
										class="icon has-text-success"
										on:click={() => {
											$keepers = [...$keepers, item.symbol];
										}}
									>
										<i class="fa-solid fa-shopping-cart" />
									</span>
								{/if}
							</td>
							<td>{item.symbol}</td>
							<td>:</td>
							<td>{item.units}</td>
							<td>
								<div class="buttons has-addons">
									{#if ship.nav.status === "DOCKED"}
										{#if !$keepers.includes(item.symbol)}
											<button
												class="button is-small is-rounded is-warning"
												type="button"
												on:click={() =>
													onSell({
														symbol: item.symbol,
														units: item.units,
													})}>Sell</button
											>
										{/if}
										{#each $contracts.filter((v) => v.terms.deliver.some((d) => d.destinationSymbol === ship.nav.waypointSymbol && d.tradeSymbol === item.symbol) && v.accepted && !v.fulfilled) as Contract}
											<button
												class="button is-small is-rounded is-warning"
												type="button"
												on:click={() =>
													onDeliver({
														tradeSymbol: item.symbol,
														units: item.units,
														contractId: Contract.id,
													})}>Deliver</button
											>
										{/each}
									{/if}
									{#if near.length}
										<button
											class="button is-small is-rounded is-info"
											type="button"
											on:click={() =>
												onXfr({
													tradeSymbol: item.symbol,
													units: item.units,
													destShipSymbol: selXfr,
												})}>Transfer</button
										>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if near.length && ship.cargo.inventory.length}
			<div class="panel-block" class:is-hidden={near.length < 2}>
				Transfer : &nbsp; <select
					class="button is-small is-rounded"
					bind:value={selXfr}
				>
					{#each near as other (other.symbol)}
						<option value={other.symbol}>
							{other.symbol}
						</option>
					{/each}</select
				>
			</div>
		{/if}
	{/if}
{/if}

<Show value={err} />
