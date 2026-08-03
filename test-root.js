const React = require('react');
const ReactDOMServer = require('react-dom/server');

const element = React.createElement('div', null, 
  React.createElement('script', { src: "https://cdn.tailwindcss.com" }),
  React.createElement('div', { className: "bg-red-500 w-10 h-10" })
);

console.log(ReactDOMServer.renderToString(element));
