globalThis.process ??= {};
globalThis.process.env ??= {};
import { A as defineMiddleware, g as sequence } from "./chunks/render_CUf4ht8e.mjs";
//#region src/middleware.ts
var onRequest$1 = defineMiddleware((context, next) => {
	if (context.locals.runtime?.env) {
		globalThis.process = globalThis.process || {};
		globalThis.process.env = globalThis.process.env || {};
		Object.assign(globalThis.process.env, context.locals.runtime.env);
	}
	return next();
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
