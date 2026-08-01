globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { c as isRemotePath } from "./path_BqUacSWD.mjs";
import { t as isRemoteAllowed } from "./remote_Cm3aSJjJ.mjs";
import { s as fetchWithRedirects } from "./assets_CgXAQWao.mjs";
import { t as imageConfig } from "./_astro_assets_DnoffuM4.mjs";
import { env } from "cloudflare:workers";
//#region node_modules/@astrojs/cloudflare/dist/utils/image-binding-transform.js
var qualityTable = {
	low: 25,
	mid: 50,
	high: 80,
	max: 100
};
async function transform(rawUrl, images, assets) {
	const url = new URL(rawUrl);
	const href = url.searchParams.get("href");
	if (!href || isRemotePath(href) && !isRemoteAllowed(href, imageConfig)) return new Response("Forbidden", { status: 403 });
	const imageSrc = new URL(href, url.origin);
	let content;
	if (isRemotePath(href)) try {
		content = await fetchWithRedirects({
			url: imageSrc,
			imageConfig
		});
		if (!isRemoteAllowed(content.url, imageConfig)) return new Response("Forbidden", { status: 403 });
	} catch {
		return new Response("Not Found", { status: 404 });
	}
	else content = await assets.fetch(imageSrc);
	if (!content.body) return new Response(null, { status: 404 });
	const input = images.input(content.body);
	const outputFormat = {
		jpeg: "image/jpeg",
		jpg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		webp: "image/webp",
		avif: "image/avif"
	}[url.searchParams.get("f") ?? ""];
	if (!outputFormat) return new Response(`Unsupported format: ${url.searchParams.get("f")}`, { status: 400 });
	return (await input.transform({
		width: url.searchParams.has("w") ? Number.parseInt(url.searchParams.get("w")) : void 0,
		height: url.searchParams.has("h") ? Number.parseInt(url.searchParams.get("h")) : void 0,
		fit: url.searchParams.get("fit")
	}).output({
		quality: url.searchParams.get("q") ? qualityTable[url.searchParams.get("q")] ?? Number.parseInt(url.searchParams.get("q")) : void 0,
		format: outputFormat
	})).response();
}
//#endregion
//#region node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint.js
var image_transform_endpoint_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async (ctx) => {
	const cache = caches.default;
	if (cache) {
		const cached = await cache.match(ctx.request.url);
		if (cached) return cached;
	}
	const response = await transform(ctx.request.url, env.IMAGES, env.ASSETS);
	if (!response.ok) return response;
	const headers = new Headers(response.headers);
	headers.set("Cache-Control", "public, max-age=31536000, immutable");
	const cachedResponse = new Response(response.body, {
		status: response.status,
		headers
	});
	if (cache) {
		const cfContext = ctx.locals.cfContext;
		if (cfContext) cfContext.waitUntil(cache.put(ctx.request.url, cachedResponse.clone()));
	}
	return cachedResponse;
};
//#endregion
//#region \0virtual:astro:page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-transform-endpoint@_@js
var page = () => image_transform_endpoint_exports;
//#endregion
export { page };
