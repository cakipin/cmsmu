import { dashboardPage } from './dashboard.page';
import { postsPage } from './posts.page';
import { editorPage } from './editor.page';
import { mediaPage } from './media.page';
import { usersPage } from './users.page';
import { themesPage } from './themes.page';
import { settingsPage } from './settings.page';
import { menusPage } from './menus.page';
import { staticPage } from './static.page'; 

export const pagesBlock = `
    ${dashboardPage}
    ${postsPage}
    ${staticPage}     ${editorPage} 
    ${mediaPage}
    ${usersPage}
    ${themesPage}
    

    ${menusPage}
    ${settingsPage}  
`;