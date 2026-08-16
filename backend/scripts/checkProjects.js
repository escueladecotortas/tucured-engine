const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function checkProjects() {
    console.log("🔍 Checking Projects Collection...");
    const projects = await db.collection("projects").get();

    if (projects.empty) {
        console.log("❌ No projects found.");
        return;
    }

    projects.forEach(doc => {
        const data = doc.data();
        console.log(`\n📁 Project: [${doc.id}]`);
        console.log(`   Name: ${data.name}`);
        console.log(`   Slogan: ${data.slogan || "N/A"}`);
        console.log(`   Status: ${data.status}`);
        console.log(`   Created: ${data.createdAt ? data.createdAt.toDate() : "Unknown"}`);
    });
}

checkProjects().catch(console.error);
