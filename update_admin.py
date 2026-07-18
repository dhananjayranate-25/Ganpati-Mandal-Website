import os
import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

def add_designation_input(match):
    role = match.group(1) # e.g. president
    return match.group(0) + f'''
                        <div class="input-group">
                            <input type="text" id="{role}Designation" placeholder=" ">
                            <label for="{role}Designation">Post/Designation (पद) - Optional</label>
                        </div>'''

content = re.sub(r'<div class="input-group">\s*<input type="text" id="([a-zA-Z0-9]+)Mobile".*?>\s*<label for=".*?">.*?</label>\s*</div>', add_designation_input, content)

save_old = '''        async function saveCommitteeMember(role) {
            try {
                let name = document.getElementById(role + 'Name').value.trim();
                let mobile = document.getElementById(role + 'Mobile').value.trim();
                let photoInput = document.getElementById(role + 'PhotoInput');'''
save_new = '''        async function saveCommitteeMember(role) {
            try {
                let name = document.getElementById(role + 'Name').value.trim();
                let mobile = document.getElementById(role + 'Mobile').value.trim();
                let designation = '';
                if (document.getElementById(role + 'Designation')) {
                    designation = document.getElementById(role + 'Designation').value.trim();
                }
                let photoInput = document.getElementById(role + 'PhotoInput');'''
content = content.replace(save_old, save_new)

append_old = '''                formData.append('role', role);
                formData.append('name', name);
                formData.append('mobile', mobile);'''
append_new = '''                formData.append('role', role);
                formData.append('name', name);
                formData.append('mobile', mobile);
                if(designation) formData.append('designation', designation);'''
content = content.replace(append_old, append_new)

load_old = '''                        document.getElementById(m.role + 'Name').value = m.name;
                        document.getElementById(m.role + 'Mobile').value = m.mobile;'''
load_new = '''                        document.getElementById(m.role + 'Name').value = m.name;
                        document.getElementById(m.role + 'Mobile').value = m.mobile;
                        if (document.getElementById(m.role + 'Designation')) {
                            document.getElementById(m.role + 'Designation').value = m.designation || '';
                        }'''
content = content.replace(load_old, load_new)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('admin.html updated successfully.')
