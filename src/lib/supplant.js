// @ts-nocheck
// const fs = require("fs");
// export const From = (file, tp = null) => tp ? tp.evaluate(JSON.parse(fs.readFileSync(file, "utf8"))) : JSON.parse(fs.readFileSync(file, "utf8"));

const esr = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
if (!String.prototype.supplant) {
	String.prototype.supplant = function (o, re) {
		return this.replace(re, (a, b) => {
			const r = o[b];
			return typeof r === "string" || typeof r === "number" ? r : a;
		});
	};
}

export const Supplant = (str, o, re = As()) => str.replace(re, (a, b) => {
	const r = o[b];
	return typeof r === "string" || typeof r === "number" ? r : a;
});

export const As = (pre = '{', post = '}') => new RegExp(`${esr(pre)}([^${post.charAt(0)}]*)${esr(post)}`, "g");
export const Is = (style, tags = '()') => As(style + tags.charAt(0), tags.charAt(1));