import fs from 'fs';

let content = fs.readFileSync('src/cms/themes/labmu-pro/index.ts', 'utf-8');

content = content.replace(
  `        \${isLandingPage ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}`,
  ``
);

fs.writeFileSync('src/cms/themes/labmu-pro/index.ts', content);
