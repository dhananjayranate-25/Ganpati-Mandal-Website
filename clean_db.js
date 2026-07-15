const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://dhanu:dhanu@cluster0.h4h74.mongodb.net/ganpati?retryWrites=true&w=majority';
mongoose.connect(mongoURI).then(async () => {
    const UploadedPDF = mongoose.model('UploadedPDF', new mongoose.Schema({ filename: String, year: String, originalName: String }));
    const result = await UploadedPDF.deleteMany({ filename: { $regex: '^aarti_' } });
    console.log('Deleted Aarti PDFs from Cashbooks DB:', result.deletedCount);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
