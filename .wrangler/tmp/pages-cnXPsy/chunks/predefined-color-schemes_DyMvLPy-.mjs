globalThis.process ??= {};
globalThis.process.env ??= {};
//#region src/content/posts/_color-schemes/predefined-color-schemes.mdx?astroPropagatedAssets
async function getMod() {
	return import("./predefined-color-schemes_ByPjBKah.mjs");
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
