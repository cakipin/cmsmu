import { renderToString } from 'react-dom/server';
import { Puck } from '@puckeditor/core';
import { puckConfig } from './src/cms/themes/labmu-pro/puck/config.tsx';

const html = renderToString(<Puck config={puckConfig as any} data={{}} onPublish={() => {}} />);
console.log(html.includes('Publish') || html.includes('publish'));
