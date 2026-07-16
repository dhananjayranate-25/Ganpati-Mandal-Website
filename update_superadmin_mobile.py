with open('superadmin.html', 'r', encoding='utf-8') as f:
    content = f.read()

responsive_css = """
    /* Mobile Sidebar overlay */
    .menu-toggle {
        display: none;
        background: none;
        border: none;
        color: var(--primary);
        font-size: 1.5rem;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
        }
        .sidebar {
            position: fixed;
            left: -300px;
            top: 0;
            height: 100vh;
            z-index: 1000;
            transition: left 0.3s ease;
            box-shadow: 2px 0 10px rgba(0,0,0,0.5);
        }
        .sidebar.active {
            left: 0;
        }
        .main-content {
            padding: 10px;
        }
        .top-bar {
            padding: 10px;
        }
        .lists-grid {
            grid-template-columns: 1fr;
        }
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
        /* Overlay background when sidebar is open */
        .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }
        .sidebar-overlay.active {
            display: block;
        }
    }
"""

if 'Mobile Sidebar overlay' not in content:
    content = content.replace('</style>', responsive_css + '\n</style>')

new_top_bar = """<div class="top-bar">
            <div style="display: flex; align-items: center; gap: 15px;">
                <button class="menu-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
                <h2 id="selectedMemberName">सर्व मेंबर्स डॅशबोर्ड</h2>
            </div>
            <div id="selectedMemberBalance" style="font-size: 1.2rem; font-weight: bold; color: var(--primary);"></div>"""

if 'menu-toggle' not in content:
    old_top_bar = """<div class="top-bar">
            <h2 id="selectedMemberName">सर्व मेंबर्स डॅशबोर्ड</h2>
            <div id="selectedMemberBalance" style="font-size: 1.2rem; font-weight: bold; color: var(--primary);"></div>"""
    
    content = content.replace(old_top_bar, new_top_bar)
    
    # Add overlay element before sidebar
    content = content.replace('<div class="sidebar">', '<div class="sidebar-overlay" onclick="toggleSidebar()"></div>\n    <div class="sidebar" id="sidebar">')
    
    # Add toggleSidebar function
    js_func = """
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('active');
            document.querySelector('.sidebar-overlay').classList.toggle('active');
        }
        
        // Auto-close sidebar on mobile when a member is clicked
        function closeSidebarOnMobile() {
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
                document.querySelector('.sidebar-overlay').classList.remove('active');
            }
        }
    """
    content = content.replace('function loadDashboard() {', js_func + '\n\n        function loadDashboard() {')
    
    # Auto-close on member click
    content = content.replace('selectMember(user._id, user.name);', 'selectMember(user._id, user.name); closeSidebarOnMobile();')
    
    with open('superadmin.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated superadmin.html successfully')
else:
    print('Already updated')
