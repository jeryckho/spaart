import { produce } from "immer";

export const IHashPatch = produce((draft, id, partial) => {
	// @ts-ignore
	for (const [key, value] of Object.entries(partial)) draft[id][key] = value;
})

export const IHashAdd = produce((draft, items, idName = "symbol") => {
	// @ts-ignore
	for (const item of items) if (item && item[idName]) draft[item[idName]] = item;
})

export const IArraySet = produce((draft, items) => {
	draft = items;
});

export const IArrayPatch = produce((draft, id, partial, idName = "symbol") => {
	// @ts-ignore
	const index = draft.findIndex((i) => i[idName] === id);
	for (const [key, value] of Object.entries(partial)) {
		if (value) draft[index][key] = value;
	}
});

export const IArrayReplace = produce((draft, id, item, idName = "symbol") => {
	// @ts-ignore
	const index = draft.findIndex((i) => i[idName] === id);
	if (item) draft[index] = item;
});

export const IObjectPatch = produce((draft, partial) => {
	// @ts-ignore
	for (const [key, value] of Object.entries(partial)) draft[key] = value;
})