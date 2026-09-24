/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

// Accurate vector paths matching the user's uploaded official Volmo Brand Logo
const svgLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1250 200" width="1250" height="200" fill="none">
  <!-- 1. LEFT ORANGE TRIANGLE EMBLEM (Outlined inverted triangle with stylized electric bolt inside) -->
  <g id="orange-symbol">
    <!-- Outer Inverted Triangle Frame with 20px uniform border -->
    <path
      d="M 15 15 L 215 15 L 115 185 Z"
      stroke="#FF7700"
      stroke-width="22"
      stroke-linejoin="round"
      stroke-linecap="round"
      fill="none"
    />
    <!-- Stylized Inner Lightning Bolt -->
    <path
      d="M 125 32 L 80 100 L 118 100 L 98 152 L 148 88 L 110 88 Z"
      fill="#FF7700"
      stroke="#FF7700"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </g>

  <!-- 2. VOLMO WORDMARK in Deep Charcoal / Black (#2B2728) -->
  <g id="volmo-typography" fill="#2B2728">
    <!-- V -->
    <path
      d="M 265 18 L 325 182 L 368 182 L 428 18 L 382 18 L 347 132 L 311 18 Z"
    />

    <!-- First O: Solid Circle with Crisp White Lightning Cutout -->
    <g id="o-bolt">
      <circle cx="530" cy="100" r="82" />
      <!-- Lightning bolt cut out -->
      <path
        d="M 540 35 L 505 98 L 536 98 L 518 165 L 565 92 L 534 92 Z"
        fill="#FFFFFF"
      />
    </g>

    <!-- L -->
    <path
      d="M 645 18 L 645 182 L 748 182 L 748 144 L 688 144 L 688 18 Z"
    />

    <!-- M: Bold with center vertex reaching baseline -->
    <path
      d="M 778 18 L 778 182 L 820 182 L 820 78 L 852 152 L 872 152 L 904 78 L 904 182 L 946 182 L 946 18 L 898 18 L 862 105 L 826 18 Z"
    />

    <!-- Second O: Circular Ring -->
    <path
      d="M 1065 18 C 1018 18 982 54 982 100 C 982 146 1018 182 1065 182 C 1112 182 1148 146 1148 100 C 1148 54 1112 18 1065 18 Z 
         M 1065 58 C 1089 58 1106 75 1106 100 C 1106 125 1089 142 1065 142 C 1041 142 1024 125 1024 100 C 1024 75 1041 58 1065 58 Z"
      fill-rule="evenodd"
    />
  </g>
</svg>
`;

async function run() {
  const publicDir = path.resolve("./public");
  const assetsDir = path.resolve("./src/assets/images");

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const svgBuffer = Buffer.from(svgLogo);

  // Render high-resolution transparent PNG (2500 x 400)
  const pngBuffer = await sharp(svgBuffer, { density: 300 })
    .resize(2500, 400, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const publicDest = path.join(publicDir, "volmo_logo.png");
  const assetsDest = path.join(assetsDir, "volmo_logo.png");

  fs.writeFileSync(publicDest, pngBuffer);
  fs.writeFileSync(assetsDest, pngBuffer);

  console.log("Generated pixel-perfect PNG logo at:");
  console.log("-", publicDest, `(${pngBuffer.length} bytes)`);
  console.log("-", assetsDest, `(${pngBuffer.length} bytes)`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
