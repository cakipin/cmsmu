globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, _ as renderTemplate, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { a as $$LinkButton, i as useTranslations, o as $$Layout, r as $$Header, t as $$Footer } from "./Footer_BnjUarGW.mjs";
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro-paper.pages.dev/");
var $$404 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$404;
	const locale = Astro.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${t.notFound.title} | ${config.site.title}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${maybeRenderHead($$result)}<main id="main-content" class="app-layout flex flex-1 items-center justify-center"><div class="mb-14 flex flex-col items-center justify-center"><h1 class="text-accent text-9xl font-bold">404</h1><span aria-hidden="true"> ¯\\_(ツ)_/¯ </span><p class="mt-4 text-2xl sm:text-3xl">${t.notFound.message}</p>${renderComponent($$result, "LinkButton", $$LinkButton, {
		"href": getRelativeLocaleUrl(locale, ""),
		"class": "my-6 text-lg underline decoration-dashed underline-offset-8"
	}, { "default": ($$result) => renderTemplate`${t.notFound.goHome}` })}</div></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/404.astro", void 0);
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
