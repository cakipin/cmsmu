export const renderChatWidget = () => {
    return `
    <div id="chatmu-public-widget" x-data="{
        isOpen: false,
        msg: '',
        history: [{sender: 'bot', text: 'Assalamu\\'alaikum! Saya ChatMu. Ada yang bisa saya bantu terkait artikel di web ini?'}],
        isLoading: false,
        
        async send() {
            if(!this.msg.trim()) return;
            this.history.push({sender: 'user', text: this.msg});
            const txt = this.msg;
            this.msg = '';
            this.isLoading = true;
            this.scrollToBottom();

            try {
                const res = await fetch('/chat-public/ask', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ message: txt })
                });
                const json = await res.json();
                this.history.push({sender: 'bot', text: json.reply});
                
                if(json.sources && json.sources.length > 0) {
                   this.history.push({sender: 'system', text: 'Sumber referensi: ' + json.sources.join(', ')});
                }
            } catch(e) {
                this.history.push({sender: 'bot', text: 'Maaf, saya sedang tidak bisa terhubung ke server.'});
            } finally {
                this.isLoading = false;
                this.scrollToBottom();
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                setTimeout(() => {
                    const box = document.getElementById('chat-public-history');
                    if(box) {
                        box.scrollTo({
                            top: box.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
        }
    }" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif;">

        <button @click="isOpen = !isOpen; if(isOpen) scrollToBottom();" 
                style="width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg, #006C45, #1B3A57); color:white; border:none; box-shadow:0 4px 10px rgba(0,0,0,0.3); cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center; transition: transform 0.2s;">
            <i class="fas" :class="isOpen ? 'fa-times' : 'fa-robot'"></i>
        </button>

        <div x-show="isOpen" 
             x-transition
             style="position:absolute; bottom:80px; right:0; width:350px; max-width:85vw; height:500px; max-height:calc(100vh - 120px); background:white; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); overflow:hidden; border:1px solid #ddd;">
            
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 55px; background:linear-gradient(90deg, #1B3A57, #006C45); padding: 0 15px; color:white; display:flex; align-items:center; gap:8px; font-weight:bold; z-index: 10;">
                <i class="fas fa-robot"></i> ChatMu AI
            </div>

            <div id="chat-public-history" style="position: absolute; top: 55px; bottom: 60px; left: 0; right: 0; overflow-y: auto; padding: 15px; background: #f9fafb;">
                
                <template x-for="chat in history">
                    <div style="display: flex; margin-bottom: 12px;" :style="chat.sender === 'user' ? 'justify-content: flex-end;' : (chat.sender === 'system' ? 'justify-content: center;' : 'justify-content: flex-start;')">
                        
                        <div :style="chat.sender === 'user' ? 'background:#dcfce7; color:#166534;' : (chat.sender === 'system' ? 'background:none; color:#6b7280; font-size:11px; font-style:italic; box-shadow:none;' : 'background:white; border:1px solid #e5e7eb; color:#1f2937;')"
                             style="max-width:85%; padding:10px 12px; border-radius:8px; font-size:13px; line-height:1.5; box-shadow:0 1px 2px rgba(0,0,0,0.05); word-break: break-word;">
                            <div x-html="chat.text"></div>
                        </div>

                    </div>
                </template>

                <div x-show="isLoading" style="display: flex; justify-content: flex-start; margin-bottom: 12px;">
                    <div style="font-size:12px; color:#6b7280; padding: 5px;">
                        <i class="fas fa-circle-notch fa-spin"></i> Mengetik...
                    </div>
                </div>

            </div>

            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; padding: 10px; border-top: 1px solid #eee; background: white; display: flex; gap: 8px; z-index: 10;">
                <input type="text" x-model="msg" @keydown.enter="send()" placeholder="Tanya sesuatu..." style="flex:1; border:1px solid #ddd; padding:0 15px; border-radius:20px; outline:none; font-size:13px; height: 100%;">
                <button @click="send()" style="background:#006C45; color:white; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink: 0;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>

        </div>
    </div>
    `;
};