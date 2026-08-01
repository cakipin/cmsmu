globalThis.process ??= {};
globalThis.process.env ??= {};
//#region node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
	return (context, next) => {
		let index = -1;
		return dispatch(0);
		async function dispatch(i) {
			if (i <= index) throw new Error("next() called multiple times");
			index = i;
			let res;
			let isError = false;
			let handler;
			if (middleware[i]) {
				handler = middleware[i][0][0];
				context.req.routeIndex = i;
			} else handler = i === middleware.length && next || void 0;
			if (handler) try {
				res = await handler(context, () => dispatch(i + 1));
			} catch (err) {
				if (err instanceof Error && onError) {
					context.error = err;
					res = await onError(err, context);
					isError = true;
				} else throw err;
			}
			else if (context.finalized === false && onNotFound) res = await onNotFound(context);
			if (res && (context.finalized === false || isError)) context.res = res;
			return context;
		}
	};
};
//#endregion
//#region node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
//#endregion
//#region node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
	return new Response(arrayBuffer, { headers: { "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase()) } }).formData();
};
//#endregion
//#region node_modules/hono/dist/utils/body.js
var isRawRequest = (request) => "headers" in request;
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
	const { all = false, dot = false } = options;
	const mediaType = (isRawRequest(request) ? request.headers : request.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") return parseFormData(request, {
		all,
		dot
	});
	return {};
};
async function parseFormData(request, options) {
	if (!isRawRequest(request) && request.bodyCache.formData) return convertFormDataToBodyData(await request.bodyCache.formData, options);
	const headers = isRawRequest(request) ? request.headers : request.raw.headers;
	const formDataPromise = bufferToFormData(await request.arrayBuffer(), headers.get("Content-Type") || "");
	if (!isRawRequest(request)) request.bodyCache.formData = formDataPromise;
	const formData = await formDataPromise;
	if (formData) return convertFormDataToBodyData(formData, options);
	return {};
}
function convertFormDataToBodyData(formData, options) {
	const form = /* @__PURE__ */ Object.create(null);
	formData.forEach((value, key) => {
		if (!(options.all || key.endsWith("[]"))) form[key] = value;
		else handleParsingAllValues(form, key, value);
	});
	if (options.dot) Object.entries(form).forEach(([key, value]) => {
		if (key.includes(".")) {
			handleParsingNestedValues(form, key, value);
			delete form[key];
		}
	});
	return form;
}
var handleParsingAllValues = (form, key, value) => {
	if (form[key] !== void 0) if (Array.isArray(form[key])) form[key].push(value);
	else form[key] = [form[key], value];
	else if (!key.endsWith("[]")) form[key] = value;
	else form[key] = [value];
};
var handleParsingNestedValues = (form, key, value) => {
	if (/(?:^|\.)__proto__\./.test(key)) return;
	let nestedForm = form;
	const keys = key.split(".");
	keys.forEach((key2, index) => {
		if (index === keys.length - 1) nestedForm[key2] = value;
		else {
			if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) nestedForm[key2] = /* @__PURE__ */ Object.create(null);
			nestedForm = nestedForm[key2];
		}
	});
};
//#endregion
//#region node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
	const paths = path.split("/");
	if (paths[0] === "") paths.shift();
	return paths;
};
var splitRoutingPath = (routePath) => {
	const { groups, path } = extractGroupsFromPath(routePath);
	return replaceGroupMarks(splitPath(path), groups);
};
var extractGroupsFromPath = (path) => {
	const groups = [];
	path = path.replace(/\{[^}]+\}/g, (match, index) => {
		const mark = `@${index}`;
		groups.push([mark, match]);
		return mark;
	});
	return {
		groups,
		path
	};
};
var replaceGroupMarks = (paths, groups) => {
	for (let i = groups.length - 1; i >= 0; i--) {
		const [mark] = groups[i];
		for (let j = paths.length - 1; j >= 0; j--) if (paths[j].includes(mark)) {
			paths[j] = paths[j].replace(mark, groups[i][1]);
			break;
		}
	}
	return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
	if (label === "*") return "*";
	const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
	if (match) {
		const cacheKey = `${label}#${next}`;
		if (!patternCache[cacheKey]) if (match[2]) patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [
			cacheKey,
			match[1],
			new RegExp(`^${match[2]}(?=/${next})`)
		] : [
			label,
			match[1],
			new RegExp(`^${match[2]}$`)
		];
		else patternCache[cacheKey] = [
			label,
			match[1],
			true
		];
		return patternCache[cacheKey];
	}
	return null;
};
var tryDecode = (str, decoder) => {
	try {
		return decoder(str);
	} catch {
		return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
			try {
				return decoder(match);
			} catch {
				return match;
			}
		});
	}
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
	const url = request.url;
	const start = url.indexOf("/", url.indexOf(":") + 4);
	let i = start;
	for (; i < url.length; i++) {
		const charCode = url.charCodeAt(i);
		if (charCode === 37) {
			const queryIndex = url.indexOf("?", i);
			const hashIndex = url.indexOf("#", i);
			const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
			const path = url.slice(start, end);
			return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
		} else if (charCode === 63 || charCode === 35) break;
	}
	return url.slice(start, i);
};
var getPathNoStrict = (request) => {
	const result = getPath(request);
	return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
	if (rest.length) sub = mergePath(sub, ...rest);
	return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
	if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) return null;
	const segments = path.split("/");
	const results = [];
	let basePath = "";
	segments.forEach((segment) => {
		if (segment !== "" && !/\:/.test(segment)) basePath += "/" + segment;
		else if (/\:/.test(segment)) if (/\?/.test(segment)) {
			if (results.length === 0 && basePath === "") results.push("/");
			else results.push(basePath);
			const optionalSegment = segment.replace("?", "");
			basePath += "/" + optionalSegment;
			results.push(basePath);
		} else basePath += "/" + segment;
	});
	return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
	if (!/[%+]/.test(value)) return value;
	if (value.indexOf("+") !== -1) value = value.replace(/\+/g, " ");
	return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
	let encoded;
	if (!multiple && key && !/[%+]/.test(key)) {
		let keyIndex2 = url.indexOf("?", 8);
		if (keyIndex2 === -1) return;
		if (!url.startsWith(key, keyIndex2 + 1)) keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
		while (keyIndex2 !== -1) {
			const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
			if (trailingKeyCode === 61) {
				const valueIndex = keyIndex2 + key.length + 2;
				const endIndex = url.indexOf("&", valueIndex);
				return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
			} else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) return "";
			keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
		}
		encoded = /[%+]/.test(url);
		if (!encoded) return;
	}
	const results = /* @__PURE__ */ Object.create(null);
	encoded ??= /[%+]/.test(url);
	let keyIndex = url.indexOf("?", 8);
	while (keyIndex !== -1) {
		const nextKeyIndex = url.indexOf("&", keyIndex + 1);
		let valueIndex = url.indexOf("=", keyIndex);
		if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) valueIndex = -1;
		let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex);
		if (encoded) name = _decodeURI(name);
		keyIndex = nextKeyIndex;
		if (name === "") continue;
		let value;
		if (valueIndex === -1) value = "";
		else {
			value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
			if (encoded) value = _decodeURI(value);
		}
		if (multiple) {
			if (!(results[name] && Array.isArray(results[name]))) results[name] = [];
			results[name].push(value);
		} else results[name] ??= value;
	}
	return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
	return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;
//#endregion
//#region node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
	/**
	* `.raw` can get the raw Request object.
	*
	* @see {@link https://hono.dev/docs/api/request#raw}
	*
	* @example
	* ```ts
	* // For Cloudflare Workers
	* app.post('/', async (c) => {
	*   const metadata = c.req.raw.cf?.hostMetadata?
	*   ...
	* })
	* ```
	*/
	raw;
	#validatedData;
	#matchResult;
	routeIndex = 0;
	/**
	* `.path` can get the pathname of the request.
	*
	* @see {@link https://hono.dev/docs/api/request#path}
	*
	* @example
	* ```ts
	* app.get('/about/me', (c) => {
	*   const pathname = c.req.path // `/about/me`
	* })
	* ```
	*/
	path;
	bodyCache = {};
	constructor(request, path = "/", matchResult = [[]]) {
		this.raw = request;
		this.path = path;
		this.#matchResult = matchResult;
		this.#validatedData = {};
	}
	param(key) {
		return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
	}
	#getDecodedParam(key) {
		const paramKey = this.#matchResult[0][this.routeIndex][1][key];
		const param = this.#getParamValue(paramKey);
		return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
	}
	#getAllDecodedParams() {
		const decoded = {};
		const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
		for (const key of keys) {
			const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
			if (value !== void 0) decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
		}
		return decoded;
	}
	#getParamValue(paramKey) {
		return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
	}
	query(key) {
		return getQueryParam(this.url, key);
	}
	queries(key) {
		return getQueryParams(this.url, key);
	}
	header(name) {
		if (name) return this.raw.headers.get(name) ?? void 0;
		const headerData = /* @__PURE__ */ Object.create(null);
		this.raw.headers.forEach((value, key) => {
			headerData[key] = value;
		});
		return headerData;
	}
	async parseBody(options) {
		return parseBody(this, options);
	}
	#cachedBody = (key) => {
		const { bodyCache, raw } = this;
		const cachedBody = bodyCache[key];
		if (cachedBody) return cachedBody;
		const anyCachedKey = Object.keys(bodyCache)[0];
		if (anyCachedKey) return bodyCache[anyCachedKey].then((body) => {
			if (anyCachedKey === "json") body = JSON.stringify(body);
			return new Response(body)[key]();
		});
		return bodyCache[key] = raw[key]();
	};
	/**
	* `.json()` can parse Request body of type `application/json`
	*
	* @see {@link https://hono.dev/docs/api/request#json}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.json()
	* })
	* ```
	*/
	json() {
		return this.#cachedBody("text").then((text) => JSON.parse(text));
	}
	/**
	* `.text()` can parse Request body of type `text/plain`
	*
	* @see {@link https://hono.dev/docs/api/request#text}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.text()
	* })
	* ```
	*/
	text() {
		return this.#cachedBody("text");
	}
	/**
	* `.arrayBuffer()` parse Request body as an `ArrayBuffer`
	*
	* @see {@link https://hono.dev/docs/api/request#arraybuffer}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.arrayBuffer()
	* })
	* ```
	*/
	arrayBuffer() {
		return this.#cachedBody("arrayBuffer");
	}
	/**
	* `.bytes()` parses the request body as a `Uint8Array`.
	*
	* @see {@link https://hono.dev/docs/api/request#bytes}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.bytes()
	* })
	* ```
	*/
	bytes() {
		return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
	}
	/**
	* Parses the request body as a `Blob`.
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.blob();
	* });
	* ```
	* @see https://hono.dev/docs/api/request#blob
	*/
	blob() {
		return this.#cachedBody("blob");
	}
	/**
	* Parses the request body as `FormData`.
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.formData();
	* });
	* ```
	* @see https://hono.dev/docs/api/request#formdata
	*/
	formData() {
		return this.#cachedBody("formData");
	}
	/**
	* Adds validated data to the request.
	*
	* @param target - The target of the validation.
	* @param data - The validated data to add.
	*/
	addValidatedData(target, data) {
		this.#validatedData[target] = data;
	}
	valid(target) {
		return this.#validatedData[target];
	}
	/**
	* `.url()` can get the request url strings.
	*
	* @see {@link https://hono.dev/docs/api/request#url}
	*
	* @example
	* ```ts
	* app.get('/about/me', (c) => {
	*   const url = c.req.url // `http://localhost:8787/about/me`
	*   ...
	* })
	* ```
	*/
	get url() {
		return this.raw.url;
	}
	/**
	* `.method()` can get the method name of the request.
	*
	* @see {@link https://hono.dev/docs/api/request#method}
	*
	* @example
	* ```ts
	* app.get('/about/me', (c) => {
	*   const method = c.req.method // `GET`
	* })
	* ```
	*/
	get method() {
		return this.raw.method;
	}
	get [GET_MATCH_RESULT]() {
		return this.#matchResult;
	}
	/**
	* `.matchedRoutes()` can return a matched route in the handler
	*
	* @deprecated
	*
	* Use matchedRoutes helper defined in "hono/route" instead.
	*
	* @see {@link https://hono.dev/docs/api/request#matchedroutes}
	*
	* @example
	* ```ts
	* app.use('*', async function logger(c, next) {
	*   await next()
	*   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
	*     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
	*     console.log(
	*       method,
	*       ' ',
	*       path,
	*       ' '.repeat(Math.max(10 - path.length, 0)),
	*       name,
	*       i === c.req.routeIndex ? '<- respond from here' : ''
	*     )
	*   })
	* })
	* ```
	*/
	get matchedRoutes() {
		return this.#matchResult[0].map(([[, route]]) => route);
	}
	/**
	* `routePath()` can retrieve the path registered within the handler
	*
	* @deprecated
	*
	* Use routePath helper defined in "hono/route" instead.
	*
	* @see {@link https://hono.dev/docs/api/request#routepath}
	*
	* @example
	* ```ts
	* app.get('/posts/:id', (c) => {
	*   return c.json({ path: c.req.routePath })
	* })
	* ```
	*/
	get routePath() {
		return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
	}
};
//#endregion
//#region node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
};
var raw = (value, callbacks) => {
	const escapedString = new String(value);
	escapedString.isEscaped = true;
	escapedString.callbacks = callbacks;
	return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
	if (typeof str === "object" && !(str instanceof String)) {
		if (!(str instanceof Promise)) str = str.toString();
		if (str instanceof Promise) str = await str;
	}
	const callbacks = str.callbacks;
	if (!callbacks?.length) return Promise.resolve(str);
	if (buffer) buffer[0] += str;
	else buffer = [str];
	const resStr = Promise.all(callbacks.map((c) => c({
		phase,
		buffer,
		context
	}))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
	if (preserveCallbacks) return raw(await resStr, callbacks);
	else return resStr;
};
//#endregion
//#region node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
	return {
		"Content-Type": contentType,
		...headers
	};
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
	#rawRequest;
	#req;
	/**
	* `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
	*
	* @see {@link https://hono.dev/docs/api/context#env}
	*
	* @example
	* ```ts
	* // Environment object for Cloudflare Workers
	* app.get('*', async c => {
	*   const counter = c.env.COUNTER
	* })
	* ```
	*/
	env = {};
	#var;
	finalized = false;
	/**
	* `.error` can get the error object from the middleware if the Handler throws an error.
	*
	* @see {@link https://hono.dev/docs/api/context#error}
	*
	* @example
	* ```ts
	* app.use('*', async (c, next) => {
	*   await next()
	*   if (c.error) {
	*     // do something...
	*   }
	* })
	* ```
	*/
	error;
	#status;
	#executionCtx;
	#res;
	#layout;
	#renderer;
	#notFoundHandler;
	#preparedHeaders;
	#matchResult;
	#path;
	/**
	* Creates an instance of the Context class.
	*
	* @param req - The Request object.
	* @param options - Optional configuration options for the context.
	*/
	constructor(req, options) {
		this.#rawRequest = req;
		if (options) {
			this.#executionCtx = options.executionCtx;
			this.env = options.env;
			this.#notFoundHandler = options.notFoundHandler;
			this.#path = options.path;
			this.#matchResult = options.matchResult;
		}
	}
	/**
	* `.req` is the instance of {@link HonoRequest}.
	*/
	get req() {
		this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
		return this.#req;
	}
	/**
	* @see {@link https://hono.dev/docs/api/context#event}
	* The FetchEvent associated with the current request.
	*
	* @throws Will throw an error if the context does not have a FetchEvent.
	*/
	get event() {
		if (this.#executionCtx && "respondWith" in this.#executionCtx) return this.#executionCtx;
		else throw Error("This context has no FetchEvent");
	}
	/**
	* @see {@link https://hono.dev/docs/api/context#executionctx}
	* The ExecutionContext associated with the current request.
	*
	* @throws Will throw an error if the context does not have an ExecutionContext.
	*/
	get executionCtx() {
		if (this.#executionCtx) return this.#executionCtx;
		else throw Error("This context has no ExecutionContext");
	}
	/**
	* @see {@link https://hono.dev/docs/api/context#res}
	* The Response object for the current request.
	*/
	get res() {
		return this.#res ||= createResponseInstance(null, { headers: this.#preparedHeaders ??= new Headers() });
	}
	/**
	* Sets the Response object for the current request.
	*
	* @param _res - The Response object to set.
	*/
	set res(_res) {
		if (this.#res && _res) {
			_res = createResponseInstance(_res.body, _res);
			for (const [k, v] of this.#res.headers.entries()) {
				if (k === "content-type") continue;
				if (k === "set-cookie") {
					const cookies = this.#res.headers.getSetCookie();
					_res.headers.delete("set-cookie");
					for (const cookie of cookies) _res.headers.append("set-cookie", cookie);
				} else _res.headers.set(k, v);
			}
		}
		this.#res = _res;
		this.finalized = true;
	}
	/**
	* `.render()` can create a response within a layout.
	*
	* @see {@link https://hono.dev/docs/api/context#render-setrenderer}
	*
	* @example
	* ```ts
	* app.get('/', (c) => {
	*   return c.render('Hello!')
	* })
	* ```
	*/
	render = (...args) => {
		this.#renderer ??= (content) => this.html(content);
		return this.#renderer(...args);
	};
	/**
	* Sets the layout for the response.
	*
	* @param layout - The layout to set.
	* @returns The layout function.
	*/
	setLayout = (layout) => this.#layout = layout;
	/**
	* Gets the current layout for the response.
	*
	* @returns The current layout function.
	*/
	getLayout = () => this.#layout;
	/**
	* `.setRenderer()` can set the layout in the custom middleware.
	*
	* @see {@link https://hono.dev/docs/api/context#render-setrenderer}
	*
	* @example
	* ```tsx
	* app.use('*', async (c, next) => {
	*   c.setRenderer((content) => {
	*     return c.html(
	*       <html>
	*         <body>
	*           <p>{content}</p>
	*         </body>
	*       </html>
	*     )
	*   })
	*   await next()
	* })
	* ```
	*/
	setRenderer = (renderer) => {
		this.#renderer = renderer;
	};
	/**
	* `.header()` can set headers.
	*
	* @see {@link https://hono.dev/docs/api/context#header}
	*
	* @example
	* ```ts
	* app.get('/welcome', (c) => {
	*   // Set headers
	*   c.header('X-Message', 'Hello!')
	*   c.header('Content-Type', 'text/plain')
	*
	*   return c.body('Thank you for coming')
	* })
	* ```
	*/
	header = (name, value, options) => {
		if (this.finalized) this.#res = createResponseInstance(this.#res.body, this.#res);
		const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
		if (value === void 0) headers.delete(name);
		else if (options?.append) headers.append(name, value);
		else headers.set(name, value);
	};
	status = (status) => {
		this.#status = status;
	};
	/**
	* `.set()` can set the value specified by the key.
	*
	* @see {@link https://hono.dev/docs/api/context#set-get}
	*
	* @example
	* ```ts
	* app.use('*', async (c, next) => {
	*   c.set('message', 'Hono is hot!!')
	*   await next()
	* })
	* ```
	*/
	set = (key, value) => {
		this.#var ??= /* @__PURE__ */ new Map();
		this.#var.set(key, value);
	};
	/**
	* `.get()` can use the value specified by the key.
	*
	* @see {@link https://hono.dev/docs/api/context#set-get}
	*
	* @example
	* ```ts
	* app.get('/', (c) => {
	*   const message = c.get('message')
	*   return c.text(`The message is "${message}"`)
	* })
	* ```
	*/
	get = (key) => {
		return this.#var ? this.#var.get(key) : void 0;
	};
	/**
	* `.var` can access the value of a variable.
	*
	* @see {@link https://hono.dev/docs/api/context#var}
	*
	* @example
	* ```ts
	* const result = c.var.client.oneMethod()
	* ```
	*/
	get var() {
		if (!this.#var) return {};
		return Object.fromEntries(this.#var);
	}
	#newResponse(data, arg, headers) {
		const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
		if (typeof arg === "object" && "headers" in arg) {
			const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
			for (const [key, value] of argHeaders) if (key.toLowerCase() === "set-cookie") responseHeaders.append(key, value);
			else responseHeaders.set(key, value);
		}
		if (headers) for (const [k, v] of Object.entries(headers)) if (typeof v === "string") responseHeaders.set(k, v);
		else {
			responseHeaders.delete(k);
			for (const v2 of v) responseHeaders.append(k, v2);
		}
		return createResponseInstance(data, {
			status: typeof arg === "number" ? arg : arg?.status ?? this.#status,
			headers: responseHeaders
		});
	}
	newResponse = (...args) => this.#newResponse(...args);
	/**
	* `.body()` can return the HTTP response.
	* You can set headers with `.header()` and set HTTP status code with `.status`.
	* This can also be set in `.text()`, `.json()` and so on.
	*
	* @see {@link https://hono.dev/docs/api/context#body}
	*
	* @example
	* ```ts
	* app.get('/welcome', (c) => {
	*   // Set headers
	*   c.header('X-Message', 'Hello!')
	*   c.header('Content-Type', 'text/plain')
	*   // Set HTTP status code
	*   c.status(201)
	*
	*   // Return the response body
	*   return c.body('Thank you for coming')
	* })
	* ```
	*/
	body = (data, arg, headers) => this.#newResponse(data, arg, headers);
	/**
	* `.text()` can render text as `Content-Type:text/plain`.
	*
	* @see {@link https://hono.dev/docs/api/context#text}
	*
	* @example
	* ```ts
	* app.get('/say', (c) => {
	*   return c.text('Hello!')
	* })
	* ```
	*/
	text = (text, arg, headers) => {
		return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
	};
	/**
	* `.json()` can render JSON as `Content-Type:application/json`.
	*
	* @see {@link https://hono.dev/docs/api/context#json}
	*
	* @example
	* ```ts
	* app.get('/api', (c) => {
	*   return c.json({ message: 'Hello!' })
	* })
	* ```
	*/
	json = (object, arg, headers) => {
		return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
	};
	html = (html, arg, headers) => {
		const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
		return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
	};
	/**
	* `.redirect()` can Redirect, default status code is 302.
	*
	* @see {@link https://hono.dev/docs/api/context#redirect}
	*
	* @example
	* ```ts
	* app.get('/redirect', (c) => {
	*   return c.redirect('/')
	* })
	* app.get('/redirect-permanently', (c) => {
	*   return c.redirect('/', 301)
	* })
	* ```
	*/
	redirect = (location, status) => {
		const locationString = String(location);
		this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
		return this.newResponse(null, status ?? 302);
	};
	/**
	* `.notFound()` can return the Not Found Response.
	*
	* @see {@link https://hono.dev/docs/api/context#notfound}
	*
	* @example
	* ```ts
	* app.get('/notfound', (c) => {
	*   return c.notFound()
	* })
	* ```
	*/
	notFound = () => {
		this.#notFoundHandler ??= () => createResponseInstance();
		return this.#notFoundHandler(this);
	};
};
//#endregion
//#region node_modules/hono/dist/router.js
var METHODS = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch"
];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {};
//#endregion
//#region node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
//#endregion
//#region node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
	return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
	if ("getResponse" in err) {
		const res = err.getResponse();
		return c.newResponse(res.body, res);
	}
	console.error(err);
	return c.text("Internal Server Error", 500);
};
var Hono$1 = class _Hono {
	get;
	post;
	put;
	delete;
	options;
	patch;
	all;
	on;
	use;
	router;
	getPath;
	_basePath = "/";
	#path = "/";
	routes = [];
	constructor(options = {}) {
		[...METHODS, "all"].forEach((method) => {
			this[method] = (args1, ...args) => {
				if (typeof args1 === "string") this.#path = args1;
				else this.#addRoute(method, this.#path, args1);
				args.forEach((handler) => {
					this.#addRoute(method, this.#path, handler);
				});
				return this;
			};
		});
		this.on = (method, path, ...handlers) => {
			for (const p of [path].flat()) {
				this.#path = p;
				for (const m of [method].flat()) handlers.map((handler) => {
					this.#addRoute(m.toUpperCase(), this.#path, handler);
				});
			}
			return this;
		};
		this.use = (arg1, ...handlers) => {
			if (typeof arg1 === "string") this.#path = arg1;
			else {
				this.#path = "*";
				handlers.unshift(arg1);
			}
			handlers.forEach((handler) => {
				this.#addRoute("ALL", this.#path, handler);
			});
			return this;
		};
		const { strict, ...optionsWithoutStrict } = options;
		Object.assign(this, optionsWithoutStrict);
		this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
	}
	#clone() {
		const clone = new _Hono({
			router: this.router,
			getPath: this.getPath
		});
		clone.errorHandler = this.errorHandler;
		clone.#notFoundHandler = this.#notFoundHandler;
		clone.routes = this.routes;
		return clone;
	}
	#notFoundHandler = notFoundHandler;
	errorHandler = errorHandler;
	/**
	* `.route()` allows grouping other Hono instance in routes.
	*
	* @see {@link https://hono.dev/docs/api/routing#grouping}
	*
	* @param {string} path - base Path
	* @param {Hono} app - other Hono instance
	* @returns {Hono} routed Hono instance
	*
	* @example
	* ```ts
	* const app = new Hono()
	* const app2 = new Hono()
	*
	* app2.get("/user", (c) => c.text("user"))
	* app.route("/api", app2) // GET /api/user
	* ```
	*/
	route(path, app) {
		const subApp = this.basePath(path);
		app.routes.map((r) => {
			let handler;
			if (app.errorHandler === errorHandler) handler = r.handler;
			else {
				handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
				handler[COMPOSED_HANDLER] = r.handler;
			}
			subApp.#addRoute(r.method, r.path, handler, r.basePath);
		});
		return this;
	}
	/**
	* `.basePath()` allows base paths to be specified.
	*
	* @see {@link https://hono.dev/docs/api/routing#base-path}
	*
	* @param {string} path - base Path
	* @returns {Hono} changed Hono instance
	*
	* @example
	* ```ts
	* const api = new Hono().basePath('/api')
	* ```
	*/
	basePath(path) {
		const subApp = this.#clone();
		subApp._basePath = mergePath(this._basePath, path);
		return subApp;
	}
	/**
	* `.onError()` handles an error and returns a customized Response.
	*
	* @see {@link https://hono.dev/docs/api/hono#error-handling}
	*
	* @param {ErrorHandler} handler - request Handler for error
	* @returns {Hono} changed Hono instance
	*
	* @example
	* ```ts
	* app.onError((err, c) => {
	*   console.error(`${err}`)
	*   return c.text('Custom Error Message', 500)
	* })
	* ```
	*/
	onError = (handler) => {
		this.errorHandler = handler;
		return this;
	};
	/**
	* `.notFound()` allows you to customize a Not Found Response.
	*
	* @see {@link https://hono.dev/docs/api/hono#not-found}
	*
	* @param {NotFoundHandler} handler - request handler for not-found
	* @returns {Hono} changed Hono instance
	*
	* @example
	* ```ts
	* app.notFound((c) => {
	*   return c.text('Custom 404 Message', 404)
	* })
	* ```
	*/
	notFound = (handler) => {
		this.#notFoundHandler = handler;
		return this;
	};
	/**
	* `.mount()` allows you to mount applications built with other frameworks into your Hono application.
	*
	* @see {@link https://hono.dev/docs/api/hono#mount}
	*
	* @param {string} path - base Path
	* @param {Function} applicationHandler - other Request Handler
	* @param {MountOptions} [options] - options of `.mount()`
	* @returns {Hono} mounted Hono instance
	*
	* @example
	* ```ts
	* import { Router as IttyRouter } from 'itty-router'
	* import { Hono } from 'hono'
	* // Create itty-router application
	* const ittyRouter = IttyRouter()
	* // GET /itty-router/hello
	* ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
	*
	* const app = new Hono()
	* app.mount('/itty-router', ittyRouter.handle)
	* ```
	*
	* @example
	* ```ts
	* const app = new Hono()
	* // Send the request to another application without modification.
	* app.mount('/app', anotherApp, {
	*   replaceRequest: (req) => req,
	* })
	* ```
	*/
	mount(path, applicationHandler, options) {
		let replaceRequest;
		let optionHandler;
		if (options) if (typeof options === "function") optionHandler = options;
		else {
			optionHandler = options.optionHandler;
			if (options.replaceRequest === false) replaceRequest = (request) => request;
			else replaceRequest = options.replaceRequest;
		}
		const getOptions = optionHandler ? (c) => {
			const options2 = optionHandler(c);
			return Array.isArray(options2) ? options2 : [options2];
		} : (c) => {
			let executionContext = void 0;
			try {
				executionContext = c.executionCtx;
			} catch {}
			return [c.env, executionContext];
		};
		replaceRequest ||= (() => {
			const mergedPath = mergePath(this._basePath, path);
			const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
			return (request) => {
				const url = new URL(request.url);
				url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
				return new Request(url, request);
			};
		})();
		const handler = async (c, next) => {
			const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
			if (res) return res;
			await next();
		};
		this.#addRoute("ALL", mergePath(path, "*"), handler);
		return this;
	}
	#addRoute(method, path, handler, baseRoutePath) {
		method = method.toUpperCase();
		path = mergePath(this._basePath, path);
		const r = {
			basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
			path,
			method,
			handler
		};
		this.router.add(method, path, [handler, r]);
		this.routes.push(r);
	}
	#handleError(err, c) {
		if (err instanceof Error) return this.errorHandler(err, c);
		throw err;
	}
	#dispatch(request, executionCtx, env, method) {
		if (method === "HEAD") return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
		const path = this.getPath(request, { env });
		const matchResult = this.router.match(method, path);
		const c = new Context(request, {
			path,
			matchResult,
			env,
			executionCtx,
			notFoundHandler: this.#notFoundHandler
		});
		if (matchResult[0].length === 1) {
			let res;
			try {
				res = matchResult[0][0][0][0](c, async () => {
					c.res = await this.#notFoundHandler(c);
				});
			} catch (err) {
				return this.#handleError(err, c);
			}
			return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
		}
		const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
		return (async () => {
			try {
				const context = await composed(c);
				if (!context.finalized) throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
				return context.res;
			} catch (err) {
				return this.#handleError(err, c);
			}
		})();
	}
	/**
	* `.fetch()` will be entry point of your app.
	*
	* @see {@link https://hono.dev/docs/api/hono#fetch}
	*
	* @param {Request} request - request Object of request
	* @param {Env} Env - env Object
	* @param {ExecutionContext} - context of execution
	* @returns {Response | Promise<Response>} response of request
	*
	*/
	fetch = (request, ...rest) => {
		return this.#dispatch(request, rest[1], rest[0], request.method);
	};
	/**
	* `.request()` is a useful method for testing.
	* You can pass a URL or pathname to send a GET request.
	* app will return a Response object.
	* ```ts
	* test('GET /hello is ok', async () => {
	*   const res = await app.request('/hello')
	*   expect(res.status).toBe(200)
	* })
	* ```
	* @see https://hono.dev/docs/api/hono#request
	*/
	request = (input, requestInit, Env, executionCtx) => {
		if (input instanceof Request) return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
		input = input.toString();
		return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
	};
	/**
	* `.fire()` automatically adds a global fetch event listener.
	* This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
	* @deprecated
	* Use `fire` from `hono/service-worker` instead.
	* ```ts
	* import { Hono } from 'hono'
	* import { fire } from 'hono/service-worker'
	*
	* const app = new Hono()
	* // ...
	* fire(app)
	* ```
	* @see https://hono.dev/docs/api/hono#fire
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
	* @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
	*/
	fire = () => {
		addEventListener("fetch", (event) => {
			event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
		});
	};
};
//#endregion
//#region node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
	const matchers = this.buildAllMatchers();
	const match2 = ((method2, path2) => {
		const matcher = matchers[method2] || matchers["ALL"];
		const staticMatch = matcher[2][path2];
		if (staticMatch) return staticMatch;
		const match3 = path2.match(matcher[0]);
		if (!match3) return [[], emptyParam];
		const index = match3.indexOf("", 1);
		return [matcher[1][index], match3];
	});
	this.match = match2;
	return match2(method, path);
}
//#endregion
//#region node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = /* @__PURE__ */ new Set(".\\+*[^]$()");
function compareKey(a, b) {
	if (a.length === 1) return b.length === 1 ? a < b ? -1 : 1 : -1;
	if (b.length === 1) return 1;
	if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) return 1;
	else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) return -1;
	if (a === LABEL_REG_EXP_STR) return 1;
	else if (b === LABEL_REG_EXP_STR) return -1;
	return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node$1 = class _Node {
	#index;
	#varIndex;
	#children = /* @__PURE__ */ Object.create(null);
	insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
		if (tokens.length === 0) {
			if (this.#index !== void 0) throw PATH_ERROR;
			if (pathErrorCheckOnly) return;
			this.#index = index;
			return;
		}
		const [token, ...restTokens] = tokens;
		const pattern = token === "*" ? restTokens.length === 0 ? [
			"",
			"",
			ONLY_WILDCARD_REG_EXP_STR
		] : [
			"",
			"",
			LABEL_REG_EXP_STR
		] : token === "/*" ? [
			"",
			"",
			TAIL_WILDCARD_REG_EXP_STR
		] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
		let node;
		if (pattern) {
			const name = pattern[1];
			let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
			if (name && pattern[2]) {
				if (regexpStr === ".*") throw PATH_ERROR;
				regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
				if (/\((?!\?:)/.test(regexpStr)) throw PATH_ERROR;
			}
			node = this.#children[regexpStr];
			if (!node) {
				if (Object.keys(this.#children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) throw PATH_ERROR;
				if (pathErrorCheckOnly) return;
				node = this.#children[regexpStr] = new _Node();
				if (name !== "") node.#varIndex = context.varIndex++;
			}
			if (!pathErrorCheckOnly && name !== "") paramMap.push([name, node.#varIndex]);
		} else {
			node = this.#children[token];
			if (!node) {
				if (Object.keys(this.#children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) throw PATH_ERROR;
				if (pathErrorCheckOnly) return;
				node = this.#children[token] = new _Node();
			}
		}
		node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
	}
	buildRegExpStr() {
		const strList = Object.keys(this.#children).sort(compareKey).map((k) => {
			const c = this.#children[k];
			return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
		});
		if (typeof this.#index === "number") strList.unshift(`#${this.#index}`);
		if (strList.length === 0) return "";
		if (strList.length === 1) return strList[0];
		return "(?:" + strList.join("|") + ")";
	}
};
//#endregion
//#region node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
	#context = { varIndex: 0 };
	#root = new Node$1();
	insert(path, index, pathErrorCheckOnly) {
		const paramAssoc = [];
		const groups = [];
		for (let i = 0;;) {
			let replaced = false;
			path = path.replace(/\{[^}]+\}/g, (m) => {
				const mark = `@\\${i}`;
				groups[i] = [mark, m];
				i++;
				replaced = true;
				return mark;
			});
			if (!replaced) break;
		}
		const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
		for (let i = groups.length - 1; i >= 0; i--) {
			const [mark] = groups[i];
			for (let j = tokens.length - 1; j >= 0; j--) if (tokens[j].indexOf(mark) !== -1) {
				tokens[j] = tokens[j].replace(mark, groups[i][1]);
				break;
			}
		}
		this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
		return paramAssoc;
	}
	buildRegExp() {
		let regexp = this.#root.buildRegExpStr();
		if (regexp === "") return [
			/^$/,
			[],
			[]
		];
		let captureIndex = 0;
		const indexReplacementMap = [];
		const paramReplacementMap = [];
		regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
			if (handlerIndex !== void 0) {
				indexReplacementMap[++captureIndex] = Number(handlerIndex);
				return "$()";
			}
			if (paramIndex !== void 0) {
				paramReplacementMap[Number(paramIndex)] = ++captureIndex;
				return "";
			}
			return "";
		});
		return [
			new RegExp(`^${regexp}`),
			indexReplacementMap,
			paramReplacementMap
		];
	}
};
//#endregion
//#region node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [
	/^$/,
	[],
	/* @__PURE__ */ Object.create(null)
];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
	return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
}
function clearWildcardRegExpCache() {
	wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
	const trie = new Trie();
	const handlerData = [];
	if (routes.length === 0) return nullMatcher;
	const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
	const staticMap = /* @__PURE__ */ Object.create(null);
	for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
		const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
		if (pathErrorCheckOnly) staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
		else j++;
		let paramAssoc;
		try {
			paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
		} catch (e) {
			throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
		}
		if (pathErrorCheckOnly) continue;
		handlerData[j] = handlers.map(([h, paramCount]) => {
			const paramIndexMap = /* @__PURE__ */ Object.create(null);
			paramCount -= 1;
			for (; paramCount >= 0; paramCount--) {
				const [key, value] = paramAssoc[paramCount];
				paramIndexMap[key] = value;
			}
			return [h, paramIndexMap];
		});
	}
	const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
	for (let i = 0, len = handlerData.length; i < len; i++) for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
		const map = handlerData[i][j]?.[1];
		if (!map) continue;
		const keys = Object.keys(map);
		for (let k = 0, len3 = keys.length; k < len3; k++) map[keys[k]] = paramReplacementMap[map[keys[k]]];
	}
	const handlerMap = [];
	for (const i in indexReplacementMap) handlerMap[i] = handlerData[indexReplacementMap[i]];
	return [
		regexp,
		handlerMap,
		staticMap
	];
}
function findMiddleware(middleware, path) {
	if (!middleware) return;
	for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) if (buildWildcardRegExp(k).test(path)) return [...middleware[k]];
}
var RegExpRouter = class {
	name = "RegExpRouter";
	#middleware;
	#routes;
	constructor() {
		this.#middleware = { ["ALL"]: /* @__PURE__ */ Object.create(null) };
		this.#routes = { ["ALL"]: /* @__PURE__ */ Object.create(null) };
	}
	add(method, path, handler) {
		const middleware = this.#middleware;
		const routes = this.#routes;
		if (!middleware || !routes) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
		if (!middleware[method]) [middleware, routes].forEach((handlerMap) => {
			handlerMap[method] = /* @__PURE__ */ Object.create(null);
			Object.keys(handlerMap["ALL"]).forEach((p) => {
				handlerMap[method][p] = [...handlerMap["ALL"][p]];
			});
		});
		if (path === "/*") path = "*";
		const paramCount = (path.match(/\/:/g) || []).length;
		if (/\*$/.test(path)) {
			const re = buildWildcardRegExp(path);
			if (method === "ALL") Object.keys(middleware).forEach((m) => {
				middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware["ALL"], path) || [];
			});
			else middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware["ALL"], path) || [];
			Object.keys(middleware).forEach((m) => {
				if (method === "ALL" || method === m) Object.keys(middleware[m]).forEach((p) => {
					re.test(p) && middleware[m][p].push([handler, paramCount]);
				});
			});
			Object.keys(routes).forEach((m) => {
				if (method === "ALL" || method === m) Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
			});
			return;
		}
		const paths = checkOptionalParameter(path) || [path];
		for (let i = 0, len = paths.length; i < len; i++) {
			const path2 = paths[i];
			Object.keys(routes).forEach((m) => {
				if (method === "ALL" || method === m) {
					routes[m][path2] ||= [...findMiddleware(middleware[m], path2) || findMiddleware(middleware["ALL"], path2) || []];
					routes[m][path2].push([handler, paramCount - len + i + 1]);
				}
			});
		}
	}
	match = match;
	buildAllMatchers() {
		const matchers = /* @__PURE__ */ Object.create(null);
		Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
			matchers[method] ||= this.#buildMatcher(method);
		});
		this.#middleware = this.#routes = void 0;
		clearWildcardRegExpCache();
		return matchers;
	}
	#buildMatcher(method) {
		const routes = [];
		let hasOwnRoute = method === "ALL";
		[this.#middleware, this.#routes].forEach((r) => {
			const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
			if (ownRoute.length !== 0) {
				hasOwnRoute ||= true;
				routes.push(...ownRoute);
			} else if (method !== "ALL") routes.push(...Object.keys(r["ALL"]).map((path) => [path, r["ALL"][path]]));
		});
		if (!hasOwnRoute) return null;
		else return buildMatcherFromPreprocessedRoutes(routes);
	}
};
//#endregion
//#region node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
	name = "SmartRouter";
	#routers = [];
	#routes = [];
	constructor(init) {
		this.#routers = init.routers;
	}
	add(method, path, handler) {
		if (!this.#routes) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
		this.#routes.push([
			method,
			path,
			handler
		]);
	}
	match(method, path) {
		if (!this.#routes) throw new Error("Fatal error");
		const routers = this.#routers;
		const routes = this.#routes;
		const len = routers.length;
		let i = 0;
		let res;
		for (; i < len; i++) {
			const router = routers[i];
			try {
				for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) router.add(...routes[i2]);
				res = router.match(method, path);
			} catch (e) {
				if (e instanceof UnsupportedPathError) continue;
				throw e;
			}
			this.match = router.match.bind(router);
			this.#routers = [router];
			this.#routes = void 0;
			break;
		}
		if (i === len) throw new Error("Fatal error");
		this.name = `SmartRouter + ${this.activeRouter.name}`;
		return res;
	}
	get activeRouter() {
		if (this.#routes || this.#routers.length !== 1) throw new Error("No active router has been determined yet.");
		return this.#routers[0];
	}
};
//#endregion
//#region node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
	for (const _ in children) return true;
	return false;
};
var Node = class _Node {
	#methods;
	#children;
	#patterns;
	#order = 0;
	#params = emptyParams;
	constructor(method, handler, children) {
		this.#children = children || /* @__PURE__ */ Object.create(null);
		this.#methods = [];
		if (method && handler) {
			const m = /* @__PURE__ */ Object.create(null);
			m[method] = {
				handler,
				possibleKeys: [],
				score: 0
			};
			this.#methods = [m];
		}
		this.#patterns = [];
	}
	insert(method, path, handler) {
		this.#order = ++this.#order;
		let curNode = this;
		const parts = splitRoutingPath(path);
		const possibleKeys = [];
		for (let i = 0, len = parts.length; i < len; i++) {
			const p = parts[i];
			const nextP = parts[i + 1];
			const pattern = getPattern(p, nextP);
			const key = Array.isArray(pattern) ? pattern[0] : p;
			if (key in curNode.#children) {
				curNode = curNode.#children[key];
				if (pattern) possibleKeys.push(pattern[1]);
				continue;
			}
			curNode.#children[key] = new _Node();
			if (pattern) {
				curNode.#patterns.push(pattern);
				possibleKeys.push(pattern[1]);
			}
			curNode = curNode.#children[key];
		}
		curNode.#methods.push({ [method]: {
			handler,
			possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
			score: this.#order
		} });
		return curNode;
	}
	#pushHandlerSets(handlerSets, node, method, nodeParams, params) {
		for (let i = 0, len = node.#methods.length; i < len; i++) {
			const m = node.#methods[i];
			const handlerSet = m[method] || m["ALL"];
			const processedSet = {};
			if (handlerSet !== void 0) {
				handlerSet.params = /* @__PURE__ */ Object.create(null);
				handlerSets.push(handlerSet);
				if (nodeParams !== emptyParams || params && params !== emptyParams) for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
					const key = handlerSet.possibleKeys[i2];
					const processed = processedSet[handlerSet.score];
					handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
					processedSet[handlerSet.score] = true;
				}
			}
		}
	}
	search(method, path) {
		const handlerSets = [];
		this.#params = emptyParams;
		let curNodes = [this];
		const parts = splitPath(path);
		const curNodesQueue = [];
		const len = parts.length;
		let partOffsets = null;
		for (let i = 0; i < len; i++) {
			const part = parts[i];
			const isLast = i === len - 1;
			const tempNodes = [];
			for (let j = 0, len2 = curNodes.length; j < len2; j++) {
				const node = curNodes[j];
				const nextNode = node.#children[part];
				if (nextNode) {
					nextNode.#params = node.#params;
					if (isLast) {
						if (nextNode.#children["*"]) this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
						this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
					} else tempNodes.push(nextNode);
				}
				for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
					const pattern = node.#patterns[k];
					const params = node.#params === emptyParams ? {} : { ...node.#params };
					if (pattern === "*") {
						const astNode = node.#children["*"];
						if (astNode) {
							this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
							astNode.#params = params;
							tempNodes.push(astNode);
						}
						continue;
					}
					const [key, name, matcher] = pattern;
					if (!part && !(matcher instanceof RegExp)) continue;
					const child = node.#children[key];
					if (matcher instanceof RegExp) {
						if (partOffsets === null) {
							partOffsets = new Array(len);
							let offset = path[0] === "/" ? 1 : 0;
							for (let p = 0; p < len; p++) {
								partOffsets[p] = offset;
								offset += parts[p].length + 1;
							}
						}
						const restPathString = path.substring(partOffsets[i]);
						const m = matcher.exec(restPathString);
						if (m) {
							params[name] = m[0];
							this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
							if (m[0].length === restPathString.length && child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, node.#params, params);
							if (hasChildren(child.#children)) {
								child.#params = params;
								const componentCount = m[0].match(/\//)?.length ?? 0;
								(curNodesQueue[componentCount] ||= []).push(child);
							}
							continue;
						}
					}
					if (matcher === true || matcher.test(part)) {
						params[name] = part;
						if (isLast) {
							this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
							if (child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, params, node.#params);
						} else {
							child.#params = params;
							tempNodes.push(child);
						}
					}
				}
			}
			const shifted = curNodesQueue.shift();
			curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
		}
		if (handlerSets.length > 1) handlerSets.sort((a, b) => {
			return a.score - b.score;
		});
		return [handlerSets.map(({ handler, params }) => [handler, params])];
	}
};
//#endregion
//#region node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
	name = "TrieRouter";
	#node;
	constructor() {
		this.#node = new Node();
	}
	add(method, path, handler) {
		const results = checkOptionalParameter(path);
		if (results) {
			for (let i = 0, len = results.length; i < len; i++) this.#node.insert(method, results[i], handler);
			return;
		}
		this.#node.insert(method, path, handler);
	}
	match(method, path) {
		return this.#node.search(method, path);
	}
};
//#endregion
//#region node_modules/hono/dist/hono.js
var Hono = class extends Hono$1 {
	/**
	* Creates an instance of the Hono class.
	*
	* @param options - Optional configuration options for the Hono instance.
	*/
	constructor(options = {}) {
		super(options);
		this.router = options.router ?? new SmartRouter({ routers: [new RegExpRouter(), new TrieRouter()] });
	}
};
//#endregion
//#region node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
	const opts = {
		origin: "*",
		allowMethods: [
			"GET",
			"HEAD",
			"PUT",
			"POST",
			"DELETE",
			"PATCH"
		],
		allowHeaders: [],
		exposeHeaders: [],
		...options
	};
	const findAllowOrigin = ((optsOrigin) => {
		if (typeof optsOrigin === "string") if (optsOrigin === "*") return () => optsOrigin;
		else return (origin) => optsOrigin === origin ? origin : null;
		else if (typeof optsOrigin === "function") return optsOrigin;
		else return (origin) => optsOrigin.includes(origin) ? origin : null;
	})(opts.origin);
	const findAllowMethods = ((optsAllowMethods) => {
		if (typeof optsAllowMethods === "function") return optsAllowMethods;
		else if (Array.isArray(optsAllowMethods)) return () => optsAllowMethods;
		else return () => [];
	})(opts.allowMethods);
	return async function cors2(c, next) {
		function set(key, value) {
			c.res.headers.set(key, value);
		}
		const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
		if (allowOrigin) set("Access-Control-Allow-Origin", allowOrigin);
		if (opts.credentials) set("Access-Control-Allow-Credentials", "true");
		if (opts.exposeHeaders?.length) set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
		if (c.req.method === "OPTIONS") {
			if (opts.origin !== "*") set("Vary", "Origin");
			if (opts.maxAge != null) set("Access-Control-Max-Age", opts.maxAge.toString());
			const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
			if (allowMethods.length) set("Access-Control-Allow-Methods", allowMethods.join(","));
			let headers = opts.allowHeaders;
			if (!headers?.length) {
				const requestHeaders = c.req.header("Access-Control-Request-Headers");
				if (requestHeaders) headers = requestHeaders.split(/\s*,\s*/);
			}
			if (headers?.length) {
				set("Access-Control-Allow-Headers", headers.join(","));
				c.res.headers.append("Vary", "Access-Control-Request-Headers");
			}
			c.res.headers.delete("Content-Length");
			c.res.headers.delete("Content-Type");
			return new Response(null, {
				headers: c.res.headers,
				status: 204,
				statusText: "No Content"
			});
		}
		await next();
		if (opts.origin !== "*") c.header("Vary", "Origin", { append: true });
	};
};
//#endregion
//#region src/cms/registry/admin-menu.ts
var pluginMenus = [];
function registerPluginMenu(item) {
	pluginMenus.push(item);
}
//#endregion
//#region src/cms/addons/wp-importer/wp.service.ts
var WPImporterService = class {
	db;
	constructor(db) {
		this.db = db;
	}
	async importPosts(posts) {
		const results = [];
		for (const post of posts) try {
			await this.db.prepare("INSERT OR REPLACE INTO contents (title, slug, body, type, status, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(post.title, post.slug, post.content, "post", post.status, post.date).run();
			results.push({
				title: post.title,
				status: "success"
			});
		} catch (e) {
			results.push({
				title: post.title,
				status: "error",
				message: e.message
			});
		}
		return results;
	}
};
//#endregion
//#region src/cms/addons/wp-importer/wp.router.ts
var wpRouter = new Hono();
wpRouter.post("/json", async (c) => {
	const posts = await c.req.json();
	const result = await new WPImporterService(c.env.DB).importPosts(posts);
	return c.json({
		success: true,
		data: result
	});
});
//#endregion
//#region src/cms/themes/labmu-default/style.ts
var css$4 = `
  :root { --primary: #2271b1; --text: #333; --bg: #fff; --light: #f5f5f5; }
  body { font-family: -apple-system, sans-serif; line-height: 1.6; margin: 0; color: var(--text); background: var(--light); }
   
  /* Container */
  .container { max-width: 800px; margin: 0 auto; padding: 20px; background: var(--bg); min-height: 100vh; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
   
  /* Header */
  header { border-bottom: 2px solid var(--primary); padding-bottom: 20px; margin-bottom: 30px; }
  h1.site-title { margin: 0; }
  h1.site-title a { text-decoration: none; color: var(--primary); }
  p.site-desc { color: #666; margin: 5px 0 0; }

  /* --- [BARU] NAVIGATION MENU --- */
  .main-nav { margin-top: 15px; }
  .nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 20px; }
  .menu-item a { text-decoration: none; color: #555; font-weight: 500; font-size: 0.95em; transition: 0.2s; }
  .menu-item a:hover { color: var(--primary); }
   
  /* Post List */
  .post-item { margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eee; }
  .post-title { margin: 0 0 10px; }
  .post-title a { text-decoration: none; color: #111; }
  .post-title a:hover { color: var(--primary); }
  .meta { font-size: 0.85em; color: #999; margin-bottom: 10px; }
   
  /* Single Post */
  .entry-content { font-size: 1.1em; }
  .back-link { display: inline-block; margin-bottom: 20px; color: var(--primary); text-decoration: none; }
   
  /* Footer */
  footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 0.9em; color: #999; }
`;
//#endregion
//#region src/cms/themes/labmu-default/index.ts
var LabMuDefault = {
	name: "LabMu Default",
	version: "1.0.0",
	author: "LabMu Team",
	_layout(content, title, ctx) {
		const menus = ctx.menus || [];
		const favicon = ctx.site.site_favicon || "/favicon.ico";
		let navHtml = "";
		if (menus.length > 0) navHtml = `
         <nav class="main-nav">
           <ul class="nav-menu">
             ${menus.map((m) => `
                <li class="menu-item">
                   <a href="${m.url}">${m.label}</a>
                </li>
             `).join("")}
           </ul>
         </nav>
       `;
		return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link rel="icon" href="${favicon}" />
        
        <title>${title} - ${ctx.site.site_title || ctx.site.title}</title>
        <style>${css$4}</style>
      </head>
      <body>
        <div class="container">
          <header>
            <div style="display:flex; align-items:center; gap:15px;">
                ${ctx.site.site_logo ? `<img src="${ctx.site.site_logo}" alt="Logo" style="height:50px; width:auto;">` : ""}
                <div>
                    <h1 class="site-title">
                        <a href="/">${ctx.site.site_title || ctx.site.title}</a>
                    </h1>
                    <p class="site-desc">${ctx.site.site_desc || ctx.site.description || ""}</p>
                </div>
            </div>

            ${navHtml}

          </header>
          
          <main>
            ${content}
          </main>

          <footer>
            &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} ${ctx.site.site_title || ctx.site.title}. Powered by LabMu CMS.
          </footer>
        </div>
      </body>
      </html>
    `;
	},
	renderHome(ctx) {
		const posts = ctx.data || [];
		let html = "";
		if (posts.length === 0) html = "<p style=\"text-align:center; color:#666;\">Belum ada postingan. Silakan buat di Admin Panel.</p>";
		else html = posts.map((p) => `
        <article class="post-item">
          ${p.featured_image ? `<img src="${p.featured_image}" alt="${p.title}" style="width:100%; height:auto; border-radius:8px; margin-bottom:15px; object-fit:cover; max-height:300px;">` : ""}
          
          <h2 class="post-title"><a href="/${p.slug}">${p.title}</a></h2>
          <div class="meta">Diposting pada ${p.created_at || "Baru saja"}</div>
          <p>${p.excerpt || "Klik judul untuk membaca selengkapnya..."}</p>
        </article>
      `).join("");
		return this._layout(html, "Beranda", ctx);
	},
	renderSingle(ctx) {
		const post = ctx.data;
		if (!post) return this.render404(ctx);
		const dateStr = post.created_at ? new Date(post.created_at).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric"
		}) : "";
		const html = `
      <article class="post-single">
        <div style="margin-bottom:15px;">
             <a href="/" class="back-link" style="font-size:0.9em;">&larr; Kembali ke Beranda</a>
        </div>

        <h1 class="entry-title" style="margin-bottom:5px;">${post.title}</h1>
        
        <div class="meta" style="margin-bottom:20px; padding-bottom:15px; border-bottom:1px solid #eee; color:#666; font-size:0.9em;">
           <span class="date">📅 ${dateStr}</span> &bull; 
           <span class="author">👤 Admin</span>
           ${post.category ? `&bull; 📂 ${post.category}` : ""}
        </div>

        ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" style="width:100%; height:auto; border-radius:8px; margin-bottom:25px;">` : ""}

        <div class="entry-content">
          ${post.body || "<p>Isi konten kosong...</p>"}
        </div>
        
        ${post.tags ? `<div style="margin-top:30px; font-size:0.85em; color:#888;">🏷️ Tags: ${post.tags}</div>` : ""}
      </article>
    `;
		return this._layout(html, post.title, ctx);
	},
	renderPage(ctx) {
		const page = ctx.data;
		if (!page) return this.render404(ctx);
		const html = `
      <div class="page-single">
        <h1 class="entry-title" style="margin-bottom:25px; border-bottom:2px solid #eee; padding-bottom:15px;">
            ${page.title}
        </h1>

        ${page.featured_image ? `<img src="${page.featured_image}" alt="${page.title}" style="width:100%; max-height:400px; object-fit:cover; border-radius:8px; margin-bottom:25px;">` : ""}

        <div class="entry-content">
          ${page.body || "<p>Halaman ini belum diisi.</p>"}
        </div>
      </div>
    `;
		return this._layout(html, page.title, ctx);
	},
	render404(ctx) {
		return this._layout(`
      <div style="text-align:center; padding: 50px 0;">
        <h1 style="font-size:3rem; margin-bottom:10px; color:#e74c3c;">404</h1>
        <p>Halaman tidak ditemukan.</p>
        <a href="/" class="back-link">Kembali ke Beranda</a>
      </div>
    `, "404 Not Found", ctx);
	}
};
//#endregion
//#region src/cms/themes/labmu-news/style.ts
var css$3 = `
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Inter:wght@400;500;600&display=swap');

:root {
  --primary: #c02626; /* Merah Berita (Mirip Detik/CNN) */
  --dark: #111827;
  --gray: #6b7280;
  --light: #f3f4f6;
  --white: #ffffff;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: 'Inter', sans-serif; background: var(--light); color: var(--dark); line-height: 1.6; }
h1, h2, h3, h4 { font-family: 'Merriweather', serif; font-weight: 700; line-height: 1.3; color: var(--dark); }
a { text-decoration: none; color: inherit; transition: color 0.2s; }
a:hover { color: var(--primary); }

.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* HEADER */
.main-header { background: var(--white); border-bottom: 2px solid var(--primary); padding: 20px 0; position: sticky; top:0; z-index:100; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.8rem; font-weight: 900; color: var(--primary); letter-spacing: -1px; }
.nav-menu { display: flex; gap: 20px; font-weight: 600; font-size: 0.95rem; }

/* HERO SECTION */
.hero-section { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 30px; }
.hero-card { position: relative; border-radius: 12px; overflow: hidden; height: 400px; }
.hero-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.hero-card:hover .hero-img { transform: scale(1.05); }
.hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding: 30px; color: white; }
.hero-cat { background: var(--primary); color: white; padding: 4px 10px; font-size: 0.7rem; text-transform: uppercase; font-weight: bold; border-radius: 4px; margin-bottom: 10px; display: inline-block; }
.hero-title { font-size: 1.8rem; margin-bottom: 10px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

/* LATEST NEWS GRID */
.section-title { margin: 40px 0 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; font-size: 1.2rem; display: flex; justify-content: space-between; align-items: center; }
.section-title span { background: var(--dark); color: white; padding: 5px 15px; margin-bottom: -11px; }

.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
.news-card { background: var(--white); border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
.news-thumb { height: 200px; width: 100%; object-fit: cover; }
.news-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.news-meta { font-size: 0.8rem; color: var(--gray); margin-bottom: 10px; }
.news-title { font-size: 1.1rem; margin-bottom: 10px; flex: 1; }
.read-more { font-size: 0.85rem; font-weight: 600; color: var(--primary); margin-top: 15px; }

/* SINGLE POST */
.single-container { background: var(--white); padding: 40px; margin-top: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 800px; margin-left: auto; margin-right: auto; }
.post-header { text-align: center; margin-bottom: 30px; }
.post-title { font-size: 2.5rem; margin-bottom: 15px; }
.post-meta { color: var(--gray); font-size: 0.9rem; }
.post-img { width: 100%; height: auto; border-radius: 8px; margin-bottom: 30px; }
.post-content { font-size: 1.1rem; line-height: 1.8; color: #374151; }
.post-content p { margin-bottom: 20px; }

/* FOOTER */
footer { background: var(--dark); color: white; padding: 40px 0; margin-top: 60px; text-align: center; }
`;
//#endregion
//#region src/cms/themes/labmu-news/index.ts
var LabMuNews = {
	name: "LabMu News",
	version: "1.2.0",
	author: "LabMu Dev",
	_layout(content, title, ctx) {
		return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${ctx.site.title || "Portal Berita"}</title>
        <style>${css$3}</style>
      </head>
      <body>
        <header class="main-header">
          <div class="container header-inner">
             <a href="/" class="logo">LabMu<span style="color:#111">News.</span></a>
             <nav class="nav-menu">
                <a href="/">Nasional</a>
                <a href="/">Ekonomi</a>
                <a href="/">Teknologi</a>
                <a href="/quran" style="color:#059669;">QuranMu</a>
             </nav>
          </div>
        </header>

        <div class="container">
          <main>${content}</main>
        </div>

        <footer>
           <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} LabMu News Premium. Ditenagai oleh LabMu CMS.</p>
        </footer>
      </body>
      </html>
    `;
	},
	renderHome(ctx) {
		const posts = ctx.data || [];
		if (posts.length === 0) return this._layout(`
         <div style="text-align:center; padding:100px 0;">
            <h2 style="color:#ccc;">Belum ada berita yang diterbitkan.</h2>
            <p>Silakan gunakan Addon <b>WP Importer</b> untuk menarik berita dari WordPress.</p>
         </div>
       `, "Home", ctx);
		const heroPost = posts[0];
		const otherPosts = posts.slice(1);
		const heroHtml = `
      <div class="hero-section">
         <a href="/${heroPost.slug}" class="hero-card" style="grid-column: span 2;">
            <img src="${heroPost.featured_image || "https://placehold.co/800x400/111/fff?text=Breaking+News"}" class="hero-img">
            <div class="hero-overlay">
               <span class="hero-cat">${heroPost.category || "Berita Utama"}</span>
               <h2 class="hero-title">${heroPost.title}</h2>
               <p>${new Date(heroPost.created_at).toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		})}</p>
            </div>
         </a>
      </div>
    `;
		const gridHtml = `
      <div class="section-title"><span>Berita Terkini</span></div>
      <div class="news-grid">
         ${otherPosts.map((p) => `
            <a href="/${p.slug}" class="news-card">
               <img src="${p.featured_image || "https://placehold.co/400x250/eee/999?text=News"}" class="news-thumb">
               <div class="news-body">
                  <div class="news-meta">${new Date(p.created_at).toLocaleDateString("id-ID")}</div>
                  <h3 class="news-title">${p.title}</h3>
                  <div class="read-more">Baca Selengkapnya &rarr;</div>
               </div>
            </a>
         `).join("")}
      </div>
    `;
		return this._layout(heroHtml + gridHtml, "Berita Terkini", ctx);
	},
	renderSingle(ctx) {
		const p = ctx.data;
		if (!p) return this._layout("<h1>404 Not Found</h1>", "404", ctx);
		const html = `
      <article class="single-container">
         <header class="post-header">
            <span class="hero-cat">${p.category || "Umum"}</span>
            <h1 class="post-title">${p.title}</h1>
            <div class="post-meta">
               Oleh <b>Admin</b> &bull; ${new Date(p.created_at || Date.now()).toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		})}
            </div>
         </header>

         ${p.featured_image ? `<img src="${p.featured_image}" class="post-img">` : ""}

         <div class="post-content">
            ${p.body}
         </div>
      </article>
    `;
		return this._layout(html, p.title, ctx);
	},
	renderPage(ctx) {
		return this.renderSingle(ctx);
	},
	render404(ctx) {
		return this._layout("<div style=\"text-align:center; padding:100px;\"><h1>404</h1><p>Halaman tidak ditemukan</p></div>", "Not Found", ctx);
	}
};
//#endregion
//#region src/cms/themes/labmu-pro/style.ts
var css$2 = `
:root {
  --primary: #2563eb;
  --secondary: #1e293b;
  --accent: #f59e0b;
  --bg-body: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #334155;
  --text-muted: #64748b;
  --container-width: 1200px;
  --header-height: 70px;
  --font-main: 'Inter', sans-serif;
}

/* RESET & BASE */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-main); background: var(--bg-body); color: var(--text-main); line-height: 1.6; }
a { text-decoration: none; color: inherit; transition: 0.2s; }
a:hover { color: var(--primary); }
img { max-width: 100%; height: auto; display: block; }
.container { max-width: var(--container-width); margin: 0 auto; padding: 0 20px; }

/* UTILITY GRID */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.gap-20 { gap: 20px; }

/* HEADER PRO */
.pro-header { background: var(--bg-card); height: var(--header-height); display: flex; align-items: center; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.header-inner { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.logo { font-size: 1.5rem; font-weight: 800; color: var(--primary); letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }
.nav-menu { display: flex; gap: 25px; font-weight: 500; font-size: 0.95rem; }

/* HERO SECTION (Homepage) */
.hero-section { background: var(--secondary); color: white; padding: 80px 0; text-align: center; margin-bottom: 40px; }
.hero-title { font-size: 3rem; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px; }
.hero-subtitle { font-size: 1.2rem; opacity: 0.8; max-width: 600px; margin: 0 auto 30px auto; }
.btn-hero { background: var(--primary); color: white; padding: 12px 30px; border-radius: 50px; font-weight: 600; display: inline-block; }
.btn-hero:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3); }

/* MAIN LAYOUT */
.main-wrapper { padding: 40px 0; display: grid; gap: 40px; }
.layout-right-sidebar { grid-template-columns: 1fr 300px; }
.layout-left-sidebar { grid-template-columns: 300px 1fr; }
.layout-full { grid-template-columns: 1fr; }

/* CARDS (Posts) */
.post-card { background: var(--bg-card); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: 0.3s; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.post-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.post-thumb { height: 200px; object-fit: cover; width: 100%; background: #eee; }
.post-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.post-tag { background: #dbeafe; color: var(--primary); font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; font-weight: 600; align-self: start; margin-bottom: 10px; text-transform: uppercase; }
.post-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 10px; line-height: 1.3; }
.post-excerpt { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; flex: 1; }
.post-meta { font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; display: flex; justify-content: space-between; }

/* SINGLE POST */
.entry-header { text-align: center; margin-bottom: 40px; }
.entry-title { font-size: 2.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 20px; }
.entry-image { width: 100%; height: 400px; object-fit: cover; border-radius: 16px; margin-bottom: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.entry-content { font-size: 1.15rem; line-height: 1.8; color: #475569; max-width: 800px; margin: 0 auto; }
.entry-content h2 { margin-top: 40px; margin-bottom: 20px; color: var(--secondary); }

/* SIDEBAR WIDGETS */
.widget { background: var(--bg-card); padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
.widget-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--primary); display: inline-block; }
.widget-list { list-style: none; }
.widget-list li { padding: 10px 0; border-bottom: 1px dashed #e2e8f0; display: flex; align-items: center; gap: 10px; }
.widget-list li:last-child { border-bottom: none; }
.mini-thumb { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; }

/* FOOTER PRO */
.pro-footer { background: var(--secondary); color: #cbd5e1; padding: 60px 0 20px; margin-top: 60px; }
.footer-grid { margin-bottom: 40px; }
.footer-col h4 { color: white; margin-bottom: 20px; font-size: 1.1rem; }
.footer-links li { margin-bottom: 10px; }
.footer-bottom { border-top: 1px solid #334155; padding-top: 20px; text-align: center; font-size: 0.9rem; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4, .layout-right-sidebar { grid-template-columns: 1fr; }
  .nav-menu { display: none; } /* Mobile menu simplified */
  .hero-title { font-size: 2rem; }
}
`;
//#endregion
//#region src/cms/themes/labmu-pro/components.ts
var renderHeader$2 = (ctx) => `
  <header class="pro-header">
    <div class="container header-inner">
      <a href="/" class="logo">
        <i class="fas fa-layer-group"></i> 
        <span>${ctx.site.title}</span>
      </a>
      <nav class="nav-menu">
        <a href="/">Home</a>
        <a href="#">Features</a>
        <a href="#">Blog</a>
        <a href="#">About</a>
        <a href="#" style="background:var(--primary); color:white; padding:8px 18px; border-radius:50px;">Contact</a>
      </nav>
    </div>
  </header>
`;
var renderHero = (ctx) => `
  <section class="hero-section">
    <div class="container">
      <h1 class="hero-title">Bangun Web Impian dengan LabMu</h1>
      <p class="hero-subtitle">Tema profesional dengan desain modern, cepat, dan mudah disesuaikan. Cocok untuk blog, portofolio, dan bisnis.</p>
      <a href="#" class="btn-hero">Mulai Sekarang &rarr;</a>
    </div>
  </section>
`;
var renderSidebar = (posts) => `
  <aside>
    <div class="widget">
      <div style="text-align:center;">
        <img src="https://ui-avatars.com/api/?name=Admin+LabMu&background=random" style="width:80px; height:80px; border-radius:50%; margin:0 auto 15px;">
        <h4 style="margin:0;">Admin LabMu</h4>
        <p style="font-size:0.9rem; color:#64748b; margin-top:5px;">Web Developer & Content Creator.</p>
      </div>
    </div>

    <div class="widget">
      <h4 class="widget-title">Terpopuler</h4>
      <ul class="widget-list">
        ${posts.slice(0, 3).map((p) => `
          <li>
            <img src="${p.featured_image || "https://via.placeholder.com/150"}" class="mini-thumb">
            <div>
              <a href="/${p.slug}" style="font-weight:600; line-height:1.2; display:block; font-size:0.9rem;">${p.title}</a>
              <small style="color:#94a3b8;">${new Date(p.created_at).toLocaleDateString()}</small>
            </div>
          </li>
        `).join("")}
      </ul>
    </div>

    <div class="widget">
      <h4 class="widget-title">Tags</h4>
      <div style="display:flex; flex-wrap:wrap; gap:5px;">
         <span style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Teknologi</span>
         <span style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Coding</span>
         <span style="background:#f1f5f9; padding:5px 10px; border-radius:4px; font-size:12px;">Bisnis</span>
      </div>
    </div>
  </aside>
`;
var renderFooter = (ctx) => `
  <footer class="pro-footer">
    <div class="container">
      <div class="grid-3 footer-grid">
        <div class="footer-col">
           <h4>Tentang Kami</h4>
           <p style="opacity:0.8; font-size:0.95rem;">${ctx.site.description}</p>
        </div>
        <div class="footer-col">
           <h4>Quick Links</h4>
           <ul class="widget-list footer-links" style="border:none;">
              <li><a href="/">Home</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
           </ul>
        </div>
        <div class="footer-col">
           <h4>Newsletter</h4>
           <p style="margin-bottom:15px; font-size:0.9rem;">Dapatkan update terbaru.</p>
           <input placeholder="Email Anda..." style="width:100%; padding:10px; border-radius:4px; border:none; margin-bottom:10px;">
           <button style="width:100%; padding:10px; background:var(--primary); color:white; border:none; border-radius:4px; cursor:pointer;">Subscribe</button>
        </div>
      </div>
      <div class="footer-bottom">
         &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} ${ctx.site.title}. All rights reserved. Built with LabMu CMS.
      </div>
    </div>
  </footer>
`;
//#endregion
//#region src/cms/themes/labmu-pro/index.ts
var LabMuPro = {
	name: "LabMu Pro",
	version: "2.1.0",
	author: "LabMu Team",
	_layout(content, title, ctx, layoutType = "layout-right-sidebar") {
		let sidebarData = [];
		if (ctx.sidebarPosts && Array.isArray(ctx.sidebarPosts)) sidebarData = ctx.sidebarPosts;
		else if (Array.isArray(ctx.data)) sidebarData = ctx.data;
		return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${ctx.site.title}</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>${css$2}</style>
      </head>
      <body>
        ${renderHeader$2(ctx)}
        
        ${layoutType === "home" ? renderHero(ctx) : ""}

        <div class="container main-wrapper ${layoutType === "home" ? "layout-right-sidebar" : layoutType}">
          <main>
            ${content}
          </main>

          ${layoutType !== "layout-full" ? renderSidebar(sidebarData) : ""}

        </div>

        ${renderFooter(ctx)}
      </body>
      </html>
    `;
	},
	renderHome(ctx) {
		const posts = ctx.data || [];
		let html = "";
		if (posts.length === 0) html = "<div style=\"text-align:center; padding:50px;\">Belum ada konten.</div>";
		else html = `<div class="grid-2">
        ${posts.map((p) => `
          <article class="post-card">
            <a href="/${p.slug}">
              <img src="${p.featured_image || "https://placehold.co/600x400/eee/ccc?text=No+Image"}" class="post-thumb" alt="${p.title}">
            </a>
            <div class="post-content">
              
              <span class="post-tag">${p.category || p.type}</span>
              
              <h2 class="post-title"><a href="/${p.slug}">${p.title}</a></h2>
              <p class="post-excerpt">${(p.body || "").replace(/<[^>]*>?/gm, "").substring(0, 100)}...</p>
              
              <div class="post-meta">
                <span><i class="far fa-calendar"></i> ${new Date(p.created_at).toLocaleDateString()}</span>
                
                ${p.tags ? `<span style="margin-left:auto; font-size:11px; color:#2563eb;">#${p.tags.split(",")[0]}</span>` : ""}
              </div>
            </div>
          </article>
        `).join("")}
      </div>`;
		return this._layout(html, "Beranda", ctx, "home");
	},
	renderSingle(ctx) {
		const post = ctx.data;
		const tagsHtml = post.tags ? post.tags.split(",").map((t) => `<span style="background:#f1f5f9; padding:4px 10px; border-radius:4px; font-size:13px; margin-right:5px; display:inline-block; color:#475569;">#${t.trim()}</span>`).join("") : "";
		const html = `
      <article>
        <div class="entry-header">
           <span style="color:var(--primary); font-weight:bold; text-transform:uppercase; letter-spacing:1px; font-size:0.9rem;">
              ${post.category || post.type}
           </span>
           
           <h1 class="entry-title">${post.title}</h1>
           <div style="color:#64748b;">
              Ditulis oleh <b>Admin</b> pada ${new Date(post.created_at).toLocaleDateString("id-ID", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		})}
           </div>
        </div>

        ${post.featured_image ? `<img src="${post.featured_image}" class="entry-image">` : ""}

        <div class="entry-content">
          ${post.body || "<p>Isi konten belum ditulis...</p>"}
        </div>

        ${tagsHtml ? `
          <div style="margin-top:40px; padding-top:20px; border-top:1px solid #eee;">
             <strong style="margin-right:10px; color:#333;">Tags:</strong> ${tagsHtml}
          </div>
        ` : ""}

        <div style="margin-top:30px; padding:30px; background:#f1f5f9; border-radius:10px; text-align:center;">
           <h3>Suka artikel ini?</h3>
           <p>Bagikan ke teman-temanmu agar mereka juga mendapatkan manfaatnya.</p>
           <button class="btn-hero" style="font-size:0.9rem; padding:10px 20px;">Share Article</button>
        </div>
      </article>
    `;
		return this._layout(html, post.title, ctx, "layout-right-sidebar");
	},
	renderPage(ctx) {
		return this.renderSingle(ctx);
	},
	render404(ctx) {
		return this._layout(`
      <div style="text-align:center; padding: 100px 0;">
        <h1 style="font-size:5rem; color:var(--primary);">404</h1>
        <p style="font-size:1.5rem;">Halaman Hilang Ditelan Bumi</p>
        <a href="/" class="btn-hero" style="margin-top:20px;">Kembali ke Home</a>
      </div>
    `, "Not Found", ctx, "layout-full");
	}
};
//#endregion
//#region src/cms/themes/labmu-quran/header.ts
function renderHeader$1(ctx) {
	return `
    <header class="header-wrapper">
      <div class="header-inner">
        
        <a href="https://khgt.muhammadiyah.or.id" target="_blank" id="hijri-badge-desktop" class="hijri-badge desktop-only" title="Cek Kalender KHGT">
          Loading...
        </a>

        <a href="/" class="brand-logo" style="font-family:'Amiri', serif;">
          QuranMu
        </a>

        <div class="header-right">
          
          <div class="header-desktop">
            <div class="custom-dropdown">
              <div class="dropdown-trigger" onclick="toggleQariMenu()">
                <span id="qari-label-desktop">Qari</span>
                <i class="fas fa-chevron-down" style="font-size:0.7rem"></i>
              </div>
              <div class="dropdown-content" id="qari-list">
                <a class="dropdown-item" onclick="selectQari('01', 'Abdullah Al-Juhany')">Abdullah Al-Juhany</a>
                <a class="dropdown-item" onclick="selectQari('02', 'Abdul Muhsin Al-Qasim')">Abdul Muhsin Al-Qasim</a>
                <a class="dropdown-item" onclick="selectQari('03', 'Abdurrahman As-Sudais')">Abdurrahman As-Sudais</a>
                <a class="dropdown-item" onclick="selectQari('04', 'Ibrahim Al-Akhdar')">Ibrahim Al-Akhdar</a>
                <a class="dropdown-item" onclick="selectQari('05', 'Misyari Rasyid')">Misyari Rasyid</a>
              </div>
            </div>
             
            <button class="btn-icon-head" id="btn-latin" onclick="toggleMode('latin')" title="Transliterasi Latin">
              <i class="fas fa-font"></i>
            </button>
            <button class="btn-icon-head" id="btn-id" onclick="toggleMode('id')" title="Terjemahan Indonesia">
              🇮🇩
            </button>
            <button class="btn-icon-head" id="btn-en" onclick="toggleMode('en')" title="Terjemahan Inggris">
              🇬🇧
            </button>
            <button class="btn-icon-head" id="btn-tajwid" onclick="window.toggleMode('tajwid')" title="Warna Tajwid">
            <i class="fas fa-palette"></i>
            </button>
            <button class="btn-icon-head" onclick="toggleMode('theme')" title="Mode Gelap">
              <i class="fas fa-adjust"></i>
            </button>
          </div>


          <button class="burger-btn" onclick="toggleSidebar()">
            <i class="fas fa-bars"></i>
          </button>

        </div>
      </div>
    </header>

    <div id="mobile-sidebar" class="sidebar-menu">
      <div class="sidebar-header">
        <span style="font-weight:bold; font-size:1.2rem;">Menu</span>
        <button onclick="toggleSidebar()" style="background:none; border:none; font-size:1.5rem; color:var(--text-main);">
          <i class="fas fa-times"></i>
        </button>
      </div>
        
      <div class="sidebar-content">
        <div class="sidebar-group">
          <div id="hijri-badge-mobile" class="sidebar-calendar-box">Loading...</div>
        </div>

        <div class="sidebar-group">
          <label>Pilih Qari</label>
          <select id="qari-select-mobile" onchange="selectQariMobile(this.value)" class="mobile-select">
            <option value="05" selected>Misyari Rasyid</option>
            <option value="01">Abdullah Al-Juhany</option>
            <option value="02">Abdul Muhsin Al-Qasim</option>
            <option value="03">Abdurrahman As-Sudais</option>
            <option value="04">Ibrahim Al-Akhdar</option>
          </select>
        </div>
            
        <div class="sidebar-group">
          <label>Tampilan Bahasa</label>
          <div style="display:flex; gap:10px;">
            <button class="btn-sidebar-toggle" id="btn-latin-m" onclick="toggleMode('latin')">
              <i class="fas fa-font"></i> Latin
            </button>
            <button class="btn-sidebar-toggle" id="btn-id-m" onclick="toggleMode('id')">
              🇮🇩 Indo
            </button>
            <button class="btn-sidebar-toggle" id="btn-en-m" onclick="toggleMode('en')">
              🇬🇧 Inggris
            </button>
          </div>
        </div>
            
        <div class="sidebar-group">
          <label>Tema</label>
          <button class="btn-sidebar-block" onclick="toggleMode('theme')">
            <i class="fas fa-adjust"></i> Ganti Mode Gelap/Terang
          </button>
        </div>
      </div>
    </div>

    <div id="sidebar-overlay" class="sidebar-overlay" onclick="toggleSidebar()"></div>
  `;
}
//#endregion
//#region src/cms/themes/labmu-quran/pages.ts
var slugify = (text) => {
	return (text || "").toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
};
var applyTajwid = (text) => {
	if (!text) return "";
	if (text.includes("[") && text.includes("]")) return text.replace(/\[([a-z]+)(?::\d+)?\[([^\]]+)\]/g, (match, code, content) => {
		let color = "";
		switch (code) {
			case "n":
				color = "#2ecc71";
				break;
			case "q":
				color = "#e74c3c";
				break;
			case "m":
			case "p":
				color = "#9b59b6";
				break;
			case "l":
			case "h":
				color = "#f1c40f";
				break;
			default: color = "#3498db";
		}
		return `<span style="color:${color}; font-weight:bold;">${content}</span>`;
	});
	let res = text;
	res = res.replace(/([\u0646\u0645]\u0651)/g, "<span style=\"color:#2ecc71; font-weight:bold;\">$1</span>");
	res = res.replace(/([\u0628\u062C\u062F\u0637\u0642]\u0652)/g, "<span style=\"color:#e74c3c; font-weight:bold;\">$1</span>");
	res = res.replace(/(اللّٰه|الله|لِلّٰهِ)/g, "<span style=\"color:#f1c40f; font-weight:bold;\">$1</span>");
	return res;
};
var safeAttr = (str) => (str || "").replace(/"/g, "&quot;");
var pad3 = (num) => String(num).padStart(3, "0");
var QARI_MAP = {
	"01": "Abdullah-Al-Juhany",
	"02": "Abdul-Muhsin-Al-Qasim",
	"03": "Abdurrahman-as-Sudais",
	"04": "Ibrahim-Al-Dossari",
	"05": "Misyari-Rasyid-Al-Afasi"
};
var renderHome$1 = (ctx, _layout) => {
	return _layout(`
      <div style="text-align:center; padding:30px 0;">
        <h1 style="font-family:'Amiri', serif; font-size:2.8rem; color:var(--primary); margin:0;">Al-Quran Digital</h1>
      </div>
      <div style="position:relative; margin-bottom:30px; z-index:10;">
        <input type="text" id="searchBox" placeholder="Cari surat..." class="search-box" onkeyup="window.handleSearch(event)" autocomplete="off">
        <i class="fas fa-search" style="position:absolute; right:15px; top:18px; color:#ccc;"></i>
      </div>
      <div class="surat-grid">
        ${(Array.isArray(ctx.data) ? ctx.data : []).map((s) => `
              <a href="/${slugify(s.namaLatin)}" class="surat-card" data-name="${(s.namaLatin || "").toLowerCase()}">
                <div class="nomor-surat">${s.nomor}</div>
                <div style="flex:1;">
                  <div style="font-weight:bold;">${s.namaLatin}</div>
                  <div style="font-size:0.85rem; color:var(--text-muted);">${s.arti || ""}</div>
                </div>
                <div style="font-family:'Amiri', serif; font-size:1.4rem; color:var(--primary);">${s.nama || s.nama_arab}</div>
              </a>`).join("")}
      </div>`, "Beranda", ctx);
};
var renderSearch$1 = (results, keyword, ctx, _layout) => {
	return _layout(`
      <div style="padding: 10px 0;">
        <div style="background:var(--bg-card); padding:20px; border-radius:15px; margin-bottom:30px; border-left:5px solid var(--primary);">
            <h2 style="margin:0;">Hasil Pencarian</h2><p>Kata kunci: <b>"${keyword}"</b> (${results.length} hasil)</p>
        </div>
        <div class="search-results-list">
          ${results.map((a) => `
            <div class="search-item" style="background:var(--bg-card); padding:25px; border-radius:15px; margin-bottom:20px; border:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                  <b>QS. ${a.surah_id}:${a.nomor_ayat}</b>
                  <a href="/${slugify(a.nama_latin)}#ayat-${a.nomor_ayat}" style="color:#fff; background:var(--primary); padding:6px 15px; border-radius:20px; text-decoration:none; font-size:0.8rem;">Buka &rarr;</a>
              </div>
              <div class="ayat-arab" dir="rtl" style="text-align:right;">${applyTajwid(a.teks_arab)}</div>
              <div style="margin-top:15px;">"${a.teks_indonesia}"</div>
            </div>`).join("")}
        </div>
      </div>`, `Cari: ${keyword}`, ctx);
};
var renderSingle$1 = (ctx, _layout) => {
	const s = ctx.data;
	if (!s || !s.ayat) return _layout("Not Found", "Error", ctx);
	const namaLatin = s.namaLatin || s.nama_latin || "Surat";
	const safeNama = safeAttr(namaLatin);
	const nomorSurat = parseInt(s.nomor || "1");
	let fullAudioAttrs = "";
	let fullDefaultUrl = "";
	for (const [code, qariName] of Object.entries(QARI_MAP)) {
		const url = `https://cdn.equran.id/audio-full/${qariName}/${pad3(nomorSurat)}.mp3`;
		fullAudioAttrs += ` data-url-${code}="${url}"`;
		if (code.startsWith("0")) fullAudioAttrs += ` data-url-${code.substring(1)}="${url}"`;
		if (code === "05") fullDefaultUrl = url;
	}
	const playAllBtn = `<button onclick="window.playAyat(this)" ${fullAudioAttrs} data-audio-default="${fullDefaultUrl}" data-title="Full Surat ${safeNama}" style="margin-top:15px; padding:10px 20px; border:1px solid var(--primary); background:var(--bg-card); color:var(--primary); border-radius:30px; cursor:pointer; font-weight:bold;"><i class="fas fa-play"></i> Putar Full Surat</button>`;
	const ayatListHtml = s.ayat.map((a) => {
		const nomer = parseInt(a.nomorAyat || a.nomor_ayat || "0");
		const fileID = `${pad3(nomorSurat)}${pad3(nomer)}.mp3`;
		const arabPolos = a.teksArab || a.teks_arab;
		let arabTajwid = a.teksTajwid || a.teks_tajwid;
		if (arabTajwid) arabTajwid = applyTajwid(arabTajwid);
		else arabTajwid = applyTajwid(arabPolos);
		let ayatAttrs = "";
		let ayatDefaultUrl = "";
		for (const [code, qariName] of Object.entries(QARI_MAP)) {
			const url = `https://cdn.equran.id/audio-partial/${qariName}/${fileID}`;
			ayatAttrs += ` data-url-${code}="${url}"`;
			if (code.startsWith("0")) ayatAttrs += ` data-url-${code.substring(1)}="${url}"`;
			if (code === "05") ayatDefaultUrl = url;
		}
		return `
        <div class="ayat-item" id="ayat-${nomer}">
          <div class="ayat-meta-top">
              <span class="ayat-badge">${nomer}</span>
              <div class="ayat-actions">
                  <div class="share-wrapper" style="position:relative; display:inline-block;">
                      <button class="btn-action" onclick="window.labmu_toggleShare('${nomer}')" title="Bagikan"><i class="fas fa-share-alt"></i></button>
                      <div class="share-popover" id="share-pop-${nomer}">
                          <div onclick="window.labmu_doShare(this)" data-type="wa" data-id="${nomer}" class="share-link"><i class="fab fa-whatsapp" style="color:#25D366; width:25px;"></i> WhatsApp</div>
                          <div onclick="window.labmu_doShare(this)" data-type="fb" data-id="${nomer}" class="share-link"><i class="fab fa-facebook" style="color:#1877F2; width:25px;"></i> Facebook</div>
                          <div onclick="window.labmu_doShare(this)" data-type="x" data-id="${nomer}" class="share-link"><i class="fab fa-twitter" style="color:#000; width:25px;"></i> X / Twitter</div>
                          <div onclick="window.labmu_doShare(this)" data-type="tele" data-id="${nomer}" class="share-link"><i class="fab fa-telegram" style="color:#0088cc; width:25px;"></i> Telegram</div>
                          <div onclick="window.labmu_doShare(this)" data-type="copy" data-id="${nomer}" class="share-link"><i class="fas fa-copy" style="color:#555; width:25px;"></i> Salin Link</div>
                      </div>
                  </div>
                  <button class="btn-action" onclick="window.labmu_openTafsir('${nomer}', '${nomorSurat}')" title="Baca Tafsir"><i class="fas fa-book-open"></i></button>
                  <button class="btn-action" onclick="window.playAyat(this)" ${ayatAttrs} data-audio-default="${ayatDefaultUrl}" data-title="${safeNama}:${nomer}"><i class="fas fa-play"></i></button>
              </div>
          </div>
          
          <div class="ayat-arab-container" dir="rtl" style="text-align:right; font-family:'Amiri', serif; font-size:2.2rem; line-height:2.5; margin: 15px 0 25px 0;">
              <span class="arab-plain">${arabPolos}</span>
              <span class="arab-colored" style="display:none;">${arabTajwid}</span>
          </div>

          <div class="trans-block trans-latin">${a.teksLatin || a.teks_latin || ""}</div>
          <div class="trans-block trans-id" id="terjemahan-${nomer}">${a.teksIndonesia || a.teks_indonesia}</div>
          <div class="trans-block trans-en">${a.teksInggris || a.teks_inggris || ""}</div>
          
          <input type="hidden" id="meta-surat-${nomer}" value="${safeNama}">
          <input type="hidden" id="text-ayat-${nomer}" value="${safeAttr(arabPolos)}">
          <input type="hidden" id="text-indo-${nomer}" value="${safeAttr(a.teksIndonesia || a.teks_indonesia)}">
        </div>`;
	}).join("");
	const modalHtml = `
    <div id="tafsir-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:9999; align-items:center; justify-content:center;">
        <div style="background:var(--bg-card); width:90%; max-width:600px; max-height:80vh; border-radius:15px; display:flex; flex-direction:column; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <div style="padding:15px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div><h3 style="margin:0; font-size:1.2rem; color:var(--primary);">Tafsir QS. ${safeNama}</h3><span id="tafsir-ayat-badge" style="font-size:0.85rem; opacity:0.7;">Ayat ...</span></div>
                <button onclick="window.labmu_closeTafsir()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--text-main);">&times;</button>
            </div>
            <div style="padding:10px 20px; background:var(--bg-main);">
                <select id="select-tafsir-source" onchange="window.labmu_fetchTafsirData()" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text-main); font-size:1rem;">
                    <option value="ibnukatsir" selected>Tafsir Ibnu Katsir (Default)</option>
                    <option value="attanwir">Tafsir At-Tanwir</option>
                    <option value="kemenag">Kemenag (Tahlili/Lengkap)</option>
                </select>
            </div>
            <div id="tafsir-content-area" style="padding:20px; overflow-y:auto; line-height:1.8; font-size:1rem; color:var(--text-main);">
                <div id="tafsir-loading" style="display:none; text-align:center; padding:20px;">
                    <i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--primary);"></i><p>Memuat Tafsir...</p>
                </div>
                <div id="tafsir-text"></div>
            </div>
            <div style="padding:15px 20px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px;">
                <button onclick="window.labmu_copyTafsir()" style="padding:8px 20px; background:var(--bg-main); color:var(--text-main); border:1px solid var(--border); border-radius:20px; cursor:pointer;"><i class="fas fa-copy"></i> Salin Tafsir</button>
                <button onclick="window.labmu_closeTafsir()" style="padding:8px 20px; background:var(--primary); color:#fff; border:none; border-radius:20px; cursor:pointer;">Tutup</button>
            </div>
        </div>
    </div>
    
    <style>
        .show-tajwid .ayat-arab { color: #555; }
        .show-tajwid .ayat-arab span { font-weight:bold; }
        .share-wrapper { position: relative; display: inline-block; }
        .share-popover {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background: var(--bg-card, #fff);
            border: 1px solid var(--border, #ddd);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            padding: 5px 0;
            z-index: 99999;
            min-width: 180px;
            text-align: left;
        }
        .share-link {
            padding: 12px 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 0.95rem;
            color: var(--text-main, #333);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            transition: background 0.2s;
        }
        .share-link:hover { background: var(--bg-main, #f5f5f5); }
    </style>

    <script>
    // DEFINE STATE
    window.tafsirCache = {}; 
    window.currentTafsirState = { surah: 0, ayat: 0 };

    // --- 1. TAFSIR (Unique Name) ---
    window.labmu_openTafsir = function(ayatNum, surahNum) {
        var modal = document.getElementById('tafsir-modal');
        if(modal) {
            modal.style.display = 'flex';
            document.getElementById('tafsir-ayat-badge').innerText = 'Ayat ' + ayatNum;
            document.body.style.overflow = 'hidden';
            window.currentTafsirState = { surah: surahNum, ayat: ayatNum };
            var sel = document.getElementById('select-tafsir-source'); if(sel) sel.value = 'ibnukatsir';
            window.labmu_fetchTafsirData();
        }
    };

    window.labmu_fetchTafsirData = function() {
        var source = document.getElementById('select-tafsir-source').value;
        var state = window.currentTafsirState;
        var cacheKey = source + '_' + state.surah;
        if (window.tafsirCache[cacheKey]) { window.labmu_renderTafsir(window.tafsirCache[cacheKey]); return; }

        document.getElementById('tafsir-text').style.display = 'none';
        document.getElementById('tafsir-loading').style.display = 'block';

        fetch('/api/quran/data-tafsir/' + state.surah + '?source=' + source)
            .then(r => r.json())
            .then(data => {
                window.tafsirCache[cacheKey] = data;
                window.labmu_renderTafsir(data);
            })
            .catch(err => {
                document.getElementById('tafsir-loading').style.display = 'none';
                document.getElementById('tafsir-text').style.display = 'block';
                document.getElementById('tafsir-text').innerHTML = '<span style="color:red;">Gagal memuat tafsir.</span>';
            });
    };

    window.labmu_renderTafsir = function(data) {
        var state = window.currentTafsirState;
        document.getElementById('tafsir-loading').style.display = 'none';
        document.getElementById('tafsir-text').style.display = 'block';
        if (!data || !data.data || data.data.length === 0) {
            var msg = '<i>Data untuk <b>' + (data.sumber || 'tafsir ini') + '</b> belum tersedia.</i>';
            if (data.sumber && (data.sumber.includes('Ibnu Katsir') || data.sumber.includes('At-Tanwir'))) { msg += '<br><br><small style="opacity:0.7">*Silakan pilih "Kemenag (Tahlili)" untuk data lengkap.</small>'; }
            document.getElementById('tafsir-text').innerHTML = msg;
            return;
        }
        var ayatData = data.data.find(d => d.ayat == state.ayat);
        if (ayatData) { document.getElementById('tafsir-text').innerHTML = '<b>' + (data.sumber || 'Tafsir') + ':</b><br><br>' + ayatData.teks; } 
        else { document.getElementById('tafsir-text').innerHTML = '<i>Tafsir untuk ayat ini tidak ditemukan.</i>'; }
    };

    window.labmu_copyTafsir = function() {
        var text = document.getElementById('tafsir-text').innerText;
        window.labmu_forceCopy(text);
    };

    window.labmu_closeTafsir = function() {
        document.getElementById('tafsir-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // --- 2. SHARE (Unique Name & Logic) ---
    window.labmu_toggleShare = function(id) {
        var el = document.getElementById('share-pop-' + id);
        document.querySelectorAll('.share-popover').forEach(p => { 
            if(p.id !== 'share-pop-' + id) p.style.display = 'none'; 
        });
        if(el) el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    };

    window.addEventListener('click', function(e) {
        if (!e.target.closest('.btn-action') && !e.target.closest('.share-popover')) {
            document.querySelectorAll('.share-popover').forEach(p => p.style.display = 'none');
        }
    });

    window.labmu_forceCopy = function(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => alert('Berhasil disalin!'))
            .catch(() => alert('Gagal copy otomatis.'));
        } else {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); alert('Berhasil disalin (manual)!'); } 
            catch (err) { alert('Gagal menyalin.'); }
            document.body.removeChild(textArea);
        }
    };

    window.labmu_doShare = function(el) {
        try {
            var type = el.getAttribute('data-type');
            var id = el.getAttribute('data-id');
            var elSurat = document.getElementById('meta-surat-' + id);
            var elArab = document.getElementById('text-ayat-' + id);
            var elIndo = document.getElementById('text-indo-' + id);

            if (!elSurat) { alert('Error: Data surat tidak terbaca.'); return; }

            var surat = elSurat.value;
            var arab = elArab ? elArab.value : '';
            var indo = elIndo ? elIndo.value : '';
            var url = window.location.href.split('#')[0] + '#ayat-' + id;
            var textRaw = 'QS. ' + surat + ':' + id + '\\n' + arab + '\\n' + indo + '\\n\\nLink: ' + url;
            var encodedText = encodeURIComponent(textRaw);
            var encodedUrl = encodeURIComponent(url);

            if (type === 'wa') window.open('https://wa.me/?text=' + encodedText, '_blank');
            else if (type === 'fb') window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl, '_blank');
            else if (type === 'x') window.open('https://twitter.com/intent/tweet?text=' + encodedText, '_blank');
            else if (type === 'tele') window.open('https://t.me/share/url?url=' + encodedUrl + '&text=' + encodedText, '_blank');
            else if (type === 'copy') window.labmu_forceCopy('QS. ' + surat + ':' + id + '\\n' + arab + '\\n' + indo + '\\nLink: ' + url);
            
            document.getElementById('share-pop-' + id).style.display = 'none';
        } catch(e) { alert('Error System: ' + e.message); }
    };
    <\/script>
    `;
	return _layout(`
      <div style="text-align:center; padding:10px 0 25px; border-bottom: 1px solid var(--border); margin-bottom: 30px;">
          <h1 style="font-size:2.5rem; color:var(--primary); margin:0; font-family: 'Amiri', serif;">${namaLatin}</h1>
          <p style="color:var(--text-muted); font-size: 1.1rem;">${s.arti || ""} • ${s.jumlahAyat || s.jumlah_ayat} Ayat • ${s.tempatTurun || s.tempat_turun}</p>
          ${playAllBtn}
      </div>
      <div class="ayat-container">${ayatListHtml}</div>
      <div style="display:flex; justify-content:space-between; padding:40px 0; border-top: 1px solid var(--border); margin-top: 50px;">
          ${s.suratSebelumnya ? `<a href="/${slugify(s.suratSebelumnya.namaLatin || s.suratSebelumnya.nama_latin)}" class="surat-card" style="padding:12px 25px; text-decoration:none; background:var(--bg-card); border-radius:10px; border:1px solid var(--border); color:var(--text-main);">&larr; ${s.suratSebelumnya.namaLatin || s.suratSebelumnya.nama_latin}</a>` : "<div></div>"}
          ${s.suratSelanjutnya ? `<a href="/${slugify(s.suratSelanjutnya.namaLatin || s.suratSelanjutnya.nama_latin)}" class="surat-card" style="padding:12px 25px; text-decoration:none; background:var(--bg-card); border-radius:10px; border:1px solid var(--border); color:var(--text-main);">${s.suratSelanjutnya.namaLatin || s.suratSelanjutnya.nama_latin} &rarr;</a>` : "<div></div>"}
      </div>
      ${modalHtml}
    `, namaLatin, ctx);
};
//#endregion
//#region src/cms/themes/labmu-quran/scripts.ts
var clientScripts = `
<div id="toast" style="visibility:hidden; min-width:200px; background:#333; color:#fff; text-align:center; border-radius:8px; padding:10px; position:fixed; z-index:9999; left:50%; bottom:90px; transform:translateX(-50%); opacity:0; transition:0.3s;">Copied!</div>

<style>
    /* UTILS UI */
    .trans-latin, .trans-id, .trans-en { display: none; }
    
    /* Control Display via Body Class */
    body.show-latin .trans-latin { display: block; }
    body.show-id .trans-id { display: block; }
    body.show-en .trans-en { display: block; }
    
    /* Tombol Aktif */
    .btn-icon-head.active { background: var(--primary); color: #fff; border-color: var(--primary); }
    /* Sidebar Toggle Aktif */
    .btn-sidebar-toggle.active { background: var(--primary); color: #fff; border: 1px solid var(--primary); }
</style>

<script>
// --- 1. STATE MANAGEMENT ---
window.state = {
    dark: localStorage.getItem('dark') === 'true',
    latin: localStorage.getItem('show_latin') !== 'false',
    id: localStorage.getItem('show_id') !== 'false',
    en: localStorage.getItem('show_en') === 'true',
    tajwid: localStorage.getItem('show_tajwid') === 'true', // [BARU] State Tajwid
    qari: localStorage.getItem('qari') || '05',
    qariName: localStorage.getItem('qariName') || 'Misyari Rasyid'
};

// --- 2. UPDATE UI (CORE LOGIC) ---
window.updateUI = function() {
    // A. Mode Gelap
    document.body.classList.toggle('dark', window.state.dark);
    var btnTheme = document.getElementById('btn-theme');
    if(btnTheme) { 
        btnTheme.innerHTML = window.state.dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; 
        btnTheme.classList.toggle('active', window.state.dark); 
    }

    // B. Toggle Bahasa (Latin, Indo, Inggris)
    ['latin', 'id', 'en'].forEach(function(k) {
        document.body.classList.toggle('show-' + k, window.state[k]);
        
        // Update Tombol Header
        var btn = document.getElementById('btn-' + k); 
        if(btn) btn.classList.toggle('active', window.state[k]);
        
        // Update Tombol Sidebar (Mobile)
        var btnMob = document.getElementById('btn-' + k + '-m');
        if(btnMob) btnMob.classList.toggle('active', window.state[k]);
    });

    // C. [BARU] Logika Toggle Tajwid
    var isTajwid = window.state.tajwid;
    
    // Update Tombol Tajwid (Header & Mobile)
    var btnTajwid = document.getElementById('btn-tajwid');
    if(btnTajwid) btnTajwid.classList.toggle('active', isTajwid);
    
    // Switch Tampilan Arab
    document.querySelectorAll('.ayat-item').forEach(function(el) {
        var plain = el.querySelector('.arab-plain');
        var colored = el.querySelector('.arab-colored');
        
        if(plain && colored) {
            if(isTajwid) {
                plain.style.display = 'none';
                colored.style.display = 'block';
            } else {
                plain.style.display = 'block';
                colored.style.display = 'none';
            }
        }
    });

    // D. Update Label Qari
    var qLabel = document.getElementById('qari-label-desktop');
    if(qLabel) qLabel.innerText = window.state.qariName.split(' ')[0];
};

// --- 3. EVENT HANDLERS ---
window.toggleMode = function(key) {
    if(key === 'theme') { 
        window.state.dark = !window.state.dark; 
        localStorage.setItem('dark', window.state.dark); 
    }
    else { 
        window.state[key] = !window.state[key]; 
        localStorage.setItem('show_' + key, window.state[key]); 
    }
    window.updateUI();
};

// --- KALENDER HIJRIYAH ---
function getHijriString() {
    var today = new Date(); var m = today.getMonth()+1; var y = today.getFullYear(); var d = today.getDate();
    if (m < 3) { y -= 1; m += 12; }
    var a = Math.floor(y / 100); var b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    var jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
    var b = 0; if (jd > 2299160) { var a = Math.floor((jd - 1867216.25) / 36524.25); b = 1 + a - Math.floor(a / 4); }
    var bb = jd + b + 1524; var cc = Math.floor((bb - 122.1) / 365.25); var dd = Math.floor(365.25 * cc);
    var ee = Math.floor((bb - dd) / 30.6001); var day = (bb - dd) - Math.floor(30.6001 * ee);
    var month = ee - 1; if (ee > 13) { cc += 1; month = ee - 13; }
    var year = cc - 4716; var iy = 30 * Math.floor((jd - 1948084) / 10631.0) + Math.floor(((jd - 1948084) % 10631.0 - 8.01/60.0) / (10631.0/30.0));
    var im = Math.floor((((jd - 1948084) % 10631.0) - Math.floor(Math.floor(((jd - 1948084) % 10631.0 - 8.01/60.0) / (10631.0/30.0)) * (10631.0/30.0)) + 28.5001) / 29.5);
    if (im == 13) im = 12; var id = ((jd - 1948084) % 10631.0) - Math.floor(Math.floor(((jd - 1948084) % 10631.0 - 8.01/60.0) / (10631.0/30.0)) * (10631.0/30.0)) - Math.floor(29.5001 * im - 29);
    var adjustment = -1; 
    var finalDay = id + adjustment;
    var monthNames = ["Muharram","Safar","Rabi'ul Awal","Rabi'ul Akhir","Jumadil Awal","Jumadil Akhir","Rajab","Syakban","Ramadhan","Syawal","Dzulkaidah","Dzulhijjah"];
    return finalDay + " " + monthNames[im - 1] + " " + iy;
}

window.updateHijriDate = function() {
     try {
        var h = getHijriString();
        var t = new Date();
        var m = t.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
        var bD = document.getElementById('hijri-badge-desktop');
        var bM = document.getElementById('hijri-badge-mobile');
        var html = '<div style="display:flex; flex-direction:column; line-height:1.2; text-align:right;"><span style="font-weight:bold; font-size:0.85rem;">' + h + ' H</span><span style="font-size:0.75rem; opacity:0.8;">' + m + '</span></div>';
        if(bD) bD.innerHTML = html;
        if(bM) bM.innerHTML = html;
    } catch(e) {}
};

window.showToast = function(msg) { 
    var x = document.getElementById("toast"); 
    if (!x) {
        x = document.createElement("div"); x.id = "toast";
        x.style.cssText = "visibility:hidden; min-width:200px; background:#333; color:#fff; text-align:center; border-radius:8px; padding:10px; position:fixed; z-index:9999; left:50%; bottom:90px; transform:translateX(-50%); opacity:0; transition:0.3s;";
        document.body.appendChild(x);
    }
    x.innerText = msg; x.style.visibility = "visible"; x.style.opacity = "1"; 
    setTimeout(() => { x.style.visibility = "hidden"; x.style.opacity = "0"; }, 2000); 
};

window.toggleQariMenu = function() {
    var list = document.getElementById('qari-list');
    if (list) list.style.display = (list.style.display === 'block') ? 'none' : 'block';
};

window.selectQari = function(val, name) {
    window.state.qari = val; window.state.qariName = name;
    localStorage.setItem('qari', val); localStorage.setItem('qariName', name);
    window.updateUI();
    var list = document.getElementById('qari-list'); if(list) list.style.display = 'none';
    window.showToast('Qari diganti: ' + name);
    setTimeout(function() { location.reload(); }, 300);
};

window.toggleSidebar = function() {
    document.getElementById('mobile-sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
};

// --- AUDIO PLAYER ---
window.playAyat = function(btn) {
    var qari = window.state.qari || '05';
    var url = btn.getAttribute('data-url-' + qari);
    if (!url && qari.startsWith('0')) { url = btn.getAttribute('data-url-' + qari.replace(/^0+/, '')); }
    if (!url) url = btn.getAttribute('data-audio-default');

    var title = btn.getAttribute('data-title') || 'Audio Player';
    var player = document.getElementById('main-player');
    var container = document.getElementById('player-container');

    player.pause(); player.currentTime = 0; player.src = ""; 

    if (url && url.length > 10) { 
        container.style.display = 'flex';
        document.getElementById('player-title').innerText = title + ' (' + window.state.qariName + ')';
        player.src = url;
        player.load(); 
        var playPromise = player.play();
        if (playPromise !== undefined) {
            playPromise.catch(function(error) { window.showToast("Gagal memuat audio"); });
        }
    } else {
        container.style.display = 'none';
        window.showToast('Audio ayat ini belum tersedia');
    }
};

window.closePlayer = function() { 
    var p = document.getElementById('main-player'); if(p) p.pause(); 
    document.getElementById('player-container').style.display='none'; 
};

// --- SHARE ---
window.shareAyat = function(platform, ayatNum) {
    var metaSurat = document.getElementById('meta-surat-' + ayatNum);
    var surahName = metaSurat ? metaSurat.value : 'Surat';
    var container = document.getElementById('ayat-' + ayatNum);
    if(!container) return;

    var arab = container.querySelector('.ayat-arab').innerText; // Ini akan ambil yang visible
    var indo = container.querySelector('.trans-id').innerText;
    var url = window.location.href.split('#')[0] + '#ayat-' + ayatNum;
    var text = "QS. " + surahName + " [" + ayatNum + "]\\n\\n" + arab + "\\n\\n" + indo + "\\n\\nLink: " + url;
    
    if (platform === 'wa') window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
    else if (platform === 'fb') window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank');
    else if (platform === 'x') window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
    else if (platform === 'tele') window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank');
    else if (platform === 'copy') navigator.clipboard.writeText(text).then(function() { window.showToast('Teks & Link disalin!'); });

    window.toggleShare(ayatNum);
};

window.toggleShare = function(id) {
    document.querySelectorAll('.share-popover').forEach(function(p) { p.style.display = 'none'; });
    var el = document.getElementById('share-pop-' + id);
    if(el) el.style.display = (el.style.display === 'block') ? 'none' : 'block';
};

window.handleSearch = function(event) {
    var keyword = document.getElementById('searchBox').value.trim();
    if (event && event.key === "Enter") {
        if (keyword.length < 3) return window.showToast('Minimal 3 huruf');
        window.location.href = '/api/quran/tematik?q=' + encodeURIComponent(keyword);
    }
};

window.onclick = function(e) {
    if (!e.target.closest('.dropdown-trigger') && !e.target.closest('.dropdown-content')) {
        var list = document.getElementById('qari-list'); if(list && list.style.display === 'block') { list.style.display = 'none'; }
    }
    if (!e.target.closest('.share-wrapper') && !e.target.closest('.btn-action')) {
         document.querySelectorAll('.share-popover').forEach(function(d){ d.style.display = 'none'; });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    window.updateUI(); window.updateHijriDate();
});
<\/script>

<div class="sticky-player" id="player-container" style="display:none;">
    <div style="width:35px; height:35px; background:var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff;"><i class="fas fa-play"></i></div>
    <div style="flex:1; overflow:hidden;">
       <span id="player-title" style="font-size:0.75rem; font-weight:bold; color:var(--text-main); display:block; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">Audio Player</span>
       <audio id="main-player" controls style="height:30px; width:100%;"></audio>
    </div>
    <button onclick="window.closePlayer()" style="background:none; border:none; color:var(--text-muted); cursor:pointer;"><i class="fas fa-times"></i></button>
</div>
`;
//#endregion
//#region src/cms/themes/labmu-quran/style.ts
var css$1 = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --primary: #059669;
  --bg-body: #f1f5f9;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  
  --header-bg: linear-gradient(135deg, #1e3a8a 0%, #059669 100%);
  --header-text: #ffffff;
  
  --dropdown-bg: #ffffff;
  --hover-bg: #f8fafc;
  --footer-bg: #ffffff;
  --sidebar-bg: #ffffff;
}

body.dark {
  --primary: #34d399;
  --bg-body: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border: #334155;
  
  --header-bg: linear-gradient(135deg, #020617 0%, #064e3b 100%);
  --header-text: #ffffff;
  
  --dropdown-bg: #1e293b;
  --hover-bg: #334155;
  --footer-bg: #1e293b;
  --sidebar-bg: #1e293b;
}

* { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

body { 
  font-family: 'Plus Jakarta Sans', sans-serif; 
  background: var(--bg-body); 
  color: var(--text-main);
  padding-bottom: 160px; 
  transition: background 0.3s;
  padding-top: 70px;
}

.quran-container { max-width: 900px; margin: 0 auto; }

/* === HEADER === */
.header-wrapper {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: var(--header-bg);
  color: var(--header-text);
  border-bottom: 1px solid var(--border);
  height: 70px;
  display: flex; align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.header-inner {
  max-width: 900px; width: 100%; margin: 0 auto; padding: 0 20px;
  display: flex; justify-content: space-between; align-items: center;
  position: relative; /* Untuk centering logo */
}

/* LOGO TENGAH */
.brand-logo { 
  position: absolute; left: 50%; transform: translateX(-50%);
  font-family: 'Amiri', serif; font-size: 1.8rem; font-weight: bold; 
  color: var(--header-text); text-decoration: none; 
  white-space: nowrap;
}
/* --- TAMBAHKAN INI DI style.ts --- */
.hijri-badge {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.2;
    min-width: 140px; /* Biar tidak goyang saat loading */
}

.calendar-khgt {
    font-size: 0.9rem;
    font-weight: 700;
    color: #ffffff;
}

.calendar-divider {
    width: 80%; /* Garis pemisah */
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
    margin: 3px 0;
}

.calendar-masehi {
    font-size: 0.7rem;
    opacity: 0.9;
    color: #f1f5f9;
}
/* HEADER KANAN */
.header-right { margin-left: auto; display: flex; gap: 8px; align-items: center; }
.header-desktop { display: flex; gap: 8px; align-items: center; }

/* BURGER BUTTON */
.burger-btn {
    display: none;
    background: transparent; border: 1px solid rgba(255,255,255,0.3);
    color: #fff; width: 40px; height: 40px; border-radius: 8px;
    font-size: 1.2rem; cursor: pointer;
}

/* KALENDER DESKTOP (KHGT & MASEHI) */
.hijri-badge {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #ffffff; padding: 4px 12px; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center;
    text-decoration: none; cursor: pointer; transition: all 0.2s;
    min-width: 125px; line-height: 1.2;
}
.hijri-badge:hover { background: rgba(255, 255, 255, 0.25); }

.calendar-khgt { font-size: 0.85rem; font-weight: 700; }
.calendar-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.2); margin: 3px 0; }
.calendar-masehi { font-size: 0.65rem; opacity: 0.85; font-weight: 500; }

/* === SIDEBAR === */
.sidebar-menu {
    position: fixed; top: 0; right: -300px; bottom: 0; width: 280px;
    background: var(--sidebar-bg); z-index: 5000;
    box-shadow: -5px 0 200px rgba(0,0,0,0.2);
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; flex-direction: column; border-left: 1px solid var(--border);
}
.sidebar-menu.open { right: 0; }
.sidebar-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.sidebar-content { padding: 20px; overflow-y: auto; }
.sidebar-group { margin-bottom: 25px; }
.sidebar-group label { display: block; font-weight: bold; margin-bottom: 10px; color: var(--primary); }
.sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 4000; display: none; backdrop-filter: blur(2px); }
.sidebar-overlay.show { display: block; }

/* KALENDER DI SIDEBAR (MOBILE) */
.sidebar-calendar-box {
    background: var(--bg-body); border: 1px solid var(--primary);
    color: var(--primary); padding: 15px; border-radius: 10px;
    text-align: center; font-weight: bold;
}

.share-popover button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    font-weight: bold;
    transition: opacity 0.2s;
}
.share-popover button:hover {
    opacity: 0.7;
}

/* Warna default harakat (mengikuti warna teks) */
.t-color { color: inherit; transition: color 0.3s; }

/* Warna saat tombol Tajwid ON */
body.show-tajwid .t-ghunnah { color: #ff0000 !important; font-weight: bold; } /* Merah */
body.show-tajwid .t-ikhfa { color: #ff8c00 !important; font-weight: bold; }   /* Oranye */
body.show-tajwid .t-idgham { color: #059669 !important; font-weight: bold; }  /* Hijau */
body.show-tajwid .t-qalqalah { color: #1e90ff !important; font-weight: bold; } /* Biru */

/* Style Tombol Header agar menyala hijau saat aktif */
.btn-icon-head.active#btn-tajwid {
    background: #059669 !important;
    color: #ffffff !important;
}

/* CSS TAJWID COLORS */
.allah { color: #e74c3c; font-weight: bold; } /* Lafadz Allah - Merah */
.ghunnah { color: #f39c12; } /* Ghunnah - Orange */
.idgham_with_ghunnah { color: #f39c12; } /* Idgham Bighunnah - Orange */
.idgham_without_ghunnah { color: #7f8c8d; } /* Bilaghunnah - Abu */
.ikhfa { color: #27ae60; } /* Ikhfa - Hijau */
.iqlab { color: #2980b9; font-family: sans-serif; font-size: 0.8em; vertical-align: top; } /* Iqlab - Tanda Mim Kecil */
.qalqalah { color: #8e44ad; } /* Qalqalah - Ungu */
.madda_normal { color: #d35400; } /* Mad Biasa - Coklat */
.madda_lazim { color: #c0392b; text-decoration: overline; } /* Mad Panjang - Merah Gelap */

/* UI ELEMENTS */
.mobile-select { width: 100%; padding: 12px; border-radius: 8px; background: var(--bg-body); color: var(--text-main); border: 1px solid var(--border); font-size: 1rem; }
.btn-sidebar-toggle { flex: 1; padding: 10px; border: 1px solid var(--border); background: var(--bg-body); color: var(--text-muted); border-radius: 8px; cursor: pointer; }
.btn-sidebar-toggle.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.btn-sidebar-block { width: 100%; padding: 12px; background: var(--bg-body); border: 1px solid var(--border); color: var(--text-main); border-radius: 8px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 10px; }

/* DROPDOWN & FOOTER */
.custom-dropdown { position: relative; }
.dropdown-trigger { padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #ffffff; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 8px; min-width: 130px; justify-content: space-between; }
.dropdown-content { display: none; position: absolute; right: 0; top: 120%; background-color: var(--dropdown-bg); min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-radius: 10px; border: 1px solid var(--border); z-index: 3000; overflow: hidden; }
.dropdown-content.show { display: block; animation: fadeIn 0.1s; }
.dropdown-item { padding: 12px 15px; display: block; color: var(--text-main); cursor: pointer; border-bottom: 1px solid var(--border); }
.dropdown-item:hover { background-color: var(--hover-bg); color: var(--primary); }
.btn-icon-head { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-icon-head.active { background: #ffffff; color: var(--primary); }
.labmu-footer { position: fixed; bottom: 0; left: 0; right: 0; width: 100%; height: 35px; background-color: var(--footer-bg) !important; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: center; text-align: center; color: var(--text-muted); font-size: 0.8rem; z-index: 2000; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); }

/* CONTENT & PLAYER */
.content-area { padding: 20px 15px; }
.search-box { width: 100%; padding: 14px 20px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-main); margin-bottom: 25px; font-size: 1rem; }
.surat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
.surat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 18px; text-decoration: none; color: inherit; display: flex; align-items: center; gap: 15px; transition: transform 0.2s; }
.surat-card:hover { transform: translateY(-3px); border-color: var(--primary); }
.nomor-surat { width: 40px; height: 40px; border-radius: 8px; background: rgba(5, 150, 105, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: bold; }
.ayat-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 25px; margin-bottom: 20px; }
.ayat-meta-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px dashed var(--border); padding-bottom: 15px; }
.ayat-badge { background: var(--text-main); color: var(--bg-card); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
.ayat-actions { display: flex; gap: 8px; }
.btn-action { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.btn-action:hover { color: var(--primary); border-color: var(--primary); background: rgba(5, 150, 105, 0.05); }
.ayat-arab { font-family: 'Amiri', serif; font-size: 2.2rem; line-height: 2.3; text-align: right; margin-bottom: 25px; color: var(--text-main); }
.trans-block { margin-top: 12px; line-height: 1.6; }
.trans-latin { color: var(--primary); font-weight: 600; display: none; }
.trans-id { display: none; color: var(--text-main); }
.trans-en { display: none; color: var(--text-muted); font-style: italic; border-left: 2px solid var(--border); padding-left: 12px; margin-top: 10px; }
body.show-latin .trans-latin { display: block; }
body.show-id .trans-id { display: block; }
body.show-en .trans-en { display: block; }
.sticky-player { position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); width: 95%; max-width: 450px; background: var(--bg-card); padding: 10px 15px; border-radius: 50px; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 12px; z-index: 2500; }
.share-popover { display: none; position: absolute; right: 0; top: 110%; background: var(--bg-card); min-width: 160px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); border-radius: 10px; border: 1px solid var(--border); z-index: 100; padding: 5px; }
.share-popover.show { display: block; animation: fadeIn 0.2s; }
.share-link { display: flex; align-items: center; gap: 10px; padding: 10px; color: var(--text-main); text-decoration: none; font-size: 0.85rem; border-radius: 6px; }
.share-link:hover { background: var(--hover-bg); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

/* === RESPONSIF MOBILE (HP) === */
@media (max-width: 768px) {
    /* 1. Sembunyikan Kalender Header & Menu Desktop */
    .desktop-only, .header-desktop { display: none !important; }
    
    /* 2. Tampilkan Burger */
    .burger-btn { display: block; }
    
    /* 3. Logo Tetap Tengah */
    .brand-logo { font-size: 1.5rem; }
}
`;
//#endregion
//#region src/cms/themes/labmu-quran/index.ts
var _layout = (content, title, ctx) => {
	return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - QuranMu</title>
  <meta name="description" content="Al-Quran Digital Lengkap dengan Terjemahan dan Audio">
  
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  
  <style>
    ${css$1 || ""}
  </style>
</head>
<body class="${ctx.site?.theme === "dark" ? "dark" : ""}">
  
  ${renderHeader$1(ctx)}

  <main class="main-content">
    <div class="quran-container">
       ${content}
    </div>
  </main>

  <footer class="labmu-footer">
    &copy; 2026 LabMu CMS • Quran Digital
  </footer>

  ${clientScripts}

</body>
</html>`;
};
var render404$1 = (ctx) => _layout(`
  <div style="text-align:center; padding:80px 20px;">
    <h1 style="font-size:3rem; color:var(--primary); margin-bottom:10px;">404</h1>
    <p style="color:var(--text-muted); margin-bottom:30px;">Halaman yang Anda cari tidak ditemukan.</p>
    <a href="/" style="display:inline-block; padding:10px 25px; background:var(--primary); color:#fff; text-decoration:none; border-radius:30px; font-weight:bold;">Kembali ke Beranda</a>
  </div>
`, "Tidak Ditemukan", ctx);
var LabMuQuran = {
	renderHome: (ctx) => renderHome$1(ctx, _layout),
	renderSearch: (results, q, ctx) => renderSearch$1(results, q, ctx, _layout),
	renderSingle: (ctx) => renderSingle$1(ctx, _layout),
	render404: (ctx) => render404$1(ctx)
};
//#endregion
//#region src/cms/themes/wikimu/style.ts
var css = `
  :root {
      /* --- COLOR PALETTE (Fixed) --- */
      --mu-green-primary: #006C45;
      --mu-green-dark: #004d32;
      --mu-gold-accent: #FFD700;
      
      /* --- THEME VARIABLES (Dynamic) --- */
      --wiki-bg: #f6f7f8;
      --wiki-content-bg: #ffffff;
      --wiki-text: #202122;
      --wiki-text-muted: #54595d;
      --wiki-border: #a2a9b1;
      --wiki-link: #0645ad;
      --wiki-input-bg: rgba(255, 255, 255, 0.9);
      --wiki-sidebar-bg: #ffffff;
      --wiki-footer-bg: #f6f7f8;
      --shadow-color: rgba(0,0,0,0.05);
      --mobile-menu-color: #ffffff;
  }

  /* --- DARK MODE CONFIG (Optimized for Deep Black) --- */
  [data-theme="dark"] {
      --wiki-bg: #000000;            /* Hitam Pekat */
      --wiki-content-bg: #121212;    /* Abu-abu sangat gelap untuk kontainer utama */
      --wiki-text: #ffffff;          /* Putih murni */
      --wiki-text-muted: #a0a0a0;
      --wiki-border: #333333;        /* Border halus gelap */
      --wiki-link: #8ab4f8;          /* Biru terang agar kontras di hitam */
      --wiki-input-bg: #2d2d2d;
      --wiki-sidebar-bg: #121212;
      --wiki-footer-bg: #000000;
      --shadow-color: rgba(255,255,255,0.05);
  }

  /* BASE */
  body { 
      background-color: var(--wiki-bg); 
      font-family: sans-serif; 
      font-size: 0.9375rem; 
      color: var(--wiki-text); 
      margin: 0; 
      line-height: 1.6; 
      transition: background-color 0.3s ease, color 0.3s ease;
  }
  * { box-sizing: border-box; }

  /* TYPOGRAPHY */
  h1, h2, h3, h4 { 
      font-family: 'Linux Libertine', 'Georgia', serif; 
      color: var(--wiki-text);
      margin-top: 1em; margin-bottom: 0.5em; 
      font-weight: normal; line-height: 1.3;
  }
  h1 { font-size: 2rem; border-bottom: 1px solid var(--wiki-border); padding-bottom: 5px; margin-top: 0; }
  h2 { font-size: 1.5rem; border-bottom: 1px solid var(--wiki-border); padding-bottom: 5px; }
  
  a { color: var(--wiki-link); text-decoration: none; }
  a:hover { text-decoration: underline; }
  
  /* --- HEADER (GRADIENT) --- */
  .wiki-header {
      background: linear-gradient(90deg, #1B3A57 0%, #006C45 100%);
      border-bottom: 1px solid #004d32;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 55px;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      color: white; 
  }

  /* Logo */
  .wiki-logo { display: flex; align-items: center; gap: 10px; color: #ffffff !important; text-decoration: none!important; }
  .brand-main { font-family: 'Linux Libertine', serif; font-size: 1.4rem; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
  .brand-sub { font-size: 0.6rem; text-transform: uppercase; color: var(--mu-gold-accent); letter-spacing: 0.5px; }
  
  /* Search */
  .wiki-search-container { flex-grow: 1; max-width: 400px; margin: 0 2rem; position: relative; }
  .wiki-search-input { 
      width: 100%; padding: 6px 12px 6px 32px; 
      border: 1px solid var(--wiki-border); border-radius: 4px; 
      font-size: 0.9rem; background: var(--wiki-input-bg); color: var(--wiki-text);
      outline: none;
  }
  .wiki-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--wiki-text-muted); font-size: 0.8rem; }

  /* Actions & Toggle */
  .header-actions { font-size: 0.8rem; display: flex; align-items: center; gap: 10px; }
  
  .theme-toggle {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
  }
  .signup-btn { 
      background: var(--mu-gold-accent); color: #004d32 !important; 
      padding: 5px 12px; border-radius: 3px; font-weight: bold; 
      text-decoration: none; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  /* LAYOUT */
  .wiki-container {
      display: grid;
      grid-template-columns: 176px minmax(0, 1fr) 250px; 
      gap: 1.5rem; max-width: 1400px; margin: 0 auto; padding: 1rem 1.5rem; align-items: start;
  }

  /* SIDEBAR (Desktop) */
  .wiki-sidebar nav { position: sticky; top: 70px; font-size: 0.85rem; }
  .wiki-nav-header { 
      font-weight: bold; color: var(--wiki-text-muted); 
      margin: 1rem 0 0.5rem 0; padding-bottom: 3px; border-bottom: 1px solid var(--wiki-border); 
  }
  .wiki-nav-link { display: block; padding: 4px 0; color: var(--wiki-link); }
  
  /* MAIN */
  .wiki-main { 
      background: var(--wiki-content-bg); padding: 1.5rem 2rem; 
      border: 1px solid var(--wiki-border); min-height: 80vh; 
      box-shadow: 0 1px 3px var(--shadow-color);
      color: var(--wiki-text); 
  }
  
  /* FOOTER */
  .wiki-footer { 
      margin-top: 2rem; padding: 2rem; border-top: 1px solid var(--wiki-border); 
      text-align: center; font-size: 0.8rem; color: var(--wiki-text-muted); background: var(--wiki-footer-bg); 
  }

  /* --- MOBILE FIXES --- */
  .mobile-menu-btn { 
      display: none; background: none; border: none; 
      font-size: 1.4rem; cursor: pointer; padding: 0 10px 0 0; 
      color: var(--mobile-menu-color); 
  }

  @media (max-width: 1024px) {
      .wiki-container { grid-template-columns: 1fr; padding: 0; gap: 0; }
      .wiki-header { padding: 0 1rem; }
      .brand-main { font-size: 1.2rem; }
      .brand-sub { display: none; }
      .wiki-search-container { display: none; }
      .mobile-menu-btn { display: block; }
      
      .wiki-sidebar { 
          display: none; 
          position: fixed; 
          top: 55px;
          left: 0; bottom: 0; width: 260px; 
          background: var(--wiki-sidebar-bg);
          z-index: 999; 
          padding: 20px; 
          border-right: 1px solid var(--wiki-border); 
          overflow-y: auto;
          box-shadow: 4px 0 10px rgba(0,0,0,0.1);
      }
      .wiki-sidebar.active { display: block; animation: slideIn 0.3s ease; }
      .wiki-main { border: none; padding: 1.5rem 1rem; }
  }

  @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
  }

  /* --- GLOBAL DARK MODE OPTIMIZATION (HOME, CATEGORY, TAG) --- */

  /* Judul Laman & Arsip */
  .archive-header h1, .page-header h1, .category-title, .tag-title, .entry-title, h1.entry-title {
      color: var(--wiki-text) !important;
      border-bottom: 1px solid var(--wiki-border) !important;
      padding-bottom: 10px;
  }

  /* Teks Deskripsi & Meta */
  .post-excerpt, .article-summary, .archive-description, .post-meta, .entry-meta, .article-meta, .wiki-main span, span.text-muted {
      color: var(--wiki-text-muted) !important;
  }

  /* Judul Artikel di List */
  .post-item h2 a, .article-list-item h2 a, .entry-title a, .wiki-main a h2, .wiki-main h2 a {
      color: var(--wiki-link) !important;
  }

  /* Garis Pemisah List */
  .post-item, .article-list-item, .archive-header, .page-header {
      border-bottom: 1px solid var(--wiki-border) !important;
  }

  /* Pagination */
  .pagination a, .nav-links a {
      background-color: var(--wiki-content-bg);
      color: var(--wiki-text);
      border: 1px solid var(--wiki-border);
  }
`;
//#endregion
//#region src/cms/themes/wikimu/components.ts
var renderTools = () => `
    <aside class="wiki-tools" style="width: 250px;">
        <div class="tool-box">
            <span class="tool-header"><i class="fas fa-book"></i> Pustaka Tarjih</span>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem; line-height: 1.8;">
                <li><a href="https://muhammadiyah.or.id" target="_blank">Muhammadiyah Pusat</a></li>
                <li><a href="https://tarjih.or.id" target="_blank">Majelis Tarjih</a></li>
            </ul>
        </div>
        
        
    </aside>
`;
//#endregion
//#region src/cms/themes/wikimu/header.ts
var renderHeader = () => {
	return `
    <header class="wiki-header">
        
        <button id="mobile-menu-btn" class="mobile-menu-btn" onclick="toggleMobileMenu()">
            <i class="fas fa-bars"></i>
        </button>

        <a href="/" class="wiki-logo">
            <i class="fas fa-book-open" style="font-size: 24px;"></i>
            
            <div style="display:flex; flex-direction:column; line-height:1.1;">
                <span class="brand-main">Tarjih</span>
                <span class="brand-sub">Ensiklopedia Muhammadiyah</span>
            </div>
        </a>

        <form action="/search" method="GET" class="wiki-search-container">
            <i class="fas fa-search wiki-search-icon"></i>
            <input type="text" name="q" class="wiki-search-input" placeholder="Cari Fatwa / Artikel..." required>
        </form>

        <div class="header-actions">
            <button class="theme-toggle" onclick="toggleTheme()" title="Ganti Mode Malam/Siang">
                <i class="fas fa-moon" id="theme-icon"></i>
            </button>

            <a href="/admin/login" class="signup-btn">
                <i class="fas fa-user-circle" style="margin-right:5px;"></i> Login
            </a>
        </div>

        <script>
            // --- A. LOGIKA TEMA (DARK/LIGHT) ---
            (function() {
                const savedTheme = localStorage.getItem('wiki_theme') || 'light';
                document.documentElement.setAttribute('data-theme', savedTheme);
                updateThemeIcon(savedTheme);
            })();

            function toggleTheme() {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('wiki_theme', next);
                updateThemeIcon(next);
            }

            function updateThemeIcon(theme) {
                const icon = document.getElementById('theme-icon');
                if(icon) {
                    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            }

            // --- B. LOGIKA MENU MOBILE ---
            function toggleMobileMenu() {
                const sidebar = document.querySelector('.wiki-sidebar');
                if(sidebar) {
                    sidebar.classList.toggle('active');
                }
            }
        <\/script>
    </header>
    `;
};
//#endregion
//#region src/cms/themes/wikimu/chat-widget.ts
var renderChatWidget = () => {
	return `
    <div id="chatmu-public-widget" x-data="{
        isOpen: false,
        msg: '',
        history: [],
        isLoading: false,
        
        async init() {
            this.isLoading = true;
            try {
                const res = await fetch('/chat-public/hello');
                if (!res.ok) throw new Error('Server error');
                const json = await res.json();
                this.history.push({sender: 'bot', text: json.reply});
            } catch(e) {
                this.history.push({sender: 'bot', text: '⚠️ Maaf, gagal terhubung ke server ChatMu.'});
            } finally {
                this.isLoading = false;
            }
        },

        async send() {
            if(!this.msg.trim()) return;
            this.history.push({sender: 'user', text: this.msg});
            const txt = this.msg;
            this.msg = '';
            this.isLoading = true;
            this.scrollToBottom();

            try {
                const res = await fetch('/chat-public/ask', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ message: txt })
                });
                
                if (!res.ok) throw new Error('Network error');
                const json = await res.json();
                this.history.push({sender: 'bot', text: json.reply});
                
                if(json.sources && json.sources.length > 0) {
                   this.history.push({sender: 'system', text: 'Sumber Referensi Web:<br>' + json.sources.join('<br>')});
                }
            } catch(e) {
                this.history.push({sender: 'bot', text: '⚠️ Maaf, saya sedang tidak bisa terhubung ke server.'});
            } finally {
                this.isLoading = false;
                this.scrollToBottom();
            }
        },

        scrollToBottom() {
            this.$nextTick(() => {
                setTimeout(() => {
                    const box = document.getElementById('chat-public-history');
                    if(box) {
                        box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
                    }
                }, 100);
            });
        },

        formatText(text, sender) {
            if (!text) return '';
            
            if (sender === 'system') return text;

            let str = String(text);
            
            str = str.replace(/\\n/g, '<br>');
            str = str.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
            str = str.replace(/<br>\\s*-\\s/g, '<br>• ');
            str = str.replace(/<br>\\s*\\*\\s/g, '<br>• ');
            str = str.replace(/<br>\\s*(\\d+\\.)\\s/g, '<br><strong>$1</strong> ');
            str = str.replace(/(<br>\\s*){3,}/g, '<br><br>');
            str = str.replace(/^(<br>\\s*)+/, '');
            
            return str;
        },

        copyText(text, btnEvent) {
            const cleanText = text.replace(/\\*\\*(.*?)\\*\\*/g, '$1');

            navigator.clipboard.writeText(cleanText).then(() => {
                const btn = btnEvent.currentTarget;
                const icon = btn.querySelector('i');
                const span = btn.querySelector('span');
                
                if(icon) icon.className = 'fas fa-check';
                if(span) span.innerText = 'Disalin!';
                btn.style.color = '#16a34a'; 
                
                setTimeout(() => { 
                    if(icon) icon.className = 'fas fa-copy'; 
                    if(span) span.innerText = 'Salin';
                    btn.style.color = '#9ca3af'; 
                }, 2000);
            }).catch(err => {
                alert('Gagal menyalin teks!');
            });
        }
    }" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif;">

        <button @click="isOpen = !isOpen; if(isOpen) scrollToBottom();" 
                style="width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg, #006C45, #1B3A57); color:white; border:none; box-shadow:0 4px 10px rgba(0,0,0,0.3); cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center; transition: transform 0.2s;">
            <i class="fas" :class="isOpen ? 'fa-times' : 'fa-robot'"></i>
        </button>

        <div x-show="isOpen" 
             x-transition
             style="position:absolute; bottom:80px; right:0; width:350px; max-width:85vw; height:500px; max-height:calc(100vh - 120px); background:white; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.2); overflow:hidden; border:1px solid #ddd;">
            
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 55px; background:linear-gradient(90deg, #1B3A57, #006C45); padding: 0 15px; color:white; display:flex; align-items:center; gap:8px; font-weight:bold; z-index: 10;">
                <i class="fas fa-robot"></i> ChatMu AI
            </div>

            <div id="chat-public-history" style="position: absolute; top: 55px; bottom: 60px; left: 0; right: 0; overflow-y: auto; padding: 20px; background: #f9fafb; display: flex; flex-direction: column; gap: 24px;">
                
                <template x-for="chat in history">
                    <div style="display: flex; width: 100%;" :style="chat.sender === 'user' ? 'justify-content: flex-end;' : (chat.sender === 'system' ? 'justify-content: center;' : 'justify-content: flex-start;')">
                        
                        <div :style="chat.sender === 'user' ? 'background:#dcfce7; color:#166534; border-bottom-right-radius: 4px;' : (chat.sender === 'system' ? 'background:#f0fdf4; border:1px dashed #bbf7d0; color:#166534; text-align:center; font-size:12px;' : 'background:white; border:1px solid #e5e7eb; color:#1f2937; border-bottom-left-radius: 4px;')"
                             style="max-width:85%; padding:14px 16px; border-radius:12px; font-size:14px; line-height:1.6; box-shadow:0 2px 5px rgba(0,0,0,0.04); word-break: break-word; position: relative;">
                            
                            <div x-html="formatText(chat.text, chat.sender)"></div>
                            
                            <template x-if="chat.sender === 'bot'">
                                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #e5e7eb; display: flex; justify-content: flex-end;">
                                    <button @click="copyText(chat.text, $event)" title="Salin Jawaban" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 11px; color: #9ca3af; padding: 0; transition: color 0.2s;">
                                        <i class="fas fa-copy"></i> <span>Salin</span>
                                    </button>
                                </div>
                            </template>

                        </div>

                    </div>
                </template>

                <div x-show="isLoading" style="display: flex; justify-content: flex-start; width: 100%;">
                    <div style="font-size:12px; color:#6b7280; padding: 5px;">
                        <i class="fas fa-circle-notch fa-spin"></i> ChatMu sedang berpikir...
                    </div>
                </div>

            </div>

            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; padding: 10px; border-top: 1px solid #eee; background: white; display: flex; gap: 8px; z-index: 10;">
                <input type="text" x-model="msg" @keydown.enter="send()" placeholder="Tanya ChatMu..." style="flex:1; border:1px solid #ddd; padding:0 15px; border-radius:20px; outline:none; font-size:13px; height: 100%;">
                <button @click="send()" style="background:#006C45; color:white; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink: 0;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>

        </div>
    </div>
    `;
};
//#endregion
//#region src/cms/themes/wikimu/layout.ts
var renderLayout = (title, content, showTools = true, metaData = {}) => {
	const siteTitle = "Ensiklopedia Tarjih";
	const description = metaData.description || "Ensiklopedia digital Fatwa, Kajian, dan Manhaj Tarjih Muhammadiyah.";
	const image = metaData.image || "https://muhammadiyah.or.id/wp-content/uploads/2022/03/Logo-Muhammadiyah-Png-Warna.png";
	const url = metaData.url || "";
	return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${title} - ${siteTitle}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">

    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="${siteTitle}">

    <style>${css}</style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Linux+Libertine:wght@400;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script>
</head>
<body>

    ${renderHeader()}

    <div class="wiki-container">
        
        <aside class="wiki-sidebar" id="wiki-sidebar">
            <nav>
                <div class="wiki-nav-header">Navigasi</div>
                <a href="/" class="wiki-nav-link"><i class="fas fa-home"></i> Halaman Utama</a>
                <a href="/daftar-isi" class="wiki-nav-link"><i class="fas fa-list"></i> Daftar Isi</a>
                <a href="/indeks-fatwa" class="wiki-nav-link"><i class="fas fa-book"></i> Indeks Fatwa</a>
                
                <div class="wiki-nav-header">Kajian</div>
                <a href="/aqidah" class="wiki-nav-link">Aqidah</a>
                <a href="/ibadah" class="wiki-nav-link">Ibadah</a>
                <a href="/akhlak" class="wiki-nav-link">Akhlak</a>
                <a href="/muamalah" class="wiki-nav-link">Muamalah</a>

                <div class="wiki-nav-header">Majelis</div>
                <a href="/tentang" class="wiki-nav-link">Tentang Tarjih</a>
                <a href="/manhaj" class="wiki-nav-link">Manhaj</a>
            </nav>
        </aside>

        <main class="wiki-main">
            ${content}
        </main>

        ${showTools ? renderTools() : ""}

    </div>

    <footer class="wiki-footer">
        <p>Halaman ini terakhir diubah pada ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	})}.</p>
        <p><a href="#">Kebijakan Privasi</a> • <a href="/">Tentang Tarjih Muhammadiyah</a></p>
        <div class="footer-credit">Ditenagai oleh LabMu CMS</div>
    </footer>

    ${renderChatWidget()}

    <script>
        // Script untuk Mobile Menu
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const sidebar = document.getElementById('wiki-sidebar');
            if(sidebar) sidebar.classList.toggle('active');
        });
    <\/script>

</body>
</html>`;
};
//#endregion
//#region src/cms/themes/wikimu/home.ts
var renderHome = (ctx) => {
	return renderLayout("Halaman Utama", `
        <div class="home-wrapper">
            <div style="background: #f0f7f4; padding: 30px; border-radius: 8px; margin-bottom: 40px; border-left: 5px solid #006C45;">
                <h1 style="margin: 0 0 10px 0; color: #006C45; font-family: 'Linux Libertine', serif;">Selamat Datang di Portal Tarjih</h1>
                <p style="margin: 0; font-size: 1.1rem; color: #333;">Ensiklopedia Digital Majelis Tarjih Muhammadiyah. Rujukan Islam berkemajuan.</p>
            </div>
            
            <h2 style="border-bottom: 2px solid #006C45; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.2rem;">Terbaru</h2>
            <div class="posts-list">
                ${(ctx.data || []).map((p) => {
		const excerpt = (p.body || "").replace(/<[^>]+>/g, "").substring(0, 150) + "...";
		const category = p.category || "Umum";
		return `
        <div class="post-card" style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <div style="font-size: 0.8rem; color: #006C45; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">
                <a href="/${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}" style="text-decoration:none; color:inherit;">${category}</a>
            </div>
            <h3 style="font-family: 'Linux Libertine', serif; font-size: 1.4rem; margin: 0 0 10px 0;">
                <a href="/${p.slug}" style="text-decoration: none; color: #0645ad;">${p.title}</a>
            </h3>
            <p style="color: #444; font-size: 0.95rem; line-height: 1.6; margin: 0;">${excerpt}</p>
            <div style="font-size: 0.8rem; color: #888; margin-top: 8px;">
                ${new Date(p.created_at).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric"
		})}
            </div>
        </div>
        `;
	}).join("")}
            </div>
        </div>
    `, true);
};
//#endregion
//#region src/cms/themes/wikimu/css-single.ts
var singleCss = `
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Scheherazade+New:wght@400;700&family=Amiri:wght@400;700&display=swap");

.article-wrapper {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  /* Menggunakan variabel agar otomatis gelap/terang */
  background: var(--wiki-content-bg);
  color: var(--wiki-text);
  transition: background 0.3s ease, color 0.3s ease;
}

.article-title {
  font-family: 'Linux Libertine', 'Georgia', serif;
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 10px;
  line-height: 1.2;
  color: var(--wiki-text);
}

.article-meta {
  font-size: 0.9rem;
  color: var(--wiki-text-muted);
  margin-bottom: 30px;
  border-bottom: 1px solid var(--wiki-border);
  padding-bottom: 20px;
}

/* KONTEN LATIN (DEFAULT) */
.article-content p {
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--wiki-text); /* Menyesuaikan tema */
  text-align: justify;
}

/* --- PERBAIKAN ARABIC STYLE (FORCE RIGHT) --- */

/* 1. Arabic Block (Paragraf Full Arab) */
p.arabic-block {
  font-family: "Scheherazade New", "Amiri", serif;
  font-size: 2.2rem;       
  line-height: 2.2;
  
  direction: rtl;
  text-align: right !important; 
  
  /* Mode Malam: Background lebih gelap, Mode Terang: Background abu halus */
  background-color: var(--wiki-bg); 
  border-right: 5px solid var(--mu-green-primary); 
  padding: 15px 20px 15px 20px;
  margin: 2rem 0;
  border-radius: 4px;
  color: var(--wiki-text);
  display: block;
}

/* --- Tambahan untuk Disclaimer (Sinkron Mode Malam) --- */
.wiki-post-disclaimer {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: var(--wiki-bg); /* Mengikuti background luar agar tidak silau */
    border: 1px solid var(--wiki-border);
    border-radius: 8px;
    transition: background-color 0.3s ease, border 0.3s ease;
}

.wiki-post-disclaimer p {
    margin: 0;
    font-size: 0.85rem;
    font-style: italic;
    color: var(--wiki-text-muted) !important; /* Memaksa warna teks tidak biru/putih terang */
    line-height: 1.6;
    text-align: left; /* Biasanya disclaimer lebih rapi rata kiri */
}

.wiki-post-disclaimer strong {
    color: var(--wiki-text);
}

/* 2. Arabic Inline (Campuran dalam teks latin) */
.arabic-inline {
  font-family: "Scheherazade New", serif;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--mu-green-primary); /* Tetap Hijau agar menonjol */
  margin: 0 3px;
}

/* TOC & Lainnya */
.toc-box {
  background: var(--wiki-bg);
  border: 1px solid var(--wiki-border);
  padding: 15px 20px;
  display: table;
  margin-bottom: 20px;
  border-radius: 4px;
  color: var(--wiki-text);
}
.toc-title { 
  font-weight: bold; 
  text-align: center; 
  border-bottom: 1px solid var(--wiki-border); 
  margin-bottom: 10px; 
  color: var(--wiki-text);
}
.toc-box ul { list-style: none; padding: 0; margin: 0; }
.toc-box li { margin: 5px 0; font-size: 0.9rem; }
.toc-level-3 { margin-left: 20px; font-size: 0.85rem; }
.toc-box a { text-decoration: none; color: var(--wiki-link); }
.toc-box a:hover { text-decoration: underline; }

.edit-btn {
  font-size: 0.8rem; 
  background: var(--wiki-bg); 
  padding: 4px 10px; 
  border: 1px solid var(--wiki-border);
  border-radius: 4px; 
  color: var(--wiki-text-muted); 
  text-decoration: none; 
  margin-left: 10px;
  transition: 0.2s;
}

.edit-btn:hover {
  background: var(--wiki-border);
  color: var(--wiki-text);
}

/* Biar link di dalam konten artikel tidak mati saat mode malam */
.article-content a {
  color: var(--wiki-link);
}
`;
//#endregion
//#region src/cms/addons/seo/auto-link.ts
var LINK_MAP = {
	"Muhammadiyah": "https://muhammadiyah.or.id",
	"Quran": "https://quran.muhammadiyah.or.id",
	"Tarjih": "/",
	"Aqidah": "/aqidah",
	"Ibadah": "/ibadah",
	"Akhlak": "/akhlak",
	"Muamalah": "/muamalah",
	"Shalat": "/ibadah",
	"Puasa": "/ibadah",
	"Zakat": "/ibadah",
	"Haji": "/ibadah",
	"Iman": "/aqidah",
	"Tauhid": "/aqidah",
	"Syirik": "/aqidah",
	"Riba": "/muamalah",
	"Bank": "/muamalah",
	"Nikah": "/muamalah",
	"Waris": "/muamalah",
	"Adab": "/akhlak"
};
function injectInternalLinks(content) {
	if (!content) return "";
	const keys = Object.keys(LINK_MAP).join("|");
	const regex = new RegExp(`(<a\\b[^>]*>[\\s\\S]*?<\\/a>)|(<[^>]+>)|(\\b(${keys})\\b)`, "gi");
	const usedKeys = /* @__PURE__ */ new Set();
	return content.replace(regex, (match, existingLink, tag, keyword) => {
		if (existingLink || tag) return match;
		if (keyword) {
			const lowerKey = keyword.toLowerCase();
			if (usedKeys.has(lowerKey)) return keyword;
			const originalKey = Object.keys(LINK_MAP).find((k) => k.toLowerCase() === lowerKey);
			if (originalKey) {
				usedKeys.add(lowerKey);
				return `<a href="${LINK_MAP[originalKey]}" title="Baca tentang ${keyword}" style="color:#006C45; text-decoration:underline; text-decoration-style:dotted;">${keyword}</a>`;
			}
		}
		return match;
	});
}
//#endregion
//#region src/cms/themes/wikimu/single.ts
var generateBreadcrumbs = (slug, title, category) => {
	return `<nav aria-label="Breadcrumb" style="font-size:0.85rem; margin-bottom:15px; color:#54595d;"><ol style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap;"><li><a href="/" style="color:#0645ad; text-decoration:none;">Beranda</a></li><li style="margin:0 5px; color:#999;">&rsaquo;</li><li><a href="/${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}" style="color:#0645ad; text-decoration:none;">${category}</a></li><li style="margin:0 5px; color:#999;">&rsaquo;</li><li aria-current="page" style="color:#333;">${title}</li></ol></nav>`;
};
var generateSchemaOrg = (post) => {
	return ``;
};
var processContent = (html) => {
	return html;
};
var generateTOC = (html) => {
	return ``;
};
var renderSingle = (ctx) => {
	const post = ctx.data;
	if (!post) return renderLayout("404", "<h1>Tidak Ditemukan</h1>", false);
	const title = post.title || "Artikel Tarjih";
	const category = post.category || "Fatwa";
	const slug = post.slug || post.id;
	const catSlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
	const tagsHtml = post.tags ? post.tags.split(",").map((t) => {
		const cleanTag = t.trim();
		return `<a href="/tag/${cleanTag.toLowerCase().replace(/\s+/g, "-")}" style="display:inline-block; background:#eef; padding:4px 10px; border-radius:4px; font-size:0.8rem; color:#0645ad; text-decoration:none; margin:0 5px 5px 0; border:1px solid #dde;">#${cleanTag}</a>`;
	}).join("") : "";
	const metaData = {
		description: (post.body || "").substring(0, 160).replace(/<[^>]*>?/gm, ""),
		image: post.featured_image || "",
		url: `https://wikimu.id/${slug}`,
		title: `${title} - ${category}`
	};
	let contentRaw = post.body || post.content || "";
	try {
		contentRaw = injectInternalLinks(contentRaw);
	} catch (e) {}
	let bodyContent = processContent(contentRaw);
	const toc = generateTOC(bodyContent);
	const breadcrumbs = generateBreadcrumbs(slug, title, category);
	const schema = generateSchemaOrg(post);
	const canEdit = !!(ctx.user || ctx.var?.user);
	return renderLayout(title, `
    ${schema}
    <style>${singleCss}</style>

    <article class="article-wrapper" itemscope itemtype="https://schema.org/Article">
        ${breadcrumbs}
        
        <header>
            <h1 class="article-title" itemprop="headline">${title}</h1>
            <div class="article-meta">
                <a href="/${catSlug}" style="color:#006C45; font-weight:bold; text-decoration:none;">${category}</a> 
                &bull; 
                <time itemprop="datePublished" datetime="${new Date(post.created_at).toISOString()}">
                    ${new Date(post.created_at).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric"
	})}
                </time>
                ${canEdit ? ` &bull; <a href="/admin/post/${post.id}/edit" class="edit-btn">Sunting</a>` : ""}
            </div>
        </header>

        ${toc}

        <div class="article-content" itemprop="articleBody">
            ${bodyContent}
        </div>

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9rem; color: #777;">
            ${tagsHtml ? `
            <div style="margin-bottom: 20px;">
                <strong style="display:block; margin-bottom:8px; color:#333;">Topik Terkait:</strong>
                ${tagsHtml}
            </div>` : ""}
            
            <p><strong>Kategori:</strong> <a href="/${catSlug}" style="color:#0645ad;">${category}</a></p>
            
            <div style="background:#f9f9f9; padding:15px; border-left:4px solid #006C45; margin-top:20px; font-size:0.85rem;">
                <em><strong>Disclaimer:</strong> Konten ini disajikan dari pangkalan data Ensiklopedia Tarjih Muhammadiyah. Rujuklah ke buku asli HPT untuk referensi resmi.</em>
            </div>
        </footer>
    </article>
  `, true, metaData);
};
//#endregion
//#region src/cms/themes/wikimu/page.ts
var renderPage = (ctx) => {
	const page = ctx.data;
	if (!page) return renderLayout("404", "Halaman tidak ditemukan", false);
	const content = `
        <style>${singleCss}</style>
        <article class="article-wrapper">
            <header>
                <h1 class="article-title" style="border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">${page.title}</h1>
            </header>
            <div class="article-content">
                ${page.body}
            </div>
        </article>
    `;
	return renderLayout(page.title, content, true);
};
//#endregion
//#region src/cms/themes/wikimu/category.ts
var renderCategory = (ctx) => {
	const title = ctx.categoryName || "Arsip";
	const posts = ctx.data || [];
	let listHtml = "";
	if (posts.length === 0) listHtml = `<div style="padding: 40px 0; text-align: center; color: #666;">Belum ada artikel di kategori ini.</div>`;
	else listHtml = posts.map((p) => {
		const excerpt = (p.body || "").replace(/<[^>]+>/g, "").substring(0, 160) + "...";
		return `
            <div style="display: flex; gap: 20px; margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 25px;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px 0; font-family: 'Linux Libertine', serif; font-size: 1.3rem;">
                        <a href="/${p.slug}" style="color: #0645ad; text-decoration: none;">${p.title}</a>
                    </h3>
                    <div style="font-size: 0.8rem; color: #666; margin-bottom: 8px;">
                        <i class="far fa-clock"></i> ${new Date(p.created_at).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "short",
			day: "numeric"
		})}
                    </div>
                    <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: #333;">${excerpt}</p>
                </div>
            </div>`;
	}).join("");
	return renderLayout(title, `
        <div class="category-header" style="margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 15px;">
            <span style="font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">Kumpulan Artikel</span>
            <h1 style="margin: 5px 0 0 0; font-family: 'Linux Libertine', serif; font-size: 2.2rem; color: #333;">${title}</h1>
        </div>
        <div class="category-list">
            ${listHtml}
        </div>
    `, true);
};
//#endregion
//#region src/cms/themes/wikimu/404.ts
var render404 = (ctx) => {
	return renderLayout("Tidak Ditemukan", `
        <div style="text-align: center; padding: 80px 20px;">
            <div style="font-size: 6rem; font-weight: bold; color: #eee; line-height: 1;">404</div>
            <h2 style="font-family: 'Linux Libertine', serif; font-size: 2rem; color: #333; margin: 20px 0;">Halaman Tidak Ditemukan</h2>
            <p style="color: #666; max-width: 500px; margin: 0 auto 30px auto;">
                Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau tidak pernah ada.
            </p>
            <a href="/" style="display: inline-block; background: #006C45; color: white; padding: 10px 25px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                Kembali ke Depan
            </a>
        </div>
    `, false);
};
//#endregion
//#region src/cms/themes/wikimu/search.ts
var renderSearch = (ctx) => {
	const query = ctx.query || "";
	const posts = ctx.data || [];
	const pag = ctx.pagination || {
		currentPage: 1,
		totalPages: 1
	};
	const metaData = {
		title: `Pencarian: ${query} - Halaman ${pag.currentPage}`,
		description: `Hasil pencarian untuk kata kunci ${query}`,
		url: `/search?q=${encodeURIComponent(query)}`
	};
	if (posts.length === 0) {
		const emptyHtml = `
        <div style="max-width: 600px; margin: 50px auto; text-align: center;">
            <div style="font-size: 4rem; color: #ddd; margin-bottom: 20px;"><i class="fas fa-search"></i></div>
            <h2 style="margin-bottom: 10px; color: #333;">Tidak ditemukan</h2>
            <p style="color: #666; margin-bottom: 30px;">Tidak ada hasil untuk <strong>"${query}"</strong>.</p>
            <form action="/search" method="GET" style="position: relative;">
                <input type="text" name="q" value="${query}" style="width: 100%; padding: 12px 20px; border: 2px solid #eee; border-radius: 50px; outline: none;">
                <button type="submit" style="position: absolute; right: 5px; top: 5px; background: var(--mu-green-primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;"><i class="fas fa-arrow-right"></i></button>
            </form>
        </div>`;
		return renderLayout(`Tidak Ditemukan: ${query}`, emptyHtml, true, metaData);
	}
	const resultsHtml = posts.map((p) => {
		const cleanBody = (p.body || "").replace(/<[^>]+>/g, "").substring(0, 180) + "...";
		const href = `/${p.slug}`;
		const category = p.category || "Umum";
		return `
        <div class="search-result-item" style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #eee;">
            <div style="font-size: 0.85rem; color: #006C45; margin-bottom: 4px;">
                <a href="/${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}" style="text-decoration: none; color: inherit;">${category}</a> 
                <span style="color: #ccc;">&rsaquo;</span> 
                <span style="color: #666;">${new Date(p.created_at).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "short",
			day: "numeric"
		})}</span>
            </div>
            <h3 style="margin: 0 0 8px 0; font-family: 'Linux Libertine', serif; font-size: 1.3rem;">
                <a href="${href}" style="color: #1a0dab; text-decoration: none;">${p.title}</a>
            </h3>
            <p style="margin: 0; color: #4d5156; font-size: 0.95rem; line-height: 1.6;">${cleanBody}</p>
        </div>
        `;
	}).join("");
	let paginationHtml = "";
	if (pag.totalPages > 1) {
		const prevLink = pag.hasPrev ? `/search?q=${encodeURIComponent(query)}&page=${pag.currentPage - 1}` : "#";
		const nextLink = pag.hasNext ? `/search?q=${encodeURIComponent(query)}&page=${pag.currentPage + 1}` : "#";
		paginationHtml = `
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 15px;">
            ${pag.hasPrev ? `<a href="${prevLink}" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #333; background: #fff;">&laquo; Sebelumnya</a>` : `<span style="padding: 8px 16px; border: 1px solid #eee; border-radius: 4px; color: #ccc; cursor: not-allowed;">&laquo; Sebelumnya</span>`}
            
            <span style="font-size: 0.9rem; color: #666;">
                Halaman <strong>${pag.currentPage}</strong> dari <strong>${pag.totalPages}</strong>
            </span>

            ${pag.hasNext ? `<a href="${nextLink}" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #333; background: #fff;">Berikutnya &raquo;</a>` : `<span style="padding: 8px 16px; border: 1px solid #eee; border-radius: 4px; color: #ccc; cursor: not-allowed;">Berikutnya &raquo;</span>`}
        </div>
        `;
	}
	const content = `
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                <h1 style="font-size: 1.5rem; margin: 0; color: #333;">
                    Hasil pencarian: <span style="color: var(--mu-green-primary); font-style: italic;">"${query}"</span>
                </h1>
                <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #777;">
                    Ditemukan sekira ${pag.totalItems} artikel.
                </p>
            </div>

            <div class="search-results-list">
                ${resultsHtml}
            </div>
            
            ${paginationHtml}
        </div>
    `;
	return renderLayout(`Pencarian: ${query}`, content, true, metaData);
};
//#endregion
//#region src/cms/themes/wikimu/index.ts
var WikiMu = {
	id: "wikimu",
	name: "WikiMu Default",
	renderHome,
	renderSingle,
	renderPage,
	renderCategory,
	renderSearch,
	render404
};
//#endregion
//#region src/cms/themes/registry.ts
var availableThemes = [
	{
		"id": "labmu-default",
		"name": "labmu-default",
		"description": "No description"
	},
	{
		"id": "labmu-news",
		"name": "LabMu News Premium",
		"version": "1.0.0",
		"author": "LabMu Dev",
		"description": "Tema berita modern untuk ekosistem Muhammadiyah."
	},
	{
		"id": "labmu-pro",
		"name": "labmu-pro",
		"description": "No description"
	},
	{
		"id": "labmu-quran",
		"name": "labmu-quran",
		"description": "No description"
	},
	{
		"id": "wikimu",
		"name": "WikiMu (Wikipedia Clone)",
		"version": "1.0.0",
		"author": "LabMu Dev",
		"description": "Tema ensiklopedia dengan gaya Skin Vector klasik ala Wikipedia."
	}
];
var getActiveTheme = (id) => {
	const themes = {
		"labmu-default": LabMuDefault,
		"labmu-news": LabMuNews,
		"labmu-pro": LabMuPro,
		"labmu-quran": LabMuQuran,
		"wikimu": WikiMu
	};
	return themes[id] || themes["labmu-default"];
};
//#endregion
//#region src/cms/addons/seo/router.ts
var seoPlugin = new Hono();
async function getGlobalData$1(db) {
	let settings = {};
	let menus = [];
	try {
		const { results: settingRows } = await db.prepare("SELECT key, value FROM settings").all();
		if (settingRows) settingRows.forEach((row) => {
			settings[row.key] = row.value;
		});
		const { results: menuRows } = await db.prepare("SELECT * FROM menus ORDER BY order_num ASC").all();
		menus = menuRows || [];
	} catch (e) {
		console.error("SEO Plugin Data Error", e);
	}
	return {
		settings,
		menus
	};
}
async function getRenderer$1(db) {
	try {
		const activeThemeRow = await db.prepare("SELECT id FROM themes WHERE active = 1").first();
		return { Renderer: getActiveTheme(activeThemeRow ? activeThemeRow.id : "labmu-default") || getActiveTheme("labmu-default") };
	} catch (e) {
		return { Renderer: getActiveTheme("labmu-default") };
	}
}
seoPlugin.get("/tag/:keyword", async (c) => {
	const keyword = c.req.param("keyword");
	const cleanKeyword = decodeURIComponent(keyword).replace(/-/g, " ").toLowerCase();
	try {
		const db = c.env.DB;
		const { settings, menus } = await getGlobalData$1(db);
		const { Renderer } = await getRenderer$1(db);
		const { results: posts } = await db.prepare(`
            SELECT * FROM posts 
            WHERE (lower(tags) LIKE ? OR lower(title) LIKE ?) 
            AND status = 'publish' 
            ORDER BY created_at DESC
        `).bind(`%${cleanKeyword}%`, `%${cleanKeyword}%`).all();
		const title = `Tag: ${cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1)}`;
		const context = {
			site: settings,
			menus,
			data: posts || [],
			categoryName: title
		};
		if (Renderer && typeof Renderer.renderCategory === "function") return c.html(Renderer.renderCategory(context));
		else return c.html(Renderer.renderHome(context));
	} catch (e) {
		return c.text("Tag Error: " + e.message, 500);
	}
});
seoPlugin.get("/sitemap.xml", async (c) => {
	const db = c.env.DB;
	const origin = new URL(c.req.url).origin;
	const urls = [];
	urls.push({
		loc: `${origin}/`,
		lastmod: (/* @__PURE__ */ new Date()).toISOString(),
		priority: "1.0"
	});
	try {
		const { results: pages } = await db.prepare("SELECT slug, updated_at, created_at FROM pages WHERE status='publish'").all();
		if (pages) pages.forEach((p) => urls.push({
			loc: `${origin}/${p.slug}`,
			lastmod: new Date(p.updated_at || p.created_at).toISOString(),
			priority: "0.8"
		}));
	} catch (e) {}
	try {
		const { results: posts } = await db.prepare("SELECT slug, updated_at, created_at FROM posts WHERE status='publish' ORDER BY created_at DESC").all();
		if (posts) posts.forEach((p) => urls.push({
			loc: `${origin}/${p.slug}`,
			lastmod: new Date(p.updated_at || p.created_at).toISOString(),
			priority: "0.9"
		}));
	} catch (e) {}
	try {
		const { results: cats } = await db.prepare("SELECT DISTINCT category FROM posts WHERE status='publish'").all();
		if (cats) cats.forEach((c) => {
			if (c.category) urls.push({
				loc: `${origin}/${c.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
				lastmod: (/* @__PURE__ */ new Date()).toISOString(),
				priority: "0.6"
			});
		});
	} catch (e) {}
	try {
		const { results: tagsRow } = await db.prepare("SELECT tags FROM posts WHERE status='publish'").all();
		const uniqueTags = /* @__PURE__ */ new Set();
		if (tagsRow) tagsRow.forEach((row) => {
			if (row.tags) row.tags.split(",").forEach((t) => uniqueTags.add(t.trim()));
		});
		uniqueTags.forEach((t) => {
			urls.push({
				loc: `${origin}/tag/${t.toLowerCase().replace(/\s+/g, "-")}`,
				lastmod: (/* @__PURE__ */ new Date()).toISOString(),
				priority: "0.5"
			});
		});
	} catch (e) {}
	let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
	urls.forEach((u) => xml += `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`);
	xml += `</urlset>`;
	return c.text(xml, 200, { "Content-Type": "application/xml" });
});
seoPlugin.get("/robots.txt", (c) => {
	const origin = new URL(c.req.url).origin;
	return c.text(`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml`, 200, { "Content-Type": "text/plain" });
});
//#endregion
//#region src/cms/addons/chat-ai/router.ts
var app$2 = new Hono();
var EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";
var TEXT_GEN_MODEL = "@cf/meta/llama-3-8b-instruct";
app$2.post("/sync", async (c) => {
	try {
		if (!c.env.AI || !c.env.VECTORIZE_INDEX) return c.json({ message: "Konfigurasi AI/Vectorize belum aktif." });
		const { results } = await c.env.DB.prepare("SELECT * FROM posts WHERE status = 'publish'").all();
		if (!results || results.length === 0) return c.json({ message: "Tidak ada artikel di D1 untuk di-sync." });
		const vectors = [];
		let successCount = 0;
		for (const post of results) {
			const isiArtikel = post.content || post.body || post.post_content || post.text || "";
			if (!isiArtikel) continue;
			const cleanText = String(isiArtikel).replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().substring(0, 500);
			if (cleanText.length < 20) continue;
			try {
				const embedResult = await c.env.AI.run(EMBEDDING_MODEL, { text: [`Judul: ${post.title}\nIsi: ${cleanText}`] });
				if (embedResult?.data?.[0]) {
					vectors.push({
						id: `post-${post.id}`,
						values: embedResult.data[0],
						metadata: { title: post.title }
					});
					successCount++;
				}
			} catch (err) {}
		}
		if (vectors.length > 0) await c.env.VECTORIZE_INDEX.upsert(vectors);
		return c.json({
			success: true,
			message: `Sukses! ${successCount} artikel masuk Vectorize Tarjih.`
		});
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
app$2.post("/ask", async (c) => {
	try {
		const message = (await c.req.json())?.message || "";
		if (!message) return c.json({ reply: "Silakan ketik pertanyaan Anda." });
		let contextTarjih = "";
		let contextQuran = "";
		let sources = [];
		let foundTarjih = false;
		const getArticleLink = (art) => {
			const slug = art.slug || art.post_name;
			return slug ? `/${slug}` : `/?p=${art.id}`;
		};
		const queryVector = (await c.env.AI.run(EMBEDDING_MODEL, { text: [message] })).data[0];
		if (c.env.VECTORIZE_INDEX) try {
			const searchResults = await c.env.VECTORIZE_INDEX.query(queryVector, {
				topK: 3,
				returnMetadata: true
			});
			if (searchResults?.matches && searchResults.matches.length > 0) {
				const validMatches = searchResults.matches.filter((m) => m.score > .25);
				for (const match of validMatches.slice(0, 2)) {
					const postId = Number(String(match.id).replace(/\D/g, ""));
					if (!postId) continue;
					const art = await c.env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(postId).first();
					if (art) {
						const isiArtikel = art.content || art.body || art.post_content || art.text || "";
						const fullContent = String(isiArtikel).replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().substring(0, 3e3);
						contextTarjih += `[Artikel: ${art.title}]\nIsi:\n${fullContent}\n\n`;
						sources.push(`<a href="${getArticleLink(art)}" target="_blank" style="color:#006C45; text-decoration:underline; font-weight:600;">${art.title}</a>`);
						foundTarjih = true;
					}
				}
			}
		} catch (vecErr) {
			console.error("Vectorize Tarjih Error:", vecErr);
		}
		if (!foundTarjih) {
			const stopWords = [
				"dengan",
				"adalah",
				"apakah",
				"bolehkah",
				"bagaimana",
				"dalam",
				"untuk",
				"yang",
				"dari",
				"pada",
				"atau",
				"dan",
				"ini",
				"itu",
				"cara"
			];
			let keywords = message.toLowerCase().replace(/[^\w\s]/gi, "").split(" ").filter((w) => w.length > 3 && !stopWords.includes(w)).reverse();
			for (const kw of keywords) {
				const res = await c.env.DB.prepare("SELECT * FROM posts WHERE title LIKE ? LIMIT 1").bind(`%${kw}%`).all();
				if (res.results && res.results.length > 0) {
					const art = res.results[0];
					const isiArtikel = art.content || art.body || art.post_content || art.text || "";
					contextTarjih += `[Artikel: ${art.title}]\nIsi:\n${String(isiArtikel).replace(/<[^>]*>?/gm, " ").substring(0, 3e3)}\n\n`;
					sources.push(`<a href="${getArticleLink(art)}" target="_blank" style="color:#006C45; text-decoration:underline; font-weight:600;">${art.title}</a>`);
					foundTarjih = true;
					break;
				}
			}
		}
		if (c.env.VECTOR_INDEX) try {
			const quranSearch = await c.env.VECTOR_INDEX.query(queryVector, {
				topK: 2,
				returnMetadata: true
			});
			if (quranSearch?.matches) {
				const validQuran = quranSearch.matches.filter((m) => m.score > .3);
				for (const match of validQuran) {
					const title = match.metadata?.title || match.metadata?.surat || "Ayat/Dalil";
					const content = match.metadata?.content || match.metadata?.text || match.metadata?.terjemahan || "";
					if (content) {
						contextQuran += `[Surat/Ayat: ${title}]\nTerjemahan/Tafsir: ${content}\n\n`;
						sources.push(`<span style="color:#006C45; font-style:italic; font-weight:600;">Dalil: ${title}</span>`);
					}
				}
			}
		} catch (e) {
			console.error("Quran Vector Error:", e);
		}
		const systemPrompt = `Anda adalah ChatMu, Asisten AI resmi Ensiklopedia Tarjih Muhammadiyah.
Tugas Anda: Menjawab pertanyaan berdasarkan DATA FATWA TARJIH, dan perkuat dengan dalil dari DATA DALIL QURAN jika tersedia dan relevan.

DATA FATWA TARJIH:
${contextTarjih || "[[KOSONG]]"}

DATA DALIL QURAN:
${contextQuran || "[[BELUM_ADA_DALIL_YANG_DITEMUKAN]]"}

ATURAN WAJIB (HARAM DILANGGAR):
1. DATA FATWA TARJIH adalah sumber utama untuk menentukan hukum (Sah/Boleh/Haram/Dilarang). 
2. Jika DATA DALIL tersedia, selipkan ke dalam penjelasan Anda dengan bahasa yang mengalir dan santun.
3. Jangan pernah mengarang hukum atau ayat di luar teks yang diberikan.
4. Jika DATA FATWA TARJIH tertulis [[KOSONG]], jawab persis seperti ini: "Maaf, belum ada artikel atau putusan spesifik mengenai hal tersebut di database Tarjih kami."`;
		const response = await c.env.AI.run(TEXT_GEN_MODEL, {
			messages: [{
				role: "system",
				content: systemPrompt
			}, {
				role: "user",
				content: message
			}],
			temperature: .1,
			max_tokens: 1200
		});
		let finalReply = response?.response || response?.result || (typeof response === "string" ? response : "Maaf, AI gagal menyusun jawaban.");
		return c.json({
			reply: String(finalReply),
			sources: sources.length > 0 ? [...new Set(sources)] : void 0
		});
	} catch (err) {
		console.error("Ask Error Fatal:", err);
		return c.json({ reply: `Terjadi kendala saat memproses: ${err.message}` });
	}
});
app$2.get("/hello", async (c) => {
	if (!c.env.AI) return c.json({ reply: "⚠️ Sistem ChatMu Offline." }, 503);
	return c.json({ reply: "Assalamu'alaikum! Saya ChatMu. Ada yang bisa saya bantu terkait fatwa atau artikel di web ini?" });
});
//#endregion
//#region src/cms/addons/chat-ai/admin-page.ts
var chatAdminPageCode = `
    // 1. Set view aktif ke chatmu
    this.view = 'chatmu-admin';
    
    // 2. Cek apakah elemen sudah pernah dirender
    const viewId = 'plugin-view-chatmu';
    if (!document.getElementById(viewId)) {
        const container = document.querySelector('main');
        const el = document.createElement('div');
        el.id = viewId;
        
        // 3. Bind display dengan Alpine x-show
        el.setAttribute('x-show', "view === 'chatmu-admin'");
        el.className = 'animate-fade';
        
        // 4. UI HTML untuk Settings AI
        el.innerHTML = \`
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="margin:0; font-size:24px; color:#1f2937;">ChatMu AI Settings</h2>
            </div>

            <div style="background:white; padding:25px; border:1px solid #e5e7eb; border-radius:8px; max-width:700px;">
                <h3 style="margin-top:0; color:#006C45;"><i class="fas fa-brain"></i> Pelatihan AI (Vector RAG)</h3>
                <p style="color:#6b7280; font-size:14px; margin-bottom:20px; line-height:1.6;">
                    Fitur ini menggunakan <strong>Cloudflare Vectorize</strong> dan <strong>Llama-3</strong>. <br>
                    Klik tombol di bawah ini untuk menyinkronkan data artikel (Posts) ke dalam database Vector. 
                    ChatMu AI akan membaca data ini untuk menjawab pertanyaan pengunjung di halaman publik.
                </p>
                
                <div x-data="{ isSyncing: false, message: '' }">
                    <button @click="
                        if(!confirm('Mulai proses sinkronisasi data artikel ke otak AI?')) return;
                        isSyncing = true; 
                        message = 'Mengekstrak dan memproses artikel...';
                        fetch('/api/chat/sync', { method: 'POST' })
                        .then(res => res.json())
                        .then(data => { message = '✅ ' + (data.message || 'Sinkronisasi berhasil.'); })
                        .catch(e => { message = '❌ Gagal sync: ' + e.message; })
                        .finally(() => { isSyncing = false; });
                    " :disabled="isSyncing" 
                      style="background:#2563eb; color:white; border:none; padding:12px 24px; border-radius:6px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px;">
                        <i class="fas" :class="isSyncing ? 'fa-spinner fa-spin' : 'fa-sync'"></i>
                        <span x-text="isSyncing ? 'Menyinkronkan Data...' : 'Sync Data Artikel Sekarang'"></span>
                    </button>
                    
                    <div x-show="message" 
                         style="margin-top:20px; padding:15px; border-radius:6px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; font-weight:500;">
                        <span x-text="message"></span>
                    </div>
                </div>
            </div>
        \`;
        
        container.appendChild(el);
        if(window.Alpine) Alpine.initTree(el);
    }
`;
//#endregion
//#region src/cms/addons/index.ts
function registerAddons(app) {
	console.log("🔌 Registering Addons...");
	registerPluginMenu({
		group: "Plugins",
		title: "Sync Tarjih",
		href: "/admin/tarjih-sync",
		icon: "fas fa-sync-alt"
	});
	registerPluginMenu({
		group: "Plugins",
		title: "SEOMu Pro",
		icon: "fas fa-search-dollar",
		actionCode: `
        this.view = 'seomu';
        const viewId = 'plugin-view-seomu';
        if (!document.getElementById(viewId)) {
            const container = document.querySelector('main');
            const el = document.createElement('div');
            el.id = viewId;
            el.setAttribute('x-show', "view === 'seomu'");
            el.innerHTML = '<h1>SEOMu Dashboard</h1><p>Fitur SEO ada di sini...</p>'; 
            container.appendChild(el);
            if(window.Alpine) Alpine.initTree(el);
        }
    `
	});
	registerPluginMenu({
		group: "Plugins",
		title: "ChatMu AI",
		icon: "fas fa-brain",
		actionCode: chatAdminPageCode
	});
	app.route("/api/import/wp", wpRouter);
	app.route("/", seoPlugin);
	app.route("/chat-public", app$2);
}
//#endregion
//#region src/cms/modules/admin/ui/blocks/styles.ts
var adminStyles = `
  :root { 
    --wp-dark: #1d2327; 
    --wp-light: #2c3338; 
    --wp-blue: #2271b1; 
    --wp-blue-h: #135e96; 
    --bg: #f0f0f1; 
    --txt: #3c434a; 
    --border: #c3c4c7; 
  }
  
  * { box-sizing: border-box; }
  body { margin:0; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:var(--bg); color:var(--txt); font-size:13px; height:100vh; overflow:hidden; }
  
  /* LAYOUT UTAMA */
  .app-layout { display:grid; height:100vh; transition: grid-template-columns 0.3s ease; }
  .main-content { overflow-y:auto; padding:20px; background: var(--bg); position: relative; }
  
  /* SIDEBAR */
  .sidebar { background:var(--wp-dark); color:#fff; display:flex; flex-direction:column; overflow-x:hidden; transition: width 0.3s; }
  
  /* BRAND (Logo) */
  .brand { 
      height: 55px; /* Sedikit lebih tinggi */
      display:flex; 
      align-items:center; 
      padding-left: 20px; /* Jarak kiri lebih lega */
      font-weight:bold; 
      background:#000; 
      white-space:nowrap; 
      overflow:hidden; 
      font-size: 14px;
  }
  
  /* MENU ITEM */
  .menu-item { 
      height: 45px; /* Tinggi tombol diperbesar biar enak diklik */
      display:flex; 
      align-items:center; 
      padding: 0 20px; /* Jarak Kiri-Kanan lebih lega (sebelumnya 14px) */
      gap: 12px; /* Jarak antara Icon dan Teks */
      color:#f0f0f1; 
      cursor:pointer; 
      border-left:4px solid transparent; 
      white-space:nowrap; 
      overflow:hidden; 
      text-decoration:none;
      transition: all 0.2s;
  }
  .menu-item:hover, .menu-item.active { background:var(--wp-light); color:#72aee6; }
  .menu-item.active { border-left-color:#72aee6; font-weight:600; }
  .menu-item i { width: 20px; text-align: center; font-size: 15px; } /* Lebar icon fix biar lurus */
  
  .group-title { margin:20px 20px 8px; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.5px; white-space:nowrap; font-weight:600; }

  /* USER INFO SECTION */
  .user-info {
      padding: 20px; 
      font-size: 12px; 
      color: #aaa; 
      border-bottom: 1px solid #333;
      background: rgba(255,255,255,0.03);
  }

  /* COLLAPSED STATE */
  .collapsed .menu-txt, .collapsed .brand span, .collapsed .group-title, .collapsed .user-info { opacity: 0; pointer-events: none; display: none; }
  .collapsed .brand { padding-left: 15px; }
  .collapsed .menu-item { padding: 0 15px; justify-content:center; }
  .collapsed .menu-item i { margin:0; }
  
  /* TOPBAR */
  .topbar { background:#fff; height:50px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; padding:0 20px; }
  
  /* COMPONENTS (Tetap) */
  .card { background:#fff; border:1px solid var(--border); padding:15px; margin-bottom:20px; box-shadow:0 1px 1px rgba(0,0,0,0.04); }
  .btn { padding:6px 12px; border:1px solid var(--wp-blue); background:var(--wp-blue); color:#fff; border-radius:3px; cursor:pointer; display:inline-flex; align-items:center; gap:5px; font-size:13px; text-decoration:none; }
  .btn:hover { background:var(--wp-blue-h); }
  .btn-icon { background:transparent; border:none; color:#555; font-size:16px; cursor:pointer; padding: 5px 10px; }
  .input { width:100%; padding:6px; border:1px solid #8c8f94; border-radius:4px; margin-bottom:10px; font-size:13px; }
  .badge { padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold; text-transform:uppercase; }
  
  /* === MODAL CENTER === */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex; /* <--- INI WAJIB ADA */
    align-items: center;
    justify-content: center;
  }
  .modal-box {
    background: #fff; width: 90%; max-width: 1100px; height: 85%; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:15px 20px; border-bottom:1px solid #eee; background:#fff; }
  .modal-body { flex:1; display:flex; overflow:hidden; }
  .modal-grid-area { flex:1; overflow-y:auto; padding:20px; background:#f0f0f1; border-right:1px solid #ddd; }
  .modal-sidebar-area { width:320px; background:#fff; display:flex; flex-direction:column; padding:20px; overflow-y:auto; flex-shrink:0; }
  .media-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap:12px; }
  .media-item { cursor:pointer; border:4px solid transparent; overflow:hidden; aspect-ratio:1/1; position:relative; background-color:#e5e5e5; background-image: radial-gradient(#ccc 1px, transparent 1px); background-size: 10px 10px; border-radius:4px; transition: all 0.2s; }
  .media-item.active { border-color:var(--wp-blue); box-shadow:0 0 0 2px #fff inset; }
  .media-item:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
  .media-check { position:absolute; top:5px; right:5px; background:var(--wp-blue); color:white; width:24px; height:24px; text-align:center; line-height:24px; border-radius:50%; font-size:12px; box-shadow:0 2px 4px rgba(0,0,0,0.2); }
  
  /* LOGIN PAGE */
  .login-page { display: flex; justify-content: center; align-items: center; height: 100vh; background: #e9ecef; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; }
  .login-box { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 350px; text-align: center; }
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/sidebar.ts
var sidebarBlock = `
<aside class="sidebar" :class="!sidebarOpen ? 'collapsed' : ''">
  <div class="brand">
    <i class="fas fa-flask"></i> <span style="margin-left:12px;" x-show="sidebarOpen">LabMu CMS</span>
  </div>

  <nav style="flex:1; overflow-y:auto; overflow-x:hidden; padding-top:10px;">
    
    <a class="menu-item" :class="view=='dash'?'active':''" @click="view='dash'" title="Dashboard">
      <i class="fas fa-tachometer-alt"></i> <span class="menu-txt">Dashboard</span>
    </a>
    
    <template x-for="groupName in ['Content', 'Appearance', 'System', 'Plugins']">
        <div x-show="(window.adminMenus || []).some(m => m.group === groupName)">
            <div class="group-title" x-text="groupName"></div>
            
            <template x-for="menu in (window.adminMenus || []).filter(m => m.group === groupName)">
                <template x-if="!menu.role || menu.role.includes(userRole)">
                    <div>
                        <template x-if="!menu.href">
                            <a class="menu-item" 
                               :class="view == menu.view ? 'active' : ''" 
                               @click="view = menu.view; if(menu.action) menu.action()" 
                               :title="menu.title">
                                <i :class="menu.icon"></i> 
                                <span class="menu-txt" x-text="menu.title"></span>
                            </a>
                        </template>

                        <template x-if="menu.href">
                            <a :href="menu.href" class="menu-item" :title="menu.title">
                                <i :class="menu.icon"></i> 
                                <span class="menu-txt" x-text="menu.title"></span>
                            </a>
                        </template>
                    </div>
                </template>
            </template>
        </div>
    </template>

  </nav>

  <a class="menu-item" @click="logout()" style="border-top:1px solid #444; margin-top:auto; height:50px;" title="Logout">
    <i class="fas fa-sign-out-alt"></i> <span class="menu-txt">Logout</span>
  </a>
</aside>
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/dashboard.page.ts
var dashboardPage = `
<div x-show="view==='dash'">
  
  <div style="background:#fff; padding:30px; border-radius:8px; border-left:5px solid var(--wp-blue); box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:30px;">
     <h2 style="margin-top:0;">Selamat Datang di LabMu, Admin! 👋</h2>
     <p style="color:#666; margin-bottom:0;">Sistem berjalan normal. Siap untuk mempublikasikan ide-ide hebat hari ini?</p>
  </div>

  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px;">
      
      <div class="card" style="text-align:center; padding:30px; cursor:pointer; transition:transform 0.2s;" @click="view='posts'; loadPosts()">
        <div style="background:#eaf6ff; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px auto;">
            <i class="fas fa-pen-nib fa-2x" style="color:var(--wp-blue);"></i>
        </div>
        <h1 style="margin:0; font-size:3em; color:#333;" x-text="posts.length">0</h1>
        <small style="color:#888; text-transform:uppercase; font-weight:bold; letter-spacing:1px;">Articles</small>
      </div>
      
      <div class="card" style="text-align:center; padding:30px; cursor:pointer;" @click="view='themes'">
        <div style="background:#e8f8f5; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px auto;">
           <i class="fas fa-paint-brush fa-2x" style="color:#2ecc71;"></i>
        </div>
        <h3 style="margin:0">Theme</h3>
        <small style="color:#888;">Customize Look</small>
      </div>
  </div>
  
  <div style="margin-top:30px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
     <div class="card">
        <h4><i class="fas fa-server"></i> System Status</h4>
        <table style="width:100%; font-size:13px; color:#555;">
           <tr><td style="padding:5px 0;">Database</td><td style="text-align:right; color:green;">Connected (D1)</td></tr>
           <tr><td style="padding:5px 0;">Storage</td><td style="text-align:right; color:orange;">Disabled</td></tr>
           <tr><td style="padding:5px 0;">Version</td><td style="text-align:right;">LabMu v1.0.0</td></tr>
        </table>
     </div>
     <div class="card">
        <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
        <button @click="openEditor()" class="btn" style="width:100%; margin-bottom:10px;"><i class="fas fa-plus"></i> Tulis Artikel Baru</button>
        <a href="/" target="_blank" class="btn" style="width:100%; background:#333; text-align:center; text-decoration:none; display:block;"><i class="fas fa-external-link-alt"></i> Lihat Website</a>
     </div>
  </div>
</div>
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/posts.page.ts
var postsPage = `
<div x-show="view==='posts'" class="animate-fade"
     x-data="{ 
        /* 1. STATE LOKAL */
        posts: [], 
        uniqueCategories: [], 
        selectedIds: [], 
        filterCategory: '', 
        bulkAction: '',
        selectAll: false,
        isLoading: false,
        searchQuery: '',
        
        /* STATE PAGINATION */
        currentPage: 1,
        itemsPerPage: 50,

        /* 2. GETTER: Filter Kategori & Search */
        get filteredPosts() {
            let result = this.posts || [];
            if (this.filterCategory) {
                result = result.filter(p => p.category === this.filterCategory);
            }
            if (this.searchQuery && this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase();
                result = result.filter(p => 
                    (p.title && p.title.toLowerCase().includes(q)) || 
                    (p.category && p.category.toLowerCase().includes(q)) || 
                    (p.tags && p.tags.toLowerCase().includes(q)) ||
                    (p.slug && p.slug.toLowerCase().includes(q))
                );
            }
            return result;
        },

        get paginatedPosts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredPosts.slice(start, end);
        },

        get totalPages() {
            return Math.ceil(this.filteredPosts.length / this.itemsPerPage) || 1;
        },

        /* 3. LOAD DATA */
        async loadData() {
            this.isLoading = true;
            try {
                const token = localStorage.getItem('labmu_token');
                const res = await fetch('/api/posts?t=' + Date.now(), {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                if (!res.ok) throw new Error('Gagal load data');
                
                const json = await res.json();
                const rawData = Array.isArray(json) ? json : (json.results || []);
                
                this.posts = rawData.map(p => ({
                    ...p,
                    category: (p.category && p.category !== 'null' && p.category !== '') ? p.category : 'Uncategorized',
                    tags: (p.tags && p.tags !== 'null' && p.tags !== '') ? p.tags : '-',
                    status: (p.status && p.status.toLowerCase().includes('pub')) ? 'publish' : 'draft',
                    body: p.body || p.content || '' 
                }));
                
                const cats = this.posts.map(p => p.category).filter(c => c && c !== 'Uncategorized');
                this.uniqueCategories = ['Uncategorized', ...new Set(cats)];

            } catch (e) {
                console.error('Error loadData:', e);
                this.posts = [];
            } finally {
                this.isLoading = false;
            }
        },

        /* 4. LOGIKA SELECT ALL */
        toggleAll() {
            this.selectAll = !this.selectAll;
            this.selectedIds = this.selectAll ? this.paginatedPosts.map(p => p.id) : [];
        },

        /* 5. DELETE SINGLE */
        async deletePost(id) {
            if(!confirm('Hapus post ini secara permanen?')) return;
            try {
                const token = localStorage.getItem('labmu_token');
                const res = await fetch('/api/posts/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if(res.ok) {
                    this.posts = this.posts.filter(p => p.id !== id);
                    this.selectedIds = this.selectedIds.filter(sid => sid !== id);
                    
                    if(this.paginatedPosts.length === 0 && this.currentPage > 1) {
                        this.currentPage--;
                    }
                } else {
                    alert('Gagal menghapus data.');
                }
            } catch(e) { alert('Gagal koneksi hapus'); }
        },

        /* 6. BULK DELETE */
        async applyBulkAction() {
            if (this.bulkAction === 'delete' && this.selectedIds.length > 0) {
                if(confirm('Hapus item terpilih?')) {
                    const token = localStorage.getItem('labmu_token');
                    await fetch('/api/posts/' + this.selectedIds.join(','), { 
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    
                    this.selectedIds = [];
                    this.selectAll = false;
                    await this.loadData();
                }
            }
        },

        viewPost(slug) {
            if(!slug) return alert('Slug tidak valid');
            window.open('/' + slug, '_blank');
        },

        /* ========================================== */
        /* 7. PEMANGGIL MODERN EDITOR SAKTI & AKURAT  */
        /* ========================================== */
        async openEditorCerdas(p) {
            /* Jika Editor sudah siap, langsung buka tanpa babibu */
            if (typeof window.openModernEditor === 'function') {
                window.openModernEditor(p);
                return;
            }

            /* Pencarian Target Klik Secara Brutal & Akurat */
            let targetMenu = null;
            const allElements = document.querySelectorAll('*');
            
            for (let el of allElements) {
                /* Cari elemen yang mengandung teks persis 'Tulis (Modern)' */
                if (el.textContent && el.textContent.trim() === 'Tulis (Modern)') {
                    /* Ambil tag Link <a> atau List <li> pembungkusnya agar kliknya valid */
                    targetMenu = el.closest('a') || el.closest('li') || el.closest('button') || el;
                    break;
                }
            }

            if (targetMenu) {
                /* Munculkan loading spinner di tabel agar user tahu sistem sedang bekerja */
                this.isLoading = true;

                /* Simulasi klik seakan-akan diklik oleh mouse manusia */
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                targetMenu.dispatchEvent(clickEvent);

                /* Polling: Pantau terus sampai script editor ter-load (Maks 6 detik) */
                let attempts = 0;
                const timer = setInterval(() => {
                    attempts++;
                    if (typeof window.openModernEditor === 'function') {
                        clearInterval(timer);
                        this.isLoading = false;
                        window.openModernEditor(p);
                    } else if (attempts >= 30) {
                        clearInterval(timer);
                        this.isLoading = false;
                        alert('Koneksi internet lambat. Modern Editor gagal dipancing, dialihkan ke editor standar...');
                        this.fallbackToOldEditor(p);
                    }
                }, 200);

            } else {
                /* Jika menunya benar-benar tidak ditemukan sama sekali di sidebar */
                this.fallbackToOldEditor(p);
            }
        },

        /* Fungsi bantuan untuk fallback ke Editor Lama jika terjadi kegagalan */
        fallbackToOldEditor(p) {
            if (!p) {
                this.view = 'add'; 
                this.editingId = null;
                this.form = {title:'', slug:'', body:'', status:'draft', category:'', tags:'', featured_image:''};
                setTimeout(()=> { if(window.initCmsEditor) window.initCmsEditor('editor', ''); }, 100);
            } else {
                this.form = { ...p, body: p.body || '', featured_image_caption: p.featured_image_caption || '' };
                this.editingId = p.id;
                if (this.form.created_at) {
                    const d = new Date(this.form.created_at);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    this.form.date = d.toISOString().slice(0, 16);
                }
                this.view = 'add'; 
                setTimeout(() => {
                    if (typeof window.initCmsEditor === 'function') window.initCmsEditor('editor', this.form.body, (c) => this.form.body = c);
                    else if (window.cmsEditor) window.cmsEditor.setContents(this.form.body);
                }, 100);
            }
        }
     }" 
     x-init="loadData(); $watch('currentPage', () => selectAll = false)">
     
  <div style="display:flex; justify-content:space-between; margin-bottom:15px; align-items:center;">
    <h2 style="margin:0;">All Posts</h2>
    <div style="display:flex; gap:10px;">
        <button @click="loadData()" class="btn" style="background:#f1f5f9; color:#475569;" title="Refresh Data">
            <i class="fas fa-sync" :class="isLoading ? 'fa-spin' : ''"></i>
        </button>
        <button @click="openEditorCerdas(null)" class="btn" style="background:#2271b1; color:#fff;">
            <i class="fas fa-plus"></i> Add New
        </button>
    </div>
  </div>

  <div style="margin-bottom:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
      <select x-model="bulkAction" class="input" style="width:auto; margin:0; padding:4px 8px; font-size:13px;">
          <option value="">Bulk Actions</option>
          <option value="delete">Hapus</option>
      </select>
      <button @click="applyBulkAction()" class="btn" style="padding:4px 12px; font-size:13px;">Apply</button>
      
      <select class="input" style="width:auto; margin:0; padding:4px 8px; font-size:13px; margin-left:10px;" 
              x-model="filterCategory" @change="currentPage = 1">
          <option value="">Semua Kategori</option>
          <template x-for="cat in uniqueCategories">
              <option :value="cat" x-text="cat"></option>
          </template>
      </select>

      <input type="text" x-model="searchQuery" @input="currentPage = 1" placeholder="Cari judul, kategori, atau tag..." 
             class="input" style="width: 250px; margin: 0 0 0 auto; padding: 5px 12px; font-size: 13px; border-radius: 6px; border: 1px solid #ccc; outline: none;">
  </div>

  <div class="card" style="padding:0; overflow:hidden; border: 1px solid #ccc; background:#fff;">
    <table class="wp-table" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr style="background:#f8f9fa; border-bottom:2px solid #ddd;">
          <th width="30" style="text-align:center; padding:12px;">
            <input type="checkbox" @click="toggleAll()" :checked="selectAll">
          </th>
          <th style="text-align:left; padding:12px;">Title</th>
          <th style="text-align:left; width:140px;">Date</th>
          <th style="text-align:left; width:120px;">Category</th>
          <th style="text-align:left; width:100px;">Tags</th>
          <th width="80" style="text-align:center;">Status</th>
          <th width="140" style="text-align:center; padding:12px;">Action</th>
        </tr>
      </thead>
      <tbody>
        <template x-for="p in paginatedPosts" :key="p.id">
          <tr style="border-bottom:1px solid #eee;" 
              :style="selectedIds.includes(p.id) ? 'background:#f0f7ff' : ''">
            
            <td style="text-align:center; padding:12px;">
                <input type="checkbox" :value="p.id" x-model="selectedIds">
            </td>
            
            <td style="padding:12px;">
              <b x-text="p.title" @click="openEditorCerdas(p)" style="color:#2271b1; font-size:14px; display:block; margin-bottom:4px; cursor:pointer;"></b>
              <div style="font-size:11px; color:#666; font-family:monospace;" x-text="'/'+p.slug"></div>
            </td>
            
            <td style="font-size:12px;">
                <template x-if="p.created_at">
                    <div>
                        <span style="font-weight:600; color:#333;">
                            <i class="far fa-calendar-alt" style="margin-right:3px; color:#888;"></i>
                            <span x-text="new Date(p.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})"></span>
                        </span>
                    </div>
                </template>
            </td>
            
            <td style="font-size:12px; color:#555;" x-text="p.category"></td>
            <td style="font-size:12px; color:#555;" x-text="p.tags"></td>
            
            <td style="text-align:center;">
              <span :style="p.status=='publish' ? 'background:#d1e7dd; color:#0f5132' : 'background:#fff3cd; color:#664d03'"
                    style="padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold; text-transform:uppercase;" 
                    x-text="p.status"></span>
            </td>
            
            <td style="padding:8px; text-align:center;">
              <div style="display:flex; align-items:center; justify-content:center; gap:15px;">
                <button @click="viewPost(p.slug)" title="Lihat" style="color:#2271b1; background:none; border:none; cursor:pointer;">
                    <i class="fas fa-eye"></i>
                </button>
                <button @click="openEditorCerdas(p)" title="Edit" style="color:#f39c12; background:none; border:none; cursor:pointer;">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button @click="deletePost(p.id)" title="Hapus" style="color:#e74c3c; background:none; border:none; cursor:pointer;">
                    <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div x-show="isLoading" style="text-align:center; padding:20px; color:#666;">
        <i class="fas fa-spinner fa-spin"></i> Memuat Editor Modern...
    </div>
    
    <div x-show="!isLoading && filteredPosts.length === 0" style="text-align:center; padding:40px; color:#999;">
        Belum ada atau tidak ditemukan postingan.
    </div>

    <div x-show="filteredPosts.length > 0" style="display:flex; justify-content:space-between; align-items:center; padding:15px; background:#f8f9fa; border-top:1px solid #eee;">
        <div style="font-size: 13px; color: #666;">
            Menampilkan <b x-text="filteredPosts.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1"></b> - 
            <b x-text="Math.min(currentPage * itemsPerPage, filteredPosts.length)"></b> 
            dari <b x-text="filteredPosts.length"></b> artikel
        </div>
        
        <div style="display:flex; gap: 5px; align-items:center;">
            <button @click="if(currentPage > 1) currentPage--" :disabled="currentPage === 1" 
                    class="btn" style="padding: 4px 12px; font-size: 13px; background: #fff; border: 1px solid #ccc; cursor: pointer; border-radius: 4px;" 
                    :style="currentPage === 1 ? 'opacity:0.5; cursor:not-allowed;' : ''">
                <i class="fas fa-chevron-left"></i> Prev
            </button>
            
            <span style="padding: 0 10px; font-size: 13px; font-weight: bold; color:#444;" x-text="'Halaman ' + currentPage + ' dari ' + totalPages"></span>
            
            <button @click="if(currentPage < totalPages) currentPage++" :disabled="currentPage === totalPages" 
                    class="btn" style="padding: 4px 12px; font-size: 13px; background: #fff; border: 1px solid #ccc; cursor: pointer; border-radius: 4px;" 
                    :style="currentPage === totalPages ? 'opacity:0.5; cursor:not-allowed;' : ''">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>

  </div>
</div>
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/editor.page.ts
var editorPage = `
<div x-show="view === 'add' || view === 'edit'" class="animate-fade"
     style="padding-bottom:80px; position:relative;"
     x-data="{
         // ===============================================
         // 1. DATA & STATE (LOGIC TETAP/STABLE)
         // ===============================================
         mediaModalOpen: false,
         manageModalOpen: false,
         manageTarget: '',      
         
         mediaList: [],
         uniqueCategories: [], 
         uniqueTags: [],        
         managerItems: [],
         allPosts: [],          

         // STATE MEDIA
         mediaTab: 'library', 
         uploadFile: null,
         uploadPreview: null,
         selectedMedia: null,
         searchQuery: '',
         
         // Form Metadata
         mediaForm: { title: '', alt: '', caption: '', description: '' },

         // ===============================================
         // 2. LOAD DATA
         // ===============================================
         async loadGlobalData() {
             try {
                 const token = localStorage.getItem('labmu_token');
                 const res = await fetch('/api/posts?t=' + Date.now(), {
                     headers: { 'Authorization': 'Bearer ' + token }
                 });
                 if (res.ok) {
                     const json = await res.json();
                     const posts = Array.isArray(json) ? json : (json.results || []);
                     this.allPosts = posts; 

                     const cats = posts.map(p => p.category).filter(c => c && c !== 'Uncategorized');
                     this.uniqueCategories = ['Uncategorized', ...new Set(cats)].sort();

                     const allTags = posts.flatMap(p => (p.tags || '').split(','));
                     const cleanedTags = allTags.map(t => t.trim()).filter(t => t && t !== '-' && t.length > 2);
                     this.uniqueTags = [...new Set(cleanedTags)].sort();
                 }
             } catch(e) { console.error('Load Error', e); }
         },

         // ===============================================
         // 3. MEDIA LOGIC
         // ===============================================
         async openMediaSelector() {
             this.mediaModalOpen = true;
             this.mediaTab = 'library';
             this.selectedMedia = null;
             this.searchQuery = '';
             this.mediaForm = { title:'', alt:'', caption:'', description:'' }; 
             await this.loadMediaLibrary();
         },

         async loadMediaLibrary() {
             this.mediaList = [];
             try {
                 const token = localStorage.getItem('labmu_token');
                 const res = await fetch('/api/media', { headers: { 'Authorization': 'Bearer ' + token } });
                 const json = await res.json();
                 
                 let raw = Array.isArray(json) ? json : (json.results || []);
                 this.mediaList = raw.map(m => ({
                     ...m,
                     url: m.url || m.file_url || '',
                     title: m.title || (m.key ? m.key.split('/').pop() : 'No Title')
                 }));
             } catch(e) { console.error('Library Error', e); }
         },

         get filteredMediaList() {
             if(!this.searchQuery) return this.mediaList;
             const q = this.searchQuery.toLowerCase();
             return this.mediaList.filter(m => 
                 (m.title && m.title.toLowerCase().includes(q)) || 
                 (m.alt && m.alt.toLowerCase().includes(q))
             );
         },

         selectMediaItem(img) {
             this.selectedMedia = { ...img }; 
             this.mediaForm = {
                 title: img.title || '',
                 alt: img.alt || '',
                 caption: img.caption || '',
                 description: img.description || ''
             };
         },

         confirmMediaSelection() {
             if (!this.selectedMedia || !this.selectedMedia.url) {
                 alert('Pilih gambar dulu!');
                 return;
             }
             this.form.featured_image = this.selectedMedia.url;
             this.form.featured_image_alt = this.mediaForm.alt; 
             this.form.featured_image_caption = this.mediaForm.caption;
             this.mediaModalOpen = false;
         },

         async updateMediaDetails() {
             if(!this.selectedMedia) return;
             this.selectedMedia.title = this.mediaForm.title;
             this.selectedMedia.alt = this.mediaForm.alt;
             this.selectedMedia.caption = this.mediaForm.caption;
             this.selectedMedia.description = this.mediaForm.description;

             try {
                 const token = localStorage.getItem('labmu_token');
                 await fetch('/api/media/meta', { 
                     method: 'POST', 
                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                     body: JSON.stringify({ key: this.selectedMedia.key, ...this.mediaForm })
                 });
                 alert('Info tersimpan!');
             } catch(e) { console.log('Saved locally'); }
         },

         onFileSelect(e) {
             const file = e.target.files[0];
             if (!file) return;
             this.uploadFile = file;
             this.uploadPreview = URL.createObjectURL(file);
             this.mediaForm.title = file.name.split('.')[0].replace(/-/g, ' '); 
         },

         async uploadMediaAction() {
             if (!this.uploadFile) return alert('Pilih file dulu');
             
             const fd = new FormData();
             fd.append('file', this.uploadFile);
             fd.append('title', this.mediaForm.title);
             fd.append('alt', this.mediaForm.alt);
             fd.append('caption', this.mediaForm.caption);
             fd.append('description', this.mediaForm.description);

             try {
                 const token = localStorage.getItem('labmu_token');
                 const res = await fetch('/api/media', {
                     method: 'POST',
                     headers: { 'Authorization': 'Bearer ' + token },
                     body: fd
                 });
                 if (res.ok) {
                     const result = await res.json();
                     await this.loadMediaLibrary();
                     this.mediaTab = 'library';
                     const newUrl = result.url || result.file_url;
                     const newImg = this.mediaList.find(m => m.url === newUrl);
                     if (newImg) this.selectMediaItem(newImg);
                     this.uploadFile = null; this.uploadPreview = null;
                 } else { alert('Gagal upload.'); }
             } catch(e) { alert('Error upload'); }
         },

         openManager(target) {
             this.manageTarget = target;
             this.manageModalOpen = true;
             this.managerItems = (target === 'category') ? this.uniqueCategories.filter(c => c !== 'Uncategorized') : this.uniqueTags;
         },
         async renameItemGlobal(old) { alert('Rename logic placeholder'); },
         async deleteItemGlobal(item) { alert('Delete logic placeholder'); },

         initEditor() {
             setTimeout(() => {
                 if (window.cmsEditor) { try { window.cmsEditor.destroy(); } catch(e){} }
                 const el = document.getElementById('editor');
                 if(el) {
                     window.cmsEditor = SUNEDITOR.create('editor', {
                         display: 'block', width: '100%', height: '500px',
                         buttonList: [
                             ['undo', 'redo'], ['font', 'fontSize', 'formatBlock'],
                             ['bold', 'underline', 'italic', 'strike'],
                             ['fontColor', 'hiliteColor'], ['align', 'list', 'lineHeight'],
                             ['table', 'link', 'image', 'video'], ['fullScreen', 'codeView']
                         ]
                     });
                     window.cmsEditor.setContents(this.form.body || this.form.content || '');
                 }
             }, 200);
         },

         async save() {
             const currentContent = window.cmsEditor ? window.cmsEditor.getContents() : (this.form.body || '');
             const payload = JSON.parse(JSON.stringify({
                 id: this.editingId || undefined,
                 title: this.form.title || '',
                 slug: this.form.slug || this.form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                 body: currentContent,
                 status: this.form.status || 'publish',
                 category: this.form.category || 'Uncategorized',
                 tags: this.form.tags || '',
                 featured_image: this.form.featured_image || '',
                 featured_image_caption: this.form.featured_image_caption || '',
                 featured_image_alt: this.form.featured_image_alt || '',
                 type: 'post'
             }));
             if(this.form.date) payload.created_at = new Date(this.form.date).toISOString();

             try {
                 const token = localStorage.getItem('labmu_token');
                 const method = this.editingId ? 'PUT' : 'POST';
                 const url = this.editingId ? ('/api/posts/' + this.editingId) : '/api/posts';
                 const res = await fetch(url, {
                     method: method,
                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                     body: JSON.stringify(payload)
                 });
                 if(res.ok) { alert('Tersimpan!'); window.location.reload(); } 
                 else { const r = await res.json(); alert('Gagal: ' + r.error); }
             } catch(err) { alert('Error koneksi.'); }
         },

         makeSlug() { if(!this.editingId) this.form.slug = this.form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'); },
         addTag(t) {
             let cur = this.form.tags || '';
             const arr = cur.split(',').map(x => x.trim());
             if(!arr.includes(t)) this.form.tags = cur ? (cur + ', ' + t) : t;
         },
         setCategory(c) { this.form.category = c; }
     }"
     x-effect="if(view === 'add' || view === 'edit') { initEditor(); loadGlobalData(); }">

    <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
        <button @click="view = 'posts'" class="btn" style="background:transparent; color:#555; border:1px solid #ccc;">
            <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <h2 style="margin:0;" x-text="editingId ? 'Edit Post' : 'Tambah Post Baru'"></h2>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 320px; gap:25px;">
        <div style="min-width: 0;">
            <input x-model="form.title" class="input" placeholder="Judul Tulisan..." 
                   style="font-size: 24px; font-weight: 600; padding: 15px; margin-bottom: 20px;" 
                   @input="makeSlug()">
            <div style="background:white; margin-bottom:20px; border:1px solid #ccc;">
                <textarea id="editor" style="display:none;"></textarea>
            </div>
            
            <div class="card" style="padding:0; overflow:hidden; border:1px solid #e5e7eb; border-radius:8px; background:white;">
                <div style="padding:12px 15px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="margin:0; font-size:13px; font-weight:600; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Featured Image</h3>
                    <i class="fas fa-star" style="color:#fbbf24; font-size:12px;"></i>
                </div>

                <div x-show="!form.featured_image" 
                     @click="openMediaSelector()"
                     style="padding:40px 20px; text-align:center; cursor:pointer; background:#f9fafb; transition:all 0.2s;"
                     onmouseover="this.style.background='#f3f4f6'" 
                     onmouseout="this.style.background='#f9fafb'">
                    
                    <div style="width:60px; height:60px; background:#e5e7eb; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px auto;">
                        <i class="fas fa-image fa-2x" style="color:#9ca3af;"></i>
                    </div>
                    <div style="font-weight:600; color:#4b5563; font-size:14px;">Tetapkan Gambar Unggulan</div>
                    <div style="color:#9ca3af; font-size:12px; margin-top:5px;">Klik untuk memilih dari library</div>
                </div>

                <div x-show="form.featured_image" style="position:relative; group">
                    <div style="width:100%; aspect-ratio:16/9; background:#eee; position:relative; overflow:hidden;">
                        <img :src="form.featured_image" 
                             style="width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s;"
                             onmouseover="this.style.transform='scale(1.05)'"
                             onmouseout="this.style.transform='scale(1)'">
                    </div>
                    <div style="background:white; padding:10px 15px; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-size:11px; color:#6b7280; font-weight:500;">
                            <i class="fas fa-check-circle" style="color:#10b981;"></i> Terpasang
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button type="button" @click="openMediaSelector()" title="Ganti Gambar"
                                    style="padding:6px 10px; background:#eff6ff; color:#2563eb; border:1px solid #dbeafe; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">
                                <i class="fas fa-exchange-alt"></i> Ganti
                            </button>
                            <button type="button" @click="form.featured_image=''" title="Hapus Gambar"
                                    style="padding:6px 10px; background:#fef2f2; color:#dc2626; border:1px solid #fee2e2; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:20px;">
            <div class="card" style="padding:15px; border-top:3px solid #2271b1;">
                <h3 style="margin:0 0 15px 0; font-size:14px;">Publish</h3>
                <div style="margin-bottom:10px;">
                    <label style="font-size:12px;">Status</label>
                    <select x-model="form.status" class="input" style="width:100%;"><option value="publish">Published</option><option value="draft">Draft</option></select>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="font-size:12px;">Tanggal</label>
                    <input type="datetime-local" x-model="form.date" class="input">
                </div>
                <button @click="save()" class="btn btn-primary" style="width:100%;">Simpan</button>
            </div>

            <div class="card" style="padding:15px;">
                <h3 style="margin:0 0 10px 0; font-size:14px;">Kategori <button @click="openManager('category')" style="float:right; border:none; color:blue; cursor:pointer;">⚙️</button></h3>
                <input x-model="form.category" class="input" placeholder="Pilih/Ketik...">
                <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:10px;">
                    <template x-for="c in uniqueCategories">
                        <span @click="setCategory(c)" style="cursor:pointer; padding:3px 8px; border:1px solid #ddd; border-radius:12px; font-size:11px;" :style="form.category===c?'background:#2271b1;color:white':''"><span x-text="c"></span></span>
                    </template>
                </div>
            </div>

            <div class="card" style="padding:15px;">
                <h3 style="margin:0 0 10px 0; font-size:14px;">Tags <button @click="openManager('tag')" style="float:right; border:none; color:blue; cursor:pointer;">⚙️</button></h3>
                <textarea x-model="form.tags" class="input" style="height:60px;"></textarea>
                <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:10px;">
                    <template x-for="t in uniqueTags">
                        <span @click="addTag(t)" style="cursor:pointer; padding:3px 8px; border:1px solid #ddd; border-radius:12px; font-size:11px; background:#f9f9f9;">+ <span x-text="t"></span></span>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <div x-show="mediaModalOpen" 
         style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:999999; display:flex; justify-content:center; align-items:center; padding:20px;" 
         x-transition.opacity
         x-cloak>
        
        <div style="background:white; width:100%; max-width:1100px; height:85vh; border-radius:16px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            
            <div style="padding:16px 24px; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center; background:#fff;">
                <div style="display:flex; align-items:center; gap:24px;">
                    <h3 style="margin:0; font-size:18px; font-weight:700; color:#1f2937;">Media Manager</h3>
                    
                    <div style="display:flex; gap: 8px; background:#f3f4f6; padding:6px; border-radius:12px; width: fit-content;">
                        <button type="button" @click="mediaTab='library'" 
                                :style="mediaTab==='library' ? 'background:white; color:#2563eb; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'color:#6b7280; background:transparent;'"
                                style="border:none; outline:none; padding:8px 20px; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600; transition:all 0.2s;">
                            Library
                        </button>
                        <button type="button" @click="mediaTab='upload'" 
                                :style="mediaTab==='upload' ? 'background:white; color:#2563eb; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'color:#6b7280; background:transparent;'"
                                style="border:none; outline:none; padding:8px 20px; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600; transition:all 0.2s;">
                            Upload Baru
                        </button>
                    </div>
                </div>

                <div style="display:flex; align-items:center; gap:16px;">
                    <div x-show="mediaTab === 'library'" style="position:relative;">
                        <input x-model="searchQuery" placeholder="Cari media..." 
                               style="padding:8px 12px 8px 36px; border-radius:8px; border:1px solid #e5e7eb; font-size:13px; width:240px; outline:none; transition:border 0.2s;"
                               onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e5e7eb'">
                        <i class="fas fa-search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; font-size:12px;"></i>
                        <button type="button" x-show="searchQuery" @click="searchQuery=''" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); border:none; background:none; color:#9ca3af; cursor:pointer;">&times;</button>
                    </div>

                    <button type="button" @click="mediaModalOpen=false" style="background:#f3f4f6; border:none; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#4b5563; transition:background 0.2s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div style="flex:1; display:flex; overflow:hidden;">
                
                <div style="flex:1; background:#f9fafb; overflow-y:auto; padding:24px; position:relative;">
                    
                    <div x-show="mediaTab === 'library'">
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:16px;">
                            <template x-for="img in filteredMediaList" :key="img.key">
                                <div @click="selectMediaItem(img)" 
                                     style="cursor:pointer; position:relative; aspect-ratio:1; background:white; border-radius:8px; overflow:hidden; transition:all 0.2s;"
                                     :style="selectedMedia && selectedMedia.url === img.url ? 'box-shadow: 0 0 0 4px rgba(37,99,235,0.3); border:2px solid #2563eb;' : 'border:1px solid #e5e7eb; box-shadow:0 1px 2px rgba(0,0,0,0.05);'"
                                     onmouseover="this.style.transform='translateY(-2px)'" 
                                     onmouseout="this.style.transform='translateY(0)'">
                                    
                                    <img :src="img.url" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block; background:#f3f4f6;">
                                    
                                    <div x-show="selectedMedia && selectedMedia.url === img.url" 
                                         x-transition.scale
                                         style="position:absolute; top:8px; right:8px; background:#2563eb; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.2);">
                                        <i class="fas fa-check"></i>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <div x-show="filteredMediaList.length===0" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#9ca3af; padding:40px;">
                            <div style="width:80px; height:80px; background:#e5e7eb; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
                                <i class="fas fa-search fa-2x" style="color:#9ca3af;"></i>
                            </div>
                            <p style="font-weight:600; margin-bottom:5px; color:#4b5563;">Tidak ada media ditemukan</p>
                            <p style="font-size:13px;">Coba kata kunci lain atau upload gambar baru.</p>
                        </div>
                    </div>

                    <div x-show="mediaTab === 'upload'" style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        <div style="background:white; padding:40px; border-radius:16px; border:1px solid #e5e7eb; width:100%; max-width:400px; text-align:center; box-shadow:0 10px 15px -3px rgba(0,0,0,0.05);">
                             <div x-show="!uploadPreview">
                                <label style="display:block; padding:40px 20px; border:2px dashed #d1d5db; border-radius:12px; cursor:pointer; transition:all 0.2s; background:#f9fafb;"
                                       onmouseover="this.style.borderColor='#2563eb'; this.style.background='#eff6ff'" 
                                       onmouseout="this.style.borderColor='#d1d5db'; this.style.background='#f9fafb'">
                                    <div style="width:60px; height:60px; background:white; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:15px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                                        <i class="fas fa-cloud-upload-alt fa-2x" style="color:#2563eb;"></i>
                                    </div>
                                    <div style="font-weight:600; color:#374151; font-size:15px; margin-bottom:5px;">Klik untuk pilih file</div>
                                    <div style="color:#9ca3af; font-size:12px;">JPG, PNG, WEBP (Max 5MB)</div>
                                    <input type="file" @change="onFileSelect" style="display:none;" accept="image/*">
                                </label>
                            </div>
                            <div x-show="uploadPreview">
                                <img :src="uploadPreview" style="max-height:200px; width:auto; margin-bottom:20px; border-radius:8px; border:1px solid #e5e7eb; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                                <br>
                                <button type="button" @click="uploadFile=null;uploadPreview=null" style="background:white; border:1px solid #e5e7eb; padding:8px 16px; border-radius:6px; color:#ef4444; font-weight:600; cursor:pointer; font-size:13px;">Ganti File</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="width:340px; background:white; border-left:1px solid #e5e7eb; display:flex; flex-direction:column; z-index:10;">
                    
                    <div x-show="mediaTab === 'library' && !selectedMedia" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px; color:#9ca3af;">
                        <div style="width:100px; height:100px; background:#f3f4f6; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:24px;">
                            <i class="fas fa-photo-video fa-3x" style="color:#d1d5db;"></i>
                        </div>
                        <h4 style="margin:0 0 8px 0; color:#374151; font-size:16px; font-weight:600;">Belum ada yang dipilih</h4>
                        <p style="font-size:13px; line-height:1.5; color:#6b7280;">Klik salah satu gambar di sebelah kiri<br>untuk melihat detailnya.</p>
                    </div>

                    <template x-if="selectedMedia && mediaTab === 'library'">
                        <div style="display:flex; flex-direction:column; height:100%;">
                            <div style="padding:16px 20px; border-bottom:1px solid #f3f4f6; background:white;">
                                <h4 style="margin:0; font-size:14px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Detail File</h4>
                            </div>
                            <div style="flex:1; overflow-y:auto; padding:20px;">
                                <div style="background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb; padding:10px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; aspect-ratio:16/9; overflow:hidden;">
                                    <img :src="selectedMedia.url" style="max-width:100%; max-height:100%; object-fit:contain;">
                                </div>
                                <div style="display:grid; gap:16px;">
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Judul</label>
                                        <input x-model="mediaForm.title" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Alt Text (SEO)</label>
                                        <input x-model="mediaForm.alt" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Caption</label>
                                        <input x-model="mediaForm.caption" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Deskripsi</label>
                                        <textarea x-model="mediaForm.description" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; min-height:80px; box-sizing:border-box; font-family:inherit;"></textarea>
                                    </div>
                                    <button type="button" @click="updateMediaDetails()" style="width:100%; background:white; border:1px solid #d1d5db; color:#4b5563; padding:8px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'">
                                        <i class="fas fa-save"></i> Simpan Info Meta
                                    </button>
                                </div>
                            </div>
                            <div style="padding:16px 20px; border-top:1px solid #e5e7eb; background:white;">
                                <button type="button" @click="confirmMediaSelection()" 
                                        style="width:100%; background:#2563eb; color:white; border:none; padding:12px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer; box-shadow:0 4px 6px -1px rgba(37,99,235,0.3); display:flex; justify-content:center; align-items:center; gap:8px; transition:all 0.2s;"
                                        onmouseover="this.style.backgroundColor='#1d4ed8'" 
                                        onmouseout="this.style.backgroundColor='#2563eb'">
                                    <span>Sisipkan Gambar</span>
                                    <i class="fas fa-arrow-right" style="font-size:12px;"></i>
                                </button>
                            </div>
                        </div>
                    </template>

                    <div x-show="mediaTab === 'upload'" style="flex:1; display:flex; flex-direction:column; padding:20px;">
                         <h4 style="margin:0 0 20px 0; font-size:14px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Metadata Upload</h4>
                         <div style="flex:1; overflow-y:auto; display:grid; gap:16px; align-content:start;">
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Judul</label><input x-model="mediaForm.title" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;"></div>
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Alt Text</label><input x-model="mediaForm.alt" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;"></div>
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Caption</label><input x-model="mediaForm.caption" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;"></div>
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Deskripsi</label><textarea x-model="mediaForm.description" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; height:80px; box-sizing:border-box;"></textarea></div>
                         </div>
                         <div style="padding-top:20px; border-top:1px solid #e5e7eb;">
                            <button type="button" @click="uploadMediaAction()" :disabled="!uploadFile"
                                    style="width:100%; background:#2563eb; color:white; border:none; padding:12px; border-radius:8px; font-weight:600; cursor:pointer; transition:all 0.2s;"
                                    :style="!uploadFile ? 'opacity:0.5; cursor:not-allowed;' : 'hover:bg-blue-700'">
                                <i class="fas fa-cloud-upload-alt"></i> Upload & Gunakan
                            </button>
                         </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div x-show="manageModalOpen" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:99999; display:flex; justify-content:center; align-items:center;" x-cloak>
        <div style="background:white; width:400px; max-height:80vh; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);">
            <div style="padding:15px 20px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; background:#f9fafb;">
                <h3 style="margin:0; font-size:16px; font-weight:600;">Kelola <span x-text="manageTarget"></span></h3>
                <button type="button" @click="manageModalOpen=false" style="border:none; background:none; font-size:20px; cursor:pointer;">&times;</button>
            </div>
            <div style="flex:1; overflow-y:auto; padding:0;">
                <template x-for="item in managerItems">
                    <div style="padding:12px 20px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
                        <span x-text="item" style="font-weight:500; color:#374151;"></span>
                        <div style="display:flex; gap:10px;">
                            <button type="button" @click="renameItemGlobal(item)" style="color:#d97706; border:none; background:none; cursor:pointer;"><i class="fas fa-pencil-alt"></i></button>
                            <button type="button" @click="deleteItemGlobal(item)" style="color:#dc2626; border:none; background:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</div>
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/pages.ts
var pagesBlock = `
    ${postsPage}
    
<div x-show="view === 'pages' || view === 'add-page'" class="animate-fade" 
     style="height: calc(100vh - 100px); background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; display: flex; flex-direction:column;"
     x-data="{
         // --- CORE STATE ---
         searchQuery: '',
         pagesList: [],
         selectedItems: [],
         isLoading: false,
         
         // --- EDITOR STATE ---
         form: { title: '', slug: '', body: '', status: 'publish', featured_image: '' },
         isSaving: false,
         editorInstance: null,

         // --- MEDIA MANAGER STATE ---
         mediaModalOpen: false,
         mediaTab: 'library',
         mediaList: [],
         uploadFile: null,
         uploadPreview: null,
         selectedMedia: null,
         mediaSearchQuery: '',
         mediaForm: { title: '', alt: '', caption: '', description: '' },

         // ============================================================
         // 1. PAGE LIST LOGIC
         // ============================================================
         async loadPages() {
             this.isLoading = true;
             const token = localStorage.getItem('labmu_token');
             try {
                 const res = await fetch('/api/pages', { headers: { 'Authorization': 'Bearer ' + token } });
                 if(res.ok) {
                     const json = await res.json();
                     this.pagesList = Array.isArray(json) ? json : (json.results || []);
                 }
             } catch(e) { console.error(e); }
             finally { this.isLoading = false; }
         },

         formatDate(val) {
            if (!val) return '-';
            if (!isNaN(val) && !isNaN(parseFloat(val))) {
                 const num = Number(val);
                 const dateObj = new Date(num < 10000000000 ? num * 1000 : num); 
                 return dateObj.toLocaleDateString('id-ID');
            }
            return new Date(val).toLocaleDateString('id-ID');
         },

         get filteredPages() {
             const q = this.searchQuery.toLowerCase();
             return (this.pagesList || []).filter(p => (p.title||'').toLowerCase().includes(q));
         },

         editPage(p) {
             window.editingPageId = p.id; 
             this.view = 'add-page';
         },

         previewPage(slug) {
             if(!slug) return alert('Halaman belum memiliki link.');
             window.open('/' + slug, '_blank');
         },

         async deletePages() {
             if (this.selectedItems.length === 0) return;
             if (!confirm('Hapus ' + this.selectedItems.length + ' item terpilih?')) return;
             const token = localStorage.getItem('labmu_token');
             for (const id of this.selectedItems) {
                 await fetch('/api/pages', { 
                     method: 'DELETE', 
                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                     body: JSON.stringify({ id: id })
                 });
             }
             this.selectedItems = [];
             await this.loadPages();
         },

         // ============================================================
         // 2. EDITOR LOGIC
         // ============================================================
         async initPageEditor() {
             this.form = { title: '', slug: '', body: '', status: 'publish', featured_image: '' };
             
             if(window.editingPageId) {
                 await this.loadSinglePage(window.editingPageId);
             }

             setTimeout(() => {
                 const el = document.getElementById('pageEditorArea');
                 if(el) {
                     if(this.editorInstance) this.editorInstance.destroy();
                     this.editorInstance = SUNEDITOR.create('pageEditorArea', {
                         display: 'block', width: '100%', height: '500px',
                         buttonList: [['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['bold', 'underline', 'italic'], ['fontColor', 'hiliteColor'], ['align', 'list', 'table', 'link', 'image', 'video'], ['fullScreen', 'codeView']]
                     });
                     this.editorInstance.setContents(this.form.body || '');
                 }
             }, 100);
         },

         async loadSinglePage(id) {
             try {
                 const token = localStorage.getItem('labmu_token');
                 const res = await fetch('/api/pages/' + id, { headers: { 'Authorization': 'Bearer ' + token } });
                 if(res.ok) this.form = await res.json();
             } catch(e) { alert('Gagal load data'); }
         },

         async savePage() {
             this.isSaving = true;
             this.form.body = this.editorInstance ? this.editorInstance.getContents() : '';
             if(!this.form.slug) this.form.slug = this.form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+\$/g, '');

             const token = localStorage.getItem('labmu_token');
             const isEdit = !!window.editingPageId;
             const url = isEdit ? '/api/pages/' + window.editingPageId : '/api/pages';
             const method = isEdit ? 'PUT' : 'POST';

             try {
                 const res = await fetch(url, {
                     method: method,
                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                     body: JSON.stringify(this.form)
                 });
                 
                 if(res.ok) {
                     alert('Halaman berhasil disimpan!');
                     this.view = 'pages'; 
                 } else {
                     alert('Gagal simpan.');
                 }
             } catch(e) { alert('Error: ' + e.message); }
             finally { this.isSaving = false; }
         },

         // ============================================================
         // 3. MEDIA MANAGER LOGIC
         // ============================================================
         async openMediaSelector() {
             this.mediaModalOpen = true;
             this.mediaTab = 'library';
             this.selectedMedia = null;
             this.mediaSearchQuery = '';
             this.mediaForm = { title:'', alt:'', caption:'', description:'' }; 
             await this.loadMediaLibrary();
         },

         async loadMediaLibrary() {
             this.mediaList = [];
             try {
                 const token = localStorage.getItem('labmu_token');
                 const res = await fetch('/api/media', { headers: { 'Authorization': 'Bearer ' + token } });
                 const json = await res.json();
                 let raw = Array.isArray(json) ? json : (json.results || []);
                 this.mediaList = raw.map(m => ({
                     ...m,
                     url: m.url || m.file_url || '',
                     title: m.title || (m.key ? m.key.split('/').pop() : 'No Title')
                 }));
             } catch(e) { console.error('Library Error', e); }
         },

         get filteredMediaList() {
             if(!this.mediaSearchQuery) return this.mediaList;
             const q = this.mediaSearchQuery.toLowerCase();
             return this.mediaList.filter(m => (m.title||'').toLowerCase().includes(q));
         },

         selectMediaItem(img) {
             this.selectedMedia = { ...img }; 
             this.mediaForm = { title: img.title||'', alt: img.alt||'', caption: img.caption||'', description: img.description||'' };
         },

         confirmMediaSelection() {
             if (!this.selectedMedia || !this.selectedMedia.url) return alert('Pilih gambar dulu!');
             this.form.featured_image = this.selectedMedia.url;
             this.mediaModalOpen = false;
         },

         onFileSelect(e) {
             const file = e.target.files[0];
             if (!file) return;
             this.uploadFile = file;
             this.uploadPreview = URL.createObjectURL(file);
             this.mediaForm.title = file.name.split('.')[0].replace(/-/g, ' '); 
         },

         async uploadMediaAction() {
             if (!this.uploadFile) return alert('Pilih file dulu');
             const fd = new FormData();
             fd.append('file', this.uploadFile);
             fd.append('title', this.mediaForm.title);
             fd.append('alt', this.mediaForm.alt);
             fd.append('caption', this.mediaForm.caption);
             fd.append('description', this.mediaForm.description);
             
             try {
                 const token = localStorage.getItem('labmu_token');
                 const res = await fetch('/api/media', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
                 if (res.ok) {
                     const result = await res.json();
                     await this.loadMediaLibrary();
                     this.mediaTab = 'library';
                     const newUrl = result.url || result.file_url;
                     const newImg = this.mediaList.find(m => m.url === newUrl);
                     if (newImg) this.selectMediaItem(newImg);
                     this.uploadFile = null; this.uploadPreview = null;
                 } else { alert('Gagal upload.'); }
             } catch(e) { alert('Error upload'); }
         },

         async updateMediaDetails() {
             if(!this.selectedMedia) return;
             try {
                 const token = localStorage.getItem('labmu_token');
                 await fetch('/api/media/meta', { 
                     method: 'POST', 
                     headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                     body: JSON.stringify({ key: this.selectedMedia.key, ...this.mediaForm })
                 });
                 alert('Info media tersimpan!');
             } catch(e) { console.log('Saved locally'); }
         },
     }"
     x-effect="if(view === 'pages') loadPages(); if(view === 'add-page') initPageEditor();">

    <div x-show="view === 'pages'" style="display:flex; flex-direction:column; height:100%;">
        <div style="border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center; padding:0 30px; height:70px; flex-shrink:0;">
            <div style="display:flex; align-items:center; gap:15px;">
                <h2 style="margin:0; font-size:18px; font-weight:700; color:#1f2937;">Halaman Statis</h2>
                <button x-show="selectedItems.length > 0" @click="deletePages()" style="background:#fee2e2; color:#dc2626; border:1px solid #fecaca; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
                    <i class="fas fa-trash"></i> Hapus (<span x-text="selectedItems.length"></span>)
                </button>
            </div>
            <div style="display:flex; gap:15px; align-items:center;">
                <input type="text" x-model="searchQuery" placeholder="Cari halaman..." style="padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; width:220px;">
                <button @click="window.editingPageId=null; view='add-page'" style="padding:8px 20px; font-size:13px; background:#2563eb; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">
                    <i class="fas fa-plus"></i> Tambah Baru
                </button>
            </div>
        </div>

        <div style="overflow-y:auto; flex:1;">
            <table style="width:100%; border-collapse:collapse;">
                <thead style="background:#f9fafb; position:sticky; top:0; z-index:10;">
                    <tr>
                        <th style="padding:12px 20px; width:40px; text-align:center; border-bottom:1px solid #e5e7eb;">
                            <input type="checkbox" @change="selectedItems = selectedItems.length === filteredPages.length ? [] : filteredPages.map(p=>p.id)">
                        </th>
                        <th style="padding:12px 20px; text-align:left; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; border-bottom:1px solid #e5e7eb;">Judul</th>
                        <th style="padding:12px 20px; text-align:left; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; border-bottom:1px solid #e5e7eb;">Slug</th>
                        <th style="padding:12px 20px; text-align:center; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; border-bottom:1px solid #e5e7eb;">Tanggal</th>
                        <th style="padding:12px 20px; text-align:right; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; border-bottom:1px solid #e5e7eb;">Aksi</th>
                    </tr>
                </thead>
                <tbody style="font-size:13px;">
                    <template x-for="p in filteredPages" :key="p.id">
                        <tr style="border-bottom:1px solid #f3f4f6;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                            <td style="padding:15px 20px; text-align:center;">
                                <input type="checkbox" :value="p.id" x-model="selectedItems">
                            </td>
                            <td style="padding:15px 20px; font-weight:600;" x-text="p.title"></td>
                            <td style="padding:15px 20px;"><span style="background:#f3f4f6; padding:4px 8px; border-radius:4px; font-family:monospace;" x-text="'/'+p.slug"></span></td>
                            <td style="padding:15px 20px; text-align:center;" x-text="formatDate(p.created_at)"></td>
                            <td style="padding:15px 20px; text-align:right;">
                                <div style="display:flex; justify-content:flex-end; gap:8px;">
                                    <button @click="previewPage(p.slug)" style="color:#059669; border:1px solid #d1fae5; background:#ecfdf5; padding:6px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-eye"></i></button>
                                    <button @click="editPage(p)" style="color:#2563eb; border:1px solid #dbeafe; background:#eff6ff; padding:6px 10px; border-radius:4px; cursor:pointer;"><i class="fas fa-pencil-alt"></i> Edit</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div x-show="view === 'add-page'" style="overflow-y:auto; padding:30px; height:100%; box-sizing:border-box;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
            <button @click="view = 'pages'" style="background:transparent; color:#555; border:1px solid #ccc; padding:6px 12px; border-radius:6px; cursor:pointer;">
                <i class="fas fa-arrow-left"></i> Kembali
            </button>
            <h2 style="margin:0;" x-text="window.editingPageId ? 'Edit Halaman' : 'Tambah Halaman Baru'"></h2>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 300px; gap:25px;">
            <div style="min-width:0;">
                <input x-model="form.title" placeholder="Judul Halaman..." 
                       style="width:100%; font-size: 24px; font-weight: 600; padding: 15px; margin-bottom: 20px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" 
                       @input="if(!window.editingPageId) form.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');">
                
                <div style="background:white; border:1px solid #ccc;">
                    <textarea id="pageEditorArea" style="display:none;"></textarea>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card" style="padding:15px; background:white; border:1px solid #e5e7eb; border-radius:8px; border-top:3px solid #2271b1;">
                    <h3 style="margin:0 0 15px 0; font-size:14px;">Publish</h3>
                    <div style="margin-bottom:15px;">
                        <label style="font-size:12px; display:block; margin-bottom:5px;">Slug / URL</label>
                        <input x-model="form.slug" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; font-size:13px; box-sizing:border-box; background:#f9fafb;">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label style="font-size:12px; display:block; margin-bottom:5px;">Status</label>
                        <select x-model="form.status" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                            <option value="publish">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                    <button @click="savePage()" :disabled="isSaving" 
                            style="width:100%; padding:10px; background:#2563eb; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;"
                            x-text="isSaving ? 'Menyimpan...' : 'Simpan Halaman'">
                    </button>
                </div>

                <div class="card" style="padding:0; overflow:hidden; border:1px solid #e5e7eb; border-radius:8px; background:white;">
                    <div style="padding:12px 15px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; font-size:13px; font-weight:600; color:#374151; text-transform:uppercase;">Featured Image</h3>
                        <i class="fas fa-star" style="color:#fbbf24; font-size:12px;"></i>
                    </div>

                    <div x-show="!form.featured_image" 
                         @click="openMediaSelector()"
                         style="padding:40px 20px; text-align:center; cursor:pointer; background:#f9fafb; transition:all 0.2s;"
                         onmouseover="this.style.background='#f3f4f6'" 
                         onmouseout="this.style.background='#f9fafb'">
                        
                        <div style="width:60px; height:60px; background:#e5e7eb; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px auto;">
                            <i class="fas fa-image fa-2x" style="color:#9ca3af;"></i>
                        </div>
                        <div style="font-weight:600; color:#4b5563; font-size:14px;">Tetapkan Gambar Unggulan</div>
                        <div style="color:#9ca3af; font-size:12px; margin-top:5px;">Klik untuk memilih dari library</div>
                    </div>

                    <div x-show="form.featured_image" style="position:relative; group">
                        <div style="width:100%; aspect-ratio:16/9; background:#eee; position:relative; overflow:hidden;">
                            <img :src="form.featured_image" 
                                 style="width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s;"
                                 onmouseover="this.style.transform='scale(1.05)'"
                                 onmouseout="this.style.transform='scale(1)'">
                        </div>
                        <div style="background:white; padding:10px 15px; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
                            <div style="font-size:11px; color:#6b7280; font-weight:500;">
                                <i class="fas fa-check-circle" style="color:#10b981;"></i> Terpasang
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button type="button" @click="openMediaSelector()" title="Ganti Gambar"
                                        style="padding:6px 10px; background:#eff6ff; color:#2563eb; border:1px solid #dbeafe; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">
                                    <i class="fas fa-exchange-alt"></i> Ganti
                                </button>
                                <button type="button" @click="form.featured_image=''" title="Hapus Gambar"
                                        style="padding:6px 10px; background:#fef2f2; color:#dc2626; border:1px solid #fee2e2; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div x-show="mediaModalOpen" 
         style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:999999; display:flex; justify-content:center; align-items:center; padding:20px;" 
         x-transition.opacity
         x-cloak>
        
        <div style="background:white; width:100%; max-width:1100px; height:85vh; border-radius:16px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            
            <div style="padding:16px 24px; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center; background:#fff;">
                <div style="display:flex; align-items:center; gap:24px;">
                    <h3 style="margin:0; font-size:18px; font-weight:700; color:#1f2937;">Media Manager</h3>
                    
                    <div style="display:flex; gap: 8px; background:#f3f4f6; padding:6px; border-radius:12px; width: fit-content;">
                        <button type="button" @click="mediaTab='library'" 
                                :style="mediaTab==='library' ? 'background:white; color:#2563eb; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'color:#6b7280; background:transparent;'"
                                style="border:none; outline:none; padding:8px 20px; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600; transition:all 0.2s;">
                            Library
                        </button>
                        <button type="button" @click="mediaTab='upload'" 
                                :style="mediaTab==='upload' ? 'background:white; color:#2563eb; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'color:#6b7280; background:transparent;'"
                                style="border:none; outline:none; padding:8px 20px; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600; transition:all 0.2s;">
                            Upload Baru
                        </button>
                    </div>
                </div>

                <div style="display:flex; align-items:center; gap:16px;">
                    <div x-show="mediaTab === 'library'" style="position:relative;">
                        <input x-model="mediaSearchQuery" placeholder="Cari media..." 
                               style="padding:8px 12px 8px 36px; border-radius:8px; border:1px solid #e5e7eb; font-size:13px; width:240px; outline:none; transition:border 0.2s;"
                               onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e5e7eb'">
                        <i class="fas fa-search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; font-size:12px;"></i>
                        <button type="button" x-show="mediaSearchQuery" @click="mediaSearchQuery=''" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); border:none; background:none; color:#9ca3af; cursor:pointer;">&times;</button>
                    </div>

                    <button type="button" @click="mediaModalOpen=false" style="background:#f3f4f6; border:none; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#4b5563; transition:background 0.2s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div style="flex:1; display:flex; overflow:hidden;">
                
                <div style="flex:1; background:#f9fafb; overflow-y:auto; padding:24px; position:relative;">
                    
                    <div x-show="mediaTab === 'library'">
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:16px;">
                            <template x-for="img in filteredMediaList" :key="img.key">
                                <div @click="selectMediaItem(img)" 
                                     style="cursor:pointer; position:relative; aspect-ratio:1; background:white; border-radius:8px; overflow:hidden; transition:all 0.2s;"
                                     :style="selectedMedia && selectedMedia.url === img.url ? 'box-shadow: 0 0 0 4px rgba(37,99,235,0.3); border:2px solid #2563eb;' : 'border:1px solid #e5e7eb; box-shadow:0 1px 2px rgba(0,0,0,0.05);'"
                                     onmouseover="this.style.transform='translateY(-2px)'" 
                                     onmouseout="this.style.transform='translateY(0)'">
                                    
                                    <img :src="img.url" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block; background:#f3f4f6;">
                                    
                                    <div x-show="selectedMedia && selectedMedia.url === img.url" 
                                         x-transition.scale
                                         style="position:absolute; top:8px; right:8px; background:#2563eb; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.2);">
                                        <i class="fas fa-check"></i>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <div x-show="filteredMediaList.length===0" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#9ca3af; padding:40px;">
                            <div style="width:80px; height:80px; background:#e5e7eb; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
                                <i class="fas fa-search fa-2x" style="color:#9ca3af;"></i>
                            </div>
                            <p style="font-weight:600; margin-bottom:5px; color:#4b5563;">Tidak ada media ditemukan</p>
                            <p style="font-size:13px;">Coba kata kunci lain atau upload gambar baru.</p>
                        </div>
                    </div>

                    <div x-show="mediaTab === 'upload'" style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        <div style="background:white; padding:40px; border-radius:16px; border:1px solid #e5e7eb; width:100%; max-width:400px; text-align:center; box-shadow:0 10px 15px -3px rgba(0,0,0,0.05);">
                             <div x-show="!uploadPreview">
                                <label style="display:block; padding:40px 20px; border:2px dashed #d1d5db; border-radius:12px; cursor:pointer; transition:all 0.2s; background:#f9fafb;"
                                       onmouseover="this.style.borderColor='#2563eb'; this.style.background='#eff6ff'" 
                                       onmouseout="this.style.borderColor='#d1d5db'; this.style.background='#f9fafb'">
                                    <div style="width:60px; height:60px; background:white; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:15px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                                        <i class="fas fa-cloud-upload-alt fa-2x" style="color:#2563eb;"></i>
                                    </div>
                                    <div style="font-weight:600; color:#374151; font-size:15px; margin-bottom:5px;">Klik untuk pilih file</div>
                                    <div style="color:#9ca3af; font-size:12px;">JPG, PNG, WEBP (Max 5MB)</div>
                                    <input type="file" @change="onFileSelect" style="display:none;" accept="image/*">
                                </label>
                            </div>
                            <div x-show="uploadPreview">
                                <img :src="uploadPreview" style="max-height:200px; width:auto; margin-bottom:20px; border-radius:8px; border:1px solid #e5e7eb; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                                <br>
                                <button type="button" @click="uploadFile=null;uploadPreview=null" style="background:white; border:1px solid #e5e7eb; padding:8px 16px; border-radius:6px; color:#ef4444; font-weight:600; cursor:pointer; font-size:13px;">Ganti File</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="width:340px; background:white; border-left:1px solid #e5e7eb; display:flex; flex-direction:column; z-index:10;">
                    
                    <div x-show="mediaTab === 'library' && !selectedMedia" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px; color:#9ca3af;">
                        <div style="width:100px; height:100px; background:#f3f4f6; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:24px;">
                            <i class="fas fa-photo-video fa-3x" style="color:#d1d5db;"></i>
                        </div>
                        <h4 style="margin:0 0 8px 0; color:#374151; font-size:16px; font-weight:600;">Belum ada yang dipilih</h4>
                        <p style="font-size:13px; line-height:1.5; color:#6b7280;">Klik salah satu gambar di sebelah kiri<br>untuk melihat detailnya.</p>
                    </div>

                    <template x-if="selectedMedia && mediaTab === 'library'">
                        <div style="display:flex; flex-direction:column; height:100%;">
                            <div style="padding:16px 20px; border-bottom:1px solid #f3f4f6; background:white;">
                                <h4 style="margin:0; font-size:14px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Detail File</h4>
                            </div>
                            <div style="flex:1; overflow-y:auto; padding:20px;">
                                <div style="background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb; padding:10px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; aspect-ratio:16/9; overflow:hidden;">
                                    <img :src="selectedMedia.url" style="max-width:100%; max-height:100%; object-fit:contain;">
                                </div>
                                <div style="display:grid; gap:16px;">
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Judul</label>
                                        <input x-model="mediaForm.title" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Alt Text (SEO)</label>
                                        <input x-model="mediaForm.alt" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Caption</label>
                                        <input x-model="mediaForm.caption" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;">
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:12px; font-weight:600; color:#4b5563; margin-bottom:6px;">Deskripsi</label>
                                        <textarea x-model="mediaForm.description" class="input" style="width:100%; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; min-height:80px; box-sizing:border-box; font-family:inherit;"></textarea>
                                    </div>
                                    <button type="button" @click="updateMediaDetails()" style="width:100%; background:white; border:1px solid #d1d5db; color:#4b5563; padding:8px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'">
                                        <i class="fas fa-save"></i> Simpan Info Meta
                                    </button>
                                </div>
                            </div>
                            <div style="padding:16px 20px; border-top:1px solid #e5e7eb; background:white;">
                                <button type="button" @click="confirmMediaSelection()" 
                                        style="width:100%; background:#2563eb; color:white; border:none; padding:12px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer; box-shadow:0 4px 6px -1px rgba(37,99,235,0.3); display:flex; justify-content:center; align-items:center; gap:8px; transition:all 0.2s;"
                                        onmouseover="this.style.backgroundColor='#1d4ed8'" 
                                        onmouseout="this.style.backgroundColor='#2563eb'">
                                    <span>Sisipkan Gambar</span>
                                    <i class="fas fa-arrow-right" style="font-size:12px;"></i>
                                </button>
                            </div>
                        </div>
                    </template>

                    <div x-show="mediaTab === 'upload'" style="flex:1; display:flex; flex-direction:column; padding:20px;">
                         <h4 style="margin:0 0 20px 0; font-size:14px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px;">Metadata Upload</h4>
                         <div style="flex:1; overflow-y:auto; display:grid; gap:16px; align-content:start;">
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Judul</label><input x-model="mediaForm.title" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;"></div>
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Alt Text</label><input x-model="mediaForm.alt" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;"></div>
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Caption</label><input x-model="mediaForm.caption" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;"></div>
                            <div><label style="font-size:12px; font-weight:600; color:#4b5563; margin-bottom:4px; display:block;">Deskripsi</label><textarea x-model="mediaForm.description" style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; height:80px; box-sizing:border-box;"></textarea></div>
                         </div>
                         <div style="padding-top:20px; border-top:1px solid #e5e7eb;">
                            <button type="button" @click="uploadMediaAction()" :disabled="!uploadFile"
                                    style="width:100%; background:#2563eb; color:white; border:none; padding:12px; border-radius:8px; font-weight:600; cursor:pointer; transition:all 0.2s;"
                                    :style="!uploadFile ? 'opacity:0.5; cursor:not-allowed;' : 'hover:bg-blue-700'">
                                <i class="fas fa-cloud-upload-alt"></i> Upload & Gunakan
                            </button>
                         </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
     
    ${editorPage} 
    
<div x-show="view === 'media'" class="animate-fade" 
     style="height: calc(100vh - 80px); display: flex; flex-direction: column; background: #fff; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;"
     x-data="mediaLogic" 
     x-init="loadMedia()">
    
    <div style="padding: 15px; border-bottom: 1px solid #ddd; background: #fff; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display:flex; align-items:center; gap: 15px;">
            <div style="font-weight: bold; font-size: 16px;">
                Media Library <span x-show="mediaList.length" x-text="'(' + mediaList.length + ')'" style="font-size:12px; color:#888;"></span>
            </div>
            
            <div x-show="selectedItems.length > 0" class="animate-fade" style="display:flex; gap:5px;">
                <button @click="deleteSelected()" :disabled="isDeleting" style="background:#ffecec; color:#d63384; border:1px solid #f5c6cb; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">
                    <i class="fas fa-trash"></i> Hapus (<span x-text="selectedItems.length"></span>)
                </button>
                <button @click="selectedItems = []; activeMediaItem = null;" style="background:#eee; border:1px solid #ddd; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">
                    Batal
                </button>
            </div>
        </div>

        <div style="display: flex; gap: 10px; align-items:center;">
             <button @click="toggleSelectAll()" style="font-size:12px; color:#2271b1; background:none; border:none; cursor:pointer; text-decoration:underline;">
                <span x-text="selectedItems.length === filteredMedia.length && filteredMedia.length > 0 ? 'Batal Pilih Semua' : 'Pilih Semua'"></span>
            </button>

            <input type="text" x-model="mediaSearchQuery" placeholder="Cari file..." 
                   style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; width: 200px;">
            
            <label class="btn btn-primary" style="cursor:pointer; display:flex; align-items:center; gap:5px; padding: 6px 12px; font-size: 13px;">
                <input type="file" multiple @change="uploadMedia(\$event)" style="display:none;">
                <i class="fas" :class="isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'"></i>
                <span x-text="isUploading ? '...' : 'Upload'"></span>
            </label>
        </div>
    </div>

    <div style="display: flex; flex: 1; overflow: hidden; height: 100%;">
        
        <div style="flex: 1; overflow-y: auto; padding: 20px; background: #fcfcfc; position: relative;">
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px; padding-bottom:50px;">
                <template x-for="m in filteredMedia" :key="m.id || m.key">
                    <div @click="toggleSelection(m)" 
                         style="position: relative; aspect-ratio: 1/1; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; transition: all 0.1s;"
                         :style="isSelected(m) ? 'box-shadow: 0 0 0 3px #2271b1; border-color: #2271b1; transform:scale(0.95);' : 'border-color: #ddd;'">
                        
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #eee;">
                            <img :src="m.url" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.src='https://placehold.co/100?text=Error'">
                        </div>

                        <div x-show="isSelected(m)" 
                             style="position: absolute; top: 5px; right: 5px; background: #2271b1; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            <i class="fas fa-check" style="color: white; font-size: 11px;"></i>
                        </div>
                        
                        <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.6); color:#fff; font-size:10px; padding:2px 5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" x-text="m.key.split('/').pop()"></div>
                    </div>
                </template>
            </div>

            <div x-show="filteredMedia.length === 0" style="text-align: center; padding: 50px; color: #888;">
                <p>Tidak ada media ditemukan.</p>
            </div>
        </div>

        <div x-show="activeMediaItem" 
             style="width: 300px; background: #f9f9f9; border-left: 1px solid #ddd; display: flex; flex-direction: column; flex-shrink: 0; height: 100%;"
             x-transition:enter="animate-fade">
            
            <div style="padding: 15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:12px;">DETAIL MEDIA</strong>
                <button @click="activeMediaItem=null; selectedItems=[]" style="border:none; background:none; cursor:pointer;"><i class="fas fa-times"></i></button>
            </div>

            <div style="flex:1; overflow-y:auto; padding:20px;">
                <template x-if="activeMediaItem">
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <img :src="activeMediaItem.url" style="width:100%; max-height:150px; object-fit:contain; background:#fff; border:1px solid #ddd; padding:5px;">
                        
                        <div style="font-size:11px; color:#666; word-break:break-all;">
                            <div x-text="activeMediaItem.key.split('/').pop()" style="font-weight:bold; margin-bottom:5px;"></div>
                            <div x-text="Math.round(activeMediaItem.size/1024) + ' KB'"></div>
                        </div>

                        <hr style="border:0; border-top:1px solid #ddd; width:100%;">

                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold; color:#d63384;">Rename File</label>
                            <input type="text" x-model="activeMediaMeta.filename" style="width:100%; padding:5px; border:1px solid #d63384; border-radius:3px; font-size:12px; background:#fff0f6;">
                        </div>

                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold;">Alt Text</label>
                            <input type="text" x-model="activeMediaMeta.alt" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:3px; font-size:12px;">
                        </div>
                        
                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold;">Judul</label>
                            <input type="text" x-model="activeMediaMeta.title" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:3px; font-size:12px;">
                        </div>

                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold;">Deskripsi</label>
                            <textarea x-model="activeMediaMeta.description" rows="3" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:3px; font-size:12px;"></textarea>
                        </div>

                        <button @click="saveMediaMeta()" class="btn btn-primary" :disabled="isSavingMeta" style="width:100%; font-size:12px; justify-content:center; margin-top:10px;">
                            <i class="fas fa-save"></i> <span x-text="isSavingMeta ? 'Menyimpan...' : 'Simpan Perubahan'"></span>
                        </button>
                    </div>
                </template>
            </div>
        </div>

    </div>
</div>

    
<div x-show="view==='users'">
  <div style="display:flex; justify-content:space-between; margin-bottom:20px; align-items:center;">
    <div>
        <h2 style="margin:0;">Users</h2>
        <p style="margin:5px 0 0 0; color:#666; font-size:13px;">Kelola tim dan hak akses.</p>
    </div>
    <button @click="openAddUser()" class="btn"><i class="fas fa-plus"></i> Add New User</button>
  </div>

  <div class="card" style="padding:0; overflow:hidden;">
    <table class="wp-table" style="width:100%; border-collapse:collapse;">
      <thead>
        <tr style="background:#f8f9fa; border-bottom:2px solid #ddd;">
          <th style="text-align:left; padding:12px;">User</th>
          <th style="text-align:left;">Email</th> <th style="text-align:left;">Role</th>
          <th style="text-align:left;">Registered</th>
          <th width="100" style="text-align:center;">Action</th>
        </tr>
      </thead>
      <tbody>
        <template x-for="u in usersList">
          <tr style="border-bottom:1px solid #eee;">
            
            <td style="padding:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:32px; height:32px; background:#2271b1; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">
                        <span x-text="u.username.charAt(0).toUpperCase()"></span>
                    </div>
                    <div>
                        <div style="font-weight:bold; color:#2271b1;" x-text="u.username"></div>
                        <div style="font-size:11px; color:#666;" x-text="u.name"></div>
                    </div>
                </div>
            </td>

            <td style="color:#555;">
                <span x-text="u.email || '-'"></span>
            </td>

            <td>
                <span class="badge" 
                      :style="u.role=='admin' ? 'background:#2271b1; color:#fff' : (u.role=='editor' ? 'background:#d1e7dd; color:#0f5132' : 'background:#fff3cd; color:#664d03')"
                      style="padding:4px 8px; border-radius:4px; font-size:11px; text-transform:capitalize;"
                      x-text="u.role">
                </span>
            </td>

            <td style="font-size:12px; color:#888;">
                <span x-text="u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'"></span>
            </td>

            <td style="text-align:center;">
              <div style="display:flex; justify-content:center; gap:5px;">
                <button @click="editUser(u)" class="btn-icon" style="color:#f39c12;"><i class="fas fa-pencil-alt"></i></button>
                <button @click="deleteUser(u.id)" class="btn-icon" style="color:#e74c3c;"><i class="fas fa-trash-alt"></i></button>
              </div>
            </td>
          </tr>
        </template>
        <tr x-show="usersList.length===0 && !isLoadingUsers">
            <td colspan="5" style="text-align:center; padding:30px; color:#999;">Belum ada user.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="modal-overlay" x-show="showUserModal" x-transition.opacity>
    <div class="modal-box" style="max-width:500px; height:auto; overflow:visible;" @click.away="showUserModal=false">
        <div class="modal-header">
            <h3 style="margin:0; font-size:18px;" x-text="editingUserId ? 'Edit User' : 'Add New User'"></h3>
            <button @click="showUserModal=false" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
        </div>
        <div style="padding:25px;">
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
                <div>
                    <label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">Username</label>
                    <input x-model="userForm.username" class="input" :disabled="editingUserId" placeholder="Login username...">
                </div>
                 <div>
                    <label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">Role</label>
                    <select x-model="userForm.role" class="input" style="height:38px;">
                        <option value="admin">Administrator</option>
                        <option value="editor">Editor</option>
                        <option value="penulis">Penulis</option>
                    </select>
                </div>
            </div>

            <label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">Email Address</label>
            <input x-model="userForm.email" type="email" class="input" placeholder="user@example.com">

            <label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px;">Full Name</label>
            <input x-model="userForm.name" class="input" placeholder="Nama lengkap...">

            <label style="font-weight:bold; font-size:12px; display:block; margin-bottom:5px; margin-top:15px;">Password</label>
            <input x-model="userForm.password" type="password" class="input" placeholder="********">
            <small x-show="editingUserId" style="color:#e74c3c; display:block; margin-top:-5px;">*Isi HANYA jika ingin mengganti password.</small>

            <div style="margin-top:25px; display:flex; justify-content:flex-end; gap:10px;">
                <button @click="showUserModal=false" class="btn" style="background:#fff; color:#333; border-color:#ccc;">Cancel</button>
                <button @click="saveUser()" class="btn btn-primary">Simpan User</button>
            </div>
        </div>
    </div>
  </div>
</div>

    
<div x-show="view==='themes'">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
    <h2>Themes</h2>
    <button class="btn" style="background:#f0f0f1; color:#333; border:1px solid #ccc;">Upload Theme (Pro)</button>
  </div>

  <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:25px;">
     <template x-for="t in availableThemes">
        <div class="card" style="padding:0; overflow:hidden; border:1px solid #dcdcde; box-shadow:0 1px 2px rgba(0,0,0,0.05); position:relative;">
           
           <div style="aspect-ratio: 4/3; background:#eee; position:relative; border-bottom:1px solid #eee;">
               <img :src="t.thumbnail || 'https://placehold.co/600x400/eee/ccc?text=No+Preview'" style="width:100%; height:100%; object-fit:cover;">
               
               <div x-show="t.active" style="position:absolute; top:10px; right:10px; background:#2271b1; color:#fff; padding:4px 10px; font-size:12px; font-weight:bold; border-radius:3px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
                  Active
               </div>
           </div>

           <div style="padding:15px;">
               <h3 x-text="t.name" style="margin:0 0 5px 0; font-size:16px;"></h3>
               <div style="font-size:12px; color:#666; margin-bottom:10px;">
                   By <span x-text="t.author"></span> &bull; v<span x-text="t.version"></span>
               </div>
               <p x-text="t.description" style="font-size:13px; color:#555; margin-bottom:15px; line-height:1.4; height:36px; overflow:hidden;"></p>
               
               <div style="display:flex; gap:10px;">
                   <button x-show="!t.active" @click="activateTheme(t.id)" class="btn" style="flex:1;">Activate</button>
                   <button x-show="t.active" class="btn" style="flex:1; background:#f0f0f1; color:#333; border:1px solid #ccc; cursor:default;">Customize</button>
               </div>
           </div>

        </div>
     </template>
  </div>
</div>

    
<div x-show="view === 'settings'" class="animate-fade" style="padding-bottom:80px; position:relative;"
     x-data="{
        isLoading: false,
        isSaving: false,
        
        // --- STATE SESUAI DATABASE D1 ---
        settings: { 
            site_title: '', 
            site_desc: '',  // ID:2 di DB
            admin_email: '', 
            site_logo: '',  // ID:6 di DB      
            site_favicon: '' // ID:8 di DB
        },

        // --- MEDIA STATE ---
        mediaModalOpen: false,
        mediaTab: 'library',
        mediaList: [],
        uploadFile: null,
        uploadPreview: null,
        selectedMedia: null,
        mediaSearchQuery: '',
        mediaTarget: '', 

        // --- INIT ---
        async init() {
            // Panggil saat komponen dimuat
            await this.loadSettings();
        },

        // --- CORE LOGIC (Diadaptasi Lokal) ---
        async loadSettings() {
            this.isLoading = true;
            const token = localStorage.getItem('labmu_token');
            try {
                // Endpoint API settings
                const res = await fetch('/api/settings', { 
                    headers: { 'Authorization': 'Bearer ' + token } 
                });
                if(res.ok) {
                    const json = await res.json();
                    // Handle format { data: {...} } atau langsung {...}
                    const data = json.data || json;
                    this.settings = { ...this.settings, ...data };
                }
            } catch(e) { console.error('Gagal load settings', e); }
            finally { this.isLoading = false; }
        },

        async saveSettings() {
            this.isSaving = true;
            const token = localStorage.getItem('labmu_token');
            try {
                const res = await fetch('/api/settings', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(this.settings)
                });
                
                if(res.ok) {
                    alert('✅ Pengaturan Berhasil Disimpan!');
                    if(this.settings.site_title) document.title = this.settings.site_title + ' - Admin';
                } else {
                    alert('❌ Gagal menyimpan.');
                }
            } catch(e) { alert('Error: ' + e.message); }
            finally { this.isSaving = false; }
        },

        // --- MEDIA ACTIONS ---
        async openMediaSelector(target) {
            this.mediaTarget = target; 
            this.mediaModalOpen = true;
            this.mediaTab = 'library';
            this.selectedMedia = null;
            this.mediaSearchQuery = '';
            await this.loadMediaLibrary();
        },

        async loadMediaLibrary() {
             this.mediaList = [];
             try {
                 const token = localStorage.getItem('labmu_token');
                 // Endpoint media (sesuaikan jika berbeda)
                 const res = await fetch('/api/media', { headers: { 'Authorization': 'Bearer ' + token } });
                 if(res.ok) {
                     const json = await res.json();
                     const raw = Array.isArray(json) ? json : (json.results || []);
                     this.mediaList = raw.map(m => ({
                         url: m.url || m.file_url || '',
                         title: m.title || (m.key ? m.key.split('/').pop() : 'No Title')
                     }));
                 }
             } catch(e) { console.error(e); }
        },

        get filteredMediaList() {
             const q = (this.mediaSearchQuery || '').toLowerCase();
             return this.mediaList.filter(m => (m.title || '').toLowerCase().includes(q));
        },

        selectMediaItem(img) {
             this.selectedMedia = img; 
        },

        confirmMediaSelection() {
             if (!this.selectedMedia || !this.selectedMedia.url) return alert('Pilih gambar dulu!');
             
             if (this.mediaTarget === 'logo') {
                 this.settings.site_logo = this.selectedMedia.url;
             } else if (this.mediaTarget === 'favicon') {
                 this.settings.site_favicon = this.selectedMedia.url;
             }
             this.mediaModalOpen = false;
        },

        onFileSelect(e) {
             const file = e.target.files[0];
             if (!file) return;
             this.uploadFile = file;
             this.uploadPreview = URL.createObjectURL(file);
        },

        async uploadMediaAction() {
             if (!this.uploadFile) return alert('Pilih file dulu');
             const fd = new FormData();
             fd.append('file', this.uploadFile);
             
             try {
                 const token = localStorage.getItem('labmu_token');
                 const res = await fetch('/api/media', { 
                    method: 'POST', 
                    headers: { 'Authorization': 'Bearer ' + token }, 
                    body: fd 
                 });
                 
                 if (res.ok) {
                     const result = await res.json();
                     await this.loadMediaLibrary();
                     this.mediaTab = 'library';
                     const newUrl = result.url || result.file_url;
                     const newImg = this.mediaList.find(m => m.url === newUrl);
                     if (newImg) this.selectedMedia = newImg;
                     this.uploadFile = null; 
                     this.uploadPreview = null;
                 } else { 
                    alert('Gagal upload.'); 
                 }
             } catch(e) { alert('Error upload: ' + e.message); }
        }
     }">

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="margin:0; font-size:24px; color:#1f2937;">General Settings</h2>
        <button @click="saveSettings()" :disabled="isSaving" 
                style="background:#2563eb; color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px;">
            <i class="fas" :class="isSaving ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            <span x-text="isSaving ? 'Saving...' : 'Save Changes'"></span>
        </button>
    </div>

    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:25px;">
        
        <div style="background:white; padding:25px; border:1px solid #e5e7eb; border-radius:8px;">
            <h4 style="margin-top:0; margin-bottom:20px; font-size:16px; color:#374151;">Site Identity</h4>
            
            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px; color:#4b5563;">Site Title</label>
                <input type="text" x-model="settings.site_title" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box;">
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px; color:#4b5563;">Tagline / Description</label>
                <input type="text" x-model="settings.site_desc" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box;">
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:13px; font-weight:600; margin-bottom:5px; color:#4b5563;">Admin Email</label>
                <input type="email" x-model="settings.admin_email" style="width:100%; padding:10px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box;">
            </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:20px;">
            
            <div style="background:white; padding:20px; border:1px solid #e5e7eb; border-radius:8px;">
                <h4 style="margin-top:0; font-size:14px; color:#374151;">Site Logo</h4>
                <div style="background:#f9fafb; padding:15px; text-align:center; margin:10px 0; border:1px dashed #d1d5db; border-radius:6px; min-height:80px; display:flex; align-items:center; justify-content:center;">
                    <img x-show="settings.site_logo" :src="settings.site_logo" style="max-width:100%; max-height:80px; object-fit:contain;">
                    <span x-show="!settings.site_logo" style="color:#9ca3af; font-size:12px;">No Logo</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <button @click="openMediaSelector('logo')" style="flex:1; background:#2563eb; color:white; border:none; padding:8px; border-radius:4px; font-size:12px; cursor:pointer;">Select Logo</button>
                    <button @click="settings.site_logo = ''" style="background:#fee2e2; color:#dc2626; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
                <input type="text" x-model="settings.site_logo" placeholder="https://..." style="width:100%; margin-top:10px; padding:5px; font-size:11px; border:1px solid #eee; border-radius:4px;">
            </div>

            <div style="background:white; padding:20px; border:1px solid #e5e7eb; border-radius:8px;">
                <h4 style="margin-top:0; font-size:14px; color:#374151;">Favicon</h4>
                <div style="background:#f9fafb; padding:15px; text-align:center; margin:10px 0; border:1px dashed #d1d5db; border-radius:6px; min-height:60px; display:flex; align-items:center; justify-content:center;">
                    <img x-show="settings.site_favicon" :src="settings.site_favicon" style="width:32px; height:32px; object-fit:contain;">
                    <span x-show="!settings.site_favicon" style="color:#9ca3af; font-size:12px;">No Icon</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <button @click="openMediaSelector('favicon')" style="flex:1; background:#2563eb; color:white; border:none; padding:8px; border-radius:4px; font-size:12px; cursor:pointer;">Select Icon</button>
                    <button @click="settings.site_favicon = ''" style="background:#fee2e2; color:#dc2626; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
                 <input type="text" x-model="settings.site_favicon" placeholder="https://..." style="width:100%; margin-top:10px; padding:5px; font-size:11px; border:1px solid #eee; border-radius:4px;">
            </div>

        </div>
    </div>

    <div x-show="mediaModalOpen" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); z-index:99999; display:flex; justify-content:center; align-items:center; padding:20px;" x-cloak>
        <div style="background:white; width:100%; max-width:900px; height:80vh; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
            
            <div style="padding:15px 20px; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-size:16px;">Media Manager</h3>
                <div style="display:flex; gap: 5px; background: #f3f4f6; padding: 3px; border-radius: 6px;">
                    <button @click="mediaTab='library'" :style="mediaTab==='library' ? 'background:white; color:#2563eb; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'color:#6b7280;'" style="border:none; padding:5px 12px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">Library</button>
                    <button @click="mediaTab='upload'" :style="mediaTab==='upload' ? 'background:white; color:#2563eb; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'color:#6b7280;'" style="border:none; padding:5px 12px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">Upload</button>
                </div>
                <button @click="mediaModalOpen=false" style="border:none; background:none; font-size:24px; cursor:pointer; color:#9ca3af;">&times;</button>
            </div>

            <div style="flex:1; overflow:hidden; display:flex;">
                <div style="flex:1; overflow-y:auto; padding:20px; background:#f9fafb;">
                    <div x-show="mediaTab === 'library'" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap:10px;">
                        <template x-for="img in filteredMediaList" :key="img.url">
                            <div @click="selectMediaItem(img)" 
                                 style="cursor:pointer; aspect-ratio:1; background:white; border-radius:6px; overflow:hidden; border:2px solid transparent; position:relative;" 
                                 :style="selectedMedia?.url === img.url ? 'border-color:#2563eb; ring:2px;' : 'border-color:#e5e7eb'">
                                <img :src="img.url" style="width:100%; height:100%; object-fit:cover;">
                                <div x-show="selectedMedia?.url === img.url" style="position:absolute; top:5px; right:5px; background:#2563eb; color:white; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:10px;"><i class="fas fa-check"></i></div>
                            </div>
                        </template>
                        <div x-show="filteredMediaList.length === 0" style="grid-column: 1/-1; text-align:center; padding:40px; color:#9ca3af;">Tidak ada gambar.</div>
                    </div>

                    <div x-show="mediaTab === 'upload'" style="height:100%; display:flex; justify-content:center; align-items:center;">
                        <div style="text-align:center;">
                            <input type="file" @change="onFileSelect" style="display:block; margin:0 auto 20px;">
                            <div x-show="uploadPreview" style="margin-bottom:20px;"><img :src="uploadPreview" style="max-height:150px; border-radius:8px;"></div>
                            <button @click="uploadMediaAction()" :disabled="!uploadFile" style="background:#2563eb; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer;">Upload & Gunakan</button>
                        </div>
                    </div>
                </div>
                
                <div style="width:280px; background:white; border-left:1px solid #e5e7eb; padding:20px; display:flex; flex-direction:column;" x-show="mediaTab === 'library' && selectedMedia">
                    <h4 style="margin-top:0; font-size:14px; color:#374151;">Detail</h4>
                    <img :src="selectedMedia?.url" style="max-width:100%; max-height:150px; object-fit:contain; background:#f9fafb; margin-bottom:15px; border:1px solid #eee;">
                    <button @click="confirmMediaSelection()" style="width:100%; background:#2563eb; color:white; border:none; padding:10px; border-radius:6px; cursor:pointer; margin-top:auto;">Pilih Gambar Ini</button>
                </div>
            </div>
        </div>
    </div>
</div>
  
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/menus.page.ts
var menusPage = `
<div x-show="view === 'menus'" x-init="loadMenus()"> <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="margin:0; font-size:20px;">Menu Manager</h2>
        <button @click="loadMenus()" class="btn" style="background:#fff; border:1px solid #ccc;">
            <i class="fas fa-sync"></i> Refresh List
        </button>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 2fr; gap:20px;">
        
        <div class="card">
            <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">Add / Edit Menu</h3>
            
            <div style="margin-bottom:10px;">
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:5px;">Label (Nama Menu)</label>
                <input type="text" x-model="menuForm.label" class="input" placeholder="Contoh: Tentang Kami">
            </div>
            
            <div style="margin-bottom:10px;">
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:5px;">URL / Link</label>
                <input type="text" x-model="menuForm.url" class="input" placeholder="Contoh: /tentang-kami">
                <small style="color:#666; font-size:11px;">Gunakan <b>/slug</b> untuk halaman internal.</small>
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:12px; font-weight:bold; margin-bottom:5px;">Urutan</label>
                <input type="number" x-model="menuForm.order_num" class="input" placeholder="0">
            </div>

            <div style="display:flex; gap:10px;">
                <button @click="saveMenu()" class="btn btn-primary" style="flex:1;">
                    <span x-text="isSavingMenu ? 'Saving...' : 'Save Menu'"></span>
                </button>
                <button @click="menuForm = {id:null, label:'', url:'', order_num:0}" class="btn" style="border:1px solid #ccc;">
                    Reset
                </button>
            </div>
        </div>

        <div class="card" style="padding:0;">
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="background:#f9f9f9; text-align:left; border-bottom:1px solid #eee;">
                        <th style="padding:10px;">Urutan</th>
                        <th style="padding:10px;">Label</th>
                        <th style="padding:10px;">URL</th>
                        <th style="padding:10px; text-align:right;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template x-for="m in menuList" :key="m.id">
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:10px;" x-text="m.order_num"></td>
                            <td style="padding:10px; font-weight:bold;" x-text="m.label"></td>
                            <td style="padding:10px; color:#2271b1;" x-text="m.url"></td>
                            <td style="padding:10px; text-align:right;">
                                <button @click="deleteMenu(m.id)" style="color:red; background:none; border:none; cursor:pointer;">Delete</button>
                            </td>
                        </tr>
                    </template>
                    <tr x-show="menuList.length === 0">
                        <td colspan="4" style="padding:20px; text-align:center; color:#999;">Belum ada menu. Silakan tambah.</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/modals.ts
/**
* 📦 GLOBAL MODALS COMPONENT
* Modal mandiri dengan logika internal (Self-Contained Logic)
* Menggunakan event window untuk komunikasi dengan komponen lain.
*/
var globalModals = `
<div x-data="{
    // ============================================
    // STATE INTERNAL MODAL
    // ============================================
    showMediaSelector: false,
    mediaTab: 'library', // 'library' | 'upload'
    mediaList: [],
    activeMediaItem: null,
    isUploading: false,
    isSavingMeta: false,
    
    // Form Metadata Sementara
    mediaForm: { 
        title: '', 
        alt: '', 
        caption: '', 
        description: '' 
    },

    // Callback Callback dari pemanggil
    _callback: null,

    // ============================================
    // INIT & LISTENERS
    // ============================================
    init() {
        // Dengar event global 'open-media-modal'
        window.addEventListener('open-media-modal', (e) => {
            this.showMediaSelector = true;
            this.mediaTab = 'library';
            this._callback = e.detail?.callback; // Simpan callback
            this.activeMediaItem = null;
            this.mediaForm = { title:'', alt:'', caption:'', description:'' };
            this.loadMedia(); // Load data terbaru
        });
    },

    // ============================================
    // LOGIKA LOAD DATA
    // ============================================
    async loadMedia() {
        try {
            const token = localStorage.getItem('labmu_token');
            const res = await fetch('/api/media', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const json = await res.json();
            this.mediaList = Array.isArray(json) ? json : (json.results || []);
        } catch(e) { console.error('Modal Load Error', e); }
    },

    // ============================================
    // LOGIKA PILIH GAMBAR
    // ============================================
    selectItem(item) {
        this.activeMediaItem = item;
        // Isi form dengan data item yang dipilih
        this.mediaForm = {
            title: item.title || (item.key ? item.key.split('/').pop() : ''),
            alt: item.alt || '',
            caption: item.caption || '',
            description: item.description || ''
        };
    },

    // ============================================
    // LOGIKA UPLOAD
    // ============================================
    onFileSelect(e) {
        const file = e.target.files[0];
        if(!file) return;
        
        // Auto-fill title dari nama file
        this.mediaForm.title = file.name.split('.')[0].replace(/-/g, ' ');
        this.uploadFile(file);
    },

    async uploadFile(file) {
        this.isUploading = true;
        const fd = new FormData();
        fd.append('file', file);
        // Kirim metadata awal
        fd.append('title', this.mediaForm.title);
        fd.append('alt', this.mediaForm.alt);
        fd.append('caption', this.mediaForm.caption);
        fd.append('description', this.mediaForm.description);

        try {
            const token = localStorage.getItem('labmu_token');
            const res = await fetch('/api/media', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: fd
            });
            
            if(res.ok) {
                const result = await res.json();
                await this.loadMedia(); // Refresh list
                this.mediaTab = 'library';
                
                // Auto-select gambar baru
                const newUrl = result.url || result.file_url;
                const newImg = this.mediaList.find(m => m.url === newUrl);
                if(newImg) this.selectItem(newImg);
            } else {
                alert('Gagal upload.');
            }
        } catch(e) { alert('Error upload.'); }
        finally { this.isUploading = false; }
    },

    // ============================================
    // LOGIKA SIMPAN META & CONFIRM
    // ============================================
    async updateMeta() {
        if(!this.activeMediaItem) return;
        this.isSavingMeta = true;
        
        // Update state lokal (optimistic)
        Object.assign(this.activeMediaItem, this.mediaForm);

        try {
            const token = localStorage.getItem('labmu_token');
            await fetch('/api/media/meta', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token 
                },
                body: JSON.stringify({
                    key: this.activeMediaItem.key,
                    ...this.mediaForm
                })
            });
            alert('Info tersimpan.');
        } catch(e) { console.warn('Meta save error (mungkin backend belum siap)'); }
        finally { this.isSavingMeta = false; }
    },

    confirmSelection() {
        if(this.activeMediaItem && this._callback) {
            // Panggil callback dengan URL dan Meta
            this._callback(this.activeMediaItem.url, this.mediaForm);
        }
        this.showMediaSelector = false;
    }

}" x-init="init()">

    <div class="modal-overlay" 
         x-show="showMediaSelector" 
         x-cloak 
         x-transition.opacity 
         style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 99999; display: flex; justify-content: center; align-items: center;">
       
       <div class="modal-box" @click.away="showMediaSelector=false" 
            style="background: white; width: 95%; max-width: 1100px; height: 90vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          
          <div style="padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff;">
             <div style="display: flex; align-items: center; gap: 15px;">
                 <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">Media Library</h3>
                 
                 <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 6px;">
                    <button @click="mediaTab='library'" 
                            :style="mediaTab==='library' ? 'background:white; box-shadow:0 1px 2px rgba(0,0,0,0.1); font-weight:600; color:#2271b1;' : 'color:#666;'"
                            style="border:none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; transition: 0.2s;">
                        Library
                    </button>
                    <button @click="mediaTab='upload'" 
                            :style="mediaTab==='upload' ? 'background:white; box-shadow:0 1px 2px rgba(0,0,0,0.1); font-weight:600; color:#2271b1;' : 'color:#666;'"
                            style="border:none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; transition: 0.2s;">
                        Upload Baru
                    </button>
                 </div>
             </div>
             <button @click="showMediaSelector=false" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #888; line-height: 1;">&times;</button>
          </div>

          <div style="display: flex; flex: 1; overflow: hidden; background: #f0f0f1;">
              
              <div x-show="mediaTab === 'library'" style="display: flex; width: 100%; height: 100%;">
                  
                  <div style="flex: 1; overflow-y: auto; padding: 20px;">
                     <div x-show="mediaList.length === 0" style="text-align: center; padding: 50px; color: #999;">Belum ada media.</div>
                     
                     <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px;">
                         <template x-for="m in mediaList" :key="m.key">
                            <div @click="selectItem(m)" 
                                 style="cursor: pointer; border: 3px solid transparent; aspect-ratio: 1; background: white; position: relative; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.1s;"
                                 :style="activeMediaItem && activeMediaItem.key === m.key ? 'border-color: #2271b1; box-shadow: 0 0 0 1px #2271b1; transform: scale(0.98);' : 'border-color: transparent;'">
                               <img :src="m.url" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                               <div x-show="activeMediaItem && activeMediaItem.key === m.key" 
                                    style="position: absolute; top: 6px; right: 6px; background: #2271b1; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</div>
                            </div>
                         </template>
                     </div>
                  </div>

                  <div style="width: 320px; flex-shrink: 0; background: white; border-left: 1px solid #ddd; display: flex; flex-direction: column; overflow: hidden;">
                      
                      <div x-show="activeMediaItem" style="display: flex; flex-direction: column; height: 100%;">
                          <div style="flex: 1; overflow-y: auto; padding: 20px;">
                              <h4 style="margin: 0 0 15px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #888; letter-spacing: 0.5px;">Attachment Details</h4>
                              
                              <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; border: 1px solid #eee; text-align: center; margin-bottom: 20px;">
                                  <img :src="activeMediaItem?.url" style="max-width: 100%; max-height: 150px; object-fit: contain;">
                                  <div style="margin-top: 8px; font-size: 11px; color: #666; word-break: break-all;" x-text="activeMediaItem?.key?.split('/').pop()"></div>
                              </div>

                              <div style="display: grid; gap: 15px;">
                                  <div>
                                      <label style="font-size: 11px; font-weight: 600; color: #444; display: block; margin-bottom: 4px;">Title</label>
                                      <input x-model="mediaForm.title" class="input" style="font-size: 13px; padding: 8px;">
                                  </div>
                                  <div>
                                      <label style="font-size: 11px; font-weight: 600; color: #444; display: block; margin-bottom: 4px;">Alt Text</label>
                                      <input x-model="mediaForm.alt" class="input" style="font-size: 13px; padding: 8px;" placeholder="Describe for SEO">
                                  </div>
                                  <div>
                                      <label style="font-size: 11px; font-weight: 600; color: #444; display: block; margin-bottom: 4px;">Caption</label>
                                      <input x-model="mediaForm.caption" class="input" style="font-size: 13px; padding: 8px;">
                                  </div>
                                  <div>
                                      <label style="font-size: 11px; font-weight: 600; color: #444; display: block; margin-bottom: 4px;">Description</label>
                                      <textarea x-model="mediaForm.description" class="input" style="height: 70px; font-size: 13px; padding: 8px;"></textarea>
                                  </div>
                                  <button @click="updateMeta()" class="btn btn-sm" style="width: 100%; justify-content: center; background: #f0f0f1; border: 1px solid #ccc; color: #333;">
                                      <i class="fas" :class="isSavingMeta ? 'fa-spinner fa-spin' : 'fa-save'"></i> Simpan Detail
                                  </button>
                              </div>
                          </div>

                          <div style="padding: 20px; border-top: 1px solid #eee; background: #fff;">
                              <button @click="confirmSelection()" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-weight: 600; font-size: 14px;">
                                  Pilih Gambar Ini
                              </button>
                          </div>
                      </div>

                      <div x-show="!activeMediaItem" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 30px; color: #999;">
                          <i class="fas fa-mouse-pointer fa-3x" style="opacity: 0.2; margin-bottom: 15px;"></i>
                          <p style="font-size: 14px;">Pilih gambar di sebelah kiri<br>untuk melihat detailnya.</p>
                      </div>
                  </div>
              </div>

              <div x-show="mediaTab === 'upload'" style="display: flex; width: 100%; justify-content: center; align-items: center; padding: 40px; overflow-y: auto;">
                  <div style="background: white; padding: 40px; border-radius: 8px; border: 1px solid #eee; width: 100%; max-width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                      
                      <div style="text-align: center; margin-bottom: 30px;">
                          <h4 style="margin: 0 0 10px 0; font-size: 18px;">Upload Gambar Baru</h4>
                          <p style="margin: 0; font-size: 13px; color: #666;">Pilih file gambar untuk diunggah ke library.</p>
                      </div>

                      <label style="display: block; padding: 40px; border: 2px dashed #ccc; border-radius: 8px; cursor: pointer; text-align: center; transition: 0.2s; background: #f9f9f9; margin-bottom: 20px;"
                             :style="isUploading ? 'opacity: 0.5; pointer-events: none;' : ''">
                          <i class="fas" :class="isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'" style="font-size: 40px; color: #ccc; margin-bottom: 15px;"></i>
                          <div style="font-weight: 600; color: #555;" x-text="isUploading ? 'Mengupload...' : 'Klik untuk pilih file'"></div>
                          <div style="font-size: 12px; color: #999; margin-top: 5px;" x-show="!isUploading">Mendukung JPG, PNG, WEBP</div>
                          <input type="file" @change="onFileSelect" style="display: none;" accept="image/*" :disabled="isUploading">
                      </label>

                      <div style="display: grid; gap: 15px; text-align: left;">
                          <div>
                              <label style="font-size: 12px; font-weight: 600;">Judul File</label>
                              <input x-model="mediaForm.title" class="input" placeholder="Otomatis dari nama file">
                          </div>
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                              <div><label style="font-size: 12px; font-weight: 600;">Alt Text</label><input x-model="mediaForm.alt" class="input"></div>
                              <div><label style="font-size: 12px; font-weight: 600;">Caption</label><input x-model="mediaForm.caption" class="input"></div>
                          </div>
                          <div>
                              <label style="font-size: 12px; font-weight: 600;">Deskripsi</label>
                              <textarea x-model="mediaForm.description" class="input" style="height: 60px;"></textarea>
                          </div>
                      </div>

                  </div>
              </div>

          </div>
       </div>
    </div>
</div>
`;
//#endregion
//#region src/cms/modules/admin/ui/blocks/logic/core.logic.ts
/**
* ⚙️ CORE LOGIC (Settings, Users, Themes, Menus)
* Didesain agar independen dari konteks `this` yang ketat.
*/
var coreLogic = {
	async _fetch(url, options = {}) {
		const headers = {
			"Authorization": "Bearer " + localStorage.getItem("labmu_token"),
			"Content-Type": "application/json",
			...options.headers || {}
		};
		if (typeof this.apiFetch === "function") return this.apiFetch(url, options);
		const res = await fetch(url, {
			...options,
			headers
		});
		if (res.status === 401) {
			localStorage.removeItem("labmu_token");
			window.location.href = "/admin/login";
			throw new Error("Unauthorized");
		}
		return res;
	},
	async loadSettings() {
		try {
			const json = await (await this._fetch("/api/settings")).json();
			this.settings = {
				...this.settings,
				...json.data || json || {}
			};
		} catch (e) {
			console.error("Gagal load settings", e);
		}
	},
	async saveSettings() {
		this.isSavingSettings = true;
		try {
			if ((await this._fetch("/api/settings", {
				method: "POST",
				body: JSON.stringify(this.settings)
			})).ok) alert("Pengaturan berhasil disimpan!");
		} catch (e) {
			alert("Gagal menyimpan pengaturan: " + e.message);
		} finally {
			this.isSavingSettings = false;
		}
	},
	openLogoSelector(targetField) {
		this.mediaSelectorTarget = targetField;
		this.view = "media";
	},
	selectSettingImage(url) {
		if (this.mediaSelectorTarget) {
			this.settings[this.mediaSelectorTarget] = url;
			this.mediaSelectorTarget = null;
			this.view = "settings";
		}
	},
	async loadThemes() {
		try {
			const json = await (await this._fetch("/api/theme")).json();
			this.availableThemes = json.data || json || [];
		} catch (e) {
			this.availableThemes = [];
		}
	},
	async activateTheme(id) {
		if (!confirm("Aktifkan tema?")) return;
		try {
			if ((await this._fetch("/api/theme/activate", {
				method: "POST",
				body: JSON.stringify({ themeId: id })
			})).ok) location.reload();
		} catch (e) {
			alert("Gagal ganti tema");
		}
	},
	async loadUsers() {
		this.isLoadingUsers = true;
		try {
			const json = await (await this._fetch("/api/users")).json();
			this.usersList = json.data || json || [];
		} catch (e) {
			this.usersList = [];
		} finally {
			this.isLoadingUsers = false;
		}
	},
	openAddUser() {
		this.editingUserId = null;
		this.userForm = {
			username: "",
			email: "",
			role: "editor",
			password: "",
			name: ""
		};
		this.showUserModal = true;
	},
	editUser(user) {
		this.editingUserId = user.id;
		this.userForm = {
			...user,
			password: ""
		};
		this.showUserModal = true;
	},
	async saveUser() {
		const endpoint = this.editingUserId ? "/api/users/" + this.editingUserId : "/api/users";
		const method = this.editingUserId ? "PUT" : "POST";
		try {
			const res = await this._fetch(endpoint, {
				method,
				body: JSON.stringify(this.userForm)
			});
			if (res.ok) {
				this.showUserModal = false;
				this.loadUsers();
			} else {
				const err = await res.json();
				alert("Gagal simpan user: " + (err.error || "Unknown Error"));
			}
		} catch (e) {
			console.error(e);
		}
	},
	async deleteUser(id) {
		if (!confirm("Hapus user?")) return;
		try {
			if ((await this._fetch("/api/users/" + id, { method: "DELETE" })).ok) this.loadUsers();
		} catch (e) {
			alert("Gagal hapus user");
		}
	},
	async loadMenus() {
		try {
			const json = await (await this._fetch("/api/menus")).json();
			this.menuList = json.data || json || [];
		} catch (e) {
			this.menuList = [];
		}
	},
	async saveMenu() {
		this.isSavingMenu = true;
		const endpoint = this.menuForm.id ? "/api/menus/" + this.menuForm.id : "/api/menus";
		const method = this.menuForm.id ? "PUT" : "POST";
		try {
			if ((await this._fetch(endpoint, {
				method,
				body: JSON.stringify(this.menuForm)
			})).ok) {
				this.menuForm = {
					id: null,
					label: "",
					url: "",
					order_num: 0
				};
				this.loadMenus();
			}
		} catch (e) {
			console.error(e);
		} finally {
			this.isSavingMenu = false;
		}
	},
	async deleteMenu(id) {
		if (!confirm("Hapus menu?")) return;
		try {
			if ((await this._fetch("/api/menus/" + id, { method: "DELETE" })).ok) this.loadMenus();
		} catch (e) {
			console.error(e);
		}
	},
	async loadAllData() {
		await Promise.all([
			this.loadUsers ? this.loadUsers() : Promise.resolve(),
			this.loadMenus ? this.loadMenus() : Promise.resolve(),
			this.loadSettings ? this.loadSettings() : Promise.resolve(),
			this.loadThemes ? this.loadThemes() : Promise.resolve()
		]);
		if (this.loadMedia) await this.loadMedia();
		if (this.loadPosts) await this.loadPosts();
	}
};
//#endregion
//#region src/cms/modules/admin/ui/blocks/logic/media.logic.ts
var mediaLogic = {
	mediaList: [],
	selectedItems: [],
	activeMediaItem: null,
	activeMediaMeta: {
		alt: "",
		title: "",
		description: "",
		filename: ""
	},
	isUploading: false,
	isSavingMeta: false,
	isDeleting: false,
	mediaSearchQuery: "",
	async loadMedia() {
		try {
			const token = localStorage.getItem("labmu_token");
			if (!token) return;
			let json = await (await fetch("/api/media?t=" + Date.now(), { headers: { "Authorization": "Bearer " + token } })).json();
			let rawData = Array.isArray(json) ? json : json.data || json.results || [];
			this.mediaList = rawData.filter((m) => !m.key.endsWith("/"));
			this.selectedItems = [];
			this.activeMediaItem = null;
		} catch (e) {
			console.error("Gagal load media:", e);
			this.mediaList = [];
		}
	},
	toggleSelection(item) {
		const index = this.selectedItems.findIndex((i) => i.id === item.id);
		if (index > -1) this.selectedItems.splice(index, 1);
		else this.selectedItems.push(item);
		if (this.selectedItems.length === 1) this.setActiveItem(this.selectedItems[0]);
		else this.activeMediaItem = null;
	},
	toggleSelectAll() {
		if (this.selectedItems.length === this.filteredMedia.length) {
			this.selectedItems = [];
			this.activeMediaItem = null;
		} else {
			this.selectedItems = [...this.filteredMedia];
			this.activeMediaItem = null;
		}
	},
	setActiveItem(m) {
		this.activeMediaItem = m;
		const currentFilename = m.key ? m.key.split("/").pop() : "";
		this.activeMediaMeta = {
			alt: m.alt || "",
			title: m.title || "",
			description: m.description || "",
			filename: currentFilename
		};
	},
	async deleteSelected() {
		if (this.selectedItems.length === 0) return;
		if (!confirm(`Yakin ingin menghapus ${this.selectedItems.length} file terpilih?`)) return;
		this.isDeleting = true;
		const token = localStorage.getItem("labmu_token");
		for (let item of this.selectedItems) try {
			await fetch("/api/media/" + item.id, {
				method: "DELETE",
				headers: { "Authorization": "Bearer " + token }
			});
		} catch (e) {
			console.error("Gagal hapus", item.id);
		}
		this.isDeleting = false;
		await this.loadMedia();
	},
	async saveMediaMeta() {
		if (!this.activeMediaItem) return;
		this.isSavingMeta = true;
		try {
			const token = localStorage.getItem("labmu_token");
			const payload = {
				...this.activeMediaMeta,
				newFilename: this.activeMediaMeta.filename
			};
			if ((await fetch("/api/media/" + this.activeMediaItem.id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
				},
				body: JSON.stringify(payload)
			})).ok) {
				alert("Tersimpan!");
				this.activeMediaItem = null;
				await this.loadMedia();
			} else alert("Gagal simpan");
		} catch (e) {
			console.error("Save Error:", e);
			alert("Terjadi kesalahan saat menyimpan.");
		} finally {
			this.isSavingMeta = false;
		}
	},
	async compressImage(file, quality = .7, maxWidth = 1600) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event) => {
				const img = new Image();
				img.src = event.target.result;
				img.onload = () => {
					const canvas = document.createElement("canvas");
					let width = img.width;
					let height = img.height;
					if (width > maxWidth) {
						height = Math.round(height * maxWidth / width);
						width = maxWidth;
					}
					canvas.width = width;
					canvas.height = height;
					canvas.getContext("2d").drawImage(img, 0, 0, width, height);
					const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
					canvas.toBlob((blob) => {
						if (!blob) return reject(/* @__PURE__ */ new Error("Kompresi gagal"));
						resolve(new File([blob], file.name, {
							type: outputType,
							lastModified: Date.now()
						}));
					}, outputType, quality);
				};
				img.onerror = (err) => reject(err);
			};
			reader.onerror = (err) => reject(err);
		});
	},
	async uploadMedia(e) {
		const files = e.target.files;
		if (!files.length) return;
		this.isUploading = true;
		const token = localStorage.getItem("labmu_token");
		for (let i = 0; i < files.length; i++) {
			let fileToUpload = files[i];
			if (fileToUpload.type.startsWith("image/")) try {
				console.log(`Mengompres ${fileToUpload.name}...`);
				fileToUpload = await this.compressImage(fileToUpload, .7, 1600);
			} catch (err) {
				console.warn("Gagal kompres, upload file asli.", err);
			}
			const fd = new FormData();
			fd.append("file", fileToUpload);
			try {
				await fetch("/api/media", {
					method: "POST",
					headers: { "Authorization": "Bearer " + token },
					body: fd
				});
			} catch (err) {
				console.error("Upload fail:", err);
			}
		}
		await this.loadMedia();
		this.isUploading = false;
		e.target.value = "";
	},
	get filteredMedia() {
		return (this.mediaList || []).filter((m) => (m.key || "").toLowerCase().includes((this.mediaSearchQuery || "").toLowerCase()));
	},
	isSelected(item) {
		return this.selectedItems.some((i) => i.id === item.id);
	}
};
//#endregion
//#region src/cms/modules/admin/ui/blocks/logic/post.logic.ts
/**
* 🚀 POST LOGIC (Fixed: List Actions & Editor Sync)
* Menangani Hapus, View, dan Edit agar konten muncul.
*/
var postLogic = {
	posts: [],
	isLoading: false,
	preparePayload(rawForm) {
		const form = JSON.parse(JSON.stringify(rawForm));
		let currentContent = "";
		if (typeof window !== "undefined" && window.cmsEditor) currentContent = window.cmsEditor.getContents();
		else currentContent = form.body || "";
		let statusInput = (form.status || "draft").toString().toLowerCase();
		let finalStatus = statusInput.includes("pub") || statusInput.includes("terbit") ? "publish" : "draft";
		return {
			id: form.id && form.id !== "null" ? form.id : void 0,
			title: form.title || "Untitled",
			slug: form.slug ? form.slug.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "") : form.title ? form.title.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "") : "",
			body: currentContent,
			status: finalStatus,
			category: form.category && form.category !== "null" ? form.category : "Uncategorized",
			tags: form.tags && form.tags !== "null" ? form.tags : "",
			featured_image: form.featured_image || "",
			featured_image_caption: form.featured_image_caption || "",
			created_at: form.date ? new Date(form.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
			author: form.author || "Admin"
		};
	},
	async loadPosts() {
		this.isLoading = true;
		try {
			const token = localStorage.getItem("labmu_token");
			const res = await fetch("/api/posts?t=" + Date.now(), { headers: { "Authorization": "Bearer " + token } });
			if (!res.ok) throw new Error("Failed");
			const json = await res.json();
			const rawData = Array.isArray(json) ? json : json.results || [];
			this.posts = rawData.map((p) => ({
				...p,
				category: p.category && p.category !== "null" ? p.category : "Uncategorized",
				tags: p.tags && p.tags !== "null" ? p.tags : "-",
				status: p.status || "draft",
				body: p.body || ""
			}));
		} catch (e) {
			this.posts = [];
		} finally {
			this.isLoading = false;
		}
	},
	async savePost(formInput) {
		const formToProcess = formInput || this.form;
		this.isLoading = true;
		try {
			const token = localStorage.getItem("labmu_token");
			const payload = this.preparePayload(formToProcess);
			const isEdit = payload.id !== void 0;
			const url = isEdit ? `/api/posts/${payload.id}` : "/api/posts";
			const res = await fetch(url, {
				method: isEdit ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token
				},
				body: JSON.stringify(payload)
			});
			const result = await res.json();
			if (res.ok) {
				alert("Berhasil disimpan!");
				if (!isEdit) this.view = "posts";
				await this.loadPosts();
				return true;
			} else {
				alert("Gagal: " + (result.error || "Database Error"));
				return false;
			}
		} catch (e) {
			alert("Kesalahan koneksi.");
			return false;
		} finally {
			this.isLoading = false;
		}
	},
	async deletePost(id) {
		if (!id) return;
		if (!confirm("Hapus post ini permanen?")) return;
		try {
			const token = localStorage.getItem("labmu_token");
			if ((await fetch(`/api/posts/${id}`, {
				method: "DELETE",
				headers: { "Authorization": "Bearer " + token }
			})).ok) {
				this.posts = this.posts.filter((p) => p.id !== id);
				await this.loadPosts();
			} else alert("Gagal menghapus.");
		} catch (e) {
			alert("Gagal koneksi.");
		}
	},
	get uniqueCategories() {
		if (!this.posts || this.posts.length === 0) return ["Uncategorized"];
		const cats = this.posts.map((p) => p.category).filter((c) => c && c !== "-" && c !== "Uncategorized");
		return ["Uncategorized", ...new Set(cats)].sort();
	},
	get uniqueTags() {
		if (!this.posts || this.posts.length === 0) return [];
		const cleaned = this.posts.flatMap((p) => (p.tags || "").split(",")).map((t) => t.trim()).filter((t) => t && t !== "-" && t.length > 2);
		return [...new Set(cleaned)].sort();
	},
	openEditor(type) {
		this.view = "add";
		this.editingId = null;
		this.form = {
			title: "",
			slug: "",
			body: "",
			status: "draft",
			category: "",
			tags: "",
			featured_image: ""
		};
		if (this.posts.length === 0) this.loadPosts();
		setTimeout(() => {
			if (window.initCmsEditor) window.initCmsEditor("editor_id", "", (c) => this.form.body = c);
		}, 100);
	},
	editPost(item) {
		this.view = "add";
		this.editingId = item.id;
		this.form = JSON.parse(JSON.stringify(item));
		if (this.posts.length === 0) this.loadPosts();
		if (this.form.created_at) {
			const date = new Date(this.form.created_at);
			const localDate = /* @__PURE__ */ new Date(date.getTime() - date.getTimezoneOffset() * 6e4);
			this.form.date = localDate.toISOString().slice(0, 16);
		} else {
			const now = /* @__PURE__ */ new Date();
			const localNow = /* @__PURE__ */ new Date(now.getTime() - now.getTimezoneOffset() * 6e4);
			this.form.date = localNow.toISOString().slice(0, 16);
		}
		setTimeout(() => {
			if (window.initCmsEditor) window.initCmsEditor("editor_id", item.body || "", (c) => {
				this.form.body = c;
			});
		}, 100);
	},
	viewPost(slug) {
		if (!slug) {
			alert("Slug belum ada.");
			return;
		}
		window.open("/" + slug, "_blank");
	},
	openFeaturedImageSelector() {
		this.mediaSelectorTarget = "featured_image";
		this.view = "media";
		if (this.loadMedia) this.loadMedia();
	},
	setFeaturedImage(url) {
		this.form.featured_image = url;
		this.mediaSelectorTarget = null;
		this.view = "add";
	},
	removeFeaturedImage() {
		this.form.featured_image = "";
	},
	addTag(tagName) {
		if (!tagName) return;
		const currentTags = (this.form.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
		if (!currentTags.includes(tagName)) {
			currentTags.push(tagName);
			this.form.tags = currentTags.join(", ");
		}
	},
	get availableCategories() {
		if (!this.posts || !Array.isArray(this.posts)) return ["Uncategorized"];
		const cats = this.posts.map((p) => p.category).filter((c) => c && c !== "-" && c !== "null");
		return ["Uncategorized", ...new Set(cats)];
	}
};
if (typeof window !== "undefined") window.initCmsEditor = function(elementId, content, callback) {
	if (window.cmsEditor) try {
		window.cmsEditor.destroy();
	} catch (e) {}
	setTimeout(() => {
		try {
			if (window.SUNEDITOR) {
				const editor = window.SUNEDITOR.create(elementId, {
					display: "block",
					width: "100%",
					height: "500px",
					buttonList: [
						["undo", "redo"],
						[
							"font",
							"fontSize",
							"formatBlock"
						],
						[
							"bold",
							"underline",
							"italic",
							"strike"
						],
						["fontColor", "hiliteColor"],
						["align", "list"],
						[
							"table",
							"link",
							"image",
							"video",
							"codeView"
						]
					]
				});
				editor.setContents(content || "");
				editor.onChange = (c) => {
					if (callback) callback(c);
				};
				window.cmsEditor = editor;
			}
		} catch (e) {
			console.error("Editor Init Error:", e);
		}
	}, 150);
};
//#endregion
//#region src/cms/modules/admin/ui/blocks/cms.logic.ts
/**
* 🧱 CMS MAIN MANAGER (THE MASTER KEY - LOCKED VERSION)
* File ini didesain agar TIDAK PERLU DIUBAH LAGI.
*/
var serializeToScript = (obj) => {
	let props = [];
	for (let key in obj) {
		let val = obj[key];
		if (typeof val === "function") {
			let fnStr = val.toString().trim();
			if (fnStr.startsWith("async")) {
				fnStr = fnStr.replace(/^async\s+[a-zA-Z0-9_$]+\s*/, "async function ");
				if (fnStr.startsWith("async(") || fnStr.startsWith("async (")) fnStr = fnStr.replace("async", "async function");
			} else if (!fnStr.startsWith("function") && !fnStr.startsWith("(")) fnStr = fnStr.replace(/^[a-zA-Z0-9_$]+\s*/, "function ");
			props.push(`${key}: ${fnStr}`);
		} else props.push(`${key}: ${JSON.stringify(val)}`);
	}
	return `{ \n${props.join(",\n")} \n}`;
};
var cmsLogic = `
/** A. INJECT MODULES KE WINDOW (CLIENT SIDE ONLY) */
if (typeof window !== 'undefined') {
    try {
        window.__CMS_CORE = ${serializeToScript(coreLogic)};
        window.__CMS_MEDIA = ${serializeToScript(mediaLogic)};
        window.__CMS_POST = ${serializeToScript(postLogic)};
        window.__CMS_MODALS = ${serializeToScript(globalModals)}; // FIX: Inject script hasil serialisasi
    } catch(e) { 
        console.error('❌ CMS Logic Inject Error:', e);
        window.__CMS_CORE={}; window.__CMS_MEDIA={}; window.__CMS_POST={}; window.__CMS_MODALS={};
    }
}

/** B. MAIN APP */
if (typeof window !== 'undefined') {
    window.cms = function() {
        return {
            // ============================
            // 1. BASE STATE
            // ============================
            token: localStorage.getItem('labmu_token') || '',
            userRole: 'admin',
            view: 'dash',
            sidebarOpen: true,
            activeThemeId: localStorage.getItem('labmu_active_theme') || 'default',
            logoType: 'site_logo',
            isLoggingIn: false,
            
            // Data Buckets
            posts: [], pages: [], mediaList: [], usersList: [], 
            menuList: [], availableThemes: [], selectedItems: [],
            
            // UI Flags
            isLoadingPosts: false, isLoadingPages: false, isLoadingUsers: false, isLoadingThemes: false,
            isUploading: false, isUploadingFeatured: false, 
            isSavingMeta: false, isSavingMenu: false, isSavingSettings: false,
            showMediaSelector: false, showUserModal: false,
            
            // Helpers
            mediaSearchQuery: '', mediaSelectorTarget: null, targetLogoField: null, activeMediaItem: null,
            activeMediaMeta: { alt: '', title: '', description: '' },
            editingId: null, editingUserId: null,
            
            // Standard Forms
            form: { title: '', slug: '', body: '', type: 'post', status: 'publish', date: '', category: '', tags: '', featured_image: '' },
            userForm: { username: '', email: '', role: 'editor', password: '', name: '' },
            menuForm: { id: null, label: '', url: '', order_num: 0 },
            settings: { site_title: '', site_desc: '', admin_email: '', site_logo: '', site_favicon: '' },
            loginForm: { username: '', password: '' },

            // ============================
            // 2. EXPLICIT BRIDGING (Jaminan Fitur Muncul)
            // ============================
            loadPages() { if(window.__CMS_CORE?.loadPages) return window.__CMS_CORE.loadPages.call(this); },
            savePage() { if(window.__CMS_CORE?.savePage) return window.__CMS_CORE.savePage.call(this); },
            
            loadUsers() { if(window.__CMS_CORE?.loadUsers) return window.__CMS_CORE.loadUsers.call(this); },
            saveUser() { if(window.__CMS_CORE?.saveUser) return window.__CMS_CORE.saveUser.call(this); },
            deleteUser(id) { if(window.__CMS_CORE?.deleteUser) return window.__CMS_CORE.deleteUser.call(this, id); },
            
            loadSettings() { if(window.__CMS_CORE?.loadSettings) return window.__CMS_CORE.loadSettings.call(this); },
            saveSettings() { if(window.__CMS_CORE?.saveSettings) return window.__CMS_CORE.saveSettings.call(this); },
            
            loadMenu() { if(window.__CMS_CORE?.loadMenu) return window.__CMS_CORE.loadMenu.call(this); },
            saveMenu() { if(window.__CMS_CORE?.saveMenu) return window.__CMS_CORE.saveMenu.call(this); },
            
            loadPosts() { if(window.__CMS_POST?.loadPosts) return window.__CMS_POST.loadPosts.call(this); },
            savePost(frm) { if(window.__CMS_POST?.savePost) return window.__CMS_POST.savePost.call(this, frm || this.form); },
            deletePost(id) { if(window.__CMS_POST?.deletePost) return window.__CMS_POST.deletePost.call(this, id); },
            
            loadMedia() { if(window.__CMS_MEDIA?.loadMedia) return window.__CMS_MEDIA.loadMedia.call(this); },
            uploadMedia(files) { if(window.__CMS_MEDIA?.uploadMedia) return window.__CMS_MEDIA.uploadMedia.call(this, files); },

            // ============================
            // 3. MERGE LOGIC (Fallback & Modals)
            // ============================
            ...window.__CMS_CORE,
            ...window.__CMS_MEDIA,
            ...window.__CMS_POST,
            ...window.__CMS_MODALS, // ADD: Merge Logic Modal agar bisa dipanggil dari HTML

            // ============================
            // 4. SMART ACTIONS
            // ============================
            async save() {
                const v = this.view;
                const funcNamePlural = 'save' + v.charAt(0).toUpperCase() + v.slice(1); 
                const funcNameSingular = 'save' + v.slice(0, -1).charAt(0).toUpperCase() + v.slice(1, -1);

                if (typeof this[funcNamePlural] === 'function') {
                    await this[funcNamePlural]();
                } else if (v.endsWith('s') && typeof this[funcNameSingular] === 'function') {
                    await this[funcNameSingular]();
                } 
                else if (['add', 'edit'].includes(v)) {
                    if(this.form.type === 'page') {
                        if(this.savePage) await this.savePage();
                    } else {
                        if(this.savePost) await this.savePost(this.form);
                    }
                } else {
                    console.warn('⚠️ No save function for view:', v);
                }
            },

            // ============================
            // 5. INIT SYSTEM
            // ============================
            init() {
                this.posts = []; this.pages = []; this.mediaList = []; this.usersList = [];
                this.initRouter();
                
                if (this.token) {
                    setTimeout(() => {
                        if (typeof window.__CMS_CORE?.loadAllData === 'function') {
                             window.__CMS_CORE.loadAllData.call(this);
                        } else {
                            if(this.loadPosts) this.loadPosts();
                            if(this.loadPages) this.loadPages();
                            if(this.loadMedia) this.loadMedia();
                            if(this.loadUsers) this.loadUsers();
                        }
                    }, 100);
                }
            },

            initRouter() {
                const h = window.location.hash.replace('#', '') || 'dash';
                this.view = h;
                window.addEventListener('hashchange', () => { 
                    const newView = window.location.hash.replace('#', '') || 'dash';
                    if(this.view !== newView) this.view = newView; 
                });
            },

            // ============================
            // 6. GLOBAL HELPERS
            // ============================
            formatDate(i) { return i ? new Date(i).toLocaleDateString('id-ID') : '-'; },
            logout() { localStorage.removeItem('labmu_token'); window.location.reload(); },
            getPageTitle() {
                if (!this.view) return 'Admin';
                return this.view.charAt(0).toUpperCase() + this.view.slice(1);
            },

            openEditor(type) { 
                this.view = 'add'; 
                this.editingId = null;
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                
                this.form = { 
                    title: '', slug: '', body: '', 
                    type: type || 'post', 
                    status: 'publish', 
                    date: now.toISOString().slice(0,16), 
                    category: '', tags: '', featured_image: '' 
                };
                
                setTimeout(() => { 
                    if(window.initCmsEditor) window.initCmsEditor('editor_id', '', (c) => this.form.body = c);
                }, 50);
            },

            editContent(item) {
                this.view = 'add'; 
                this.editingId = item.id;
                this.form = JSON.parse(JSON.stringify(item));
                
                if(this.form.date) {
                    const d = new Date(this.form.date);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    this.form.date = d.toISOString().slice(0,16);
                }
                
                setTimeout(() => { 
                    if(window.initCmsEditor) window.initCmsEditor('editor_id', item.body || '', (c) => this.form.body = c);
                }, 50);
            },
            
            makeSlug() { 
                if(!this.editingId && this.form.title) {
                    this.form.slug = this.form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                } 
            },

            get uniqueCategories() { 
                if (!this.posts || !Array.isArray(this.posts)) return [];
                return [...new Set(this.posts.map(p => p.category).filter(c => c))]; 
            },
            get filteredMedia() { 
                if (!this.mediaList || !Array.isArray(this.mediaList)) return [];
                return this.mediaList.filter(m => (m.key || '').toLowerCase().includes((this.mediaSearchQuery||'').toLowerCase())); 
            },
            get dashboardStats() {
                return {
                    posts: (this.posts || []).length,
                    pages: (this.pages || []).length,
                    media: (this.mediaList || []).length,
                    users: (this.usersList || []).length
                };
            }
        };
    };
}
`;
//#endregion
//#region src/cms/modules/admin/ui/pages/login.page.ts
var loginPage = `
<div x-show="!token" 
     style="position: fixed; inset: 0; background: #f8fafc; z-index: 99999; display: grid !important; place-items: center;"
     x-data="{
        loginForm: { username: '', password: '' }, // Gunakan nama unik agar tidak bentrok dengan state global
        isLoading: false,
        errorMsg: '',
        
        async submitLogin() {
            if (this.isLoading) return;
            this.isLoading = true; 
            this.errorMsg = '';
            
            try {
                // 1. Fetch ke backend (Endpoint pastikan sesuai dengan app.ts)
                const res = await fetch('/api/users/login', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.loginForm) 
                });

                const text = await res.text();
                let data;
                
                // 2. Coba parse JSON
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error('Respon server bukan JSON valid: ' + text.substring(0, 30));
                }

                // 3. Cek apakah status OK
                if (!res.ok) {
                    throw new Error(data.error || data.message || 'Gagal masuk (Status ' + res.status + ')');
                }
                
                // 4. Jika Sukses
                if (data.token) {
                    // Simpan token dengan key yang konsisten
                    localStorage.setItem('labmu_token', data.token);
                    
                    // Update state lokal agar x-show langsung bereaksi sebelum reload
                    this.token = data.token;
                    
                    // Beri jeda kecil agar user melihat status sukses sebelum reload
                    setTimeout(() => {
                        window.location.href = '/admin'; // Force ke dashboard
                    }, 100);
                } else {
                    throw new Error('Token tidak ditemukan dalam respon server');
                }

            } catch (e) {
                console.error('[Login Error]:', e);
                this.errorMsg = e.message; 
            } finally {
                this.isLoading = false;
            }
        }
     }">

    <div style="width: 100%; max-width: 400px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <div style="text-align:center; margin-bottom:30px;">
             <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 800;">LabMu Login</h2>
             <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Masuk ke Dashboard Admin</p>
        </div>
        
        <div x-show="errorMsg" 
             x-transition
             style="background:#fee2e2; color:#991b1b; padding:12px; margin-bottom:20px; border-radius:6px; font-size:13px; border:1px solid #fca5a5; word-break: break-word;" 
             x-text="errorMsg"></div>

        <form @submit.prevent="submitLogin">
            <div style="margin-bottom: 20px;">
                <label style="display:block; font-weight:600; margin-bottom:8px; font-size:14px; color:#334155;">Username</label>
                <input type="text" 
                       x-model="loginForm.username" 
                       style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; box-sizing:border-box; font-size:15px;" 
                       required 
                       placeholder="Masukkan username">
            </div>
            <div style="margin-bottom: 25px;">
                <label style="display:block; font-weight:600; margin-bottom:8px; font-size:14px; color:#334155;">Password</label>
                <input type="password" 
                       x-model="loginForm.password" 
                       style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; box-sizing:border-box; font-size:15px;" 
                       required 
                       placeholder="••••••••">
            </div>
            <button type="submit" 
                    style="width:100%; padding:14px; background:#0f172a; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer; font-size:15px; transition: all 0.2s;" 
                    :style="isLoading ? 'opacity: 0.7; cursor: not-allowed;' : ''"
                    :disabled="isLoading">
                <span x-text="isLoading ? 'Memproses...' : 'Masuk'"></span>
            </button>
        </form>
    </div>
</div>
`;
//#endregion
//#region src/cms/modules/admin/ui/view.ts
function renderAdmin(data) {
	const isLoginView = data.view === "login";
	const injectedPlugins = pluginMenus.map((p) => {
		return `{
            group: "${p.group}",
            title: "${p.title}",
            icon: "${p.icon}",
            ${p.view ? `view: "${p.view}",` : ""}
            ${p.href ? `href: "${p.href}",` : ""}
            ${p.role ? `role: ${JSON.stringify(p.role)},` : ""}
            ${p.actionCode ? `action: function() { ${p.actionCode} }` : ""}
        }`;
	}).join(",");
	try {
		return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin LabMu</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <link href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css" rel="stylesheet">
            <style>
                ${adminStyles}
                [x-cloak] { display: none !important; }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js"><\/script>
            <script src="https://cdn.jsdelivr.net/npm/suneditor@latest/src/lang/en.js"><\/script>
            
            <script>
                (function() {
                    const token = localStorage.getItem('labmu_token');
                    const isLoginPage = window.location.pathname.includes('/login');
                    if (!token && !isLoginPage) {
                        window.location.href = '/admin/login'; 
                    }
                })();

                /** * [CORE MENUS]
                 * Menu bawaan sistem yang statis
                 */
                window.adminMenus = [
                    { group: 'Content', title: 'All Posts', view: 'posts', icon: 'fas fa-thumbtack', action: () => typeof loadPosts === 'function' && loadPosts() },
                    { group: 'Content', title: 'Add Post', view: 'add', icon: 'fas fa-plus-circle', action: () => { window.editingId = null; } },
                    { group: 'Content', title: 'Pages', view: 'pages', icon: 'fas fa-copy', action: () => typeof loadPages === 'function' && loadPages() },
                    { group: 'Content', title: 'Add Page', view: 'add-page', icon: 'fas fa-plus-square', action: () => { window.editingPageId = null; } },
                    { group: 'Content', title: 'Media', view: 'media', icon: 'fas fa-photo-video', action: () => typeof loadMedia === 'function' && loadMedia() },
                    { group: 'Appearance', title: 'Themes', view: 'themes', icon: 'fas fa-paint-brush', role: ['admin', 'editor'] },
                    { group: 'Appearance', title: 'Menus', view: 'menus', icon: 'fas fa-bars', role: ['admin', 'editor'] },
                    { group: 'System', title: 'Users', view: 'users', icon: 'fas fa-users', role: ['admin'], action: () => typeof loadUsers === 'function' && loadUsers() },
                    { group: 'System', title: 'Settings', view: 'settings', icon: 'fas fa-cog', role: ['admin'] }
                ];

                /**
                 * [PLUGIN INJECTION]
                 * Di sini keajaibannya. Server menyuntikkan menu plugin secara otomatis.
                 * Tidak ada hardcode nama plugin di file ini.
                 */
                const plugins = [${injectedPlugins}]; 
                
                // Gabungkan menu core dengan menu plugin
                window.adminMenus = window.adminMenus.concat(plugins);

            <\/script>

            <script>${cmsLogic}<\/script>
            <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script>
        </head>
        <body x-data="cms()" x-init="init()" x-cloak>
            
            <template x-if="${isLoginView} || !token">
                ${loginPage}
            </template>

            <template x-if="token && !${isLoginView}">
                <div class="app-layout" 
                     :style="sidebarOpen ? 'grid-template-columns: 240px 1fr' : 'grid-template-columns: 60px 1fr'" 
                     style="display:grid; height:100vh;">
                    
                    ${sidebarBlock}

                    <div style="display:flex; flex-direction:column; overflow:hidden;">
                        <header style="background:#fff; padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                            <div style="display:flex; align-items:center; gap:15px;">
                                <button @click="sidebarOpen = !sidebarOpen" style="border:none; background:none; cursor:pointer;">
                                    <i class="fas fa-bars"></i>
                                </button>
                                <h3 x-text="getPageTitle()" style="margin:0; font-size: 16px;"></h3>
                            </div>
                            <div style="display:flex; align-items:center; gap:10px;">
                                 <button @click="logout()" style="font-size:12px; cursor:pointer; background:#f44336; color:white; border:none; padding:5px 10px; border-radius:4px;">
                                    <i class="fas fa-sign-out-alt"></i> Logout
                                 </button>
                            </div>
                        </header>

                        <main style="flex:1; overflow-y:auto; padding:20px;">
                            ${dashboardPage}
                            ${pagesBlock}
                            <template x-if="view === 'menus'"><div class="exclusive-wrapper">${menusPage}</div></template>
                            ${globalModals}
                        </main>
                    </div>
                </div>
            </template>
        </body>
        </html>`;
	} catch (err) {
		return `<h1>Render Error: ${err.message}</h1>`;
	}
}
//#endregion
//#region src/cms/modules/admin/admin.router.ts
var admin = new Hono();
admin.get("/", (c) => {
	return c.html(renderAdmin());
});
admin.get("/:type/new", (c) => {
	const type = c.req.param("type");
	if (type !== "post" && type !== "page") return c.redirect("/admin");
	return c.html(editorPage);
});
admin.get("/:type/:id/edit", (c) => {
	return c.html(editorPage);
});
admin.get("/data/users", async (c) => {
	try {
		const users = await c.env.DB.prepare("SELECT id, username, name, email, role, created_at FROM users ORDER BY id DESC").all();
		return c.json({
			success: true,
			data: users.results
		});
	} catch (e) {
		return c.json({
			success: false,
			error: e.message
		}, 500);
	}
});
//#endregion
//#region node_modules/hono/dist/utils/encode.js
var decodeBase64Url = (str) => {
	return decodeBase64(str.replace(/_|-/g, (m) => ({
		_: "/",
		"-": "+"
	})[m] ?? m));
};
var encodeBase64Url = (buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({
	"/": "_",
	"+": "-"
})[m] ?? m);
var encodeBase64 = (buf) => {
	let binary = "";
	const bytes = new Uint8Array(buf);
	for (let i = 0, len = bytes.length; i < len; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
};
var decodeBase64 = (str) => {
	const binary = atob(str);
	const bytes = new Uint8Array(new ArrayBuffer(binary.length));
	const half = binary.length / 2;
	for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
		bytes[i] = binary.charCodeAt(i);
		bytes[j] = binary.charCodeAt(j);
	}
	return bytes;
};
//#endregion
//#region node_modules/hono/dist/utils/jwt/jwa.js
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
	AlgorithmTypes2["HS256"] = "HS256";
	AlgorithmTypes2["HS384"] = "HS384";
	AlgorithmTypes2["HS512"] = "HS512";
	AlgorithmTypes2["RS256"] = "RS256";
	AlgorithmTypes2["RS384"] = "RS384";
	AlgorithmTypes2["RS512"] = "RS512";
	AlgorithmTypes2["PS256"] = "PS256";
	AlgorithmTypes2["PS384"] = "PS384";
	AlgorithmTypes2["PS512"] = "PS512";
	AlgorithmTypes2["ES256"] = "ES256";
	AlgorithmTypes2["ES384"] = "ES384";
	AlgorithmTypes2["ES512"] = "ES512";
	AlgorithmTypes2["EdDSA"] = "EdDSA";
	return AlgorithmTypes2;
})(AlgorithmTypes || {});
//#endregion
//#region node_modules/hono/dist/helper/adapter/index.js
var knownUserAgents = {
	deno: "Deno",
	bun: "Bun",
	workerd: "Cloudflare-Workers",
	node: "Node.js"
};
var getRuntimeKey = () => {
	const global = globalThis;
	if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string") {
		for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) if (checkUserAgentEquals(userAgent)) return runtimeKey;
	}
	if (typeof global?.EdgeRuntime === "string") return "edge-light";
	if (global?.fastly !== void 0) return "fastly";
	if (global?.process?.release?.name === "node") return "node";
	return "other";
};
var checkUserAgentEquals = (platform) => {
	return navigator.userAgent.startsWith(platform);
};
//#endregion
//#region node_modules/hono/dist/utils/jwt/types.js
var JwtAlgorithmNotImplemented = class extends Error {
	constructor(alg) {
		super(`${alg} is not an implemented algorithm`);
		this.name = "JwtAlgorithmNotImplemented";
	}
};
var JwtAlgorithmRequired = class extends Error {
	constructor() {
		super("JWT verification requires \"alg\" option to be specified");
		this.name = "JwtAlgorithmRequired";
	}
};
var JwtAlgorithmMismatch = class extends Error {
	constructor(expected, actual) {
		super(`JWT algorithm mismatch: expected "${expected}", got "${actual}"`);
		this.name = "JwtAlgorithmMismatch";
	}
};
var JwtTokenInvalid = class extends Error {
	constructor(token) {
		super(`invalid JWT token: ${token}`);
		this.name = "JwtTokenInvalid";
	}
};
var JwtTokenNotBefore = class extends Error {
	constructor(token) {
		super(`token (${token}) is being used before it's valid`);
		this.name = "JwtTokenNotBefore";
	}
};
var JwtTokenExpired = class extends Error {
	constructor(token) {
		super(`token (${token}) expired`);
		this.name = "JwtTokenExpired";
	}
};
var JwtTokenIssuedAt = class extends Error {
	constructor(currentTimestamp, iat) {
		super(`Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`);
		this.name = "JwtTokenIssuedAt";
	}
};
var JwtTokenIssuer = class extends Error {
	constructor(expected, iss) {
		super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
		this.name = "JwtTokenIssuer";
	}
};
var JwtHeaderInvalid = class extends Error {
	constructor(header) {
		super(`jwt header is invalid: ${JSON.stringify(header)}`);
		this.name = "JwtHeaderInvalid";
	}
};
var JwtHeaderRequiresKid = class extends Error {
	constructor(header) {
		super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
		this.name = "JwtHeaderRequiresKid";
	}
};
var JwtSymmetricAlgorithmNotAllowed = class extends Error {
	constructor(alg) {
		super(`symmetric algorithm "${alg}" is not allowed for JWK verification`);
		this.name = "JwtSymmetricAlgorithmNotAllowed";
	}
};
var JwtAlgorithmNotAllowed = class extends Error {
	constructor(alg, allowedAlgorithms) {
		super(`algorithm "${alg}" is not in the allowed list: [${allowedAlgorithms.join(", ")}]`);
		this.name = "JwtAlgorithmNotAllowed";
	}
};
var JwtTokenSignatureMismatched = class extends Error {
	constructor(token) {
		super(`token(${token}) signature mismatched`);
		this.name = "JwtTokenSignatureMismatched";
	}
};
var JwtPayloadRequiresAud = class extends Error {
	constructor(payload) {
		super(`required "aud" in jwt payload: ${JSON.stringify(payload)}`);
		this.name = "JwtPayloadRequiresAud";
	}
};
var JwtTokenAudience = class extends Error {
	constructor(expected, aud) {
		super(`expected audience "${Array.isArray(expected) ? expected.join(", ") : expected}", got "${aud}"`);
		this.name = "JwtTokenAudience";
	}
};
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
	CryptoKeyUsage2["Encrypt"] = "encrypt";
	CryptoKeyUsage2["Decrypt"] = "decrypt";
	CryptoKeyUsage2["Sign"] = "sign";
	CryptoKeyUsage2["Verify"] = "verify";
	CryptoKeyUsage2["DeriveKey"] = "deriveKey";
	CryptoKeyUsage2["DeriveBits"] = "deriveBits";
	CryptoKeyUsage2["WrapKey"] = "wrapKey";
	CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
	return CryptoKeyUsage2;
})(CryptoKeyUsage || {});
//#endregion
//#region node_modules/hono/dist/utils/jwt/utf8.js
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();
//#endregion
//#region node_modules/hono/dist/utils/jwt/jws.js
async function signing(privateKey, alg, data) {
	const algorithm = getKeyAlgorithm(alg);
	const cryptoKey = await importPrivateKey(privateKey, algorithm);
	return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
async function verifying(publicKey, alg, signature, data) {
	const algorithm = getKeyAlgorithm(alg);
	const cryptoKey = await importPublicKey(publicKey, algorithm);
	return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
function pemToBinary(pem) {
	return decodeBase64(pem.replace(/-+(BEGIN|END).*?-+/g, "").replace(/\s/g, ""));
}
async function importPrivateKey(key, alg) {
	if (!crypto.subtle || !crypto.subtle.importKey) throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
	if (isCryptoKey(key)) {
		if (key.type !== "private" && key.type !== "secret") throw new Error(`unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`);
		return key;
	}
	const usages = [CryptoKeyUsage.Sign];
	if (typeof key === "object") return await crypto.subtle.importKey("jwk", key, alg, false, usages);
	if (key.includes("PRIVATE")) return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
	return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
async function importPublicKey(key, alg) {
	if (!crypto.subtle || !crypto.subtle.importKey) throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
	if (isCryptoKey(key)) {
		if (key.type === "public" || key.type === "secret") return key;
		key = await exportPublicJwkFrom(key);
	}
	if (typeof key === "string" && key.includes("PRIVATE")) key = await exportPublicJwkFrom(await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [CryptoKeyUsage.Sign]));
	const usages = [CryptoKeyUsage.Verify];
	if (typeof key === "object") return await crypto.subtle.importKey("jwk", key, alg, false, usages);
	if (key.includes("PUBLIC")) return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
	return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
async function exportPublicJwkFrom(privateKey) {
	if (privateKey.type !== "private") throw new Error(`unexpected key type: ${privateKey.type}`);
	if (!privateKey.extractable) throw new Error("unexpected private key is unextractable");
	const jwk = await crypto.subtle.exportKey("jwk", privateKey);
	const { kty } = jwk;
	const { alg, e, n } = jwk;
	const { crv, x, y } = jwk;
	return {
		kty,
		alg,
		e,
		n,
		crv,
		x,
		y,
		key_ops: [CryptoKeyUsage.Verify]
	};
}
function getKeyAlgorithm(name) {
	switch (name) {
		case "HS256": return {
			name: "HMAC",
			hash: { name: "SHA-256" }
		};
		case "HS384": return {
			name: "HMAC",
			hash: { name: "SHA-384" }
		};
		case "HS512": return {
			name: "HMAC",
			hash: { name: "SHA-512" }
		};
		case "RS256": return {
			name: "RSASSA-PKCS1-v1_5",
			hash: { name: "SHA-256" }
		};
		case "RS384": return {
			name: "RSASSA-PKCS1-v1_5",
			hash: { name: "SHA-384" }
		};
		case "RS512": return {
			name: "RSASSA-PKCS1-v1_5",
			hash: { name: "SHA-512" }
		};
		case "PS256": return {
			name: "RSA-PSS",
			hash: { name: "SHA-256" },
			saltLength: 32
		};
		case "PS384": return {
			name: "RSA-PSS",
			hash: { name: "SHA-384" },
			saltLength: 48
		};
		case "PS512": return {
			name: "RSA-PSS",
			hash: { name: "SHA-512" },
			saltLength: 64
		};
		case "ES256": return {
			name: "ECDSA",
			hash: { name: "SHA-256" },
			namedCurve: "P-256"
		};
		case "ES384": return {
			name: "ECDSA",
			hash: { name: "SHA-384" },
			namedCurve: "P-384"
		};
		case "ES512": return {
			name: "ECDSA",
			hash: { name: "SHA-512" },
			namedCurve: "P-521"
		};
		case "EdDSA": return {
			name: "Ed25519",
			namedCurve: "Ed25519"
		};
		default: throw new JwtAlgorithmNotImplemented(name);
	}
}
function isCryptoKey(key) {
	if (getRuntimeKey() === "node" && !!crypto.webcrypto) return key instanceof crypto.webcrypto.CryptoKey;
	return key instanceof CryptoKey;
}
//#endregion
//#region node_modules/hono/dist/utils/jwt/jwt.js
var encodeJwtPart = (part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, "");
var encodeSignaturePart = (buf) => encodeBase64Url(buf).replace(/=/g, "");
var decodeJwtPart = (part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part)));
function isTokenHeader(obj) {
	if (typeof obj === "object" && obj !== null) {
		const objWithAlg = obj;
		return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
	}
	return false;
}
var sign$1 = async (payload, privateKey, alg = "HS256") => {
	const encodedPayload = encodeJwtPart(payload);
	let encodedHeader;
	if (typeof privateKey === "object" && "alg" in privateKey) {
		alg = privateKey.alg;
		encodedHeader = encodeJwtPart({
			alg,
			typ: "JWT",
			kid: privateKey.kid
		});
	} else encodedHeader = encodeJwtPart({
		alg,
		typ: "JWT"
	});
	const partialToken = `${encodedHeader}.${encodedPayload}`;
	return `${partialToken}.${encodeSignaturePart(await signing(privateKey, alg, utf8Encoder.encode(partialToken)))}`;
};
var verify$1 = async (token, publicKey, algOrOptions) => {
	if (!algOrOptions) throw new JwtAlgorithmRequired();
	const { alg, iss, nbf = true, exp = true, iat = true, aud } = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions;
	if (!alg) throw new JwtAlgorithmRequired();
	const tokenParts = token.split(".");
	if (tokenParts.length !== 3) throw new JwtTokenInvalid(token);
	const { header, payload } = decode$1(token);
	if (!isTokenHeader(header)) throw new JwtHeaderInvalid(header);
	if (header.alg !== alg) throw new JwtAlgorithmMismatch(alg, header.alg);
	const now = Math.floor(Date.now() / 1e3);
	if (nbf && payload.nbf !== void 0) {
		if (typeof payload.nbf !== "number" || !Number.isFinite(payload.nbf) || payload.nbf > now) throw new JwtTokenNotBefore(token);
	}
	if (exp && payload.exp !== void 0) {
		if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= now) throw new JwtTokenExpired(token);
	}
	if (iat && payload.iat !== void 0) {
		if (typeof payload.iat !== "number" || !Number.isFinite(payload.iat) || now < payload.iat) throw new JwtTokenIssuedAt(now, payload.iat);
	}
	if (iss) {
		if (!payload.iss) throw new JwtTokenIssuer(iss, null);
		if (typeof iss === "string" && payload.iss !== iss) throw new JwtTokenIssuer(iss, payload.iss);
		if (iss instanceof RegExp && !iss.test(payload.iss)) throw new JwtTokenIssuer(iss, payload.iss);
	}
	if (aud) {
		if (!payload.aud) throw new JwtPayloadRequiresAud(payload);
		if (!(Array.isArray(payload.aud) ? payload.aud : [payload.aud]).some((payloadAud) => aud instanceof RegExp ? aud.test(payloadAud) : typeof aud === "string" ? payloadAud === aud : Array.isArray(aud) && aud.includes(payloadAud))) throw new JwtTokenAudience(aud, payload.aud);
	}
	const headerPayload = token.substring(0, token.lastIndexOf("."));
	if (!await verifying(publicKey, alg, decodeBase64Url(tokenParts[2]), utf8Encoder.encode(headerPayload))) throw new JwtTokenSignatureMismatched(token);
	return payload;
};
var symmetricAlgorithms = [
	AlgorithmTypes.HS256,
	AlgorithmTypes.HS384,
	AlgorithmTypes.HS512
];
var verifyWithJwks$1 = async (token, options, init) => {
	const verifyOpts = options.verification || {};
	const header = decodeHeader(token);
	if (!isTokenHeader(header)) throw new JwtHeaderInvalid(header);
	if (!header.kid) throw new JwtHeaderRequiresKid(header);
	if (symmetricAlgorithms.includes(header.alg)) throw new JwtSymmetricAlgorithmNotAllowed(header.alg);
	if (!options.allowedAlgorithms.includes(header.alg)) throw new JwtAlgorithmNotAllowed(header.alg, options.allowedAlgorithms);
	let verifyKeys = options.keys ? [...options.keys] : void 0;
	if (options.jwks_uri) {
		const response = await fetch(options.jwks_uri, init);
		if (!response.ok) throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
		const data = await response.json();
		if (!data.keys) throw new Error("invalid JWKS response. \"keys\" field is missing");
		if (!Array.isArray(data.keys)) throw new Error("invalid JWKS response. \"keys\" field is not an array");
		verifyKeys ??= [];
		verifyKeys.push(...data.keys);
	} else if (!verifyKeys) throw new Error("verifyWithJwks requires options for either \"keys\" or \"jwks_uri\" or both");
	const matchingKey = verifyKeys.find((key) => key.kid === header.kid);
	if (!matchingKey) throw new JwtTokenInvalid(token);
	if (matchingKey.alg && matchingKey.alg !== header.alg) throw new JwtAlgorithmMismatch(matchingKey.alg, header.alg);
	return await verify$1(token, matchingKey, {
		alg: header.alg,
		...verifyOpts
	});
};
var decode$1 = (token) => {
	const parts = token.split(".");
	if (parts.length !== 3) throw new JwtTokenInvalid(token);
	try {
		return {
			header: decodeJwtPart(parts[0]),
			payload: decodeJwtPart(parts[1])
		};
	} catch {
		throw new JwtTokenInvalid(token);
	}
};
var decodeHeader = (token) => {
	const parts = token.split(".");
	if (parts.length !== 3) throw new JwtTokenInvalid(token);
	try {
		return decodeJwtPart(parts[0]);
	} catch {
		throw new JwtTokenInvalid(token);
	}
};
//#endregion
//#region node_modules/hono/dist/utils/jwt/index.js
var Jwt = {
	sign: sign$1,
	verify: verify$1,
	decode: decode$1,
	verifyWithJwks: verifyWithJwks$1
};
Jwt.verifyWithJwks;
Jwt.verify;
Jwt.decode;
var sign = Jwt.sign;
//#endregion
//#region src/cms/modules/contents/contents.router.ts
var usersRouter$1 = new Hono();
usersRouter$1.post("/login", async (c) => {
	try {
		const { username, password } = await c.req.json();
		if (!username || !password) return c.json({ error: "Username dan password wajib diisi." }, 400);
		const user = await c.env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
		if (!user) return c.json({ error: "User tidak ditemukan." }, 401);
		if (user.password !== password) return c.json({ error: "Password salah." }, 401);
		const secret = c.env.JWT_SECRET || "labmu_rahasia";
		const token = await sign({
			id: user.id,
			username: user.username,
			role: user.role,
			exp: Math.floor(Date.now() / 1e3) + 604800
		}, secret);
		return c.json({
			success: true,
			token
		});
	} catch (e) {
		return c.json({ error: "DB Error: " + e.message }, 500);
	}
});
//#endregion
//#region src/cms/addons/quran-mu/quran.service.ts
var QuranService = class {
	kv;
	db;
	constructor(kv, db) {
		this.kv = kv;
		this.db = db;
	}
	async getDetailSurat(nomor) {
		const CACHE_KEY = `quran:detail:v_FULL_FEATURES_FIX:${nomor}`;
		const cached = await this.kv.get(CACHE_KEY, "json");
		if (cached) return cached;
		if (this.db) try {
			const surat = await this.db.prepare("SELECT * FROM surah WHERE nomor = ?").bind(nomor).first();
			const { results: ayat } = await this.db.prepare("SELECT * FROM ayah WHERE surah_id = ? ORDER BY CAST(nomor_ayat AS INTEGER) ASC").bind(nomor).all();
			if (surat && ayat && ayat.length > 0) {
				const data = {
					...surat,
					namaLatin: surat.nama_latin,
					jumlahAyat: surat.jumlah_ayat || ayat.length,
					audioFull: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${nomor}.mp3`,
					kalender: {
						hijri: (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID-u-ca-islamic-uma", {
							day: "numeric",
							month: "long",
							year: "numeric"
						}),
						masehi: (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
							day: "numeric",
							month: "long",
							year: "numeric"
						})
					},
					tafsir: { id: { kementag: `Tafsir untuk surat ${surat.nama_latin} tersedia di versi lengkap.` } },
					ayat: ayat.map((a) => {
						const noAyat = a.nomor_ayat;
						const audioAyat = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${nomor}${noAyat.toString().padStart(3, "0")}.mp3`;
						return {
							...a,
							nomorAyat: noAyat,
							teksArab: a.teks_arab,
							teksLatin: a.teks_latin,
							teksIndonesia: a.teks_indonesia,
							teksInggris: a.teks_inggris,
							audio: a.audio || audioAyat,
							audioOptions: {
								"01": audioAyat,
								"02": `https://cdn.islamic.network/quran/audio/128/ar.abdulsamad/${nomor}${noAyat.toString().padStart(3, "0")}.mp3`,
								"03": `https://cdn.islamic.network/quran/audio/128/ar.sudais/${nomor}${noAyat.toString().padStart(3, "0")}.mp3`
							},
							shareUrl: `https://labmu-cms-dev.matadigital.workers.dev/${surat.slug || nomor}#ayat-${noAyat}`,
							teksShare: `Q.S ${surat.nama_latin}:${noAyat} - ${a.teks_indonesia}`
						};
					})
				};
				await this.kv.put(CACHE_KEY, JSON.stringify(data), { expirationTtl: 86400 });
				return data;
			}
		} catch (e) {
			console.error("Restorasi Fitur Error", e);
		}
		return null;
	}
};
//#endregion
//#region src/cms/themes/labmu-quran/list-surat.ts
var ListSurat = [
	{
		nomor: 1,
		nama: "الفاتحة",
		namaLatin: "Al-Fatihah",
		slug: "al-fatihah",
		jumlahAyat: 7,
		tempatTurun: "Mekah",
		arti: "Pembukaan"
	},
	{
		nomor: 2,
		nama: "البقرة",
		namaLatin: "Al-Baqarah",
		slug: "al-baqarah",
		jumlahAyat: 286,
		tempatTurun: "Madinah",
		arti: "Sapi Betina"
	},
	{
		nomor: 3,
		nama: "آل عمران",
		namaLatin: "Ali 'Imran",
		slug: "ali-imran",
		jumlahAyat: 200,
		tempatTurun: "Madinah",
		arti: "Keluarga Imran"
	},
	{
		nomor: 4,
		nama: "النساء",
		namaLatin: "An-Nisa'",
		slug: "an-nisa",
		jumlahAyat: 176,
		tempatTurun: "Madinah",
		arti: "Wanita"
	},
	{
		nomor: 5,
		nama: "المائدة",
		namaLatin: "Al-Ma'idah",
		slug: "al-maidah",
		jumlahAyat: 120,
		tempatTurun: "Madinah",
		arti: "Hidangan"
	},
	{
		nomor: 6,
		nama: "الأنعام",
		namaLatin: "Al-An'am",
		slug: "al-anam",
		jumlahAyat: 165,
		tempatTurun: "Mekah",
		arti: "Binatang Ternak"
	},
	{
		nomor: 7,
		nama: "الأعراف",
		namaLatin: "Al-A'raf",
		slug: "al-araf",
		jumlahAyat: 206,
		tempatTurun: "Mekah",
		arti: "Tempat Tertinggi"
	},
	{
		nomor: 8,
		nama: "الأنفال",
		namaLatin: "Al-Anfal",
		slug: "al-anfal",
		jumlahAyat: 75,
		tempatTurun: "Madinah",
		arti: "Rampasan Perang"
	},
	{
		nomor: 9,
		nama: "التوبة",
		namaLatin: "At-Taubah",
		slug: "at-taubah",
		jumlahAyat: 129,
		tempatTurun: "Madinah",
		arti: "Pengampunan"
	},
	{
		nomor: 10,
		nama: "يونس",
		namaLatin: "Yunus",
		slug: "yunus",
		jumlahAyat: 109,
		tempatTurun: "Mekah",
		arti: "Yunus"
	},
	{
		nomor: 11,
		nama: "هود",
		namaLatin: "Hud",
		slug: "hud",
		jumlahAyat: 123,
		tempatTurun: "Mekah",
		arti: "Hud"
	},
	{
		nomor: 12,
		nama: "يوسف",
		namaLatin: "Yusuf",
		slug: "yusuf",
		jumlahAyat: 111,
		tempatTurun: "Mekah",
		arti: "Yusuf"
	},
	{
		nomor: 13,
		nama: "الرعد",
		namaLatin: "Ar-Ra'd",
		slug: "ar-rad",
		jumlahAyat: 43,
		tempatTurun: "Mekah",
		arti: "Guruh"
	},
	{
		nomor: 14,
		nama: "ابراهيم",
		namaLatin: "Ibrahim",
		slug: "ibrahim",
		jumlahAyat: 52,
		tempatTurun: "Mekah",
		arti: "Ibrahim"
	},
	{
		nomor: 15,
		nama: "الحجر",
		namaLatin: "Al-Hijr",
		slug: "al-hijr",
		jumlahAyat: 99,
		tempatTurun: "Mekah",
		arti: "Hijr"
	},
	{
		nomor: 16,
		nama: "النحل",
		namaLatin: "An-Nahl",
		slug: "an-nahl",
		jumlahAyat: 128,
		tempatTurun: "Mekah",
		arti: "Lebah"
	},
	{
		nomor: 17,
		nama: "الإسراء",
		namaLatin: "Al-Isra'",
		slug: "al-isra",
		jumlahAyat: 111,
		tempatTurun: "Mekah",
		arti: "Perjalanan Malam"
	},
	{
		nomor: 18,
		nama: "الكهف",
		namaLatin: "Al-Kahf",
		slug: "al-kahf",
		jumlahAyat: 110,
		tempatTurun: "Mekah",
		arti: "Gua"
	},
	{
		nomor: 19,
		nama: "مريم",
		namaLatin: "Maryam",
		slug: "maryam",
		jumlahAyat: 98,
		tempatTurun: "Mekah",
		arti: "Maryam"
	},
	{
		nomor: 20,
		nama: "طه",
		namaLatin: "Taha",
		slug: "taha",
		jumlahAyat: 135,
		tempatTurun: "Mekah",
		arti: "Taha"
	},
	{
		nomor: 21,
		nama: "الأنبياء",
		namaLatin: "Al-Anbiya'",
		slug: "al-anbiya",
		jumlahAyat: 112,
		tempatTurun: "Mekah",
		arti: "Para Nabi"
	},
	{
		nomor: 22,
		nama: "الحج",
		namaLatin: "Al-Hajj",
		slug: "al-hajj",
		jumlahAyat: 78,
		tempatTurun: "Madinah",
		arti: "Haji"
	},
	{
		nomor: 23,
		nama: "المؤمنون",
		namaLatin: "Al-Mu'minun",
		slug: "al-muminun",
		jumlahAyat: 118,
		tempatTurun: "Mekah",
		arti: "Orang-orang Mukmin"
	},
	{
		nomor: 24,
		nama: "النور",
		namaLatin: "An-Nur",
		slug: "an-nur",
		jumlahAyat: 64,
		tempatTurun: "Madinah",
		arti: "Cahaya"
	},
	{
		nomor: 25,
		nama: "الفرقان",
		namaLatin: "Al-Furqan",
		slug: "al-furqan",
		jumlahAyat: 77,
		tempatTurun: "Mekah",
		arti: "Pembeda"
	},
	{
		nomor: 26,
		nama: "الشعراء",
		namaLatin: "Asy-Syu'ara'",
		slug: "asy-syuara",
		jumlahAyat: 227,
		tempatTurun: "Mekah",
		arti: "Para Penyair"
	},
	{
		nomor: 27,
		nama: "النمل",
		namaLatin: "An-Naml",
		slug: "an-naml",
		jumlahAyat: 93,
		tempatTurun: "Mekah",
		arti: "Semut"
	},
	{
		nomor: 28,
		nama: "القصص",
		namaLatin: "Al-Qasas",
		slug: "al-qasas",
		jumlahAyat: 88,
		tempatTurun: "Mekah",
		arti: "Kisah-kisah"
	},
	{
		nomor: 29,
		nama: "العنكبوت",
		namaLatin: "Al-Ankabut",
		slug: "al-ankabut",
		jumlahAyat: 69,
		tempatTurun: "Mekah",
		arti: "Laba-laba"
	},
	{
		nomor: 30,
		nama: "الروم",
		namaLatin: "Ar-Rum",
		slug: "ar-rum",
		jumlahAyat: 60,
		tempatTurun: "Mekah",
		arti: "Bangsa Romawi"
	},
	{
		nomor: 31,
		nama: "لقمان",
		namaLatin: "Luqman",
		slug: "luqman",
		jumlahAyat: 34,
		tempatTurun: "Mekah",
		arti: "Luqman"
	},
	{
		nomor: 32,
		nama: "السجدة",
		namaLatin: "As-Sajdah",
		slug: "as-sajdah",
		jumlahAyat: 30,
		tempatTurun: "Mekah",
		arti: "Sajdah"
	},
	{
		nomor: 33,
		nama: "الأحزاب",
		namaLatin: "Al-Ahzab",
		slug: "al-ahzab",
		jumlahAyat: 73,
		tempatTurun: "Madinah",
		arti: "Golongan yang Bersekutu"
	},
	{
		nomor: 34,
		nama: "سبأ",
		namaLatin: "Saba'",
		slug: "saba",
		jumlahAyat: 54,
		tempatTurun: "Mekah",
		arti: "Kaum Saba'"
	},
	{
		nomor: 35,
		nama: "فاطر",
		namaLatin: "Fatir",
		slug: "fatir",
		jumlahAyat: 45,
		tempatTurun: "Mekah",
		arti: "Pencipta"
	},
	{
		nomor: 36,
		nama: "يس",
		namaLatin: "Ya Sin",
		slug: "yasin",
		jumlahAyat: 83,
		tempatTurun: "Mekah",
		arti: "Ya Sin"
	},
	{
		nomor: 37,
		nama: "الصافات",
		namaLatin: "As-Saffat",
		slug: "as-saffat",
		jumlahAyat: 182,
		tempatTurun: "Mekah",
		arti: "Barisan-barisan"
	},
	{
		nomor: 38,
		nama: "ص",
		namaLatin: "Sad",
		slug: "sad",
		jumlahAyat: 88,
		tempatTurun: "Mekah",
		arti: "Sad"
	},
	{
		nomor: 39,
		nama: "الزمر",
		namaLatin: "Az-Zumar",
		slug: "az-zumar",
		jumlahAyat: 75,
		tempatTurun: "Mekah",
		arti: "Rombongan-rombongan"
	},
	{
		nomor: 40,
		nama: "غافر",
		namaLatin: "Ghafir",
		slug: "ghafir",
		jumlahAyat: 85,
		tempatTurun: "Mekah",
		arti: "Yang Mengampuni"
	},
	{
		nomor: 41,
		nama: "فصلت",
		namaLatin: "Fussilat",
		slug: "fussilat",
		jumlahAyat: 54,
		tempatTurun: "Mekah",
		arti: "Yang Dijelaskan"
	},
	{
		nomor: 42,
		nama: "الشورى",
		namaLatin: "Asy-Syura",
		slug: "asy-syura",
		jumlahAyat: 53,
		tempatTurun: "Mekah",
		arti: "Musyawarah"
	},
	{
		nomor: 43,
		nama: "الزخرف",
		namaLatin: "Az-Zukhruf",
		slug: "az-zukhruf",
		jumlahAyat: 89,
		tempatTurun: "Mekah",
		arti: "Perhiasan"
	},
	{
		nomor: 44,
		nama: "الدخان",
		namaLatin: "Ad-Dukhan",
		slug: "ad-dukhan",
		jumlahAyat: 59,
		tempatTurun: "Mekah",
		arti: "Kabut"
	},
	{
		nomor: 45,
		nama: "الجاثية",
		namaLatin: "Al-Jasiyah",
		slug: "al-jasiyah",
		jumlahAyat: 37,
		tempatTurun: "Mekah",
		arti: "Yang Berlutut"
	},
	{
		nomor: 46,
		nama: "الأحقاف",
		namaLatin: "Al-Ahqaf",
		slug: "al-ahqaf",
		jumlahAyat: 35,
		tempatTurun: "Mekah",
		arti: "Bukit-bukit Pasir"
	},
	{
		nomor: 47,
		nama: "محمد",
		namaLatin: "Muhammad",
		slug: "muhammad",
		jumlahAyat: 38,
		tempatTurun: "Madinah",
		arti: "Muhammad"
	},
	{
		nomor: 48,
		nama: "الفتح",
		namaLatin: "Al-Fath",
		slug: "al-fath",
		jumlahAyat: 29,
		tempatTurun: "Madinah",
		arti: "Kemenangan"
	},
	{
		nomor: 49,
		nama: "الحجرات",
		namaLatin: "Al-Hujurat",
		slug: "al-hujurat",
		jumlahAyat: 18,
		tempatTurun: "Madinah",
		arti: "Kamar-kamar"
	},
	{
		nomor: 50,
		nama: "ق",
		namaLatin: "Qaf",
		slug: "qaf",
		jumlahAyat: 45,
		tempatTurun: "Mekah",
		arti: "Qaf"
	},
	{
		nomor: 51,
		nama: "الذاريات",
		namaLatin: "Az-Zariyat",
		slug: "az-zariyat",
		jumlahAyat: 60,
		tempatTurun: "Mekah",
		arti: "Angin yang Menerbangkan"
	},
	{
		nomor: 52,
		nama: "الطور",
		namaLatin: "At-Tur",
		slug: "at-tur",
		jumlahAyat: 49,
		tempatTurun: "Mekah",
		arti: "Bukit"
	},
	{
		nomor: 53,
		nama: "النجم",
		namaLatin: "An-Najm",
		slug: "an-najm",
		jumlahAyat: 62,
		tempatTurun: "Mekah",
		arti: "Bintang"
	},
	{
		nomor: 54,
		nama: "القمر",
		namaLatin: "Al-Qamar",
		slug: "al-qamar",
		jumlahAyat: 55,
		tempatTurun: "Mekah",
		arti: "Bulan"
	},
	{
		nomor: 55,
		nama: "الرحمن",
		namaLatin: "Ar-Rahman",
		slug: "ar-rahman",
		jumlahAyat: 78,
		tempatTurun: "Madinah",
		arti: "Yang Maha Pemurah"
	},
	{
		nomor: 56,
		nama: "الواقعة",
		namaLatin: "Al-Waqi'ah",
		slug: "al-waqiah",
		jumlahAyat: 96,
		tempatTurun: "Mekah",
		arti: "Hari Kiamat"
	},
	{
		nomor: 57,
		nama: "الحديد",
		namaLatin: "Al-Hadid",
		slug: "al-hadid",
		jumlahAyat: 29,
		tempatTurun: "Madinah",
		arti: "Besi"
	},
	{
		nomor: 58,
		nama: "المجادلة",
		namaLatin: "Al-Mujadilah",
		slug: "al-mujadilah",
		jumlahAyat: 22,
		tempatTurun: "Madinah",
		arti: "Wanita yang Menggugat"
	},
	{
		nomor: 59,
		nama: "الحشر",
		namaLatin: "Al-Hasyr",
		slug: "al-hasyr",
		jumlahAyat: 24,
		tempatTurun: "Madinah",
		arti: "Pengusiran"
	},
	{
		nomor: 60,
		nama: "الممتحنة",
		namaLatin: "Al-Mumtahanah",
		slug: "al-mumtahanah",
		jumlahAyat: 13,
		tempatTurun: "Madinah",
		arti: "Wanita yang Diuji"
	},
	{
		nomor: 61,
		nama: "الصف",
		namaLatin: "As-Saff",
		slug: "as-saff",
		jumlahAyat: 14,
		tempatTurun: "Madinah",
		arti: "Barisan"
	},
	{
		nomor: 62,
		nama: "الجمعة",
		namaLatin: "Al-Jumu'ah",
		slug: "al-jumuah",
		jumlahAyat: 11,
		tempatTurun: "Madinah",
		arti: "Jumat"
	},
	{
		nomor: 63,
		nama: "المنافقون",
		namaLatin: "Al-Munafiqun",
		slug: "al-munafiqun",
		jumlahAyat: 11,
		tempatTurun: "Madinah",
		arti: "Orang-orang Munafik"
	},
	{
		nomor: 64,
		nama: "التغابن",
		namaLatin: "At-Tagabun",
		slug: "at-tagabun",
		jumlahAyat: 18,
		tempatTurun: "Madinah",
		arti: "Hari Dinampakkan Kesalahan"
	},
	{
		nomor: 65,
		nama: "الطلاق",
		namaLatin: "At-Talaq",
		slug: "at-talaq",
		jumlahAyat: 12,
		tempatTurun: "Madinah",
		arti: "Talak"
	},
	{
		nomor: 66,
		nama: "التحريم",
		namaLatin: "At-Tahrim",
		slug: "at-tahrim",
		jumlahAyat: 12,
		tempatTurun: "Madinah",
		arti: "Mengharamkan"
	},
	{
		nomor: 67,
		nama: "الملك",
		namaLatin: "Al-Mulk",
		slug: "al-mulk",
		jumlahAyat: 30,
		tempatTurun: "Mekah",
		arti: "Kerajaan"
	},
	{
		nomor: 68,
		nama: "القلم",
		namaLatin: "Al-Qalam",
		slug: "al-qalam",
		jumlahAyat: 52,
		tempatTurun: "Mekah",
		arti: "Pena"
	},
	{
		nomor: 69,
		nama: "الحاقة",
		namaLatin: "Al-Haqqah",
		slug: "al-haqqah",
		jumlahAyat: 52,
		tempatTurun: "Mekah",
		arti: "Hari Kiamat"
	},
	{
		nomor: 70,
		nama: "المعارج",
		namaLatin: "Al-Ma'arij",
		slug: "al-maarij",
		jumlahAyat: 44,
		tempatTurun: "Mekah",
		arti: "Tempat Naik"
	},
	{
		nomor: 71,
		nama: "نوح",
		namaLatin: "Nuh",
		slug: "nuh",
		jumlahAyat: 28,
		tempatTurun: "Mekah",
		arti: "Nuh"
	},
	{
		nomor: 72,
		nama: "الجن",
		namaLatin: "Al-Jinn",
		slug: "al-jinn",
		jumlahAyat: 28,
		tempatTurun: "Mekah",
		arti: "Jin"
	},
	{
		nomor: 73,
		nama: "المزمل",
		namaLatin: "Al-Muzzammil",
		slug: "al-muzzammil",
		jumlahAyat: 20,
		tempatTurun: "Mekah",
		arti: "Orang yang Berselimut"
	},
	{
		nomor: 74,
		nama: "المدثر",
		namaLatin: "Al-Muddassir",
		slug: "al-muddassir",
		jumlahAyat: 56,
		tempatTurun: "Mekah",
		arti: "Orang yang Berkemul"
	},
	{
		nomor: 75,
		nama: "القيامة",
		namaLatin: "Al-Qiyamah",
		slug: "al-qiyamah",
		jumlahAyat: 40,
		tempatTurun: "Mekah",
		arti: "Kiamat"
	},
	{
		nomor: 76,
		nama: "الانسان",
		namaLatin: "Al-Insan",
		slug: "al-insan",
		jumlahAyat: 31,
		tempatTurun: "Madinah",
		arti: "Manusia"
	},
	{
		nomor: 77,
		nama: "المرسلات",
		namaLatin: "Al-Mursalat",
		slug: "al-mursalat",
		jumlahAyat: 50,
		tempatTurun: "Mekah",
		arti: "Malaikat yang Diutus"
	},
	{
		nomor: 78,
		nama: "النبأ",
		namaLatin: "An-Naba'",
		slug: "an-naba",
		jumlahAyat: 40,
		tempatTurun: "Mekah",
		arti: "Berita Besar"
	},
	{
		nomor: 79,
		nama: "النازعات",
		namaLatin: "An-Nazi'at",
		slug: "an-naziat",
		jumlahAyat: 46,
		tempatTurun: "Mekah",
		arti: "Malaikat yang Mencabut"
	},
	{
		nomor: 80,
		nama: "عبس",
		namaLatin: "'Abasa",
		slug: "abasa",
		jumlahAyat: 42,
		tempatTurun: "Mekah",
		arti: "Ia Bermuka Masam"
	},
	{
		nomor: 81,
		nama: "التكوير",
		namaLatin: "At-Takwir",
		slug: "at-takwir",
		jumlahAyat: 29,
		tempatTurun: "Mekah",
		arti: "Menggulung"
	},
	{
		nomor: 82,
		nama: "الإنفطار",
		namaLatin: "Al-Infitar",
		slug: "al-infitar",
		jumlahAyat: 19,
		tempatTurun: "Mekah",
		arti: "Terbelah"
	},
	{
		nomor: 83,
		nama: "المطففين",
		namaLatin: "Al-Mutaffifin",
		slug: "al-mutaffifin",
		jumlahAyat: 36,
		tempatTurun: "Mekah",
		arti: "Orang-orang yang Curang"
	},
	{
		nomor: 84,
		nama: "الإنشقاق",
		namaLatin: "Al-Insyaqaq",
		slug: "al-insyaqaq",
		jumlahAyat: 25,
		tempatTurun: "Mekah",
		arti: "Terbelah"
	},
	{
		nomor: 85,
		nama: "البروج",
		namaLatin: "Al-Buruj",
		slug: "al-buruj",
		jumlahAyat: 22,
		tempatTurun: "Mekah",
		arti: "Gugusan Bintang"
	},
	{
		nomor: 86,
		nama: "الطارق",
		namaLatin: "At-Tariq",
		slug: "at-tariq",
		jumlahAyat: 17,
		tempatTurun: "Mekah",
		arti: "Yang Datang di Malam Hari"
	},
	{
		nomor: 87,
		nama: "الأعلى",
		namaLatin: "Al-A'la",
		slug: "al-ala",
		jumlahAyat: 19,
		tempatTurun: "Mekah",
		arti: "Yang Paling Tinggi"
	},
	{
		nomor: 88,
		nama: "الغاشية",
		namaLatin: "Al-Ghasyiyah",
		slug: "al-ghasyiyah",
		jumlahAyat: 26,
		tempatTurun: "Mekah",
		arti: "Hari Pembalasan"
	},
	{
		nomor: 89,
		nama: "الفجر",
		namaLatin: "Al-Fajr",
		slug: "al-fajr",
		jumlahAyat: 30,
		tempatTurun: "Mekah",
		arti: "Fajar"
	},
	{
		nomor: 90,
		nama: "البلد",
		namaLatin: "Al-Balad",
		slug: "al-balad",
		jumlahAyat: 20,
		tempatTurun: "Mekah",
		arti: "Negeri"
	},
	{
		nomor: 91,
		nama: "الشمس",
		namaLatin: "Asy-Syams",
		slug: "asy-syams",
		jumlahAyat: 15,
		tempatTurun: "Mekah",
		arti: "Matahari"
	},
	{
		nomor: 92,
		nama: "الليل",
		namaLatin: "Al-Lail",
		slug: "al-lail",
		jumlahAyat: 21,
		tempatTurun: "Mekah",
		arti: "Malam"
	},
	{
		nomor: 93,
		nama: "الضحى",
		namaLatin: "Ad-Duha",
		slug: "ad-duha",
		jumlahAyat: 11,
		tempatTurun: "Mekah",
		arti: "Waktu Matahari Sepenggalahan Naik"
	},
	{
		nomor: 94,
		nama: "الشرح",
		namaLatin: "Asy-Syarh",
		slug: "asy-syarh",
		jumlahAyat: 8,
		tempatTurun: "Mekah",
		arti: "Melapangkan"
	},
	{
		nomor: 95,
		nama: "التين",
		namaLatin: "At-Tin",
		slug: "at-tin",
		jumlahAyat: 8,
		tempatTurun: "Mekah",
		arti: "Buah Tin"
	},
	{
		nomor: 96,
		nama: "العلق",
		namaLatin: "Al-'Alaq",
		slug: "al-alaq",
		jumlahAyat: 19,
		tempatTurun: "Mekah",
		arti: "Segumpal Darah"
	},
	{
		nomor: 97,
		nama: "القدر",
		namaLatin: "Al-Qadr",
		slug: "al-qadr",
		jumlahAyat: 5,
		tempatTurun: "Mekah",
		arti: "Kemuliaan"
	},
	{
		nomor: 98,
		nama: "البينة",
		namaLatin: "Al-Bayyinah",
		slug: "al-bayyinah",
		jumlahAyat: 8,
		tempatTurun: "Madinah",
		arti: "Pembuktian"
	},
	{
		nomor: 99,
		nama: "الزلزلة",
		namaLatin: "Az-Zalzalah",
		slug: "az-zalzalah",
		jumlahAyat: 8,
		tempatTurun: "Madinah",
		arti: "Kegoncangan"
	},
	{
		nomor: 100,
		nama: "العاديات",
		namaLatin: "Al-'Adiyat",
		slug: "al-adiyat",
		jumlahAyat: 11,
		tempatTurun: "Mekah",
		arti: "Kuda Perang"
	},
	{
		nomor: 101,
		nama: "القارعة",
		namaLatin: "Al-Qari'ah",
		slug: "al-qariah",
		jumlahAyat: 11,
		tempatTurun: "Mekah",
		arti: "Hari Kiamat"
	},
	{
		nomor: 102,
		nama: "التكاثر",
		namaLatin: "At-Takasur",
		slug: "at-takasur",
		jumlahAyat: 8,
		tempatTurun: "Mekah",
		arti: "Bermegah-megahan"
	},
	{
		nomor: 103,
		nama: "العصر",
		namaLatin: "Al-'Asr",
		slug: "al-asr",
		jumlahAyat: 3,
		tempatTurun: "Mekah",
		arti: "Masa"
	},
	{
		nomor: 104,
		nama: "الهمزة",
		namaLatin: "Al-Humazah",
		slug: "al-humazah",
		jumlahAyat: 9,
		tempatTurun: "Mekah",
		arti: "Pengumpat"
	},
	{
		nomor: 105,
		nama: "الفيل",
		namaLatin: "Al-Fil",
		slug: "al-fil",
		jumlahAyat: 5,
		tempatTurun: "Mekah",
		arti: "Gajah"
	},
	{
		nomor: 106,
		nama: "قريش",
		namaLatin: "Quraisy",
		slug: "quraisy",
		jumlahAyat: 4,
		tempatTurun: "Mekah",
		arti: "Suku Quraisy"
	},
	{
		nomor: 107,
		nama: "الماعون",
		namaLatin: "Al-Ma'un",
		slug: "al-maun",
		jumlahAyat: 7,
		tempatTurun: "Mekah",
		arti: "Barang-barang yang Berguna"
	},
	{
		nomor: 108,
		nama: "الكوثر",
		namaLatin: "Al-Kautsar",
		slug: "al-kautsar",
		jumlahAyat: 3,
		tempatTurun: "Mekah",
		arti: "Nikmat yang Berlimpah"
	},
	{
		nomor: 109,
		nama: "الكافرون",
		namaLatin: "Al-Kafirun",
		slug: "al-kafirun",
		jumlahAyat: 6,
		tempatTurun: "Mekah",
		arti: "Orang-orang Kafir"
	},
	{
		nomor: 110,
		nama: "النصر",
		namaLatin: "An-Nasr",
		slug: "an-nasr",
		jumlahAyat: 3,
		tempatTurun: "Madinah",
		arti: "Pertolongan"
	},
	{
		nomor: 111,
		nama: "اللهب",
		namaLatin: "Al-Lahab",
		slug: "al-lahab",
		jumlahAyat: 5,
		tempatTurun: "Mekah",
		arti: "Gejolak Api"
	},
	{
		nomor: 112,
		nama: "الإخلاص",
		namaLatin: "Al-Ikhlas",
		slug: "al-ikhlas",
		jumlahAyat: 4,
		tempatTurun: "Mekah",
		arti: "Ikhlas"
	},
	{
		nomor: 113,
		nama: "الفلق",
		namaLatin: "Al-Falaq",
		slug: "al-falaq",
		jumlahAyat: 5,
		tempatTurun: "Mekah",
		arti: "Waktu Subuh"
	},
	{
		nomor: 114,
		nama: "الناس",
		namaLatin: "An-Nas",
		slug: "an-nas",
		jumlahAyat: 6,
		tempatTurun: "Mekah",
		arti: "Manusia"
	}
];
//#endregion
//#region src/cms/modules/public/public.router.ts
var publicRouter = new Hono();
async function getGlobalData(db) {
	let settings = {};
	let menus = [];
	try {
		const { results: settingRows } = await db.prepare("SELECT key, value FROM settings").all();
		if (settingRows) settingRows.forEach((row) => {
			settings[row.key] = row.value;
		});
		const { results: menuRows } = await db.prepare("SELECT * FROM menus ORDER BY order_num ASC").all();
		menus = menuRows || [];
	} catch (e) {
		console.error("Error global data", e);
	}
	return {
		settings,
		menus
	};
}
async function getRenderer(db) {
	try {
		const activeThemeRow = await db.prepare("SELECT id FROM themes WHERE active = 1").first();
		const themeId = activeThemeRow ? activeThemeRow.id : "labmu-default";
		return {
			Renderer: getActiveTheme(themeId) || getActiveTheme("labmu-default"),
			themeId
		};
	} catch (e) {
		return {
			Renderer: getActiveTheme("labmu-default"),
			themeId: "labmu-default"
		};
	}
}
publicRouter.get("/", async (c) => {
	try {
		const { settings, menus } = await getGlobalData(c.env.DB);
		const { Renderer, themeId } = await getRenderer(c.env.DB);
		if (themeId === "labmu-quran") {
			const context = {
				site: settings,
				menus,
				data: ListSurat
			};
			return c.html(Renderer.renderHome(context));
		} else {
			const { results: posts } = await c.env.DB.prepare("SELECT * FROM posts WHERE status = 'publish' ORDER BY created_at DESC LIMIT 10").all();
			const context = {
				site: settings,
				menus,
				data: posts || []
			};
			return c.html(Renderer.renderHome(context));
		}
	} catch (e) {
		return c.text("Error: " + e.message, 500);
	}
});
publicRouter.get("/search", async (c) => {
	const query = c.req.query("q");
	const page = parseInt(c.req.query("page") || "1");
	const limit = 10;
	const offset = (page - 1) * limit;
	if (!query) return c.redirect("/");
	const cleanQuery = query.toLowerCase().trim();
	try {
		const db = c.env.DB;
		const { settings, menus } = await getGlobalData(db);
		const { Renderer } = await getRenderer(db);
		const countSql = `
            SELECT count(*) as total FROM posts 
            WHERE status = 'publish' 
            AND (
                lower(title) LIKE ? 
                OR lower(body) LIKE ? 
                OR lower(tags) LIKE ?
            )
        `;
		const bindVal = `%${cleanQuery}%`;
		const totalItems = (await db.prepare(countSql).bind(bindVal, bindVal, bindVal).first()).total || 0;
		const totalPages = Math.ceil(totalItems / limit);
		const { results: posts } = await db.prepare(`
            SELECT * FROM posts 
            WHERE status = 'publish' 
            AND (
                lower(title) LIKE ? 
                OR lower(body) LIKE ? 
                OR lower(tags) LIKE ?
            )
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `).bind(bindVal, bindVal, bindVal, limit, offset).all();
		const context = {
			site: settings,
			menus,
			data: posts || [],
			query,
			pagination: {
				currentPage: page,
				totalPages,
				totalItems,
				hasNext: page < totalPages,
				hasPrev: page > 1
			}
		};
		if (Renderer && typeof Renderer.renderSearch === "function") return c.html(Renderer.renderSearch(context));
		context.categoryName = `Pencarian: "${query}"`;
		if (Renderer && typeof Renderer.renderCategory === "function") return c.html(Renderer.renderCategory(context));
		else return c.html(Renderer.renderHome(context));
	} catch (e) {
		return c.text("Search Error: " + e.message, 500);
	}
});
publicRouter.get("/:slug", async (c) => {
	const slug = c.req.param("slug").toLowerCase();
	if (slug.includes(".") || slug === "favicon.ico") return c.notFound();
	try {
		const { settings, menus } = await getGlobalData(c.env.DB);
		const { Renderer } = await getRenderer(c.env.DB);
		const db = c.env.DB;
		const slugSpace = slug.replace(/-/g, " ");
		const { results: catPosts } = await db.prepare(`SELECT * FROM posts WHERE (lower(category) = ? OR lower(category) = ?) AND status='publish' ORDER BY created_at DESC`).bind(slug, slugSpace).all();
		if (catPosts && catPosts.length > 0) {
			const context = {
				site: settings,
				menus,
				data: catPosts,
				categoryName: (catPosts[0].category || slugSpace).replace(/\b\w/g, (l) => l.toUpperCase())
			};
			if (Renderer && typeof Renderer.renderCategory === "function") return c.html(Renderer.renderCategory(context));
			return c.html(Renderer.renderHome(context));
		}
		let nomorSurat = null;
		if (/^\d+$/.test(slug)) {
			const num = parseInt(slug);
			if (num >= 1 && num <= 114) nomorSurat = num;
		} else {
			const suratFound = ListSurat.find((s) => s.slug === slug);
			if (suratFound) nomorSurat = suratFound.nomor;
		}
		if (nomorSurat) {
			const dataSurat = await new QuranService(c.env.QURAN_CACHE, c.env.DB).getDetailSurat(nomorSurat);
			if (dataSurat) return c.html(LabMuQuran.renderSingle({
				site: settings,
				menus,
				data: dataSurat
			}));
		}
		let content = await db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'publish'").bind(slug).first();
		let type = "post";
		if (!content) {
			content = await db.prepare("SELECT * FROM pages WHERE slug = ? AND status = 'publish'").bind(slug).first();
			type = "page";
		}
		if (content) {
			if (content.body) content.body = injectInternalLinks(content.body);
			content.type = type;
			const context = {
				site: settings,
				menus,
				data: content
			};
			if (type === "page" && Renderer.renderPage) return c.html(Renderer.renderPage(context));
			return c.html(Renderer.renderSingle(context));
		}
		return c.html(Renderer.render404({
			site: settings,
			menus,
			data: null
		}), 404);
	} catch (e) {
		return c.text("Error System: " + e.message, 500);
	}
});
//#endregion
//#region src/cms/middleware/auth.ts
var authMiddleware = async (c, next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader) return c.json({ error: "Butuh Login (Header Kosong)" }, 401);
	const token = authHeader.replace("Bearer ", "").trim();
	try {
		const decodedString = atob(token);
		const userData = JSON.parse(decodedString);
		if (!userData || typeof userData !== "object") throw new Error("Invalid Payload");
		c.set("user", userData);
		await next();
	} catch (e) {
		console.error("Auth Error:", e);
		return c.json({ error: "Token Tidak Valid / Kadaluwarsa" }, 401);
	}
};
//#endregion
//#region src/cms/modules/settings/settings.router.ts
var settings = new Hono();
settings.get("/", async (c) => {
	try {
		const { results } = await c.env.DB.prepare("SELECT key, value FROM settings").all();
		const data = {};
		if (results) results.forEach((row) => {
			data[row.key] = row.value;
		});
		return c.json({
			success: true,
			data
		});
	} catch (e) {
		console.error("GET Settings Error:", e);
		return c.json({ error: e.message }, 500);
	}
});
settings.post("/", authMiddleware, async (c) => {
	try {
		const body = await c.req.json();
		const stmt = c.env.DB.prepare(`
      INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)
    `);
		const batch = [];
		for (const key in body) {
			let val = body[key];
			if (typeof val !== "string") val = JSON.stringify(val);
			batch.push(stmt.bind(key, val));
		}
		if (batch.length > 0) await c.env.DB.batch(batch);
		return c.json({
			success: true,
			message: "Settings saved"
		});
	} catch (e) {
		console.error("SAVE Settings Error:", e);
		return c.json({ error: e.message }, 500);
	}
});
//#endregion
//#region src/cms/modules/media/media.router.ts
var mediaRouter = new Hono();
var getBucket$1 = (c) => {
	return c.env.MY_BUCKET || c.env.MEDIA_BUCKET || c.env.BUCKET || c.env.R2;
};
mediaRouter.get("/setup", async (c) => {
	try {
		if (!c.env.DB) {
			const keys = Object.keys(c.env).join(", ");
			throw new Error(`DB Error! Binding 'DB' hilang. Yang ada: [${keys}]`);
		}
		const r2 = getBucket$1(c);
		if (!r2) {
			const keys = Object.keys(c.env).join(", ");
			throw new Error(`R2 Error! Binding 'MY_BUCKET' tidak ditemukan. Yang ada: [${keys}]`);
		}
		await c.env.DB.prepare("DROP TABLE IF EXISTS media_meta").run();
		await c.env.DB.prepare(`
            CREATE TABLE media_meta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT NOT NULL,
                url TEXT NOT NULL,
                type TEXT,
                size INTEGER,
                alt TEXT,
                title TEXT,
                description TEXT,
                caption TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `).run();
		const listed = await r2.list();
		let count = 0;
		let skipped = 0;
		for (const obj of listed.objects) {
			if (obj.key.endsWith("/")) {
				skipped++;
				continue;
			}
			const url = `/api/media/file/${obj.key}`;
			let type = "application/octet-stream";
			if (obj.key.match(/\.(jpg|jpeg)$/i)) type = "image/jpeg";
			else if (obj.key.match(/\.png$/i)) type = "image/png";
			else if (obj.key.match(/\.webp$/i)) type = "image/webp";
			else if (obj.key.match(/\.svg$/i)) type = "image/svg+xml";
			await c.env.DB.prepare(`
                INSERT INTO media_meta (key, url, type, size, created_at) 
                VALUES (?, ?, ?, ?, datetime('now'))
            `).bind(obj.key, url, type, obj.size).run();
			count++;
		}
		return c.json({
			success: true,
			message: `BERHASIL! ${count} file dipulihkan. (${skipped} folder dibuang)`
		});
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
mediaRouter.get("/", async (c) => {
	try {
		const { results } = await c.env.DB.prepare("SELECT * FROM media_meta ORDER BY created_at DESC").all();
		return c.json(results || []);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
mediaRouter.post("/", async (c) => {
	try {
		const file = (await c.req.parseBody())["file"];
		if (!file || !(file instanceof File)) return c.json({ error: "File wajib ada" }, 400);
		const r2 = getBucket$1(c);
		if (!r2) return c.json({ error: "R2 Putus (Cek MY_BUCKET)" }, 500);
		const date = /* @__PURE__ */ new Date();
		const folder = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
		const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "");
		const key = `${folder}/${Date.now()}-${cleanName}`;
		await r2.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
		const url = `/api/media/file/${key}`;
		await c.env.DB.prepare("INSERT INTO media_meta (key, url, type, size, created_at) VALUES (?, ?, ?, ?, datetime(\"now\"))").bind(key, url, file.type, file.size).run();
		return c.json({
			success: true,
			url
		});
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
mediaRouter.put("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const body = await c.req.json();
		await c.env.DB.prepare(`
            UPDATE media_meta 
            SET alt = ?, title = ?, description = ?, caption = ?
            WHERE id = ?
        `).bind(body.alt || "", body.title || "", body.description || "", body.caption || "", id).run();
		return c.json({ success: true });
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
mediaRouter.get("/file/*", async (c) => {
	const key = c.req.path.replace("/api/media/file/", "");
	const r2 = getBucket$1(c);
	if (!r2) return c.text("R2 Putus", 500);
	const obj = await r2.get(decodeURIComponent(key));
	if (!obj) return c.text("Not found", 404);
	const headers = new Headers();
	obj.writeHttpMetadata(headers);
	headers.set("etag", obj.httpEtag);
	headers.set("Cache-Control", "public, max-age=31536000");
	const currentType = headers.get("Content-Type");
	if (!currentType || currentType === "application/octet-stream") {
		if (key.match(/\.(jpg|jpeg)$/i)) headers.set("Content-Type", "image/jpeg");
		else if (key.match(/\.png$/i)) headers.set("Content-Type", "image/png");
		else if (key.match(/\.webp$/i)) headers.set("Content-Type", "image/webp");
	}
	return new Response(obj.body, { headers });
});
mediaRouter.delete("/:id", async (c) => {
	const id = c.req.param("id");
	const r2 = getBucket$1(c);
	const file = await c.env.DB.prepare("SELECT key FROM media_meta WHERE id=?").bind(id).first();
	if (file && r2) {
		await r2.delete(file.key);
		await c.env.DB.prepare("DELETE FROM media_meta WHERE id=?").bind(id).run();
	}
	return c.json({ success: true });
});
//#endregion
//#region src/cms/modules/users/users.router.ts
var usersRouter = new Hono();
async function sha256(message) {
	const msgBuffer = new TextEncoder().encode(message);
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
usersRouter.get("/", async (c) => {
	try {
		if (!c.env.DB) return c.json({ error: "Database Error" }, 500);
		const { results } = await c.env.DB.prepare("SELECT id, username, name, email, role, created_at FROM users ORDER BY created_at DESC").all();
		return c.json(results);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
usersRouter.post("/", async (c) => {
	try {
		const { username, password, email, role, name } = await c.req.json();
		if (!username || !password) return c.json({ error: "Username & Password wajib" }, 400);
		const finalPass = password;
		if ((await c.env.DB.prepare("INSERT INTO users (username, password, email, role, name, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(username, finalPass, email || "", role || "editor", name || "", (/* @__PURE__ */ new Date()).toISOString()).run()).success) return c.json({
			success: true,
			message: "User berhasil dibuat"
		});
		else return c.json({ error: "Gagal membuat user" }, 500);
	} catch (e) {
		return c.json({ error: "Error: " + e.message }, 500);
	}
});
usersRouter.put("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		const { username, email, role, name, password } = await c.req.json();
		let query = "UPDATE users SET username=?, email=?, role=?, name=?";
		let params = [
			username,
			email,
			role,
			name
		];
		if (password && password.trim() !== "") {
			query += ", password=?";
			params.push(password);
		}
		query += " WHERE id=?";
		params.push(id);
		if ((await c.env.DB.prepare(query).bind(...params).run()).success) return c.json({ success: true });
		else return c.json({ error: "Gagal update user" }, 500);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
usersRouter.delete("/:id", async (c) => {
	try {
		const id = c.req.param("id");
		if ((await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run()).success) return c.json({ success: true });
		else return c.json({ error: "Gagal menghapus user" }, 500);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
usersRouter.post("/login", async (c) => {
	try {
		const body = await c.req.json().catch(() => null);
		if (!body) return c.json({ error: "Data login tidak lengkap" }, 400);
		const { username, password } = body;
		if (!c.env.DB) return c.json({ error: "Database tidak terhubung" }, 500);
		const user = await c.env.DB.prepare("SELECT id, username, password, role FROM users WHERE username = ?").bind(username).first();
		if (!user) return c.json({ error: "Username tidak terdaftar" }, 401);
		const inputPassword = String(password);
		const dbPassword = String(user.password);
		const isPlainMatch = inputPassword === dbPassword;
		const isHashMatch = await sha256(inputPassword) === dbPassword;
		if (!isPlainMatch && !isHashMatch) return c.json({ error: "Password salah" }, 401);
		const token = btoa(JSON.stringify({
			id: user.id,
			username: user.username,
			role: user.role || "admin",
			iat: Date.now()
		}));
		return c.json({
			success: true,
			token,
			user: {
				id: user.id,
				username: user.username
			}
		});
	} catch (e) {
		return c.json({ error: "Gagal Login: " + e.message }, 500);
	}
});
//#endregion
//#region src/cms/migration.ts
var migration = new Hono();
migration.get("/", async (c) => {
	try {
		const logs = [];
		for (const sql of [
			"ALTER TABLE contents ADD COLUMN featured_image_caption TEXT",
			"ALTER TABLE media_meta ADD COLUMN caption TEXT",
			"ALTER TABLE users ADD COLUMN name TEXT",
			"ALTER TABLE users ADD COLUMN created_at TEXT",
			"ALTER TABLE users ADD COLUMN role TEXT",
			"ALTER TABLE users ADD COLUMN email TEXT",
			`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT
      )`,
			`CREATE TABLE IF NOT EXISTS menus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          label TEXT,
          url TEXT,
          order_num INTEGER DEFAULT 0
      )`
		]) try {
			await c.env.DB.prepare(sql).run();
			logs.push(`✅ Sukses: ${sql}`);
		} catch (e) {
			logs.push(`ℹ️ Skip: ${sql}`);
		}
		try {
			const check = await c.env.DB.prepare("SELECT count(*) as count FROM settings").first();
			if (check && check.count === 0) {
				await c.env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").bind("site_title", "LabMu CMS").run();
				await c.env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").bind("site_desc", "Just another CMS site").run();
				logs.push("✅ Seed Default Settings");
			}
		} catch (e) {}
		return c.json({
			success: true,
			message: "Upgrade Database Selesai!",
			logs
		});
	} catch (e) {
		return c.json({
			success: false,
			error: e.message
		});
	}
});
//#endregion
//#region src/cms/modules/theme/theme.router.ts
var theme = new Hono();
theme.get("/", async (c) => {
	try {
		const { results: dbThemes } = await c.env.DB.prepare("SELECT id, active FROM themes").all();
		const data = availableThemes.map((t) => {
			const dbEntry = dbThemes?.find((d) => d.id === t.id);
			return {
				...t,
				active: dbEntry ? dbEntry.active === 1 : false,
				thumbnail: `https://placehold.co/600x400/2563eb/ffffff?text=${encodeURIComponent(t.name)}`
			};
		});
		return c.json({
			success: true,
			data
		});
	} catch (e) {
		return c.json({
			success: false,
			error: e.message
		}, 500);
	}
});
theme.post("/activate", async (c) => {
	try {
		const body = await c.req.json();
		const targetId = body.theme_id || body.themeId;
		if (!targetId) return c.json({
			success: false,
			message: "ID Tema kosong"
		}, 400);
		await c.env.DB.prepare("UPDATE themes SET active = 0").run();
		if (!await c.env.DB.prepare("SELECT id FROM themes WHERE id = ?").bind(targetId).first()) {
			const info = availableThemes.find((t) => t.id === targetId);
			if (info) await c.env.DB.prepare(`
            INSERT INTO themes (id, name, description, author, version, active) 
            VALUES (?, ?, ?, ?, ?, 1)
          `).bind(info.id, info.name, info.description || "", info.author || "", info.version || "").run();
			else return c.json({
				success: false,
				message: "Tema tidak ditemukan di registry"
			}, 404);
		} else await c.env.DB.prepare("UPDATE themes SET active = 1 WHERE id = ?").bind(targetId).run();
		return c.json({
			success: true,
			message: "Tema Berhasil Diaktifkan!"
		});
	} catch (e) {
		console.error(e);
		return c.json({
			success: false,
			error: e.message
		}, 500);
	}
});
//#endregion
//#region src/cms/modules/menus/menus.router.ts
var menusRouter = new Hono();
menusRouter.get("/", async (c) => {
	try {
		const { results } = await c.env.DB.prepare("SELECT * FROM menus ORDER BY order_num ASC").all();
		return c.json({
			success: true,
			data: results || []
		});
	} catch (e) {
		return c.json({
			success: true,
			data: []
		});
	}
});
menusRouter.post("/", async (c) => {
	try {
		const body = await c.req.json();
		const id = crypto.randomUUID();
		await c.env.DB.prepare("INSERT INTO menus (id, label, url, order_num) VALUES (?, ?, ?, ?)").bind(id, body.label, body.url, body.order_num || 0).run();
		return c.json({
			success: true,
			message: "Menu saved"
		});
	} catch (e) {
		return c.json({
			success: false,
			error: e.message
		}, 500);
	}
});
menusRouter.delete("/:id", async (c) => {
	const id = c.req.param("id");
	try {
		await c.env.DB.prepare("DELETE FROM menus WHERE id = ?").bind(id).run();
		return c.json({ success: true });
	} catch (e) {
		return c.json({
			success: false,
			error: e.message
		}, 500);
	}
});
//#endregion
//#region src/cms/db/init.ts
var updateSchema = async (db) => {
	const logs = [];
	try {
		await db.prepare(`
      CREATE TABLE IF NOT EXISTS options (
        key TEXT PRIMARY KEY, 
        value TEXT,
        autoload INTEGER DEFAULT 0
      );
    `).run();
		logs.push("✅ Table 'options' checked (Safe).");
		await db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'author',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `).run();
		logs.push("✅ Table 'users' checked (Safe).");
		await db.prepare(`
      CREATE TABLE IF NOT EXISTS contents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        slug TEXT UNIQUE,
        body TEXT,
        type TEXT DEFAULT 'post',
        status TEXT DEFAULT 'draft',
        author_id INTEGER,
        category TEXT,
        tags TEXT,
        featured_image TEXT,
        wp_id INTEGER, 
        old_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `).run();
		logs.push("✅ Table 'contents' checked (Safe).");
		await db.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `).run();
		logs.push("✅ Table 'settings' checked (Safe).");
		await db.prepare(`
      CREATE TABLE IF NOT EXISTS menus (
        id TEXT PRIMARY KEY, 
        label TEXT,
        url TEXT,
        order_num INTEGER DEFAULT 0
      );
    `).run();
		logs.push("✅ Table 'menus' checked (Safe - ID TEXT).");
		await db.prepare(`
      CREATE TABLE IF NOT EXISTS themes (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        author TEXT,
        version TEXT,
        active INTEGER DEFAULT 0
      );
    `).run();
		logs.push("✅ Table 'themes' checked (Safe).");
		await db.prepare(`
      INSERT OR IGNORE INTO themes (id, name, description, active) 
      VALUES ('labmu-default', 'LabMu Default', 'Standard LabMu Theme', 1);
    `).run();
		return logs;
	} catch (e) {
		console.error("Schema Update Error:", e);
		logs.push("❌ ERROR: " + e.message);
		return logs;
	}
};
//#endregion
//#region src/cms/modules/posts/posts.router.ts
var postsRouter = new Hono();
postsRouter.get("/", async (c) => {
	try {
		const { results } = await c.env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
		return c.json(results || []);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
postsRouter.get("/:id", async (c) => {
	const id = c.req.param("id");
	try {
		const post = await c.env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
		if (!post) return c.json({ error: "Post not found" }, 404);
		return c.json(post);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
postsRouter.post("/", async (c) => {
	try {
		const body = await c.req.json();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		let status = (body.status || "draft").toLowerCase();
		if (status.includes("pub")) status = "publish";
		const { success } = await c.env.DB.prepare(`
            INSERT INTO posts (title, slug, body, status, category, tags, featured_image, author, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(body.title || "Untitled", body.slug, body.body || "", status, body.category || "Uncategorized", body.tags || "", body.featured_image || "", body.author || "Admin", body.created_at || now).run();
		if (success) return c.json({
			success: true,
			message: "Post Created"
		});
		else return c.json({ error: "Failed to create post" }, 400);
	} catch (e) {
		if (e.message.includes("UNIQUE constraint failed")) return c.json({ error: "Slug sudah digunakan, ganti judul atau slug." }, 409);
		return c.json({ error: e.message }, 500);
	}
});
postsRouter.put("/:id", async (c) => {
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		let status = (body.status || "draft").toLowerCase();
		if (status.includes("pub")) status = "publish";
		const { success } = await c.env.DB.prepare(`
            UPDATE posts SET 
                title = ?, 
                slug = ?, 
                body = ?, 
                status = ?, 
                category = ?, 
                tags = ?, 
                featured_image = ?,
                created_at = ?
            WHERE id = ?
        `).bind(body.title, body.slug, body.body, status, body.category || "Uncategorized", body.tags || "", body.featured_image, body.created_at, id).run();
		if (success) return c.json({
			success: true,
			message: "Post Updated"
		});
		else return c.json({ error: "Post not found or no changes" }, 404);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
postsRouter.delete("/:id", async (c) => {
	const id = c.req.param("id");
	if (id.includes(",")) {
		const stmts = id.split(",").map((i) => c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(i.trim()));
		await c.env.DB.batch(stmts);
		return c.json({
			success: true,
			message: "Bulk Deleted"
		});
	}
	try {
		const { success } = await c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
		if (success) return c.json({
			success: true,
			message: "Deleted"
		});
		else return c.json({
			success: true,
			message: "Deleted (or already gone)"
		});
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
//#endregion
//#region src/cms/modules/pages/pages.router.ts
var pagesRouter = new Hono();
pagesRouter.get("/", async (c) => {
	try {
		const { results } = await c.env.DB.prepare("SELECT id, title, slug, status, featured_image, created_at FROM pages ORDER BY created_at DESC").all();
		return c.json(results);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
pagesRouter.get("/:id", async (c) => {
	const id = c.req.param("id");
	try {
		const page = await c.env.DB.prepare("SELECT * FROM pages WHERE id = ?").bind(id).first();
		return page ? c.json(page) : c.json({ error: "Page not found" }, 404);
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
pagesRouter.post("/", async (c) => {
	try {
		const { title, slug, body: content, status, featured_image } = await c.req.json();
		await c.env.DB.prepare(`
      INSERT INTO pages (title, slug, body, status, featured_image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(title, slug, content, status || "publish", featured_image || "").run();
		return c.json({ success: true });
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
pagesRouter.put("/:id", async (c) => {
	const id = c.req.param("id");
	try {
		const body = await c.req.json();
		await c.env.DB.prepare(`
      UPDATE pages SET title=?, slug=?, body=?, status=?, featured_image=?, updated_at=datetime('now')
      WHERE id=?
    `).bind(body.title, body.slug, body.body, body.status, body.featured_image || "", id).run();
		return c.json({ success: true });
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
pagesRouter.delete("/", async (c) => {
	try {
		let id;
		try {
			id = (await c.req.json()).id;
		} catch (e) {
			id = c.req.query("id");
		}
		if (!id) return c.json({ error: "ID required" }, 400);
		await c.env.DB.prepare("DELETE FROM pages WHERE id = ?").bind(id).run();
		return c.json({ success: true });
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
//#endregion
//#region src/cms/addons/quran-mu/quran.router.ts
var quranRouter = new Hono();
quranRouter.get("/panel", (c) => {
	return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>LabMu Quran Admin</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.tailwindcss.com"><\/script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <style>
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #10B981; }
        input:checked + .slider:before { transform: translateX(20px); }
      </style>
    </head>
    <body class="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
        
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
           <h1 class="text-2xl font-bold flex items-center justify-center gap-2">
             <i class="fas fa-quran"></i> Quran Tajwid
           </h1>
           <p class="text-emerald-100 text-xs mt-1">Color Coded Tajweed Sync & Tafsir</p>
        </div>
        
        <div class="p-6 space-y-5">
           <div id="status-box" class="hidden rounded-lg p-3 text-sm text-center border"></div>

           <div>
             <label class="block text-gray-700 text-sm font-semibold mb-2 ml-1">1. Target Surat:</label>
             <div class="relative">
                 <select id="select-surat" class="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-3 pr-8 shadow-sm">
                     <option value="">-- Pilih Surat --</option>
                 </select>
             </div>
           </div>

           <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-inner space-y-3">
              <label class="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-1 text-center">Opsi Sync</label>
              
              <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                 <div class="text-sm text-gray-700 font-medium"><i class="fas fa-book mr-2 text-green-600"></i> Base & Indo</div>
                 <label class="switch"><input type="checkbox" id="chk-indo" checked><span class="slider round"></span></label>
              </div>

              <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                 <div class="text-sm text-gray-700 font-medium"><i class="fas fa-palette mr-2 text-pink-600"></i> Tajwid Warna</div>
                 <label class="switch"><input type="checkbox" id="chk-tajwid" checked><span class="slider round"></span></label>
              </div>

              <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                 <div class="text-sm text-gray-700 font-medium"><i class="fas fa-globe mr-2 text-blue-600"></i> English</div>
                 <label class="switch"><input type="checkbox" id="chk-english" checked><span class="slider round"></span></label>
              </div>

              <div class="flex items-center justify-between">
                 <div class="text-sm text-gray-700 font-medium"><i class="fas fa-headphones mr-2 text-purple-600"></i> Audio</div>
                 <label class="switch"><input type="checkbox" id="chk-audio"><span class="slider round"></span></label>
              </div>
           </div>

           <button onclick="runSync()" id="btn-action" class="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
             <i class="fas fa-sync-alt"></i> Jalankan Sync
           </button>

           <div class="grid grid-cols-2 gap-2 pt-2">
              <button onclick="initTafsir()" class="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition">
                 <i class="fas fa-database"></i> Init DB Tafsir
              </button>
              <button onclick="clearKv()" class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition">
                 <i class="fas fa-broom"></i> Bersihkan Cache
              </button>
           </div>
        </div>
      </div>

      <script>
        const namaSurat = ["Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahfi", "Maryam", "Ta-Ha", "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Asy-Syu'ara'", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Tagabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghasyiyah", "Al-Fajr", "Al-Balad", "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr", "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"];
        const select = document.getElementById('select-surat');
        namaSurat.forEach((n, i) => {
            const opt = document.createElement('option');
            opt.value = i + 1;
            opt.text = (i+1) + ". " + n;
            select.appendChild(opt);
        });

        async function runSync() {
            const nomor = select.value;
            if(!nomor) { alert('Pilih surat dulu!'); return; }
            
            const useIndo = document.getElementById('chk-indo').checked;
            const useTajwid = document.getElementById('chk-tajwid').checked;
            const useEng = document.getElementById('chk-english').checked;
            const useAudio = document.getElementById('chk-audio').checked;
            
            const status = document.getElementById('status-box');
            const btn = document.getElementById('btn-action');
            
            status.style.display = 'block';
            status.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Syncing Tajwid & Data...';
            status.className = 'rounded-lg p-3 text-sm text-center border bg-yellow-50 text-yellow-700 border-yellow-200';
            btn.disabled = true;

            try {
                const url = './fix/' + nomor + '?indo=' + useIndo + '&tajwid=' + useTajwid + '&eng=' + useEng + '&audio=' + useAudio;
                const res = await fetch(url);
                const data = await res.json();
                
                if (data.status === "BERHASIL") {
                    status.innerHTML = '✅ <b>SUKSES!</b> ' + data.pesan;
                    status.className = 'rounded-lg p-3 text-sm text-center border bg-green-50 text-green-700 border-green-200';
                } else {
                    status.innerHTML = '⚠️ <b>GAGAL:</b> ' + data.pesan;
                    status.className = 'rounded-lg p-3 text-sm text-center border bg-red-50 text-red-700 border-red-200';
                }
            } catch (e) {
                status.innerText = 'Error Koneksi: ' + e.message;
            } finally {
                btn.disabled = false;
            }
        }

        async function clearKv() {
            if(!confirm('Hapus Cache?')) return;
            try { await fetch('./clear-kv'); alert('Cache Bersih!'); } catch(e) { alert('Gagal'); }
        }

        async function initTafsir() {
            if(!confirm('Buat Tabel Tafsir di Database?')) return;
            try { 
                const res = await fetch('./tools/init-tafsir'); 
                const data = await res.json();
                alert(data.pesan || data.status); 
            } catch(e) { alert('Error: ' + e.message); }
        }
      <\/script>
    </body>
    </html>
  `);
});
quranRouter.get("/tools/init-tafsir", async (c) => {
	try {
		await c.env.DB.exec(`
            CREATE TABLE IF NOT EXISTS tafsir (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                surah_id INTEGER NOT NULL,
                ayat INTEGER NOT NULL,
                sumber TEXT NOT NULL, 
                teks TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_tafsir_lookup ON tafsir(surah_id, ayat, sumber);
        `);
		try {
			await c.env.DB.exec("ALTER TABLE ayah ADD COLUMN teks_tajwid TEXT;");
		} catch (e) {}
		return c.json({
			status: "BERHASIL",
			pesan: "Tabel Tafsir Siap & Kolom Tajwid Dicek."
		});
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
quranRouter.get("/tools/import-url", async (c) => {
	const nomor = c.req.query("nomor");
	const sumber = c.req.query("sumber");
	const url = c.req.query("url");
	if (!nomor || !sumber || !url) return c.json({ error: "Parameter kurang" });
	try {
		const surah = await c.env.DB.prepare("SELECT id FROM surah WHERE nomor = ?").bind(nomor).first();
		if (!surah) return c.json({ error: "Surat tidak ditemukan" });
		const json = await (await fetch(url)).json();
		const stmt = c.env.DB.prepare("INSERT INTO tafsir (surah_id, ayat, sumber, teks) VALUES (?, ?, ?, ?)");
		const batch = [];
		if (typeof json === "object") {
			const dataTafsir = json.tafsir || json;
			for (const [key, val] of Object.entries(dataTafsir)) {
				const ayatKe = parseInt(key.replace(/[^0-9]/g, ""));
				if (!isNaN(ayatKe) && typeof val === "string") batch.push(stmt.bind(surah.id, ayatKe, sumber, val));
			}
		}
		if (batch.length > 0) {
			await c.env.DB.prepare("DELETE FROM tafsir WHERE surah_id = ? AND sumber = ?").bind(surah.id, sumber).run();
			await c.env.DB.batch(batch);
			return c.json({
				status: "SUKSES",
				pesan: `Import ${batch.length} data.`
			});
		}
		return c.json({
			status: "KOSONG",
			pesan: "Tidak ada data terbaca."
		});
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
quranRouter.get("/data-tafsir/:nomor", async (c) => {
	const nomor = c.req.param("nomor");
	const source = c.req.query("source") || "ibnukatsir";
	const cacheKey = `TAFSIR_${source.toUpperCase()}_${nomor}`;
	try {
		const cached = await c.env.QURAN_CACHE.get(cacheKey, "json");
		if (cached) return c.json(cached);
		let resultData = [];
		let sourceName = "";
		try {
			const surah = await c.env.DB.prepare("SELECT id FROM surah WHERE nomor = ?").bind(nomor).first();
			if (surah) {
				const dbData = await c.env.DB.prepare("SELECT ayat, teks FROM tafsir WHERE surah_id = ? AND sumber = ? ORDER BY ayat ASC").bind(surah.id, source).all();
				if (dbData.results && dbData.results.length > 0) {
					resultData = dbData.results;
					sourceName = source === "ibnukatsir" ? "Tafsir Ibnu Katsir" : source === "attanwir" ? "Tafsir At-Tanwir" : `Tafsir ${source}`;
				}
			}
		} catch (e) {
			console.log("DB Error (Tabel belum ada?):", e);
		}
		if (resultData.length === 0 && source === "kemenag") {
			sourceName = "Tafsir Kemenag (Tahlili)";
			try {
				const response = await fetch(`https://equran.id/api/v2/tafsir/${nomor}`);
				if (response.ok) {
					const json = await response.json();
					if (json.data && json.data.tafsir) resultData = json.data.tafsir.map((i) => ({
						ayat: i.ayat,
						teks: i.teks
					}));
				}
			} catch (e) {}
		}
		const finalJson = {
			surat: nomor,
			sumber: sourceName,
			data: resultData
		};
		if (resultData.length > 0) await c.env.QURAN_CACHE.put(cacheKey, JSON.stringify(finalJson), { expirationTtl: 604800 });
		return c.json(finalJson);
	} catch (e) {
		return c.json({
			error: e.message,
			data: []
		}, 500);
	}
});
async function superSync(env, nomorSurat, options) {
	try {
		let surahDb = await env.DB.prepare("SELECT id FROM surah WHERE nomor = ?").bind(nomorSurat).first();
		let surahId = surahDb ? surahDb.id : null;
		const oldDataMap = {};
		if (surahId) {
			const oldAyat = await env.DB.prepare("SELECT * FROM ayah WHERE surah_id = ?").bind(surahId).all();
			if (oldAyat.results) oldAyat.results.forEach((r) => oldDataMap[r.nomor_ayat] = r);
		}
		const headers = { "User-Agent": "Mozilla/5.0 (Worker) LabMu/1.0" };
		const resIndo = await fetch(`https://equran.id/api/v2/surat/${nomorSurat}`, { headers });
		if (!resIndo.ok) throw new Error("Gagal akses EQuran");
		const s = (await resIndo.json()).data;
		let mapTajwid = {};
		let tajwidStatus = "Skipped";
		if (options.tajwid) try {
			const resTajwid = await fetch(`https://api.alquran.cloud/v1/surah/${nomorSurat}/quran-tajweed`, { headers });
			if (resTajwid.ok) {
				const jsonTajwid = await resTajwid.json();
				if (jsonTajwid.data && jsonTajwid.data.ayahs) {
					jsonTajwid.data.ayahs.forEach((a) => mapTajwid[a.numberInSurah] = a.text);
					tajwidStatus = "OK";
				}
			} else tajwidStatus = "API Gagal";
		} catch (e) {
			tajwidStatus = "Error Fetch";
		}
		let mapEnglish = {};
		let engStatus = "Skipped";
		if (options.eng) try {
			const resEng = await fetch(`https://api.alquran.cloud/v1/surah/${nomorSurat}/en.sahih`, { headers });
			if (resEng.ok) {
				const jsonEng = await resEng.json();
				if (jsonEng.data && jsonEng.data.ayahs) {
					jsonEng.data.ayahs.forEach((a) => mapEnglish[a.numberInSurah] = a.text);
					engStatus = "OK";
				}
			}
		} catch (e) {
			engStatus = "Error";
		}
		const audioHeader = options.audio ? JSON.stringify(s.audioFull) : surahDb ? null : "{}";
		if (!surahDb) {
			await env.DB.prepare(`INSERT INTO surah (nomor, nama, nama_latin, jumlah_ayat, tempat_turun, arti, audio_full) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(s.nomor, s.nama, s.namaLatin, s.jumlahAyat, s.tempatTurun, s.arti, audioHeader || "{}").run();
			surahDb = await env.DB.prepare("SELECT id FROM surah WHERE nomor = ?").bind(nomorSurat).first();
			surahId = surahDb.id;
		} else await env.DB.prepare(`UPDATE surah SET nama_latin=?, jumlah_ayat=?, tempat_turun=?, arti=?, nama=?, audio_full=COALESCE(?, audio_full) WHERE nomor=?`).bind(s.namaLatin, s.jumlahAyat, s.tempatTurun, s.arti, s.nama, audioHeader, nomorSurat).run();
		await env.DB.prepare("DELETE FROM ayah WHERE surah_id = ?").bind(surahId).run();
		const stmt = env.DB.prepare(`
            INSERT INTO ayah (surah_id, nomor_ayat, teks_arab, teks_latin, teks_indonesia, teks_inggris, teks_tajwid, audio_options) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
		const ayatList = s.ayat;
		const batchSize = 25;
		for (let i = 0; i < ayatList.length; i += batchSize) {
			const batchChunk = ayatList.slice(i, i + batchSize).map((ayat) => {
				const no = ayat.nomorAyat;
				const oldRow = oldDataMap[no] || {};
				const txtIndo = options.indo ? ayat.teksIndonesia : oldRow.teks_indonesia || "";
				const txtLatin = options.indo ? ayat.teksLatin : oldRow.teks_latin || "";
				let txtEng = options.eng && mapEnglish[no] ? mapEnglish[no] : oldRow.teks_inggris || "";
				let txtTajwid = "";
				if (options.tajwid && mapTajwid[no]) txtTajwid = mapTajwid[no];
				else txtTajwid = oldRow.teks_tajwid || ayat.teksArab;
				const txtAudio = options.audio ? JSON.stringify(ayat.audio || {}) : oldRow.audio_options || "{}";
				return stmt.bind(surahId, no, ayat.teksArab, txtLatin, txtIndo, txtEng, txtTajwid, txtAudio);
			});
			await env.DB.batch(batchChunk);
		}
		return {
			success: true,
			count: ayatList.length,
			tajwid: tajwidStatus,
			eng: engStatus
		};
	} catch (e) {
		return {
			success: false,
			msg: e.message
		};
	}
}
quranRouter.get("/fix/:nomor", async (c) => {
	const nomor = parseInt(c.req.param("nomor"));
	const indo = c.req.query("indo") !== "false";
	const tajwid = c.req.query("tajwid") === "true";
	const eng = c.req.query("eng") === "true";
	const audio = c.req.query("audio") !== "false";
	const result = await superSync(c.env, nomor, {
		indo,
		tajwid,
		eng,
		audio
	});
	return c.json({
		status: result.success ? "BERHASIL" : "GAGAL",
		pesan: result.msg || `Update OK. Tajwid: ${result.tajwid}, Eng: ${result.eng}`
	});
});
quranRouter.get("/clear-kv", async (c) => {
	try {
		const kv = c.env.QURAN_CACHE;
		if (!kv) return c.json({
			status: "INFO",
			pesan: "KV OFF"
		});
		let list = await kv.list();
		while (list.keys.length > 0) {
			for (const key of list.keys) await kv.delete(key.name);
			if (list.list_complete) break;
			list = await kv.list({ cursor: list.cursor });
		}
		return c.json({
			status: "BERHASIL",
			pesan: "Cache Bersih"
		});
	} catch (e) {
		return c.json({ status: "ERROR" });
	}
});
var KAMUS_SINONIM = {
	"sholat": ["sholat", "salat"],
	"zakat": ["zakat", "sedekah"]
};
var noCache = (c) => {
	c.header("Cache-Control", "no-store, no-cache, must-revalidate");
};
quranRouter.get("/", async (c) => {
	try {
		noCache(c);
		const { results } = await c.env.DB.prepare("SELECT * FROM surah ORDER BY nomor ASC").all();
		const cleanData = results.map((s) => ({
			...s,
			namaLatin: s.nama_latin,
			nama: s.nama,
			audioFull: s.audio_full ? JSON.parse(s.audio_full) : null
		}));
		return c.html(LabMuQuran.renderHome({
			site: { title: "LabMu" },
			data: cleanData
		}));
	} catch (e) {
		return c.text("Error Home: " + e.message, 500);
	}
});
quranRouter.get("/tematik", async (c) => {
	let q = c.req.query("q");
	if (!q) return c.redirect("./");
	q = q.toLowerCase().trim();
	const keywords = KAMUS_SINONIM[q] || [q];
	const whereClause = keywords.map(() => "a.teks_indonesia LIKE ?").join(" OR ");
	const bindParams = keywords.map((k) => `%${k}%`);
	const query = `SELECT a.*, s.nama_latin FROM ayah a JOIN surah s ON a.surah_id = s.id WHERE (${whereClause}) LIMIT 50`;
	const { results } = await c.env.DB.prepare(query).bind(...bindParams).all();
	return c.html(LabMuQuran.renderSearch(results || [], q, { site: { title: "Cari: " + q } }));
});
quranRouter.get("/:slug/:ayat?", async (c) => {
	const slug = c.req.param("slug");
	const ayatTuju = c.req.param("ayat");
	if ([
		"panel",
		"fix",
		"clear-kv",
		"api",
		"assets",
		"tools",
		"data-tafsir"
	].includes(slug)) return;
	try {
		const db = c.env.DB;
		if (!isNaN(Number(slug))) {
			const surah = await db.prepare("SELECT nama_latin FROM surah WHERE nomor = ?").bind(slug).first();
			if (surah) {
				const cleanSlug = surah.nama_latin.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
				return c.redirect("../" + cleanSlug + (ayatTuju ? "/" + ayatTuju : ""), 301);
			}
		}
		const { results: allSurah } = await db.prepare("SELECT * FROM surah").all();
		const inputClean = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
		const surah = (allSurah || []).find((s) => (s.nama_latin || "").toLowerCase().replace(/[^a-z0-9]/g, "") === inputClean);
		if (!surah) return c.html(LabMuQuran.render404({
			site: { title: "404" },
			data: null
		}));
		const surahId = Number(surah.id);
		let { results: ayatData } = await db.prepare("SELECT * FROM ayah WHERE surah_id = ? ORDER BY nomor_ayat ASC").bind(surahId).all();
		if (!ayatData || ayatData.length < surah.jumlah_ayat) {
			await superSync(c.env, surah.nomor, {
				indo: true,
				tajwid: true,
				eng: true,
				audio: true
			});
			ayatData = (await db.prepare("SELECT * FROM ayah WHERE surah_id = ? ORDER BY nomor_ayat ASC").bind(surahId).all()).results;
		}
		const prevSurah = await db.prepare("SELECT nama_latin as namaLatin, nomor FROM surah WHERE nomor = ?").bind(surah.nomor - 1).first();
		const nextSurah = await db.prepare("SELECT nama_latin as namaLatin, nomor FROM surah WHERE nomor = ?").bind(surah.nomor + 1).first();
		const safeParse = (raw) => {
			if (!raw) return null;
			if (typeof raw === "object") return raw;
			const s = String(raw).trim();
			if (s.startsWith("{") || s.startsWith("[")) try {
				return JSON.parse(s);
			} catch (e) {}
			if (s.startsWith("http")) return { "01": s };
			return null;
		};
		const dataRender = {
			...surah,
			namaLatin: surah.nama_latin,
			jumlahAyat: surah.jumlah_ayat,
			audioFull: safeParse(surah.audio_full),
			suratSebelumnya: prevSurah,
			suratSelanjutnya: nextSurah,
			ayat: (ayatData || []).map((r) => ({
				...r,
				nomorAyat: r.nomor_ayat,
				teksArab: r.teks_arab,
				teksTajwid: r.teks_tajwid,
				teksIndonesia: r.teks_indonesia,
				teksLatin: r.teks_latin,
				teksInggris: r.teks_inggris,
				audioOptions: safeParse(r.audio_options)
			}))
		};
		let htmlOutput = LabMuQuran.renderSingle({
			site: { title: surah.nama_latin },
			data: dataRender,
			scrollToAyat: ayatTuju
		});
		if (ayatTuju) htmlOutput = htmlOutput.replace("</body>", `<script>window.addEventListener('load', () => { setTimeout(() => { var el = document.getElementById('ayat-${ayatTuju}'); if(el) { el.scrollIntoView({behavior:'smooth', block:'center'}); el.style.background='rgba(255, 215, 0, 0.2)'; } }, 800); });<\/script></body>`);
		return c.html(htmlOutput);
	} catch (e) {
		return c.text(`Error View: ${e.message}`, 500);
	}
});
//#endregion
//#region src/cms/addons/tarjih-sync/router.ts
var app$1 = new Hono();
var WP_BASE_URL = "https://fatwatarjih.or.id/wp-json/wp/v2/posts";
var ARTICLES_PER_BATCH = 20;
var RE_SCRIPTS = /* @__PURE__ */ new RegExp("<(script|style|iframe|object|embed|applet|figure|svg|form|input|button)[^>]*>[\\s\\S]*?<\\/\\1>", "gi");
var RE_SELF_CLOSING = /* @__PURE__ */ new RegExp("<(img|hr)[^>]*>", "gi");
var RE_COMMENTS = /* @__PURE__ */ new RegExp("", "g");
var RE_LINK = /* @__PURE__ */ new RegExp("<a\\s+(?:[^>]*?\\s+)?href=\"([^\"]*)\"[^>]*>", "gi");
var RE_UNWANTED = /* @__PURE__ */ new RegExp("<\\/?(div|span|font|center|table|tbody|tr|td|style)[^>]*>", "gi");
var RE_NBSP = /* @__PURE__ */ new RegExp("&nbsp;", "gi");
var RE_SPACES = /* @__PURE__ */ new RegExp("\\s+", "g");
var RE_EMPTY_P = /* @__PURE__ */ new RegExp("<p>\\s*<\\/p>", "gi");
var RE_EMPTY_TAGS = /* @__PURE__ */ new RegExp("<[^\\/>][^>]*>[\\s]*<\\/[^>]+>", "g");
var RE_STRIP_ATTR = new RegExp(`<(p|h[1-6]|ul|ol|li|div|span|b|i|strong|em|blockquote)\\s+[^>]+>`, "gi");
var KEYWORDS = {
	aqidah: [
		"iman",
		"allah",
		"tauhid",
		"syirik",
		"kufur",
		"murtad",
		"takhayul",
		"bid'ah",
		"rukun iman",
		"malaikat",
		"kitab",
		"rasul",
		"kiamat",
		"takdir",
		"surga",
		"neraka",
		"ghaib",
		"jin",
		"setan",
		"dukun",
		"pahala",
		"dosa",
		"taubat",
		"nabi",
		"wahyu"
	],
	ibadah: [
		"shalat",
		"sholat",
		"wudhu",
		"tayamum",
		"mandi",
		"azan",
		"masjid",
		"jamaah",
		"jumat",
		"khutbah",
		"zikir",
		"doa",
		"puasa",
		"ramadhan",
		"tarawih",
		"witir",
		"zakat",
		"fitrah",
		"sedekah",
		"haji",
		"umrah",
		"kurban",
		"aqiqah",
		"jenazah",
		"mayit",
		"sujud",
		"rukuk",
		"kiblat"
	],
	akhlak: [
		"adab",
		"perilaku",
		"moral",
		"etika",
		"sopan",
		"santun",
		"jujur",
		"amanah",
		"sabar",
		"syukur",
		"tawadhu",
		"sombong",
		"riya",
		"hasad",
		"ghibah",
		"fitnah",
		"durhaka",
		"bakti",
		"orang tua",
		"tetangga",
		"tamu",
		"pakaian",
		"aurat",
		"silaturahmi",
		"maaf"
	],
	muamalah: [
		"nikah",
		"kawin",
		"talak",
		"cerai",
		"rujuk",
		"waris",
		"wasiat",
		"hibah",
		"wakaf",
		"jual",
		"beli",
		"dagang",
		"bisnis",
		"bank",
		"riba",
		"bunga",
		"utang",
		"piutang",
		"gadai",
		"sewa",
		"upah",
		"gaji",
		"korupsi",
		"suap",
		"politik",
		"pemimpin",
		"negara",
		"hukum",
		"pidana",
		"perdata"
	]
};
var STOPWORDS = [
	"yang",
	"di",
	"dan",
	"itu",
	"dengan",
	"untuk",
	"tidak",
	"ini",
	"dari",
	"dalam",
	"akan",
	"pada",
	"juga",
	"saya",
	"ke",
	"karena",
	"kepada",
	"tersebut",
	"maka",
	"adalah",
	"atau",
	"saat",
	"sudah",
	"oleh",
	"apakah",
	"bagaimana",
	"bisa",
	"dapat",
	"para",
	"sebagai",
	"bagi",
	"harus",
	"kami",
	"kita",
	"anda",
	"dia",
	"mereka",
	"namun",
	"tetapi",
	"sehingga",
	"jika",
	"bila",
	"serta",
	"yaitu",
	"yakni",
	"daripada",
	"seperti",
	"tentang",
	"secara",
	"menurut",
	"antara"
];
function determineCategory(text) {
	const lowerText = text.toLowerCase();
	const scores = {
		aqidah: 0,
		ibadah: 0,
		akhlak: 0,
		muamalah: 0
	};
	for (const [cat, words] of Object.entries(KEYWORDS)) words.forEach((word) => {
		if (lowerText.includes(word)) scores[cat]++;
	});
	let maxScore = 0;
	let bestCat = "Ibadah";
	for (const [cat, score] of Object.entries(scores)) if (score > maxScore) {
		maxScore = score;
		bestCat = cat.charAt(0).toUpperCase() + cat.slice(1);
	}
	return bestCat;
}
function generateAutoTags(title, body) {
	const words = (title + " " + title + " " + title + " " + body.substring(0, 1e3)).toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
	const wordCounts = {};
	words.forEach((w) => {
		if (w.length > 3 && !STOPWORDS.includes(w)) wordCounts[w] = (wordCounts[w] || 0) + 1;
	});
	return Object.entries(wordCounts).sort(([, a], [, b]) => b - a).map(([word]) => word).slice(0, 4).join(", ");
}
function cleanAndOptimizeContent(html) {
	if (!html) return "";
	let clean = html;
	clean = clean.replace(RE_SCRIPTS, "");
	clean = clean.replace(RE_SELF_CLOSING, "");
	clean = clean.replace(RE_COMMENTS, "");
	clean = clean.replace(RE_STRIP_ATTR, "<$1>");
	clean = clean.replace(RE_LINK, "<a href=\"$1\">");
	clean = clean.replace(RE_UNWANTED, "");
	clean = clean.replace(RE_NBSP, " ");
	clean = clean.replace(RE_SPACES, " ");
	clean = clean.replace(RE_EMPTY_P, "");
	clean = clean.replace(RE_EMPTY_TAGS, "");
	return clean.trim();
}
app$1.get("/", (c) => {
	return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sync Tarjih (Final Auto)</title>
      <script src="https://cdn.tailwindcss.com"><\/script>
    </head>
    <body class="bg-gray-50 p-8 text-gray-800 font-sans">
      <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 class="text-2xl font-bold text-center mb-6 text-emerald-700">Sync Tarjih (Smart Categorization)</h1>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-sm text-blue-700">
            <p class="font-bold">Fitur Cerdas (Fixed):</p>
            <ul class="list-disc ml-5 mt-1">
                <li>Auto Kategori & Tags.</li>
                <li>HTML Cleaning (Regex Aman).</li>
                <li>Struktur SEO Friendly.</li>
            </ul>
        </div>

        <div id="status" class="mb-4 p-4 bg-black text-green-400 rounded text-xs font-mono h-64 overflow-y-auto">
          Ready to sync...
        </div>
        <div class="flex gap-2">
            <input type="number" id="pageInput" value="1" class="w-20 border rounded p-2 text-center" placeholder="Page">
            <button id="btnSync" onclick="startSync()" class="flex-1 bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700 transition-all">
                Mulai Sinkronisasi
            </button>
        </div>
      </div>
      <script>
        async function startSync() {
          const btn = document.getElementById('btnSync');
          const status = document.getElementById('status');
          const pageInput = document.getElementById('pageInput');
          let page = parseInt(pageInput.value);
          
          btn.disabled = true;
          
          async function processPage() {
              btn.innerHTML = 'Memproses Halaman ' + page + '...';
              try {
                const res = await fetch('/admin/tarjih-sync/run?page=' + page);
                const data = await res.json();
                
                if(data.logs) {
                    data.logs.forEach(log => { status.innerHTML += '<div>' + log + '</div>'; });
                }
                status.scrollTop = status.scrollHeight;

                if(data.success) {
                    if(data.has_more) {
                        page++;
                        pageInput.value = page;
                        setTimeout(processPage, 1000); 
                    } else {
                        status.innerHTML += '<div class="text-emerald-400 mt-2 font-bold">✅ Semua Selesai!</div>';
                        btn.disabled = false;
                        btn.innerHTML = 'Mulai Sinkronisasi';
                    }
                } else {
                    throw new Error("Gagal memproses");
                }
              } catch (e) {
                status.innerHTML += '<div class="text-red-500 mt-2">Error: ' + e.message + '</div>';
                btn.disabled = false;
                btn.innerHTML = 'Lanjut Sinkronisasi';
              }
          }
          processPage();
        }
      <\/script>
    </body>
    </html>
  `);
});
app$1.get("/run", async (c) => {
	const logs = [];
	const page = c.req.query("page") || "1";
	try {
		const fetchUrl = `${WP_BASE_URL}?per_page=${ARTICLES_PER_BATCH}&page=${page}`;
		const res = await fetch(fetchUrl);
		if (!res.ok) return c.json({
			success: true,
			logs: ["🏁 Selesai."],
			has_more: false
		});
		const posts = await res.json();
		if (posts.length === 0) return c.json({
			success: true,
			logs: ["🏁 Selesai."],
			has_more: false
		});
		logs.push(`📦 Page ${page}: Mengolah ${posts.length} artikel...`);
		const stmtInsert = c.env.DB.prepare(`
            INSERT INTO posts (title, slug, body, featured_image, category, tags, status, created_at) 
            VALUES (?, ?, ?, '', ?, ?, 'publish', ?)
        `);
		const stmtUpdate = c.env.DB.prepare(`
            UPDATE posts SET body = ?, category = ?, tags = ?, title = ? WHERE slug = ?
        `);
		const batchStmts = [];
		for (const p of posts) {
			const slug = p.slug;
			const title = p.title.rendered;
			const cleanBody = cleanAndOptimizeContent(p.content.rendered || "");
			const category = determineCategory(title + " " + cleanBody.replace(/<[^>]+>/g, " "));
			const tags = generateAutoTags(title, cleanBody.replace(/<[^>]+>/g, " "));
			const date = new Date(p.date).toISOString();
			if (await c.env.DB.prepare("SELECT id FROM posts WHERE slug = ?").bind(slug).first()) {
				batchStmts.push(stmtUpdate.bind(cleanBody, category, tags, title, slug));
				logs.push(`🔄 Update: [${category}] ${title} (Tags: ${tags})`);
			} else {
				batchStmts.push(stmtInsert.bind(title, slug, cleanBody, category, tags, date));
				logs.push(`✨ Insert: [${category}] ${title}`);
			}
		}
		if (batchStmts.length > 0) await c.env.DB.batch(batchStmts);
		return c.json({
			success: true,
			logs,
			has_more: true
		});
	} catch (err) {
		if (err.message.includes("no column named tags")) return c.json({
			success: false,
			logs: [...logs, "❌ ERROR: Kolom 'tags' belum ada. Jalankan: ALTER TABLE posts ADD COLUMN tags TEXT;"]
		});
		return c.json({
			success: false,
			logs: [...logs, "❌ Error: " + err.message]
		});
	}
});
//#endregion
//#region src/cms/index.ts
var app = new Hono();
var getBucket = (env) => {
	return env.MEDIA_BUCKET || env.BUCKET;
};
app.use("/*", cors());
app.use("*", async (c, next) => {
	await next();
	c.header("X-Frame-Options", "SAMEORIGIN");
	c.header("X-Content-Type-Options", "nosniff");
	c.header("Content-Security-Policy", "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:;");
});
app.onError((err, c) => {
	console.error(`[Global Error]: ${err.message}`, err);
	return c.json({
		success: false,
		error: err.message || "Internal Server Error"
	}, 500);
});
app.use("/api/*", async (c, next) => {
	const path = c.req.path;
	const method = c.req.method;
	if (path.includes("/login") || path.startsWith("/api/public") || path.startsWith("/api/setup") || method === "GET" && (path.startsWith("/api/media") || path.startsWith("/api/posts") || path.startsWith("/api/pages") || path.startsWith("/api/contents"))) return await next();
	return await authMiddleware(c, next);
});
registerAddons(app);
app.get("/admin", (c) => c.html(renderAdmin({ view: "dash" })));
app.get("/admin/login", (c) => c.html(renderAdmin({ view: "login" })));
app.get("/admin/", (c) => c.redirect("/admin", 301));
app.get("/sys/install", async (c) => {
	try {
		const logs = await updateSchema(c.env.DB);
		return c.json({
			success: true,
			details: logs
		});
	} catch (e) {
		return c.json({ error: e.message }, 500);
	}
});
app.route("/sys/migration", migration);
app.route("/api/contents", usersRouter$1);
app.route("/api/settings", settings);
app.route("/api/media", mediaRouter);
app.route("/api/theme", theme);
app.route("/api/users", usersRouter);
app.route("/api/menus", menusRouter);
app.route("/api/posts", postsRouter);
app.route("/api/quran", quranRouter);
app.route("/api/pages", pagesRouter);
app.route("/admin/tarjih-sync", app$1);
app.get("/media/*", async (c) => {
	try {
		const key = c.req.path.replace("/media/", "");
		if (!key) return c.notFound();
		const bucket = getBucket(c.env);
		if (!bucket) return c.text("Bucket Config Error", 500);
		const object = await bucket.get(decodeURIComponent(key));
		if (!object) return c.text("File not found", 404);
		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set("etag", object.httpEtag);
		headers.set("Cache-Control", "public, max-age=31536000");
		return new Response(object.body, { headers });
	} catch (e) {
		return c.text(e.message, 500);
	}
});
//#endregion
//#region src/utils/honoHandler.ts
var ALL = ({ request, locals }) => {
	return app.fetch(request, locals.runtime?.env || process.env);
};
//#endregion
export { ALL as t };
