import fs from 'fs';

let content = fs.readFileSync('src/pages/theme-editor.astro', 'utf-8');

// If there's no tailwind, add it with preflight false
if (!content.includes('tailwindcss.com')) {
  content = content.replace(
    `</head>`,
    `  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      corePlugins: {
        preflight: false,
      }
    }
  </script>
</head>`
  );
  fs.writeFileSync('src/pages/theme-editor.astro', content);
}
