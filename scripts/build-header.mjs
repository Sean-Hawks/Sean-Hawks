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

// typed link lines (one SVG per line so each stays clickable)
const LINES = [
  ["web",     "web",     "hawks.tw",         "notes, write-ups, and a library of things I love", 0.3],
  ["rss",     "rss",     "hawks.tw/rss.xml", "subscribe. no algorithm involved",               1.9],
  ["discord", "discord", "dc.hawks.tw",      "come say hi",                                     3.3],
  ["mail",    "mail",    "me@hawks.tw",      "for anything else",                               4.3],
];
const CH = 9.6, SIZE = 16, LW = 900, LH = 30;
for (const [id, key, value, note, delay] of LINES) {
  const parts = [["$ ", AMBER], [key.padEnd(8), FG], [value.padEnd(19), AMBER], ["# " + note, DIM]];
  const text = parts.map(([t]) => t).join("");
  const w = text.length * CH;
  let x = 14, spans = "";
  for (const [t, fill] of parts) { spans += `<tspan fill="${fill}" xml:space="preserve">${t.replace(/ /g, " ")}</tspan>`; x += t.length * CH; }
  const dur = (text.length * 0.028).toFixed(2);
  const keyTimes = Array.from({length: text.length + 1}, (_, i) => (i / text.length).toFixed(4)).join(";");
  const values = Array.from({length: text.length + 1}, (_, i) => (w * i / text.length).toFixed(1)).join(";");
  const last = id === "mail";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LW} ${LH}" width="${LW}" height="${LH}" role="img" aria-label="${key} ${value}">
<style>.m{font-family:${MONO}}.c{animation:b 1s steps(2) infinite}@keyframes b{0%,100%{opacity:1}50%{opacity:0}}</style>
<clipPath id="k"><rect x="14" y="0" width="0" height="${LH}"><animate attributeName="width" begin="${delay}s" dur="${dur}s" calcMode="discrete" keyTimes="${keyTimes}" values="${values}" fill="freeze"/></rect></clipPath>
<text class="m" x="14" y="21" font-size="${SIZE}" clip-path="url(#k)">${spans}</text>
<rect class="c" x="14" y="6" width="9" height="19" fill="${AMBER}" opacity="0">
  <animate attributeName="x" begin="${delay}s" dur="${dur}s" calcMode="discrete" keyTimes="${keyTimes}" values="${values.split(";").map(v => (14 + +v).toFixed(1)).join(";")}" fill="freeze"/>
  <set attributeName="opacity" to="1" begin="${delay}s"/>${last ? "" : `<set attributeName="opacity" to="0" begin="${(delay + +dur).toFixed(2)}s"/>`}
</rect>
</svg>`;
  fs.writeFileSync(`assets/link-${id}.svg`, svg);
}
console.log("typed link lines written");

// toolbox panel
const GROUPS = [
  ["LANG",    [["Python", "#3776AB"], ["C++", "#00599C"], ["C", "#A8B9CC"], ["TypeScript", "#3178C6"], ["JavaScript", "#F7DF1E"], ["Bash", "#4EAA25"]]],
  ["ML/HPC",  [["PyTorch", "#EE4C2C"], ["CUDA", "#76B900"], ["Slurm", "#4FA3DD"], ["Inspect AI", "#a78bfa"], ["Jupyter", "#F37626"]]],
  ["SYSTEM",  [["Linux", "#FCC624"], ["Docker", "#2496ED"], ["Git", "#F05032"], ["GitHub Actions", "#2088FF"]]],
  ["WEB",     [["Next.js", "#ffffff"], ["React", "#61DAFB"], ["Node.js", "#5FA04E"], ["Markdown", "#d9d4c9"]]],
  ["EDITOR",  [["Neovim", "#57A143"], ["VS Code", "#007ACC"], ["Obsidian", "#7C3AED"]]],
  ["AGENTS",  [["Claude Code", "#D97757"], ["Codex", "#10A37F"]]],
  ["HW",      [["Arduino", "#00979D"], ["ESP32", "#E7352C"], ["Raspberry Pi", "#C51A4A"]]],
];
const ROW = 50, PAD = 28, LABEL_X = 44, CHIP_X = 170, TW = 1000, TH = PAD * 2 + GROUPS.length * ROW;
let body = "", n = 0;
GROUPS.forEach(([label, tools], r) => {
  const y = PAD + r * ROW + 32;
  body += `<text class="m in" style="animation-delay:${(r * 0.12).toFixed(2)}s" x="${LABEL_X}" y="${y}" font-size="13" fill="${AMBER}" letter-spacing="3">${label}</text>`;
  body += `<path d="M${CHIP_X - 20} ${y - 6}v-8" stroke="#2a2733"/>`;
  let x = CHIP_X;
  for (const [name, color] of tools) {
    const w = 34 + name.length * 9.2;
    body += `<g class="in" style="animation-delay:${(r * 0.12 + 0.15 + n * 0.04).toFixed(2)}s">
      <rect x="${x}" y="${y - 22}" width="${w}" height="32" rx="6" fill="${INK}" fill-opacity=".85" stroke="#2a2733"/>
      <circle cx="${x + 15}" cy="${y - 6}" r="4" fill="${color}"/>
      <text class="m" x="${x + 27}" y="${y - 1}" font-size="15" fill="${FG}">${name}</text>
    </g>`;
    x += w + 10; n++;
  }
});
const toolbox = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${TH}" width="${TW}" height="${TH}" role="img" aria-label="Toolbox">
<defs>
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${AMBER}" stroke-opacity=".06"/></pattern>
  <style>
    .m{font-family:${MONO}}
    .in{opacity:0;animation:in .5s cubic-bezier(.2,.7,.2,1) forwards}
    @keyframes in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important}}
  </style>
</defs>
<rect x=".5" y=".5" width="${TW - 1}" height="${TH - 1}" rx="18" fill="${INK}" fill-opacity=".92" stroke="#2a2733"/>
<rect width="${TW}" height="${TH}" rx="18" fill="url(#grid)"/>
<g stroke="${AMBER}" stroke-width="2" fill="none" stroke-opacity=".9"><path d="M20 44V20h24"/><path d="M${TW - 20} 44V20h-24"/><path d="M20 ${TH - 44}v24h24"/><path d="M${TW - 20} ${TH - 44}v24h-24"/></g>
<text class="m" x="${TW - 44}" y="${PAD + 4}" text-anchor="end" font-size="12" fill="${DIM}" letter-spacing="3">SYS.HAWKS // TOOLBOX</text>
${body}
</svg>`;
fs.writeFileSync("assets/toolbox.svg", toolbox);
console.log("assets/toolbox.svg", TW + "x" + TH);
