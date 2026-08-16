const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { db } = require("../../firebase-admin");
const ArgusService = require("../../services/ArgusService");
const slugify = require("../../utils/slugify");

// Bulk Save Prospects
router.post("/prospects", async (req, res) => {
  try {
    const { prospects } = req.body;
    const batch = db.batch();
    let savedCount = 0,
      downloadedAssets = 0;

    for (const p of prospects) {
      batch.set(db.collection("prospects").doc(p.id), p, { merge: true });
      savedCount++;

      if (p.photos?.length > 0) {
        const safeName = slugify(p.name);
        const assetsDir = path.resolve(
          __dirname,
          "../../../nexus_archives/tucu-red/clients",
          safeName,
          "assets",
        );
        if (!fs.existsSync(assetsDir))
          fs.mkdirSync(assetsDir, { recursive: true });

        for (let i = 0; i < Math.min(p.photos.length, 5); i++) {
          const dest = path.join(
            assetsDir,
            `gallery_${p.id || safeName}_${i}.jpg`,
          );
          try {
            if (await ArgusService.verifyAndSave(p.photos[i], dest))
              downloadedAssets++;
          } catch (e) {}
        }
        fs.writeFileSync(
          path.join(path.dirname(assetsDir), "leads_cyborg.json"),
          JSON.stringify([p], null, 2),
        );
        if (p.shadowState)
          fs.writeFileSync(
            path.join(path.dirname(assetsDir), "deep_state_raw.json"),
            JSON.stringify(p.shadowState, null, 2),
          );
      }
    }
    await batch.commit();
    res.json({ success: true, savedCount, downloadedAssets });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
