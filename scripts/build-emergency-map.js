const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildMap() {
  const zoom = 14;
  // Uijeongbu core area:
  // x: 13973 (의정부서부/의정부역), 13974 (의정부동/금오동서부), 13975 (금오동/성모병원/신곡동), 13976 (민락2지구/낙양동)
  // y: 6333 (성모병원, 금오동, 자금동), 6334 (을지대병원, 북부청사, 의정부역, 신곡동), 6335 (회룡역, 장암동, 호원동)
  const xs = [13973, 13974, 13975, 13976];
  const ys = [6333, 6334, 6335];
  
  console.log(`Fetching ${xs.length * ys.length} tiles for Uijeongbu map...`);
  
  const composites = [];
  for (let c = 0; c < xs.length; c++) {
    for (let r = 0; r < ys.length; r++) {
      const url = `https://tile.openstreetmap.org/${zoom}/${xs[c]}/${ys[r]}.png`;
      const res = await fetch(url, { headers: { 'User-Agent': 'UijeongbuCivicPortalMap/1.0 (contact@ksp-local-info.kr)' } });
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      composites.push({
        input: buf,
        left: c * 256,
        top: r * 256
      });
    }
  }

  const width = xs.length * 256;  // 1024
  const height = ys.length * 256; // 768

  console.log(`Compositing base map ${width}x${height}...`);

  // 을지대병원: x = (13974.783 - 13973) * 256 = 456, y = (6334.100 - 6333) * 256 = 282
  // 성모병원: x = (13975.343 - 13973) * 256 = 600, y = (6333.709 - 6333) * 256 = 182
  // Crop area: left 40, top 80, width 944, height 420
  // Relative in cropped image:
  // 을지대병원: x = 456 - 40 = 416, y = 282 - 80 = 202
  // 성모병원: x = 600 - 40 = 560, y = 182 - 80 = 102

  const overlaySvg = `
    <svg width="944" height="420" viewBox="0 0 944 420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      
      <!-- 성모병원 마커 (Red) -->
      <g transform="translate(560, 102)" filter="url(#shadow)">
        <circle cx="0" cy="0" r="14" fill="#ef4444" fill-opacity="0.3">
          <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M 0 -18 C -9 -18 -14 -12 -14 -4 C -14 6 0 18 0 18 C 0 18 14 6 14 -4 C 14 -12 9 -18 0 -18 Z" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <circle cx="0" cy="-6" r="4.5" fill="#ffffff"/>
        <!-- 뱃지 라벨 -->
        <rect x="18" y="-18" width="132" height="24" rx="2" fill="#181a1d" fill-opacity="0.9" stroke="#ef4444" stroke-width="1.5"/>
        <text x="24" y="-2" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">의정부성모병원 응급실</text>
      </g>

      <!-- 을지대병원 마커 (Emerald/Red) -->
      <g transform="translate(416, 202)" filter="url(#shadow)">
        <circle cx="0" cy="0" r="14" fill="#059669" fill-opacity="0.3">
          <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/>
        </circle>
        <path d="M 0 -18 C -9 -18 -14 -12 -14 -4 C -14 6 0 18 0 18 C 0 18 14 6 14 -4 C 14 -12 9 -18 0 -18 Z" fill="#059669" stroke="#ffffff" stroke-width="2"/>
        <circle cx="0" cy="-6" r="4.5" fill="#ffffff"/>
        <!-- 뱃지 라벨 -->
        <rect x="18" y="-18" width="132" height="24" rx="2" fill="#181a1d" fill-opacity="0.9" stroke="#10b981" stroke-width="1.5"/>
        <text x="24" y="-2" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">의정부을지대병원 응급실</text>
      </g>
    </svg>
  `;

  // 1. Light Mode Base Map
  const baseImgBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 245, g: 247, b: 250, alpha: 1 }
    }
  })
  .composite(composites)
  .png()
  .toBuffer();

  const lightMap = await sharp(baseImgBuffer)
    .extract({ left: 40, top: 80, width: 944, height: 420 })
    .composite([{
      input: Buffer.from(overlaySvg),
      top: 0,
      left: 0
    }])
    .png({ quality: 95 })
    .toBuffer();

  const lightPath = path.join(__dirname, '../public/images/emergency-map-bg.png');
  fs.writeFileSync(lightPath, lightMap);
  console.log(`Saved Light Map: ${lightPath} (${lightMap.length} bytes)`);

  // 2. Dark Mode Base Map (Darkened tiles + true red/emerald pins)
  const darkBaseBuffer = await sharp(baseImgBuffer)
    .negate({ alpha: false })
    .modulate({ brightness: 0.72, saturation: 0.55 })
    .png()
    .toBuffer();

  const darkMap = await sharp(darkBaseBuffer)
    .extract({ left: 40, top: 80, width: 944, height: 420 })
    .composite([{
      input: Buffer.from(overlaySvg),
      top: 0,
      left: 0
    }])
    .png({ quality: 95 })
    .toBuffer();

  const darkPath = path.join(__dirname, '../public/images/emergency-map-bg-dark.png');
  fs.writeFileSync(darkPath, darkMap);
  console.log(`Saved Dark Map: ${darkPath} (${darkMap.length} bytes)`);
}

buildMap().catch(err => {
  console.error(err);
  process.exit(1);
});
