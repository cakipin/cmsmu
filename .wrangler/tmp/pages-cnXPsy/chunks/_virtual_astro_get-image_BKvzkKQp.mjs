globalThis.process ??= {};
globalThis.process.env ??= {};
import { i as getImage$1 } from "./assets_CgXAQWao.mjs";
//#region \0virtual:astro:get-image
var imageConfig = {
	"endpoint": {
		"route": "/_image",
		"entrypoint": "@astrojs/cloudflare/image-transform-endpoint"
	},
	"service": {
		"entrypoint": "@astrojs/cloudflare/image-service-workerd",
		"config": {}
	},
	"dangerouslyProcessSVG": false,
	"domains": [],
	"remotePatterns": [],
	"responsiveStyles": false
};
Object.defineProperty(imageConfig, "assetQueryParams", {
	value: void 0,
	enumerable: false,
	configurable: true
});
var getImage = async (options) => await getImage$1(options, imageConfig);
//#endregion
export { getImage };
