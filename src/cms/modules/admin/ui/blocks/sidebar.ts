export const sidebarBlock = `
<aside class="sidebar" :class="!sidebarOpen ? 'collapsed' : ''">
  <div class="brand">
    <i class="fas fa-flask"></i> <span style="margin-left:12px;" x-show="sidebarOpen">LabMu CMS</span>
  </div>

  <nav style="flex:1; overflow-y:auto; overflow-x:hidden; padding-top:10px;">
    
    <a class="menu-item" :class="view=='dash'?'active':''" @click="view='dash'" title="Dashboard">
      <i class="fas fa-tachometer-alt"></i> <span class="menu-txt">Dashboard</span>
    </a>
    
    <template x-for="groupName in ['Content', 'Appearance', 'System', 'Plugins']">
        <div x-show="(window.adminMenus || []).some(m => m.group === groupName)">
            <div class="group-title" x-text="groupName"></div>
            
            <template x-for="menu in (window.adminMenus || []).filter(m => m.group === groupName)">
                <template x-if="!menu.role || menu.role.includes(userRole)">
                    <div>
                        <template x-if="!menu.href">
                            <a class="menu-item" 
                               :class="view == menu.view ? 'active' : ''" 
                               @click="view = menu.view; if(menu.action) menu.action()" 
                               :title="menu.title">
                                <i :class="menu.icon"></i> 
                                <span class="menu-txt" x-text="menu.title"></span>
                            </a>
                        </template>

                        <template x-if="menu.href">
                            <a :href="menu.href" class="menu-item" :title="menu.title">
                                <i :class="menu.icon"></i> 
                                <span class="menu-txt" x-text="menu.title"></span>
                            </a>
                        </template>
                    </div>
                </template>
            </template>
        </div>
    </template>

  </nav>

  <a class="menu-item" @click="logout()" style="border-top:1px solid #444; margin-top:auto; height:50px;" title="Logout">
    <i class="fas fa-sign-out-alt"></i> <span class="menu-txt">Logout</span>
  </a>
</aside>
`;