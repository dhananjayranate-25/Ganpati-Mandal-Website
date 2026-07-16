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
app.use(express.json({ limit: '50mb' }));

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
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Storage for hero banner image
const bannerStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `hero_banner${ext}`);
    }
});
const uploadBanner = multer({ storage: bannerStorage, limits: { fileSize: 50 * 1024 * 1024 } });

// Storage for committee photos (Memory storage to save in DB)
const committeeStorage = multer.memoryStorage();
const uploadCommittee = multer({ storage: committeeStorage, limits: { fileSize: 50 * 1024 * 1024 } });

// Storage for Aarti media (Audio & PDF)
const aartiMediaStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        cb(null, `aarti_${file.fieldname}_${Date.now()}${ext}`);
    }
});
const uploadAartiMedia = multer({ storage: aartiMediaStorage, limits: { fileSize: 50 * 1024 * 1024 } }); // Up to 50MB for audio files

// Storage for Gallery Photos
const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `gallery_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`);
    }
});
const uploadGallery = multer({ storage: galleryStorage, limits: { fileSize: 20 * 1024 * 1024 } });


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully to Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));


const niyojanSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    addedBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const Niyojan = mongoose.model('Niyojan', niyojanSchema);

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
    base64Data: { type: String, default: '' } // For backward compatibility or fallback
});
const CommitteeMember = mongoose.model('CommitteeMember', committeeSchema);

const counterSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

const aartiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timeOfDay: { type: String, required: true }, // "सकाळ" or "संध्याकाळ"
    date: { type: String, required: true }, // e.g. "2026-09-07"
    phone: { type: String },
    pujaDetails: { type: String },
    addedBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const Aarti = mongoose.model('Aarti', aartiSchema);

const galleryAlbumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    photos: [{ type: String }] // Array of file paths
});
const GalleryAlbum = mongoose.model('GalleryAlbum', galleryAlbumSchema);


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


// ==========================================
// PORTAL: SCHEMAS
// ==========================================
const portalUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'member'], required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalFunds: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    balance: { type: Number, default: 0 }
});
const PortalUser = mongoose.model('PortalUser', portalUserSchema);

const portalTaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'PortalUser', required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Process', 'Done'], default: 'Pending' },
    date: { type: Date, default: Date.now }
});
const PortalTask = mongoose.model('PortalTask', portalTaskSchema);

const portalExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'PortalUser', required: true },
    item: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});
const PortalExpense = mongoose.model('PortalExpense', portalExpenseSchema);

// Check if superadmin exists, if not create one
async function initializeSuperAdmin() {
    try {
        const adminExists = await PortalUser.findOne({ role: 'superadmin' });
        if (!adminExists) {
            const newAdmin = new PortalUser({
                name: 'Super Admin',
                role: 'superadmin',
                username: 'admin',
                password: 'admin' // Simple default password
            });
            await newAdmin.save();
            console.log('Default superadmin created: username=admin, password=admin');
        }
    } catch(err) {
        console.error('Error initializing superadmin:', err);
    }
}
mongoose.connection.once('open', initializeSuperAdmin);



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

// ==========================================
// VISITOR COUNTER ENDPOINTS
// ==========================================
app.get('/api/visitors', async (req, res) => {
    try {
        let counter = await Counter.findOne({ key: 'total_visitors' });
        if (!counter) {
            counter = new Counter({ key: 'total_visitors', count: 0 });
            await counter.save();
        }
        res.json({ count: counter.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/visitors/increment', async (req, res) => {
    try {
        let counter = await Counter.findOne({ key: 'total_visitors' });
        if (!counter) {
            counter = new Counter({ key: 'total_visitors', count: 0 });
        }
        counter.count += 1;
        await counter.save();
        res.json({ count: counter.count });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

// Upload Aarti Media Endpoint
app.post('/api/settings/aarti-media', uploadAartiMedia.fields([{ name: 'aarti_audio', maxCount: 1 }, { name: 'aarti_pdf', maxCount: 1 }]), async (req, res) => {
    try {
        if (req.files['aarti_audio']) {
            const audioPath = 'uploads/' + req.files['aarti_audio'][0].filename;
            await AppSetting.findOneAndUpdate({ key: 'aartiAudioPath' }, { value: audioPath }, { upsert: true });
        }
        if (req.files['aarti_pdf']) {
            const pdfPath = 'uploads/' + req.files['aarti_pdf'][0].filename;
            await AppSetting.findOneAndUpdate({ key: 'aartiPdfPath' }, { value: pdfPath }, { upsert: true });
        }
        res.json({ success: true, message: 'Media uploaded successfully' });
    } catch (error) {
        console.error('Error uploading aarti media:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Storage Usage Endpoint
app.get('/api/system/storage', async (req, res) => {
    try {
        // 1. Get MongoDB size
        const dbStats = await mongoose.connection.db.command({ dbStats: 1 });
        const dbSize = dbStats.dataSize + dbStats.indexSize; // Size in bytes
        
        // 2. Get Uploads folder size
        let uploadsSize = 0;
        try {
            const files = await fs.promises.readdir(UPLOAD_DIR);
            for (const file of files) {
                const stat = await fs.promises.stat(path.join(UPLOAD_DIR, file));
                if (stat.isFile()) {
                    uploadsSize += stat.size;
                }
            }
        } catch (e) {
            console.error('Error reading uploads dir for size:', e);
        }
        
        const totalUsedBytes = dbSize + uploadsSize;
        const maxBytes = 512 * 1024 * 1024; // 512 MB Free Tier limit
        const remainingBytes = Math.max(0, maxBytes - totalUsedBytes);
        
        res.json({
            success: true,
            dbSizeBytes: dbSize,
            uploadsSizeBytes: uploadsSize,
            totalUsedBytes: totalUsedBytes,
            maxBytes: maxBytes,
            remainingBytes: remainingBytes,
            usedPercentage: Math.min(100, (totalUsedBytes / maxBytes) * 100)
        });
    } catch (error) {
        console.error('Error fetching storage stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// GALLERY ENDPOINTS
// ==========================================

// Get all albums
app.get('/api/gallery', async (req, res) => {
    try {
        const albums = await GalleryAlbum.find().sort({ order: 1 });
        res.json({ success: true, albums });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create album
app.post('/api/gallery/album', async (req, res) => {
    try {
        const { title, order } = req.body;
        const newAlbum = new GalleryAlbum({ title, order: order || 0, photos: [] });
        await newAlbum.save();
        res.json({ success: true, album: newAlbum });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete album
app.delete('/api/gallery/album/:id', async (req, res) => {
    try {
        const album = await GalleryAlbum.findById(req.params.id);
        if (album) {
            // Delete all photos in this album from disk
            for (let photo of album.photos) {
                const filePath = path.join(__dirname, photo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            await GalleryAlbum.findByIdAndDelete(req.params.id);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload photos to album
app.post('/api/gallery/album/:id/photos', uploadGallery.array('photos', 20), async (req, res) => {
    try {
        const album = await GalleryAlbum.findById(req.params.id);
        if (!album) return res.status(404).json({ success: false, error: 'Album not found' });
        
        const newPhotos = req.files.map(file => 'uploads/' + file.filename);
        album.photos.push(...newPhotos);
        await album.save();
        
        res.json({ success: true, album });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete specific photo from album
app.delete('/api/gallery/album/:id/photo/:filename', async (req, res) => {
    try {
        const album = await GalleryAlbum.findById(req.params.id);
        if (!album) return res.status(404).json({ success: false, error: 'Album not found' });
        
        const photoPath = 'uploads/' + req.params.filename;
        album.photos = album.photos.filter(p => p !== photoPath);
        await album.save();
        
        // Delete from disk
        const filePath = path.join(__dirname, photoPath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.json({ success: true, album });
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

app.delete('/api/committee/:role', async (req, res) => {
    try {
        await CommitteeMember.findOneAndDelete({ role: req.params.role });
        res.json({ success: true, message: 'Member deleted successfully' });
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


// ==========================================
// MAHA-AARTI API
// ==========================================

app.get('/api/aarti', async (req, res) => {
    try {
        const aartis = await Aarti.find().sort({ date: 1 }); // Sort by date ascending
        res.json(aartis);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch aarti details' });
    }
});

app.post('/api/aarti', async (req, res) => {
    try {
        const { name, timeOfDay, date, phone, pujaDetails, addedBy } = req.body;
        const newAarti = new Aarti({ name, timeOfDay, date, phone, pujaDetails, addedBy });
        await newAarti.save();
        res.status(201).json({ success: true, ...newAarti._doc });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add aarti details' });
    }
});


app.put('/api/aarti/:id', async (req, res) => {
    try {
        const updatedAarti = await Aarti.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, ...updatedAarti._doc });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update aarti' });
    }
});

app.delete('/api/aarti/:id', async (req, res) => {
    try {
        await Aarti.findByIdAndDelete(req.params.id);
        res.json({ message: 'Aarti deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete aarti details' });
    }
});


// ==========================================
// NIYOJAN API
// ==========================================

app.get('/api/niyojan', async (req, res) => {
    try {
        const niyojans = await Niyojan.find().sort({ date: 1, time: 1 });
        res.json(niyojans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch niyojan details' });
    }
});

app.post('/api/niyojan', async (req, res) => {
    try {
        const { date, time, title, description, addedBy } = req.body;
        const newNiyojan = new Niyojan({ date, time, title, description, addedBy });
        await newNiyojan.save();
        res.status(201).json({ success: true, ...newNiyojan._doc });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add niyojan' });
    }
});


app.put('/api/niyojan/:id', async (req, res) => {
    try {
        const updatedNiyojan = await Niyojan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, ...updatedNiyojan._doc });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update niyojan' });
    }
});

app.delete('/api/niyojan/:id', async (req, res) => {
    try {
        await Niyojan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Niyojan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete niyojan' });
    }
});


// ==========================================
// PORTAL: API ROUTES
// ==========================================
app.post('/api/portal/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await PortalUser.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        res.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/portal/users', async (req, res) => {
    try {
        const users = await PortalUser.find({ role: 'member' });
        res.json({ success: true, users });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/portal/users/:id', async (req, res) => {
    try {
        const user = await PortalUser.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/portal/users', async (req, res) => {
    try {
        const { name, username, password } = req.body;
        const existing = await PortalUser.findOne({ username });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }
        const newUser = new PortalUser({
            name, username, password, role: 'member'
        });
        await newUser.save();
        res.json({ success: true, user: newUser });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


app.put('/api/portal/users/:id', async (req, res) => {
    try {
        const { name, username, password } = req.body;
        const existing = await PortalUser.findOne({ username, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }
        const user = await PortalUser.findByIdAndUpdate(req.params.id, { name, username, password }, { new: true });
        res.json({ success: true, user });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/portal/users/:id', async (req, res) => {
    try {
        await PortalUser.findByIdAndDelete(req.params.id);
        await PortalTask.deleteMany({ userId: req.params.id });
        await PortalExpense.deleteMany({ userId: req.params.id });
        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/portal/funds', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await PortalUser.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        user.totalFunds += Number(amount);
        user.balance += Number(amount);
        await user.save();
        
        res.json({ success: true, user });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/portal/tasks/:userId', async (req, res) => {
    try {
        const tasks = await PortalTask.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json({ success: true, tasks });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/portal/tasks', async (req, res) => {
    try {
        const { userId, title } = req.body;
        const newTask = new PortalTask({ userId, title, status: 'Pending' });
        await newTask.save();
        res.json({ success: true, task: newTask });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/portal/tasks/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const task = await PortalTask.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ success: true, task });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/portal/expenses/:userId', async (req, res) => {
    try {
        const expenses = await PortalExpense.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json({ success: true, expenses });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/portal/expenses', async (req, res) => {
    try {
        const { userId, item, price } = req.body;
        const numPrice = Number(price);
        
        const user = await PortalUser.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        const expense = new PortalExpense({ userId, item, price: numPrice });
        await expense.save();
        
        user.totalSpent += numPrice;
        user.balance -= numPrice;
        await user.save();
        
        res.json({ success: true, expense, user });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



// Add Endpoint for User Profile Photo
app.post('/api/users/:id/photo', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const photoUrl = 'uploads/' + req.file.filename;
        const user = await PortalUser.findByIdAndUpdate(req.params.id, { photoUrl }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Auto update CommitteeMember with the same name
        await CommitteeMember.updateMany({ name: user.name }, { photoUrl, base64Data: '' });
        
        res.json({ success: true, photoUrl, user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to update photo' });
    }
});
\napp.listen(PORT, () => {
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
        const files = fs.readdirSync(UPLOAD_DIR).filter(f => f.endsWith('.pdf') && !f.endsWith('.meta.json.pdf') && !f.startsWith('aarti_'));
        
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
        
        res.json({ success: true, data: pdfList.filter(p => !p.filename.startsWith('aarti_')) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/uploaded-pdfs/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(UPLOAD_DIR, filename);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            if (err.code === 'EBUSY' || err.code === 'EPERM') {
                return res.status(500).json({ success: false, error: 'फाईल दुसरीकडे उघडी आहे (File is open/locked). कृपया ती बंद करा आणि पुन्हा प्रयत्न करा.' });
            }
            throw err;
        }

        const metaPath = path.join(UPLOAD_DIR, filename.replace('.pdf', '.meta.json'));
        try {
            if (fs.existsSync(metaPath)) {
                fs.unlinkSync(metaPath);
            }
        } catch (err) {
            console.error('Meta file delete error:', err);
        }

        await UploadedPDF.deleteOne({ filename: filename });
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
