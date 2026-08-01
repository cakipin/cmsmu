globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, _ as renderTemplate, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { i as useTranslations, o as $$Layout, r as $$Header, t as $$Footer } from "./Footer_BnjUarGW.mjs";
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { n as $$Breadcrumb, t as $$Main } from "./Main_C5h4S1pM.mjs";
import { i as getD1Posts, t as postFilter } from "./postFilter_B3fh8a1F.mjs";
import { t as $$Card } from "./Card_HjTqTb0b.mjs";
//#region src/pages/archives/_utils/getPostsByGroupCondition.ts
function getPostsByGroupCondition(posts, groupFunction) {
	const result = {};
	for (let i = 0; i < posts.length; i++) {
		const item = posts[i];
		const groupKey = groupFunction(item, i);
		if (!result[groupKey]) result[groupKey] = [];
		result[groupKey].push(item);
	}
	return result;
}
//#endregion
//#region src/pages/archives/index.astro
var archives_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro-paper.pages.dev/");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const locale = Astro.currentLocale ?? config.site.lang;
	const notFoundUrl = getRelativeLocaleUrl(locale, "404");
	if (!config.features.showArchives && notFoundUrl) return Astro.rewrite(notFoundUrl);
	const t = useTranslations(locale);
	const filteredPosts = (await getD1Posts(Astro)).filter(postFilter);
	const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long" });
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${t.pages.archivesTitle} | ${config.site.title}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${renderComponent($$result, "Breadcrumb", $$Breadcrumb, {})}${renderComponent($$result, "Main", $$Main, {
		"pageTitle": t.pages.archivesTitle,
		"pageDesc": t.pages.archivesDesc
	}, { "default": ($$result) => renderTemplate`${Object.entries(getPostsByGroupCondition(filteredPosts, (post) => post.data.pubDatetime.getFullYear())).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)).map(([year, yearGroup]) => renderTemplate`${maybeRenderHead($$result)}<div><span class="text-2xl font-bold">${year}</span><sup class="text-muted-foreground text-sm">${yearGroup.length}</sup>${Object.entries(getPostsByGroupCondition(yearGroup, (post) => post.data.pubDatetime.getMonth() + 1)).sort(([monthA], [monthB]) => Number(monthB) - Number(monthA)).map(([month, monthGroup]) => renderTemplate`<div class="flex flex-col sm:flex-row"><div class="mt-6 min-w-36 text-lg sm:my-6"><span class="font-bold">${monthFormatter.format(new Date(2e3, Number(month) - 1, 1))}</span><sup class="text-muted-foreground text-xs">${monthGroup.length}</sup></div><ul>${monthGroup.sort((a, b) => Math.floor(new Date(b.data.pubDatetime).getTime() / 1e3) - Math.floor(new Date(a.data.pubDatetime).getTime() / 1e3)).map((data) => renderTemplate`${renderComponent($$result, "Card", $$Card, { ...data })}`)}</ul></div>`)}</div>`)}` })}${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/archives/index.astro", void 0);
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/archives/index.astro";
var $$url = "/archives";
//#endregion
//#region \0virtual:astro:page:src/pages/archives/index@_@astro
var page = () => archives_exports;
//#endregion
export { page };
