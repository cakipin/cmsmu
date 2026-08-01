export const topbarBlock = `
<header class="topbar">
  <div style="display:flex; align-items:center; gap:15px;">
    <button @click="sidebarOpen = !sidebarOpen" class="btn-icon"><i class="fas fa-bars"></i></button>
    <b x-text="getPageTitle()" style="font-size:16px;"></b>
    
    <a href="/" target="_blank" class="btn" style="padding: 4px 10px; font-size:11px; display:flex; align-items:center; gap:5px; text-decoration:none; background:#fff; color:#2271b1; border-color:#2271b1;">
      <i class="fas fa-home"></i> View Site
    </a>
  </div>
  
  <div style="display:flex; align-items:center; gap:10px;">
    <div style="text-align:right;">
        <div style="font-weight:bold; font-size:12px;">Admin</div>
        <div style="font-size:10px; color:#888;">Online</div>
    </div>
    <i class="fas fa-user-circle fa-2x" style="color:#ccc;"></i>
  </div>
</header>
`;