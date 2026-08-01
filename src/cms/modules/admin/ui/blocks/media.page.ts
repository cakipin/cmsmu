export const mediaPage = `
<div x-show="view === 'media'" class="animate-fade" 
     style="height: calc(100vh - 80px); display: flex; flex-direction: column; background: #fff; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;"
     x-init="loadMedia()">
    
    <div style="padding: 15px; border-bottom: 1px solid #ddd; background: #fff; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display:flex; align-items:center; gap: 15px;">
            <div style="font-weight: bold; font-size: 16px;">
                Media Library <span x-show="mediaList.length" x-text="'(' + mediaList.length + ')'" style="font-size:12px; color:#888;"></span>
            </div>
            
            <div x-show="selectedItems.length > 0" class="animate-fade" style="display:flex; gap:5px;">
                <button @click="deleteSelected()" :disabled="isDeleting" style="background:#ffecec; color:#d63384; border:1px solid #f5c6cb; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">
                    <i class="fas fa-trash"></i> Hapus (<span x-text="selectedItems.length"></span>)
                </button>
                <button @click="selectedItems = []; activeMediaItem = null;" style="background:#eee; border:1px solid #ddd; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">
                    Batal
                </button>
            </div>
        </div>

        <div style="display: flex; gap: 10px; align-items:center;">
             <button @click="toggleSelectAll()" style="font-size:12px; color:#2271b1; background:none; border:none; cursor:pointer; text-decoration:underline;">
                <span x-text="selectedItems.length === filteredMedia.length && filteredMedia.length > 0 ? 'Batal Pilih Semua' : 'Pilih Semua'"></span>
            </button>

            <input type="text" x-model="mediaSearchQuery" placeholder="Cari file..." 
                   style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; width: 200px;">
            
            <label class="btn btn-primary" style="cursor:pointer; display:flex; align-items:center; gap:5px; padding: 6px 12px; font-size: 13px;">
                <input type="file" multiple @change="uploadMedia($event)" style="display:none;">
                <i class="fas" :class="isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'"></i>
                <span x-text="isUploading ? '...' : 'Upload'"></span>
            </label>
        </div>
    </div>

    <div style="display: flex; flex: 1; overflow: hidden; height: 100%;">
        
        <div style="flex: 1; overflow-y: auto; padding: 20px; background: #fcfcfc; position: relative;">
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px; padding-bottom:50px;">
                <template x-for="m in filteredMedia" :key="m.id || m.key">
                    <div @click="toggleSelection(m)" 
                         style="position: relative; aspect-ratio: 1/1; cursor: pointer; background: #fff; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; transition: all 0.1s;"
                         :style="isSelected(m) ? 'box-shadow: 0 0 0 3px #2271b1; border-color: #2271b1; transform:scale(0.95);' : 'border-color: #ddd;'">
                        
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #eee;">
                            <img :src="m.url" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.src='https://placehold.co/100?text=Error'">
                        </div>

                        <div x-show="isSelected(m)" 
                             style="position: absolute; top: 5px; right: 5px; background: #2271b1; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            <i class="fas fa-check" style="color: white; font-size: 11px;"></i>
                        </div>
                        
                        <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.6); color:#fff; font-size:10px; padding:2px 5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" x-text="m.key.split('/').pop()"></div>
                    </div>
                </template>
            </div>

            <div x-show="filteredMedia.length === 0" style="text-align: center; padding: 50px; color: #888;">
                <p>Tidak ada media ditemukan.</p>
            </div>
        </div>

        <div x-show="activeMediaItem" 
             style="width: 300px; background: #f9f9f9; border-left: 1px solid #ddd; display: flex; flex-direction: column; flex-shrink: 0; height: 100%;"
             x-transition:enter="animate-fade">
            
            <div style="padding: 15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:12px;">DETAIL MEDIA</strong>
                <button @click="activeMediaItem=null; selectedItems=[]" style="border:none; background:none; cursor:pointer;"><i class="fas fa-times"></i></button>
            </div>

            <div style="flex:1; overflow-y:auto; padding:20px;">
                <template x-if="activeMediaItem">
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <img :src="activeMediaItem.url" style="width:100%; max-height:150px; object-fit:contain; background:#fff; border:1px solid #ddd; padding:5px;">
                        
                        <div style="font-size:11px; color:#666; word-break:break-all;">
                            <div x-text="activeMediaItem.key.split('/').pop()" style="font-weight:bold; margin-bottom:5px;"></div>
                            <div x-text="Math.round(activeMediaItem.size/1024) + ' KB'"></div>
                        </div>

                        <hr style="border:0; border-top:1px solid #ddd; width:100%;">

                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold; color:#d63384;">Rename File</label>
                            <input type="text" x-model="activeMediaMeta.filename" style="width:100%; padding:5px; border:1px solid #d63384; border-radius:3px; font-size:12px; background:#fff0f6;">
                        </div>

                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold;">Alt Text</label>
                            <input type="text" x-model="activeMediaMeta.alt" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:3px; font-size:12px;">
                        </div>
                        
                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold;">Judul</label>
                            <input type="text" x-model="activeMediaMeta.title" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:3px; font-size:12px;">
                        </div>

                        <div class="form-group">
                            <label style="font-size:11px; font-weight:bold;">Deskripsi</label>
                            <textarea x-model="activeMediaMeta.description" rows="3" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:3px; font-size:12px;"></textarea>
                        </div>

                        <button @click="saveMediaMeta()" class="btn btn-primary" :disabled="isSavingMeta" style="width:100%; font-size:12px; justify-content:center; margin-top:10px;">
                            <i class="fas fa-save"></i> <span x-text="isSavingMeta ? 'Menyimpan...' : 'Simpan Perubahan'"></span>
                        </button>
                    </div>
                </template>
            </div>
        </div>

    </div>
</div>
`;