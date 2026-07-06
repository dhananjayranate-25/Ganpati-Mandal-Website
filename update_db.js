require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection;
    const appSettingsCollection = db.collection('appsettings');
    await appSettingsCollection.updateOne(
        { key: 'heroBannerImage' },
        { $set: { value: 'hero_banner.jpg' } },
        { upsert: true }
    );
    console.log('Updated heroBannerImage setting in DB');
    process.exit(0);
  })
  .catch(err => {
    console.error('DB Error:', err);
    process.exit(1);
  });
