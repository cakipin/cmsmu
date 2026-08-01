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
import { t as $$Card } from "./Card_HjTqTb0b.mjs";
import { t as getSortedPosts } from "./getSortedPosts_BM6Hczh2.mjs";
import { t as $$Pagination } from "./Pagination_B5JNqYbo.mjs";
//#region src/pages/posts/index.astro
var posts_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro-paper.pages.dev/");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const posts = await getD1Posts(Astro);
	const sortedPosts = getSortedPosts(posts.filter(({ data }) => !data.draft));
	const pageSize = config.posts.perPage;
	const totalPages = Math.max(1, Math.ceil(sortedPosts.length / pageSize));
	const pageParam = Astro.url.searchParams.get("page") || "1";
	const currentPage = parseInt(pageParam, 10);
	if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) return Astro.redirect("/404");
	const start = (currentPage - 1) * pageSize;
	const end = Math.min(start + pageSize, sortedPosts.length);
	const page = {
		data: sortedPosts.slice(start, end),
		start,
		end: end - 1,
		size: pageSize,
		total: sortedPosts.length,
		currentPage,
		lastPage: totalPages,
		url: {
			current: currentPage === 1 ? "/posts" : `/posts?page=${currentPage}`,
			prev: currentPage > 1 ? currentPage === 2 ? "/posts" : `/posts?page=${currentPage - 1}` : void 0,
			next: currentPage < totalPages ? `/posts?page=${currentPage + 1}` : void 0,
			first: "/posts",
			last: totalPages === 1 ? "/posts" : `/posts?page=${totalPages}`
		}
	};
	const locale = Astro.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${t.pages.postsTitle} | ${config.site.title}` }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${renderComponent($$result, "Breadcrumb", $$Breadcrumb, {})}${renderComponent($$result, "Main", $$Main, {
		"pageTitle": t.pages.postsTitle,
		"pageDesc": t.pages.postsDesc
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<ul>${page.data.map((data) => renderTemplate`${renderComponent($$result, "Card", $$Card, { ...data })}`)}</ul>` })}${renderComponent($$result, "Pagination", $$Pagination, { "page": page })}${renderComponent($$result, "Footer", $$Footer, { "noMarginTop": page.lastPage > 1 })}` })}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/index.astro", void 0);
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/index.astro";
var $$url = "/posts";
//#endregion
//#region \0virtual:astro:page:src/pages/posts/index@_@astro
var page = () => posts_exports;
//#endregion
export { page };
