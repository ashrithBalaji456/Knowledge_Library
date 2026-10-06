import fs from 'fs';
import path from 'path';

const newBook = {
  id: "res-google-flow-55-prompts-marketing",
  title: "55 Google Flow Prompts for Business Marketing: AI Video Creative Library",
  author: "AI Video Marketing Creative Lab",
  pages: 17,
  fileName: "55_Google_Flow_Prompts_for_Business_Marketing.pdf",
  category: "ai-ml",
  subCategory: "Generative AI Pipelines",
  resourceType: "HANDBOOK",
  difficulty: "BEGINNER",
  priority: "MUST_LEARN",
  status: "NOT_STARTED",
  readingStatus: "NOT_STARTED",
  progress: 0,
  currentPage: 0,
  totalPages: 17,
  source: "uploaded_pdf",
  sourceUrl: "C:\\Users\\ashri\\Downloads\\Placement_Interview_Guides\\55_Google_Flow_Prompts_for_Business_Marketing.pdf",
  whatIsThisBookFor: "Turn business storefronts, interiors, and product reference photos into cinematic AI marketing videos with 55 battle-tested Google Flow creative prompt instructions.",
  summary: "A practical 17-page prompt library containing 55 short creative instructions for converting business, architectural, and product reference images into cinematic marketing videos using Google Flow. Structured across 6 core categories: (1) Store & Storefront Reveals (#1–#10): City FPV flight, VFX architectural assemble, walk-in push through, street zoom, aerial descend, cinematic orbit, drone flyover, and logo reveal; (2) Architecture & Construction VFX (#11–#20): Build from ground up, blueprint morph, wireframe to photoreal, exploded parts assembly, interior furniture assemble, neon assemble, and renovation transformations; (3) Cinematic Camera Moves (#21–#30): Hero push in, low-angle reveal, top-down overhead, side tracking, parallax depth, arc camera path, reverse pullback, macro-to-wide, speed ramp, and continuous one-take tours; (4) Product & Retail Marketing (#31–#40): Hero reveal, luxury 360 orbit, product drop, particle explosion, component assembly, floating product, and shelf-to-checkout flows; (5) Premium Ad Effects (#41–#50): Golden hour shift, day-to-night lighting, cinematic rain, neon night, glass reflection, light sweep, volumetric light, and smoke reveal; (6) Advanced Business Storytelling (#51–#55): Exterior-interior match cuts, customer POV, customer arrival, and full commercial sequences. Features tips for recognizable branding and a 10-prompt quick-start list.",
  keyTakeaways: [
    "55 ready-to-use Google Flow creative prompt formulas for high-converting marketing videos",
    "Precise image-to-video workflow: upload reference photos -> trigger compact instruction -> evaluate camera motion",
    "Comprehensive shot library spanning FPV drones, architectural assemblies, luxury 360 orbits, and atmospheric VFX",
    "Top 10 quick-win prompts for rapid video ad generation across retail, restaurants, gyms, and real estate"
  ],
  prerequisites: ["Basic familiarity with AI image and video generation tools"],
  recommendedNext: ["res-ultimate-portfolio-guide-sritech", "res-aiml-1"],
  topics: ["GoogleFlow", "AIVideoMarketing", "PromptEngineering", "GenerativeAI", "Cinematography", "VideoAds", "VFX"],
  tags: ["GoogleFlow", "AIVideo", "Prompts", "Marketing", "GenerativeAI", "Commercials", "Handbook"],
  dateAdded: "2026-10-07",
  lastOpened: "2026-10-07"
};

const filePath = path.join(process.cwd(), 'src/data/pythonMlResources.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find '];' in file");
  process.exit(1);
}

const formattedJson = ',\n  ' + JSON.stringify(newBook, null, 2) + '\n';
const updatedContent = content.slice(0, lastBracketIndex) + formattedJson + content.slice(lastBracketIndex);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log("Successfully added '55 Google Flow Prompts' to pythonMlResources.ts!");
