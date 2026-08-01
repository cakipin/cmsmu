globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, _ as renderTemplate, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { i as useTranslations, o as $$Layout, r as $$Header, t as $$Footer } from "./Footer_BnjUarGW.mjs";
import { t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { n as $$Breadcrumb, t as $$Main } from "./Main_C5h4S1pM.mjs";
import { i as getD1Posts, n as slugifyAll } from "./postFilter_B3fh8a1F.mjs";
import { t as $$Card } from "./Card_HjTqTb0b.mjs";
import { t as getSortedPosts } from "./getSortedPosts_BM6Hczh2.mjs";
import { t as $$Pagination } from "./Pagination_B5JNqYbo.mjs";
import { t as getUniqueTags } from "./getUniqueTags_D71830ED.mjs";
//#region src/pages/tags/[tag]/index.astro
var _tag__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro-paper.pages.dev/");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const filteredPosts = (await getD1Posts(Astro)).filter(({ data }) => !data.draft);
	const tags = getUniqueTags(filteredPosts);
	const { tag } = Astro.params;
	const tagObj = tags.find((t) => t.tag === tag);
	if (!tagObj) return Astro.redirect("/404");
	const tagName = tagObj.tagName;
	const tagPosts = getSortedPosts(filteredPosts.filter(({ data }) => slugifyAll(data.tags).includes(tag)));
	const pageSize = config.posts.perPage;
	const totalPages = Math.max(1, Math.ceil(tagPosts.length / pageSize));
	const pageParam = Astro.url.searchParams.get("page") || "1";
	const currentPage = parseInt(pageParam, 10);
	if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) return Astro.redirect("/404");
	const start = (currentPage - 1) * pageSize;
	const end = Math.min(start + pageSize, tagPosts.length);
	const page = {
		data: tagPosts.slice(start, end),
		start,
		end: end - 1,
		size: pageSize,
		total: tagPosts.length,
		currentPage,
		lastPage: totalPages,
		url: {
			current: currentPage === 1 ? `/tags/${tag}` : `/tags/${tag}?page=${currentPage}`,
			prev: currentPage > 1 ? currentPage === 2 ? `/tags/${tag}` : `/tags/${tag}?page=${currentPage - 1}` : void 0,
			next: currentPage < totalPages ? `/tags/${tag}?page=${currentPage + 1}` : void 0,
			first: `/tags/${tag}`,
			last: totalPages === 1 ? `/tags/${tag}` : `/tags/${tag}?page=${totalPages}`
		}
	};
	const locale = Astro.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${t.pages.tagTitle}: ${tagName} | ${config.site.title}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${renderComponent($$result, "Breadcrumb", $$Breadcrumb, {})}${renderComponent($$result, "Main", $$Main, {
		"pageTitle": `${t.pages.tagTitle}: ${tagName}`,
		"pageDesc": `${t.pages.tagDesc} "${tagName}".`
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<ul>${page.data.map((data) => renderTemplate`${renderComponent($$result, "Card", $$Card, { ...data })}`)}</ul>` })}${renderComponent($$result, "Pagination", $$Pagination, { "page": page })}${renderComponent($$result, "Footer", $$Footer, { "noMarginTop": page.lastPage > 1 })}` })}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/tags/[tag]/index.astro", void 0);
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/tags/[tag]/index.astro";
var $$url = "/tags/[tag]";
//#endregion
//#region \0virtual:astro:page:src/pages/tags/[tag]/index@_@astro
var page = () => _tag__exports;
//#endregion
export { page };
