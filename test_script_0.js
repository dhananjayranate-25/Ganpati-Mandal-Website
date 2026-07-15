
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
        