import fs from 'fs';

const defaultHomePuck = {
  content: [
    { type: "SiteHeader", props: { id: "SiteHeader-1" } },
    { type: "Hero", props: { id: "Hero-1" } },
    { type: "FeatureGrid", props: { id: "FeatureGrid-1" } },
    { type: "Testimonial", props: { id: "Testimonial-1" } },
    { type: "RecentPosts", props: { id: "RecentPosts-1" } },
    { type: "CallToAction", props: { id: "CallToAction-1" } },
    { type: "SiteFooter", props: { id: "SiteFooter-1" } }
  ],
  root: { props: { title: "Beranda Utama" } },
  zones: {}
};

const sql = `UPDATE pages SET body = '${JSON.stringify(defaultHomePuck)}' WHERE slug = 'home';`;
fs.writeFileSync('update-home.sql', sql);
