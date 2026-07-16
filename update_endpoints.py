import re

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove .select('-password') from GET /api/portal/users and GET /api/portal/users/:id
content = content.replace("const users = await PortalUser.find({ role: 'member' }).select('-password');", "const users = await PortalUser.find({ role: 'member' });")
content = content.replace("const user = await PortalUser.findById(req.params.id).select('-password');", "const user = await PortalUser.findById(req.params.id);")

# Add PUT and DELETE endpoints for users
new_endpoints = """
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
"""

if "app.delete('/api/portal/users/:id'" not in content:
    content = content.replace("app.post('/api/portal/funds'", new_endpoints + "\napp.post('/api/portal/funds'")

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)
