globalThis.process ??= {};
globalThis.process.env ??= {};
import { F as maybeRenderHead, J as createAstro, L as addAttribute, _ as renderTemplate, i as renderTransition, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { t as createSvgComponent } from "./runtime_Bwzfvzj8.mjs";
/* empty css                          */
//#region src/assets/icons/IconHash.svg
var IconHash_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconHash.CPmqEwD_.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"width": "24",
		"height": "24",
		"fill": "none",
		"stroke": "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-hash",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M5 9h14M5 15h14M11 4 7 20M17 4l-4 16\" />",
	"styles": []
});
//#endregion
//#region src/components/Tag.astro
createAstro("https://astro-paper.pages.dev/");
var $$Tag = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Tag;
	const { tag, tagName, size = "lg" } = Astro.props;
	const locale = Astro.currentLocale ?? config.site.lang;
	return renderTemplate`${maybeRenderHead($$result)}<li><a${addAttribute(renderTransition($$result, "bztu2lml", "", tag), "data-astro-transition-scope")}${addAttribute(getRelativeLocaleUrl(locale, `tags/${tag}/`), "href")}${addAttribute([
		"flex items-center gap-0.5",
		"border-foreground border-b-2 border-dashed",
		"hover:border-accent hover:text-accent hover:-mt-0.5",
		"focus-visible:text-accent focus-visible:border-none",
		{ "text-sm": size === "sm" },
		{ "text-lg": size === "lg" }
	], "class:list")}>${renderComponent($$result, "IconHash", IconHash_default, { "class:list": [
		"opacity-80",
		{ "size-5": size === "lg" },
		{ "size-4": size === "sm" }
	] })}${tagName}</a></li>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Tag.astro", "self");
//#endregion
export { $$Tag as t };
