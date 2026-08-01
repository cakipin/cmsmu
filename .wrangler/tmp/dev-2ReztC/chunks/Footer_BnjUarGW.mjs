globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, I as renderHead, J as createAstro, L as addAttribute, R as createRenderInstruction, _ as renderTemplate, l as renderComponent, m as renderSlot, n as spreadAttributes } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { n as $$Font } from "./_astro_assets_DnoffuM4.mjs";
import { t as createSvgComponent } from "./runtime_Bwzfvzj8.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region node_modules/astro/components/ClientRouter.astro
createAstro("https://astro-paper.pages.dev/");
var $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ClientRouter;
	const { fallback = "animate" } = Astro.props;
	return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/Users/cakiphin/projects/cmsMu/astro-paper/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/node_modules/astro/components/ClientRouter.astro", void 0);
//#endregion
//#region src/utils/withBase.ts
var base = "/".replace(/\/+$/, "");
var baseRoot = base === "" ? "/" : `${base}/`;
function stripLocale(pathname, locale) {
	const prefix = `/${locale}`;
	if (pathname === prefix) return "/";
	if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
	return pathname;
}
function stripBase(pathname) {
	if (base === "") return pathname;
	if (pathname === base) return "/";
	if (pathname.startsWith(baseRoot)) {
		const stripped = pathname.slice(base.length);
		return stripped === "" ? "/" : stripped;
	}
	return pathname;
}
function getAssetPath(path) {
	const normalizedPath = path.replace(/^\/+/, "");
	if (!normalizedPath) return base === "" ? "/" : base;
	return baseRoot + normalizedPath;
}
//#endregion
//#region src/utils/resolveDefaultOgImagePath.ts
var publicFiles = /* #__PURE__ */ Object.assign({
	"/public/default-og.jpg": () => import("./default-og_RlXGE9Nq.mjs"),
	"/public/favicon.svg": () => import("./favicon_Bbd8Fcmw.mjs")
});
function existsInPublic(filename) {
	return `/public/${filename}` in publicFiles;
}
/**
* Resolves the absolute OG image path used for pages/posts.
*
* Security note: `site.ogImage` must be a single filename under `public/` to avoid
* path traversal or referencing arbitrary files.
*
* Behavior:
* - When `features.dynamicOgImage` is enabled, prefers `public/{site.ogImage}` when present,
*   otherwise falls back to the generated `/og.png`.
* - When disabled, requires `public/{site.ogImage}` to exist.
*/
function resolveDefaultOgImagePath(config) {
	const filename = config.site.ogImage;
	if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) throw new Error(`site.ogImage must be a single filename in public/ (e.g. "default-og.jpg"), got "${filename}"`);
	if (config.features.dynamicOgImage) return existsInPublic(filename) ? getAssetPath(filename) : getAssetPath("og.png");
	if (!existsInPublic(filename)) throw new Error(`AstroPaper: missing public/${filename}. Add that file, or set site.ogImage to an existing file under public/, or enable features.dynamicOgImage to fall back to /og.png.`);
	return getAssetPath(filename);
}
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro-paper.pages.dev/");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { site } = config;
	const { title = site.title, description = site.description, ogImage = resolveDefaultOgImagePath(config), canonicalURL = new URL(Astro.url.pathname, Astro.site).href } = Astro.props;
	const socialImageURL = new URL(ogImage, Astro.site ?? Astro.url);
	const rssHref = getRelativeLocaleUrl(Astro.currentLocale ?? config.site.lang, "rss.xml");
	return renderTemplate`<html${addAttribute(site.dir ?? "ltr", "dir")}${addAttribute(Astro.currentLocale ?? site.lang, "lang")} class="overflow-y-scroll scroll-smooth"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/svg+xml"${addAttribute(getAssetPath("favicon.svg"), "href")}><link rel="icon"${addAttribute(getAssetPath("favicon.ico"), "href")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><meta name="generator"${addAttribute(Astro.generator, "content")}><!-- Font -->${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-google-sans-code",
		"preload": [{
			subset: "latin",
			weight: 400,
			style: "normal"
		}]
	})}<!-- Primary meta --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><meta name="author"${addAttribute(site.author, "content")}><link rel="sitemap"${addAttribute(getAssetPath("sitemap-index.xml"), "href")}><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:site_name"${addAttribute(site.title, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:image"${addAttribute(socialImageURL, "content")}><!-- Twitter / X --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(socialImageURL, "content")}><!-- RSS autodiscovery --><link rel="alternate" type="application/rss+xml"${addAttribute(site.title, "title")}${addAttribute(new URL(rssHref, Astro.site), "href")}><!-- Filled at runtime by theme.ts to match the current background colour --><meta name="theme-color" content=""><!-- Extra head content injected by child layouts (e.g. JSON-LD, article meta) -->${renderSlot($$result, $$slots["head"])}${site.googleVerification && renderTemplate`<meta name="google-site-verification"${addAttribute(site.googleVerification, "content")}>`}<!--
      Inline FOUC-prevention script: sets data-theme on <html> before
      the browser paints. Runs synchronously, no defer/async.
    --><script>
      (function () {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const theme = stored ?? (prefersDark ? "dark" : "light");
        const root = document.firstElementChild;
        root?.setAttribute("data-theme", theme);
        root?.classList.toggle("dark", theme === "dark");
        // Expose value so theme.ts can skip re-detection.
        window.__theme = { value: theme };
      })();
    <\/script>${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${renderHead($$result)}</head><body class="bg-background font-app text-foreground selection:bg-accent/75 selection:text-accent-foreground flex min-h-svh flex-col">${renderSlot($$result, $$slots["default"])}${renderScript($$result, "/Users/cakiphin/projects/cmsMu/astro-paper/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/layouts/Layout.astro", void 0);
//#endregion
//#region src/assets/icons/IconUnderline.svg
var IconUnderline_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconUnderline.DIUG30rA.svg",
		"width": 181,
		"height": 35,
		"format": "svg"
	},
	"attributes": {
		"fill": "none",
		"viewBox": "0 0 181 35"
	},
	"children": "<path fill=\"currentColor\" d=\"M92.195 34.97c-10.777.476-17.646-4.837-21.224-14.728-2.49-6.896-7.027-9.675-14.37-9.56-15.843.23-31.27 2.462-45.983 8.48-4.48 1.829-7.142-.532-9.732-3.009C-1.261 14.08.67 9.905 4.779 8.594c6.812-2.174 13.725-4.52 20.766-5.413C38.197 1.583 50.991.993 63.715.042c7.027-.518 11.263 3.787 14.64 9.128 1.303 2.045 1.961 4.521 2.877 6.81 2.863 7.156 4.094 8.552 11.736 7.314 12.737-2.044 25.318-5.082 37.984-7.645 14.712-2.994 29.425-6.047 44.195-8.782 1.774-.331 3.892 1.267 5.853 1.958-1.03 1.483-1.746 3.8-3.12 4.29-8.029 2.894-16.115 5.73-24.359 7.876-16.759 4.362-33.618 8.307-50.463 12.31-3.55.849-7.242 1.137-10.863 1.684z\" />",
	"styles": []
});
//#endregion
//#region src/assets/icons/IconMenuDeep.svg
var IconMenuDeep_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconMenuDeep.CczWFiGg.svg",
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
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-menu-deep",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M4 6h16M7 12h13M10 18h10\" />",
	"styles": []
});
//#endregion
//#region src/assets/icons/IconArchive.svg
var IconArchive_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconArchive.Woxh8eou.svg",
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
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-archive",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4\" />",
	"styles": []
});
//#endregion
//#region src/assets/icons/IconSunHigh.svg
var IconSunHigh_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconSunHigh.EHu4P2Sl.svg",
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
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-sun-high",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M14.828 14.828a4 4 0 1 0-5.656-5.656 4 4 0 0 0 5.656 5.656M6.343 17.657l-1.414 1.414M6.343 6.343 4.929 4.929M17.657 6.343l1.414-1.414M17.657 17.657l1.414 1.414M4 12H2M12 4V2M20 12h2M12 20v2\" />",
	"styles": []
});
//#endregion
//#region src/assets/icons/IconSearch.svg
var IconSearch_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconSearch.w3diR66o.svg",
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
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-search",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0M21 21l-6-6\" />",
	"styles": []
});
//#endregion
//#region src/assets/icons/IconMoon.svg
var IconMoon_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconMoon.CRxdR147.svg",
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
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-moon",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z\" />",
	"styles": []
});
//#endregion
//#region src/assets/icons/IconX.svg
var IconX_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconX.DK0Dc7zq.svg",
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
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-x",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M18 6 6 18M6 6l12 12\" />",
	"styles": []
});
//#endregion
//#region src/components/LinkButton.astro
createAstro("https://astro-paper.pages.dev/");
var $$LinkButton = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LinkButton;
	const { disabled, class: className, ...attrs } = Astro.props;
	return renderTemplate`${renderComponent($$result, "Button", disabled ? "span" : "a", {
		"aria-disabled": disabled,
		"class:list": [
			"group inline-flex items-center gap-1",
			{ "hover:text-accent": !disabled },
			className
		],
		...attrs
	}, { "default": ($$result) => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/LinkButton.astro", void 0);
//#endregion
//#region src/i18n/lang/en.ts
var en_exports = /* @__PURE__ */ __exportAll({ default: () => en_default });
var en_default = {
	nav: {
		home: "Home",
		posts: "Posts",
		tags: "Tags",
		about: "About",
		archives: "Archives",
		search: "Search"
	},
	post: {
		publishedAt: "Published at",
		updatedAt: "Updated",
		sharePostIntro: "Share this post:",
		sharePostOn: "Share this post on {{platform}}",
		sharePostViaEmail: "Share this post via email",
		tagLabel: "Tags",
		backToTop: "Back to top",
		goBack: "Go back",
		editPage: "Edit page",
		previousPost: "Previous Post",
		nextPost: "Next Post"
	},
	pagination: {
		prev: "Prev",
		next: "Next",
		page: "Page"
	},
	home: {
		socialLinks: "Social Links",
		featured: "Featured",
		recentPosts: "Recent Posts",
		allPosts: "All Posts"
	},
	footer: {
		copyright: "Copyright",
		allRightsReserved: "All rights reserved."
	},
	pages: {
		tagTitle: "Tag",
		tagDesc: "All the articles with the tag",
		tagsTitle: "Tags",
		tagsDesc: "All the tags used in posts.",
		postsTitle: "Posts",
		postsDesc: "All the articles I've posted.",
		archivesTitle: "Archives",
		archivesDesc: "All the articles I've archived.",
		searchTitle: "Search",
		searchDesc: "Search any article ..."
	},
	a11y: {
		skipToContent: "Skip to content",
		openMenu: "Open menu",
		closeMenu: "Close menu",
		toggleTheme: "Toggle theme",
		searchPlaceholder: "Search posts...",
		noResults: "No results found",
		goToPreviousPage: "Go to previous page",
		goToNextPage: "Go to next page"
	},
	notFound: {
		title: "404 Not Found",
		message: "Page Not Found",
		goHome: "Go back home"
	}
};
//#endregion
//#region src/i18n/index.ts
var modules = /* #__PURE__ */ Object.assign({ "./lang/en.ts": en_exports });
var translations = {};
for (const [path, mod] of Object.entries(modules)) {
	const locale = path.slice(7, -3);
	translations[locale] = mod.default;
}
/** Returns UI strings for the given locale, falling back to English. */
function useTranslations(locale = "en") {
	return translations[locale] ?? translations["en"];
}
//#endregion
//#region src/components/Header.astro
createAstro("https://astro-paper.pages.dev/");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const { site, features } = config;
	const locale = Astro.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	const relativePath = stripBase(Astro.url.pathname);
	const currentPath = stripLocale(relativePath.endsWith("/") && relativePath !== "/" ? relativePath.slice(0, -1) : relativePath, locale);
	const isActive = (path) => {
		const currentPathArray = currentPath.split("/").filter((p) => p.trim());
		const pathArray = path.split("/").filter((p) => p.trim());
		return currentPath === path || currentPathArray[0] === pathArray[0];
	};
	return renderTemplate`${maybeRenderHead($$result)}<a id="skip-to-content" href="#main-content" class="bg-background text-accent absolute inset-s-16 -top-full z-50 px-3 py-2 backdrop-blur-lg transition-all focus:top-4">${t.a11y.skipToContent}</a><header class="app-layout flex flex-col items-center justify-between sm:flex-row"><div class="border-border bg-background relative flex w-full items-baseline justify-between border-b py-4 sm:items-center sm:py-6"><a${addAttribute(getRelativeLocaleUrl(locale, ""), "href")} class="absolute py-1 text-xl leading-8 font-semibold whitespace-nowrap sm:static sm:my-auto sm:text-2xl sm:leading-none">${site.title}</a><nav id="nav-menu" class="flex w-full flex-col items-center sm:ms-2 sm:flex-row sm:justify-end sm:space-x-4 sm:py-0"><button id="menu-btn" class="focus-outline self-end p-2 sm:hidden"${addAttribute(t.a11y.openMenu, "aria-label")} aria-expanded="false" aria-controls="menu-items"${addAttribute(t.a11y.openMenu, "data-label-open")}${addAttribute(t.a11y.closeMenu, "data-label-close")}>${renderComponent($$result, "IconX", IconX_default, {
		"id": "close-icon",
		"class": "hidden"
	})}${renderComponent($$result, "IconMenuDeep", IconMenuDeep_default, { "id": "menu-icon" })}</button><ul id="menu-items" class="[&amp;&gt;li&gt;a]:hover:text-accent mt-4 hidden w-44 grid-cols-2 place-content-center gap-2 sm:mt-0 sm:flex sm:w-auto sm:gap-x-5 sm:gap-y-0 sm:[&amp;&gt;li]:h-8 [&amp;&gt;li&gt;a]:block [&amp;&gt;li&gt;a]:px-4 [&amp;&gt;li&gt;a]:py-3 [&amp;&gt;li&gt;a]:text-center [&amp;&gt;li&gt;a]:font-medium sm:[&amp;&gt;li&gt;a]:px-2 sm:[&amp;&gt;li&gt;a]:py-1"><li class="col-span-2"><a${addAttribute(getRelativeLocaleUrl(locale, "posts"), "href")}${addAttribute({ "active-nav": isActive("/posts") }, "class:list")}>${t.nav.posts}</a></li><li class="col-span-2"><a${addAttribute(getRelativeLocaleUrl(locale, "tags"), "href")}${addAttribute({ "active-nav": isActive("/tags") }, "class:list")}>${t.nav.tags}</a></li><li class="col-span-2"><a${addAttribute(getRelativeLocaleUrl(locale, "about"), "href")}${addAttribute({ "active-nav": isActive("/about") }, "class:list")}>${t.nav.about}</a></li>${features.showArchives && renderTemplate`<li class="col-span-2">${renderComponent($$result, "LinkButton", $$LinkButton, {
		"href": getRelativeLocaleUrl(locale, "archives"),
		"class:list": ["focus-outline flex size-full justify-center p-3 sm:relative sm:size-8 sm:p-0", { "active-nav": isActive("/archives") }],
		"title": t.nav.archives,
		"aria-label": t.nav.archives
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "IconArchive", IconArchive_default, { "class": "hidden sm:absolute sm:top-1/2 sm:left-1/2 sm:block sm:size-6 sm:-translate-x-1/2 sm:-translate-y-1/2" })}<span class="sm:sr-only">${t.nav.archives}</span>${isActive("/archives") && renderTemplate`${renderComponent($$result, "IconUnderline", IconUnderline_default, {
		"aria-hidden": "true",
		"class": "scale-125 max-sm:hidden sm:absolute sm:bottom-0 sm:w-6"
	})}`}` })}</li>`}${features.search !== false && renderTemplate`<li class="col-span-1 flex items-center justify-center">${renderComponent($$result, "LinkButton", $$LinkButton, {
		"href": getRelativeLocaleUrl(locale, "search"),
		"class:list": ["focus-outline relative size-8"],
		"title": t.nav.search,
		"aria-label": t.nav.search
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "IconSearch", IconSearch_default, { "class": "absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2" })}<span class="sr-only">${t.nav.search}</span>${isActive("/search") && renderTemplate`${renderComponent($$result, "IconUnderline", IconUnderline_default, {
		"aria-hidden": "true",
		"class": "absolute bottom-0 w-6 scale-125 max-sm:inset-s-2"
	})}`}` })}</li>`}${features.lightAndDarkMode && renderTemplate`<li class="col-span-1 flex items-center justify-center"><button id="theme-btn" class="focus-outline hover:[&amp;&gt;svg]:stroke-accent relative size-12 p-4 sm:size-8"${addAttribute(t.a11y.toggleTheme, "title")} aria-label="auto" aria-live="polite">${renderComponent($$result, "IconMoon", IconMoon_default, { "class": "absolute top-[50%] left-[50%] translate-[-50%] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" })}${renderComponent($$result, "IconSunHigh", IconSunHigh_default, { "class": "absolute top-[50%] left-[50%] translate-[-50%] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" })}</button></li>`}</ul></nav></div></header>${renderScript($$result, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Header.astro", void 0);
//#endregion
//#region src/components/Socials.astro
var $$Socials = createComponent(async ($$result, $$props, $$slots) => {
	const { site, socials } = config;
	const icons = /* #__PURE__ */ Object.assign({
		"/src/assets/icons/socials/facebook.svg": () => import("./facebook_DCC3Es2h.mjs"),
		"/src/assets/icons/socials/github.svg": () => import("./github_CJBsN-bv.mjs"),
		"/src/assets/icons/socials/linkedin.svg": () => import("./linkedin_MyysDTR9.mjs"),
		"/src/assets/icons/socials/mail.svg": () => import("./mail_BZBACUGf.mjs"),
		"/src/assets/icons/socials/pinterest.svg": () => import("./pinterest_Cxkjpn1u.mjs"),
		"/src/assets/icons/socials/telegram.svg": () => import("./telegram_BNxqGxf8.mjs"),
		"/src/assets/icons/socials/whatsapp.svg": () => import("./whatsapp_BXX47W6j.mjs"),
		"/src/assets/icons/socials/x.svg": () => import("./x_5NBMLVCo.mjs")
	});
	const items = await Promise.all(socials.map(async ({ name, url, linkTitle }) => {
		const Icon = (await icons[`/src/assets/icons/socials/${name}.svg`]?.())?.default;
		return {
			url,
			title: linkTitle ?? (url.startsWith("mailto:") || name === "mail" ? `Send an email to ${site.title}` : `${site.title} on ${name.charAt(0).toUpperCase() + name.slice(1)}`),
			Icon
		};
	}));
	return renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-wrap items-center gap-1">${items.map(({ url, title, Icon }) => Icon ? renderTemplate`${renderComponent($$result, "LinkButton", $$LinkButton, {
		"href": url,
		"class": "p-2 hover:rotate-6 sm:p-1",
		"title": title
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Icon", Icon, { "class": "inline-block size-6 scale-125 fill-transparent stroke-current stroke-2 opacity-90 group-hover:fill-transparent sm:scale-110" })}<span class="sr-only">${title}</span>` })}` : null)}</div>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Socials.astro", void 0);
//#endregion
//#region src/components/Footer.astro
createAstro("https://astro-paper.pages.dev/");
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Footer;
	const { noMarginTop = false, class: className, ...attrs } = Astro.props;
	const t = useTranslations(Astro.currentLocale);
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer${addAttribute([
		"app-layout",
		{ "mt-auto": !noMarginTop },
		className
	], "class:list")}${spreadAttributes(attrs)}><div class="border-border flex flex-col items-center justify-between border-t py-6 sm:flex-row-reverse sm:py-4">${renderComponent($$result, "Socials", $$Socials, {})}<div class="my-2 flex flex-col items-center whitespace-nowrap sm:flex-row"><span>${t.footer.copyright} &#169; ${currentYear}</span><span class="hidden sm:inline">&nbsp;|&nbsp;</span><span>${t.footer.allRightsReserved}</span></div></div></footer>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Footer.astro", void 0);
//#endregion
export { $$LinkButton as a, stripBase as c, useTranslations as i, stripLocale as l, $$Socials as n, $$Layout as o, $$Header as r, getAssetPath as s, $$Footer as t, renderScript as u };
