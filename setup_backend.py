import re

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

schemas = """
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

"""

api_routes = """
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
        const users = await PortalUser.find({ role: 'member' }).select('-password');
        res.json({ success: true, users });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/portal/users/:id', async (req, res) => {
    try {
        const user = await PortalUser.findById(req.params.id).select('-password');
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

"""

# Insert schemas after the other schemas (around line 160)
# We can find `const pdfSchema` and insert after it
if '// ==========================================\n// PORTAL: SCHEMAS' not in content:
    content = re.sub(
        r"(const UploadedPDF = mongoose.model\('UploadedPDF', pdfSchema\);)",
        r"\1\n\n" + schemas,
        content
    )

    # Insert API routes before app.listen
    content = content.replace("app.listen(PORT", api_routes + "\napp.listen(PORT")

    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Backend logic added successfully.")
else:
    print("Backend logic already exists.")
