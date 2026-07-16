def apply_mobile_css(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    responsive_css = """
        /* Premium Mobile Responsiveness */
        @media (max-width: 768px) {
            .navbar {
                padding: 15px;
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            .navbar h2 {
                font-size: 1.5rem;
            }
            .main-content {
                padding: 15px;
                gap: 20px;
            }
            .dashboard-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            .lists-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .list-container {
                padding: 15px;
            }
            .list-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            .list-header .btn {
                width: 100%;
                text-align: center;
            }
            .item-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }
            .item-row > div:first-child {
                width: 100%;
                word-wrap: break-word;
            }
            .item-row select, .item-row .badge {
                width: 100%;
                text-align: center;
                box-sizing: border-box;
            }
            .floating-label input,
            .floating-label select,
            .floating-label textarea {
                padding: 22px 12px 6px;
                font-size: 0.95rem;
            }
            .form-grid {
                gap: 15px;
            }
            /* Make buttons inside cards full width on mobile */
            div[style*="justify-content:flex-end"] {
                flex-direction: column;
                gap: 10px !important;
            }
            div[style*="justify-content:flex-end"] button {
                width: 100%;
                justify-content: center;
            }
            
            /* Responsive timeline layout for mobile */
            div[style*="border-left: 3px solid"] {
                padding: 12px !important;
                margin-bottom: 12px !important;
            }
            div[style*="justify-content: space-between"] {
                flex-direction: column;
                align-items: flex-start !important;
                gap: 8px;
            }
        }
"""
    if 'Premium Mobile Responsiveness' not in content:
        content = content.replace('</style>', responsive_css + '\n    </style>')
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Added mobile CSS to {filename}')

apply_mobile_css('member.html')
apply_mobile_css('superadmin.html')
apply_mobile_css('admin.html') # Check if admin needs it too? admin.html uses style.css, but just in case. Wait, admin.html uses style.css, I shouldn't inject there if not needed, but wait, it might have its own style tag.
