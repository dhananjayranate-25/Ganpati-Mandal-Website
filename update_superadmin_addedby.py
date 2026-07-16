with open('superadmin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the Niyojan and Aarti cards to the dashboard grid
new_cards = """
                <!-- Add Niyojan Card -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">उत्सव नियोजन जोडा (Add Niyojan)</h2>
                    </div>
                    <div class="card-body">
                        <form onsubmit="addNiyojan(event)">
                            <input type="date" id="saNiyojanDate" class="form-control" required>
                            <input type="time" id="saNiyojanTime" class="form-control" required>
                            <input type="text" id="saNiyojanTitle" class="form-control" placeholder="शीर्षक (Title)" required>
                            <textarea id="saNiyojanDesc" class="form-control" placeholder="वर्णन (Description)"></textarea>
                            <button type="submit" class="btn">नियोजन जोडा</button>
                        </form>
                    </div>
                </div>

                <!-- Add Aarti Card -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">महाआरती जोडा (Add Aarti)</h2>
                    </div>
                    <div class="card-body">
                        <form onsubmit="addAarti(event)">
                            <input type="text" id="saAartiName" class="form-control" placeholder="नाव (Name)" required>
                            <input type="date" id="saAartiDate" class="form-control" required>
                            <select id="saAartiTime" class="form-control" required>
                                <option value="सकाळ">सकाळ</option>
                                <option value="संध्याकाळ">संध्याकाळ</option>
                            </select>
                            <input type="text" id="saAartiPhone" class="form-control" placeholder="फोन नंबर (Phone)">
                            <input type="text" id="saAartiDetails" class="form-control" placeholder="पूजा माहिती (Details)">
                            <button type="submit" class="btn">आरती जोडा</button>
                        </form>
                    </div>
                </div>
"""

if '<!-- Add Niyojan Card -->' not in content:
    content = content.replace('            </div>\n        </div>\n    </main>', new_cards + '\n            </div>\n        </div>\n    </main>')

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

with open('superadmin.html', 'w', encoding='utf-8') as f:
    f.write(content)
