const AutoSiteGenerator = require('../services/AutoSiteGenerator');
const path = require('path');
const fs = require('fs').promises;

async function copyLegacyAssets(challenger) {
    // Logic: Copy from legacy folder (without V2) to new folder
    const slugify = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Remove "V2" safely before slugifying for legacy name
    const legacyNameRaw = challenger.name.replace(/\s*v\d+|\s*version\s*\d+/gi, '');
    const legacyName = slugify(legacyNameRaw);
    const newName = slugify(challenger.name);

    // Map Special Cases manually if needed, otherwise try strict slug match
    // Adoré legacy folder is 'adore-tu-esencia'
    // Adoré V2 folder is 'adore-tu-esencia-v2'

    const sourceDir = path.resolve(__dirname, '../../nexus_archives/tucu-red/clients', legacyName, 'assets');
    const targetDir = path.resolve(__dirname, '../../nexus_archives/tucu-red/clients', newName, 'assets');

    console.log(`📂 Migrating assets from [${legacyName}] to [${newName}]...`);

    try {
        await fs.mkdir(targetDir, { recursive: true });
        const files = await fs.readdir(sourceDir);
        for (const file of files) {
            await fs.copyFile(path.join(sourceDir, file), path.join(targetDir, file));
        }
        console.log(`✅ Copied ${files.length} assets successfully.`);
    } catch (error) {
        console.warn(`⚠️ Could not migrate assets (Source might not exist): ${sourceDir}`);
    }
}

async function launchChallenge() {
    console.log("⚔️ INICIANDO CHALLENGE DESIGN: NEXUS (LEGACY) VS NEXUS PRO MAX (V2) - RELOADED ⚔️");
    console.log("=====================================================================");

    const challengers = [
        {
            name: "Amora Nails V2",
            category: "nail_salon",
            subcategory: "nail_salon",
            instagram: "@amora.nailss",
            address: "Juan Bautista Alberdi 720, San Miguel de Tucumán",
            phone: "5493814778530",
            aiContext: { mission: "Brindar servicios de uñas de alta calidad.", valueProp: "Manos Impecables." } // Minimal context, rely on Vibe
        },
        {
            name: "La Viandería V2",
            category: "gastronomy",
            subcategory: "gastronomy",
            instagram: "@lavianderiatucumanarg",
            address: "Combate de San Lorenzo 963, San Miguel de Tucumán",
            phone: "5493816509073",
            aiContext: { mission: "Facilitar la vida de las familias.", valueProp: "Comida Casera." }
        },
        {
            name: "Adoré tu Esencia V2",
            category: "retail",
            subcategory: "luxury_retail",
            instagram: "@adoretuesencia",
            address: "San Miguel de Tucumán",
            phone: "5493815555555",
            aiContext: {
                mission: "Crear experiencias sensoriales únicas a través de aromas y decoración de lujo.",
                valueProp: "Aromas que despiertan tus sentidos.",
                vibe_override: "spiritual-wisdom" // Should trigger Minimal Layout
            }
        },
        {
            name: "La Alberdi Almacén V2",
            category: "retail",
            subcategory: "gourmet_store",
            instagram: "@laalberdialmacen",
            address: "Barrio Norte, Tucumán",
            phone: "5493816666666",
            aiContext: {
                mission: "Ofrecer productos gourmet y de almacén con una atención cálida y personalizada.",
                valueProp: "Tu almacén boutique de confianza.",
                vibe_override: "universal-love"
            }
        }
    ];

    for (const prospect of challengers) {
        console.log(`\n🥊 Generating Challenger: ${prospect.name}...`);

        // PRE-FLIGHT: Migrate Assets
        await copyLegacyAssets(prospect);

        try {
            await AutoSiteGenerator.generateSite(prospect);
            console.log(`✅ ${prospect.name} READY for battle.`);
        } catch (error) {
            console.error(`❌ Failed to generate ${prospect.name}:`, error);
        }
    }

    console.log("\n=====================================================================");
    console.log("🏁 CHALLENGE RELOADED COMPLETE.");
}

launchChallenge();
