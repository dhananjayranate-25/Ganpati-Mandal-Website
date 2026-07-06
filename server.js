require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const { PDFDocument, rgb } = require('pdf-lib');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Explicit root route to prevent browser cache issues
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.sendFile(path.join(__dirname, 'index.html'));
});

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname)));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const year = req.body.year || 'unknown';
        cb(null, `cashbook_${year}_${Date.now()}.pdf`);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Storage for hero banner image
const bannerStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `hero_banner${ext}`);
    }
});
const uploadBanner = multer({ storage: bannerStorage, limits: { fileSize: 10 * 1024 * 1024 } });

// Storage for committee photos (Memory storage to save in DB)
const committeeStorage = multer.memoryStorage();
const uploadCommittee = multer({ storage: committeeStorage, limits: { fileSize: 5 * 1024 * 1024 } });


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully to Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

const entrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    mode: { type: String, required: true, enum: ['Online', 'Cash'] },
    cash_in: { type: Number, default: 0 },
    cash_out: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
});

entrySchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

const Entry = mongoose.model('Entry', entrySchema);

const visibilitySchema = new mongoose.Schema({
    year: { type: String, required: true, unique: true },
    isVisible: { type: Boolean, default: false }
});
const YearVisibility = mongoose.model('YearVisibility', visibilitySchema);

const settingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed }
});
const AppSetting = mongoose.model('AppSetting', settingSchema);

const committeeSchema = new mongoose.Schema({
    role: { type: String, required: true, unique: true }, // e.g., 'president', 'treasurer'
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    order: { type: Number, default: 0 }
});
const CommitteeMember = mongoose.model('CommitteeMember', committeeSchema);

const pdfSchema = new mongoose.Schema({
    filename: { type: String, required: true, unique: true },
    year: { type: String, required: true },
    originalName: { type: String },
    subtitle: { type: String },
    tagline: { type: String },
    orgName: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});
const UploadedPDF = mongoose.model('UploadedPDF', pdfSchema);

app.get('/api/entries', async (req, res) => {
    try {
        const { year } = req.query;
        let query = {};
        if (year) {
            query.date = { $regex: new RegExp(`^${year}-`) };
        }
        const entries = await Entry.find(query).sort({ date: 1, created_at: 1 });
        res.json({ success: true, data: entries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/years', async (req, res) => {
    try {
        const entries = await Entry.find({}, 'date');
        const years = [...new Set(entries.map(e => e.date.substring(0, 4)))].sort().reverse();
        res.json({ success: true, data: years });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/year-visibility', async (req, res) => {
    try {
        const visibilities = await YearVisibility.find({});
        const visibilityMap = {};
        visibilities.forEach(v => {
            visibilityMap[v.year] = v.isVisible;
        });
        res.json({ success: true, data: visibilityMap });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/year-visibility', async (req, res) => {
    try {
        const { year, isVisible } = req.body;
        if (!year) {
            return res.status(400).json({ success: false, error: 'Year is required' });
        }
        await YearVisibility.findOneAndUpdate(
            { year: year.toString() },
            { isVisible },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/settings', async (req, res) => {
    try {
        const settings = await AppSetting.find({});
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.key] = s.value;
        });
        res.json({ success: true, data: settingsMap });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ success: false, error: 'Key is required' });
        await AppSetting.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/committee', async (req, res) => {
    try {
        const members = await CommitteeMember.find().sort({ order: 1 });
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/committee', (req, res, next) => {
    uploadCommittee.single('photo')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ success: false, error: err.message || 'File upload failed' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { role, name, mobile, order } = req.body;
        if (!role || !name || !mobile) {
            return res.status(400).json({ success: false, error: 'Role, Name, and Mobile are required' });
        }
        
        let updateData = { name, mobile };
        if (order !== undefined) updateData.order = parseInt(order, 10);
        
        if (req.file) {
            // Convert buffer to base64
            const base64Data = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            updateData.photoUrl = `data:${mimeType};base64,${base64Data}`;
        }

        const member = await CommitteeMember.findOneAndUpdate(
            { role },
            updateData,
            { upsert: true, new: true }
        );
        res.json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { password } = req.body;
        const setting = await AppSetting.findOne({ key: 'adminPassword' });
        const storedPassword = setting && setting.value ? setting.value : 'admin123';
        if (password === storedPassword) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, error: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const setting = await AppSetting.findOne({ key: 'adminPassword' });
        const storedPassword = setting && setting.value ? setting.value : 'admin123';
        if (currentPassword !== storedPassword) {
            return res.status(401).json({ success: false, error: 'Incorrect current password' });
        }
        await AppSetting.findOneAndUpdate(
            { key: 'adminPassword' },
            { value: newPassword },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/entries', async (req, res) => {
    try {
        const { name, date, mode, cashIn, cashOut } = req.body;
        if (!name || !date || !mode) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        const newEntry = new Entry({
            name, date, mode,
            cash_in: cashIn || 0,
            cash_out: cashOut || 0
        });
        await newEntry.save();
        res.status(201).json({ success: true, data: newEntry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/entries/:id', async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' });
        res.json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/entries/:id', async (req, res) => {
    try {
        const entry = await Entry.findByIdAndDelete(req.params.id);
        if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' });
        res.json({ success: true, message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/entries/:id', async (req, res) => {
    try {
        const { name, date, mode, cashIn, cashOut } = req.body;
        if (!name || !date || !mode) return res.status(400).json({ success: false, error: 'All fields are required' });
        
        const entry = await Entry.findByIdAndUpdate(
            req.params.id,
            { name, date, mode, cash_in: cashIn || 0, cash_out: cashOut || 0 },
            { new: true }
        );
        if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' });
        res.json({ success: true, data: entry, message: 'Entry updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/entries', async (req, res) => {
    try {
        const result = await Entry.deleteMany({});
        res.json({ success: true, message: 'All entries deleted', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/entries/year/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const result = await Entry.deleteMany({ date: { $regex: new RegExp(`^${year}-`) } });
        res.json({ success: true, message: `All entries for year ${year} deleted`, deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/summary', async (req, res) => {
    try {
        const result = await Entry.aggregate([
            {
                $group: {
                    _id: null,
                    totalCashIn: { $sum: "$cash_in" },
                    totalCashOut: { $sum: "$cash_out" },
                    totalEntries: { $sum: 1 }
                }
            }
        ]);
        
        const summary = result.length > 0 ? result[0] : { totalCashIn: 0, totalCashOut: 0, totalEntries: 0 };
        delete summary._id;
        summary.finalBalance = summary.totalCashIn - summary.totalCashOut;
        
        res.json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Ganpati Vargani Cashbook running at http://localhost:${PORT}`);
    console.log(`Database: MongoDB`);
    console.log(`Uploads directory: ${UPLOAD_DIR}`);
});


app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        const { year, subtitle, tagline, orgName } = req.body;
        if (!year || !req.file) {
            return res.status(400).json({ success: false, error: 'Year and PDF file required' });
        }

        const originalName = req.file.originalname;
        const oldPath = req.file.path;
        const newName = `cashbook_${year}_${Date.now()}.pdf`;
        const newPath = path.join(UPLOAD_DIR, newName);
        fs.renameSync(oldPath, newPath);

        const newPdf = new UploadedPDF({
            filename: newName,
            year: year,
            originalName: originalName,
            subtitle: subtitle || '',
            tagline: tagline || '',
            orgName: orgName || ''
        });
        await newPdf.save();

        console.log('PDF uploaded:', newName, '| Original:', originalName);
        res.json({ success: true, filename: newName, year });
    } catch (error) {
        console.error('Upload error:', error);
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload Hero Banner API
app.post('/api/upload-hero', uploadBanner.single('banner'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Banner image file required' });
        }
        const filename = req.file.filename;
        // Save the filename to app settings so the frontend knows what to fetch
        await AppSetting.findOneAndUpdate(
            { key: 'heroBannerImage' },
            { value: filename },
            { upsert: true, new: true }
        );
        res.json({ success: true, filename: filename, message: 'Banner updated successfully' });
    } catch (error) {
        console.error('Banner upload error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/uploaded-pdfs', async (req, res) => {
    try {
        if (!fs.existsSync(UPLOAD_DIR)) {
            return res.json({ success: true, data: [] });
        }
        const files = fs.readdirSync(UPLOAD_DIR).filter(f => f.endsWith('.pdf') && !f.endsWith('.meta.json.pdf'));
        
        const dbPdfs = await UploadedPDF.find({});
        const dbFilenames = dbPdfs.map(p => p.filename);
        
        // Auto-migrate old .meta.json to MongoDB
        for (const f of files) {
            if (!dbFilenames.includes(f)) {
                const metaPath = path.join(UPLOAD_DIR, f.replace('.pdf', '.meta.json'));
                const match = f.match(/cashbook_(\d+|unknown)_(\d+)\.pdf/);
                const year = match ? match[1] : 'unknown';
                let meta = { originalName: f, subtitle: '', tagline: '', orgName: '', year };
                if (fs.existsSync(metaPath)) {
                    try {
                        const fileMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                        meta = { ...meta, ...fileMeta };
                    } catch(e){}
                }
                const newDbPdf = new UploadedPDF({
                    filename: f,
                    year: meta.year,
                    originalName: meta.originalName || f,
                    subtitle: meta.subtitle || '',
                    tagline: meta.tagline || '',
                    orgName: meta.orgName || '',
                    uploadedAt: meta.uploadedAt ? new Date(meta.uploadedAt) : new Date()
                });
                await newDbPdf.save();
            }
        }

        const finalPdfs = await UploadedPDF.find({}).sort({ year: -1, uploadedAt: -1 });
        const pdfList = finalPdfs.map(p => {
            return {
                filename: p.filename,
                year: p.year,
                displayName: p.originalName || p.filename,
                subtitle: p.subtitle || '',
                tagline: p.tagline || '',
                orgName: p.orgName || '',
                uploadedAt: p.uploadedAt ? new Date(p.uploadedAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }) : '',
                path: `/uploads/${p.filename}`,
                mergedPath: `/api/merged-pdf/${p.filename}/${p.year}`
            };
        });
        
        res.json({ success: true, data: pdfList });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/uploaded-pdfs/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        const metaPath = path.join(UPLOAD_DIR, filename.replace('.pdf', '.meta.json'));
        if (fs.existsSync(metaPath)) {
            fs.unlinkSync(metaPath);
        }
        res.json({ success: true, message: 'PDF deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/uploaded-pdfs/:filename/rename', (req, res) => {
    try {
        const { filename } = req.params;
        const { displayName } = req.body;
        if (!displayName || !displayName.trim()) {
            return res.status(400).json({ success: false, error: 'Display name is required' });
        }
        const metaPath = path.join(UPLOAD_DIR, filename.replace('.pdf', '.meta.json'));
        if (!fs.existsSync(metaPath)) {
            return res.status(404).json({ success: false, error: 'Metadata not found' });
        }
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        meta.originalName = displayName.trim();
        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
        res.json({ success: true, message: 'Renamed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/uploaded-pdfs/:filename/cover', (req, res) => {
    try {
        const { filename } = req.params;
        const { subtitle, tagline, orgName } = req.body;
        const metaPath = path.join(UPLOAD_DIR, filename.replace('.pdf', '.meta.json'));
        if (!fs.existsSync(metaPath)) {
            return res.status(404).json({ success: false, error: 'Metadata not found' });
        }
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (subtitle !== undefined) meta.subtitle = subtitle;
        if (tagline !== undefined) meta.tagline = tagline;
        if (orgName !== undefined) meta.orgName = orgName;
        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
        res.json({ success: true, message: 'Cover settings updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const MERGE_CACHE_DIR = path.join(__dirname, 'merged-cache');
if (!fs.existsSync(MERGE_CACHE_DIR)) {
    fs.mkdirSync(MERGE_CACHE_DIR, { recursive: true });
}

async function generateMergedPdf(filename, year, subtitle, tagline, orgName) {
    const pdfPath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF not found: ' + filename);
    }

    subtitle = subtitle || '\u0917\u0923\u0947\u0936 \u0909\u0924\u094D\u0938\u0935 \u0915\u0945\u0936\u092C\u0941\u0915';
    tagline = tagline || 'Ganpati Festival Cashbook';
    orgName = orgName || 'Shivsrushti Hindu Tarun Mitra Mandal 🚩';

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const existingPdf = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

    const mergedPdf = await PDFDocument.create();
    const page = mergedPdf.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const cx = width / 2;

    const saffron = rgb(1, 0.55, 0);
    const gold = rgb(1, 0.84, 0);
    const lightGold = rgb(0.83, 0.72, 0.58);
    const bgDark = rgb(0.06, 0.01, 0.0);
    const bgMaroon = rgb(0.18, 0.05, 0.03);
    const red = rgb(0.86, 0.08, 0.1);

    page.drawRectangle({ x: 0, y: 0, width, height, color: bgDark });

    const panelMargin = 35;
    page.drawRectangle({
        x: panelMargin, y: panelMargin,
        width: width - panelMargin * 2, height: height - panelMargin * 2,
        color: bgMaroon
    });

    page.drawRectangle({
        x: panelMargin, y: panelMargin,
        width: width - panelMargin * 2, height: height - panelMargin * 2,
        borderColor: saffron, borderWidth: 3
    });

    const innerMargin = panelMargin + 14;
    page.drawRectangle({
        x: innerMargin, y: innerMargin,
        width: width - innerMargin * 2, height: height - innerMargin * 2,
        borderColor: gold, borderWidth: 1.5
    });

    const cornerSize = 20;
    const corners = [
        { x: innerMargin, y: height - innerMargin - cornerSize },
        { x: width - innerMargin - cornerSize, y: height - innerMargin - cornerSize },
        { x: innerMargin, y: innerMargin },
        { x: width - innerMargin - cornerSize, y: innerMargin }
    ];
    corners.forEach(c => {
        page.drawRectangle({ x: c.x, y: c.y, width: cornerSize, height: cornerSize, color: gold, opacity: 0.6 });
        page.drawRectangle({ x: c.x, y: c.y, width: cornerSize, height: cornerSize, borderColor: gold, borderWidth: 1 });
    });

    const logoPath = path.join(__dirname, 'logo', 'logo.jpeg');
    const logoSize = 180;
    const logoY = 560;
    const logoX = cx - logoSize / 2;
    const logoCenterY = logoY + logoSize / 2;

    if (fs.existsSync(logoPath)) {
        try {
            const logoBytes = fs.readFileSync(logoPath);
            const logoImage = await mergedPdf.embedJpg(logoBytes);

            for (let i = 3; i >= 1; i--) {
                page.drawCircle({
                    x: cx, y: logoCenterY, size: logoSize / 2 + i * 12,
                    color: saffron, opacity: 0.12 / i
                });
            }

            page.drawCircle({
                x: cx, y: logoCenterY, size: logoSize / 2,
                color: rgb(0.98, 0.98, 0.98)
            });

            page.drawImage(logoImage, {
                x: logoX, y: logoY, width: logoSize, height: logoSize
            });

            page.drawCircle({
                x: cx, y: logoCenterY, size: logoSize / 2,
                borderColor: gold, borderWidth: 5
            });
            page.drawCircle({
                x: cx, y: logoCenterY, size: logoSize / 2 + 8,
                borderColor: saffron, borderWidth: 2
            });
        } catch (e) {
            console.warn('Logo skipped:', e.message);
        }
    }

    const nameY = logoY - 8;
    const nameBoxWidth = 340;
    const nameBoxHeight = 40;
    const nameBoxX = cx - nameBoxWidth / 2;

    page.drawRectangle({
        x: nameBoxX, y: nameY, width: 5, height: nameBoxHeight, color: red
    });
    page.drawRectangle({
        x: nameBoxX + nameBoxWidth - 5, y: nameY, width: 5, height: nameBoxHeight, color: red
    });

    const orgText = (orgName && /^[\x00-\x7F\s]+$/.test(orgName)) ? orgName : 'Shivsrushti Hindu Tarun Mitra Mandal 🚩';
    page.drawText(orgText, {
        x: cx - 70, y: nameY + 15, size: 20,
        color: gold
    });

    const div1Y = nameY - 6;
    page.drawRectangle({ x: cx - 120, y: div1Y, width: 240, height: 2, color: saffron });
    page.drawRectangle({ x: cx - 70, y: div1Y - 3, width: 140, height: 1, color: gold });

    const festY = nameY - 50;
    const bookText = (subtitle && /^[\x00-\x7F\s]+$/.test(subtitle)) ? subtitle : 'GANPATI FESTIVAL CASHBOOK';
    const tagText = (tagline && /^[\x00-\x7F\s]+$/.test(tagline)) ? tagline : 'Ganpati Festival Cashbook';
    page.drawText(bookText, {
        x: cx - 100, y: festY + 18, size: 18,
        color: saffron
    });
    page.drawText(tagText, {
        x: cx - 80, y: festY - 2, size: 16,
        color: saffron
    });

    page.drawRectangle({ x: cx - 60, y: festY - 16, width: 120, height: 1, color: lightGold });

    const badgeW = 110;
    const badgeH = 45;
    const badgeX = cx - badgeW / 2;
    const badgeY = festY - 70;

    page.drawRectangle({
        x: badgeX, y: badgeY, width: badgeW, height: badgeH,
        borderColor: gold, borderWidth: 2
    });
    page.drawRectangle({
        x: badgeX + 1, y: badgeY + 1, width: badgeW - 2, height: badgeH - 2,
        borderColor: saffron, borderWidth: 0.5
    });
    page.drawText('YEAR', {
        x: cx - 14, y: badgeY + 26, size: 9,
        color: lightGold
    });
    page.drawText(year, {
        x: cx - 16, y: badgeY + 6, size: 20,
        color: gold
    });

    page.drawRectangle({ x: cx - 100, y: 110, width: 200, height: 1, color: lightGold });
    page.drawCircle({ x: cx - 105, y: 112, size: 2, color: saffron });
    page.drawCircle({ x: cx + 105, y: 112, size: 2, color: saffron });

    page.drawText('Developed by | Dhananjay Ranate', {
        x: cx - 80, y: 75, size: 9,
        color: lightGold
    });

    const pagesToCopy = existingPdf.getPageIndices();
    if (pagesToCopy.length > 0) {
        const copiedPages = await mergedPdf.copyPages(existingPdf, pagesToCopy);
        copiedPages.forEach(p => mergedPdf.addPage(p));
    }

    return await mergedPdf.save();
}

app.get('/api/merged-pdf/:filename/:year', async (req, res) => {
    try {
        const { filename, year } = req.params;
        const subtitle = req.query.subtitle || '';
        const tagline = req.query.tagline || '';
        const orgName = req.query.orgName || '';
        const cacheKey = `${filename}_${year}_${subtitle}_${tagline}_${orgName}`;
        const cacheFilename = Buffer.from(cacheKey).toString('base64') + '.pdf';
        const cachePath = path.join(MERGE_CACHE_DIR, cacheFilename);

        if (fs.existsSync(cachePath)) {
            const cachedBytes = fs.readFileSync(cachePath);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="Ganpati_Cashbook_' + year + '.pdf"');
            return res.send(Buffer.from(cachedBytes));
        }

        const mergedBytes = await generateMergedPdf(filename, year, subtitle, tagline, orgName);
        fs.writeFileSync(cachePath, Buffer.from(mergedBytes));

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Ganpati_Cashbook_' + year + '.pdf"');
        res.send(Buffer.from(mergedBytes));
    } catch (error) {
        console.error('Merge error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/merge-pdf', express.json(), async (req, res) => {
    try {
        const { filename, year } = req.body;
        console.log('Merge request:', filename, year);
        if (!filename || !year) {
            return res.status(400).json({ success: false, error: 'Filename and year required' });
        }

        const mergedBytes = await generateMergedPdf(filename, year);
        console.log('Merged PDF generated');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Ganpati_Cashbook_' + year + '.pdf"');
        res.setHeader('Content-Length', mergedBytes.length);
        res.send(Buffer.from(mergedBytes));
    } catch (error) {
        console.error('Merge error:', error.message);
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
});
