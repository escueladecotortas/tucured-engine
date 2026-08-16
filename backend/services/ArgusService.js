const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Assuming axios or use https
const sizeOf = require('image-size');

class ArgusService {
    constructor() {
        this.minSize = 100; // Lowered to allow Google Maps review avatars and smaller photos
        this.logPrefix = '👁️ [ARGUS]';
    }

    /**
     * Downloads an image and saves it ONLY if it meets quality standards (SOP-ASSET-001).
     * @param {string} url - Image URL
     * @param {string} destPath - Destination path
     * @returns {Promise<boolean>} - True if saved, False if rejected
     */
    async verifyAndSave(url, destPath) {
        try {
            console.log(`${this.logPrefix} Inspecting: ${url}`);

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'arraybuffer'
            });

            const buffer = Buffer.from(response.data);
            console.log(`${this.logPrefix} Buffer Header:`, buffer.subarray(0, 10).toString('hex')); // Debug Magic Number

            // 1. Verify Dimensions
            try {
                const dimensions = sizeOf(buffer);
                if (dimensions) {
                    console.log(`${this.logPrefix} Dimensions: ${dimensions.width}x${dimensions.height}`);
                    if (dimensions.width < this.minSize || dimensions.height < this.minSize) {
                        console.warn(`${this.logPrefix} ❌ Rejected: Too small (<${this.minSize}px).`);
                        return false;
                    }
                }
            } catch (err) {
                // Fallback: Check Magic Numbers directly
                const header = buffer.subarray(0, 4).toString('hex');
                const isJpg = header.startsWith('ffd8');
                const isPng = header.startsWith('8950');
                const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';

                if (isJpg || isPng || isWebp) {
                    console.log(`${this.logPrefix} ⚠️ 'image-size' failed but Header Valid (${header}). Saving...`);
                } else {
                    console.warn(`${this.logPrefix} ❌ Rejected: Invalid Image Format (Header: ${header}).`);
                    return false;
                }
            }

            // Save
            fs.writeFileSync(destPath, buffer);
            console.log(`${this.logPrefix} ✅ Certified & Saved: ${path.basename(destPath)}`);
            return true;

        } catch (error) {
            console.error(`${this.logPrefix} Error processing image: ${error.message}`);
            return false;
        }
    }
}

module.exports = new ArgusService();
