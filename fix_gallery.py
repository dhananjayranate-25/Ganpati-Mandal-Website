import re

clean_script = """
<script>
    let galleryAlbumsCache = [];

    async function loadGalleryAlbums() {
        const grid = document.getElementById('albumsGrid');
        if(!grid) return;
        grid.innerHTML = '<p style="text-align: center; color: white; width: 100%; grid-column: 1 / -1;">अल्बम लोड होत आहेत...</p>';
        try {
            const res = await fetch('/api/gallery');
            if (!res.ok) throw new Error('Server returned ' + res.status);
            const data = await res.json();
            if (data.success) {
                galleryAlbumsCache = data.albums || [];
                if (galleryAlbumsCache.length === 0) {
                    grid.innerHTML = '<p style="text-align: center; color: white; width: 100%; grid-column: 1 / -1;">कोणतेही अल्बम उपलब्ध नाहीत.</p>';
                    return;
                }
                
                grid.innerHTML = galleryAlbumsCache.map(album => {
                    const coverPhoto = album.photos.length > 0 ? '/' + album.photos[0] : 'logo/logo.jpeg';
                    return `
                        <div class="album-card" onclick="openAlbum('${album._id}')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                            <div style="width: 100%; padding-top: 75%; position: relative;">
                                <img src="${coverPhoto}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" loading="lazy">
                            </div>
                            <div style="padding: 15px; text-align: center;">
                                <h3 style="color: #ffeb3b; margin: 0 0 5px 0; font-size: 1.2rem;">${album.title}</h3>
                                <p style="color: #ccc; margin: 0; font-size: 0.9rem;">${album.photos.length} photos</p>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                grid.innerHTML = '<p style="text-align: center; color: #ff5252; width: 100%; grid-column: 1 / -1;">माहिती लोड करण्यात त्रुटी: ' + (data.error || 'अज्ञात त्रुटी') + '</p>';
            }
        } catch (e) {
            console.error('Gallery API Error:', e);
            grid.innerHTML = '<p style="text-align: center; color: #ff5252; width: 100%; grid-column: 1 / -1;">माहिती लोड करण्यात त्रुटी आली. कृपया इंटरनेट तपासा.</p>';
        }
    }

    function openAlbum(albumId) {
        const album = galleryAlbumsCache.find(a => a._id === albumId);
        if (!album) return;

        document.getElementById('albumsGrid').style.display = 'none';
        document.getElementById('photosView').style.display = 'block';
        document.getElementById('currentAlbumTitle').innerText = album.title;

        const photosGrid = document.getElementById('photosGrid');
        if (album.photos.length === 0) {
            photosGrid.innerHTML = '<p style="text-align: center; color: white; width: 100%; grid-column: 1 / -1;">या अल्बममध्ये कोणतेही फोटो नाहीत.</p>';
            return;
        }

        photosGrid.innerHTML = album.photos.map(photo => `
            <div style="width: 100%; padding-top: 100%; position: relative; border-radius: 8px; overflow: hidden; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onclick="openLightbox('/${photo}')">
                <img src="/${photo}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" loading="lazy">
            </div>
        `).join('');
    }

    function backToAlbums() {
        document.getElementById('photosView').style.display = 'none';
        document.getElementById('albumsGrid').style.display = 'grid';
    }

    function openLightbox(src) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
    }

    function closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
    }
</script>
"""

with open('gallery.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if line.strip() == '<script>':
        start_idx = i

end_idx = -1
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == '</script>':
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    with open('gallery.html', 'w', encoding='utf-8') as f:
        f.writelines(lines[:start_idx])
        f.write(clean_script + '\n')
        f.writelines(lines[end_idx+1:])
    print('Replaced script successfully!')
else:
    print('Could not find script bounds.')
