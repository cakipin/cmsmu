globalThis.process ??= {};
globalThis.process.env ??= {};
//#region .astro/content-modules.mjs
var content_modules_default = /* @__PURE__ */ new Map([
	["src/content/posts/_color-schemes/predefined-color-schemes.mdx", () => import("./predefined-color-schemes_DyMvLPy-.mjs")],
	["src/content/posts/adding-new-post.mdx", () => import("./adding-new-post_BqqW6kCB.mjs")],
	["src/content/posts/customizing-astropaper-theme-color-schemes.mdx", () => import("./customizing-astropaper-theme-color-schemes_cNx2qMcI.mjs")],
	["src/content/posts/how-to-configure-astropaper-theme.mdx", () => import("./how-to-configure-astropaper-theme_C_Sty_2C.mjs")]
]);
//#endregion
export { content_modules_default as default };
