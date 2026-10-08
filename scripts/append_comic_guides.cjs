const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/pythonMlResources.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newBooks = [
  {
    id: "res-linkedin-recruiter-outreach-meta-muse",
    title: "LinkedIn Recruiter Outreach: The Complete Comic Guide with Meta Muse",
    author: "Meta Muse Career Guide",
    pages: 9,
    fileName: "LinkedIn_Recruiter_Outreach_Meta_Muse.pdf",
    category: "interviews",
    subCategory: "Career Roadmaps & Study Plans",
    resourceType: "GUIDE",
    difficulty: "BEGINNER",
    priority: "HIGH",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 9,
    source: "uploaded_pdf",
    sourceUrl: "/books/LinkedIn_Recruiter_Outreach_Meta_Muse.pdf",
    fileDataUrl: "/books/LinkedIn_Recruiter_Outreach_Meta_Muse.pdf",
    whatIsThisBookFor: "Mastering direct recruiter and hiring manager outreach on LinkedIn using structured AI prompts, 300-character custom notes, and a tracking pipeline.",
    summary: "A vibrant 9-page comic guide illustrating a systematic 6-step framework (+ bonus scheduled task) for landing interviews through direct outreach: formulating target prompts, filtering out job-board spam, building priority watchlists, crafting human sub-300 character notes, manual review limits, and maintaining a contact status tracker.",
    keyTakeaways: [
      "Step 1: Crafting targeted AI search prompts with role, location, visa, and tech stack parameters",
      "Step 2: Filtering out job-board spam, generic postings, and misaligned seniority to reach genuine hiring managers",
      "Step 3: Creating an organized watchlist categorized by Priority 1 (strong match + recent post) and Priority 2",
      "Step 4: Writing human, personalized LinkedIn connection notes strictly under 300 characters without robotic AI clichés",
      "Step 5: Enforcing careful manual review before sending to preserve account reputation and connection limits",
      "Step 6: Tracking outreach status (Invite Sent, Connected, Replied, No Response) and never double-messaging for the same role",
      "Bonus: Automating weekday recruiter searches into recurring scheduled intelligence reports",
      "The Complete Loop: Find Jobs -> Find the Recruiter -> Personalize -> Reach Out -> Track -> Repeat"
    ],
    prerequisites: [
      "Active LinkedIn profile",
      "Updated resume",
      "Clear target job title and location preference"
    ],
    recommendedNext: [
      "res-150-dsa-problems-15-patterns",
      "res-interview-theory-question-bank-350-qa"
    ],
    topics: [
      "LinkedIn",
      "RecruiterOutreach",
      "CareerRoadmaps",
      "JobSearch",
      "Networking",
      "ColdOutreach",
      "MetaMuse"
    ],
    tags: [
      "LinkedIn",
      "Outreach",
      "Career",
      "JobSearch",
      "Networking",
      "Guide",
      "Comic"
    ],
    dateAdded: "2026-10-08",
    lastOpened: "2026-10-08"
  },
  {
    id: "res-github-url-tricks-7-power-tricks",
    title: "GitHub URL Tricks: 7 Power Tricks! Swap 1 Word",
    author: "Open Source Productivity Comics",
    pages: 10,
    fileName: "GitHub_URL_Tricks_7_Power_Tricks.pdf",
    category: "devops",
    subCategory: "Git & GitHub Version Control",
    resourceType: "CHEAT_SHEET",
    difficulty: "BEGINNER",
    priority: "HIGH",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 10,
    source: "uploaded_pdf",
    sourceUrl: "/books/GitHub_URL_Tricks_7_Power_Tricks.pdf",
    fileDataUrl: "/books/GitHub_URL_Tricks_7_Power_Tricks.pdf",
    whatIsThisBookFor: "Unlocking browser superpowers for any public GitHub repository instantly by swapping one word in the URL.",
    summary: "A fun and practical 10-page visual comic guide revealing 7 URL replacement tricks to inspect, visualize, run, and query any public GitHub repository directly in your browser without cloning or local setup.",
    keyTakeaways: [
      "Trick 1: GitDiagram (github.com -> gitdiagram.com) — Generates an instant visual architecture map of files and directory dependencies",
      "Trick 2: GitIngest (github.com -> gitingest.com) — Flattens an entire codebase into a single AI-ready prompt file for Claude or ChatGPT",
      "Trick 3: GitHub1s (github.com -> github1s.com) — Launches full VS Code directly in your browser tab with full file tree and syntax highlighting",
      "Trick 4: StackBlitz (github.com/user/repo -> stackblitz.com/github/user/repo) — Boots and runs any repo live in an online WebContainer cloud IDE",
      "Trick 5: DeepWiki (github.com -> deepwiki.com) — Automatically writes an AI-generated structured wiki detailing project modules and architecture",
      "Trick 6: GitHistory (github.com -> github.githistory.xyz) — Replays file change history as an interactive commit-by-commit animation",
      "Trick 7: GitMCP (github.com -> gitmcp.io) — Turns any public GitHub repository into a Model Context Protocol endpoint for AI coding agents",
      "Universal 3-Step Pattern: (1) Navigate to public repo, (2) Copy URL, (3) Swap 1 keyword and hit Enter"
    ],
    prerequisites: [
      "Basic understanding of GitHub repositories and URLs"
    ],
    recommendedNext: [
      "res-docker-kubernetes-guide",
      "res-linux-command-line-cheat-sheet"
    ],
    topics: [
      "GitHub",
      "Git",
      "DeveloperTools",
      "Productivity",
      "OpenSource",
      "WebContainers",
      "ModelContextProtocol"
    ],
    tags: [
      "GitHub",
      "URLTricks",
      "DeveloperTools",
      "CheatSheet",
      "Productivity",
      "Git",
      "DevOps"
    ],
    dateAdded: "2026-10-08",
    lastOpened: "2026-10-08"
  }
];

// Check if already added
if (content.includes("res-linkedin-recruiter-outreach-meta-muse")) {
  console.log("Books already present in pythonMlResources.ts");
  process.exit(0);
}

// Locate the closing array bracket '];'
const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find closing bracket in pythonMlResources.ts");
  process.exit(1);
}

const formattedEntries = newBooks.map(b => '  ' + JSON.stringify(b, null, 2).replace(/\n/g, '\n  ')).join(',\n');
const updatedContent = content.slice(0, lastBracketIndex) + ',\n' + formattedEntries + '\n' + content.slice(lastBracketIndex);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log("Successfully appended LinkedIn Outreach and GitHub URL Tricks to pythonMlResources.ts!");
