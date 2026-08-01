globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, _ as renderTemplate, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { i as useTranslations, o as $$Layout, r as $$Header, t as $$Footer } from "./Footer_BnjUarGW.mjs";
import { t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { n as $$Breadcrumb, t as $$Main } from "./Main_C5h4S1pM.mjs";
import { i as getD1Posts } from "./postFilter_B3fh8a1F.mjs";
import { t as $$Tag } from "./Tag_Cygu-1xj.mjs";
import { t as getUniqueTags } from "./getUniqueTags_D71830ED.mjs";
//#region src/pages/tags/index.astro
var tags_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro-paper.pages.dev/");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const posts = (await getD1Posts(Astro)).filter(({ data }) => !data.draft);
	const tags = getUniqueTags(posts);
	const locale = Astro.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${t.pages.tagsTitle} | ${config.site.title}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${renderComponent($$result, "Breadcrumb", $$Breadcrumb, {})}${renderComponent($$result, "Main", $$Main, {
		"pageTitle": t.pages.tagsTitle,
		"pageDesc": t.pages.tagsDesc
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<ul class="flex flex-wrap gap-6">${tags.map(({ tag, tagName }) => renderTemplate`${renderComponent($$result, "Tag", $$Tag, {
		"tag": tag,
		"tagName": tagName
	})}`)}</ul>` })}${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/tags/index.astro", void 0);
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/tags/index.astro";
var $$url = "/tags";
//#endregion
//#region \0virtual:astro:page:src/pages/tags/index@_@astro
var page = () => tags_exports;
//#endregion
export { page };
