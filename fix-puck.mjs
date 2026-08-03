import fs from 'fs';

let configStr = fs.readFileSync('src/cms/themes/labmu-pro/puck/config.tsx', 'utf-8');

// Replace the SiteHeader and SiteFooter with the proper ones
const headerProps = `
  SiteHeader: {
    siteTitle: string;
    logoUrl: string;
    menuItems: { label: string; url: string }[];
  };
`;

const footerProps = `
  SiteFooter: {
    siteTitle: string;
    description: string;
    links: { label: string; url: string }[];
  };
`;

// we already have export type Props = ...
// let's just replace the whole file because it's easier and safer
