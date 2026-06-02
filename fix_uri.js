const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/mongodb\+srv:\/\/(.+?):(.+?)@/);
if (match) {
    const user = match[1];
    const pass = match[2];
    const newUri = `mongodb://${user}:${pass}@ac-ximcxel-shard-00-00.qrrizkp.mongodb.net:27017,ac-ximcxel-shard-00-01.qrrizkp.mongodb.net:27017,ac-ximcxel-shard-00-02.qrrizkp.mongodb.net:27017/ganpati_cashbook?ssl=true&replicaSet=atlas-zb7ik8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
    const newEnv = envContent.replace(/MONGODB_URI=.+/, 'MONGODB_URI=' + newUri);
    fs.writeFileSync('.env', newEnv);
    console.log('Successfully updated .env with standard URI format.');
} else {
    console.log('Could not find credentials in .env');
}
