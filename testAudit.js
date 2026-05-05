const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function run() {
  const snap = await db.collection('flashmobAudits').orderBy('submittedAt', 'desc').limit(2).get();
  snap.forEach(d => {
    console.log(d.id, "=>", d.data().videoUrl, "Selfie:", d.data().selfieUrl);
  });
}
run().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
