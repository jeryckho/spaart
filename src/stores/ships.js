import { writable } from 'svelte/store';
import { produce } from "immer";

export const ships = writable([]);

export const shipsSet = produce((draft, symbol, item, all = false) => {
	// @ts-ignore
	const index = draft.findIndex((i) => i.symbol === symbol);
	if (all) {
		if (item) draft[index] = item;
	} else {
		for (const [key, value] of Object.entries(item)) {
			if (value) draft[index][key] = value;
		}
	}
});
