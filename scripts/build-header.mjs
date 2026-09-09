// Build assets/header.svg + assets/link-*.svg (self-contained, animated, HUD style).
// Run: node scripts/build-header.mjs <hawks-site-root>   (needs sharp from hawks-site)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const [siteRoot = process.cwd()] = process.argv.slice(2);
const sharp = createRequire(path.join(siteRoot, "package.json"))("sharp");
const b64 = (b, t = "image/jpeg") => `data:${t};base64,${b.toString("base64")}`;

const W = 1600, H = 560;
const bg = await sharp(path.join(siteRoot, "public/banner.jpg")).rotate()
  .resize(W, H, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.62, saturation: 0.7 })
  .jpeg({ quality: 74, mozjpeg: true }).toBuffer();
const av = await sharp(path.join(siteRoot, "public/avatar.jpg")).rotate()
  .resize(320, 320, { fit: "cover" }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();

const MONO = `'JetBrains Mono','Fira Code','SF Mono',Menlo,Consolas,'Liberation Mono',monospace`;
const AMBER = "#fbbf24", VIOLET = "#a78bfa", INK = "#0b0a10", FG = "#ece7dc", DIM = "#8b877d";

// typing helper: reveals text with a stepped mask
const typed = (x, y, text, cls, delay, size = 17, fill = FG) => {
  const w = text.length * size * 0.62;
  const id = `t${Math.random().toString(36).slice(2, 7)}`;
  return `<clipPath id="${id}"><rect x="${x}" y="${y - size}" width="0" height="${size * 1.5}">
      <animate attributeName="width" from="0" to="${w}" begin="${delay}s" dur="${(text.length * 0.045).toFixed(2)}s" calcMode="discrete" keyTimes="${Array.from({length: text.length + 1}, (_, i) => (i / text.length).toFixed(3)).join(";")}" values="${Array.from({length: text.length + 1}, (_, i) => (w * i / text.length).toFixed(1)).join(";")}" fill="freeze"/>
    </rect></clipPath>
    <text class="m ${cls}" x="${x}" y="${y}" font-size="${size}" fill="${fill}" clip-path="url(#${id})">${text}</text>`;
};

const header = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Hawks — Dev / ML / CyberSec / HPC / Percussion">
<defs>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  <clipPath id="av"><circle cx="230" cy="280" r="104"/></clipPath>
  <linearGradient id="shade" x1="0" x2="1">
    <stop offset="0" stop-color="${INK}" stop-opacity="0.97"/><stop offset="0.5" stop-color="${INK}" stop-opacity="0.82"/><stop offset="1" stop-color="${INK}" stop-opacity="0.25"/>
  </linearGradient>
  <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${INK}" stop-opacity=".6"/><stop offset=".3" stop-color="${INK}" stop-opacity="0"/><stop offset=".75" stop-color="${INK}" stop-opacity="0"/><stop offset="1" stop-color="${INK}" stop-opacity=".8"/></linearGradient>
  <linearGradient id="accent" x1="0" x2="1"><stop offset="0" stop-color="${VIOLET}"/><stop offset="1" stop-color="${AMBER}"/></linearGradient>
  <linearGradient id="scan" x1="0" x2="1"><stop offset="0" stop-color="${AMBER}" stop-opacity="0"/><stop offset=".5" stop-color="${AMBER}" stop-opacity=".8"/><stop offset="1" stop-color="${AMBER}" stop-opacity="0"/></linearGradient>
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${AMBER}" stroke-opacity=".07"/></pattern>
  <pattern id="lines" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" fill-opacity=".22"/></pattern>
  <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <style>
    .m{font-family:${MONO}}
    .in{opacity:0;animation:in .7s cubic-bezier(.2,.7,.2,1) forwards}
    .d1{animation-delay:.1s}.d2{animation-delay:.3s}.d3{animation-delay:.5s}.d4{animation-delay:.8s}.d5{animation-delay:1.1s}
    @keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    .ring{stroke-dasharray:3 9;transform-origin:230px 280px;animation:spin 30s linear infinite}
    .ring2{stroke-dasharray:60 200;transform-origin:230px 280px;animation:spin 14s linear infinite reverse}
    @keyframes spin{to{transform:rotate(360deg)}}
    .line{stroke-dasharray:1200;stroke-dashoffset:1200;animation:draw 1.4s .1s ease-out forwards}
    @keyframes draw{to{stroke-dashoffset:0}}
    .scan{animation:scan 7s 1.5s ease-in-out infinite}
    @keyframes scan{0%{transform:translateX(-420px);opacity:0}8%{opacity:1}45%{opacity:1}55%{transform:translateX(1300px);opacity:0}100%{transform:translateX(1300px);opacity:0}}
    .sweep{animation:sweep 9s linear infinite}
    @keyframes sweep{from{transform:translateY(-40px)}to{transform:translateY(${H + 40}px)}}
    .dot{animation:blink 1.4s ease-in-out infinite}.cur{animation:blink 1s steps(2) infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
    .g1{animation:g1 6s steps(1) infinite}.g2{animation:g2 6s steps(1) infinite}
    @keyframes g1{0%,88%,100%{transform:none;opacity:0}89%{transform:translate(-5px,2px);opacity:.85}91%{transform:translate(4px,-2px);opacity:.85}93%{transform:none;opacity:0}}
    @keyframes g2{0%,88%,100%{transform:none;opacity:0}90%{transform:translate(5px,-1px);opacity:.85}92%{transform:translate(-3px,2px);opacity:.85}94%{transform:none;opacity:0}}
    .wave{stroke-dasharray:6 6;animation:flow 1.2s linear infinite}
    @keyframes flow{to{stroke-dashoffset:-24}}
    .bar{animation:bar 2.4s ease-in-out infinite}
    .b1{animation-delay:0s}.b2{animation-delay:.3s}.b3{animation-delay:.6s}.b4{animation-delay:.9s}.b5{animation-delay:1.2s}
    @keyframes bar{0%,100%{opacity:.25}50%{opacity:1}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important;stroke-dashoffset:0!important}}
  </style>
</defs>
<g clip-path="url(#frame)">
  <image width="${W}" height="${H}" href="${b64(bg)}" preserveAspectRatio="xMidYMid slice"/>
  <rect width="${W}" height="${H}" fill="url(#shade)"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#lines)"/>
  <rect class="sweep" width="${W}" height="40" fill="${AMBER}" fill-opacity=".04"/>

  <!-- corner brackets -->
  <g stroke="${AMBER}" stroke-width="2" fill="none" stroke-opacity=".9">
    <path d="M28 60V28H60"/><path d="M${W - 28} 60V28H${W - 60}"/><path d="M28 ${H - 60}V${H - 28}H60"/><path d="M${W - 28} ${H - 60}V${H - 28}H${W - 60}"/>
  </g>
  <!-- ruler ticks along the top -->
  <g stroke="${FG}" stroke-opacity=".25">${Array.from({length: 37}, (_, i) => `<path d="M${80 + i * 40} 28v${i % 5 === 0 ? 12 : 6}"/>`).join("")}</g>

  <!-- header meta -->
  <text class="m in d1" x="80" y="66" font-size="13" fill="${AMBER}" letter-spacing="3">SYS.HAWKS // PROFILE</text>
  <text class="m in d1" x="${W - 80}" y="66" text-anchor="end" font-size="13" fill="${DIM}" letter-spacing="2">TAIPEI 25.03°N 121.56°E · UTC+8 · <tspan fill="#22c55e">ONLINE</tspan></text>
  <path class="line" d="M80 82 H${W - 80}" stroke="url(#accent)" stroke-width="2" fill="none"/>
  <rect class="scan" x="0" y="78" width="420" height="8" rx="4" fill="url(#scan)"/>

  <!-- avatar module -->
  <g class="in d2">
    <circle class="ring" cx="230" cy="280" r="130" fill="none" stroke="${AMBER}" stroke-opacity=".7" stroke-width="2"/>
    <circle class="ring2" cx="230" cy="280" r="118" fill="none" stroke="${VIOLET}" stroke-opacity=".8" stroke-width="3"/>
    <circle cx="230" cy="280" r="108" fill="${INK}" fill-opacity=".7"/>
    <image x="126" y="176" width="208" height="208" href="${b64(av)}" clip-path="url(#av)"/>
    <g stroke="${AMBER}" stroke-width="2" fill="none"><path d="M100 150v-16h16"/><path d="M360 150v-16h-16"/><path d="M100 410v16h16"/><path d="M360 410v16h-16"/></g>
    <text class="m" x="230" y="452" text-anchor="middle" font-size="22" font-weight="700" fill="${FG}" letter-spacing="4">HAWKS<tspan fill="${AMBER}">.TW</tspan></text>
    <text class="m" x="230" y="476" text-anchor="middle" font-size="12" fill="${DIM}" letter-spacing="4">記錄・分享・探索</text>
  </g>

  <!-- name with glitch layers -->
  <g class="in d3">
    <text class="m g1" x="430" y="220" font-size="112" font-weight="800" fill="${VIOLET}" letter-spacing="-3">HAWKS</text>
    <text class="m g2" x="430" y="220" font-size="112" font-weight="800" fill="${AMBER}" letter-spacing="-3">HAWKS</text>
    <text class="m" x="430" y="220" font-size="112" font-weight="800" fill="${FG}" letter-spacing="-3" filter="url(#glow)">HAWKS</text>
  </g>
  <g class="in d4">
    <rect x="432" y="244" width="8" height="26" fill="${AMBER}"/>
    <text class="m" x="452" y="265" font-size="22" fill="${FG}" letter-spacing="3">DEV <tspan fill="${AMBER}">/</tspan> ML <tspan fill="${AMBER}">/</tspan> CYBERSEC <tspan fill="${AMBER}">/</tspan> HPC <tspan fill="${AMBER}">/</tspan> PERCUSSION</text>
  </g>

  <!-- terminal -->
  <g class="in d5">
    <rect x="430" y="300" width="760" height="150" rx="8" fill="${INK}" fill-opacity=".72" stroke="#2a2733"/>
    <rect x="430" y="300" width="760" height="26" rx="8" fill="#15131c"/>
    <circle cx="448" cy="313" r="5" fill="#ff5f57"/><circle cx="466" cy="313" r="5" fill="#febc2e"/><circle cx="484" cy="313" r="5" fill="#28c840"/>
    <text class="m" x="810" y="318" text-anchor="middle" font-size="12" fill="${DIM}">hawks@taipei — zsh</text>
  </g>
  ${typed(450, 352, "$ whoami", "", 1.3, 17, AMBER)}
  ${typed(450, 378, "hawks · high school student · Taipei", "", 1.9, 17)}
  ${typed(450, 408, "$ cat now.txt", "", 2.9, 17, AMBER)}
  ${typed(450, 434, "HiPAC 2026 · AIS3 LLM seceval · writing on hawks.tw", "", 3.7, 17)}
  <rect class="cur" x="1092" y="420" width="9" height="18" fill="${AMBER}"><animate attributeName="x" from="450" to="1092" begin="3.7s" dur="2.3s" calcMode="discrete" fill="freeze"/></rect>

  <!-- signal footer -->
  <g class="in d5">
    <path d="M430 480 H${W - 80}" stroke="#2a2733"/>
    <circle class="dot" cx="440" cy="512" r="5" fill="#22c55e"/>
    <text class="m" x="456" y="517" font-size="14" fill="${FG}" letter-spacing="2">STATUS: WRITING</text>
    <text class="m" x="680" y="517" font-size="14" fill="${DIM}" letter-spacing="2">SIGNAL</text>
    <g fill="${AMBER}"><rect class="bar b1" x="750" y="510" width="6" height="8"/><rect class="bar b2" x="760" y="507" width="6" height="11"/><rect class="bar b3" x="770" y="504" width="6" height="14"/><rect class="bar b4" x="780" y="501" width="6" height="17"/><rect class="bar b5" x="790" y="498" width="6" height="20"/></g>
    <polyline class="wave" points="830,512 850,512 856,500 862,524 868,506 874,518 880,512 940,512 946,502 952,522 958,512 1010,512 1016,498 1022,526 1028,512 1090,512" fill="none" stroke="${AMBER}" stroke-width="2" stroke-linejoin="round"/>
    <text class="m" x="${W - 80}" y="517" text-anchor="end" font-size="14" fill="${DIM}" letter-spacing="2">NO ALGORITHM HERE. JUST SIGNAL.</text>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="18" fill="none" stroke="#2a2733"/>
</g>
</svg>`;
fs.mkdirSync("assets", { recursive: true });
fs.writeFileSync("assets/header.svg", header);
console.log("assets/header.svg", (fs.statSync("assets/header.svg").size / 1024).toFixed(0) + " KB");

// link chips
const chips = [
  ["web", "WEB", "hawks.tw"],
  ["rss", "RSS", "hawks.tw/rss.xml"],
  ["discord", "DISCORD", "dc.hawks.tw"],
  ["mail", "MAIL", "me@hawks.tw"],
];
for (const [id, label, value] of chips) {
  const w = 30 + (label.length + value.length + 3) * 9.2 + 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 40" width="${w}" height="40" role="img" aria-label="${label} ${value}">
<style>.m{font-family:${MONO}}.d{animation:b 1.6s ease-in-out infinite}@keyframes b{0%,100%{opacity:1}50%{opacity:.2}}</style>
<rect x=".5" y=".5" width="${w - 1}" height="39" rx="6" fill="${INK}" fill-opacity=".9" stroke="#2a2733"/>
<path d="M8 12V8h4M${w - 8} 12V8h-4M8 28v4h4M${w - 8} 28v4h-4" fill="none" stroke="${AMBER}" stroke-width="1.5"/>
<circle class="d" cx="24" cy="20" r="3" fill="${AMBER}"/>
<text class="m" x="36" y="25" font-size="14" fill="${AMBER}" letter-spacing="2">${label}</text>
<text class="m" x="${36 + (label.length + 1.6) * 9.2}" y="25" font-size="14" fill="${FG}">${value}</text>
</svg>`;
  fs.writeFileSync(`assets/link-${id}.svg`, svg);
}
console.log("chips written");
