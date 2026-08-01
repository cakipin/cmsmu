export const renderChatWidget = () => {
    return `
    <div id="chatmu-public-widget" x-data="{
        isOpen: false,
        msg: '',
        history: [],
        isLoading: false,
        
        async init() {
            this.isLoading = true;
            try {
                const res = await fetch('/chat-public/hello');
                if (!res.ok) throw new Error('Server error');
                const json = await res.json();
                this.history.push({sender: 'bot', text: json.reply});
            } catch(e) {
                this.history.push({sender: 'bot', text: '⚠️ Maaf, gagal terhubung ke server ChatMu.'});
            } finally {
                this.isLoading = false;
            }
        },

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
                
                if (!res.ok) throw new Error('Network error');
                const json = await res.json();
                this.history.push({sender: 'bot', text: json.reply});
                
                if(json.sources && json.sources.length > 0) {
                   this.history.push({sender: 'system', text: 'Sumber Referensi Web:<br>' + json.sources.join('<br>')});
                }
            } catch(e) {
                this.history.push({sender: 'bot', text: '⚠️ Maaf, saya sedang tidak bisa terhubung ke server.'});
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
                        box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
                    }
                }, 100);
            });
        },

        formatText(text, sender) {
            if (!text) return '';
            
            if (sender === 'system') return text;

            let str = String(text);
            
            str = str.replace(/\\n/g, '<br>');
            str = str.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
            str = str.replace(/<br>\\s*-\\s/g, '<br>• ');
            str = str.replace(/<br>\\s*\\*\\s/g, '<br>• ');
            str = str.replace(/<br>\\s*(\\d+\\.)\\s/g, '<br><strong>$1</strong> ');
            str = str.replace(/(<br>\\s*){3,}/g, '<br><br>');
            str = str.replace(/^(<br>\\s*)+/, '');
            
            return str;
        },

        copyText(text, btnEvent) {
            const cleanText = text.replace(/\\*\\*(.*?)\\*\\*/g, '$1');

            navigator.clipboard.writeText(cleanText).then(() => {
                const btn = btnEvent.currentTarget;
                const icon = btn.querySelector('i');
                const span = btn.querySelector('span');
                
                if(icon) icon.className = 'fas fa-check';
                if(span) span.innerText = 'Disalin!';
                btn.style.color = '#16a34a'; 
                
                setTimeout(() => { 
                    if(icon) icon.className = 'fas fa-copy'; 
                    if(span) span.innerText = 'Salin';
                    btn.style.color = '#9ca3af'; 
                }, 2000);
            }).catch(err => {
                alert('Gagal menyalin teks!');
            });
        }
    }" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif;">

        <button @click="isOpen = !isOpen; if(isOpen) scrollToBottom();" 
                style="width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg, #006C45, #1B3A57); color:white; border:none; box-shadow:0 4px 10px rgba(0,0,0,0.3); cursor:pointer; font-size:24px; display:flex; align-items:center; justify-content:center; transition: transform 0.2s;">
            <i class="fas" :class="isOpen ? 'fa-times' : 'fa-robot'"></i>
        </button>

        <div x-show="isOpen" 
             x-transition
             style="position:absolute; bottom:80px; right:0; width:350px; max-width:85vw; height:500px; max-height:calc(100vh - 120px); background:white; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.2); overflow:hidden; border:1px solid #ddd;">
            
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 55px; background:linear-gradient(90deg, #1B3A57, #006C45); padding: 0 15px; color:white; display:flex; align-items:center; gap:8px; font-weight:bold; z-index: 10;">
                <i class="fas fa-robot"></i> ChatMu AI
            </div>

            <div id="chat-public-history" style="position: absolute; top: 55px; bottom: 60px; left: 0; right: 0; overflow-y: auto; padding: 20px; background: #f9fafb; display: flex; flex-direction: column; gap: 24px;">
                
                <template x-for="chat in history">
                    <div style="display: flex; width: 100%;" :style="chat.sender === 'user' ? 'justify-content: flex-end;' : (chat.sender === 'system' ? 'justify-content: center;' : 'justify-content: flex-start;')">
                        
                        <div :style="chat.sender === 'user' ? 'background:#dcfce7; color:#166534; border-bottom-right-radius: 4px;' : (chat.sender === 'system' ? 'background:#f0fdf4; border:1px dashed #bbf7d0; color:#166534; text-align:center; font-size:12px;' : 'background:white; border:1px solid #e5e7eb; color:#1f2937; border-bottom-left-radius: 4px;')"
                             style="max-width:85%; padding:14px 16px; border-radius:12px; font-size:14px; line-height:1.6; box-shadow:0 2px 5px rgba(0,0,0,0.04); word-break: break-word; position: relative;">
                            
                            <div x-html="formatText(chat.text, chat.sender)"></div>
                            
                            <template x-if="chat.sender === 'bot'">
                                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #e5e7eb; display: flex; justify-content: flex-end;">
                                    <button @click="copyText(chat.text, $event)" title="Salin Jawaban" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 11px; color: #9ca3af; padding: 0; transition: color 0.2s;">
                                        <i class="fas fa-copy"></i> <span>Salin</span>
                                    </button>
                                </div>
                            </template>

                        </div>

                    </div>
                </template>

                <div x-show="isLoading" style="display: flex; justify-content: flex-start; width: 100%;">
                    <div style="font-size:12px; color:#6b7280; padding: 5px;">
                        <i class="fas fa-circle-notch fa-spin"></i> ChatMu sedang berpikir...
                    </div>
                </div>

            </div>

            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; padding: 10px; border-top: 1px solid #eee; background: white; display: flex; gap: 8px; z-index: 10;">
                <input type="text" x-model="msg" @keydown.enter="send()" placeholder="Tanya ChatMu..." style="flex:1; border:1px solid #ddd; padding:0 15px; border-radius:20px; outline:none; font-size:13px; height: 100%;">
                <button @click="send()" style="background:#006C45; color:white; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink: 0;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>

        </div>
    </div>
    `;
};