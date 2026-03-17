# How to Add the Glossary Images

## Quick Steps:

1. **Get your image files ready:**
   - `6xd.png` - The D6 (Digital Accelerators - Tools) diagram
   - `ghc.png` - The Golden Honeycomb of Competence diagram

2. **Copy them to this directory:**
   ```
   public/images/knowledge/6xd.png
   public/images/knowledge/ghc.png
   ```

3. **Verify they're in place:**
   ```bash
   ls -la public/images/knowledge/
   ```
   You should see both `6xd.png` and `ghc.png` files listed.

## File Requirements:
- Format: PNG
- Recommended size: At least 800px wide
- The images will be displayed at 160px height in the cards

## Current Status:
Run this command to check if images are present:
```bash
node scripts/add-glossary-images.js
```

Once the images are added, refresh your browser and they should display automatically!

