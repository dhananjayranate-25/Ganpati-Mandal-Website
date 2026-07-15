
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
