import re

with open('member.html', 'r', encoding='utf-8') as f:
    content = f.read()

missing_js = """
        async function loadMyData() {
            try {
                // Fetch Niyojan
                let res = await fetch(API_URL + '/api/niyojan');
                let data = await res.json();
                if(data.success) {
                    let myNiyojan = data.niyojan.filter(n => n.addedBy === currentUser.name);
                    let niyojanHtml = '';
                    myNiyojan.forEach((n, index) => {
                        let formattedDate = new Date(n.date).toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                        let time12 = n.time;
                        if(n.time) {
                            let parts = n.time.split(':');
                            if(parts.length === 2) {
                                let h = parseInt(parts[0]);
                                let m = parts[1];
                                let ampm = h >= 12 ? 'PM' : 'AM';
                                h = h % 12 || 12;
                                time12 = `${h}:${m} ${ampm}`;
                            }
                        }
                        
                        niyojanHtml += `
                        <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #d4af37; padding: 15px; border-radius: 8px; margin-bottom: 15px; position:relative;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="color: #ffcc00; font-weight: bold;">${formattedDate}</span>
                                <span style="background: rgba(212,175,55,0.2); color: #ffeb3b; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem;"><i class="far fa-clock"></i> ${time12}</span>
                            </div>
                            <h3 style="color: #fff; margin: 0 0 5px 0; font-size: 1.1rem;">${n.title}</h3>
                            ${n.description ? `<p style="color: #ccc; font-size: 0.85rem; margin: 0 0 10px 0;">${n.description}</p>` : ''}
                            
                            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top:10px;">
                                <button class="btn btn-outline btn-small" onclick="editNiyojan('${n._id}', '${n.title.replace(/'/g, "\\'")}')"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn btn-small" style="background:#ff4444; color:white; border:none;" onclick="deleteNiyojan('${n._id}')"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                        `;
                    });
                    document.getElementById('myNiyojanList').innerHTML = niyojanHtml || '<p class="empty-state">अद्याप कोणतेही नियोजन जोडलेले नाही.</p>';
                }

                // Fetch Aarti
                res = await fetch(API_URL + '/api/aarti');
                data = await res.json();
                if(data.success) {
                    let myAarti = data.aarti.filter(a => a.addedBy === currentUser.name);
                    let aartiHtml = '';
                    myAarti.forEach((a, index) => {
                        let formattedDate = new Date(a.date).toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                        
                        aartiHtml += `
                        <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #ffcc00; padding: 15px; border-radius: 8px; margin-bottom: 15px; position:relative;">
                            <h3 style="color: #ffeb3b; margin: 0 0 10px 0; font-size: 1.1rem;">${a.name}</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #fff; font-size: 0.85rem; margin-bottom: 10px;">
                                <div><i class="far fa-calendar-alt" style="color: #d4af37;"></i> ${formattedDate}</div>
                                <div><i class="far fa-clock" style="color: #d4af37;"></i> ${a.timeOfDay}</div>
                                ${a.phone ? `<div style="grid-column: 1 / -1;"><i class="fas fa-phone-alt" style="color: #d4af37;"></i> ${a.phone}</div>` : ''}
                            </div>
                            ${a.pujaDetails ? `<div style="color: #ccc; font-size: 0.85rem; margin-bottom: 10px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">${a.pujaDetails}</div>` : ''}
                            
                            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top:10px;">
                                <button class="btn btn-outline btn-small" onclick="editAarti('${a._id}', '${a.name.replace(/'/g, "\\'")}')"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn btn-small" style="background:#ff4444; color:white; border:none;" onclick="deleteAarti('${a._id}')"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                        `;
                    });
                    document.getElementById('myAartiList').innerHTML = aartiHtml || '<p class="empty-state">अद्याप कोणतीही महाआरती जोडलेली नाही.</p>';
                }
            } catch(e) { console.error(e); }
        }

        async function deleteNiyojan(id) {
            if(!confirm('Are you sure you want to delete this?')) return;
            try {
                const res = await fetch(API_URL + '/api/niyojan/' + id, { method: 'DELETE' });
                const data = await res.json();
                if(data.success) {
                    alert('Deleted successfully');
                    loadMyData();
                } else alert('Error deleting');
            } catch(e) { alert('Server error'); }
        }

        async function deleteAarti(id) {
            if(!confirm('Are you sure you want to delete this?')) return;
            try {
                const res = await fetch(API_URL + '/api/aarti/' + id, { method: 'DELETE' });
                const data = await res.json();
                if(data.success) {
                    alert('Deleted successfully');
                    loadMyData();
                } else alert('Error deleting');
            } catch(e) { alert('Server error'); }
        }

        async function editNiyojan(id, oldName) {
            const newName = prompt('Enter new title for Niyojan:', oldName);
            if(!newName || newName === oldName) return;
            // For simplicity, we only update title here, but real edit could open a modal
            try {
                const res = await fetch(API_URL + '/api/niyojan/' + id, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ title: newName })
                });
                const data = await res.json();
                if(data.success) {
                    alert('Updated successfully');
                    loadMyData();
                } else alert('Error updating');
            } catch(e) { alert('Server error'); }
        }

        async function editAarti(id, oldName) {
            const newName = prompt('Enter new name for Aarti:', oldName);
            if(!newName || newName === oldName) return;
            try {
                const res = await fetch(API_URL + '/api/aarti/' + id, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name: newName })
                });
                const data = await res.json();
                if(data.success) {
                    alert('Updated successfully');
                    loadMyData();
                } else alert('Error updating');
            } catch(e) { alert('Server error'); }
        }
"""

content = content.replace('</script>', missing_js + '\n    </script>')
with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Injected loadMyData and delete/edit functions")
