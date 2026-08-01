globalThis.process ??= {};
globalThis.process.env ??= {};
import { G as createVNode, d as Fragment, t as __astro_tag_component__ } from "./server__3e0ELtE.mjs";
import { t as $$ResponsiveTable } from "./ResponsiveTable_Bjv8b9BR.mjs";
//#region src/content/posts/how-to-configure-astropaper-theme.mdx
var frontmatter = {
	"author": "Sat Naing",
	"pubDatetime": "2022-09-23T04:58:53.000Z",
	"modDatetime": "2026-06-03T00:00:00.000Z",
	"title": "How to configure AstroPaper theme",
	"slug": "how-to-configure-astropaper-theme",
	"featured": true,
	"draft": false,
	"tags": ["configuration", "docs"],
	"description": "How you can make AstroPaper theme absolutely yours."
};
function getHeadings() {
	return [
		{
			"depth": 2,
			"slug": "table-of-contents",
			"text": "Table of contents"
		},
		{
			"depth": 2,
			"slug": "configuring-astro-paperconfigts",
			"text": "Configuring astro-paper.config.ts"
		},
		{
			"depth": 3,
			"slug": "site-options",
			"text": "site options"
		},
		{
			"depth": 3,
			"slug": "posts-options",
			"text": "posts options"
		},
		{
			"depth": 3,
			"slug": "features-options",
			"text": "features options"
		},
		{
			"depth": 2,
			"slug": "update-layout-width",
			"text": "Update layout width"
		},
		{
			"depth": 2,
			"slug": "configuring-logo-or-title",
			"text": "Configuring logo or title"
		},
		{
			"depth": 3,
			"slug": "option-1-site-title-text",
			"text": "Option 1: Site title text"
		},
		{
			"depth": 3,
			"slug": "option-2-astros-svg-component",
			"text": "Option 2: Astro’s SVG component"
		},
		{
			"depth": 3,
			"slug": "option-3-astros-image-component",
			"text": "Option 3: Astro’s Image component"
		},
		{
			"depth": 2,
			"slug": "configuring-social-links",
			"text": "Configuring social links"
		},
		{
			"depth": 2,
			"slug": "configuring-share-links",
			"text": "Configuring share links"
		},
		{
			"depth": 2,
			"slug": "configuring-fonts",
			"text": "Configuring fonts"
		},
		{
			"depth": 3,
			"slug": "using-the-default-font",
			"text": "Using the default font"
		},
		{
			"depth": 3,
			"slug": "customizing-the-font",
			"text": "Customizing the font"
		},
		{
			"depth": 2,
			"slug": "see-also",
			"text": "See also"
		}
	];
}
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		details: "details",
		div: "div",
		h2: "h2",
		h3: "h3",
		img: "img",
		li: "li",
		line: "line",
		ol: "ol",
		p: "p",
		path: "path",
		pre: "pre",
		span: "span",
		strong: "strong",
		summary: "summary",
		svg: "svg",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	};
	return createVNode(Fragment, { children: [
		createVNode(_components.p, { children: "This guide covers the available configuration options in AstroPaper — from site metadata and feature flags to fonts, social links, and layout settings." }),
		"\n",
		createVNode(_components.h2, {
			id: "table-of-contents",
			children: "Table of contents"
		}),
		"\n",
		createVNode(_components.p, {}),
		createVNode(_components.details, { children: [
			createVNode(_components.summary, { children: "Open Table of contents" }),
			createVNode(_components.p, {}),
			"\n",
			createVNode(_components.ul, { children: [
				"\n",
				createVNode(_components.li, { children: [
					createVNode(_components.a, {
						href: "#configuring-astro-paperconfigts",
						children: "Configuring astro-paper.config.ts"
					}),
					"\n",
					createVNode(_components.ul, { children: [
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#site-options",
							children: [createVNode(_components.code, { children: "site" }), " options"]
						}) }),
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#posts-options",
							children: [createVNode(_components.code, { children: "posts" }), " options"]
						}) }),
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#features-options",
							children: [createVNode(_components.code, { children: "features" }), " options"]
						}) }),
						"\n"
					] }),
					"\n"
				] }),
				"\n",
				createVNode(_components.li, { children: createVNode(_components.a, {
					href: "#update-layout-width",
					children: "Update layout width"
				}) }),
				"\n",
				createVNode(_components.li, { children: [
					createVNode(_components.a, {
						href: "#configuring-logo-or-title",
						children: "Configuring logo or title"
					}),
					"\n",
					createVNode(_components.ul, { children: [
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#option-1-site-title-text",
							children: "Option 1: Site title text"
						}) }),
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#option-2-astros-svg-component",
							children: "Option 2: Astro’s SVG component"
						}) }),
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#option-3-astros-image-component",
							children: "Option 3: Astro’s Image component"
						}) }),
						"\n"
					] }),
					"\n"
				] }),
				"\n",
				createVNode(_components.li, { children: createVNode(_components.a, {
					href: "#configuring-social-links",
					children: "Configuring social links"
				}) }),
				"\n",
				createVNode(_components.li, { children: createVNode(_components.a, {
					href: "#configuring-share-links",
					children: "Configuring share links"
				}) }),
				"\n",
				createVNode(_components.li, { children: [
					createVNode(_components.a, {
						href: "#configuring-fonts",
						children: "Configuring fonts"
					}),
					"\n",
					createVNode(_components.ul, { children: [
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#using-the-default-font",
							children: "Using the default font"
						}) }),
						"\n",
						createVNode(_components.li, { children: createVNode(_components.a, {
							href: "#customizing-the-font",
							children: "Customizing the font"
						}) }),
						"\n"
					] }),
					"\n"
				] }),
				"\n",
				createVNode(_components.li, { children: createVNode(_components.a, {
					href: "#see-also",
					children: "See also"
				}) }),
				"\n"
			] }),
			"\n",
			createVNode(_components.p, {})
		] }),
		createVNode(_components.p, {}),
		"\n",
		createVNode(_components.h2, {
			id: "configuring-astro-paperconfigts",
			children: "Configuring astro-paper.config.ts"
		}),
		"\n",
		createVNode(_components.p, { children: [
			"All site-wide configuration lives in ",
			createVNode(_components.code, { children: "astro-paper.config.ts" }),
			" at the root of the project. Use ",
			createVNode(_components.code, { children: "defineAstroPaperConfig()" }),
			" to get full IntelliSense support:"
		] }),
		"\n",
		createVNode(_components.pre, {
			class: "astro-code astro-code-themes min-light night-owl mt-8",
			style: {
				"--shiki-light": "#24292eff",
				"--shiki-dark": "#d6deeb",
				"--shiki-light-bg": "#ffffff",
				"--shiki-dark-bg": "#011627",
				overflowX: "auto",
				"--file-name-offset": "-0.75rem"
			},
			tabindex: "0",
			"data-language": "ts",
			children: [createVNode(_components.code, { children: [
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "import"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " { defineAstroPaperConfig } "
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "from"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "./src/types/config"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: ";"
						})
					]
				}),
				"\n",
				createVNode(_components.span, { class: "line" }),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "export"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: " default"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#82AAFF",
								"--shiki-dark-font-style": "italic"
							},
							children: " defineAstroPaperConfig"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "({"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  site"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " {"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://your-site.com/"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#C2C3C5",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#637777",
								"--shiki-dark-font-style": "italic"
							},
							children: " // replace with your deployed URL"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    title"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "AstroPaper"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    description"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "A minimal, responsive and SEO-friendly Astro blog theme."
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    author"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "Sat Naing"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    profile"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://satnaing.dev"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    ogImage"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "default-og.jpg"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    lang"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "en"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    timezone"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "Asia/Bangkok"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    dir"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "ltr"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  }"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  posts"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " {"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    perPage"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 4"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    perIndex"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 4"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    scheduledPostMargin"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 15"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#C792EA"
							},
							children: " *"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 60"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#C792EA"
							},
							children: " *"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 1000"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#C2C3C5",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#637777",
								"--shiki-dark-font-style": "italic"
							},
							children: " // 15 minutes"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  }"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  features"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " {"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    lightAndDarkMode"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FF5874"
							},
							children: " true"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    dynamicOgImage"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FF5874"
							},
							children: " true"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    showArchives"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FF5874"
							},
							children: " true"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    showBackButton"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FF5874"
							},
							children: " true"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    editPost"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " {"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      enabled"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FF5874"
							},
							children: " true"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://github.com/satnaing/astro-paper/edit/main/"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "    }"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    search"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "pagefind"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  }"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  socials"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "github"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://github.com/satnaing/astro-paper"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "x"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://x.com/username"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "linkedin"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://www.linkedin.com/in/username/"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mail"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mailto:yourmail@gmail.com"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  ]"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  shareLinks"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "whatsapp"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://wa.me/?text="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "facebook"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://www.facebook.com/sharer.php?u="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "x"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://x.com/intent/post?url="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "telegram"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://t.me/share/url?url="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mail"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mailto:?subject=See%20this%20post&body="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  ]"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "});"
					})
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "astro-paper.config.ts"
			})]
		}),
		"\n",
		createVNode(_components.h3, {
			id: "site-options",
			children: [createVNode(_components.code, { children: "site" }), " options"]
		}),
		"\n",
		createVNode($$ResponsiveTable, { children: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, { children: [createVNode(_components.thead, { children: createVNode(_components.tr, { children: [createVNode(_components.th, { children: "Option" }), createVNode(_components.th, { children: "Description" })] }) }), createVNode(_components.tbody, { children: [
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "url" }) }), createVNode(_components.td, { children: "Your deployed website URL. Used for canonical URLs, OG image URLs, RSS feed, and sitemap. In production this must be set correctly." })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "title" }) }), createVNode(_components.td, { children: "Your site name." })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "description" }) }), createVNode(_components.td, { children: "Your site description. Useful for SEO and social media sharing." })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "author" }) }), createVNode(_components.td, { children: "Your name. Used as the default post author." })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "profile" }) }), createVNode(_components.td, { children: [
				"Your personal/portfolio website URL, used for structured data. Set to ",
				createVNode(_components.code, { children: "undefined" }),
				" if you don’t have one."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "ogImage" }) }), createVNode(_components.td, { children: [
				"Default OG image filename in ",
				createVNode(_components.code, { children: "/public" }),
				" (e.g. ",
				createVNode(_components.code, { children: "\"default-og.jpg\"" }),
				"). Used when no post-specific OG image is set and ",
				createVNode(_components.code, { children: "dynamicOgImage" }),
				" is disabled."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "lang" }) }), createVNode(_components.td, { children: [
				"HTML ISO language code for ",
				createVNode(_components.code, { children: "<html lang=\"...\">" }),
				". Defaults to ",
				createVNode(_components.code, { children: "\"en\"" }),
				"."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "timezone" }) }), createVNode(_components.td, { children: [
				"IANA timezone for post dates (e.g. ",
				createVNode(_components.code, { children: "\"Asia/Bangkok\"" }),
				"). Ensures consistent timestamps across localhost and your deployed site."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "dir" }) }), createVNode(_components.td, { children: [
				"Text direction for ",
				createVNode(_components.code, { children: "<html dir=\"...\">" }),
				". Supports ",
				createVNode(_components.code, { children: "\"ltr\"" }),
				" | ",
				createVNode(_components.code, { children: "\"rtl\"" }),
				" | ",
				createVNode(_components.code, { children: "\"auto\"" }),
				"."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "googleVerification" }) }), createVNode(_components.td, { children: [
				"Google Search Console verification meta tag value. Optional. Takes precedence over the ",
				createVNode(_components.code, { children: "PUBLIC_GOOGLE_SITE_VERIFICATION" }),
				" environment variable."
			] })] })
		] })] })] }),
		"\n",
		createVNode(_components.h3, {
			id: "posts-options",
			children: [createVNode(_components.code, { children: "posts" }), " options"]
		}),
		"\n",
		createVNode($$ResponsiveTable, { children: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, { children: [createVNode(_components.thead, { children: createVNode(_components.tr, { children: [createVNode(_components.th, { children: "Option" }), createVNode(_components.th, { children: "Description" })] }) }), createVNode(_components.tbody, { children: [
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "perPage" }) }), createVNode(_components.td, { children: [
				"Number of posts shown per page on paginated listing pages. Defaults to ",
				createVNode(_components.code, { children: "4" }),
				"."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "perIndex" }) }), createVNode(_components.td, { children: [
				"Number of posts shown in the Recent section on the home page. Defaults to ",
				createVNode(_components.code, { children: "4" }),
				"."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "scheduledPostMargin" }) }), createVNode(_components.td, { children: [
				"Posts with a future ",
				createVNode(_components.code, { children: "pubDatetime" }),
				" within this window (in ms) are treated as published. Defaults to 15 minutes (",
				createVNode(_components.code, { children: "15 * 60 * 1000" }),
				")."
			] })] })
		] })] })] }),
		"\n",
		createVNode(_components.h3, {
			id: "features-options",
			children: [createVNode(_components.code, { children: "features" }), " options"]
		}),
		"\n",
		createVNode($$ResponsiveTable, { children: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, { children: [createVNode(_components.thead, { children: createVNode(_components.tr, { children: [createVNode(_components.th, { children: "Option" }), createVNode(_components.th, { children: "Description" })] }) }), createVNode(_components.tbody, { children: [
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "lightAndDarkMode" }) }), createVNode(_components.td, { children: [
				"Enable or disable the light/dark mode toggle. Defaults to ",
				createVNode(_components.code, { children: "true" }),
				"."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "dynamicOgImage" }) }), createVNode(_components.td, { children: [
				"Generate a dynamic OG image per post when no ",
				createVNode(_components.code, { children: "ogImage" }),
				" is specified in frontmatter. Defaults to ",
				createVNode(_components.code, { children: "true" }),
				". See the ",
				createVNode(_components.a, {
					href: "https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/#trade-off",
					children: "trade-off"
				}),
				" for details."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "showArchives" }) }), createVNode(_components.td, { children: [
				"Show the ",
				createVNode(_components.code, { children: "/archives" }),
				" page and its header link. Defaults to ",
				createVNode(_components.code, { children: "true" }),
				"."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "showBackButton" }) }), createVNode(_components.td, { children: [
				"Show the “Go back” button on post pages. Defaults to ",
				createVNode(_components.code, { children: "true" }),
				"."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "editPost" }) }), createVNode(_components.td, { children: [
				"An “Edit page” link shown under post titles. Set ",
				createVNode(_components.code, { children: "enabled: true" }),
				" and provide the base ",
				createVNode(_components.code, { children: "url" }),
				" for your repository’s edit URL. Per-post override via ",
				createVNode(_components.code, { children: "hideEditPost" }),
				" frontmatter."
			] })] }),
			createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "search" }) }), createVNode(_components.td, { children: [
				"Search provider. ",
				createVNode(_components.code, { children: "\"pagefind\"" }),
				" is the default. Set to ",
				createVNode(_components.code, { children: "false" }),
				" to disable search entirely."
			] })] })
		] })] })] }),
		"\n",
		createVNode(_components.h2, {
			id: "update-layout-width",
			children: "Update layout width"
		}),
		"\n",
		createVNode(_components.p, { children: [
			"The default ",
			createVNode(_components.code, { children: "max-width" }),
			" for the entire blog is ",
			createVNode(_components.code, { children: "768px" }),
			" (",
			createVNode(_components.code, { children: "max-w-3xl" }),
			"). If you’d like to change it, update the ",
			createVNode(_components.code, { children: "max-w-app" }),
			" utility in ",
			createVNode(_components.code, { children: "src/styles/global.css" }),
			":"
		] }),
		"\n",
		createVNode(_components.pre, {
			class: "astro-code astro-code-themes min-light night-owl has-diff mt-8",
			style: {
				"--shiki-light": "#24292eff",
				"--shiki-dark": "#d6deeb",
				"--shiki-light-bg": "#ffffff",
				"--shiki-dark-bg": "#011627",
				overflowX: "auto",
				"--file-name-offset": "-0.75rem"
			},
			tabindex: "0",
			"data-language": "css",
			children: [createVNode(_components.code, { children: [
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#C792EA"
							},
							children: "@"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "utility"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " max-w-app {"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line diff remove",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#C792EA"
							},
							children: "  @"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "apply"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " max-w-3xl;"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line diff add",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#C792EA"
							},
							children: "  @"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "apply"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " max-w-4xl xl:max-w-5xl;"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "}"
					})
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "src/styles/global.css"
			})]
		}),
		"\n",
		createVNode(_components.p, { children: [
			"You can explore more ",
			createVNode(_components.code, { children: "max-width" }),
			" values in the ",
			createVNode(_components.a, {
				href: "https://tailwindcss.com/docs/max-width",
				children: "Tailwind CSS docs"
			}),
			"."
		] }),
		"\n",
		createVNode(_components.h2, {
			id: "configuring-logo-or-title",
			children: "Configuring logo or title"
		}),
		"\n",
		createVNode(_components.p, { children: createVNode(_components.img, {
			src: "https://res.cloudinary.com/noezectz/v1663911318/astro-paper/AstroPaper-logo-config_goff5l.png",
			alt: "An arrow pointing at the website logo"
		}) }),
		"\n",
		createVNode(_components.p, { children: "There are 3 options you can do:" }),
		"\n",
		createVNode(_components.h3, {
			id: "option-1-site-title-text",
			children: "Option 1: Site title text"
		}),
		"\n",
		createVNode(_components.p, { children: [
			"This is the easiest option. Update ",
			createVNode(_components.code, { children: "site.title" }),
			" in ",
			createVNode(_components.code, { children: "astro-paper.config.ts" }),
			"."
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "option-2-astros-svg-component",
			children: "Option 2: Astro’s SVG component"
		}),
		"\n",
		createVNode(_components.p, { children: "You might want to use this option if you want to use an SVG logo." }),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: [
				"\n",
				createVNode(_components.p, { children: [
					"First add an SVG inside ",
					createVNode(_components.code, { children: "src/assets/" }),
					" directory. (e.g. ",
					createVNode(_components.code, { children: "src/assets/dummy-logo.svg" }),
					")"
				] }),
				"\n"
			] }),
			"\n",
			createVNode(_components.li, { children: [
				"\n",
				createVNode(_components.p, { children: ["Then import that SVG inside ", createVNode(_components.code, { children: "Header.astro" })] }),
				"\n",
				createVNode(_components.pre, {
					class: "astro-code astro-code-themes min-light night-owl mt-8",
					style: {
						"--shiki-light": "#24292eff",
						"--shiki-dark": "#d6deeb",
						"--shiki-light-bg": "#ffffff",
						"--shiki-dark-bg": "#011627",
						overflowX: "auto",
						"--file-name-offset": "-0.75rem"
					},
					tabindex: "0",
					"data-language": "astro",
					children: [createVNode(_components.code, { children: [
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "---"
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "// ..."
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C792EA",
										"--shiki-dark-font-style": "italic"
									},
									children: "import"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#D6DEEB"
									},
									children: " DummyLogo "
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C792EA",
										"--shiki-dark-font-style": "italic"
									},
									children: "from"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: " \""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "@/assets/dummy-logo.svg"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#D6DEEB"
									},
									children: ";"
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "---"
							})
						})
					] }), createVNode(_components.span, {
						class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
						children: "src/components/Header.astro"
					})]
				}),
				"\n"
			] }),
			"\n",
			createVNode(_components.li, { children: [
				"\n",
				createVNode(_components.p, { children: [
					"Finally, replace ",
					createVNode(_components.code, { children: "{config.site.title}" }),
					" with imported logo."
				] }),
				"\n",
				createVNode(_components.pre, {
					class: "astro-code astro-code-themes min-light night-owl",
					style: {
						"--shiki-light": "#24292eff",
						"--shiki-dark": "#d6deeb",
						"--shiki-light-bg": "#ffffff",
						"--shiki-dark-bg": "#011627",
						overflowX: "auto",
						"--file-name-offset": "-0.75rem"
					},
					tabindex: "0",
					"data-language": "html",
					children: createVNode(_components.code, { children: [
						createVNode(_components.span, {
							class: "line",
							children: [createVNode(_components.span, {
								style: {
									"--shiki-light": "#24292EFF",
									"--shiki-dark": "#7FDBCA"
								},
								children: "<"
							}), createVNode(_components.span, {
								style: {
									"--shiki-light": "#22863A",
									"--shiki-dark": "#CAECE6"
								},
								children: "a"
							})]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: "  href"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "/"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: "  class"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "absolute py-1 text-left text-2xl leading-7 font-semibold whitespace-nowrap sm:static"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#24292EFF",
									"--shiki-dark": "#7FDBCA"
								},
								children: ">"
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: "  <"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#FFFFFF"
									},
									children: "DummyLogo"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: " class"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "scale-75 dark:invert"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: " />"
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "  <!-- {config.site.title} -->"
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: "</"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#CAECE6"
									},
									children: "a"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: ">"
								})
							]
						})
					] })
				}),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		createVNode(_components.p, { children: "The best part of this approach is that you can customize your SVG styles as needed. In the example above, you can see how the SVG logo color can be inverted in dark mode." }),
		"\n",
		createVNode(_components.h3, {
			id: "option-3-astros-image-component",
			children: "Option 3: Astro’s Image component"
		}),
		"\n",
		createVNode(_components.p, { children: "If your logo is an image but not SVG, you can use Astro’s Image component." }),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: [
				"\n",
				createVNode(_components.p, { children: [
					"Add your logo inside ",
					createVNode(_components.code, { children: "src/assets/" }),
					" directory. (e.g. ",
					createVNode(_components.code, { children: "src/assets/dummy-logo.png" }),
					")"
				] }),
				"\n"
			] }),
			"\n",
			createVNode(_components.li, { children: [
				"\n",
				createVNode(_components.p, { children: [
					"Import ",
					createVNode(_components.code, { children: "Image" }),
					" and your logo in ",
					createVNode(_components.code, { children: "Header.astro" })
				] }),
				"\n",
				createVNode(_components.pre, {
					class: "astro-code astro-code-themes min-light night-owl mt-8",
					style: {
						"--shiki-light": "#24292eff",
						"--shiki-dark": "#d6deeb",
						"--shiki-light-bg": "#ffffff",
						"--shiki-dark-bg": "#011627",
						overflowX: "auto",
						"--file-name-offset": "-0.75rem"
					},
					tabindex: "0",
					"data-language": "astro",
					children: [createVNode(_components.code, { children: [
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "---"
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "// ..."
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C792EA",
										"--shiki-dark-font-style": "italic"
									},
									children: "import"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#D6DEEB"
									},
									children: " { Image } "
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C792EA",
										"--shiki-dark-font-style": "italic"
									},
									children: "from"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: " \""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "astro:assets"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#D6DEEB"
									},
									children: ";"
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C792EA",
										"--shiki-dark-font-style": "italic"
									},
									children: "import"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#D6DEEB"
									},
									children: " dummyLogo "
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C792EA",
										"--shiki-dark-font-style": "italic"
									},
									children: "from"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: " \""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "@/assets/dummy-logo.png"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#D6DEEB"
									},
									children: ";"
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "---"
							})
						})
					] }), createVNode(_components.span, {
						class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
						children: "src/components/Header.astro"
					})]
				}),
				"\n"
			] }),
			"\n",
			createVNode(_components.li, { children: [
				"\n",
				createVNode(_components.p, { children: [
					"Then, replace ",
					createVNode(_components.code, { children: "{config.site.title}" }),
					" with imported logo."
				] }),
				"\n",
				createVNode(_components.pre, {
					class: "astro-code astro-code-themes min-light night-owl",
					style: {
						"--shiki-light": "#24292eff",
						"--shiki-dark": "#d6deeb",
						"--shiki-light-bg": "#ffffff",
						"--shiki-dark-bg": "#011627",
						overflowX: "auto",
						"--file-name-offset": "-0.75rem"
					},
					tabindex: "0",
					"data-language": "html",
					children: createVNode(_components.code, { children: [
						createVNode(_components.span, {
							class: "line",
							children: [createVNode(_components.span, {
								style: {
									"--shiki-light": "#24292EFF",
									"--shiki-dark": "#7FDBCA"
								},
								children: "<"
							}), createVNode(_components.span, {
								style: {
									"--shiki-light": "#22863A",
									"--shiki-dark": "#CAECE6"
								},
								children: "a"
							})]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: "  href"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "/"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: "  class"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "absolute py-1 text-left text-2xl leading-7 font-semibold whitespace-nowrap sm:static"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#24292EFF",
									"--shiki-dark": "#7FDBCA"
								},
								children: ">"
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: "  <"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#FFFFFF"
									},
									children: "image"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: " src"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "{dummyLogo}"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: " alt"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "My Blog"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-light-font-style": "inherit",
										"--shiki-dark": "#C5E478",
										"--shiki-dark-font-style": "italic"
									},
									children: " class"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#D32F2F",
										"--shiki-dark": "#7FDBCA"
									},
									children: "="
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#ECC48D"
									},
									children: "dark:invert"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#D9F5DD"
									},
									children: "\""
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: " />"
								})
							]
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: createVNode(_components.span, {
								style: {
									"--shiki-light": "#C2C3C5",
									"--shiki-light-font-style": "inherit",
									"--shiki-dark": "#637777",
									"--shiki-dark-font-style": "italic"
								},
								children: "  <!-- {config.site.title} -->"
							})
						}),
						"\n",
						createVNode(_components.span, {
							class: "line",
							children: [
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: "</"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#22863A",
										"--shiki-dark": "#CAECE6"
									},
									children: "a"
								}),
								createVNode(_components.span, {
									style: {
										"--shiki-light": "#24292EFF",
										"--shiki-dark": "#7FDBCA"
									},
									children: ">"
								})
							]
						})
					] })
				}),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		createVNode(_components.p, { children: [
			"With this approach, you can still adjust your image’s appearance using CSS classes. However, this might not always fit what you want. If you need to display different logo images based on light or dark mode, check how light/dark icons are handled inside the ",
			createVNode(_components.code, { children: "Header.astro" }),
			" component."
		] }),
		"\n",
		createVNode(_components.h2, {
			id: "configuring-social-links",
			children: "Configuring social links"
		}),
		"\n",
		createVNode(_components.p, { children: createVNode(_components.img, {
			src: "https://github.com/user-attachments/assets/8b895400-d088-442f-881b-02d2443e00cf",
			alt: "An arrow pointing at social link icons"
		}) }),
		"\n",
		createVNode(_components.p, { children: [
			"Social links are configured in the ",
			createVNode(_components.code, { children: "socials" }),
			" array inside ",
			createVNode(_components.code, { children: "astro-paper.config.ts" }),
			". Each entry requires a ",
			createVNode(_components.code, { children: "name" }),
			" matching an SVG filename in ",
			createVNode(_components.code, { children: "src/assets/icons/socials/" }),
			" and a ",
			createVNode(_components.code, { children: "url" }),
			":"
		] }),
		"\n",
		createVNode(_components.pre, {
			class: "astro-code astro-code-themes min-light night-owl mt-8",
			style: {
				"--shiki-light": "#24292eff",
				"--shiki-dark": "#d6deeb",
				"--shiki-light-bg": "#ffffff",
				"--shiki-dark-bg": "#011627",
				overflowX: "auto",
				"--file-name-offset": "-0.75rem"
			},
			tabindex: "0",
			"data-language": "ts",
			children: [createVNode(_components.code, { children: [
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "export"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: " default"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#82AAFF",
								"--shiki-dark-font-style": "italic"
							},
							children: " defineAstroPaperConfig"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "({"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "  // ..."
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  socials"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "github"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://github.com/satnaing/astro-paper"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "x"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://x.com/username"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "linkedin"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://www.linkedin.com/in/username/"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mail"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mailto:yourmail@gmail.com"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  ]"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "});"
					})
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "astro-paper.config.ts"
			})]
		}),
		"\n",
		createVNode(_components.p, { children: [
			"To add a social not in the defaults, add its SVG icon to ",
			createVNode(_components.code, { children: "src/assets/icons/socials/" }),
			" and add an entry to the array. The ",
			createVNode(_components.code, { children: "name" }),
			" must match the SVG filename without the ",
			createVNode(_components.code, { children: ".svg" }),
			" extension."
		] }),
		"\n",
		createVNode(_components.h2, {
			id: "configuring-share-links",
			children: "Configuring share links"
		}),
		"\n",
		createVNode(_components.p, { children: createVNode(_components.img, {
			src: "https://github.com/user-attachments/assets/4f930b68-b625-45df-8c41-e076dd2b838e",
			alt: "An arrow pointing at share link icons"
		}) }),
		"\n",
		createVNode(_components.p, { children: [
			"Share links are configured in the ",
			createVNode(_components.code, { children: "shareLinks" }),
			" array. Each entry requires a ",
			createVNode(_components.code, { children: "name" }),
			" (matching an SVG in ",
			createVNode(_components.code, { children: "src/assets/icons/socials/" }),
			") and a base ",
			createVNode(_components.code, { children: "url" }),
			" to which the post URL is appended:"
		] }),
		"\n",
		createVNode(_components.pre, {
			class: "astro-code astro-code-themes min-light night-owl mt-8",
			style: {
				"--shiki-light": "#24292eff",
				"--shiki-dark": "#d6deeb",
				"--shiki-light-bg": "#ffffff",
				"--shiki-dark-bg": "#011627",
				overflowX: "auto",
				"--file-name-offset": "-0.75rem"
			},
			tabindex: "0",
			"data-language": "ts",
			children: [createVNode(_components.code, { children: [
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "export"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: " default"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#82AAFF",
								"--shiki-dark-font-style": "italic"
							},
							children: " defineAstroPaperConfig"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "({"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "  // ..."
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  shareLinks"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "whatsapp"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://wa.me/?text="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "facebook"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://www.facebook.com/sharer.php?u="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "x"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://x.com/intent/post?url="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "telegram"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "https://t.me/share/url?url="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "    { name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mail"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " url"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "mailto:?subject=See%20this%20post&body="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  ]"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "});"
					})
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "astro-paper.config.ts"
			})]
		}),
		"\n",
		createVNode(_components.h2, {
			id: "configuring-fonts",
			children: "Configuring fonts"
		}),
		"\n",
		createVNode(_components.p, { children: [
			"AstroPaper uses Astro’s ",
			createVNode(_components.a, {
				href: "https://docs.astro.build/en/guides/fonts/",
				children: "fonts API"
			}),
			" with ",
			createVNode(_components.a, {
				href: "https://fonts.google.com/specimen/Google+Sans+Code",
				children: "Google Sans Code"
			}),
			" as the default font. This provides consistent typography across all platforms with automatic font optimizations including preloading and caching."
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "using-the-default-font",
			children: "Using the default font"
		}),
		"\n",
		createVNode(_components.p, { children: [
			"The font is automatically configured in ",
			createVNode(_components.code, { children: "astro.config.ts" }),
			" and loaded in ",
			createVNode(_components.code, { children: "Layout.astro" }),
			". No additional configuration is needed to use the default Google Sans Code font."
		] }),
		"\n",
		createVNode(_components.h3, {
			id: "customizing-the-font",
			children: "Customizing the font"
		}),
		"\n",
		createVNode(_components.p, { children: "To use a different font, update three places:" }),
		"\n",
		createVNode(_components.ol, { children: [
			"\n",
			createVNode(_components.li, { children: createVNode(_components.strong, { children: [
				"Update the font configuration in ",
				createVNode(_components.code, { children: "astro.config.ts" }),
				":"
			] }) }),
			"\n"
		] }),
		"\n",
		createVNode(_components.pre, {
			class: "astro-code astro-code-themes min-light night-owl has-highlighted mt-8",
			style: {
				"--shiki-light": "#24292eff",
				"--shiki-dark": "#d6deeb",
				"--shiki-light-bg": "#ffffff",
				"--shiki-dark-bg": "#011627",
				overflowX: "auto",
				"--file-name-offset": "-0.75rem"
			},
			tabindex: "0",
			"data-language": "ts",
			children: [createVNode(_components.code, { children: [
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "import"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " { defineConfig"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " fontProviders } "
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "from"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "astro/config"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: ";"
						})
					]
				}),
				"\n",
				createVNode(_components.span, { class: "line" }),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "export"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: " default"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#82AAFF",
								"--shiki-dark-font-style": "italic"
							},
							children: " defineConfig"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "({"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "  // ..."
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "  fonts"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "    {"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line highlighted",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "Your Font Name"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line highlighted",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      cssVariable"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "--font-your-font"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      provider"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#D6DEEB"
							},
							children: " fontProviders"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "."
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#82AAFF",
								"--shiki-dark-font-style": "italic"
							},
							children: "google"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "()"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      fallbacks"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "monospace"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "]"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      weights"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: "300"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 400"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 500"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 600"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 700"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "]"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "      styles"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " ["
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "normal"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "italic"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "]"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "    }"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "  ]"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#212121",
							"--shiki-dark": "#D6DEEB"
						},
						children: ","
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "});"
					})
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "astro.config.ts"
			})]
		}),
		"\n",
		createVNode(_components.ol, {
			start: "2",
			children: [
				"\n",
				createVNode(_components.li, { children: createVNode(_components.strong, { children: [
					"Update the Font component in ",
					createVNode(_components.code, { children: "Layout.astro" }),
					":"
				] }) }),
				"\n"
			]
		}),
		"\n",
		createVNode(_components.pre, {
			class: "astro-code astro-code-themes min-light night-owl mt-8",
			style: {
				"--shiki-light": "#24292eff",
				"--shiki-dark": "#d6deeb",
				"--shiki-light-bg": "#ffffff",
				"--shiki-dark-bg": "#011627",
				overflowX: "auto",
				"--file-name-offset": "-0.75rem"
			},
			tabindex: "0",
			"data-language": "astro",
			children: [createVNode(_components.code, { children: [
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "---"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "import"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " { Font } "
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "from"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "astro:assets"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: ";"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "// ..."
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "---"
					})
				}),
				"\n",
				createVNode(_components.span, { class: "line" }),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#7FDBCA"
							},
							children: "<"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#CAECE6"
							},
							children: "head"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#7FDBCA"
							},
							children: ">"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "  <!-- ... -->"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#7FDBCA"
						},
						children: "  <"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#1976D2",
							"--shiki-dark": "#C5E478"
						},
						children: "Font"
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C5E478",
								"--shiki-dark-font-style": "italic"
							},
							children: "    cssVariable"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#7FDBCA"
							},
							children: "="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "--font-your-font"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C5E478",
								"--shiki-dark-font-style": "italic"
							},
							children: "    preload"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#7FDBCA"
							},
							children: "="
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D3423E"
							},
							children: "{"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: "[{ subset"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "latin"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " weight"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#F78C6C"
							},
							children: " 400"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#D6DEEB"
							},
							children: ","
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " style"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#D6DEEB"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: " \""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#ECC48D"
							},
							children: "normal"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#D9F5DD"
							},
							children: "\""
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " }]"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D3423E"
							},
							children: "}"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#7FDBCA"
						},
						children: "  />"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "  <!-- ... -->"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#7FDBCA"
							},
							children: "</"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#CAECE6"
							},
							children: "head"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#7FDBCA"
							},
							children: ">"
						})
					]
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "src/layouts/Layout.astro"
			})]
		}),
		"\n",
		createVNode(_components.ol, {
			start: "3",
			children: [
				"\n",
				createVNode(_components.li, { children: createVNode(_components.strong, { children: [
					"Update the CSS variable mapping in ",
					createVNode(_components.code, { children: "src/styles/theme.css" }),
					":"
				] }) }),
				"\n"
			]
		}),
		"\n",
		createVNode(_components.pre, {
			class: "astro-code astro-code-themes min-light night-owl has-highlighted mt-8",
			style: {
				"--shiki-light": "#24292eff",
				"--shiki-dark": "#d6deeb",
				"--shiki-light-bg": "#ffffff",
				"--shiki-dark-bg": "#011627",
				overflowX: "auto",
				"--file-name-offset": "-0.75rem"
			},
			tabindex: "0",
			"data-language": "css",
			children: [createVNode(_components.code, { children: [
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-dark": "#C792EA"
							},
							children: "@"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#D32F2F",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C792EA",
								"--shiki-dark-font-style": "italic"
							},
							children: "theme"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#D6DEEB"
							},
							children: " inline {"
						})
					]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line highlighted",
					children: [createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#C792EA",
							"--shiki-dark-font-style": "italic"
						},
						children: "  --font-app: var(--font-your-font"
					}), createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "); "
					})]
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "  /* ... */"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "}"
					})
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "src/styles/theme.css"
			})]
		}),
		"\n",
		createVNode(_components.p, { children: [
			"The ",
			createVNode(_components.code, { children: "--font-app" }),
			" variable is used throughout the theme via the ",
			createVNode(_components.code, { children: "font-app" }),
			" Tailwind utility class, so updating this single variable applies your custom font everywhere."
		] }),
		"\n",
		createVNode(_components.div, {
			class: "callout",
			"data-callout": "warning",
			"data-collapsible": "false",
			children: [createVNode(_components.div, {
				class: "callout-title",
				children: [createVNode(_components.div, {
					class: "callout-title-icon",
					"aria-hidden": "true",
					children: createVNode(_components.svg, {
						xmlns: "http://www.w3.org/2000/svg",
						width: "1em",
						height: "1em",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						children: [
							createVNode(_components.path, { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
							createVNode(_components.line, {
								x1: "12",
								y1: "9",
								x2: "12",
								y2: "13"
							}),
							createVNode(_components.line, {
								x1: "12",
								y1: "17",
								x2: "12.01",
								y2: "17"
							})
						]
					})
				}), createVNode(_components.div, {
					class: "callout-title-text",
					children: "Warning"
				})]
			}), createVNode(_components.div, {
				class: "callout-content",
				children: createVNode(_components.p, { children: [
					"Make sure the font name matches exactly as it appears on ",
					createVNode(_components.a, {
						href: "https://fonts.google.com",
						children: "Google Fonts"
					}),
					". For other font providers or local fonts, refer to the ",
					createVNode(_components.a, {
						href: "https://docs.astro.build/en/guides/fonts/",
						children: "Astro Fonts documentation"
					}),
					"."
				] })
			})]
		}),
		"\n",
		createVNode(_components.h2, {
			id: "see-also",
			children: "See also"
		}),
		"\n",
		createVNode(_components.ul, { children: [
			"\n",
			createVNode(_components.li, { children: [
				createVNode(_components.a, {
					href: "https://astro-paper.pages.dev/posts/customizing-astropaper-theme-color-schemes/",
					children: "Customizing AstroPaper theme color schemes"
				}),
				" — change or add color schemes via ",
				createVNode(_components.code, { children: "src/styles/theme.css" }),
				"."
			] }),
			"\n",
			createVNode(_components.li, { children: [createVNode(_components.a, {
				href: "https://astro-paper.pages.dev/posts/adding-new-posts-in-astropaper-theme/",
				children: "Adding new posts"
			}), " — frontmatter reference and file conventions."] }),
			"\n"
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, {
		...props,
		children: createVNode(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
var url = "src/content/posts/how-to-configure-astropaper-theme.mdx";
var file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/content/posts/how-to-configure-astropaper-theme.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/cakiphin/projects/cmsMu/astro-paper/src/content/posts/how-to-configure-astropaper-theme.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
