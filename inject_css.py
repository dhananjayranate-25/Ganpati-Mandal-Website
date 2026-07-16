def inject_css(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    css_to_add = """
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        @media (max-width: 768px) {
            .form-grid { grid-template-columns: 1fr; }
        }
        .floating-label {
            position: relative;
            margin-bottom: 20px;
        }
        .floating-label input,
        .floating-label select,
        .floating-label textarea {
            width: 100%;
            padding: 24px 16px 8px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            box-sizing: border-box;
            transition: all 0.3s ease;
        }
        .floating-label label {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
            pointer-events: none;
            font-size: 1rem;
        }
        .floating-label textarea ~ label {
            top: 24px;
        }
        .floating-label input:focus,
        .floating-label select:focus,
        .floating-label textarea:focus {
            outline: none;
            border-color: #ffcc00;
            background: rgba(255, 204, 0, 0.05);
        }
        .floating-label input:focus + label,
        .floating-label input:not(:placeholder-shown) + label,
        .floating-label select:focus + label,
        .floating-label select:not([value=""]) + label,
        .floating-label textarea:focus + label,
        .floating-label textarea:not(:placeholder-shown) + label {
            top: 8px;
            font-size: 0.75rem;
            color: #ffcc00;
        }
"""
    if 'floating-label input' not in content:
        content = content.replace('</style>', css_to_add + '\n    </style>')
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Added CSS to {filename}')

inject_css('member.html')
inject_css('superadmin.html')
