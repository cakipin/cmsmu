export const customEditorTemplate = `
<div x-data="customEditorLogic()" 
     x-init="initEditor(form.body)" 
     class="custom-editor-container" 
     style="display: flex; flex-direction: column; position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: 1px solid #c3c4c7; border-radius: 4px; background: #fff;">
    
    <!-- WP Classic Style Toolbar -->
    <div class="editor-toolbar" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 8px; background: #f0f0f1; border-bottom: 1px solid #c3c4c7; border-radius: 4px 4px 0 0;">
        <select @change="execCmd('formatBlock', $event.target.value); $event.target.value=''" class="editor-select" title="Format" style="padding: 4px; border: 1px solid #8c8f94; border-radius: 3px; background: #fff; cursor: pointer;">
            <option value="">Paragraph</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
            <option value="H4">Heading 4</option>
            <option value="BLOCKQUOTE">Quote</option>
        </select>
        
        <div class="toolbar-divider" style="width: 1px; background: #c3c4c7; margin: 0 4px;"></div>

        <button @click="execCmd('bold')" class="editor-btn" :class="{'active': activeFormats.bold}" title="Bold"><i class="fas fa-bold"></i></button>
        <button @click="execCmd('italic')" class="editor-btn" :class="{'active': activeFormats.italic}" title="Italic"><i class="fas fa-italic"></i></button>
        <button @click="execCmd('underline')" class="editor-btn" :class="{'active': activeFormats.underline}" title="Underline"><i class="fas fa-underline"></i></button>
        <button @click="execCmd('strikeThrough')" class="editor-btn" :class="{'active': activeFormats.strikeThrough}" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
        
        <div class="toolbar-divider" style="width: 1px; background: #c3c4c7; margin: 0 4px;"></div>
        
        <button @click="execCmd('insertUnorderedList')" class="editor-btn" :class="{'active': activeFormats.ul}" title="Bulleted List"><i class="fas fa-list-ul"></i></button>
        <button @click="execCmd('insertOrderedList')" class="editor-btn" :class="{'active': activeFormats.ol}" title="Numbered List"><i class="fas fa-list-ol"></i></button>
        
        <div class="toolbar-divider" style="width: 1px; background: #c3c4c7; margin: 0 4px;"></div>
        
        <button @click="execCmd('justifyLeft')" class="editor-btn" :class="{'active': activeFormats.alignLeft}" title="Align Left"><i class="fas fa-align-left"></i></button>
        <button @click="execCmd('justifyCenter')" class="editor-btn" :class="{'active': activeFormats.alignCenter}" title="Align Center"><i class="fas fa-align-center"></i></button>
        <button @click="execCmd('justifyRight')" class="editor-btn" :class="{'active': activeFormats.alignRight}" title="Align Right"><i class="fas fa-align-right"></i></button>

        <div class="toolbar-divider" style="width: 1px; background: #c3c4c7; margin: 0 4px;"></div>
        
        <!-- Link Dropdown Wrapper -->
        <div style="position:relative; display:inline-block;">
            <button @click="promptLink()" class="editor-btn" :class="{'active': linkModalOpen}" title="Add Link"><i class="fas fa-link"></i></button>
            
            <!-- Dropdown Popover muncul di bawah tombol -->
            <div x-show="linkModalOpen" x-cloak
                 @keydown.escape.window="closeLinkModal()"
                 style="position:absolute; top:calc(100% + 6px); left:0; z-index:9999; background:#fff; border:1px solid #c3c4c7; border-radius:6px; padding:12px; width:280px; box-shadow:0 4px 15px rgba(0,0,0,0.15);">
                <div style="font-size:12px; font-weight:600; color:#1d2327; margin-bottom:8px;">Masukkan URL</div>
                <input x-model="linkUrl" @keydown.enter="confirmLinkModal()" type="url" placeholder="https://example.com"
                       style="width:100%; padding:7px 9px; border:1px solid #8c8f94; border-radius:3px; font-size:13px; box-sizing:border-box; outline:none;"
                       onfocus="this.style.borderColor='#2271b1'" onblur="this.style.borderColor='#8c8f94'">
                <div style="display:flex; gap:6px; margin-top:8px;">
                    <button @click="closeLinkModal()" style="flex:1; padding:6px; background:#f0f0f1; border:1px solid #c3c4c7; border-radius:3px; cursor:pointer; font-size:12px;">Batal</button>
                    <button @click="confirmLinkModal()" style="flex:2; padding:6px; background:#2271b1; color:#fff; border:none; border-radius:3px; cursor:pointer; font-size:12px; font-weight:600;">Tambah Link</button>
                </div>
            </div>
        </div>
        <button @click="execCmd('unlink')" class="editor-btn" title="Remove Link"><i class="fas fa-unlink"></i></button>
        
        <div class="toolbar-divider" style="width: 1px; background: #c3c4c7; margin: 0 4px;"></div>
        
        <button @click="openMediaManager()" class="editor-btn action-btn" title="Add Media" style="display: flex; gap: 6px; align-items: center;">
            <i class="fas fa-photo-video"></i> <span>Add Media</span>
        </button>
    </div>

    <!-- The ContentEditable Editor -->
    <div x-ref="editor" 
         contenteditable="true" 
         class="modern-editor-content"
         style="min-height: 400px; padding: 20px; outline: none; font-size: 16px; line-height: 1.6; color: #2c3338; background: #fff; overflow-y: auto; max-height: 700px;"
         @mouseup="checkSelection" 
         @keyup="checkSelection(); updateContent()"
         @input="updateContent()"
         @keydown.enter="handleEnter">
    </div>

    <!-- Image Context Menu -->
    <div x-show="imageMenuOpen" 
         x-cloak
         style="position: absolute; z-index: 50; background: #fff; border: 1px solid #c3c4c7; border-radius: 4px; padding: 4px; display: flex; gap: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"
         :style="'top: ' + imageMenuPos.top + '; left: ' + imageMenuPos.left">
         <button @click.prevent="alignImage('left')" type="button" class="editor-btn" title="Float Left"><i class="fas fa-align-left"></i></button>
         <button @click.prevent="alignImage('center')" type="button" class="editor-btn" title="Center"><i class="fas fa-align-center"></i></button>
         <button @click.prevent="alignImage('right')" type="button" class="editor-btn" title="Float Right"><i class="fas fa-align-right"></i></button>
         <div class="toolbar-divider" style="width: 1px; background: #c3c4c7; margin: 0 4px;"></div>
         <button @click.prevent="alignImage('none')" type="button" class="editor-btn" title="Reset"><i class="fas fa-times"></i></button>
         <button @click.prevent="removeImage()" type="button" class="editor-btn" style="color:#dc2626;" title="Hapus"><i class="fas fa-trash"></i></button>
    </div>

    <style>
        .editor-btn {
            padding: 6px 10px; color: #3c434a; background: transparent; border: 1px solid transparent; border-radius: 3px; cursor: pointer;
            transition: all 0.1s; font-size: 14px; display: flex; align-items: center; justify-content: center;
        }
        .editor-btn:hover { background: #fff; border-color: #8c8f94; box-shadow: inset 0 1px 2px rgba(0,0,0,0.04); }
        .editor-btn.active { background: #edeff0; border-color: #8c8f94; color: #135e96; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); }
        
        .action-btn { font-weight: 500; color: #135e96; }
        .action-btn:hover { color: #0a4b78; }

        .modern-editor-content { font-family: inherit; }
        .modern-editor-content h2 { font-size: 1.8em; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.5em; line-height: 1.3; color: #1d2327; }
        .modern-editor-content h3 { font-size: 1.5em; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.5em; line-height: 1.3; color: #1d2327; }
        .modern-editor-content h4 { font-size: 1.2em; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; line-height: 1.3; color: #1d2327; }
        .modern-editor-content p { margin-bottom: 1em; }
        .modern-editor-content blockquote { border-left: 4px solid #72aee6; padding-left: 16px; color: #50575e; font-style: italic; margin: 1.5em 0; background: #f6f7f7; padding: 12px 16px; }
        .modern-editor-content a { color: #2271b1; text-decoration: underline; }
        .modern-editor-content a:hover { color: #135e96; }
        .modern-editor-content img { max-width: 100%; height: auto; border-radius: 4px; margin: 1em 0; display: block; }
        .modern-editor-content ul { list-style-type: disc; padding-left: 24px; margin-bottom: 1em; }
        .modern-editor-content ol { list-style-type: decimal; padding-left: 24px; margin-bottom: 1em; }
        .modern-editor-content:empty:before { content: 'Mulai menulis atau ketik / untuk memilih blok'; color: #8c8f94; pointer-events: none; display: block; }
    </style>

</div>
`;

export const customEditorLogicScript = `
function customEditorLogic() {
    return {
        activeFormats: { 
            bold: false, italic: false, underline: false, strikeThrough: false,
            ul: false, ol: false, alignLeft: false, alignCenter: false, alignRight: false 
        },
        savedSelection: null,
        linkModalOpen: false,
        linkUrl: '',
        
        selectedImage: null,
        imageMenuOpen: false,
        imageMenuPos: { top: 0, left: 0 },
        
        initEditor(initialContent) {
            this.$watch('form.body', (val) => {
                if(this.$refs.editor.innerHTML !== val && document.activeElement !== this.$refs.editor) {
                    this.$refs.editor.innerHTML = val || '<p><br></p>';
                }
            });
            setTimeout(() => {
                if (this.$refs.editor && !this.$refs.editor.innerHTML.trim()) {
                    this.$refs.editor.innerHTML = initialContent || '<p><br></p>';
                }
            }, 100);
            
            // Image click listener for context menu
            this.$refs.editor.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG') {
                    this.selectedImage = e.target;
                    const rect = e.target.getBoundingClientRect();
                    const containerRect = this.$refs.editor.getBoundingClientRect();
                    this.imageMenuPos = {
                        top: (rect.top - containerRect.top + this.$refs.editor.scrollTop + 10) + 'px',
                        left: (rect.left - containerRect.left + 10) + 'px'
                    };
                    this.imageMenuOpen = true;
                } else {
                    this.imageMenuOpen = false;
                    this.selectedImage = null;
                }
            });
            
            // Listen for image insertion from Media Manager (kita perlu trigger dari luar)
            window.addEventListener('insert-media', (e) => {
                const url = e.detail.url;
                if(url) {
                    this.restoreSelection();
                    const imgHtml = \`<img src="\${url}" alt="Image" />\`;
                    document.execCommand('insertHTML', false, imgHtml);
                    this.updateContent();
                }
            });
        },
        
        updateContent() {
            this.form.body = this.$refs.editor.innerHTML;
        },
        
        checkSelection() {
            this.updateActiveFormats();
            this.saveSelection();
            if (this.imageMenuOpen && window.getSelection().toString().length > 0) {
                this.imageMenuOpen = false;
                this.selectedImage = null;
            }
        },
        
        updateActiveFormats() {
            this.activeFormats = {
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikeThrough: document.queryCommandState('strikeThrough'),
                ul: document.queryCommandState('insertUnorderedList'),
                ol: document.queryCommandState('insertOrderedList'),
                alignLeft: document.queryCommandState('justifyLeft'),
                alignCenter: document.queryCommandState('justifyCenter'),
                alignRight: document.queryCommandState('justifyRight')
            };
        },
        
        execCmd(command, value = null) {
            this.restoreSelection();
            if (command === 'formatBlock') {
                document.execCommand(command, false, \`<\${value}>\`);
            } else {
                document.execCommand(command, false, value);
            }
            this.updateActiveFormats();
            this.updateContent();
            this.$refs.editor.focus();
        },
        
        promptLink() {
            this.saveSelection(); // simpan posisi cursor sebelum focus pindah ke input
            this.linkUrl = '';
            this.linkModalOpen = true;
            // auto focus input setelah render
            this.$nextTick(() => {
                const inp = this.$el.querySelector('input[type="url"]');
                if (inp) inp.focus();
            });
        },
        
        closeLinkModal() {
            this.linkModalOpen = false;
            this.linkUrl = '';
        },
        
        confirmLinkModal() {
            if (this.linkUrl) {
                this.restoreSelection();
                document.execCommand('createLink', false, this.linkUrl);
                this.updateContent();
            }
            this.linkModalOpen = false;
        },

        openMediaManager() {
            this.saveSelection(); // Ensure we know where to insert
            
            // Trigger the media manager modal inside Alpine parent
            // We can dispatch a custom event that editor.page.ts listens to
            window.dispatchEvent(new CustomEvent('open-editor-media'));
        },

        handleEnter(e) {
            // Default behavior for contenteditable usually handles paragraph breaks nicely in modern browsers
            this.updateContent();
        },
        
        alignImage(pos) {
            if (!this.selectedImage) return;
            this.selectedImage.style.float = '';
            this.selectedImage.style.display = '';
            this.selectedImage.style.margin = '';
            
            if (pos === 'left') {
                this.selectedImage.style.float = 'left';
                this.selectedImage.style.margin = '0 1em 1em 0';
            } else if (pos === 'right') {
                this.selectedImage.style.float = 'right';
                this.selectedImage.style.margin = '0 0 1em 1em';
            } else if (pos === 'center') {
                this.selectedImage.style.display = 'block';
                this.selectedImage.style.margin = '1em auto';
            }
            this.updateContent();
        },
        
        removeImage() {
            if (!this.selectedImage) return;
            this.selectedImage.remove();
            this.imageMenuOpen = false;
            this.selectedImage = null;
            this.updateContent();
        },
        
        saveSelection() {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                this.savedSelection = sel.getRangeAt(0);
            }
        },
        restoreSelection() {
            if (this.savedSelection) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(this.savedSelection);
            } else {
                this.$refs.editor.focus();
            }
        }
    };
}
`;

