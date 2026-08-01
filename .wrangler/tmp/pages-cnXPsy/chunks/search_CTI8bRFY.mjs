globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, L as addAttribute, _ as renderTemplate, l as renderComponent, r as createTransitionScope } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { i as useTranslations, o as $$Layout, r as $$Header, s as getAssetPath, t as $$Footer, u as renderScript } from "./Footer_BnjUarGW.mjs";
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { n as $$Breadcrumb, t as $$Main } from "./Main_C5h4S1pM.mjs";
/* empty css                          */
//#region src/pages/search.astro
var search_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Search,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro-paper.pages.dev/");
var $$Search = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Search;
	const locale = Astro.currentLocale ?? config.site.lang;
	const notFoundUrl = getRelativeLocaleUrl(locale, "404");
	if (config.features.search !== "pagefind" && notFoundUrl) return Astro.rewrite(notFoundUrl);
	const backUrl = config.features.showBackButton ? `${Astro.url.pathname}` : getRelativeLocaleUrl(locale, "");
	const pagefindBundlePath = getAssetPath("pagefind/");
	const t = useTranslations(locale);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${t.pages.searchTitle} | ${config.site.title}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${renderComponent($$result, "Breadcrumb", $$Breadcrumb, {})}${renderComponent($$result, "Main", $$Main, {
		"pageTitle": t.pages.searchTitle,
		"pageDesc": t.pages.searchDesc
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(createTransitionScope($$result, "637jddtz"), "data-astro-transition-persist")} id="pagefind-search"${addAttribute(backUrl, "data-backurl")}${addAttribute(pagefindBundlePath, "data-bundle-path")}></div>` })}${renderComponent($$result, "Footer", $$Footer, {})}` })}${renderScript($$result, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/search.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/search.astro", "self");
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/search.astro";
var $$url = "/search";
//#endregion
//#region \0virtual:astro:page:src/pages/search@_@astro
var page = () => search_exports;
//#endregion
export { page };
