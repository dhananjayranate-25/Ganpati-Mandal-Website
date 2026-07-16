with open('member.html', 'r', encoding='utf-8') as f:
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
                        <input type="date" id="niyojanDate" class="form-control-full" required>
                        <input type="time" id="niyojanTime" class="form-control-full" required>
                        <input type="text" id="niyojanTitle" class="form-control-full" placeholder="शीर्षक (Title)" required>
                        <textarea id="niyojanDesc" class="form-control-full" placeholder="वर्णन (Description)" style="min-height:80px; resize:vertical;"></textarea>
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
                        <input type="text" id="aartiName" class="form-control-full" placeholder="नाव (Name)" required>
                        <input type="date" id="aartiDate" class="form-control-full" required>
                        <select id="aartiTime" class="form-control-full" required>
                            <option value="सकाळ">सकाळ</option>
                            <option value="संध्याकाळ">संध्याकाळ</option>
                        </select>
                        <input type="text" id="aartiPhone" class="form-control-full" placeholder="फोन नंबर (Phone)">
                        <input type="text" id="aartiDetails" class="form-control-full" placeholder="पूजा माहिती (Details)">
                        <button type="submit" class="btn">आरती जोडा</button>
                    </form>
                </div>
            </div>
        </div>
"""

# Replace `        </div>\n    </div>\n\n    <!-- Add Expense Modal -->`
target_str = '        </div>\n    </div>\n\n    <!-- Add Expense Modal -->'
if target_str in content:
    content = content.replace(target_str, '        </div>\n' + new_cards + '    </div>\n\n    <!-- Add Expense Modal -->')
else:
    print("target_str not found in member.html")

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
else:
    print("js_functions already present or target not found in member.html")


with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)
