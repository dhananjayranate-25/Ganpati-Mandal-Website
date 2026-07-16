import re

def fix_html_file(filename, prefix):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace the Niyojan Form HTML
    niyojan_pattern = r'<form onsubmit="addNiyojan\(event\)".*?</form>'
    new_niyojan_form = f"""<form onsubmit="addNiyojan(event)">
                            <div class="form-grid">
                                <div class="form-group floating-label">
                                    <input type="date" id="{prefix}NiyojanDate" placeholder=" " required>
                                    <label for="{prefix}NiyojanDate">तारीख</label>
                                </div>
                                <div class="form-group floating-label">
                                    <input type="time" id="{prefix}NiyojanTime" placeholder=" " required>
                                    <label for="{prefix}NiyojanTime">वेळ</label>
                                </div>
                                <div class="form-group floating-label" style="grid-column: 1 / -1;">
                                    <input type="text" id="{prefix}NiyojanTitle" placeholder=" " required>
                                    <label for="{prefix}NiyojanTitle">कार्यक्रमाचे नाव</label>
                                </div>
                                <div class="form-group floating-label" style="grid-column: 1 / -1;">
                                    <textarea id="{prefix}NiyojanDesc" placeholder=" " rows="3"></textarea>
                                    <label for="{prefix}NiyojanDesc">अधिक माहिती (पर्यायी)</label>
                                </div>
                            </div>
                            <button type="submit" class="btn" style="width: 100%; margin-top: 15px; padding: 12px; font-size: 1.1rem; border-radius: 8px;">नियोजन जोडा</button>
                        </form>"""
    content = re.sub(niyojan_pattern, new_niyojan_form, content, flags=re.DOTALL)
    
    # 2. Replace the Aarti Form HTML
    aarti_pattern = r'<form onsubmit="addAarti\(event\)".*?</form>'
    new_aarti_form = f"""<form onsubmit="addAarti(event)" class="form-grid">
                            <div class="form-group floating-label">
                                <input type="text" id="{prefix}AartiName" placeholder=" " required>
                                <label for="{prefix}AartiName">नाव</label>
                            </div>
                            <div class="form-group floating-label">
                                <input type="date" id="{prefix}AartiDate" placeholder=" " required>
                                <label for="{prefix}AartiDate">तारीख</label>
                            </div>
                            <div class="form-group floating-label select-group">
                                <select id="{prefix}AartiTime" required>
                                    <option value="सकाळ">सकाळ</option>
                                    <option value="संध्याकाळ">संध्याकाळ</option>
                                </select>
                                <label for="{prefix}AartiTime">वेळ (सकाळ/संध्याकाळ)</label>
                            </div>
                            <div class="form-group floating-label">
                                <input type="text" id="{prefix}AartiPhone" placeholder=" ">
                                <label for="{prefix}AartiPhone">फोन नंबर</label>
                            </div>
                            <div class="form-group floating-label" style="grid-column: 1 / -1;">
                                <textarea id="{prefix}AartiDetails" placeholder=" " rows="2"></textarea>
                                <label for="{prefix}AartiDetails">पूजा माहिती (ऐच्छिक)</label>
                            </div>
                            <div style="grid-column: 1 / -1;">
                                <button type="submit" class="btn" style="width: 100%; margin-top: 5px; padding: 12px; font-size: 1.1rem; border-radius: 8px;">आरती जोडा</button>
                            </div>
                        </form>"""
    content = re.sub(aarti_pattern, new_aarti_form, content, flags=re.DOTALL)

    # 3. Inject JS functions if not present
    js_functions = f"""
        async function addNiyojan(e) {{
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {{
                const date = document.getElementById('{prefix}NiyojanDate').value;
                const time = document.getElementById('{prefix}NiyojanTime').value;
                const title = document.getElementById('{prefix}NiyojanTitle').value;
                const description = document.getElementById('{prefix}NiyojanDesc').value;
                
                // Get name based on page
                let addedByName = '';
                if(typeof currentUser !== 'undefined' && currentUser.name) {{
                    addedByName = currentUser.name;
                }} else if(typeof selectedMember !== 'undefined' && selectedMember.name) {{
                    addedByName = selectedMember.name; // Superadmin portal
                }}

                const res = await fetch(API_URL + '/api/niyojan', {{
                    method: 'POST',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify({{ date, time, title, description, addedBy: addedByName }})
                }});
                const data = await res.json();
                if(data.success) {{
                    e.target.reset();
                    alert('Niyojan added successfully!');
                    if(typeof loadMyData === 'function') loadMyData();
                }} else alert('Error adding niyojan');
            }} catch(err) {{ alert('Server error'); }}
            btn.disabled = false;
        }}

        async function addAarti(e) {{
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {{
                const name = document.getElementById('{prefix}AartiName').value;
                const date = document.getElementById('{prefix}AartiDate').value;
                const timeOfDay = document.getElementById('{prefix}AartiTime').value;
                const phone = document.getElementById('{prefix}AartiPhone').value;
                const pujaDetails = document.getElementById('{prefix}AartiDetails').value;
                
                let addedByName = '';
                if(typeof currentUser !== 'undefined' && currentUser.name) {{
                    addedByName = currentUser.name;
                }} else if(typeof selectedMember !== 'undefined' && selectedMember.name) {{
                    addedByName = selectedMember.name;
                }}

                const res = await fetch(API_URL + '/api/aarti', {{
                    method: 'POST',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify({{ name, date, timeOfDay, phone, pujaDetails, addedBy: addedByName }})
                }});
                const data = await res.json();
                if(data.success) {{
                    e.target.reset();
                    alert('Maha Aarti added successfully!');
                    if(typeof loadMyData === 'function') loadMyData();
                }} else alert('Error adding aarti');
            }} catch(err) {{ alert('Server error'); }}
            btn.disabled = false;
        }}
"""
    if 'async function addNiyojan(e)' not in content:
        content = content.replace('</script>', js_functions + '\n    </script>')
    else:
        # replace existing
        content = re.sub(r'async function addNiyojan\(e\).*?btn\.disabled = false;\s*\}', '', content, flags=re.DOTALL)
        content = re.sub(r'async function addAarti\(e\).*?btn\.disabled = false;\s*\}', '', content, flags=re.DOTALL)
        content = content.replace('</script>', js_functions + '\n    </script>')
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filename}")

fix_html_file('member.html', '')
fix_html_file('superadmin.html', 'sa')
