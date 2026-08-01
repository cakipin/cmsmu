globalThis.process ??= {};
globalThis.process.env ??= {};
import { F as maybeRenderHead, J as createAstro, _ as renderTemplate, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { a as $$LinkButton, i as useTranslations } from "./Footer_BnjUarGW.mjs";
import "./compiler_C1DeRWGl.mjs";
import { t as IconArrowRight_default } from "./IconArrowRight_BWkj2bXh.mjs";
import { t as IconArrowLeft_default } from "./IconArrowLeft_C_wziOMb.mjs";
//#region src/components/Pagination.astro
createAstro("https://astro-paper.pages.dev/");
var $$Pagination = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Pagination;
	const { page } = Astro.props;
	const t = useTranslations(Astro.currentLocale);
	return renderTemplate`${page.lastPage > 1 && renderTemplate`${maybeRenderHead($$result)}<nav class="mt-auto mb-8 flex justify-center gap-4" role="navigation" aria-label="Pagination Navigation">${renderComponent($$result, "LinkButton", $$LinkButton, {
		"disabled": !page.url.prev,
		"href": page.url.prev,
		"class:list": ["select-none", { "opacity-50": !page.url.prev }],
		"aria-label": t.a11y.goToPreviousPage
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "IconArrowLeft", IconArrowLeft_default, { "class": "inline-block rtl:rotate-180" })}${t.pagination.prev}` })}${page.currentPage} / ${page.lastPage}${renderComponent($$result, "LinkButton", $$LinkButton, {
		"disabled": !page.url.next,
		"href": page.url.next,
		"class:list": ["select-none", { "opacity-50": !page.url.next }],
		"aria-label": t.a11y.goToNextPage
	}, { "default": ($$result) => renderTemplate`${t.pagination.next}${renderComponent($$result, "IconArrowRight", IconArrowRight_default, { "class": "inline-block rtl:rotate-180" })}` })}</nav>`}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Pagination.astro", void 0);
//#endregion
export { $$Pagination as t };
