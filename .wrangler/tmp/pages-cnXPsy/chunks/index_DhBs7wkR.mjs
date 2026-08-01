globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { F as maybeRenderHead, J as createAstro, K as unescapeHTML, L as addAttribute, _ as renderTemplate, d as Fragment, l as renderComponent, m as renderSlot } from "./server__3e0ELtE.mjs";
import { t as createComponent } from "./astro-component_D9NtsI1-.mjs";
import { a as $$LinkButton, i as useTranslations, o as $$Layout, r as $$Header, t as $$Footer, u as renderScript } from "./Footer_BnjUarGW.mjs";
import { n as getRelativeLocaleUrl, t as config } from "./config_BdbSVu5n.mjs";
import "./compiler_C1DeRWGl.mjs";
import { t as createSvgComponent } from "./runtime_Bwzfvzj8.mjs";
import { i as getD1Posts, r as slugifyStr } from "./postFilter_B3fh8a1F.mjs";
import { t as getPostUrl } from "./getPostPaths_B9RLziIg.mjs";
import { n as toTransitionName, t as $$Datetime } from "./Datetime_RHdSgFX9.mjs";
import { t as IconArrowRight_default } from "./IconArrowRight_BWkj2bXh.mjs";
import { t as getSortedPosts } from "./getSortedPosts_BM6Hczh2.mjs";
import { t as $$Tag } from "./Tag_Cygu-1xj.mjs";
import { t as IconArrowLeft_default } from "./IconArrowLeft_C_wziOMb.mjs";
//#region src/i18n/format.ts
/**
* Replace `{{key}}` placeholders in UI strings.
* Translators can reorder placeholders freely within the sentence.
*/
function tplStr(template, vars) {
	return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
		const value = vars[key];
		return value !== void 0 && value !== null ? String(value) : "";
	});
}
//#endregion
//#region src/layouts/PostLayout.astro
createAstro("https://astro-paper.pages.dev/");
var $$PostLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PostLayout;
	const { site } = config;
	const { title, description, ogImage, canonicalURL, pubDatetime, modDatetime } = Astro.props;
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title ?? site.title,
		image: ogImage,
		...pubDatetime && { datePublished: pubDatetime.toISOString() },
		...modDatetime && { dateModified: modDatetime.toISOString() },
		author: [{
			"@type": "Person",
			name: site.author,
			...site.profile && { url: site.profile }
		}]
	};
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": title,
		"description": description,
		"ogImage": ogImage,
		"canonicalURL": canonicalURL
	}, {
		"default": ($$result) => renderTemplate`${renderSlot($$result, $$slots["default"])}`,
		"head": ($$result) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result) => renderTemplate`<meta property="og:type" content="article">${pubDatetime && renderTemplate`<meta property="article:published_time"${addAttribute(pubDatetime.toISOString(), "content")}>`}${modDatetime && renderTemplate`<meta property="article:modified_time"${addAttribute(modDatetime.toISOString(), "content")}>`}<script type="application/ld+json">${unescapeHTML(JSON.stringify(structuredData))}<\/script>` })}`
	})}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/layouts/PostLayout.astro", void 0);
//#endregion
//#region src/assets/icons/IconEdit.svg
var IconEdit_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconEdit.BuUItOMC.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"width": "24",
		"height": "24",
		"fill": "none",
		"stroke": "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-edit",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1\" /><path d=\"M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3\" />",
	"styles": []
});
//#endregion
//#region src/pages/posts/[...slug]/_components/EditPost.astro
createAstro("https://astro-paper.pages.dev/");
var $$EditPost = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EditPost;
	const { hideEditPost, post, class: className = "" } = Astro.props;
	const editPost = config.features.editPost;
	const href = editPost.enabled ? `${editPost.url}${post.filePath}` : "";
	const showEditPost = editPost.enabled && !hideEditPost && href.trim() !== "";
	const t = useTranslations(Astro.currentLocale);
	return renderTemplate`${showEditPost && renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")} target="_blank" rel="noopener noreferrer"${addAttribute(["hover:text-accent text-muted-foreground flex justify-baseline gap-1.5", className], "class:list")}>${renderComponent($$result, "IconEdit", IconEdit_default, { "class": "inline-block" })}<span>${t.post.editPage}</span></a>`}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/_components/EditPost.astro", void 0);
//#endregion
//#region src/pages/posts/[...slug]/_components/ShareLinks.astro
createAstro("https://astro-paper.pages.dev/");
var $$ShareLinks = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ShareLinks;
	const { shareLinks } = config;
	const t = useTranslations(Astro.currentLocale);
	const icons = /* #__PURE__ */ Object.assign({
		"/src/assets/icons/socials/facebook.svg": () => import("./facebook_DCC3Es2h.mjs"),
		"/src/assets/icons/socials/github.svg": () => import("./github_CJBsN-bv.mjs"),
		"/src/assets/icons/socials/linkedin.svg": () => import("./linkedin_MyysDTR9.mjs"),
		"/src/assets/icons/socials/mail.svg": () => import("./mail_BZBACUGf.mjs"),
		"/src/assets/icons/socials/pinterest.svg": () => import("./pinterest_Cxkjpn1u.mjs"),
		"/src/assets/icons/socials/telegram.svg": () => import("./telegram_BNxqGxf8.mjs"),
		"/src/assets/icons/socials/whatsapp.svg": () => import("./whatsapp_BXX47W6j.mjs"),
		"/src/assets/icons/socials/x.svg": () => import("./x_5NBMLVCo.mjs")
	});
	const pageUrl = Astro.url;
	const platformLabel = (name) => name.charAt(0).toUpperCase() + name.slice(1);
	const items = await Promise.all(shareLinks.map(async ({ name, url, linkTitle }) => {
		const Icon = (await icons[`/src/assets/icons/socials/${name}.svg`]?.())?.default;
		return {
			url,
			title: linkTitle ?? (name === "mail" ? t.post.sharePostViaEmail : tplStr(t.post.sharePostOn, { platform: platformLabel(name) })),
			Icon
		};
	}));
	return renderTemplate`${items.some(({ Icon }) => Icon) && renderTemplate`${maybeRenderHead($$result)}<div class="flex flex-none flex-col items-center justify-center gap-1 md:items-start"><span class="italic">${t.post.sharePostIntro}</span><div class="text-center">${items.map(({ url, title, Icon }) => Icon ? renderTemplate`${renderComponent($$result, "LinkButton", $$LinkButton, {
		"href": `${url}${pageUrl}`,
		"class": "scale-90 p-2 hover:rotate-6 sm:p-1",
		"title": title,
		"target": "_blank",
		"rel": "noopener noreferrer"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Icon", Icon, { "class": "inline-block size-6 scale-125 fill-transparent stroke-current stroke-2 opacity-90 group-hover:fill-transparent sm:scale-110" })}<span class="sr-only">${title}</span>` })}` : null)}</div></div>`}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/_components/ShareLinks.astro", void 0);
//#endregion
//#region src/assets/icons/IconChevronLeft.svg
var IconChevronLeft_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconChevronLeft.DBA9GJaK.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"width": "24",
		"height": "24",
		"fill": "none",
		"stroke": "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-chevron-left",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"m15 6-6 6 6 6\" />",
	"styles": []
});
//#endregion
//#region src/pages/posts/[...slug]/_components/BackButton.astro
createAstro("https://astro-paper.pages.dev/");
var $$BackButton = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BackButton;
	const locale = Astro.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	return renderTemplate`${config.features.showBackButton && renderTemplate`${maybeRenderHead($$result)}<div class="app-layout flex items-center justify-start">${renderComponent($$result, "LinkButton", $$LinkButton, {
		"id": "back-button",
		"href": getRelativeLocaleUrl(locale, ""),
		"class": "focus-outline hover:text-foreground/75 -ms-2 mt-8 mb-2"
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "IconChevronLeft", IconChevronLeft_default, { "class": "inline-block size-6 rtl:rotate-180" })}<span>${t.post.goBack}</span>` })}</div>`}${renderScript($$result, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/_components/BackButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/_components/BackButton.astro", void 0);
//#endregion
//#region src/assets/icons/IconArrowNarrowUp.svg
var IconArrowNarrowUp_default = createSvgComponent({
	"meta": {
		"src": "/_astro/IconArrowNarrowUp.u0CdFf4k.svg",
		"width": 24,
		"height": 24,
		"format": "svg"
	},
	"attributes": {
		"width": "24",
		"height": "24",
		"fill": "none",
		"stroke": "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "2",
		"class": "icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up",
		"viewBox": "0 0 24 24"
	},
	"children": "<path stroke=\"none\" d=\"M0 0h24v24H0z\" /><path d=\"M12 5v14M16 9l-4-4M8 9l4-4\" />",
	"styles": []
});
//#endregion
//#region src/pages/posts/[...slug]/_components/BackToTopButton.astro
createAstro("https://astro-paper.pages.dev/");
var $$BackToTopButton = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BackToTopButton;
	const t = useTranslations(Astro.currentLocale);
	return renderTemplate`${maybeRenderHead($$result)}<div id="btt-btn-container"${addAttribute([
		"fixed inset-e-4 bottom-8 z-50",
		"md:sticky md:inset-e-auto md:float-end md:me-1",
		"translate-y-14 opacity-0 transition duration-500"
	], "class:list")}><button data-button="back-to-top"${addAttribute([
		"group bg-background relative px-2 py-1",
		"size-14 rounded-full shadow-xl",
		"md:h-8 md:w-fit md:rounded-md md:shadow-none md:focus-visible:rounded-none",
		"md:bg-background/35 md:bg-clip-padding md:backdrop-blur-lg"
	], "class:list")}><span id="progress-indicator" class="absolute inset-0 -z-10 block size-14 scale-110 rounded-full bg-transparent md:hidden md:h-8 md:rounded-md"></span>${renderComponent($$result, "IconArrowLeft", IconArrowLeft_default, { "class": "inline-block rotate-90 md:hidden" })}<span class="group-hover:text-accent sr-only text-sm md:not-sr-only">${renderComponent($$result, "IconArrowNarrowUp", IconArrowNarrowUp_default, { "class": "inline-block size-4" })}${t.post.backToTop}</span></button></div><script data-astro-rerun>
  function backToTop() {
    const rootElement = document.documentElement;
    const btnContainer = document.querySelector("#btt-btn-container");
    const backToTopBtn = document.querySelector("[data-button='back-to-top']");
    const progressIndicator = document.querySelector("#progress-indicator");

    if (!rootElement || !btnContainer || !backToTopBtn || !progressIndicator)
      return;

    backToTopBtn.addEventListener("click", () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    let lastVisible = null;
    function handleScroll() {
      const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      const scrollTop = rootElement.scrollTop;
      const scrollPercent = Math.floor((scrollTop / scrollTotal) * 100);

      progressIndicator.style.setProperty(
        "background-image",
        \`conic-gradient(var(--accent), var(--accent) \${scrollPercent}%, transparent \${scrollPercent}%)\`
      );

      const isVisible = scrollTop / scrollTotal > 0.3;

      if (isVisible !== lastVisible) {
        btnContainer.classList.toggle("opacity-100", isVisible);
        btnContainer.classList.toggle("translate-y-0", isVisible);
        btnContainer.classList.toggle("opacity-0", !isVisible);
        btnContainer.classList.toggle("translate-y-14", !isVisible);
        lastVisible = isVisible;
      }
    }

    let ticking = false;
    document.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  backToTop();
<\/script>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/_components/BackToTopButton.astro", void 0);
//#endregion
//#region src/pages/posts/[...slug]/_components/AdjacentPostNav.astro
createAstro("https://astro-paper.pages.dev/");
var $$AdjacentPostNav = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdjacentPostNav;
	const { prevPost, nextPost } = Astro.props;
	const locale = Astro.currentLocale ?? config.site.lang;
	const t = useTranslations(locale);
	return renderTemplate`${maybeRenderHead($$result)}<div data-pagefind-ignore class="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2">${prevPost && renderTemplate`<a${addAttribute(getPostUrl(prevPost.id, prevPost.filePath, locale), "href")} class="flex w-full gap-1 hover:opacity-75">${renderComponent($$result, "IconArrowLeft", IconArrowLeft_default, { "class": "inline-block flex-none rtl:rotate-180" })}<div><span>${t.post.previousPost}</span><div class="text-accent/85 text-sm">${prevPost.title}</div></div></a>`}${nextPost && renderTemplate`<a${addAttribute(getPostUrl(nextPost.id, nextPost.filePath, locale), "href")} class="flex w-full justify-end gap-1 text-end hover:opacity-75 sm:col-start-2"><div><span>${t.post.nextPost}</span><div class="text-accent/85 text-sm">${nextPost.title}</div></div>${renderComponent($$result, "IconArrowRight", IconArrowRight_default, { "class": "inline-block flex-none rtl:rotate-180" })}</a>`}</div>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/_components/AdjacentPostNav.astro", void 0);
//#endregion
//#region src/pages/posts/[...slug]/index.astro
var ____slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro-paper.pages.dev/");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const { slug } = Astro.params;
	const posts = await getD1Posts(Astro);
	const sortedPosts = getSortedPosts(posts);
	const postIndex = sortedPosts.findIndex((p) => p.id === slug);
	if (postIndex === -1) return Astro.redirect("/404");
	const post = sortedPosts[postIndex];
	const prevPost = postIndex > 0 ? {
		id: sortedPosts[postIndex - 1].id,
		title: sortedPosts[postIndex - 1].data.title,
		filePath: sortedPosts[postIndex - 1].filePath
	} : null;
	const nextPost = postIndex < sortedPosts.length - 1 ? {
		id: sortedPosts[postIndex + 1].id,
		title: sortedPosts[postIndex + 1].data.title,
		filePath: sortedPosts[postIndex + 1].filePath
	} : null;
	const locale = Astro.currentLocale ?? config.site.lang;
	const { title, description, ogImage: initOgImage, canonicalURL, pubDatetime, modDatetime, timezone, tags, hideEditPost } = post.data;
	let ogImageUrl;
	if (typeof initOgImage === "string") ogImageUrl = initOgImage;
	else if (initOgImage?.src) ogImageUrl = initOgImage.src;
	if (!ogImageUrl && config.features.dynamicOgImage) ogImageUrl = `${getPostUrl(post.id, post.filePath, locale).replace(/\/+$/, "")}/index.png`;
	const ogImage = ogImageUrl ? new URL(ogImageUrl, Astro.url.origin).href : void 0;
	return renderTemplate`${renderComponent($$result, "PostLayout", $$PostLayout, {
		"title": `${title} | ${config.site.title}`,
		"description": description,
		"ogImage": ogImage,
		"canonicalURL": canonicalURL,
		"pubDatetime": pubDatetime,
		"modDatetime": modDatetime
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {})}${renderComponent($$result, "BackButton", $$BackButton, {})}${maybeRenderHead($$result)}<main id="main-content"${addAttribute(["app-layout", { "mt-8": !config.features.showBackButton }], "class:list")} data-pagefind-body><h1${addAttribute({ viewTransitionName: toTransitionName(title) }, "style")} class="text-accent inline-block text-2xl font-bold sm:text-3xl">${title}</h1><div class="my-2 flex items-center gap-2">${renderComponent($$result, "Datetime", $$Datetime, {
		"pubDatetime": pubDatetime,
		"modDatetime": modDatetime,
		"timezone": timezone,
		"size": "lg"
	})}<span aria-hidden="true"${addAttribute(["text-muted-foreground max-sm:hidden", { hidden: !config.features.editPost?.enabled || hideEditPost }], "class:list")}>|</span>${renderComponent($$result, "EditPost", $$EditPost, {
		"hideEditPost": hideEditPost,
		"post": post,
		"class": "max-sm:hidden"
	})}</div><article id="article"${addAttribute([
		"mt-8 w-full",
		"app-prose max-w-app",
		"prose-pre:bg-(--shiki-light-bg) dark:prose-pre:bg-(--shiki-dark-bg)"
	], "class:list")}>${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(post.body)}` })}</article><hr class="my-8 border-dashed">${renderComponent($$result, "EditPost", $$EditPost, {
		"class": "sm:hidden",
		"hideEditPost": hideEditPost,
		"post": post
	})}${renderComponent($$result, "BackToTopButton", $$BackToTopButton, {})}<ul class="mt-4 mb-8 flex flex-wrap gap-4 sm:my-8">${tags.map((tag) => renderTemplate`${renderComponent($$result, "Tag", $$Tag, {
		"tag": slugifyStr(tag),
		"tagName": tag,
		"size": "sm"
	})}`)}</ul>${renderComponent($$result, "ShareLinks", $$ShareLinks, {})}<hr class="my-8 border-dashed">${renderComponent($$result, "AdjacentPostNav", $$AdjacentPostNav, {
		"prevPost": prevPost,
		"nextPost": nextPost
	})}</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}<script data-astro-rerun>
  function createProgressBar() {
    const progressContainer = document.createElement("div");
    progressContainer.className =
      "progress-container fixed top-0 z-10 h-1 w-full bg-background";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar h-1 w-0 bg-accent";
    progressBar.id = "myBar";

    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
  }
  createProgressBar();

  function updateScrollProgress() {
    document.addEventListener("scroll", () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (document) {
        const myBar = document.getElementById("myBar");
        if (myBar) {
          myBar.style.width = scrolled + "%";
        }
      }
    });
  }
  updateScrollProgress();

  function addHeadingLinks() {
    const headings = Array.from(
      document.querySelectorAll("h2, h3, h4, h5, h6")
    );
    for (const heading of headings) {
      heading.classList.add("group");
      const link = document.createElement("a");
      link.className =
        "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100";
      link.href = "#" + heading.id;

      const span = document.createElement("span");
      span.ariaHidden = "true";
      span.innerText = "#";
      link.appendChild(span);
      heading.appendChild(link);
    }
  }
  addHeadingLinks();

  function attachCopyButtons() {
    const copyButtonLabel = "Copy";
    const codeBlocks = Array.from(document.querySelectorAll("pre"));

    for (const codeBlock of codeBlocks) {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      const computedStyle = getComputedStyle(codeBlock);
      const hasFileNameOffset =
        computedStyle.getPropertyValue("--file-name-offset").trim() !== "";

      const topClass = hasFileNameOffset
        ? "top-(--file-name-offset)"
        : "-top-3";

      const copyButton = document.createElement("button");
      copyButton.className = \`copy-code absolute end-3 \${topClass} rounded bg-muted border border-muted px-2 py-1 text-xs leading-4 text-foreground font-medium\`;
      copyButton.innerHTML = copyButtonLabel;
      codeBlock.setAttribute("tabindex", "0");
      codeBlock.appendChild(copyButton);

      codeBlock?.parentNode?.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);

      copyButton.addEventListener("click", async () => {
        await copyCode(codeBlock, copyButton);
      });
    }

    async function copyCode(block, button) {
      const code = block.querySelector("code");
      const text = code?.innerText;

      await navigator.clipboard.writeText(text ?? "");

      button.innerText = "Copied";

      setTimeout(() => {
        button.innerText = copyButtonLabel;
      }, 700);
    }
  }
  attachCopyButtons();

  /** Accessible image lightbox for article images. */
  function initLightbox() {
    const article = document.getElementById("article");
    if (!article) return;

    const prefersReducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let overlay = null;
    let lastFocused = null;

    // Defer attribute mutations so they don't push the LCP timestamp.
    // Event listeners below use delegation and don't need the attributes to exist yet.
    requestAnimationFrame(() => {
      const images = Array.from(article.querySelectorAll("img"));
      for (const image of images) {
        if (image.closest("a")) continue;
        image.setAttribute("role", "button");
        image.setAttribute("tabindex", "0");
        image.setAttribute("aria-haspopup", "dialog");
        image.setAttribute(
          "aria-label",
          image.alt ? \`Zoom image: \${image.alt}\` : "Zoom image"
        );
      }
    });

    function open(src, alt, trigger) {
      if (overlay) return;
      lastFocused = trigger ?? document.activeElement;

      overlay = document.createElement("div");
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute(
        "aria-label",
        alt ? \`Image preview: \${alt}\` : "Image preview"
      );
      overlay.className =
        "fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/70 backdrop-blur-sm opacity-0 transition-opacity duration-200 motion-reduce:transition-none";

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.setAttribute("aria-label", "Close image preview");
      closeButton.className =
        "absolute end-4 top-4 rounded p-2 text-3xl leading-none text-white";
      closeButton.innerHTML = "&#10005;";
      closeButton.addEventListener("click", close);

      const image = document.createElement("img");
      image.src = src;
      image.alt = "";
      image.className =
        "max-h-[90dvh] max-w-[90dvw] cursor-default object-contain";

      overlay.append(closeButton, image);
      overlay.addEventListener("click", e => {
        if (e.target === overlay && currentScale <= 1) close();
      });

      let currentScale = 1;
      let translateX = 0;
      let translateY = 0;
      let initialDist = 0;
      let initialScale = 1;
      let panStartX = 0;
      let panStartY = 0;
      let panStartTranslateX = 0;
      let panStartTranslateY = 0;
      let lastTapTime = 0;

      function applyTransform() {
        image.style.transform = \`scale(\${currentScale}) translate(\${translateX}px, \${translateY}px)\`;
      }

      function resetTransform() {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        image.style.transform = "";
      }

      overlay.addEventListener(
        "touchstart",
        e => {
          const t = e.touches;
          if (t.length === 2) {
            initialDist = Math.hypot(
              t[1].clientX - t[0].clientX,
              t[1].clientY - t[0].clientY
            );
            initialScale = currentScale;
          } else if (t.length === 1) {
            const now = Date.now();
            if (now - lastTapTime < 300) {
              e.preventDefault();
              if (currentScale > 1) {
                resetTransform();
              } else {
                currentScale = 2;
                translateX = 0;
                translateY = 0;
                applyTransform();
              }
              lastTapTime = 0;
              panStartX = t[0].clientX;
              panStartY = t[0].clientY;
              panStartTranslateX = translateX;
              panStartTranslateY = translateY;
            } else {
              lastTapTime = now;
              if (currentScale > 1) {
                panStartX = t[0].clientX;
                panStartY = t[0].clientY;
                panStartTranslateX = translateX;
                panStartTranslateY = translateY;
              }
            }
          }
        },
        { passive: false }
      );

      overlay.addEventListener(
        "touchmove",
        e => {
          const t = e.touches;
          if (t.length === 2) {
            e.preventDefault();
            const dist = Math.hypot(
              t[1].clientX - t[0].clientX,
              t[1].clientY - t[0].clientY
            );
            currentScale = Math.min(
              4,
              Math.max(1, initialScale * (dist / initialDist))
            );
            applyTransform();
          } else if (t.length === 1) {
            if (currentScale > 1) {
              e.preventDefault();
              translateX =
                panStartTranslateX + (t[0].clientX - panStartX) / currentScale;
              translateY =
                panStartTranslateY + (t[0].clientY - panStartY) / currentScale;
              const maxX = Math.max(
                0,
                (image.clientWidth - overlay.clientWidth / currentScale) / 2
              );
              const maxY = Math.max(
                0,
                (image.clientHeight - overlay.clientHeight / currentScale) / 2
              );
              translateX = Math.min(maxX, Math.max(-maxX, translateX));
              translateY = Math.min(maxY, Math.max(-maxY, translateY));
              applyTransform();
            } else {
              e.preventDefault();
            }
          }
        },
        { passive: false }
      );

      overlay.addEventListener("touchend", e => {
        if (e.touches.length === 0 && currentScale <= 1.05) {
          resetTransform();
        }
      });

      overlay.addEventListener("touchcancel", e => {
        if (e.touches.length === 0 && currentScale <= 1.05) {
          resetTransform();
        }
      });

      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKeyDown);
      window.__closeLightbox = close;

      requestAnimationFrame(() => overlay?.classList.add("opacity-100"));
      closeButton.focus();
    }

    function close() {
      if (!overlay) return;
      const el = overlay;
      overlay = null;
      window.__closeLightbox = null;

      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lastFocused?.focus();
      lastFocused = null;

      if (prefersReducedMotion()) {
        el.remove();
        return;
      }
      const remove = () => el.remove();
      el.addEventListener("transitionend", remove, { once: true });
      setTimeout(remove, 250); // fallback in case transitionend never fires
      el.classList.remove("opacity-100");
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "Tab") {
        trapFocus(e);
      }
    }

    // Keep keyboard focus inside the open dialog.
    function trapFocus(e) {
      if (!overlay) return;
      const focusables = overlay.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function triggerFromEvent(e) {
      const image = e.target.closest("img");
      if (!image || !article.contains(image) || image.closest("a")) return null;
      return image;
    }

    function activate(image) {
      open(image.currentSrc || image.src, image.alt, image);
    }

    article.addEventListener("click", e => {
      const image = triggerFromEvent(e);
      if (!image) return;
      e.preventDefault();
      activate(image);
    });

    article.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      const image = triggerFromEvent(e);
      if (!image) return;
      e.preventDefault();
      activate(image);
    });
  }
  initLightbox();

  if (!window.__lightboxSwapBound) {
    window.__lightboxSwapBound = true;
    document.addEventListener("astro:before-swap", () =>
      window.__closeLightbox?.()
    );
  }

  document.addEventListener("astro:after-swap", () =>
    window.scrollTo({ left: 0, top: 0, behavior: "instant" })
  );
<\/script>`;
}, "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/index.astro", void 0);
var $$file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/pages/posts/[...slug]/index.astro";
var $$url = "/posts/[...slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/posts/[...slug]/index@_@astro
var page = () => ____slug__exports;
//#endregion
export { page };
