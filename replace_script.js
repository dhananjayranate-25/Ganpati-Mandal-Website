const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, 'server.js');
const lines = fs.readFileSync(serverFile, 'utf8').split('\n');

lines[3] = "const mongoose = require('mongoose');";

const replacementCode = `
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ganpati_cashbook';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
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

app.get('/api/entries', async (req, res) => {
    try {
        const { year } = req.query;
        let query = {};
        if (year) {
            query.date = { $regex: new RegExp(\`^\${year}-\`) };
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
        const result = await Entry.deleteMany({ date: { $regex: new RegExp(\`^\${year}-\`) } });
        res.json({ success: true, message: \`All entries for year \${year} deleted\`, deletedCount: result.deletedCount });
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
    console.log(\`Ganpati Vargani Cashbook running at http://localhost:\${PORT}\`);
    console.log(\`Database: MongoDB\`);
    console.log(\`Uploads directory: \${UPLOAD_DIR}\`);
});
`;

const head = lines.slice(0, 37);
const tail = lines.slice(318);

const newLines = head.join('\n') + '\n' + replacementCode + '\n' + tail.join('\n');
fs.writeFileSync(serverFile, newLines);
console.log('Successfully updated server.js');
