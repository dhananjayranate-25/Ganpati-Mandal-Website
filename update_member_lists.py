with open('member.html', 'r', encoding='utf-8') as f:
    content = f.read()

lists_html = """
            <div class="lists-grid" style="margin-top: 30px;">
                <!-- My Niyojan List -->
                <div class="list-container">
                    <div class="list-header">
                        <h3>मी जोडलेले उत्सव नियोजन</h3>
                    </div>
                    <div style="flex:1; overflow-y:auto;" id="myNiyojanList">
                        <!-- load here -->
                    </div>
                </div>

                <!-- My Aarti List -->
                <div class="list-container">
                    <div class="list-header">
                        <h3>मी जोडलेली महाआरती</h3>
                    </div>
                    <div style="flex:1; overflow-y:auto;" id="myAartiList">
                        <!-- load here -->
                    </div>
                </div>
            </div>
"""

# Find where to insert it in member.html (if not already there)
target_str = '        </div>\n    </div>\n\n    <!-- Add Expense Modal -->'
if target_str in content:
    content = content.replace(target_str, '        </div>\n' + lists_html + '    </div>\n\n    <!-- Add Expense Modal -->')

js_functions = """
        async function loadMyData() {
            if(!currentUser) return;
            try {
                // Load Niyojan
                let res = await fetch(API_URL + '/api/niyojan');
                let data = await res.json();
                let myNiyojan = data.filter(d => d.addedBy === currentUser.name);
                let niyojanHtml = '';
                if(myNiyojan.length === 0) {
                    niyojanHtml = '<div class="empty-state">No Niyojan added by you.</div>';
                } else {
                    myNiyojan.forEach(n => {
                        niyojanHtml += `
                            <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div class="item-title">${n.title}</div>
                                    <div class="item-subtitle">${new Date(n.date).toLocaleDateString()} | ${n.time}</div>
                                </div>
                                <div>
                                    <button class="btn-action edit" onclick="editNiyojan('${n._id}', '${n.title.replace(/'/g, "\\'")}')" title="Rename"><i class="fas fa-edit"></i></button>
                                    <button class="btn-action delete" onclick="deleteNiyojan('${n._id}')" title="Delete"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        `;
                    });
                }
                document.getElementById('myNiyojanList').innerHTML = niyojanHtml;

                // Load Aarti
                res = await fetch(API_URL + '/api/aarti');
                data = await res.json();
                let myAarti = data.filter(d => d.addedBy === currentUser.name);
                let aartiHtml = '';
                if(myAarti.length === 0) {
                    aartiHtml = '<div class="empty-state">No Maha Aarti added by you.</div>';
                } else {
                    myAarti.forEach(a => {
                        aartiHtml += `
                            <div class="list-item" style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div class="item-title">${a.name}</div>
                                    <div class="item-subtitle">${new Date(a.date).toLocaleDateString()} | ${a.timeOfDay}</div>
                                </div>
                                <div>
                                    <button class="btn-action edit" onclick="editAarti('${a._id}', '${a.name.replace(/'/g, "\\'")}')" title="Rename"><i class="fas fa-edit"></i></button>
                                    <button class="btn-action delete" onclick="deleteAarti('${a._id}')" title="Delete"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        `;
                    });
                }
                document.getElementById('myAartiList').innerHTML = aartiHtml;
            } catch(e) {
                console.error(e);
            }
        }

        async function deleteNiyojan(id) {
            if(!confirm('Are you sure you want to delete this Niyojan?')) return;
            try {
                await fetch(API_URL + '/api/niyojan/' + id, { method: 'DELETE' });
                loadMyData();
            } catch(e) { alert('Error deleting niyojan'); }
        }

        async function deleteAarti(id) {
            if(!confirm('Are you sure you want to delete this Aarti?')) return;
            try {
                await fetch(API_URL + '/api/aarti/' + id, { method: 'DELETE' });
                loadMyData();
            } catch(e) { alert('Error deleting aarti'); }
        }

        async function editNiyojan(id, currentTitle) {
            const newTitle = prompt("Enter new title for Niyojan:", currentTitle);
            if(newTitle && newTitle !== currentTitle) {
                try {
                    await fetch(API_URL + '/api/niyojan/' + id, { 
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ title: newTitle })
                    });
                    loadMyData();
                } catch(e) { alert('Error renaming niyojan'); }
            }
        }

        async function editAarti(id, currentName) {
            const newName = prompt("Enter new name for Aarti:", currentName);
            if(newName && newName !== currentName) {
                try {
                    await fetch(API_URL + '/api/aarti/' + id, { 
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ name: newName })
                    });
                    loadMyData();
                } catch(e) { alert('Error renaming aarti'); }
            }
        }
"""
if 'async function loadMyData' not in content:
    content = content.replace('refreshData();', 'refreshData();\n                loadMyData();')
    content = content.replace('async function logExpense(e) {', js_functions + '\n        async function logExpense(e) {')
    
    # Update addNiyojan and addAarti to call loadMyData()
    content = content.replace("alert('Niyojan added successfully!');", "alert('Niyojan added successfully!'); loadMyData();")
    content = content.replace("alert('Maha Aarti added successfully!');", "alert('Maha Aarti added successfully!'); loadMyData();")
else:
    # If loadMyData is already there, meaning we run it before, just replace it entirely.
    import re
    content = re.sub(r'async function loadMyData.*\}', js_functions, content, flags=re.DOTALL)

with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated member.html with rename capability')
