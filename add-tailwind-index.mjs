import fs from 'fs';
let content = fs.readFileSync('src/cms/themes/labmu-pro/index.ts', 'utf-8');

// Ensure Tailwind is added for landing pages
if (!content.includes('tailwindcss.com')) {
    content = content.replace(
        `        \${isLandingPage ? '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">' : ''}`,
        `        \${isLandingPage ? '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">\\n        <script src="https://cdn.tailwindcss.com"></script>' : ''}`
    );
    fs.writeFileSync('src/cms/themes/labmu-pro/index.ts', content);
}
