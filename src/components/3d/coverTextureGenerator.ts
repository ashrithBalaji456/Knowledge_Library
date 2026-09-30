import * as THREE from 'three';
import { Resource } from '../../types/library';

// In-memory cache for book cover textures so each unique book is rendered once
const COVER_TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

export function getOrCreateBookCoverTexture(resource: Resource, bookColor: string): THREE.CanvasTexture {
  const key = `${resource.id}-${bookColor}`;
  if (COVER_TEXTURE_CACHE.has(key)) {
    return COVER_TEXTURE_CACHE.get(key)!;
  }

  const canvas = document.createElement('canvas');
  // High-definition 1024x1440 canvas for ultra-crisp publisher-quality book covers
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  const title = resource.title || 'Untitled Knowledge Tome';
  const author = resource.author || 'Author Unknown';
  const category = (resource.category || '').toLowerCase();
  const subCategory = resource.subCategory || '';
  const pages = resource.pages || resource.totalPages || 0;

  // Detect domain theme
  const isDSA = category.includes('dsa') || title.toLowerCase().includes('dsa') || title.toLowerCase().includes('neetcode') || title.toLowerCase().includes('striver') || title.toLowerCase().includes('leetcode') || subCategory.toLowerCase().includes('dsa') || subCategory.toLowerCase().includes('competitive');
  const isJava = !isDSA && (category.includes('java') || title.toLowerCase().includes('java') || subCategory.toLowerCase().includes('java'));
  const isSpring = !isDSA && (category.includes('spring') || title.toLowerCase().includes('spring') || subCategory.toLowerCase().includes('spring'));
  const isPython = !isJava && !isSpring && !isDSA && (category.includes('python') || title.toLowerCase().includes('python'));
  const isML = category.includes('ai-ml') || category.includes('ml') || category.includes('ai') || title.toLowerCase().includes('learning') || title.toLowerCase().includes('neural');
  const isData = category.includes('data') || title.toLowerCase().includes('data') || title.toLowerCase().includes('numpy') || title.toLowerCase().includes('pandas');
  const isInterview = category.includes('interview') || title.toLowerCase().includes('interview') || title.toLowerCase().includes('roadmap');
  const isProject = category.includes('project') || title.toLowerCase().includes('project') || title.toLowerCase().includes('code');
  const isHandbook = category.includes('handbook') || category.includes('cheat') || title.toLowerCase().includes('cheat') || title.toLowerCase().includes('quick');

  // --- 1. RICH BACKGROUND & COLOR PALETTE ---
  let topBg = '#0B192C';
  let midBg = '#1E3E62';
  let botBg = '#06141D';
  let primaryAccent = '#38BDF8';
  let secondaryAccent = '#FBBF24';
  let seriesLabel = 'PYTHON PROGRAMMING & ARCHITECTURE';

  if (isDSA) {
    topBg = '#1E0B36';
    midBg = '#6D28D9';
    botBg = '#100520';
    primaryAccent = '#A78BFA';
    secondaryAccent = '#FBBF24';
    seriesLabel = 'DATA STRUCTURES & ALGORITHMIC PATTERNS';
  } else if (isSpring) {
    topBg = '#022C22';
    midBg = '#047857';
    botBg = '#011A14';
    primaryAccent = '#34D399';
    secondaryAccent = '#A7F3D0';
    seriesLabel = 'SPRING BOOT & ENTERPRISE ARCHITECTURE';
  } else if (isJava) {
    topBg = '#0A192F';
    midBg = '#1E3A8A';
    botBg = '#071020';
    primaryAccent = '#60A5FA';
    secondaryAccent = '#F59E0B';
    seriesLabel = 'JAVA ENTERPRISE & CORE PROGRAMMING';
  } else if (isML) {
    topBg = '#1E1035';
    midBg = '#3B185F';
    botBg = '#100720';
    primaryAccent = '#A78BFA';
    secondaryAccent = '#38BDF8';
    seriesLabel = 'ARTIFICIAL INTELLIGENCE & DEEP LEARNING';
  } else if (isData) {
    topBg = '#042F2E';
    midBg = '#0D9488';
    botBg = '#022020';
    primaryAccent = '#2DD4BF';
    secondaryAccent = '#FDE68A';
    seriesLabel = 'DATA SCIENCE & STATISTICAL COMPUTING';
  } else if (isInterview) {
    topBg = '#2A080C';
    midBg = '#991B1B';
    botBg = '#1A0407';
    primaryAccent = '#F87171';
    secondaryAccent = '#FBBF24';
    seriesLabel = 'TECHNICAL INTERVIEW MASTERY';
  } else if (isHandbook) {
    topBg = '#2D1305';
    midBg = '#9A3412';
    botBg = '#1C0B03';
    primaryAccent = '#FB923C';
    secondaryAccent = '#FDE68A';
    seriesLabel = 'QUICK REFERENCE HANDBOOK & CHEATSHEET';
  } else if (isProject) {
    topBg = '#0F0C29';
    midBg = '#302B63';
    botBg = '#0B081E';
    primaryAccent = '#818CF8';
    secondaryAccent = '#34D399';
    seriesLabel = 'APPLIED DATA SCIENCE & AI PROJECTS';
  }

  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1440);
  bgGrad.addColorStop(0, topBg);
  bgGrad.addColorStop(0.5, midBg);
  bgGrad.addColorStop(1, botBg);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1440);

  // Subtle linen / woven texture overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let y = 0; y < 1440; y += 4) {
    ctx.fillRect(0, y, 1024, 1.5);
  }
  for (let x = 0; x < 1024; x += 4) {
    ctx.fillRect(x, 0, 1.5, 1440);
  }

  // --- 2. SPINE HINGE SHADOW & GOLD FOIL CREASE ---
  const hingeGrad = ctx.createLinearGradient(0, 0, 64, 0);
  hingeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  hingeGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
  hingeGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.1)');
  hingeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = hingeGrad;
  ctx.fillRect(0, 0, 64, 1440);

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(60, 0);
  ctx.lineTo(60, 1440);
  ctx.stroke();

  // --- 3. ORNATE PUBLISHER GOLD FOIL BORDERS & CORNERS ---
  const margin = 76;
  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 4;
  ctx.strokeRect(margin, margin, 1024 - margin * 2, 1440 - margin * 2);

  ctx.strokeStyle = primaryAccent;
  ctx.lineWidth = 2;
  ctx.strokeRect(margin + 10, margin + 10, 1024 - (margin + 10) * 2, 1440 - (margin + 10) * 2);

  // Corner gold diamond ornaments
  drawCornerDiamond(ctx, margin, margin);
  drawCornerDiamond(ctx, 1024 - margin, margin);
  drawCornerDiamond(ctx, margin, 1440 - margin);
  drawCornerDiamond(ctx, 1024 - margin, 1440 - margin);

  // --- 4. TOP SERIES HEADER BANNER ---
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  roundRect(ctx, 180, margin + 24, 664, 52, 26);
  ctx.fill();
  ctx.strokeStyle = secondaryAccent;
  ctx.lineWidth = 2;
  roundRect(ctx, 180, margin + 24, 664, 52, 26);
  ctx.stroke();

  ctx.font = '700 20px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = secondaryAccent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`✦ ${seriesLabel} ✦`, 512, margin + 50);

  // --- 5. MAIN BOOK TITLE ---
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const titleLines = wrapText(title, 22);
  let fontSize = 56;
  if (titleLines.length >= 4) fontSize = 42;
  else if (titleLines.length === 3) fontSize = 48;

  ctx.font = `900 ${fontSize}px "Outfit", "Inter", sans-serif`;
  const titleStartY = margin + 115 + (3 - Math.min(3, titleLines.length)) * 14;

  titleLines.slice(0, 4).forEach((line, idx) => {
    ctx.fillText(line, 512, titleStartY + idx * (fontSize * 1.25));
  });
  ctx.restore();

  // Subtle separator line under title
  const sepY = titleStartY + Math.min(4, titleLines.length) * (fontSize * 1.25) + 18;
  const sepGrad = ctx.createLinearGradient(256, 0, 768, 0);
  sepGrad.addColorStop(0, 'rgba(253, 230, 138, 0)');
  sepGrad.addColorStop(0.5, secondaryAccent);
  sepGrad.addColorStop(1, 'rgba(253, 230, 138, 0)');
  ctx.fillStyle = sepGrad;
  ctx.fillRect(256, sepY, 512, 3);

  // --- 6. CENTRAL HIGH-IMPACT DOMAIN ILLUSTRATION ---
  const emblemCenterY = 790;
  drawThematicArtwork(ctx, isDSA, isJava, isSpring, isPython, isML, isData, isInterview, isProject, isHandbook, emblemCenterY, primaryAccent, secondaryAccent);

  // --- 7. SUBCATEGORY PILL BADGE ---
  if (subCategory) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    roundRect(ctx, 220, emblemCenterY + 180, 584, 46, 23);
    ctx.fill();
    ctx.strokeStyle = primaryAccent;
    ctx.lineWidth = 1.5;
    roundRect(ctx, 220, emblemCenterY + 180, 584, 46, 23);
    ctx.stroke();

    ctx.font = '700 19px "Inter", sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(subCategory.toUpperCase(), 512, emblemCenterY + 203);
  }

  // --- 8. AUTHOR ATTRIBUTION ---
  ctx.fillStyle = secondaryAccent;
  ctx.fillRect(356, 1110, 312, 2);

  ctx.font = '600 18px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'center';
  ctx.fillText('CURATED & AUTHORED BY', 512, 1145);

  ctx.font = '800 32px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = '#F8FAFC';
  let displayAuthor = author;
  if (displayAuthor.length > 30) displayAuthor = displayAuthor.slice(0, 28) + '..';
  ctx.fillText(displayAuthor, 512, 1190);

  // --- 9. VERIFIED PUBLISHER BADGE AT BOTTOM ---
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  roundRect(ctx, 240, 1260, 544, 52, 26);
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  roundRect(ctx, 240, 1260, 544, 52, 26);
  ctx.stroke();

  ctx.font = '700 18px "Inter", monospace';
  ctx.fillStyle = '#FDE68A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const pageLabel = pages > 0 ? `${pages} PAGES  •  AUTHENTIC VERIFIED TOME` : 'MASTER REPOSITORY EDITION';
  ctx.fillText(pageLabel, 512, 1286);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  COVER_TEXTURE_CACHE.set(key, texture);
  return texture;
}

// Draw specialized, publisher-grade vector illustrations
function drawThematicArtwork(
  ctx: CanvasRenderingContext2D,
  isDSA: boolean,
  isJava: boolean,
  isSpring: boolean,
  isPython: boolean,
  isML: boolean,
  isData: boolean,
  isInterview: boolean,
  isProject: boolean,
  isHandbook: boolean,
  cy: number,
  primaryColor: string,
  secondaryColor: string
) {
  const cx = 512;
  ctx.save();

  // Background radiant circular aura
  const aura = ctx.createRadialGradient(cx, cy, 20, cx, cy, 160);
  aura.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  aura.addColorStop(0.6, 'rgba(255, 255, 255, 0.03)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, 160, 0, Math.PI * 2);
  ctx.fill();

  if (isDSA) {
    // --- BINARY SEARCH TREE & ALGORITHMIC TOPOLOGY ---
    const rootX = cx;
    const rootY = cy - 65;
    const l1LeftX = cx - 85;
    const l1LeftY = cy + 5;
    const l1RightX = cx + 85;
    const l1RightY = cy + 5;
    const l2X1 = cx - 125;
    const l2Y1 = cy + 75;
    const l2X2 = cx - 45;
    const l2Y2 = cy + 75;
    const l2X3 = cx + 45;
    const l2Y3 = cy + 75;
    const l2X4 = cx + 125;
    const l2Y4 = cy + 75;

    // Golden branch connection lines
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3.5;

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    drawLine(rootX, rootY, l1LeftX, l1LeftY);
    drawLine(rootX, rootY, l1RightX, l1RightY);
    drawLine(l1LeftX, l1LeftY, l2X1, l2Y1);
    drawLine(l1LeftX, l1LeftY, l2X2, l2Y2);
    drawLine(l1RightX, l1RightY, l2X3, l2Y3);
    drawLine(l1RightX, l1RightY, l2X4, l2Y4);

    // Draw tree nodes with algorithmic keys
    const drawTreeNode = (x: number, y: number, val: string, r: number) => {
      ctx.fillStyle = '#4C1D95';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#C4B5FD';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '800 13px "Inter", monospace';
      ctx.fillStyle = '#FDE68A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(val, x, y);
    };

    drawTreeNode(rootX, rootY, '42', 20);
    drawTreeNode(l1LeftX, l1LeftY, '21', 18);
    drawTreeNode(l1RightX, l1RightY, '64', 18);
    drawTreeNode(l2X1, l2Y1, '15', 16);
    drawTreeNode(l2X2, l2Y2, '32', 16);
    drawTreeNode(l2X3, l2Y3, '55', 16);
    drawTreeNode(l2X4, l2Y4, '89', 16);

    ctx.font = '700 16px "Inter", monospace';
    ctx.fillStyle = '#FDE68A';
    ctx.textAlign = 'center';
    ctx.fillText('O(log N)  •  TWO POINTERS  •  DYNAMIC PROGRAMMING', cx, cy + 125);

  } else if (isSpring) {
    // --- SPRING BOOT LEAF & MICROSERVICES NETWORK ---
    ctx.fillStyle = '#10B981';
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 80);
    ctx.bezierCurveTo(cx + 80, cy - 60, cx + 80, cy + 40, cx, cy + 80);
    ctx.bezierCurveTo(cx - 80, cy + 40, cx - 80, cy - 60, cx, cy - 80);
    ctx.fill();
    ctx.stroke();

    // White central vein & ribs
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 70);
    ctx.lineTo(cx, cy + 70);
    ctx.moveTo(cx, cy - 30);
    ctx.lineTo(cx - 35, cy - 45);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 45, cy - 15);
    ctx.moveTo(cx, cy + 30);
    ctx.lineTo(cx - 35, cy + 15);
    ctx.moveTo(cx, cy - 30);
    ctx.lineTo(cx + 35, cy - 45);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 45, cy - 15);
    ctx.moveTo(cx, cy + 30);
    ctx.lineTo(cx + 35, cy + 15);
    ctx.stroke();

    // Microservices orbit nodes
    const orbitNodes = [
      { x: cx - 110, y: cy - 40, r: 14, label: 'REST' },
      { x: cx + 110, y: cy - 40, r: 14, label: 'JPA' },
      { x: cx - 95, y: cy + 55, r: 14, label: 'AUTH' },
      { x: cx + 95, y: cy + 55, r: 14, label: 'CLOUD' },
    ];
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
    ctx.lineWidth = 2;
    orbitNodes.forEach((node) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(node.x, node.y);
      ctx.stroke();

      ctx.fillStyle = '#064E3B';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '700 10px "Inter", sans-serif';
      ctx.fillStyle = '#A7F3D0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });

    ctx.font = '700 16px "Inter", monospace';
    ctx.fillStyle = '#A7F3D0';
    ctx.textAlign = 'center';
    ctx.fillText('@SpringBootApplication  •  @RestController', cx, cy + 120);

  } else if (isJava) {
    // --- ICONIC STEAMING DUKE JAVA CUP & JVM ARCHITECTURE ---
    // Saucer
    ctx.fillStyle = '#1E3A8A';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 60, 75, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cup body
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cx - 50, cy - 20, 100, 75, [4, 4, 30, 30]);
    ctx.fill();
    ctx.stroke();

    // Gold rim
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy - 18);
    ctx.lineTo(cx + 50, cy - 18);
    ctx.stroke();

    // Cup handle
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx + 52, cy + 12, 22, -Math.PI / 2.2, Math.PI / 2.2);
    ctx.stroke();
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Java Coffee Steam (3 organic rising curves)
    const drawSteam = (sx: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sx, cy - 26);
      ctx.bezierCurveTo(sx - 16, cy - 50, sx + 16, cy - 70, sx - 8, cy - 95);
      ctx.stroke();
    };
    drawSteam(cx - 24, '#EF4444');
    drawSteam(cx, '#F59E0B');
    drawSteam(cx + 24, '#3B82F6');

    // Code watermark
    ctx.font = '700 16px "Inter", monospace';
    ctx.fillStyle = 'rgba(96, 165, 250, 0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('public static void main(String[] args)', cx, cy + 115);
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText('JVM BYTECODE  •  OBJECT-ORIENTED  •  GC', cx, cy + 138);

  } else if (isPython) {
    // --- ICONIC PYTHON DUAL SERPENTS IN HIGH FIDELITY ---
    // Top Blue Serpent
    ctx.fillStyle = '#38BDF8';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cx - 90, cy - 80, 110, 85, [35, 35, 10, 35]);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(cx - 30, cy - 80, 75, 45, [15, 35, 35, 10]);
    ctx.fill();
    ctx.stroke();

    // Eye 1
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - 50, cy - 50, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx - 50, cy - 50, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bottom Yellow Serpent
    ctx.fillStyle = '#FBBF24';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cx - 20, cy - 5, 110, 85, [10, 35, 35, 35]);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(cx - 45, cy + 35, 75, 45, [35, 10, 15, 35]);
    ctx.fill();
    ctx.stroke();

    // Eye 2
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + 50, cy + 50, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx + 50, cy + 50, 4, 0, Math.PI * 2);
    ctx.fill();

    // Code syntax watermark in background
    ctx.font = '600 16px "Inter", monospace';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('def __init__(self, data): self.model = Pipeline()', cx, cy - 110);
    ctx.fillText('from typing import List, Dict, Optional, Tuple', cx, cy + 120);

  } else if (isML) {
    // --- LUMINOUS MULTI-LAYER DEEP NEURAL NETWORK ---
    const layer1 = [cy - 70, cy - 25, cy + 25, cy + 70];
    const layer2 = [cy - 90, cy - 45, cy, cy + 45, cy + 90];
    const layer3 = [cy - 60, cy, cy + 60];
    const layer4 = [cy - 30, cy + 30];

    const x1 = cx - 130;
    const x2 = cx - 45;
    const x3 = cx + 45;
    const x4 = cx + 130;

    // Synaptic connection lines
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.45)';
    ctx.lineWidth = 2.0;

    layer1.forEach((y1) => {
      layer2.forEach((y2) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    });

    layer2.forEach((y2) => {
      layer3.forEach((y3) => {
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.stroke();
      });
    });

    layer3.forEach((y3) => {
      layer4.forEach((y4) => {
        ctx.beginPath();
        ctx.moveTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.stroke();
      });
    });

    // Luminous nodes
    const drawNodes = (xs: number, ys: number[], color: string, radius: number) => {
      ys.forEach((y) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(xs, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    drawNodes(x1, layer1, '#38BDF8', 11);
    drawNodes(x2, layer2, '#A78BFA', 13);
    drawNodes(x3, layer3, '#F472B6', 13);
    drawNodes(x4, layer4, '#FBBF24', 12);

    ctx.font = '700 17px "Inter", monospace';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('y = Softmax(Wᵀ · x + b)', cx, cy + 125);

  } else if (isData) {
    // --- GAUSSIAN BELL CURVE & ANALYTICS HISTOGRAM ---
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4;

    // Bell curve
    ctx.beginPath();
    for (let x = -130; x <= 130; x += 4) {
      const g = Math.exp(-(x * x) / (2 * 45 * 45));
      const py = cy + 50 - g * 120;
      if (x === -130) ctx.moveTo(cx + x, py);
      else ctx.lineTo(cx + x, py);
    }
    ctx.stroke();

    // Histogram bars under bell curve
    ctx.fillStyle = 'rgba(45, 212, 191, 0.35)';
    const barW = 20;
    const heights = [20, 45, 80, 115, 120, 110, 75, 40, 18];
    heights.forEach((h, i) => {
      const bx = cx - 95 + i * (barW + 3);
      ctx.fillRect(bx, cy + 50 - h, barW, h);
    });

    // X-axis
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 145, cy + 52);
    ctx.lineTo(cx + 145, cy + 52);
    ctx.stroke();

    // Standard deviation markings
    ctx.font = '700 16px "Inter", monospace';
    ctx.fillStyle = '#FDE68A';
    ctx.textAlign = 'center';
    ctx.fillText('-2σ          -1σ          μ          +1σ          +2σ', cx, cy + 76);

  } else if (isInterview) {
    // --- TARGET BULLSEYE & CODING ROADMAP ICON ---
    // Concentric rings
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();

    // Crosshairs
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 100, cy);
    ctx.lineTo(cx + 100, cy);
    ctx.moveTo(cx, cy - 100);
    ctx.lineTo(cx, cy + 100);
    ctx.stroke();

    ctx.font = '700 17px "Inter", sans-serif';
    ctx.fillStyle = '#FBBF24';
    ctx.textAlign = 'center';
    ctx.fillText('100+ SOLVED TECHNICAL CHALLENGES', cx, cy + 120);

  } else if (isHandbook) {
    // --- GOLDEN SHIELD OF REFERENCE ---
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 5;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 85);
    ctx.lineTo(cx + 75, cy - 40);
    ctx.lineTo(cx + 60, cy + 45);
    ctx.lineTo(cx, cy + 90);
    ctx.lineTo(cx - 60, cy + 45);
    ctx.lineTo(cx - 75, cy - 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Checkmark inside shield
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 32, cy);
    ctx.lineTo(cx - 8, cy + 28);
    ctx.lineTo(cx + 36, cy - 24);
    ctx.stroke();

    ctx.font = '700 17px "Inter", sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.textAlign = 'center';
    ctx.fillText('INSTANT CHEATSHEET & DESK REFERENCE', cx, cy + 125);

  } else {
    // --- APPLIED ENGINEERING TERMINAL & CODE ---
    ctx.fillStyle = '#0F172A';
    roundRect(ctx, cx - 140, cy - 70, 280, 140, 12);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    roundRect(ctx, cx - 140, cy - 70, 280, 140, 12);
    ctx.stroke();

    // Window controls
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(cx - 118, cy - 50, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(cx - 100, cy - 50, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(cx - 82, cy - 50, 6, 0, Math.PI * 2);
    ctx.fill();

    // Terminal lines
    ctx.font = '600 15px "Inter", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('> git clone repo && cd app', cx - 120, cy - 20);
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('> python run_model.py', cx - 120, cy + 10);
    ctx.fillStyle = '#34D399';
    ctx.fillText('> [200 OK] Deployed System', cx - 120, cy + 40);
  }

  ctx.restore();
}

// Helpers
function drawCornerDiamond(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#FDE68A';
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 10, y);
  ctx.lineTo(x, y + 10);
  ctx.lineTo(x - 10, y);
  ctx.closePath();
  ctx.fill();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';

  words.forEach((w) => {
    if ((cur + ' ' + w).trim().length <= maxCharsPerLine) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}
