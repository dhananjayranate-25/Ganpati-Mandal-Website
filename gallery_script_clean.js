
    // Auto-wrap tables for mobile responsiveness
    document.addEventListener('DOMContentLoaded', function() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    });
    

            document.addEventListener('DOMContentLoaded', () => {
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                const navLinks = document.getElementById('navLinks');
                
                if (mobileMenuBtn && navLinks) {
                    mobileMenuBtn.addEventListener('click', () => {
                        navLinks.classList.toggle('active');
                    });
                    
                    loadGalleryAlbums();
        
    async function loadFooterQR() {
        try {
            const response = await fetch('/api/settings');
            const result = await response.json();
            if (result.success && result.data && result.data.donateQRCode) {
                const footerQrImg = document.getElementById('footerDonationQRImg');
                if (footerQrImg) footerQrImg.src = result.data.donateQRCode;
            }
        } catch(e) {}
    }
    loadFooterQR();

                    // Close menu when clicking a link
                    const links = navLinks.querySelectorAll('a');
                    links.forEach(link => {
                        link.addEventListener('click', () => {
                            if (window.innerWidth <= 768) {
                                navLinks.classList.remove('active');
                            }
                        });
                    });
                }
            });
        
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
