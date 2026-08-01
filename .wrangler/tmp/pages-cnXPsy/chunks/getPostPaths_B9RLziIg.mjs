globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import { r as slugifyStr } from "./postFilter_B3fh8a1F.mjs";
//#region src/utils/getPostPaths.ts
var BLOG_PATH = "src/content/posts";
function getPostPathSegments(filePath) {
	return filePath?.replace(BLOG_PATH, "").split("/").filter((path) => path !== "").filter((path) => !path.startsWith("_")).slice(0, -1).map((segment) => slugifyStr(segment)) ?? [];
}
function getIdSlug(id) {
	const postId = id.split("/");
	return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}
function getPostSlugPath(id, filePath) {
	const pathSegments = getPostPathSegments(filePath);
	const slug = getIdSlug(id);
	return pathSegments.length > 0 ? [...pathSegments, slug].join("/") : String(slug);
}
/**
* Returns a fully navigable URL for use in `<a href>` and RSS links.
* Applies both locale routing and the configured Astro base via
* `getRelativeLocaleUrl`.
* e.g. `/posts/my-post` or `/en/posts/my-post`
*/
function getPostUrl(id, filePath, locale = config.site.lang) {
	return getRelativeLocaleUrl(locale, `posts/${getPostSlugPath(id, filePath)}`);
}
//#endregion
export { getPostUrl as t };
