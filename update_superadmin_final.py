with open('superadmin.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_cards = """
            <div class="lists-grid" style="margin-top: 30px;">
                <!-- Add Niyojan Card -->
                <div class="list-container">
                    <div class="list-header">
                        <h3>उत्सव नियोजन जोडा (Add Niyojan)</h3>
                    </div>
                    <div style="padding: 15px;">
                        <form onsubmit="addNiyojan(event)" style="display: flex; flex-direction: column; gap: 10px;">
                            <input type="date" id="saNiyojanDate" class="form-control-full" required>
                            <input type="time" id="saNiyojanTime" class="form-control-full" required>
                            <input type="text" id="saNiyojanTitle" class="form-control-full" placeholder="शीर्षक (Title)" required>
                            <textarea id="saNiyojanDesc" class="form-control-full" placeholder="वर्णन (Description)" style="min-height:80px; resize:vertical;"></textarea>
                            <button type="submit" class="btn">नियोजन जोडा</button>
                        </form>
                    </div>
                </div>

                <!-- Add Aarti Card -->
                <div class="list-container">
                    <div class="list-header">
                        <h3>महाआरती जोडा (Add Aarti)</h3>
                    </div>
                    <div style="padding: 15px;">
                        <form onsubmit="addAarti(event)" style="display: flex; flex-direction: column; gap: 10px;">
                            <input type="text" id="saAartiName" class="form-control-full" placeholder="नाव (Name)" required>
                            <input type="date" id="saAartiDate" class="form-control-full" required>
                            <select id="saAartiTime" class="form-control-full" required>
                                <option value="सकाळ">सकाळ</option>
                                <option value="संध्याकाळ">संध्याकाळ</option>
                            </select>
                            <input type="text" id="saAartiPhone" class="form-control-full" placeholder="फोन नंबर (Phone)">
                            <input type="text" id="saAartiDetails" class="form-control-full" placeholder="पूजा माहिती (Details)">
                            <button type="submit" class="btn">आरती जोडा</button>
                        </form>
                    </div>
                </div>
            </div>
"""

target_str = '            </div>\n        </div>\n    </div>\n\n    <!-- Modals -->'
if target_str in content:
    content = content.replace(target_str, '            </div>\n' + new_cards + '        </div>\n    </div>\n\n    <!-- Modals -->')
else:
    print("target_str not found in superadmin.html")

js_functions = """
        async function addNiyojan(e) {
            e.preventDefault();
            if(!selectedMemberData) return;
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/api/niyojan', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        date: document.getElementById('saNiyojanDate').value,
                        time: document.getElementById('saNiyojanTime').value,
                        title: document.getElementById('saNiyojanTitle').value,
                        description: document.getElementById('saNiyojanDesc').value,
                        addedBy: selectedMemberData.name
                    })
                });
                const data = await res.json();
                if(data.success) {
                    alert('Niyojan added successfully on behalf of ' + selectedMemberData.name + '!');
                    e.target.reset();
                } else alert(data.message);
            } catch(err) { alert('Error adding niyojan'); }
            btn.disabled = false;
        }

        async function addAarti(e) {
            e.preventDefault();
            if(!selectedMemberData) return;
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/api/aarti', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: document.getElementById('saAartiName').value,
                        date: document.getElementById('saAartiDate').value,
                        timeOfDay: document.getElementById('saAartiTime').value,
                        phone: document.getElementById('saAartiPhone').value,
                        pujaDetails: document.getElementById('saAartiDetails').value,
                        addedBy: selectedMemberData.name
                    })
                });
                const data = await res.json();
                if(data.success) {
                    alert('Maha Aarti added successfully on behalf of ' + selectedMemberData.name + '!');
                    e.target.reset();
                } else alert(data.message);
            } catch(err) { alert('Error adding aarti'); }
            btn.disabled = false;
        }
"""
if 'async function addNiyojan' not in content:
    content = content.replace('async function addFunds(e) {', js_functions + '\n        async function addFunds(e) {')
else:
    print("js_functions already in superadmin.html")

with open('superadmin.html', 'w', encoding='utf-8') as f:
    f.write(content)
