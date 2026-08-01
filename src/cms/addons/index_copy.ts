import { Hono } from 'hono';
import { Bindings } from '../types';
import { registerPluginMenu } from '../registry/admin-menu';

// Import Router Addons
import wpRouter from './wp-importer/wp.router';
import seoPlugin from './seo/router';
import chatRouter from './chat-ai/router'; // <--- 1. Import Router Baru

export default function registerAddons(app: Hono<{ Bindings: Bindings }>) {
  console.log('🔌 Registering Addons...');

  // --- MENU EKSISTING ---
  registerPluginMenu({ group: 'Plugins', title: 'Sync Tarjih', href: '/admin/tarjih-sync', icon: 'fas fa-sync-alt' });
  
  // SEOMu (Tetap seperti sebelumnya)
  registerPluginMenu({
    group: 'Plugins', 
    title: 'SEOMu Pro', 
    icon: 'fas fa-search-dollar',
    actionCode: `
        this.view = 'seomu';
        const viewId = 'plugin-view-seomu';
        if (!document.getElementById(viewId)) {
            const container = document.querySelector('main');
            const el = document.createElement('div');
            el.id = viewId;
            el.setAttribute('x-show', "view === 'seomu'");
            el.innerHTML = '<h1>SEOMu Dashboard</h1><p>Fitur SEO ada di sini...</p>'; // (Isi disingkat biar fokus ke chat)
            container.appendChild(el);
            if(window.Alpine) Alpine.initTree(el);
        }
    `
  });

  // --- 2. REGISTRASI CHAT AI (Floating Widget) ---
  // Kita tidak pakai menu sidebar, tapi inject langsung widget-nya
  registerPluginMenu({
    group: 'Plugins',
    title: 'ChatMu AI',
    icon: 'fas fa-robot',
    // actionCode ini akan dijalankan sekali saat klik menu, 
    // TAPI kita akan inject widgetnya agar selalu ada atau muncul saat diklik.
    actionCode: `
        const widgetId = 'chatmu-widget';
        
        // Cek jika widget sudah ada, toggle visibility
        let widget = document.getElementById(widgetId);
        if (widget) {
            // Toggle logic via Alpine data
            return; 
        }

        // Inject Widget ke Body (Floating)
        const body = document.body;
        const div = document.createElement('div');
        div.id = widgetId;
        div.setAttribute('x-data', \`{
            isOpen: true,
            msg: '',
            history: [{sender: 'bot', text: 'Assalamu\\'alaikum! Ada yang bisa saya bantu terkait CMS LabMu?'}],
            isLoading: false,
            
            async send() {
                if(!this.msg.trim()) return;
                
                // User Msg
                this.history.push({sender: 'user', text: this.msg});
                const txt = this.msg;
                this.msg = '';
                this.isLoading = true;
                
                // Scroll ke bawah
                this.$nextTick(() => { 
                    const chatBox = document.getElementById('chat-history-box');
                    chatBox.scrollTop = chatBox.scrollHeight;
                });

                try {
                    const res = await fetch('/api/chat/ask', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ message: txt })
                    });
                    const json = await res.json();
                    
                    this.history.push({sender: 'bot', text: json.reply});
                } catch(e) {
                    this.history.push({sender: 'bot', text: 'Error koneksi.'});
                } finally {
                    this.isLoading = false;
                    this.$nextTick(() => { 
                        const chatBox = document.getElementById('chat-history-box');
                        chatBox.scrollTop = chatBox.scrollHeight;
                    });
                }
            }
        }\`);
        
        div.innerHTML = \`
            <button @click="isOpen = !isOpen" 
                    style="position:fixed; bottom:20px; right:20px; width:60px; height:60px; border-radius:50%; background:#006C45; color:white; border:none; box-shadow:0 4px 10px rgba(0,0,0,0.3); z-index:9999; cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center;">
                <i class="fas" :class="isOpen ? 'fa-times' : 'fa-robot'"></i>
            </button>

            <div x-show="isOpen" 
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 translate-y-10"
                 x-transition:enter-end="opacity-100 translate-y-0"
                 x-transition:leave="transition ease-in duration-200"
                 x-transition:leave-start="opacity-100 translate-y-0"
                 x-transition:leave-end="opacity-0 translate-y-10"
                 style="position:fixed; bottom:90px; right:20px; width:350px; height:500px; background:white; border-radius:12px; box-shadow:0 5px 20px rgba(0,0,0,0.2); z-index:9999; display:flex; flex-direction:column; overflow:hidden; border:1px solid #ddd;">
                
                <div style="background:#006C45; padding:15px; color:white; font-weight:bold; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-robot"></i> ChatMu Assistant
                </div>

                <div id="chat-history-box" style="flex:1; padding:15px; overflow-y:auto; background:#f9f9f9; display:flex; flex-direction:column; gap:10px;">
                    <template x-for="chat in history">
                        <div :style="chat.sender === 'user' ? 'align-self:flex-end; background:#dcfce7; color:#166534;' : 'align-self:flex-start; background:white; border:1px solid #e5e7eb;'"
                             style="max-width:80%; padding:8px 12px; border-radius:8px; font-size:13px; line-height:1.4;">
                            <div x-text="chat.text"></div>
                        </div>
                    </template>
                    <div x-show="isLoading" style="font-size:12px; color:#888; font-style:italic;">
                        <i class="fas fa-spinner fa-spin"></i> Sedang mengetik...
                    </div>
                </div>

                <div style="padding:10px; border-top:1px solid #eee; background:white; display:flex; gap:10px;">
                    <input type="text" x-model="msg" @keydown.enter="send()" placeholder="Tanya sesuatu..." style="flex:1; border:1px solid #ddd; padding:8px; border-radius:4px; outline:none;">
                    <button @click="send()" style="background:#006C45; color:white; border:none; width:40px; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        \`;

        body.appendChild(div);
        if(window.Alpine) Alpine.initTree(div);
    `
  });

  // --- 3. LOAD ROUTE BACKEND ---
  app.route('/api/import/wp', wpRouter);
  app.route('/', seoPlugin);
  app.route('/api/chat', chatRouter); // <--- Register Route
}