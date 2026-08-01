globalThis.process ??= {};
globalThis.process.env ??= {};
import { F as maybeRenderHead, J as createAstro, L as addAttribute, _ as renderTemplate, m as renderSlot } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import "./compiler_C1DeRWGl.mjs";
//#region src/components/ResponsiveTable.astro
createAstro("https://astro-paper.pages.dev/");
var $$ResponsiveTable = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ResponsiveTable;
	const { class: className, variant } = Astro.props;
	const variantClasses = {
		minimal: "[&_td]:border-0 [&_th]:border-0",
		striped: "[&_tbody_tr]:odd:bg-muted/25"
	};
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(variant, "data-table-variant")}${addAttribute([
		"overflow-hidden [&_table]:my-0 [&_table]:min-w-xl",
		variant === "minimal" && variantClasses.minimal,
		variant === "striped" && variantClasses.striped,
		variant === "striped-minimal" && `${variantClasses.minimal} ${variantClasses.striped}`,
		className
	], "class:list")}><div class="relative w-full overflow-x-auto">${renderSlot($$result, $$slots["default"])}</div></div>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/components/ResponsiveTable.astro", void 0);
//#endregion
export { $$ResponsiveTable as t };
