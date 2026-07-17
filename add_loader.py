with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

dynamic_loader = """
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
"""

if 'loadPDFLibraries' not in content:
    content = content.replace(
        'async function generateAndOpenMergedPDF(filename, year, download, pdfSubtitle, pdfTagline, pdfOrgName) {',
        dynamic_loader + '\n    async function generateAndOpenMergedPDF(filename, year, download, pdfSubtitle, pdfTagline, pdfOrgName) {\n        await loadPDFLibraries();\n        window.jsPDF = window.jspdf.jsPDF;'
    )

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Dynamic loader added to index.html.')
