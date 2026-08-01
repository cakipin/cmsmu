export const menusLogic = `
    // STATE VARIABEL
    menuList: [],
    menuForm: { id: null, label: '', url: '', order_num: 0 },
    isSavingMenu: false,

    // LOAD DATA
    async loadMenus() {
        if(!this.token) return;
        try {
            let res = await fetch('/api/menus', { headers: { 'Authorization': this.token } });
            let json = await res.json();
            this.menuList = json.data || [];
        } catch(e) {
            console.error('Gagal load menu', e);
        }
    },

    // SAVE DATA
    async saveMenu() {
        if(!this.menuForm.label || !this.menuForm.url) return alert('Label dan URL wajib diisi!');
        
        this.isSavingMenu = true;
        try {
            await fetch('/api/menus', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': this.token },
                body: JSON.stringify(this.menuForm)
            });
            
            // Reset Form & Reload
            this.menuForm = { id: null, label: '', url: '', order_num: 0 };
            this.loadMenus();
            alert('Menu Tersimpan!');
        } catch(e) {
            alert('Gagal menyimpan menu');
        } finally {
            this.isSavingMenu = false;
        }
    },

    // DELETE DATA
    async deleteMenu(id) {
        if(!confirm('Hapus menu ini?')) return;
        try {
            await fetch('/api/menus/' + id, { 
                method: 'DELETE', 
                headers: { 'Authorization': this.token } 
            });
            this.loadMenus();
        } catch(e) {}
    }
`;