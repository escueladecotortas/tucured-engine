const { db } = require('../firebase-admin');

async function checkAdore() {
  console.log('🔍 Checking for "Adoré tu Esencia" in prospects...');
  
  // Search by slug or name
  const snapshot = await db.collection('prospects')
    .where('name', '==', 'Adoré tu Esencia')
    .get();

  if (!snapshot.empty) {
    console.log('✅ Adoré found in prospects!');
    snapshot.forEach(doc => {
      console.log(`- ID: ${doc.id}`);
      console.log(`- Data:`, JSON.stringify(doc.data(), null, 2));
    });
    return;
  }

  console.log('⚠️ Adoré NOT found. Seeding...');

  // Adoré Data from projects.js context
  const adoreData = {
    name: "Adoré tu Esencia",
    slug: "adore-tu-esencia",
    category: "wellness",
    subcategory: "holistic_center",
    phone: "+5493815123456", // Placeholder based on context
    instagram: "@adoretuesencia",
    address: "San Miguel de Tucumán",
    status: "new",
    vibe: "9", // Lujo/Bienestar
    createdAt: new Date()
  };

  const res = await db.collection('prospects').add(adoreData);
  console.log(`🌱 Adoré seeded with ID: ${res.id}`);
}

checkAdore()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
