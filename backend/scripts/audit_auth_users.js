const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

async function listAllUsers(nextPageToken) {
    // List batch of users, 1000 at a time.
    try {
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

        console.log("# REPORTE DE USUARIOS (FIREBASE AUTH)\n");
        console.log(`Total usuarios encontrados en este lote: ${listUsersResult.users.length}\n`);

        listUsersResult.users.forEach((userRecord) => {
            console.log(`- **UID:** ${userRecord.uid}`);
            console.log(`  - Email: ${userRecord.email}`);
            console.log(`  - Email Verified: ${userRecord.emailVerified}`);
            console.log(`  - Display Name: ${userRecord.displayName}`);
            console.log(`  - Disabled: ${userRecord.disabled}`);
            console.log(`  - Last Sign In: ${userRecord.metadata.lastSignInTime}`);
            console.log(`  - Creation Time: ${userRecord.metadata.creationTime}`);
            if (userRecord.customClaims) {
                console.log(`  - Custom Claims: ${JSON.stringify(userRecord.customClaims)}`);
            }
            console.log("");
        });

        if (listUsersResult.pageToken) {
            // List next batch of users.
            await listAllUsers(listUsersResult.pageToken);
        }
    } catch (error) {
        console.log('Error listing users:', error);
    }
}

listAllUsers();
