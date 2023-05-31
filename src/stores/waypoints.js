import { writable } from 'svelte/store';
import { produce } from "immer";

export const waypoints = writable({});
export const waypointsSet = produce((draft, items) => {
	if (items) {
	// @ts-ignore
		for (const item of items) {
			draft[item.symbol] = item;
		}
	}
});
export const waypointsPut = produce((draft, item) => {
	if (item) {
	// @ts-ignore
		draft[item.symbol] = item;
	}
});
export const waypointsMod = produce((draft, symbol, item, all = false) => {
	if (all) {
		// @ts-ignore
		if (item) draft[symbol] = item;
	} else {
		for (const [key, value] of Object.entries(item)) {
			// @ts-ignore
			if (value) draft[symbol][key] = value;
		}
	}
});


