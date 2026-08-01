globalThis.process ??= {};
globalThis.process.env ??= {};
import { t as postFilter } from "./postFilter_B3fh8a1F.mjs";
//#region src/utils/getSortedPosts.ts
/**
* Returns posts that are eligible to be shown to users, sorted by “last updated”
* descending (uses `modDatetime` when present, otherwise `pubDatetime`).
*
* Note: filtering respects drafts and scheduled posts via `postFilter()`.
*/
function getSortedPosts(posts) {
	return posts.filter(postFilter).sort((a, b) => Math.floor(new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1e3) - Math.floor(new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1e3));
}
//#endregion
export { getSortedPosts as t };
