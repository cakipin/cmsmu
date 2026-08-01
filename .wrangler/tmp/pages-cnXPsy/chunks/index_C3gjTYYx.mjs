globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, L as addAttribute, _ as renderTemplate, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { a as $$LinkButton, i as useTranslations, n as $$Socials, o as $$Layout, r as $$Header, t as $$Footer, u as renderScript } from "./Footer_BnjUarGW.mjs";
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { t as createSvgComponent } from "./runtime_Bwzfvzj8.mjs";
import { i as getD1Posts } from "./postFilter_B3fh8a1F.mjs";
import { t as $$Card } from "./Card_HjTqTb0b.mjs";
import { t as IconArrowRight_default } from "./IconArrowRight_BWkj2bXh.mjs";
import { t as getSortedPosts } from "./getSortedPosts_BM6Hczh2.mjs";
//#region src/assets/icons/IconRss.svg
var IconRss_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconRss.BYWRoVjV.svg",
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
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-rss",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M4 19a1 1 0 1 0 2 0 1 1 0 1 0-2 0M4 4a16 16 0 0 1 16 16M4 11a9 9 0 0 1 9 9\" />",
	"styles": []
});
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://astro-paper.pages.dev/");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Index;
	const { socials, posts: postsConfig } = config;
	const locale = Astro2.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	const posts = await getD1Posts(Astro2);
	const sortedPosts = getSortedPosts(posts);
	const featuredPosts = sortedPosts.filter(({ data }) => data.featured);
	const recentPosts = sortedPosts.filter(({ data }) => !data.featured);
	const homePath = getRelativeLocaleUrl(locale, "");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, {})}${maybeRenderHead($$result2)}<main id="main-content" data-layout="index"${addAttribute(homePath, "data-home-path")} class="app-layout"><section id="hero" class="border-border border-b pt-8 pb-6"><h1 class="my-4 inline-block text-4xl font-bold sm:my-8 sm:text-5xl">Mingalaba</h1><a target="_blank"${addAttribute(`${"/".replace(/\/?$/, "/")}rss.xml`, "href")} class="inline-block" aria-label="RSS Feed" title="RSS Feed">${renderComponent($$result2, "IconRss", IconRss_default, {
		"width": 20,
		"height": 20,
		"class": "stroke-accent scale-125 stroke-3 rtl:-rotate-90"
	})}<span class="sr-only">RSS Feed</span></a><p>AstroPaper is a minimal, responsive, accessible and SEO-friendly Astro blog theme. This theme follows best practices and provides accessibility out of the box. Light and dark mode are supported by default. Moreover, additional color schemes can also be configured.</p><p class="mt-2">Read the blog posts or check${" "}${renderComponent($$result2, "LinkButton", $$LinkButton, {
		"class": "hover:text-accent underline decoration-dashed underline-offset-4",
		"href": "https://github.com/satnaing/astro-paper#readme"
	}, { "default": ($$result3) => renderTemplate`README` })}${" "}for more info.</p>${socials.length > 0 && renderTemplate`<div class="mt-4 flex max-sm:flex-col sm:items-center"><div class="me-2 mb-1 whitespace-nowrap sm:mb-0">${t.home.socialLinks}:</div>${renderComponent($$result2, "Socials", $$Socials, {})}</div>`}</section>${featuredPosts.length > 0 && renderTemplate`<section id="featured"${addAttribute(["pt-12 pb-6", { "border-border border-b": recentPosts.length > 0 }], "class:list")}><h2 class="text-2xl font-semibold tracking-wide">${t.home.featured}</h2><ul>${featuredPosts.map((data) => renderTemplate`${renderComponent($$result2, "Card", $$Card, {
		"variant": "h3",
		...data
	})}`)}</ul></section>`}${recentPosts.length > 0 && renderTemplate`<section id="recent-posts" class="pt-12 pb-6"><h2 class="text-2xl font-semibold tracking-wide">${t.home.recentPosts}</h2><ul>${recentPosts.slice(0, postsConfig.perIndex).map((data) => renderTemplate`${renderComponent($$result2, "Card", $$Card, {
		"variant": "h3",
		...data
	})}`)}</ul></section>`}<div class="my-8 text-center">${renderComponent($$result2, "LinkButton", $$LinkButton, { "href": getRelativeLocaleUrl(locale, "posts") }, { "default": ($$result3) => renderTemplate`${t.home.allPosts}${renderComponent($$result3, "IconArrowRight", IconArrowRight_default, { "class": "inline-block rtl:-rotate-180" })}` })}</div></main>${renderComponent($$result2, "Footer", $$Footer, {})}` })}${renderScript($$result, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/index.astro", void 0);
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
