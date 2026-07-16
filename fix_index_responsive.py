def fix_index_responsive():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    responsive_css = """
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
"""

    if 'Advanced Mobile Responsiveness' not in content:
        content = content.replace('</style>', responsive_css + '\n    </style>')
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Added advanced mobile & laptop responsiveness to index.html')
    else:
        print('Already present')

fix_index_responsive()
