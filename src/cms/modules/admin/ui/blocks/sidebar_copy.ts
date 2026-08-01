export const sidebarBlock = `
<aside class="sidebar" :class="!sidebarOpen ? 'collapsed' : ''">
  <div class="brand">
    <i class="fas fa-flask"></i> <span style="margin-left:12px;">LabMu CMS</span>
  </div>

  <nav style="flex:1; overflow-y:auto; overflow-x:hidden; padding-top:10px;">
    
    <a class="menu-item" :class="view=='dash'?'active':''" @click="view='dash'" title="Dashboard">
      <i class="fas fa-tachometer-alt"></i> <span class="menu-txt">Dashboard</span>
    </a>
    
    <div class="group-title">Content</div>
    
    <a class="menu-item" :class="view=='posts'?'active':''" @click="view='posts'; if(typeof loadPosts === 'function') loadPosts()" title="All Posts">
      <i class="fas fa-thumbtack"></i> <span class="menu-txt">All Posts</span>
    </a>
    
    <a class="menu-item" :class="view=='add'?'active':''" @click="view='add'; window.editingId=null;" title="Add Post">
      <i class="fas fa-plus-circle"></i> <span class="menu-txt">Add Post</span>
    </a>

    <a class="menu-item" :class="view=='pages'?'active':''" @click="view='pages'; if(typeof loadPages === 'function') loadPages()" title="Static Pages">
      <i class="fas fa-copy"></i> <span class="menu-txt">Pages</span>
    </a>
    
    <a class="menu-item" :class="view=='add-page'?'active':''" @click="view='add-page'; window.editingPageId=null;" title="Add Page">
      <i class="fas fa-plus-square"></i> <span class="menu-txt">Add Page</span>
    </a>

    <a class="menu-item" :class="view=='media'?'active':''" @click="view='media'; if(typeof loadMedia === 'function') loadMedia()" title="Media">
      <i class="fas fa-photo-video"></i> <span class="menu-txt">Media</span>
    </a>
    
    <template x-if="['admin', 'editor'].includes(userRole)">
        <div>
            <div class="group-title">Appearance</div>
            <a class="menu-item" :class="view=='themes'?'active':''" @click="view='themes'" title="Themes">
            <i class="fas fa-paint-brush"></i> <span class="menu-txt">Themes</span>
            </a>
            <a class="menu-item" :class="view=='menus'?'active':''" @click="view='menus'" title="Menus">
            <i class="fas fa-bars"></i> <span class="menu-txt">Menus</span>
            </a>
        </div>
    </template>

    <template x-if="userRole === 'admin'">
        <div>
            <div class="group-title">System</div>
            <a class="menu-item" :class="view=='users'?'active':''" @click="view='users'; if(typeof loadUsers === 'function') loadUsers()" title="Users">
            <i class="fas fa-users"></i> <span class="menu-txt">Users</span>
            </a>
            <a class="menu-item" :class="view=='settings'?'active':''" @click="view='settings'" title="Settings">
            <i class="fas fa-cog"></i> <span class="menu-txt">Settings</span>
            </a>
        </div>
    </template>

    <div class="group-title">Plugins</div>
    <a class="menu-item" :class="view=='quran'?'active':''" @click="if(typeof loadQuranList === 'function') loadQuranList()" title="Quran Pro">
      <i class="fas fa-quran"></i> <span class="menu-txt">Quran Pro</span>
    </a>

    <a href="/admin/tarjih-sync" class="menu-item" title="Sync Tarjih" style="display:flex; align-items:center;">
       <i class="fas fa-sync-alt"></i> <span class="menu-txt">Sync Tarjih</span>
    </a>

  </nav>

  <a class="menu-item" @click="logout()" style="border-top:1px solid #444; margin-top:auto; height:50px;" title="Logout">
    <i class="fas fa-sign-out-alt"></i> <span class="menu-txt">Logout</span>
  </a>
</aside>
`;