export const dashboardPage = `
<div x-show="view==='dash'">
  
  <div style="background:#fff; padding:30px; border-radius:8px; border-left:5px solid var(--wp-blue); box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:30px;">
     <h2 style="margin-top:0;">Selamat Datang di LabMu, Admin! 👋</h2>
     <p style="color:#666; margin-bottom:0;">Sistem berjalan normal. Siap untuk mempublikasikan ide-ide hebat hari ini?</p>
  </div>

  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px;">
      
      <div class="card" style="text-align:center; padding:30px; cursor:pointer; transition:transform 0.2s;" @click="view='posts'; loadPosts()">
        <div style="background:#eaf6ff; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px auto;">
            <i class="fas fa-pen-nib fa-2x" style="color:var(--wp-blue);"></i>
        </div>
        <h1 style="margin:0; font-size:3em; color:#333;" x-text="posts.length">0</h1>
        <small style="color:#888; text-transform:uppercase; font-weight:bold; letter-spacing:1px;">Articles</small>
      </div>
      
      <div class="card" style="text-align:center; padding:30px; cursor:pointer;" @click="view='themes'">
        <div style="background:#e8f8f5; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 15px auto;">
           <i class="fas fa-paint-brush fa-2x" style="color:#2ecc71;"></i>
        </div>
        <h3 style="margin:0">Theme</h3>
        <small style="color:#888;">Customize Look</small>
      </div>
  </div>
  
  <div style="margin-top:30px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
     <div class="card">
        <h4><i class="fas fa-server"></i> System Status</h4>
        <table style="width:100%; font-size:13px; color:#555;">
           <tr><td style="padding:5px 0;">Database</td><td style="text-align:right; color:green;">Connected (D1)</td></tr>
           <tr><td style="padding:5px 0;">Storage</td><td style="text-align:right; color:orange;">Disabled</td></tr>
           <tr><td style="padding:5px 0;">Version</td><td style="text-align:right;">LabMu v1.0.0</td></tr>
        </table>
     </div>
     <div class="card">
        <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
        <button @click="openEditor()" class="btn" style="width:100%; margin-bottom:10px;"><i class="fas fa-plus"></i> Tulis Artikel Baru</button>
        <a href="/" target="_blank" class="btn" style="width:100%; background:#333; text-align:center; text-decoration:none; display:block;"><i class="fas fa-external-link-alt"></i> Lihat Website</a>
     </div>
  </div>
</div>
`;