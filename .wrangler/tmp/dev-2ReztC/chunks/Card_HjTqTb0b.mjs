globalThis.process ??= {};
globalThis.process.env ??= {};
import { F as maybeRenderHead, J as createAstro, L as addAttribute, _ as renderTemplate, i as renderTransition, l as renderComponent } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import "./compiler_C1DeRWGl.mjs";
/* empty css                          */
import { t as getPostUrl } from "./getPostPaths_B9RLziIg.mjs";
import { n as toTransitionName, t as $$Datetime } from "./Datetime_RHdSgFX9.mjs";
//#region src/components/Card.astro
createAstro("https://astro-paper.pages.dev/");
var $$Card = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Card;
	const { variant: Heading = "h2", id, data, filePath } = Astro.props;
	const { title, description, ...props } = data;
	return renderTemplate`${maybeRenderHead($$result)}<li class="my-6"><a${addAttribute(getPostUrl(id, filePath, Astro.currentLocale), "href")}${addAttribute([
		"text-accent inline-block text-lg font-medium",
		"decoration-dashed underline-offset-4 hover:underline",
		"focus-visible:no-underline focus-visible:underline-offset-0"
	], "class:list")}>${renderComponent($$result, "Heading", Heading, { "data-astro-transition-scope": renderTransition($$result, "jyu37kgb", "", toTransitionName(title)) }, { "default": ($$result) => renderTemplate`${title}` })}</a>${renderComponent($$result, "Datetime", $$Datetime, { ...props })}<p>${description}</p></li>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/Card.astro", "self");
//#endregion
export { $$Card as t };
