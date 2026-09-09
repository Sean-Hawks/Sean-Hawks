// Build assets/header.svg: a self-contained, animated SVG banner.
// Run from hawks-site (needs sharp): node <profile>/scripts/build-header.mjs <hawks-site-root> <out.svg>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const [siteRoot = process.cwd(), out = "assets/header.svg"] = process.argv.slice(2);
const sharp = createRequire(path.join(siteRoot, "package.json"))("sharp");

const W = 1600, H = 520;
const bg = await sharp(path.join(siteRoot, "public/banner.jpg")).rotate()
  .resize(W, H, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.82, saturation: 0.95 })
  .jpeg({ quality: 78, mozjpeg: true }).toBuffer();
const av = await sharp(path.join(siteRoot, "public/avatar.jpg")).rotate()
  .resize(360, 360, { fit: "cover" }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
const b64 = (b, t = "image/jpeg") => `data:${t};base64,${b.toString("base64")}`;
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,'Noto Sans TC','PingFang TC',sans-serif`;
const MONO = `'JetBrains Mono','SF Mono',Menlo,Consolas,monospace`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Hawks — Dev / ML / CyberSec / HPC / Percussion">
<defs>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
  <clipPath id="av"><circle cx="230" cy="260" r="110"/></clipPath>
  <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#0d0b12" stop-opacity="0.96"/>
    <stop offset="0.55" stop-color="#0d0b12" stop-opacity="0.78"/>
    <stop offset="1" stop-color="#0d0b12" stop-opacity="0.15"/>
  </linearGradient>
  <linearGradient id="accent" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#fbbf24"/></linearGradient>
  <linearGradient id="scan" x1="0" x2="1"><stop offset="0" stop-color="#fbbf24" stop-opacity="0"/><stop offset="0.5" stop-color="#fbbf24" stop-opacity="0.9"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>
  <style>
    .t{font-family:${FONT}} .m{font-family:${MONO}}
    .in{opacity:0;animation:in .9s cubic-bezier(.2,.7,.2,1) forwards}
    .d1{animation-delay:.15s}.d2{animation-delay:.35s}.d3{animation-delay:.55s}.d4{animation-delay:.75s}.d5{animation-delay:.95s}
    @keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    .ring{stroke-dasharray:14 10;transform-origin:230px 260px;animation:spin 40s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .line{stroke-dasharray:1100;stroke-dashoffset:1100;animation:draw 1.6s .2s ease-out forwards}
    @keyframes draw{to{stroke-dashoffset:0}}
    .scan{animation:scan 6s 2s ease-in-out infinite}
    @keyframes scan{0%{transform:translateX(-400px);opacity:0}10%{opacity:1}50%{opacity:1}60%{transform:translateX(1300px);opacity:0}100%{transform:translateX(1300px);opacity:0}}
    .dot{animation:blink 1.6s ease-in-out infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
    .grain{animation:flick 3s steps(2) infinite}
    @keyframes flick{0%,100%{opacity:.05}50%{opacity:.09}}
    @media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important;stroke-dashoffset:0!important}}
  </style>
</defs>
<g clip-path="url(#frame)">
  <image width="${W}" height="${H}" href="${b64(bg)}" preserveAspectRatio="xMidYMid slice"/>
  <rect width="${W}" height="${H}" fill="url(#shade)"/>
  <rect width="${W}" height="${H}" fill="#fbbf24" class="grain" opacity=".06"/>
  <!-- top accent + scanning highlight -->
  <path class="line" d="M64 56 H1536" stroke="url(#accent)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <rect class="scan" x="0" y="52" width="400" height="10" fill="url(#scan)" rx="5"/>
  <!-- avatar -->
  <g class="in d1">
    <circle class="ring" cx="230" cy="260" r="128" fill="none" stroke="#a78bfa" stroke-opacity=".55" stroke-width="2"/>
    <circle cx="230" cy="260" r="114" fill="#0d0b12" fill-opacity=".6"/>
    <image x="120" y="150" width="220" height="220" href="${b64(av)}" clip-path="url(#av)"/>
    <text class="t" x="230" y="428" text-anchor="middle" font-size="30" font-weight="800" fill="#f2eee7" letter-spacing="1">HAWKS<tspan fill="none" stroke="#f2eee7" stroke-opacity=".8" stroke-width="1">.TW</tspan></text>
    <text class="t" x="230" y="458" text-anchor="middle" font-size="16" fill="#b8b3a8" letter-spacing="3">記錄・分享・探索</text>
  </g>
  <!-- eyebrow pill -->
  <g class="in d2">
    <rect x="420" y="118" width="172" height="40" rx="10" fill="#fbbf24" fill-opacity=".12"/>
    <text class="m" x="506" y="145" text-anchor="middle" font-size="17" font-weight="700" fill="#fbbf24" letter-spacing="3">HAWKS.TW</text>
  </g>
  <!-- name -->
  <text class="t in d3" x="420" y="262" font-size="104" font-weight="800" fill="#f2eee7" letter-spacing="-2">Hawks</text>
  <!-- tagline -->
  <text class="t in d4" x="424" y="318" font-size="30" fill="#d9d4c9">Dev <tspan fill="#fbbf24">/</tspan> ML <tspan fill="#fbbf24">/</tspan> CyberSec <tspan fill="#fbbf24">/</tspan> HPC <tspan fill="#fbbf24">/</tspan> Percussion</text>
  <text class="t in d4" x="424" y="356" font-size="20" fill="#9c978c">High school student in Taipei. Writing code, playing percussion, watching anime.</text>
  <!-- status bar -->
  <g class="in d5">
    <path d="M424 400 H1200" stroke="#383640" stroke-width="1"/>
    <circle class="dot" cx="432" cy="432" r="5" fill="#22c55e"/>
    <text class="m" x="448" y="438" font-size="16" fill="#b8b3a8" letter-spacing="1">STATUS: WRITING</text>
    <text class="m" x="700" y="438" font-size="16" fill="#6f6a60" letter-spacing="1">ROUTE_01 → hawks.tw</text>
    <text class="m" x="1060" y="438" font-size="16" fill="#6f6a60" letter-spacing="1">NO ALGORITHM HERE. JUST SIGNAL.</text>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="28" fill="none" stroke="#383640"/>
</g>
</svg>`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log(out, (fs.statSync(out).size / 1024).toFixed(0) + " KB");
