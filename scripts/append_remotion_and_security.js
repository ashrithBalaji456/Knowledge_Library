import fs from 'fs';
import path from 'path';

const newBooks = [
  {
    id: "res-remotion-ai-video-production-guide",
    title: "Remotion AI Video Production: From Empty Folder to Rendered 4K Video",
    author: "Devloveper Sunny (@devloveper_sunny)",
    pages: 44,
    fileName: "Remotion_AI_Video_Production_Guide.pdf",
    category: "ai-ml",
    subCategory: "Generative AI Pipelines",
    resourceType: "HANDBOOK",
    difficulty: "INTERMEDIATE",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 44,
    source: "uploaded_pdf",
    sourceUrl: "C:\\Users\\ashri\\Downloads\\Placement_Interview_Guides\\Remotion_AI_Video_Production_Guide.pdf",
    whatIsThisBookFor: "The definitive 44-page blueprint for programmatic AI video production using Antigravity IDE / VS Code, Remotion Studio, and Claude 3.5 Sonnet to generate 4K MP4 videos from code.",
    summary: "Comprehensive 44-page production manual and master configuration: (1) One-Time Project Setup (Steps 1–12): npx create-video, Blank template, TailwindCSS, installing all 12 agent skills, project scope, package install, public/assets setup, and running Remotion Studio at localhost:3000; (2) Production Cycle (Steps 13–18): Master prompt configuration, structuring title/script/ratio/assets, generating 5 core files (Composition.tsx, Root.tsx, index.ts, index.css, remotion.config.ts), studio live previewing, and H.264 4K rendering; (3) Master Configuration Rules: Script-first visual editing, voice-over duration alignment (Indian English/Tenglish support), eliminating text-only slides, motion graphics, spring/interpolate easing, professional SFX/BGM sync, and 9:16 vertical safe areas; (4) Troubleshooting guide and command cheat sheet.",
    keyTakeaways: [
      "The complete programmatic video pipeline: Antigravity IDE -> Remotion Studio -> Claude -> Rendered 4K MP4",
      "Exact terminal commands and project structure with 12 Remotion agent skills",
      "Full 17-page Master Configuration prompt ready to copy-paste into Claude Projects",
      "Rigorous visual-first principles: replacing boring kinetic subtitles with dynamic motion graphics, spring animations, and audio cues"
    ],
    prerequisites: ["React, TypeScript, and basic Node.js familiarity"],
    recommendedNext: ["res-google-flow-55-prompts-marketing", "res-ultimate-portfolio-guide-sritech"],
    topics: ["Remotion", "AIVideoProduction", "ReactVideo", "Claude", "AntigravityIDE", "MotionGraphics", "TypeScript", "VideoRendering"],
    tags: ["Remotion", "AIVideo", "VideoProduction", "React", "TypeScript", "Claude", "Handbook"],
    dateAdded: "2026-10-07",
    lastOpened: "2026-10-07"
  },
  {
    id: "res-session-hijacking-security-guide",
    title: "Session Hijacking: Mobile & Web Security Defensive Guide",
    author: "Polaki Sai Kiran (@hastag_developer)",
    pages: 3,
    fileName: "Session_Hijacking_Mobile_Web_Security_Guide.pdf",
    category: "security",
    subCategory: "Application Security (OWASP)",
    resourceType: "HANDBOOK",
    difficulty: "BEGINNER",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 3,
    source: "uploaded_pdf",
    sourceUrl: "C:\\Users\\ashri\\Downloads\\Placement_Interview_Guides\\Session_Hijacking_Mobile_Web_Security_Guide.pdf",
    whatIsThisBookFor: "A practical defensive security guide breaking down web and mobile session hijacking vectors, token compromise mechanisms, MFA limitations, and account protection checklists.",
    summary: "Concise 3-page cybersecurity guide explaining: (1) Fundamentals of session hijacking: how authentication cookies and bearer tokens function as persistent wristbands after password verification; (2) Web Attack Surfaces: malicious extensions, infostealers, phishing, insecure client storage, and endpoint sniffing; (3) Mobile Attack Surfaces: app isolation breakdown on rooted/jailbroken devices, rogue notification/screen permissions, and physical device theft; (4) Web vs Mobile comparison matrix; (5) Vigilance practices: Passkeys/authenticator MFA, extension audits, active session review, and global session revocation; (6) Incident response checklist for suspected compromised sessions; (7) Crucial misconception: Why strong passwords alone cannot protect an already authenticated session state.",
    keyTakeaways: [
      "The 'Front Door vs Wristband' mental model: passwords grant entry, sessions represent the active authenticated state",
      "Comparing web browser token theft against mobile application sandbox escalation",
      "Why MFA only protects login authentication and cannot prevent stolen active session replay",
      "Step-by-step account recovery and defensive security audit checklist"
    ],
    prerequisites: ["Basic understanding of web protocols, cookies, and HTTP"],
    recommendedNext: ["res-spring-security-10-concepts-guide", "res-sec-1"],
    topics: ["Cybersecurity", "SessionHijacking", "WebSecurity", "MobileSecurity", "OWASP", "Authentication", "MFA", "Tokens"],
    tags: ["Security", "Cybersecurity", "SessionHijacking", "WebSecurity", "MobileSecurity", "OWASP", "Handbook"],
    dateAdded: "2026-10-07",
    lastOpened: "2026-10-07"
  }
];

const filePath = path.join(process.cwd(), 'src/data/pythonMlResources.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find '];' in file");
  process.exit(1);
}

const formattedJson = ',\n' + newBooks.map(b => '  ' + JSON.stringify(b, null, 2)).join(',\n') + '\n';
const updatedContent = content.slice(0, lastBracketIndex) + formattedJson + content.slice(lastBracketIndex);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log(`Successfully added ${newBooks.length} new resources to pythonMlResources.ts!`);
