import superagent from "superagent";
import jsonata from "jsonata";
import mustache from "mustache";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const helpers = {
	inline: function () {
		return this.replace(/([\r\n]+)/g, " ");
	},
	camelize: function () {
		return this.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
			if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
			return index === 0 ? match.toLowerCase() : match.toUpperCase();
		});
	},
	args: function () {
		let args = [];
		for (const Param of this?.upParameters ?? [])
			args.push(Param.name);
		for (const [Key, Value] of Object.entries(this?.requestBody?.properties ?? {}))
			args.push(Key);
		if (this?.security?.length > 0) args.push('token');
		for (const Param of this?.parameters ?? [])
			args.push(Param.name);
		return (args.length > 0)
			? `{ ${args.join(", ")} }`
			: "";
	},
	checkConflict: function () {
		let args = [];
		for (const Param of this?.upParameters ?? [])
			args.push(Param.name);
		for (const [Key, Value] of Object.entries(this?.requestBody?.properties ?? {}))
			args.push(Key);
		if (this?.security?.length > 0) args.push('token');
		for (const Param of this?.parameters ?? [])
			args.push(Param.name);
		return Object.values(args.reduce((ac, c) => (ac[c] = ac[c] + 1 || 1, ac), {})).some(i => i !== 1);
	},
	typedArgs: function () {
		let args = [];
		for (const Param of this?.upParameters ?? [])
			args.push(`${Param.name}:${Param.schema.type==='integer'?'number':Param.schema.type}`);
		for (const [Key, Value] of Object.entries(this?.requestBody?.properties ?? {})) {
			let type = Value?.type ?? Value?.['$ref']?.split("/")?.reverse?.()?.[0] ?? undefined;
			if (type === "integer") type = 'number';
			const opt = (this?.requestBody?.required?.includes?.(Key)) ? "" : "?";
			args.push(type ? `${Key}${opt}:${type}` : Key);
		}
		if (this?.security?.length > 0) args.push('token:string');
		for (const Param of this?.parameters ?? [])
			args.push(`${Param.name}:${Param.schema.type==='integer'?'number':Param.schema.type}`);
		return (args.length > 0)
			? `{ ${args.join(", ")} }`
			: "";
	},
	queryArgs: function () {
		let args = [];
		for (const Param of this?.parameters ?? [])
			args.push(Param.name);
		return (args.length > 0)
			? `{ ${args.join(", ")} }`
			: "";
	},
	bodyArgs: function () {
		let args = [];
		for (const [Key, Value] of Object.entries(this?.requestBody?.properties ?? {}))
			args.push(Key);
		return (args.length > 0)
			? `{ ${args.join(", ")} }`
			: "";
	},
	backtick: function () {
		return this.replace(/({)/g, "${");
	},
	hasAuth: function () {
		return (this?.security?.length > 0) ? true : false;
	},
	hasQuery: function () {
		return ((this?.parameters ?? []).length > 0) ? true : false
	},
	hasBody: function () {
		return (Object.keys(this?.requestBody?.properties ?? {}).length > 0) ? true : false
	},
	typedResponse: function () {
		let recResponses = (responses) => {
			let args = [];
			for (const [Key, Value] of Object.entries(responses?.properties ?? {})) {
				const opt = (responses?.required?.includes?.(Key)) ? "" : "?";
				let type = Value?.type ?? Value?.['$ref']?.split("/")?.reverse?.()?.[0] ?? undefined;
				if (type === "integer") type = 'number';
				if (type === "array") type = (Value?.items?.type ?? Value?.items?.['$ref']?.split("/")?.reverse?.()?.[0]) + '[]';
				if (type === "object") type = recResponses(responses?.properties?.[Key]);
				if (type)
					args.push(type ? `${Key}${opt}:${type}` : Key);
			}
			return (args.length > 0)
				? `{ ${args.join(", ")} }`
				: "";

		}
		return recResponses(this?.responses);
	},
	show: function () {
		return JSON.stringify(this);
	}
}


// get swagger
const SwagUrl = "https://stoplight.io/api/v1/projects/spacetraders/spacetraders/nodes/reference/SpaceTraders.json?fromExportButton=true&snapshotType=http_service&deref=optimizedBundle";
const { body: swagger } = await superagent.get(SwagUrl);

// Normalize it with Jsonata;
const Normalize = jsonata(await fs.readFile(path.resolve(__dirname, "./Normalize.jsonata"), "utf8"));
const NormalizedSwagger = await Normalize.evaluate({ swagger });

// Template it
const Template = await fs.readFile(path.resolve(__dirname, "./Template.mustache"), "utf8")
const Content = mustache.render(Template, { ...NormalizedSwagger, ...helpers });

console.log(Content);
