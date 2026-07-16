with open('member.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I will add the Niyojan and Aarti cards to the dashboard grid
new_cards = """
            <!-- Add Niyojan Card -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">उत्सव नियोजन जोडा (Add Niyojan)</h2>
                </div>
                <div class="card-body">
                    <form onsubmit="addNiyojan(event)">
                        <input type="date" id="niyojanDate" class="form-control" required>
                        <input type="time" id="niyojanTime" class="form-control" required>
                        <input type="text" id="niyojanTitle" class="form-control" placeholder="शीर्षक (Title)" required>
                        <textarea id="niyojanDesc" class="form-control" placeholder="वर्णन (Description)"></textarea>
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
                        <input type="text" id="aartiName" class="form-control" placeholder="नाव (Name)" required>
                        <input type="date" id="aartiDate" class="form-control" required>
                        <select id="aartiTime" class="form-control" required>
                            <option value="सकाळ">सकाळ</option>
                            <option value="संध्याकाळ">संध्याकाळ</option>
                        </select>
                        <input type="text" id="aartiPhone" class="form-control" placeholder="फोन नंबर (Phone)">
                        <input type="text" id="aartiDetails" class="form-control" placeholder="पूजा माहिती (Details)">
                        <button type="submit" class="btn">आरती जोडा</button>
                    </form>
                </div>
            </div>
"""

if '<!-- Add Niyojan Card -->' not in content:
    content = content.replace('        </div>\n    </main>', new_cards + '\n        </div>\n    </main>')
    # Fallback if indent is different
    content = content.replace('</div>\n    </main>', new_cards + '\n        </div>\n    </main>')

js_functions = """
        async function addNiyojan(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/api/niyojan', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        date: document.getElementById('niyojanDate').value,
                        time: document.getElementById('niyojanTime').value,
                        title: document.getElementById('niyojanTitle').value,
                        description: document.getElementById('niyojanDesc').value,
                        addedBy: currentUser.name
                    })
                });
                const data = await res.json();
                if(data.success) {
                    alert('Niyojan added successfully!');
                    e.target.reset();
                } else alert(data.message);
            } catch(err) { alert('Error adding niyojan'); }
            btn.disabled = false;
        }

        async function addAarti(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/api/aarti', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: document.getElementById('aartiName').value,
                        date: document.getElementById('aartiDate').value,
                        timeOfDay: document.getElementById('aartiTime').value,
                        phone: document.getElementById('aartiPhone').value,
                        pujaDetails: document.getElementById('aartiDetails').value,
                        addedBy: currentUser.name
                    })
                });
                const data = await res.json();
                if(data.success) {
                    alert('Maha Aarti added successfully!');
                    e.target.reset();
                } else alert(data.message);
            } catch(err) { alert('Error adding aarti'); }
            btn.disabled = false;
        }
"""

if 'async function addNiyojan' not in content:
    content = content.replace('async function logExpense(e) {', js_functions + '\n        async function logExpense(e) {')


with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)
