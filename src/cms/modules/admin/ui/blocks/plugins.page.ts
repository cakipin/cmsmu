export const pluginsPage = `
<div x-show="view==='plugins'">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
    <h2>Plugins</h2>
    <button class="btn" style="background:#f0f0f1; color:#333; border:1px solid #ccc;">Upload Plugin (Pro)</button>
  </div>

  <div style="display:flex; flex-direction:column; gap:15px;">
     <template x-for="p in availablePlugins">
        <div class="card" style="display:flex; align-items:center; padding:15px; border:1px solid #dcdcde; background:#fff; box-shadow:0 1px 2px rgba(0,0,0,0.05); border-left: 4px solid #fff;" :style="p.active ? 'border-left-color: #2271b1;' : 'border-left-color: transparent;'">
           
           <div style="flex:1;">
               <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                   <h3 x-text="p.name" style="margin:0; font-size:16px; color:#2271b1;"></h3>
                   <span x-show="p.active" style="background:#e5f5fa; color:#007cba; padding:2px 6px; font-size:11px; font-weight:bold; border-radius:3px; border:1px solid #8ccbf2;">Active</span>
               </div>
               <div style="font-size:13px; color:#555; margin-bottom:5px;">
                   <p x-text="p.description" style="margin:0;"></p>
               </div>
               <div style="font-size:12px; color:#666;">
                   Version <span x-text="p.version"></span> | By <span x-text="p.author"></span>
               </div>
           </div>

           <div style="display:flex; gap:10px; flex-shrink:0;">
               <button x-show="!p.active" @click="togglePlugin(p.id, true)" class="btn" style="padding:5px 12px; font-size:13px; border:1px solid #2271b1; background:#f6f7f7; color:#2271b1;">Activate</button>
               <button x-show="p.active" @click="togglePlugin(p.id, false)" class="btn" style="padding:5px 12px; font-size:13px; border:1px solid #dcdcde; background:#f6f7f7; color:#d63638;">Deactivate</button>
               <button @click="deletePlugin(p.id)" class="btn" style="padding:5px 12px; font-size:13px; border:1px solid #dcdcde; background:#f6f7f7; color:#d63638;">Delete</button>
           </div>
        </div>
     </template>

     <template x-if="availablePlugins.length === 0">
         <div style="padding: 30px; text-align: center; color: #666; border: 1px dashed #ccc; background: #fafafa;">
             <p>No plugins installed.</p>
         </div>
     </template>
  </div>
</div>
`;
