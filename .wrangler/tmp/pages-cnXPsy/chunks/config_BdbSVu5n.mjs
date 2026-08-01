globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { c as getLocaleRelativeUrl, d as redirectToFallback$1, f as requestHasLocale$1, l as notFound$1, u as redirectToDefaultLocale$1 } from "./entrypoints_DCagg2Tt.mjs";
import "./shorthash_DJJwdab3.mjs";
//#region node_modules/astro/dist/core/app/common.js
function toRoutingStrategy(routing, domains) {
	let strategy;
	const hasDomains = domains ? Object.keys(domains).length > 0 : false;
	if (routing === "manual") strategy = "manual";
	else if (!hasDomains) if (routing?.prefixDefaultLocale === true) if (routing.redirectToDefaultLocale) strategy = "pathname-prefix-always";
	else strategy = "pathname-prefix-always-no-redirect";
	else strategy = "pathname-prefix-other-locales";
	else if (routing?.prefixDefaultLocale === true) if (routing.redirectToDefaultLocale) strategy = "domains-prefix-always";
	else strategy = "domains-prefix-always-no-redirect";
	else strategy = "domains-prefix-other-locales";
	return strategy;
}
function toFallbackType(routing) {
	if (routing === "manual") return "rewrite";
	return routing.fallbackType;
}
//#endregion
//#region \0astro:config/client
var client_exports = /* @__PURE__ */ __exportAll({
	base: () => "/",
	build: () => build$1,
	compressHTML: () => "jsx",
	i18n: () => i18n$1,
	image: () => image,
	site: () => site$1,
	trailingSlash: () => trailingSlash$1
});
var i18n$1 = {
	defaultLocale: "en",
	locales: ["en"],
	routing: {
		"prefixDefaultLocale": false,
		"redirectToDefaultLocale": true,
		"fallbackType": "redirect"
	},
	fallback: void 0,
	domains: void 0
};
var image = {
	objectFit: void 0,
	objectPosition: void 0,
	layout: void 0
};
var trailingSlash$1 = "ignore";
var site$1 = "https://astro-paper.pages.dev/";
var build$1 = { format: "directory" };
//#endregion
//#region node_modules/astro/dist/virtual-modules/i18n.js
var { trailingSlash, site, i18n, build } = client_exports;
var { format } = build;
var { defaultLocale, locales, domains, fallback, routing } = i18n;
var base = "/";
var strategy = toRoutingStrategy(routing, domains);
var fallbackType = toFallbackType(routing);
var getRelativeLocaleUrl = (locale, path, options) => getLocaleRelativeUrl({
	locale,
	path,
	base,
	trailingSlash,
	format,
	defaultLocale,
	locales,
	strategy,
	domains,
	...options
});
if (i18n?.routing === "manual") redirectToDefaultLocale$1({
	base,
	trailingSlash,
	format,
	defaultLocale,
	locales,
	strategy,
	domains,
	fallback,
	fallbackType
});
if (i18n?.routing === "manual") notFound$1({
	base,
	trailingSlash,
	format,
	defaultLocale,
	locales,
	strategy,
	domains,
	fallback,
	fallbackType
});
if (i18n?.routing === "manual") requestHasLocale$1(locales);
if (i18n?.routing === "manual") redirectToFallback$1({
	base,
	trailingSlash,
	format,
	defaultLocale,
	locales,
	strategy,
	domains,
	fallback,
	fallbackType
});
if (i18n?.routing === "manual");
//#endregion
//#region src/types/config.ts
/**
* Type helper for astro-paper.config.ts.
* Provides full IntelliSense without any runtime overhead.
*/
function defineAstroPaperConfig(config) {
	return config;
}
//#endregion
//#region astro-paper.config.ts
var astro_paper_config_default = defineAstroPaperConfig({
	site: {
		url: "https://astro-paper.pages.dev/",
		title: "AstroPaper",
		description: "A minimal, responsive and SEO-friendly Astro blog theme.",
		author: "Sat Naing",
		profile: "https://satna.ing",
		ogImage: "default-og.jpg",
		lang: "en",
		timezone: "Asia/Bangkok",
		dir: "ltr"
	},
	posts: {
		perPage: 4,
		perIndex: 4,
		scheduledPostMargin: 9e5
	},
	features: {
		lightAndDarkMode: true,
		dynamicOgImage: true,
		showArchives: true,
		showBackButton: true,
		editPost: {
			enabled: true,
			url: "https://github.com/satnaing/astro-paper/edit/main/"
		},
		search: "pagefind"
	},
	socials: [
		{
			name: "github",
			url: "https://github.com/satnaing/astro-paper"
		},
		{
			name: "x",
			url: "https://x.com/username"
		},
		{
			name: "linkedin",
			url: "https://www.linkedin.com/in/username/"
		},
		{
			name: "mail",
			url: "mailto:yourmail@gmail.com"
		}
	],
	shareLinks: [
		{
			name: "whatsapp",
			url: "https://wa.me/?text="
		},
		{
			name: "facebook",
			url: "https://www.facebook.com/sharer.php?u="
		},
		{
			name: "x",
			url: "https://x.com/intent/post?url="
		},
		{
			name: "telegram",
			url: "https://t.me/share/url?url="
		},
		{
			name: "pinterest",
			url: "https://pinterest.com/pin/create/button/?url="
		},
		{
			name: "mail",
			url: "mailto:?subject=See%20this%20post&body="
		}
	]
});
//#endregion
//#region src/config.ts
/**
* Internal resolved configuration used throughout the codebase.
*
* Prefer editing `astro-paper.config.ts` instead of this file. This module exists to
* apply defaults and expose a fully-resolved config shape (`ResolvedAstroPaperConfig`).
*/
var DEFAULT_OG_IMAGE = "default-og.jpg";
var config = {
	site: {
		...astro_paper_config_default.site,
		ogImage: astro_paper_config_default.site.ogImage ?? DEFAULT_OG_IMAGE,
		lang: astro_paper_config_default.site.lang ?? "en",
		timezone: astro_paper_config_default.site.timezone ?? "UTC",
		dir: astro_paper_config_default.site.dir ?? "ltr",
		googleVerification: astro_paper_config_default.site.googleVerification || void 0
	},
	posts: {
		perPage: astro_paper_config_default.posts?.perPage ?? 4,
		perIndex: astro_paper_config_default.posts?.perIndex ?? 4,
		scheduledPostMargin: astro_paper_config_default.posts?.scheduledPostMargin ?? 9e5
	},
	features: {
		lightAndDarkMode: astro_paper_config_default.features?.lightAndDarkMode ?? true,
		dynamicOgImage: astro_paper_config_default.features?.dynamicOgImage ?? true,
		showArchives: astro_paper_config_default.features?.showArchives ?? true,
		showBackButton: astro_paper_config_default.features?.showBackButton ?? true,
		editPost: astro_paper_config_default.features?.editPost ?? { enabled: false },
		search: astro_paper_config_default.features?.search ?? "pagefind"
	},
	socials: astro_paper_config_default.socials ?? [],
	shareLinks: astro_paper_config_default.shareLinks ?? []
};
//#endregion
export { getRelativeLocaleUrl as n, config as t };
