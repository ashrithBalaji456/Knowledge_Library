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
  canvas.width = 512;
  canvas.height = 720;
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

  // 1. Rich Background with Spine Hinge Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 720);
  bgGrad.addColorStop(0, adjustBrightness(bookColor, -0.15));
  bgGrad.addColorStop(0.5, bookColor);
  bgGrad.addColorStop(1, adjustBrightness(bookColor, -0.3));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 720);

  // Subtle linen/leather grain overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < 720; i += 4) {
    ctx.fillRect(0, i, 512, 1.5);
  }

  // Realistic spine hinge groove on left edge
  const hingeGrad = ctx.createLinearGradient(0, 0, 36, 0);
  hingeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  hingeGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.15)');
  hingeGrad.addColorStop(0.9, 'rgba(255, 255, 255, 0.12)');
  hingeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
  ctx.fillStyle = hingeGrad;
  ctx.fillRect(0, 0, 36, 720);

  // Gold foil vertical crease line
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(34, 0);
  ctx.lineTo(34, 720);
  ctx.stroke();

  // 2. Ornate Gold Foil Outer & Inner Borders
  const margin = 42;
  ctx.strokeStyle = '#F3D270';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(margin, margin, 512 - margin * 2, 720 - margin * 2);

  ctx.strokeStyle = '#B38B28';
  ctx.lineWidth = 1.0;
  ctx.strokeRect(margin + 5, margin + 5, 512 - (margin + 5) * 2, 720 - (margin + 5) * 2);

  // Gold Corner Ornaments
  drawCornerDiamond(ctx, margin, margin);
  drawCornerDiamond(ctx, 512 - margin, margin);
  drawCornerDiamond(ctx, margin, 720 - margin);
  drawCornerDiamond(ctx, 512 - margin, 720 - margin);

  // 3. Top Series / Technology Ribbon
  let seriesName = 'LIBRARY EDITION';
  if (category.includes('python')) seriesName = 'PYTHON PROGRAMMING SERIES';
  else if (category.includes('ml') || category.includes('ai')) seriesName = 'ARTIFICIAL INTELLIGENCE & ML';
  else if (category.includes('data')) seriesName = 'DATA SCIENCE & COMPUTING';
  else if (category.includes('handbook')) seriesName = 'QUICK REFERENCE HANDBOOK';
  else if (category.includes('interview')) seriesName = 'INTERVIEW MASTERY GUIDE';
  else if (category.includes('project')) seriesName = 'APPLIED ENGINEERING LAB';
  else if (category.includes('java')) seriesName = 'ENTERPRISE JAVA SERIES';

  ctx.font = '700 13px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#FDE68A';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText(`✦ ${seriesName} ✦`, 256, margin + 28);

  // Decorative divider
  ctx.fillStyle = '#E5C158';
  ctx.fillRect(156, margin + 38, 200, 1.5);

  // 4. Main Book Title
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';

  const titleLines = wrapText(title, 20);
  let fontSize = 34;
  if (titleLines.length > 3) fontSize = 26;
  else if (titleLines.length === 3) fontSize = 30;

  ctx.font = `800 ${fontSize}px "Outfit", "Inter", sans-serif`;

  const titleStartY = margin + 85 + (3 - Math.min(3, titleLines.length)) * 10;
  titleLines.slice(0, 4).forEach((line, idx) => {
    ctx.fillText(line, 256, titleStartY + idx * (fontSize * 1.22));
  });
  ctx.restore();

  // 5. Center Topic Visual Emblem
  const emblemCenterY = 385;
  drawCoverEmblem(ctx, category, title, emblemCenterY);

  // 6. Subcategory Banner
  if (subCategory) {
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.fillText(subCategory.toUpperCase(), 256, emblemCenterY + 110);
  }

  // 7. Author Section
  ctx.fillStyle = '#E5C158';
  ctx.fillRect(176, 545, 160, 1.5);

  ctx.font = '500 13px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'center';
  ctx.fillText('WRITTEN BY', 256, 570);

  ctx.font = '700 20px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = '#F8FAFC';
  let displayAuthor = author;
  if (displayAuthor.length > 28) displayAuthor = displayAuthor.slice(0, 26) + '..';
  ctx.fillText(displayAuthor, 256, 598);

  // 8. Bottom Page Count / Verification Foil Badge
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  roundRect(ctx, 136, 626, 240, 32, 16);
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.2;
  roundRect(ctx, 136, 626, 240, 32, 16);
  ctx.stroke();

  ctx.font = '700 12px "Inter", monospace';
  ctx.fillStyle = '#FDE68A';
  ctx.textAlign = 'center';
  const pageLabel = pages > 0 ? `${pages} PAGES • VERIFIED TOME` : 'DIGITAL EDITION';
  ctx.fillText(pageLabel, 256, 647);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  COVER_TEXTURE_CACHE.set(key, texture);
  return texture;
}

// Draw specialized domain emblems
function drawCoverEmblem(ctx: CanvasRenderingContext2D, category: string, title: string, cy: number) {
  const cx = 256;
  const t = title.toLowerCase();

  ctx.save();

  // Subtle circular halo backdrop
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 80);
  halo.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  halo.addColorStop(0.7, 'rgba(255, 255, 255, 0.04)');
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 2.5;

  if (category.includes('python') || t.includes('python')) {
    // Stylized Python Interlocking Emblems
    // Top blue-gold loop
    ctx.strokeStyle = '#38BDF8';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.arc(cx - 14, cy - 14, 28, Math.PI * 0.5, Math.PI * 2);
    ctx.lineTo(cx + 8, cy - 42);
    ctx.stroke();

    // Eye dot
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(cx - 24, cy - 24, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bottom yellow-gold loop
    ctx.strokeStyle = '#FBBF24';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.arc(cx + 14, cy + 14, 28, Math.PI * 1.5, Math.PI);
    ctx.lineTo(cx - 8, cy + 42);
    ctx.stroke();

    // Bottom Eye dot
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(cx + 24, cy + 24, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (category.includes('ml') || category.includes('ai') || t.includes('neural') || t.includes('learning')) {
    // Multi-layer Neural Network Synapse Graphic
    const l1 = [cy - 35, cy, cy + 35];
    const l2 = [cy - 48, cy - 16, cy + 16, cy + 48];
    const l3 = [cy - 20, cy + 20];

    // Synapses
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.2;
    l1.forEach((y1) => {
      l2.forEach((y2) => {
        ctx.beginPath();
        ctx.moveTo(cx - 55, y1);
        ctx.lineTo(cx, y2);
        ctx.stroke();
      });
    });
    l2.forEach((y2) => {
      l3.forEach((y3) => {
        ctx.beginPath();
        ctx.moveTo(cx, y2);
        ctx.lineTo(cx + 55, y3);
        ctx.stroke();
      });
    });

    // Nodes
    ctx.fillStyle = '#38BDF8';
    l1.forEach((y) => {
      ctx.beginPath();
      ctx.arc(cx - 55, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#FBBF24';
    l2.forEach((y) => {
      ctx.beginPath();
      ctx.arc(cx, y, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#34D399';
    l3.forEach((y) => {
      ctx.beginPath();
      ctx.arc(cx + 55, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (category.includes('data') || t.includes('numpy') || t.includes('pandas') || t.includes('stats')) {
    // Data Distribution Gaussian Curve & Histogram Bars
    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 2.5;

    // Normal curve
    ctx.beginPath();
    for (let x = -60; x <= 60; x += 3) {
      const g = Math.exp(-(x * x) / (2 * 24 * 24));
      const py = cy + 25 - g * 60;
      if (x === -60) ctx.moveTo(cx + x, py);
      else ctx.lineTo(cx + x, py);
    }
    ctx.stroke();

    // Bar chart underneath
    ctx.fillStyle = 'rgba(34, 211, 238, 0.35)';
    const barWidth = 10;
    const heights = [18, 32, 50, 42, 26, 14];
    heights.forEach((h, i) => {
      const bx = cx - 35 + i * (barWidth + 3);
      ctx.fillRect(bx, cy + 28 - h, barWidth, h);
    });

    // Axis line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 65, cy + 28);
    ctx.lineTo(cx + 65, cy + 28);
    ctx.stroke();
  } else if (category.includes('handbook') || category.includes('cheat')) {
    // Open Handbook / Shield Graphic
    ctx.strokeStyle = '#FB923C';
    ctx.lineWidth = 3;
    // Shield
    ctx.beginPath();
    ctx.moveTo(cx, cy - 40);
    ctx.lineTo(cx + 42, cy - 20);
    ctx.lineTo(cx + 35, cy + 25);
    ctx.lineTo(cx, cy + 50);
    ctx.lineTo(cx - 35, cy + 25);
    ctx.lineTo(cx - 42, cy - 20);
    ctx.closePath();
    ctx.stroke();

    // Checkmark inside
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy);
    ctx.lineTo(cx - 4, cy + 15);
    ctx.lineTo(cx + 20, cy - 12);
    ctx.stroke();
  } else if (category.includes('interview') || t.includes('interview')) {
    // Bullseye Target & Arrow
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Universal Knowledge Star / Diamond Emblem
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 45);
    ctx.lineTo(cx + 35, cy);
    ctx.lineTo(cx, cy + 45);
    ctx.lineTo(cx - 35, cy);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Helpers
function drawCornerDiamond(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#F3D270';
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x + 6, y);
  ctx.lineTo(x, y + 6);
  ctx.lineTo(x - 6, y);
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

function adjustBrightness(hex: string, percent: number): string {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) num = 0x2563eb;
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * percent);
  let b = (num & 0x0000ff) + Math.round(255 * percent);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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
