
            document.addEventListener('DOMContentLoaded', () => {
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                const navLinks = document.getElementById('navLinks');
                
                if (mobileMenuBtn && navLinks) {
                    mobileMenuBtn.addEventListener('click', () => {
                        navLinks.classList.toggle('active');
                    });
                    
                    // Close menu when clicking a link
                    const links = navLinks.querySelectorAll('a');
                    links.forEach(link => {
                        link.addEventListener('click', () => {
                            navLinks.classList.remove('active');
                        });
                    });
                }
            });
        

    const API_URL = '';
    let uploadedPDFsData = [];
    let uploadedPDFsPage = 0;
    let yearVisibilityMap = {};
    let appSettings = {};

    function getPDFSettings(year) {
        const defaults = { orgName: 'शिवसृष्टी सार्वजनिक उत्सव मंडळ संगमनेर 🚩', subtitle: 'गणेश उत्सव कॅशबुक', tagline: 'Ganpati Festival Cashbook', headerOrgName: '', headerSubtitle: '' };
        try {
            const key = year ? 'pdfCustomSettings_' + year : 'pdfCustomSettings';
            const stored = appSettings[key] || {};
            if (Object.keys(stored).length > 0) return { ...defaults, ...stored };
            if (year) {
                const global = appSettings['pdfCustomSettings'] || {};
                if (Object.keys(global).length > 0) return { ...defaults, ...global };
            }
            return defaults;
        } catch (e) {
            return defaults;
        }
    }

    function getPDFsPerPage() {
        return window.innerWidth <= 768 ? 2 : 5;
    }

    let currentYearEntries = [];
    let currentYearPage = 1;
    let currentSelectedYear = '';

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    }

    function createSparkles() {
        const container = document.getElementById('particles');
        if (!container) return;
        const colors = ['gold', 'purple'];
        const sizes = ['tiny', '', 'big'];
        for (let i = 0; i < 30; i++) {
            const el = document.createElement('div');
            el.className = 'sparkle ' + colors[i % 2] + ' ' + sizes[i % 3];
            el.style.left = Math.random() * 100 + '%';
            el.style.setProperty('--dur', (10 + Math.random() * 15) + 's');
            el.style.setProperty('--delay', (Math.random() * 15) + 's');
            el.style.setProperty('--max-opacity', (0.4 + Math.random() * 0.5));
            container.appendChild(el);
        }
        for (let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            el.className = 'sparkle-star';
            el.style.left = Math.random() * 100 + '%';
            el.style.top = Math.random() * 100 + '%';
            el.style.animationDelay = (Math.random() * 5) + 's';
            el.style.animationDuration = (2 + Math.random() * 4) + 's';
            container.appendChild(el);
        }
    }

    let currentTab = 'home';

    document.addEventListener('DOMContentLoaded', function() {
        setupNavigation();
        const initialTab = window.location.hash.replace('#', '') || 'home';
        switchTab(initialTab, false);
        loadUploadedPDFsHome();
        renderVisibleYearSections();
        initScrollReveal();
        createSparkles();
        loadAppearanceSettingsHome();
        loadAartiDataHome();
        loadNiyojanDataHome();
        
        loadCommitteeDataHome();
        
        // Secret Admin Login
        let logoClickCount = 0;
        let logoClickTimer;
        const secretAdminLogo = document.getElementById('secretAdminLogo');
        if (secretAdminLogo) {
            secretAdminLogo.addEventListener('click', () => {
                logoClickCount++;
                clearTimeout(logoClickTimer);
                if (logoClickCount >= 5) {
                    window.location.href = 'admin.html';
                }
                // Reset count after 2 seconds of inactivity
                logoClickTimer = setTimeout(() => {
                    logoClickCount = 0;
                }, 2000);
            });
        }
    });

    function switchTab(tabName, pushState = true) {
        currentTab = tabName;
        window.scrollTo({top: 0, behavior: 'smooth'});
        
        const heroContainer = document.getElementById('heroSectionContainer');
        const ganeshotsavHeader = document.getElementById('ganeshotsavHeader');
        const cashbookContainer = document.getElementById('visibleYearsContainer');
        const prevYearsContainer = document.getElementById('previousYearsContainer');
        const siteFooter = document.getElementById('siteFooter');
        const mainContainer = document.querySelector('.container');
        const donationSection = document.getElementById('donationSection');
        const committeeSection = document.getElementById('committeeSection');
        const contactSection = document.getElementById('contactSection');
        const niyojanSection = document.getElementById('niyojanSection');

        // Hide everything first
        if(heroContainer) heroContainer.style.display = 'none';
        if(ganeshotsavHeader) ganeshotsavHeader.style.display = 'none';
        if(cashbookContainer) cashbookContainer.style.display = 'none';
        if(prevYearsContainer) prevYearsContainer.style.display = 'none';
        if(siteFooter) siteFooter.style.display = 'none';
        if(mainContainer) mainContainer.style.display = 'none';
        if(donationSection) donationSection.style.display = 'none';
        if(committeeSection) committeeSection.style.display = 'none';
        const aartiSection = document.getElementById('aartiSection');
        if(aartiSection) aartiSection.style.display = 'none';
        if(contactSection) contactSection.style.display = 'none';
        if(niyojanSection) niyojanSection.style.display = 'none';

        // Show based on tabName
        if (tabName === 'home') {
            if(heroContainer) heroContainer.style.display = 'block';
            if(siteFooter) siteFooter.style.display = 'block';
        } else if (tabName === 'ganeshotsav') {
            if(ganeshotsavHeader) ganeshotsavHeader.style.display = 'block';
            if(cashbookContainer) cashbookContainer.style.display = 'block';
            if(prevYearsContainer) prevYearsContainer.style.display = 'block';
            if(siteFooter) siteFooter.style.display = 'block';
            if(mainContainer) mainContainer.style.display = 'block';
        } else if (tabName === 'donate') {
            if(siteFooter) siteFooter.style.display = 'block';
            if(mainContainer) mainContainer.style.display = 'block';
            if(donationSection) donationSection.style.display = 'block';
        } else if (tabName === 'aarti') {
            if(siteFooter) siteFooter.style.display = 'block';
            if(mainContainer) mainContainer.style.display = 'block';
            const aartiSection = document.getElementById('aartiSection');
            if(aartiSection) aartiSection.style.display = 'block';
            
        } else if (tabName === 'committee') {
            if(siteFooter) siteFooter.style.display = 'block';
            if(mainContainer) mainContainer.style.display = 'block';
            if(committeeSection) committeeSection.style.display = 'block';
        } else if (tabName === 'contact') {
            if(siteFooter) siteFooter.style.display = 'block';
            if(mainContainer) mainContainer.style.display = 'block';
            if(contactSection) contactSection.style.display = 'block';
        } else if (tabName === 'niyojan') {
            if(siteFooter) siteFooter.style.display = 'block';
            if(mainContainer) mainContainer.style.display = 'block';
            if(niyojanSection) niyojanSection.style.display = 'block';
        }
        
        if (pushState) {
            window.history.pushState({ tab: tabName }, '', '#' + tabName);
        }
    }

    function setupNavigation() {
        const navHome = document.getElementById('nav-home');
        const navGaneshotsav = document.getElementById('nav-ganeshotsav');
        const navDonate = document.getElementById('nav-donate');
        const navCommittee = document.getElementById('nav-committee');
        const navNiyojan = document.getElementById('nav-niyojan');
        const navContact = document.getElementById('nav-contact');

        if (navHome) navHome.addEventListener('click', (e) => { e.preventDefault(); switchTab('home'); });
        if (navGaneshotsav) navGaneshotsav.addEventListener('click', (e) => { e.preventDefault(); switchTab('ganeshotsav'); });
        if (navDonate) navDonate.addEventListener('click', (e) => { e.preventDefault(); switchTab('donate'); });
        if (navCommittee) navCommittee.addEventListener('click', (e) => { e.preventDefault(); switchTab('committee'); });
        if (navNiyojan) navNiyojan.addEventListener('click', (e) => { e.preventDefault(); switchTab('niyojan'); });
        const navAarti = document.getElementById('nav-aarti');
        if (navAarti) navAarti.addEventListener('click', (e) => { e.preventDefault(); switchTab('aarti'); });
        if (navContact) navContact.addEventListener('click', (e) => { e.preventDefault(); switchTab('contact'); });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.tab) {
                switchTab(e.state.tab, false);
            } else {
                switchTab('home', false);
            }
        });
        
        // Push initial state
        window.history.replaceState({ tab: 'home' }, '', '#home');
    }

    
    

    
    
    async function loadNiyojanDataHome() {
        try {
            const response = await fetch('/api/niyojan');
            if (response.ok) {
                const niyojans = await response.json();
                const grid = document.getElementById('niyojanGrid');
                if (!grid) return;
                
                if (niyojans.length === 0) {
                    grid.innerHTML = '<p style="text-align: center; color: white;">कोणतेही नियोजन उपलब्ध नाही.</p>';
                    return;
                }
                
                let html = '';
                niyojans.forEach((item, index) => {
                    const formattedDate = formatDate(item.date);
                    
                    let time12 = item.time;
                    if (time12) {
                        let parts = time12.split(':');
                        if (parts.length >= 2) {
                            let h = parseInt(parts[0], 10);
                            let m = parts[1];
                            let ampm = h >= 12 ? 'PM' : 'AM';
                            h = h % 12 || 12;
                            time12 = `${h}:${m} ${ampm}`;
                        }
                    }

                    html += `
                        <div class="niyojan-item animate-fade-up" style="animation-delay: ${index * 0.1}s; display: flex; gap: 20px; margin-bottom: 25px;">
                            <!-- Timeline dot -->
                            <div style="min-width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #aa8222); border: 4px solid #1a1a1a; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(212,175,55,0.5); z-index: 2;">
                                <i class="fas fa-calendar-day" style="color: #fff; font-size: 1.1rem;"></i>
                            </div>
                            
                            <!-- Content Card -->
                            <div class="glass-panel" style="flex: 1; padding: 15px 20px; border-left: 3px solid #d4af37; background: rgba(255,255,255,0.05);">
                                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
                                    <span style="color: #ffcc00; font-weight: bold; font-size: 1.1rem;">${formattedDate}</span>
                                    <span style="background: rgba(212,175,55,0.2); color: #ffeb3b; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 5px; height: fit-content; line-height: 1;"><i class="far fa-clock"></i>${time12}</span>
                                </div>
                                <h3 style="color: #fff; font-family: 'Khand', sans-serif; font-size: 1.25rem; margin: 0 0 5px 0;">${item.title}</h3>
                                ${item.description ? `<p style="color: #ccc; font-size: 0.9rem; margin: 0; line-height: 1.4;">${item.description}</p>` : ''}
                                ${item.addedBy ? `<div style="display:flex; justify-content:flex-end; margin-top: 10px;"><span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 15px; font-size: 0.75rem; color:#aaa;"><i class="fas fa-user-edit" style="margin-right:5px; color:#d4af37;"></i>${item.addedBy}</span></div>` : ''}
                            </div>
                        </div>
                    `;
                });
                grid.innerHTML = html;
            }
        } catch (e) {
            console.error('Failed to load niyojan data:', e);
        }
    }

    async function loadAartiDataHome() {
        try {
            const response = await fetch('/api/aarti');
            if (response.ok) {
                const aartis = await response.json();
                const grid = document.getElementById('aartiGrid');
                if (!grid) return;
                
                if (aartis.length === 0) {
                    grid.innerHTML = '<p style="text-align: center; color: white; width: 100%;">कोणतीही महाआरती नोंदवली नाही.</p>';
                    return;
                }
                
                let html = '';
                aartis.forEach(aarti => {
                    const formattedDate = formatDate(aarti.date);
                    
                    html += `
                        <div class="aarti-item glass-panel" style="padding: 15px; margin-bottom: 15px; border-left: 4px solid #ffcc00; background: rgba(255,255,255,0.1);">
                            <h3 style="color: #ffeb3b; margin: 0 0 10px 0; font-family: 'Khand', sans-serif; font-size: 1.2rem;">${aarti.name}</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; color: #fff; font-size: 0.85rem;">
                                <div><strong style="color: #ffcc00;">तारीख:</strong> ${formattedDate}</div>
                                <div><strong style="color: #ffcc00;">वेळ:</strong> ${aarti.timeOfDay}</div>
                            </div>
                            ${aarti.pujaDetails ? `<div style="margin-top: 10px; color: #eee; font-size: 0.85rem;"><strong style="color: #ffcc00;">पूजा माहिती:</strong> ${aarti.pujaDetails}</div>` : ''}
                            ${aarti.addedBy ? `<div style="display:flex; justify-content:flex-end; margin-top: 12px; grid-column: 1 / -1;"><span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 15px; font-size: 0.75rem; color:#aaa;"><i class="fas fa-user-edit" style="margin-right:5px; color:#ffcc00;"></i>${aarti.addedBy}</span></div>` : ''}
                        </div>
                    `;
                });
                grid.innerHTML = html;
            }
        } catch (e) {
            console.error('Error loading aarti data:', e);
        }
    }

    async function loadAppearanceSettingsHome() {
        try {
            const response = await fetch('/api/settings');
            const result = await response.json();
            if (result.success) {
                const settings = result.data;
                window.appSettings = settings;
                if (settings.estYear) document.getElementById('displayEstYear').textContent = settings.estYear;
                const regNoElem = document.getElementById('displayRegNo');
                if (settings.regNo && regNoElem) regNoElem.textContent = settings.regNo;
                // if (settings.mainTitle) document.getElementById('displayMainTitle').textContent = settings.mainTitle;
                const navTitleElem = document.getElementById('displayNavbarTitle');
                if (settings.navbarTitle && navTitleElem) navTitleElem.textContent = settings.navbarTitle;
                
                if (settings.appMarqueeText) {
                    const mContainer = document.getElementById('marqueeContainer');
                    const mText = document.getElementById('marqueeText');
                    if (mContainer && mText) {
                        mText.textContent = settings.appMarqueeText;
                        mContainer.style.display = 'block';
                    }
                } else {
                    const mContainer = document.getElementById('marqueeContainer');
                    if (mContainer) mContainer.style.display = 'none';
                }
                
                if (settings.appNiyojanMarqueeText) {
                    const nmContainer = document.getElementById('niyojanMarqueeContainer');
                    const nmText = document.getElementById('niyojanMarqueeText');
                    if (nmContainer && nmText) {
                        nmText.textContent = settings.appNiyojanMarqueeText;
                        nmContainer.style.display = 'block';
                    }
                } else {
                    const nmContainer = document.getElementById('niyojanMarqueeContainer');
                    if (nmContainer) nmContainer.style.display = 'none';
                }
                
                const heroImg = document.getElementById('heroBannerImg');
                if (settings.heroBannerImage) {
                    if (heroImg) {
                        if (settings.heroBannerImage.startsWith('data:image')) {
                            heroImg.src = settings.heroBannerImage;
                        } else {
                            const newSrc = 'uploads/' + settings.heroBannerImage;
                            if (settings.heroBannerImage !== 'hero_banner.jpg' && !heroImg.src.includes(newSrc)) {
                                heroImg.src = newSrc;
                            }
                        }
                        heroImg.style.display = 'block';
                    }
                }
                
                // Populate Donation Details
                if (settings.donateAccName) document.getElementById('bankAccName').textContent = settings.donateAccName;
                if (settings.donateAccNo) document.getElementById('bankAccNo').textContent = settings.donateAccNo;
                if (settings.donateIFSC) document.getElementById('bankIFSC').textContent = settings.donateIFSC;
                if (settings.donateBranch) document.getElementById('bankBranch').textContent = settings.donateBranch;
                
                if (settings.donateQRCode) {
                    const qrImg = document.getElementById('donationQRImg');
                    if (qrImg) qrImg.src = settings.donateQRCode;
                    const footerQrImg = document.getElementById('footerDonationQRImg');
                    if (footerQrImg) footerQrImg.src = settings.donateQRCode;
                }
                
                // Custom Posters Titles on Buttons
                if (settings.varganiAabharTitle) {
                    const vBtnText = document.getElementById('varganiBtnText');
                    if (vBtnText) vBtnText.textContent = settings.varganiAabharTitle;
                }
                if (settings.mahaprasadNimantranTitle) {
                    const mBtnText = document.getElementById('mahaprasadBtnText');
                    if (mBtnText) mBtnText.textContent = settings.mahaprasadNimantranTitle;
                }
                
                // Load Aarti Media
                const aartiMediaContainer = document.getElementById('aartiMediaContainer');
                const aartiAudioWrapper = document.getElementById('aartiAudioWrapper');
                const aartiAudioPlayer = document.getElementById('aartiAudioPlayer');
                const aartiPdfWrapper = document.getElementById('aartiPdfWrapper');
                const aartiPdfLink = document.getElementById('aartiPdfLink');
                
                let hasMedia = false;
                if (settings.aartiAudioPath) {
                    aartiAudioPlayer.src = '/' + settings.aartiAudioPath;
                    aartiAudioWrapper.style.display = 'flex';
                    hasMedia = true;
                }
                if (settings.aartiPdfPath) {
                    aartiPdfLink.href = '/' + settings.aartiPdfPath;
                    aartiPdfWrapper.style.display = 'block';
                    hasMedia = true;
                }
                if (hasMedia && aartiMediaContainer) {
                    aartiMediaContainer.style.display = 'flex';
                }

            } else {
                const heroImg = document.getElementById('heroBannerImg');
                if (heroImg) heroImg.style.opacity = '1';
            }
        } catch (e) {
            console.error('Error loading appearance settings:', e);
            const heroImg = document.getElementById('heroBannerImg');
            if (heroImg) heroImg.style.opacity = '1';
        }
    }

    
    

    async function loadCommitteeDataHome() {
        try {
            const response = await fetch('/api/committee');
            const result = await response.json();
            if (result.success && result.data.length > 0) {
                const grid = document.querySelector('.committee-grid');
                if (!grid) return;
                
                grid.innerHTML = '';
                
                // Separate President/Treasurer from others
                const topRoles = ['president', 'treasurer'];
                const topMembers = result.data.filter(m => topRoles.includes(m.role));
                const otherMembers = result.data.filter(m => !topRoles.includes(m.role));
                
                let html = '';
                
                const generateMemberHTML = (member) => {
                    let roleName = member.designation;
                    if (!roleName) {
                        roleName = 'सदस्य';
                        if (member.role === 'president') roleName = 'अध्यक्ष';
                        else if (member.role === 'treasurer') roleName = 'खजिनदार';
                    }
                    
                    let photoUrl = member.photoUrl;
                    if (!photoUrl) {
                        photoUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23bdbdbd'/%3E%3Cpath d='M20,90 Q50,50 80,90' stroke='%23bdbdbd' stroke-width='10' fill='none'/%3E%3C/svg%3E";
                    }
                    const mobileHtml = member.mobile ? `<p class="member-phone">मो.नं ${member.mobile}</p>` : '<p class="member-phone" style="display:none;"></p>';
                    const memberName = member.name || 'नाव टाका';
                    
                    return `
                    <div class="committee-member" onclick="openLightbox('${photoUrl}')" style="cursor: pointer;">
                        <div class="member-photo-frame">
                            <img src="${photoUrl}" alt="${roleName}" class="member-photo" ${member.role === 'president' ? 'style="object-position: center 10%;"' : ''}>
                        </div>
                        <h3 class="member-role">${roleName}</h3>
                        <p class="member-name">${memberName}</p>
                        ${mobileHtml}
                    </div>
                    `;
                };
                
                // Top row
                if (topMembers.length > 0) {
                    html += '<div class="committee-row-2">';
                    topMembers.forEach(member => {
                        html += generateMemberHTML(member);
                    });
                    html += '</div>';
                }
                
                // Other members in one wrapper
                if (otherMembers.length > 0) {
                    html += '<div class="committee-members-wrap">';
                    otherMembers.forEach(member => {
                        html += generateMemberHTML(member);
                    });
                    html += '</div>';
                }
                
                grid.innerHTML = html;
                
                // Sync with Contact Section
                const defaultPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23bdbdbd'/%3E%3Cpath d='M20,90 Q50,50 80,90' stroke='%23bdbdbd' stroke-width='10' fill='none'/%3E%3C/svg%3E";
                
                // Reset Contact Cards First (hide them if they don't exist)
                if (document.getElementById('contact-card-president')) document.getElementById('contact-card-president').style.display = 'none';
                if (document.getElementById('contact-card-treasurer')) document.getElementById('contact-card-treasurer').style.display = 'none';
                
                topMembers.forEach(member => {
                    if (member.role === 'president') {
                        document.getElementById('contact-card-president').style.display = 'flex';
                        document.getElementById('contact-president-name').textContent = member.name || 'नाव टाका';
                        document.getElementById('contact-president-mobile').textContent = member.mobile ? `मो.नं ${member.mobile}` : '';
                        
                        let pPhoto = member.photoUrl;
                        if (pPhoto && !pPhoto.startsWith('data:')) pPhoto += '?t=' + new Date().getTime();
                        document.getElementById('contact-president-photo').src = pPhoto || defaultPhoto;
                        
                        const waLink = document.getElementById('contact-president-wa');
                        if (member.mobile) {
                            waLink.style.display = 'inline-flex';
                            waLink.href = `https://wa.me/91${member.mobile}?text=नमस्कार%20${member.name},%20शिवसृष्टी%20मंडळाबाबत%20संपर्क%20साधत%20आहे.`;
                        } else {
                            waLink.style.display = 'none';
                        }
                    } else if (member.role === 'treasurer') {
                        document.getElementById('contact-card-treasurer').style.display = 'flex';
                        document.getElementById('contact-treasurer-name').textContent = member.name || 'नाव टाका';
                        document.getElementById('contact-treasurer-mobile').textContent = member.mobile ? `मो.नं ${member.mobile}` : '';
                        
                        let tPhoto = member.photoUrl;
                        if (tPhoto && !tPhoto.startsWith('data:')) tPhoto += '?t=' + new Date().getTime();
                        document.getElementById('contact-treasurer-photo').src = tPhoto || defaultPhoto;
                        
                        const waLink = document.getElementById('contact-treasurer-wa');
                        if (member.mobile) {
                            waLink.style.display = 'inline-flex';
                            waLink.href = `https://wa.me/91${member.mobile}?text=नमस्कार%20${member.name},%20शिवसृष्टी%20मंडळाबाबत%20संपर्क%20साधत%20आहे.`;
                        } else {
                            waLink.style.display = 'none';
                        }
                    }
                });
            }
        } catch(e) {
            console.error('Failed to load committee', e);
        }
    }

    function isYearVisible(year) {
        return yearVisibilityMap[year] === true;
    }

    async function renderVisibleYearSections() {
        const container = document.getElementById('visibleYearsContent');
        const outer = document.getElementById('visibleYearsContainer');
        const select = document.getElementById('visibleYearSelect');
        if (!container || !outer || !select) return;

        try {
            const [r, visResponse, setResponse] = await Promise.all([
                fetch(API_URL + '/api/years'),
                fetch('/api/year-visibility'),
                fetch('/api/settings')
            ]);
            const d = await r.json();
            const visResult = await visResponse.json();
            const setResult = await setResponse.json();
            
            if (visResult.success) {
                yearVisibilityMap = visResult.data;
            }
            if (setResult.success) {
                appSettings = setResult.data;
            }
            const apiYears = (d.success && d.data) ? d.data : [];

            let panelYears = appSettings['customYearPanels'] || [];
            if (!Array.isArray(panelYears)) panelYears = [];

            const allYears = [...new Set([...apiYears, ...panelYears])].sort().reverse();

            select.style.display = allYears.length ? '' : 'none';
            const prevValue = select.value;
            select.innerHTML = '<option value="">Select Year</option>';
            allYears.forEach(y => {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                select.appendChild(opt);
            });

            const selectedYear = prevValue && allYears.includes(prevValue) ? prevValue : '';
            select.value = selectedYear;
            select.setAttribute('value', selectedYear);

            if (selectedYear) {
                await loadVisibleYearData(selectedYear, container);
            } else {
                container.innerHTML = '<div class="empty-state"><p>Select a year above to view its transaction records.</p></div>';
            }

            if (currentTab === 'ganeshotsav') {
                outer.style.display = 'block';
            } else {
                outer.style.display = 'none';
            }

            select.onchange = async function() {
                this.setAttribute('value', this.value);
                if (this.value) {
                    await loadVisibleYearData(this.value, container);
                } else {
                    container.innerHTML = '<div class="empty-state"><p>Select a year above to view its transaction records.</p></div>';
                }
            };
        } catch (e) {
            console.error('Error loading years:', e);
            container.innerHTML = '<div class="empty-state"><p>Error loading years. Make sure server is running!</p></div>';
            if (currentTab === 'ganeshotsav') {
                outer.style.display = 'block';
            } else {
                outer.style.display = 'none';
            }
        }
    }

    async function loadVisibleYearData(year, container) {
        try {
            const r = await fetch(API_URL + '/api/entries?year=' + year);
            const d = await r.json();
            if (!d.success || !d.data.length) {
                container.innerHTML = `<div class="empty-state"><p>No entries found for ${year}.</p></div>`;
                return;
            }
            const entries = d.data;
            const visible = isYearVisible(year);

            if (!visible) {
                container.innerHTML = `<div class="year-section"><div class="year-section-header"><h2>${year} - Cashbook</h2><div class="section-actions"><button class="btn btn-pdf-view disabled" disabled>View PDF</button><button class="btn btn-pdf-download disabled" disabled>Download PDF</button></div></div><div class="empty-state"><p style="color:var(--text-secondary);">This Year Cashbook Hide By Admin | This Cashbook Visible Soon!!!</p></div></div>`;
                return;
            }

            currentYearEntries = entries;
            currentSelectedYear = year;
            currentYearPage = 1;
            renderVisibleYearData(container);
        } catch (e) {
            console.error('Error loading year ' + year, e);
            container.innerHTML = `<div class="empty-state"><p>Error loading data for ${year}.</p></div>`;
        }
    }

    function changeYearPage(delta) {
        currentYearPage += delta;
        renderVisibleYearData();
    }

    function renderVisibleYearData(container) {
        if (!container) container = document.getElementById('visibleYearsContent');
        const year = currentSelectedYear;
        const entries = currentYearEntries;

        let finalBalance = 0, totalIn = 0, totalOut = 0;
        entries.forEach(e => {
            const ci = parseFloat(e.cash_in) || 0;
            const co = parseFloat(e.cash_out) || 0;
            finalBalance += ci - co;
            totalIn += ci;
            totalOut += co;
        });

        const isMobile = window.innerWidth <= 768;
        const TRANSACTIONS_PER_PAGE = 10;
        const totalPages = Math.ceil(entries.length / TRANSACTIONS_PER_PAGE) || 1;
        
        if (currentYearPage > totalPages) currentYearPage = totalPages;
        if (currentYearPage < 1) currentYearPage = 1;
        
        const from = (currentYearPage - 1) * TRANSACTIONS_PER_PAGE;
        const to = Math.min(from + TRANSACTIONS_PER_PAGE, entries.length);

        let rows = '';
        let runningBalance = 0;
        
        for (let i = 0; i < from; i++) {
            const ci = parseFloat(entries[i].cash_in) || 0;
            const co = parseFloat(entries[i].cash_out) || 0;
            runningBalance += ci - co;
        }

        for (let i = from; i < to; i++) {
            const e = entries[i];
            const ci = parseFloat(e.cash_in) || 0;
            const co = parseFloat(e.cash_out) || 0;
            runningBalance += ci - co;
            const modeClass = e.mode === 'Online' ? 'online' : 'cash';
            rows += '<tr><td>' + (i + 1) + '</td><td class="remark">' + e.name + '</td><td class="date">' + formatDate(e.date) + '</td><td><span class="mode-badge ' + modeClass + '">' + e.mode + '</span></td><td class="cash-in-cell">' + (ci ? '\u20B9' + ci : '-') + '</td><td class="cash-out-cell">' + (co ? '\u20B9' + co : '-') + '</td><td class="balance-cell">\u20B9' + runningBalance + '</td></tr>';
        }

        let html = '<div class="year-section">';
        html += `<div class="year-section-header"><h2>${year} - Cashbook</h2><div class="section-actions">`;
        html += `<button class="btn btn-pdf-view" onclick="viewPDFYear(\'${year}\', this)">View PDF</button>`;
        html += `<button class="btn btn-pdf-download" onclick="downloadPDFYear(\'${year}\', this)">Download PDF</button>`;
        html += '</div></div>';

        html += '<div class="summary-cards">';
        html += '<div class="card card-cash-in"><div class="card-glass"><div class="card-header"><h3>Total Cash In</h3></div><p class="amount">\u20B9' + totalIn + '</p></div></div>';
        html += '<div class="card card-cash-out"><div class="card-glass"><div class="card-header"><h3>Total Cash Out</h3></div><p class="amount">\u20B9' + totalOut + '</p></div></div>';
        html += '<div class="card card-balance"><div class="card-glass"><div class="card-header"><h3>Final Balance</h3></div><p class="amount">\u20B9' + finalBalance + '</p></div></div>';
        html += '</div>';

        html += '<div class="section-actions mobile-only">';
        html += `<button class="btn btn-pdf-view" onclick="viewPDFYear(\'${year}\', this)">View PDF</button>`;
        html += `<button class="btn btn-pdf-download" onclick="downloadPDFYear(\'${year}\', this)">Download PDF</button>`;
        html += '</div>';

        html += `<div class="table-scroll"><table><thead><tr><th>#</th><th>Name</th><th>Date</th><th>Mode</th><th>Cash In</th><th>Cash Out</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        
        if (totalPages > 1) {
            html += '<div class="pdf-pagination table-pagination">';
            html += '<button class="btn btn-secondary" onclick="changeYearPage(-1)" ' + (currentYearPage === 1 ? 'disabled' : '') + '>Previous</button>';
            html += '<span class="pdf-page-info">Page ' + currentYearPage + ' / ' + totalPages + '</span>';
            html += '<button class="btn btn-secondary" onclick="changeYearPage(1)" ' + (currentYearPage === totalPages ? 'disabled' : '') + '>Next</button>';
            html += '</div>';
        }

        html += '</div>';

        container.innerHTML = html;
    }

    async function generatePDFFromHTML(htmlContent, download, filename) {
        const newWindow = window.open('', '_blank');
        if (!newWindow) {
            alert('Please allow popups for this website to view/download PDFs.');
            return;
        }
        
        newWindow.document.write(htmlContent);
        newWindow.document.close();

        setTimeout(() => {
            if (download) {
                newWindow.document.title = filename || 'Cashbook.pdf';
                newWindow.print();
            } else {
                newWindow.document.title = 'View Cashbook';
            }
        }, 500);
    }

    async function viewPDFYear(year, btn) {
        if (!isYearVisible(year)) { alert('This Year Cashbook Hide By Admin. This Cashbook Visible Soon!!!'); return; }
        const originalText = btn ? btn.innerHTML : 'View PDF';
        if (btn) btn.innerHTML = 'Wait...';
        try {
            let entries = [];
            if (year === currentSelectedYear && currentYearEntries.length) {
                entries = currentYearEntries;
            } else {
                const r = await fetch(API_URL + '/api/entries?year=' + year);
                const d = await r.json();
                if (!d.success || !d.data.length) { alert('No entries for ' + year); if (btn) btn.innerHTML = originalText; return; }
                entries = d.data;
            }
            const logoDataURL = await loadLogoForCover();
            const html = await generatePDFHTML(entries, year, logoDataURL);
            await generatePDFFromHTML(html, false);
        } catch(e) { alert('Error: ' + e.message); }
        if (btn) btn.innerHTML = originalText;
    }

    async function downloadPDFYear(year, btn) {
        if (!isYearVisible(year)) { alert('This Year Cashbook Hide By Admin. This Cashbook Visible Soon!!!'); return; }
        const originalText = btn ? btn.innerHTML : 'Download PDF';
        if (btn) btn.innerHTML = 'Wait...';
        try {
            let entries = [];
            if (year === currentSelectedYear && currentYearEntries.length) {
                entries = currentYearEntries;
            } else {
                const r = await fetch(API_URL + '/api/entries?year=' + year);
                const d = await r.json();
                if (!d.success || !d.data.length) { alert('No entries for ' + year); if (btn) btn.innerHTML = originalText; return; }
                entries = d.data;
            }
            const logoDataURL = await loadLogoForCover();
            const html = await generatePDFHTML(entries, year, logoDataURL);
            await generatePDFFromHTML(html, true, `Cashbook_${year}.pdf`);
        } catch(e) { alert('Error: ' + e.message); }
        if (btn) btn.innerHTML = originalText;
    }

    function formatPDFCurrency(amount) {
        const formatted = amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return '₹' + formatted;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `<span class="date-dm">${day} ${month}</span> <span class="date-y">${year}</span>`;
    }

    async function generatePDFHTML(entries, year, logoDataURL) {
        let totalCashIn = 0, totalCashOut = 0, runningBalance = 0;
        const rows = entries.map((entry, index) => {
            runningBalance += entry.cash_in - entry.cash_out;
            totalCashIn += entry.cash_in;
            totalCashOut += entry.cash_out;
            return '<tr><td class="sr-no">' + (index+1) + '</td><td class="remark">' + entry.name + '</td><td class="date">' + formatDate(entry.date) + '</td><td class="mode ' + (entry.mode === 'Online' ? 'online' : 'cash') + '">' + entry.mode + '</td><td class="cash-in-cell">' + (entry.cash_in > 0 ? formatPDFCurrency(entry.cash_in) : '-') + '</td><td class="cash-out-cell">' + (entry.cash_out > 0 ? formatPDFCurrency(entry.cash_out) : '-') + '</td><td class="balance-cell">' + formatPDFCurrency(runningBalance) + '</td></tr>';
        }).join('');
        const finalBalance = totalCashIn - totalCashOut;
        const logoSrc = logoDataURL || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>\uD83D\uDE4F</text></svg>';
        const s = getPDFSettings(year);
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cashbook ${year}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"><style>@media print { @page { margin: 0; size: A4; } body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } } *{box-sizing:border-box;margin:0;padding:0;}body{font-family:\'Poppins\',\'Noto Sans Devanagari\',sans-serif;background:#f5f0eb;color:#1a1a2e;font-size:10px;line-height:1.4;}.cover-page{width:210mm;height:297mm;background:linear-gradient(160deg,#1a0800 0%,#3d1508 25%,#5a2010 50%,#3d1508 75%,#1a0800 100%);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;page-break-after:always;}.cover-page::before{content:\'\';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,140,0,0.15) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(255,215,0,0.1) 0%,transparent 50%);pointer-events:none;}.cover-outer-border{position:absolute;top:8mm;left:8mm;right:8mm;bottom:8mm;border:5px solid #ff8c00;border-radius:25px;box-shadow:0 0 30px rgba(255,140,0,0.3),inset 0 0 30px rgba(255,140,0,0.1);}.cover-inner-border{position:absolute;top:11mm;left:11mm;right:11mm;bottom:11mm;border:3px solid rgba(255,215,0,0.4);border-radius:20px;}.cover-corner{position:absolute;width:60px;height:60px;border:5px solid #ffd700;}.cover-corner.tl{top:14mm;left:14mm;border-right:none;border-bottom:none;border-radius:15px 0 0 0;}.cover-corner.tr{top:14mm;right:14mm;border-left:none;border-bottom:none;border-radius:0 15px 0 0;}.cover-corner.bl{bottom:14mm;left:14mm;border-right:none;border-top:none;border-radius:0 0 0 15px;}.cover-corner.br{bottom:14mm;right:14mm;border-left:none;border-top:none;border-radius:0 0 15px 0;}.cover-content{position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;padding:30px;margin-top:-40px;}.cover-logo-wrap{width:350px;max-width:90vw;height:350px;max-height:90vw;position:relative;margin-bottom:25px;}.cover-logo-glow{position:absolute;top:-30px;left:-30px;right:-30px;bottom:-30px;background:radial-gradient(circle,rgba(255,140,0,0.7) 0%,rgba(255,140,0,0.3) 40%,transparent 70%);border-radius:50%;}.cover-logo-ring{position:absolute;top:-15px;left:-15px;right:-15px;bottom:-15px;border:6px solid rgba(255,215,0,0.7);border-radius:50%;}.cover-logo-ring2{position:absolute;top:-25px;left:-25px;right:-25px;bottom:-25px;border:4px solid rgba(255,215,0,0.3);border-radius:50%;}.cover-logo{width:100%;height:100%;border-radius:50%;border:6px solid #ffd700;box-shadow:0 0 0 6px #ffffff, 0 0 60px rgba(255,140,0,0.8), 0 10px 30px rgba(0,0,0,0.8);background-color:rgba(255,255,255,0.98);background-size:cover;background-position:center;background-repeat:no-repeat;position:relative;z-index:2;box-sizing:border-box;}.cover-mandal-name{font-size:30px;white-space:normal;font-weight:900;color:#ffd700;text-align:center;letter-spacing:2px;text-shadow:0 0 30px rgba(255,215,0,0.6),0 3px 10px rgba(0,0,0,0.7);line-height:1.4;border-left:6px solid #dc2626;border-right:6px solid #dc2626;padding:10px 35px;margin-top:10px;}.cover-divider{width:350px;max-width:80vw;height:4px;background:linear-gradient(90deg,transparent,#ffd700,#ff8c00,#ffd700,transparent);margin:18px auto;border-radius:3px;box-shadow:0 0 15px rgba(255,215,0,0.4);}.cover-subtitle{font-size:24px;font-weight:700;color:#ff8c00;text-align:center;letter-spacing:4px;margin-bottom:8px;text-shadow:0 0 20px rgba(255,140,0,0.5);}.cover-tagline{font-size:15px;color:#d4b896;text-align:center;letter-spacing:1.5px;font-weight:500;}.cover-year-box{margin-top:30px;padding:15px 50px;border:3px solid #ffd700;border-radius:35px;background:linear-gradient(135deg,rgba(255,140,0,0.15),rgba(255,215,0,0.1));text-align:center;box-shadow:0 0 30px rgba(255,215,0,0.2);}.cover-year-label{font-size:14px;color:#d4b896;display:block;margin-bottom:5px;letter-spacing:1px;}.cover-year-val{font-size:30px;font-weight:800;color:#ffd700;text-shadow:0 0 25px rgba(255,215,0,0.5);}.cover-footer{position:absolute;bottom:15mm;left:0;right:0;text-align:center;z-index:10;}.cover-footer-om{font-size:20px;color:#ffd700;margin-bottom:8px;letter-spacing:3px;}.cover-footer p{font-size:10px;color:#8b7355;letter-spacing:1.5px;line-height:1.6;}.inner-page{width:210mm;min-height:297mm;background:#fefcf9;page-break-after:always;position:relative;}.page-header-bar{background:linear-gradient(135deg,#b8860b 0%,#d4a017 40%,#b8860b 100%);position:relative;display:flex;align-items:center;justify-content:center;height:85px;}.page-header-bar::after{content:\'\';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#b8860b,#d4a017,#b8860b);}.header-info{position:absolute;left:0;right:0;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2;}.header-info h1{font-size:26px;font-weight:900;color:#ffffff;letter-spacing:1px;text-shadow:0 2px 6px rgba(0,0,0,0.2);margin:0 0 4px 0;line-height:1.3;display:block;}.header-info p{font-size:16px;color:#ffffff;margin:0;font-weight:600;display:block;}.page-body{padding:18px 15px 15px;}.summary-section{margin-bottom:16px;}.summary-title{font-size:11px;font-weight:800;color:#5a2010;text-align:center;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;}.summary-title::after{content:\'\';display:block;width:70px;height:3px;background:linear-gradient(90deg,#ff8c00,#ffd700);margin:5px auto 0;border-radius:2px;}.summary-row{display:flex;gap:10px;}.sum-card{flex:1;padding:12px 10px;border-radius:10px;text-align:center;position:relative;overflow:hidden;}.sum-card::before{content:\'\';position:absolute;top:0;left:0;right:0;height:4px;}.sum-card.green{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #86efac;}.sum-card.green::before{background:linear-gradient(90deg,#22c55e,#16a34a);}.sum-card.red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border:2px solid #fca5a5;}.sum-card.red::before{background:linear-gradient(90deg,#ef4444,#dc2626);}.sum-card.purple{background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:2px solid #d8b4fe;}.sum-card.purple::before{background:linear-gradient(90deg,#a855f7,#9333ea);}.sum-card h4{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#888;margin:0 0 6px;}.sum-card .val{font-size:16px;font-weight:900;}.sum-card.green .val{color:#16a34a;}.sum-card.red .val{color:#dc2626;}.sum-card.purple .val{color:#9333ea;}.table-section{margin-top:12px;}.table-heading{font-size:11px;font-weight:800;color:#5a2010;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-left:14px;position:relative;}.table-heading::before{content:\'\';position:absolute;left:0;top:50%;transform:translateY(-50%);width:8px;height:8px;background:#ff8c00;border-radius:50%;}.table-heading::after{content:\'\';display:block;width:50px;height:3px;background:linear-gradient(90deg,#ff8c00,#ffd700);margin-top:5px;border-radius:2px;}.data-table{width:100%;table-layout:fixed;border-collapse:collapse;border-radius:6px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);border:1.5px solid #bbbbbb;}.data-table thead{background:#f8f4f0;}.data-table th{color:#000000 !important;padding:10px 8px;font-size:13px;font-weight:900 !important;text-transform:uppercase;letter-spacing:0.3px;border:1px solid #bbbbbb;text-align:left;}.data-table th.right-align{text-align:right;}.data-table td{padding:8px;font-size:13px;border:1px solid #dddddd;}.data-table tbody tr:nth-child(odd){background:#ffffff;}.data-table tbody tr:nth-child(even){background:#f9f9f9;}.data-table .sr-no{text-align:center;font-weight:600;color:#000000;width:6%;}.data-table .remark{font-weight:600;color:#000000;width:28%;}.data-table .date{color:#000000;font-weight:500;width:13%;}.data-table .mode{text-align:center;font-weight:600;width:9%;color:#000000;}.data-table .cash-in-cell{text-align:right;font-weight:700;color:#16a34a;width:14%;}.data-table .cash-out-cell{text-align:right;font-weight:700;color:#dc2626;width:14%;}.data-table .balance-cell{text-align:right;font-weight:800;color:#7c3aed;width:16%;}.page-footer{margin-top:15px;text-align:center;}.page-footer .org{font-size:16px;font-weight:800;color:#1e293b;margin-bottom:8px;}.page-footer .dev{font-size:13px;color:#475569;font-weight:600;}.page-footer .dt{font-size:11px;color:#64748b;margin-top:5px;}
        /* Advanced Mobile Responsiveness */
        @media (max-width: 768px) {
            .niyojan-item {
                flex-direction: column !important;
                gap: 10px !important;
                padding: 15px !important;
            }
            .niyojan-item > div:first-child {
                width: 100% !important;
                min-width: 100% !important;
                display: flex;
                flex-direction: row !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 10px;
                border-radius: 8px !important;
            }
            .niyojan-item > div:first-child .fas {
                margin-bottom: 0 !important;
                margin-right: 8px;
            }
            .niyojan-item > div:first-child > div:first-child {
                display: flex;
                align-items: center;
            }
            
            div[style*="border-left: 3px solid #ffcc00"] {
                flex-direction: column !important;
                gap: 15px !important;
                align-items: flex-start !important;
            }
            div[style*="border-left: 3px solid #ffcc00"] > div:last-child {
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }
            
            .main-banner h1 {
                font-size: 2.2rem !important;
            }
            .custom-header {
                padding: 10px 15px !important;
            }
            /* Add some padding for the floating input in mobile view */
            .floating-label input, .floating-label textarea, .floating-label select {
                font-size: 16px; /* prevent iOS zoom */
            }
        }

        /* Laptop View optimizations */
        @media (min-width: 1024px) {
            .niyojan-item {
                padding: 20px 30px !important;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .niyojan-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.4) !important;
            }
        }

    
/* Premium Aesthetic Enhancements */
.event-card, .committee-card, .expense-card {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.event-card:hover, .committee-card:hover, .expense-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.1) inset;
    border-color: var(--primary-color);
}
.committee-card:hover img {
    transform: scale(1.05);
}
.btn, .action-btn {
    transition: all 0.2s ease;
}
.btn:active, .action-btn:active {
    transform: scale(0.95);
}
\n
/* Premium Aesthetic Enhancements */
.card, .list-container, .event-card, .committee-card, .expense-card {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.card:hover, .list-container:hover, .event-card:hover, .committee-card:hover, .expense-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 204, 0, 0.15);
    border-color: var(--primary);
}
.btn, .btn-outline, .action-btn {
    transition: all 0.2s ease;
}
.btn:active, .btn-outline:active, .action-btn:active {
    transform: scale(0.95);
}
.item-row {
    transition: background 0.2s;
}
.item-row:hover {
    background: rgba(255, 204, 0, 0.1);
}
/* Responsive Tables */
.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
}
table {
    width: 100%;
    min-width: 500px; /* Ensures table doesn't squish too much on mobile */
}
/* Form Grid Mobile Fix */
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr !important;
    }
}

</style></head><body><div class="cover-page"><div class="cover-outer-border"></div><div class="cover-inner-border"></div><div class="cover-corner tl"></div><div class="cover-corner tr"></div><div class="cover-corner bl"></div><div class="cover-corner br"></div><div class="cover-content"><div class="cover-logo-wrap"><div class="cover-logo-glow"></div><div class="cover-logo-ring"></div><div class="cover-logo-ring2"></div><div class="cover-logo" style="background-image: url('${logoSrc}');"></div></div><div class="cover-mandal-name">${s.orgName.includes('शिवसृष्टी') ? '<div style="font-size:1.9em; font-weight:900; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;">शिवसृष्टी</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00; margin-bottom:5px;">सार्वजनिक उत्सव मंडळ</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00;">संगमनेर <span style="color:#d32f2f;">🚩</span></div>' : s.orgName}</div><div class="cover-divider"></div><div class="cover-subtitle">${s.subtitle}</div><div class="cover-tagline">${s.tagline}</div><div class="cover-year-box"><span class="cover-year-label">\u0935\u0930\u094D\u0937 / Year</span><span class="cover-year-val">${year}</span></div></div><div class="cover-footer"><div class="cover-footer-om">ॐ गण गणपतये नमः</div><p>Developed by | Dhananjay Ranate</p></div></div><div class="inner-page"><div class="page-header-bar"><div class="header-info"><h1>${s.headerOrgName || s.orgName}</h1><p>${s.headerSubtitle || s.subtitle} \u2014 \u0935\u0930\u094D\u0937: ${year}</p></div></div><div class="page-body"><div class="summary-section"><div class="summary-title">Financial Summary</div><div class="summary-row"><div class="sum-card green"><h4>Total Cash In</h4><div class="val">${formatPDFCurrency(totalCashIn)}</div></div><div class="sum-card red"><h4>Total Cash Out</h4><div class="val">${formatPDFCurrency(totalCashOut)}</div></div><div class="sum-card purple"><h4>Final Balance</h4><div class="val">${formatPDFCurrency(finalBalance)}</div></div></div></div><div class="table-section"><div class="table-heading">Transaction Records</div><table class="data-table"><thead><tr><th class="sr-no">#</th><th class="remark">Name</th><th class="date">Date</th><th class="mode">Mode</th><th class="right-align">Cash In</th><th class="right-align">Cash Out</th><th class="right-align">Balance</th></tr></thead><tbody>${rows}</tbody></table><div style=\"height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin:12px 0 8px 0;border-radius:2px;\"></div><div style=\"display:flex; justify-content:space-between; margin-top:30px; padding:0 30px;\"><div style=\"text-align:center;\"><div style=\"font-weight:800; font-size:15px; color:#5a2010; margin-bottom:5px;\">अध्यक्ष</div><div style=\"font-weight:700; font-size:16px; color:#1a1a2e;\">तेजस फटांगरे</div><div style=\"font-size:13px; color:#555555; margin-top:3px;\">मो. नं - 9370599259</div></div><div style=\"text-align:center;\"><div style=\"font-weight:800; font-size:15px; color:#5a2010; margin-bottom:5px;\">खजिनदार</div><div style=\"font-weight:700; font-size:16px; color:#1a1a2e;\">धनंजय रणाते</div><div style=\"font-size:13px; color:#555555; margin-top:3px;\">मो. नं - 9322134560</div></div></div></div><div class="page-footer" style=\"margin-top:40px; padding-bottom:20px;\"><div style=\"margin-bottom:8px; font-weight:600; font-size:13px; color:#1a1a2e; text-align:center;\">अधिकृत वेबसाईट : <a href=\"https://shivsrushti-utsav-mandal.onrender.com\" target=\"_blank\" style=\"color:#0000ee; text-decoration:none;\">https://shivsrushti-utsav-mandal.onrender.com</a></div><div class="dev" style=\"font-size:13px; color:#475569; font-weight:600; text-align:center;\">Developed by | Dhananjay Ranate</div></div></div></div></body></html>`;
    }

    function renderPDFCards(from, to) {
        const slice = uploadedPDFsData.slice(from, to);
        return slice.map((pdf, idx) => {
            const s = getPDFSettings(pdf.year);
            const pOrg = pdf.orgName || s.orgName;
            const pSub = pdf.subtitle || s.subtitle;
            const pTag = pdf.tagline || s.tagline;
            const escSub = (pdf.subtitle || '').replace(/'/g, "\\'");
            const escTag = (pdf.tagline || '').replace(/'/g, "\\'");
            const escOrg = (pdf.orgName || '').replace(/'/g, "\\'");
            return `
            <div class="pdf-card-home" style="animation-delay: ${idx * 0.1}s">
                <div class="pdf-card-cover-mini">
                    <div class="mini-mandal">${pOrg}</div>
                    <div class="mini-divider"></div>
                    <div class="mini-subtitle">${pSub}</div>
                    <div class="mini-tagline">${pTag}</div>
                    <div class="mini-year">${pdf.year}</div>
                </div>
                <div class="pdf-card-title">${pdf.displayName.replace('.pdf', '')}</div>
                <div class="pdf-card-actions">
                    <button onclick="viewPDFHome('${pdf.filename}', '${pdf.year}', '${escSub}', '${escTag}', '${escOrg}', this)" class="pdf-card-btn view">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                    </button>
                    <button onclick="downloadPDFHome('${pdf.filename}', '${pdf.year}', '${escSub}', '${escTag}', '${escOrg}', this)" class="pdf-card-btn download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    function renderPagination() {
        const perPage = getPDFsPerPage();
        const totalPages = Math.ceil(uploadedPDFsData.length / perPage);
        return `
            <div class="pdf-pagination">
                <button class="btn btn-secondary ripple" onclick="goToPDFPage(${uploadedPDFsPage - 1})" ${uploadedPDFsPage === 0 ? 'disabled' : ''}>
                    Previous
                </button>
                <span class="pdf-page-info">page ${uploadedPDFsPage + 1}/${totalPages}</span>
                <button class="btn btn-secondary ripple" onclick="goToPDFPage(${uploadedPDFsPage + 1})" ${uploadedPDFsPage >= totalPages - 1 ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;
    }

    async function loadUploadedPDFsHome() {
        const grid = document.getElementById('uploadedPdfsGrid');
        if (!grid) return;

        try {
            const response = await fetch(API_URL + '/api/uploaded-pdfs');
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                uploadedPDFsData = result.data;
                uploadedPDFsPage = 0;
                const perPage = getPDFsPerPage();
                const to = Math.min(perPage, uploadedPDFsData.length);
                grid.innerHTML = renderPDFCards(0, to) + renderPagination();
            } else {
                grid.innerHTML = '<div class="pdf-loading">No previous year PDFs uploaded yet.</div>';
            }
        } catch (error) {
            grid.innerHTML = '<div class="pdf-loading" style="color: var(--red);">Error: Server not running! Start server with: node server.js</div>';
        }
    }

    function goToPDFPage(page) {
        const grid = document.getElementById('uploadedPdfsGrid');
        if (!grid) return;
        const perPage = getPDFsPerPage();
        const totalPages = Math.ceil(uploadedPDFsData.length / perPage);
        if (page < 0 || page >= totalPages) return;
        uploadedPDFsPage = page;
        const from = page * perPage;
        const to = Math.min(from + perPage, uploadedPDFsData.length);
        grid.innerHTML = renderPDFCards(from, to) + renderPagination();
    }

    // ===== CLIENT-SIDE COVER PDF GENERATION FOR UPLOADED PDFs =====
    // Generates the same rich cover page as panel-generated PDFs,
    // then merges it with uploaded PDF content via pdf-lib.

    function loadLogoForCover() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                resolve(canvas.toDataURL('image/jpeg'));
            };
            img.onerror = () => resolve('');
            img.src = 'logo/logo.jpeg';
        });
    }

    function createCoverHTML(year, logoSrc, pdfSubtitle, pdfTagline, pdfOrgName) {
        const fb = getPDFSettings(year);
        const s = {
            orgName: pdfOrgName || fb.orgName,
            subtitle: pdfSubtitle || fb.subtitle,
            tagline: pdfTagline || fb.tagline
        };
        return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
@page{margin:0;size:A4;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Poppins','Noto Sans Devanagari',sans-serif;background:#f5f0eb;color:#1a1a2e;font-size:10px;line-height:1.4;}
.cover-page{width:210mm;height:297mm;background:linear-gradient(160deg,#1a0800 0%,#3d1508 25%,#5a2010 50%,#3d1508 75%,#1a0800 100%);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.cover-page::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,140,0,0.15) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(255,215,0,0.1) 0%,transparent 50%);pointer-events:none;}
.cover-outer-border{position:absolute;top:8mm;left:8mm;right:8mm;bottom:8mm;border:5px solid #ff8c00;border-radius:25px;box-shadow:0 0 30px rgba(255,140,0,0.3),inset 0 0 30px rgba(255,140,0,0.1);}
.cover-inner-border{position:absolute;top:11mm;left:11mm;right:11mm;bottom:11mm;border:3px solid rgba(255,215,0,0.4);border-radius:20px;}
.cover-corner{position:absolute;width:60px;height:60px;border:5px solid #ffd700;}
.cover-corner.tl{top:14mm;left:14mm;border-right:none;border-bottom:none;border-radius:15px 0 0 0;}
.cover-corner.tr{top:14mm;right:14mm;border-left:none;border-bottom:none;border-radius:0 15px 0 0;}
.cover-corner.bl{bottom:14mm;left:14mm;border-right:none;border-top:none;border-radius:0 0 0 15px;}
.cover-corner.br{bottom:14mm;right:14mm;border-left:none;border-top:none;border-radius:0 0 15px 0;}
.cover-content{position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;padding:30px;margin-top:-40px;}
.cover-logo-wrap{width:350px;max-width:90vw;height:350px;max-height:90vw;position:relative;margin-bottom:25px;}
.cover-logo-glow{position:absolute;top:-30px;left:-30px;right:-30px;bottom:-30px;background:radial-gradient(circle,rgba(255,140,0,0.7) 0%,rgba(255,140,0,0.3) 40%,transparent 70%);border-radius:50%;}
.cover-logo-ring{position:absolute;top:-15px;left:-15px;right:-15px;bottom:-15px;border:6px solid rgba(255,215,0,0.7);border-radius:50%;}
.cover-logo-ring2{position:absolute;top:-25px;left:-25px;right:-25px;bottom:-25px;border:4px solid rgba(255,215,0,0.3);border-radius:50%;}
.cover-logo{width:100%;height:100%;border-radius:50%;border:6px solid #ffd700;box-shadow:0 0 0 6px #ffffff, 0 0 60px rgba(255,140,0,0.8), 0 10px 30px rgba(0,0,0,0.8);background-color:rgba(255,255,255,0.98);background-size:cover;background-position:center;background-repeat:no-repeat;position:relative;z-index:2;box-sizing:border-box;}
.cover-mandal-name{font-size:36px;font-weight:900;color:#ffd700;text-align:center;letter-spacing:2px;text-shadow:0 0 30px rgba(255,215,0,0.6),0 3px 10px rgba(0,0,0,0.7);line-height:1.4;border-left:6px solid #dc2626;border-right:6px solid #dc2626;border-left:6px solid #dc2626;border-right:6px solid #dc2626;padding:10px 35px;margin-top:10px;}
.cover-divider{width:350px;max-width:80vw;height:4px;background:linear-gradient(90deg,transparent,#ffd700,#ff8c00,#ffd700,transparent);margin:18px auto;border-radius:3px;box-shadow:0 0 15px rgba(255,215,0,0.4);}
.cover-subtitle{font-size:24px;font-weight:700;color:#ff8c00;text-align:center;letter-spacing:4px;margin-bottom:8px;text-shadow:0 0 20px rgba(255,140,0,0.5);}
.cover-tagline{font-size:15px;color:#d4b896;text-align:center;letter-spacing:1.5px;font-weight:500;}
.cover-year-box{margin-top:30px;padding:15px 50px;border:3px solid #ffd700;border-radius:35px;background:linear-gradient(135deg,rgba(255,140,0,0.15),rgba(255,215,0,0.1));text-align:center;box-shadow:0 0 30px rgba(255,215,0,0.2);}
.cover-year-label{font-size:14px;color:#d4b896;display:block;margin-bottom:5px;letter-spacing:1px;}
.cover-year-val{font-size:30px;font-weight:800;color:#ffd700;text-shadow:0 0 25px rgba(255,215,0,0.5);}
.cover-footer{position:absolute;bottom:15mm;left:0;right:0;text-align:center;z-index:10;}
.cover-footer-om{font-size:20px;color:#ffd700;margin-bottom:8px;letter-spacing:3px;}
.cover-footer p{font-size:10px;color:#8b7355;letter-spacing:1.5px;line-height:1.6;}

        /* Advanced Mobile Responsiveness */
        @media (max-width: 768px) {
            .niyojan-item {
                flex-direction: column !important;
                gap: 10px !important;
                padding: 15px !important;
            }
            .niyojan-item > div:first-child {
                width: 100% !important;
                min-width: 100% !important;
                display: flex;
                flex-direction: row !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 10px;
                border-radius: 8px !important;
            }
            .niyojan-item > div:first-child .fas {
                margin-bottom: 0 !important;
                margin-right: 8px;
            }
            .niyojan-item > div:first-child > div:first-child {
                display: flex;
                align-items: center;
            }
            
            div[style*="border-left: 3px solid #ffcc00"] {
                flex-direction: column !important;
                gap: 15px !important;
                align-items: flex-start !important;
            }
            div[style*="border-left: 3px solid #ffcc00"] > div:last-child {
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }
            
            .main-banner h1 {
                font-size: 2.2rem !important;
            }
            .custom-header {
                padding: 10px 15px !important;
            }
            /* Add some padding for the floating input in mobile view */
            .floating-label input, .floating-label textarea, .floating-label select {
                font-size: 16px; /* prevent iOS zoom */
            }
        }

        /* Laptop View optimizations */
        @media (min-width: 1024px) {
            .niyojan-item {
                padding: 20px 30px !important;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .niyojan-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.4) !important;
            }
        }

    
/* Premium Aesthetic Enhancements */
.event-card, .committee-card, .expense-card {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.event-card:hover, .committee-card:hover, .expense-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.1) inset;
    border-color: var(--primary-color);
}
.committee-card:hover img {
    transform: scale(1.05);
}
.btn, .action-btn {
    transition: all 0.2s ease;
}
.btn:active, .action-btn:active {
    transform: scale(0.95);
}
\n
/* Premium Aesthetic Enhancements */
.card, .list-container, .event-card, .committee-card, .expense-card {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.card:hover, .list-container:hover, .event-card:hover, .committee-card:hover, .expense-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 204, 0, 0.15);
    border-color: var(--primary);
}
.btn, .btn-outline, .action-btn {
    transition: all 0.2s ease;
}
.btn:active, .btn-outline:active, .action-btn:active {
    transform: scale(0.95);
}
.item-row {
    transition: background 0.2s;
}
.item-row:hover {
    background: rgba(255, 204, 0, 0.1);
}
/* Responsive Tables */
.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
}
table {
    width: 100%;
    min-width: 500px; /* Ensures table doesn't squish too much on mobile */
}
/* Form Grid Mobile Fix */
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr !important;
    }
}

</style></head><body>
<div class="cover-page">
  <div class="cover-outer-border"></div>
  <div class="cover-inner-border"></div>
  <div class="cover-corner tl"></div>
  <div class="cover-corner tr"></div>
  <div class="cover-corner bl"></div>
  <div class="cover-corner br"></div>
  <div class="cover-content">
    <div class="cover-logo-wrap">
      <div class="cover-logo-glow"></div>
      <div class="cover-logo-ring"></div>
      <div class="cover-logo-ring2"></div>
      <div class="cover-logo" style="background-image: url('${logoSrc}');"></div>
      </div>
      <div class="cover-mandal-name">${s.orgName.includes('शिवसृष्टी') ? '<div style="font-size:1.9em; font-weight:900; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;">शिवसृष्टी</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00; margin-bottom:5px;">सार्वजनिक उत्सव मंडळ</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00;">संगमनेर <span style="color:#d32f2f;">🚩</span></div>' : s.orgName}</div>
    <div class="cover-divider"></div>
    <div class="cover-subtitle">${s.subtitle}</div>
    <div class="cover-tagline">${s.tagline}</div>
    <div class="cover-year-box">
      <span class="cover-year-label">\u0935\u0930\u094D\u0937 / Year</span>
      <span class="cover-year-val">${year}</span>
    </div>
  </div>
  <div class="cover-footer">
    <div class="cover-footer-om">\u0950 \u0917\u0923 \u0917\u0923\u092A\u0924\u092F\u0947 \u0928\u092E\u0903</div>
    <p>Developed by | Dhananjay Ranate</p>
  </div>
</div>
    </body></html>`;
    }

    let cachedLogo = '';

    
    async function loadPDFLibraries() {
        if (window.jsPDF && window.html2canvas && window.PDFLib) return true;
        
        return new Promise((resolve, reject) => {
            let loaded = 0;
            const scripts = [
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'
            ];
            
            function loadNext() {
                if (loaded >= scripts.length) {
                    resolve(true);
                    return;
                }
                const s = document.createElement('script');
                s.src = scripts[loaded];
                s.onload = () => { loaded++; loadNext(); };
                s.onerror = reject;
                document.head.appendChild(s);
            }
            loadNext();
        });
    }

    async function generateAndOpenMergedPDF(filename, year, download, pdfSubtitle, pdfTagline, pdfOrgName) {
        await loadPDFLibraries();
        window.jsPDF = window.jspdf.jsPDF;
        try {
            const logoDataURL = await loadLogoForCover();
            const coverHTML = createCoverHTML(year, logoDataURL, pdfSubtitle, pdfTagline, pdfOrgName);
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.top = '-9999px';
            iframe.style.width = '210mm';
            iframe.style.height = '297mm';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);
            iframe.contentDocument.write(coverHTML);
            iframe.contentDocument.close();
            const imgs = iframe.contentDocument.querySelectorAll('img');
            await Promise.all([...imgs].map(img => new Promise(r => {
                if (img.complete) r(); else { img.onload = r; img.onerror = r; setTimeout(r, 2000); }
            })));
            try { await iframe.contentDocument.fonts.ready; } catch(e) {}
            await new Promise(r => setTimeout(r, 500));
            const canvas = await html2canvas(iframe.contentDocument.body, {
                scale: 2, useCORS: true, backgroundColor: '#ffffff', allowTaint: true
            });
            document.body.removeChild(iframe);
            const { jsPDF } = window.jspdf;
            const coverDoc = new jsPDF('p', 'mm', 'a4');
            const pgW = coverDoc.internal.pageSize.getWidth();
            const imgH = (canvas.height * pgW) / canvas.width;
            coverDoc.addImage(canvas.toDataURL('image/jpeg', 0.6), 'JPEG', 0, 0, pgW, imgH);
            const coverBytes = coverDoc.output('arraybuffer');
            
            const resp = await fetch((typeof API_URL !== 'undefined' ? API_URL : '') + '/uploads/' + filename);
            const uploadBytes = await resp.arrayBuffer();
            
            const { PDFDocument } = window.PDFLib;
            const mergedPdf = await PDFDocument.create();
            
            const coverPdf = await PDFDocument.load(coverBytes);
            const cPgs = await mergedPdf.copyPages(coverPdf, coverPdf.getPageIndices());
            cPgs.forEach(p => mergedPdf.addPage(p));
            
            const existingPdf = await PDFDocument.load(uploadBytes);
            const indices = existingPdf.getPageIndices();
            const uPgs = await mergedPdf.copyPages(existingPdf, indices);
            uPgs.forEach(p => mergedPdf.addPage(p));
            
            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            if (download) {
                const a = document.createElement('a');
                a.href = url;
                a.download = `Ganpati_Cashbook_${year}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 10000);
            } else {
                window.open(url, '_blank');
            }
        } catch (error) {
            console.error('PDF merge error:', error);
            alert('Error generating PDF. Make sure server is running!');
        }
    }

    async function viewPDFHome(filename, year, subtitle, tagline, orgName, btn) {
        const originalText = btn ? btn.innerHTML : 'View';
        if (btn) btn.innerHTML = 'Wait...';
        await generateAndOpenMergedPDF(filename, year, false, subtitle, tagline, orgName);
        if (btn) btn.innerHTML = originalText;
    }

    async function downloadPDFHome(filename, year, subtitle, tagline, orgName, btn) {
        const originalText = btn ? btn.innerHTML : 'Download';
        if (btn) btn.innerHTML = 'Wait...';
        await generateAndOpenMergedPDF(filename, year, true, subtitle, tagline, orgName);
        if (btn) btn.innerHTML = originalText;
    }
    

    let cachedDonationCanvas = null;
    let cachedCustomCanvases = { vargani: null, mahaprasad: null };

    async function captureDonationPoster() {
    if (cachedDonationCanvas) return cachedDonationCanvas;
    const card = document.querySelector('.donation-card');
    
    const clone = card.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    
    // Force dimensions to trigger desktop media queries in html2canvas
    clone.style.width = '900px';
    clone.style.maxWidth = '900px';
    clone.style.background = '#1a1a1a';
    clone.style.padding = '30px';
    
    // Important: DO NOT make the main card row direction!
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.alignItems = 'center';
    
    document.body.appendChild(clone);
    
    const actions = clone.querySelector('#donationActions');
    const customActions = clone.querySelector('#customPosterActions');
    const title = clone.querySelector('.section-title');
    
    if(actions) actions.style.display = 'none';
    if(customActions) customActions.style.display = 'none';
    if(title) title.style.display = 'none';
    
    // The internal wrapper must be forced to row layout if media query doesn't trigger
    const wrapper = clone.querySelector('.donation-content-wrapper');
    if(wrapper) {
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'row';
        wrapper.style.justifyContent = 'space-around';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.width = '100%';
    }
    
    const mandalPoster = document.createElement('img');
    mandalPoster.style.width = '100%';
    mandalPoster.style.height = 'auto';
    mandalPoster.style.borderRadius = '15px';
    mandalPoster.style.marginBottom = '25px';
    mandalPoster.style.display = 'block';
    mandalPoster.style.objectFit = 'contain';

    await new Promise((resolve) => {
        mandalPoster.onload = resolve;
        mandalPoster.onerror = resolve;
        mandalPoster.src = 'logo/Receipt.jpeg'; 
        clone.insertBefore(mandalPoster, clone.firstChild);
    });
    
    const tempWebsiteUrl = document.createElement('div');
    tempWebsiteUrl.style.color = '#e0e0e0';
    tempWebsiteUrl.style.textAlign = 'center';
    tempWebsiteUrl.style.fontSize = '18px';
    tempWebsiteUrl.style.marginBottom = '25px';
    tempWebsiteUrl.style.marginTop = '-10px';
    tempWebsiteUrl.style.fontFamily = "'Poppins', sans-serif";
    tempWebsiteUrl.innerHTML = 'अधिकृत वेबसाईट: <span style="color: #ffd700;">https://shivsrushti-utsav-mandal.onrender.com</span>';
    clone.insertBefore(tempWebsiteUrl, mandalPoster.nextSibling);
    
    const devWatermark1 = document.createElement('div');
    devWatermark1.style.color = 'rgba(255, 255, 255, 0.7)';
    devWatermark1.style.textShadow = '0px 1px 3px rgba(0,0,0,0.8)';
    devWatermark1.style.textAlign = 'center';
    devWatermark1.style.fontSize = '14px';
    devWatermark1.style.marginTop = '20px';
    devWatermark1.style.width = '100%';
    devWatermark1.style.fontFamily = "'Poppins', sans-serif";
    devWatermark1.innerHTML = 'Developed by | Dhananjay Ranate';
    clone.appendChild(devWatermark1);
    
    const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1a1a1a',
        windowWidth: 1200
    });
    
    document.body.removeChild(clone);
    cachedDonationCanvas = canvas;
    return canvas;
}

    
    async function captureCustomPoster(type) {
        if (cachedCustomCanvases[type]) return cachedCustomCanvases[type];
        
        // Create a new container matching the donation card style
        const clone = document.createElement('div');
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '-9999px';
        clone.style.width = '900px';
        clone.style.maxWidth = '900px';
        clone.style.background = '#1a1a1a';
        clone.style.padding = '30px';
        clone.style.display = 'flex';
        clone.style.flexDirection = 'column';
        clone.style.alignItems = 'center';
        clone.style.borderRadius = '15px';
        clone.style.border = '1px solid #333';
        document.body.appendChild(clone);

        // Add Banner Image
        const mandalPoster = document.createElement('img');
        mandalPoster.style.width = '100%';
        mandalPoster.style.height = 'auto';
        mandalPoster.style.borderRadius = '15px';
        mandalPoster.style.marginBottom = '25px';
        mandalPoster.style.display = 'block';
        mandalPoster.style.objectFit = 'contain';

        await new Promise((resolve) => {
            mandalPoster.onload = resolve;
            mandalPoster.onerror = resolve;
            mandalPoster.src = 'logo/Receipt.jpeg'; 
            clone.appendChild(mandalPoster);
        });

        // Add Website Link
        const tempWebsiteUrl = document.createElement('div');
        tempWebsiteUrl.style.color = '#e0e0e0';
        tempWebsiteUrl.style.textAlign = 'center';
        tempWebsiteUrl.style.fontSize = '18px';
        tempWebsiteUrl.style.marginBottom = '25px';
        tempWebsiteUrl.style.marginTop = '-10px';
        tempWebsiteUrl.style.fontFamily = "'Poppins', sans-serif";
        tempWebsiteUrl.innerHTML = 'अधिकृत वेबसाईट: <span style="color: #ffd700;">https://shivsrushti-utsav-mandal.onrender.com</span>';
        clone.appendChild(tempWebsiteUrl);

        // Add Title
        const defaultTitle = type === 'vargani' ? 'वर्गणी आभार' : 'महाप्रसाद निमंत्रण';
        let userTitle = defaultTitle;
        if (window.appSettings) {
            userTitle = type === 'vargani' 
                ? (window.appSettings.varganiAabharTitle || defaultTitle)
                : (window.appSettings.mahaprasadNimantranTitle || defaultTitle);
        }
        const titleHtml = `
            <div class="section-header" style="width: 100%; justify-content: center;">
                <div class="header-line"></div>
                <h2>${userTitle}</h2>
                <div class="header-line"></div>
            </div>`;
        clone.insertAdjacentHTML('beforeend', titleHtml);

        // Add Custom Text Content
        let customText = '';
        if (window.appSettings) {
            customText = type === 'vargani' 
                ? (window.appSettings.varganiAabharText || 'येथे वर्गणी आभार संदेश येईल.') 
                : (window.appSettings.mahaprasadNimantranText || 'येथे महाप्रसाद निमंत्रण संदेश येईल.');
        } else {
            customText = type === 'vargani' ? 'येथे वर्गणी आभार संदेश येईल.' : 'येथे महाप्रसाद निमंत्रण संदेश येईल.';
        }

        const textContainer = document.createElement('div');
        textContainer.style.width = '100%';
        textContainer.style.background = 'rgba(255,255,255,0.05)';
        textContainer.style.padding = '40px';
        textContainer.style.borderRadius = '15px';
        textContainer.style.border = '1px solid rgba(255,255,255,0.1)';
        textContainer.style.color = '#e0e0e0';
        textContainer.style.fontSize = '24px';
        textContainer.style.lineHeight = '1.8';
        textContainer.style.textAlign = 'center';
        textContainer.style.whiteSpace = 'pre-wrap';
        textContainer.style.fontFamily = "'Poppins', sans-serif";
        textContainer.textContent = customText;
        clone.appendChild(textContainer);
        
        const devWatermark2 = document.createElement('div');
        devWatermark2.style.color = 'rgba(255, 255, 255, 0.7)';
        devWatermark2.style.textShadow = '0px 1px 3px rgba(0,0,0,0.8)';
        devWatermark2.style.textAlign = 'center';
        devWatermark2.style.fontSize = '14px';
        devWatermark2.style.marginTop = '20px';
        devWatermark2.style.width = '100%';
        devWatermark2.style.fontFamily = "'Poppins', sans-serif";
        devWatermark2.innerHTML = 'Developed by | Dhananjay Ranate';
        clone.appendChild(devWatermark2);

        // Capture with html2canvas
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#1a1a1a',
            windowWidth: 1200
        });

        document.body.removeChild(clone);
        cachedCustomCanvases[type] = { canvas, text: customText };
        return cachedCustomCanvases[type];
    }

    async function shareCustomPoster(type, btn) {
        let originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        
        try {
            const result = await captureCustomPoster(type);
            const canvas = result.canvas;
            const customText = result.text;
            
            canvas.toBlob(async (blob) => {
                const fileName = type === 'vargani' ? 'Vargani_Aabhar.jpg' : 'Mahaprasad_Nimantran.jpg';
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                
                const orgName = (typeof appSettings !== 'undefined' && appSettings.pdfCustomSettings && appSettings.pdfCustomSettings.orgName) ? appSettings.pdfCustomSettings.orgName : 'मंडळ';
                const shareTitle = type === 'vargani' ? 'वर्गणी आभार' : 'महाप्रसाद निमंत्रण';
                
                const shareData = {
                    title: orgName + ' - ' + shareTitle,
                    text: customText + '\n\n🌐 अधिकृत वेबसाईट:\nhttps://shivsrushti-utsav-mandal.onrender.com',
                    files: [file]
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share(shareData);
                } else {
                    // Download fallback
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = canvas.toDataURL('image/jpeg', 0.9);
                    link.click();
                    alert('तुमच्या डिव्हाइसवर डायरेक्ट इमेज शेअरिंग सपोर्टेड नाही. इमेज डाउनलोड झाली आहे, ती तुम्ही स्वतः शेअर करू शकता.');
                }
                
                if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
            }, 'image/jpeg', 0.9);
        } catch (err) {
            console.error('Error sharing custom poster:', err);
            alert('पोस्टर तयार करताना किंवा शेअर करताना त्रुटी आली.');
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }

    async function downloadDonationImage(btn) {
        let originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        
        try {
            const canvas = await captureDonationPoster();
            const link = document.createElement('a');
            link.download = 'Donation_Poster.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        } catch(err) {
            console.error('Error generating image:', err);
            alert('इमेज तयार करताना त्रुटी आली.');
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }

    async function shareDonationImage(btn) {
        let originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        
        try {
            const canvas = await captureDonationPoster();
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'Donation_Poster.jpg', { type: 'image/jpeg' });
                
                const orgName = (typeof appSettings !== 'undefined' && appSettings.pdfCustomSettings && appSettings.pdfCustomSettings.orgName) ? appSettings.pdfCustomSettings.orgName : 'मंडळ';
                const shareData = {
                    title: orgName + ' - देणगी',
                    text: `🌺 श्री गणेशाय नमः 🌺\n\nश्री गणेशोत्सव हा आपल्या सर्वांचा उत्सव आहे. या उत्सवाचे आयोजन अधिक भव्य, दिव्य आणि यशस्वी करण्यासाठी आपल्या सहकार्याची आम्हाला मनापासून अपेक्षा आहे.\n\nकृपया आपल्या सार्वजनिक गणेश उत्सव मंडळासाठी किमान ₹1111/- (एक हजार एकशे अकरा रुपये) वर्गणी/देणगी देऊन सहकार्य करा.\nआपण वर दिलेल्या QR कोड स्कॅन करून / UPI ID किंवा फोन नंबर द्वारे सहज देणगी देऊ शकता.\n\nआपले प्रत्येक योगदान आपल्या मंडळाचा गणेशोत्सव अधिक उत्साहाने, भक्तिभावाने आणि दिमाखात साजरा करण्यासाठी मोलाचे ठरेल. 🙏🌸\n\n॥ गणपती बाप्पा मोरया ॥\n॥ मंगलमूर्ती मोरया ॥\n॥ हर हर महादेव ॥\n\n– शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर

🌐 अधिकृत वेबसाईट:
https://shivsrushti-utsav-mandal.onrender.com`,
                    files: [file]
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share(shareData);
                } else {
                    // Download fallback
                    const link = document.createElement('a');
                    link.download = 'Donation_Poster.jpg';
                    link.href = canvas.toDataURL('image/jpeg', 0.9);
                    link.click();
                    alert('तुमच्या डिव्हाइसवर डायरेक्ट इमेज शेअरिंग सपोर्टेड नाही. इमेज डाउनलोड झाली आहे, ती तुम्ही स्वतः शेअर करू शकता.');
                }
                
                if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
            }, 'image/jpeg', 0.9);
        } catch (err) {
            console.error('Error sharing image:', err);
            alert('शेअर करताना त्रुटी आली. कृपया डाउनलोड करून शेअर करा.');
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }
    
    function openLightbox(src) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightbox.style.display = 'flex';
        }
    }

    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
        }
    }
    
