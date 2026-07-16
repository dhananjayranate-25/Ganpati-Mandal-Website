with open('member.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_navbar = """
    <div class="navbar">
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="position: relative; cursor: pointer;" onclick="document.getElementById('profilePhotoInput').click()">
                <img id="profilePhotoPreview" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23bdbdbd'/%3E%3Cpath d='M20,90 Q50,50 80,90' stroke='%23bdbdbd' stroke-width='10' fill='none'/%3E%3C/svg%3E" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);">
                <div style="position: absolute; bottom: -5px; right: -5px; background: var(--primary); color: #000; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px;"><i class="fas fa-camera"></i></div>
            </div>
            <input type="file" id="profilePhotoInput" style="display: none;" accept="image/*" onchange="uploadProfilePhoto(this)">
            <h2><span id="welcomeName">Member</span></h2>
        </div>
        <button class="btn btn-outline" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
    </div>
"""

old_navbar = """    <div class="navbar">
        <h2><i class="fas fa-user"></i> <span id="welcomeName">Member</span></h2>
        <button class="btn btn-outline" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
    </div>"""

if old_navbar in content:
    content = content.replace(old_navbar, new_navbar)

new_js = """
        async function uploadProfilePhoto(input) {
            if (!input.files || input.files.length === 0) return;
            const file = input.files[0];
            const formData = new FormData();
            formData.append('photo', file);

            try {
                // Show loading on image
                document.getElementById('profilePhotoPreview').style.opacity = '0.5';
                
                const res = await fetch(`${API_URL}/users/${currentUser._id}/photo`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    // Update current user
                    currentUser.photoUrl = data.photoUrl;
                    localStorage.setItem('portalUser', JSON.stringify(currentUser));
                    document.getElementById('profilePhotoPreview').src = data.photoUrl;
                    alert('प्रोफाईल फोटो यशस्वीरित्या अपडेट झाला!');
                } else {
                    alert('फोटो अपडेट करताना त्रुटी: ' + data.error);
                }
            } catch (err) {
                console.error(err);
                alert('Server Error');
            } finally {
                document.getElementById('profilePhotoPreview').style.opacity = '1';
                input.value = ''; // Reset input
            }
        }

        async function loadMyData() {"""

if 'async function uploadProfilePhoto' not in content:
    content = content.replace('        async function loadMyData() {', new_js)

init_preview = """
            if(currentUser.photoUrl) {
                document.getElementById('profilePhotoPreview').src = currentUser.photoUrl;
            }
            loadMyData();"""

if "document.getElementById('profilePhotoPreview').src = currentUser.photoUrl;" not in content:
    content = content.replace('            loadMyData();', init_preview)

with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated member.html successfully')
