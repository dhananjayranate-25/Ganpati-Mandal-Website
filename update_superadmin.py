with open('superadmin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a small subtitle to the top bar for Credentials
top_bar = '''
        <div class="top-bar">
            <div>
                <h2 id="dashboardTitle" style="margin-bottom: 5px;">Select a Member</h2>
                <div id="dashboardCreds" style="display:none; font-size: 0.85rem; color: #aaa;">
                    <i class="fas fa-user"></i> <span id="credUser"></span> &nbsp;|&nbsp; 
                    <i class="fas fa-key"></i> <span id="credPass"></span>
                </div>
            </div>
            <div id="dashboardActions" style="display:none; display: flex; gap: 10px;">
                <button class="btn btn-outline" onclick="openEditModal()"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger);" onclick="deleteMember()"><i class="fas fa-trash"></i> Delete</button>
                <button class="btn" onclick="openModal('addFundsModal')"><i class="fas fa-rupee-sign"></i> Add Funds</button>
            </div>
        </div>
'''

content = content.replace(
'''        <div class="top-bar">
            <h2 id="dashboardTitle">Select a Member</h2>
            <div id="dashboardActions" style="display:none;">
                <button class="btn" onclick="openModal('addFundsModal')"><i class="fas fa-rupee-sign"></i> Add Funds</button>
            </div>
        </div>''', top_bar.strip()
)

# Add Edit Member Modal
edit_modal = '''
    <!-- Edit Member Modal -->
    <div class="modal" id="editMemberModal">
        <div class="modal-content">
            <h3 class="modal-title">Edit Member</h3>
            <form onsubmit="editMember(event)">
                <input type="text" id="editMemName" class="form-control" placeholder="Full Name" required>
                <input type="text" id="editMemUser" class="form-control" placeholder="Username (for login)" required>
                <input type="text" id="editMemPass" class="form-control" placeholder="Password" required>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
                    <button type="button" class="btn btn-outline" onclick="closeModals()">Cancel</button>
                    <button type="submit" class="btn">Update</button>
                </div>
            </form>
        </div>
    </div>
'''
content = content.replace('<!-- Add Task Modal -->', edit_modal + '\n    <!-- Add Task Modal -->')

# Update JS to store member data and display it
content = content.replace('let selectedMemberId = null;', 'let selectedMemberId = null;\n        let selectedMemberData = null;')
content = content.replace(
'''            document.getElementById('dashboardTitle').innerText = name + "'s Dashboard";
            
            // Reload sidebar to show active state''',
'''            document.getElementById('dashboardTitle').innerText = name + "'s Dashboard";
            document.getElementById('dashboardActions').style.display = 'flex';
            
            // Reload sidebar to show active state'''
)

js_update = '''
                if(data.success) {
                    selectedMemberData = data.user;
                    document.getElementById('statTotalFunds').innerText = '₹' + data.user.totalFunds;
                    document.getElementById('statTotalSpent').innerText = '₹' + data.user.totalSpent;
                    document.getElementById('statBalance').innerText = '₹' + data.user.balance;
                    
                    document.getElementById('dashboardCreds').style.display = 'block';
                    document.getElementById('credUser').innerText = data.user.username;
                    document.getElementById('credPass').innerText = data.user.password;
                }
'''
content = content.replace(
'''                if(data.success) {
                    document.getElementById('statTotalFunds').innerText = '₹' + data.user.totalFunds;
                    document.getElementById('statTotalSpent').innerText = '₹' + data.user.totalSpent;
                    document.getElementById('statBalance').innerText = '₹' + data.user.balance;
                }''', js_update
)

js_functions = '''
        function openEditModal() {
            if(!selectedMemberData) return;
            document.getElementById('editMemName').value = selectedMemberData.name;
            document.getElementById('editMemUser').value = selectedMemberData.username;
            document.getElementById('editMemPass').value = selectedMemberData.password;
            openModal('editMemberModal');
        }

        async function editMember(e) {
            e.preventDefault();
            if(!selectedMemberId) return;
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/api/portal/users/' + selectedMemberId, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: document.getElementById('editMemName').value,
                        username: document.getElementById('editMemUser').value,
                        password: document.getElementById('editMemPass').value
                    })
                });
                const data = await res.json();
                if(data.success) {
                    closeModals();
                    document.getElementById('dashboardTitle').innerText = data.user.name + "'s Dashboard";
                    loadMembers();
                    refreshMemberData();
                } else alert(data.message);
            } catch(err) { alert('Error updating member'); }
            btn.disabled = false;
        }

        async function deleteMember() {
            if(!selectedMemberId) return;
            if(!confirm("Are you sure you want to delete this member? All their tasks and expenses will also be deleted!")) return;
            
            try {
                const res = await fetch(API_URL + '/api/portal/users/' + selectedMemberId, { method: 'DELETE' });
                const data = await res.json();
                if(data.success) {
                    selectedMemberId = null;
                    selectedMemberData = null;
                    document.getElementById('noSelection').style.display = 'block';
                    document.getElementById('memberDashboard').style.display = 'none';
                    document.getElementById('dashboardActions').style.display = 'none';
                    document.getElementById('dashboardCreds').style.display = 'none';
                    document.getElementById('dashboardTitle').innerText = 'Select a Member';
                    loadMembers();
                } else alert(data.message);
            } catch(err) { alert('Error deleting member'); }
        }
'''
content = content.replace('async function addFunds(e) {', js_functions + '\n        async function addFunds(e) {')

with open('superadmin.html', 'w', encoding='utf-8') as f:
    f.write(content)
