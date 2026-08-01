import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV ? { kind: 'local' } : {
    kind: 'github',
    repo: 'cakipin/cmsmu',
  },
  ui: {
    brand: {
      name: 'CMS-Mu Admin',
    },
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        author: fields.text({ label: 'Author', defaultValue: 'Sat Naing' }),
        pubDatetime: fields.datetime({ label: 'Publish Date' }),
        modDatetime: fields.datetime({ label: 'Modified Date' }),
        featured: fields.checkbox({ label: 'Featured' }),
        draft: fields.checkbox({ label: 'Draft' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: props => props.value
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        content: fields.mdx({ 
          label: 'Content',
          options: {
            image: { directory: 'public/assets', publicPath: '/assets/' }
          }
        }),
      },
    }),
  },
});
