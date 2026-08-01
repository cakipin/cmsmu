import { renderHome } from './home';
import { renderSingle } from './single';
import { renderPage } from './page';
import { renderCategory } from './category';
import { render404 } from './404';
// [BARU] Import renderSearch
import { renderSearch } from './search';

const WikiMu = {
    id: 'wikimu',
    name: 'WikiMu Default',
    renderHome,
    renderSingle,
    renderPage,
    renderCategory,
    renderSearch, // [BARU] Daftarkan di sini
    render404
};

export default WikiMu;