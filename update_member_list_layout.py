import re

with open('member.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Niyojan List JS
new_niyojan_js = """
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
"""

# Replace Aarti List JS
new_aarti_js = """
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
"""

content = re.sub(r'myNiyojan\.forEach\(n => \{.*?\n\s*\}\);', new_niyojan_js.strip(), content, flags=re.DOTALL)
content = re.sub(r'myAarti\.forEach\(a => \{.*?\n\s*\}\);', new_aarti_js.strip(), content, flags=re.DOTALL)

with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated member.html lists to match cards layout')
