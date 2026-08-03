import fs from 'fs';

let content = fs.readFileSync('src/components/ThemeEditorApp.tsx', 'utf-8');

// replace defaultHomePuck
content = content.replace(
  `            { type: "Hero", props: { id: "Hero-1" } },`,
  `            { type: "SiteHeader", props: { id: "SiteHeader-1" } },\n            { type: "Hero", props: { id: "Hero-1" } },`
);

content = content.replace(
  `            { type: "CallToAction", props: { id: "CallToAction-1" } }`,
  `            { type: "CallToAction", props: { id: "CallToAction-1" } },\n            { type: "SiteFooter", props: { id: "SiteFooter-1" } }`
);

fs.writeFileSync('src/components/ThemeEditorApp.tsx', content);
