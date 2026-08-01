globalThis.process ??= {};
globalThis.process.env ??= {};
//#region src/content/posts/adding-new-post.mdx?astroPropagatedAssets
async function getMod() {
	return import("./adding-new-post_B-J3Hrjw.mjs");
}
var defaultMod = {
	__astroPropagation: true,
	getMod,
	collectedLinks: [],
	collectedStyles: [],
	collectedScripts: []
};
//#endregion
export { defaultMod as default };
