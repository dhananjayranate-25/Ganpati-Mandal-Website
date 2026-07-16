import re

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Niyojan Schema
niyojan_schema_old = """const niyojanSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});"""
niyojan_schema_new = """const niyojanSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    addedBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});"""
if niyojan_schema_old in content:
    content = content.replace(niyojan_schema_old, niyojan_schema_new)

# Update Aarti Schema
aarti_schema_old = """const aartiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timeOfDay: { type: String, required: true }, // "सकाळ" or "संध्याकाळ"
    date: { type: String, required: true }, // e.g. "2026-09-07"
    phone: { type: String },
    pujaDetails: { type: String },
    createdAt: { type: Date, default: Date.now }
});"""
aarti_schema_new = """const aartiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timeOfDay: { type: String, required: true }, // "सकाळ" or "संध्याकाळ"
    date: { type: String, required: true }, // e.g. "2026-09-07"
    phone: { type: String },
    pujaDetails: { type: String },
    addedBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});"""
if aarti_schema_old in content:
    content = content.replace(aarti_schema_old, aarti_schema_new)

# Update Niyojan POST Route
niyojan_post_old = """app.post('/api/niyojan', async (req, res) => {
    try {
        const { date, time, title, description } = req.body;
        const entry = new Niyojan({ date, time, title, description });
        await entry.save();
        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});"""
niyojan_post_new = """app.post('/api/niyojan', async (req, res) => {
    try {
        const { date, time, title, description, addedBy } = req.body;
        const entry = new Niyojan({ date, time, title, description, addedBy });
        await entry.save();
        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});"""
if niyojan_post_old in content:
    content = content.replace(niyojan_post_old, niyojan_post_new)

# Update Aarti POST Route
aarti_post_old = """app.post('/api/aarti', async (req, res) => {
    try {
        const { name, timeOfDay, date, phone, pujaDetails } = req.body;
        const entry = new Aarti({ name, timeOfDay, date, phone, pujaDetails });
        await entry.save();
        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});"""
aarti_post_new = """app.post('/api/aarti', async (req, res) => {
    try {
        const { name, timeOfDay, date, phone, pujaDetails, addedBy } = req.body;
        const entry = new Aarti({ name, timeOfDay, date, phone, pujaDetails, addedBy });
        await entry.save();
        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});"""
if aarti_post_old in content:
    content = content.replace(aarti_post_old, aarti_post_new)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)
