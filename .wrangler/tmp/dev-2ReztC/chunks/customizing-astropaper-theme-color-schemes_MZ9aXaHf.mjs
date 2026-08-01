globalThis.process ??= {};
globalThis.process.env ??= {};
import { G as createVNode, d as Fragment, t as __astro_tag_component__ } from "./server__3e0ELtE.mjs";
import { t as $$ResponsiveTable } from "./ResponsiveTable_Bjv8b9BR.mjs";
//#region src/content/posts/customizing-astropaper-theme-color-schemes.mdx
var frontmatter = {
	"author": "Sat Naing",
	"pubDatetime": "2022-09-25T15:20:35.000Z",
	"modDatetime": "2026-05-17T04:57:06.476Z",
	"title": "Customizing AstroPaper theme color schemes",
	"featured": false,
	"draft": false,
	"tags": ["color-schemes", "docs"],
	"description": "How you can enable/disable light & dark mode; and customize color schemes of AstroPaper theme."
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
			"slug": "enabledisable-light--dark-mode",
			"text": "Enable/disable light & dark mode"
		},
		{
			"depth": 2,
			"slug": "customize-color-schemes",
			"text": "Customize color schemes"
		}
	];
}
function _createMdxContent(props) {
	const _components = {
		a: "a",
		blockquote: "blockquote",
		code: "code",
		details: "details",
		h2: "h2",
		li: "li",
		p: "p",
		pre: "pre",
		span: "span",
		summary: "summary",
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
		createVNode(_components.p, { children: "This guide covers how to enable or disable light and dark mode, and how to customize the color scheme for the entire site." }),
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
				createVNode(_components.li, { children: createVNode(_components.a, {
					href: "#enabledisable-light--dark-mode",
					children: "Enable/disable light & dark mode"
				}) }),
				"\n",
				createVNode(_components.li, { children: createVNode(_components.a, {
					href: "#customize-color-schemes",
					children: "Customize color schemes"
				}) }),
				"\n"
			] }),
			"\n",
			createVNode(_components.p, {})
		] }),
		createVNode(_components.p, {}),
		"\n",
		createVNode(_components.h2, {
			id: "enabledisable-light--dark-mode",
			children: "Enable/disable light & dark mode"
		}),
		"\n",
		createVNode(_components.p, { children: [
			"AstroPaper theme includes light and dark mode by default. This default behavior can be disabled in ",
			createVNode(_components.code, { children: "astro-paper.config.ts" }),
			":"
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
					class: "line highlighted",
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
					children: createVNode(_components.span, {
						style: {
							"--shiki-light": "#C2C3C5",
							"--shiki-light-font-style": "inherit",
							"--shiki-dark": "#637777",
							"--shiki-dark-font-style": "italic"
						},
						children: "    // ..."
					})
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
			"To disable ",
			createVNode(_components.code, { children: "light & dark mode" }),
			", set ",
			createVNode(_components.code, { children: "features.lightAndDarkMode" }),
			" to ",
			createVNode(_components.code, { children: "false" }),
			". When disabled, the site will use only the light color scheme defined in ",
			createVNode(_components.code, { children: "src/styles/theme.css" }),
			"."
		] }),
		"\n",
		createVNode(_components.h2, {
			id: "customize-color-schemes",
			children: "Customize color schemes"
		}),
		"\n",
		createVNode(_components.p, { children: [
			"Both light and dark color schemes of AstroPaper theme are defined in ",
			createVNode(_components.code, { children: "src/styles/theme.css" }),
			"."
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
			"data-language": "css",
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
						children: "/* Light theme values */"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#C5E478"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C5E478",
								"--shiki-dark-font-style": "italic"
							},
							children: "root"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#C792EA"
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
								"--shiki-dark": "#C792EA"
							},
							children: "["
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C5E478",
								"--shiki-dark-font-style": "italic"
							},
							children: "data-theme"
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
							children: "light"
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
								"--shiki-dark": "#C792EA"
							},
							children: "]"
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
								"--shiki-dark": "#C5E478"
							},
							children: "  --background"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "fdfdfd"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "282728"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --accent"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "006cac"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --accent-foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "ffffff"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --muted"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "e6e6e6"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --muted-foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "6b7280"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --border"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "ece9e9"
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
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "}"
					})
				}),
				"\n",
				createVNode(_components.span, { class: "line" }),
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
						children: "/* Dark theme values */"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C792EA"
							},
							children: "["
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C5E478",
								"--shiki-dark-font-style": "italic"
							},
							children: "data-theme"
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
							children: "dark"
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
								"--shiki-dark": "#C792EA"
							},
							children: "]"
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
								"--shiki-dark": "#C5E478"
							},
							children: "  --background"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "212737"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "eaedf3"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --accent"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "ff6b01"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --accent-foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "ffffff"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --muted"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "343f60"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --muted-foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "afb9ca"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --border"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "ab4b08"
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
			createVNode(_components.code, { children: ":root" }),
			" and ",
			createVNode(_components.code, { children: "[data-theme=\"light\"]" }),
			" selectors define the light color scheme, while ",
			createVNode(_components.code, { children: "[data-theme=\"dark\"]" }),
			" defines the dark color scheme."
		] }),
		"\n",
		createVNode(_components.p, { children: [
			"To customize your own color scheme, specify your light colors inside ",
			createVNode(_components.code, { children: ":root, [data-theme=\"light\"]" }),
			", and your dark colors inside ",
			createVNode(_components.code, { children: "[data-theme=\"dark\"]" }),
			"."
		] }),
		"\n",
		createVNode(_components.p, { children: "Here is a detailed explanation of each color property:" }),
		"\n",
		createVNode($$ResponsiveTable, {
			variant: "minimal",
			class: "max-sm:-mx-4 [&_td]:first-of-type:text-nowrap",
			children: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, { children: [createVNode(_components.thead, { children: createVNode(_components.tr, { children: [createVNode(_components.th, { children: "Color Property" }), createVNode(_components.th, { children: "Definition & Usage" })] }) }), createVNode(_components.tbody, { children: [
				createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "--background" }) }), createVNode(_components.td, { children: "Primary color of the website. Usually the main background." })] }),
				createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "--foreground" }) }), createVNode(_components.td, { children: "Secondary color of the website. Usually the text color." })] }),
				createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "--accent" }) }), createVNode(_components.td, { children: "Accent color. Used for links, hover states, and interactive elements." })] }),
				createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "--accent-foreground" }) }), createVNode(_components.td, { children: [
					"Foreground color displayed on top of ",
					createVNode(_components.code, { children: "--accent" }),
					" backgrounds."
				] })] }),
				createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "--muted" }) }), createVNode(_components.td, { children: "Muted background color. Used for cards, tags, and hover states." })] }),
				createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "--muted-foreground" }) }), createVNode(_components.td, { children: [
					"Text color displayed on top of ",
					createVNode(_components.code, { children: "--muted" }),
					" backgrounds."
				] })] }),
				createVNode(_components.tr, { children: [createVNode(_components.td, { children: createVNode(_components.code, { children: "--border" }) }), createVNode(_components.td, { children: "Border color. Used for dividers and visual separation." })] })
			] })] })]
		}),
		"\n",
		createVNode(_components.p, { children: "Here is an example of changing the light color scheme:" }),
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
			"data-language": "css",
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
						children: "/* ... */"
					})
				}),
				"\n",
				createVNode(_components.span, {
					class: "line",
					children: [
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#C5E478"
							},
							children: ":"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C5E478",
								"--shiki-dark-font-style": "italic"
							},
							children: "root"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#212121",
								"--shiki-dark": "#C792EA"
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
								"--shiki-dark": "#C792EA"
							},
							children: "["
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-light-font-style": "inherit",
								"--shiki-dark": "#C5E478",
								"--shiki-dark-font-style": "italic"
							},
							children: "data-theme"
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
							children: "light"
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
								"--shiki-dark": "#C792EA"
							},
							children: "]"
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
								"--shiki-dark": "#C5E478"
							},
							children: "  --background"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "f6eee1"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "012c56"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --accent"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "e14a39"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --accent-foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "ffffff"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --muted"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "efd8b0"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --muted-foreground"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "6b7280"
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
								"--shiki-light": "#24292EFF",
								"--shiki-dark": "#C5E478"
							},
							children: "  --border"
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
							children: " #"
						}),
						createVNode(_components.span, {
							style: {
								"--shiki-light": "#1976D2",
								"--shiki-dark": "#FFEB95"
							},
							children: "dc9891"
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
							"--shiki-light": "#24292EFF",
							"--shiki-dark": "#D6DEEB"
						},
						children: "}"
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
						children: "/* ... */"
					})
				})
			] }), createVNode(_components.span, {
				class: "absolute py-1 text-foreground text-xs font-medium leading-4 pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2 left-2 top-(--file-name-offset) border rounded-md bg-background",
				children: "src/styles/theme.css"
			})]
		}),
		"\n",
		createVNode(_components.blockquote, { children: createVNode(_components.p, { children: [
			"Check out some ",
			createVNode(_components.a, {
				href: "https://astro-paper.pages.dev/posts/predefined-color-schemes/",
				children: "predefined color schemes"
			}),
			" AstroPaper has already crafted for you."
		] }) })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, {
		...props,
		children: createVNode(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
var url = "src/content/posts/customizing-astropaper-theme-color-schemes.mdx";
var file = "/Users/cakiphin/projects/cmsMu/astro-paper/src/content/posts/customizing-astropaper-theme-color-schemes.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/cakiphin/projects/cmsMu/astro-paper/src/content/posts/customizing-astropaper-theme-color-schemes.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
