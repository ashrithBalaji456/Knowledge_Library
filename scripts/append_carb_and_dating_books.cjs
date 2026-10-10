const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/pythonMlResources.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newBooks = [
  {
    id: "res-amazing-carb-gram-counter",
    title: "The Amazing Carb Gram Counter: Over 400 Foods Field Guide",
    author: "The Nutrition Heroes (Captain Protein, Fiber Fiona, Ninja Nate)",
    pages: 18,
    fileName: "The_Amazing_Carb_Gram_Counter.pdf",
    category: "sec-handbooks",
    subCategory: "Quick References & Summaries",
    resourceType: "CHEAT_SHEET",
    difficulty: "BEGINNER",
    priority: "IMPORTANT",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 18,
    source: "uploaded_pdf",
    sourceUrl: "/books/The_Amazing_Carb_Gram_Counter.pdf",
    fileDataUrl: "/books/The_Amazing_Carb_Gram_Counter.pdf",
    whatIsThisBookFor: "Quick nutritional lookup of carbs, fiber, net carbs, protein, fat, and calories across 400+ foods using visual superhero-themed tables.",
    summary: "A colorful 18-page superhero-themed field guide and nutritional reference table for over 400 foods. Breaks down Total Carbs, Fiber, Net Carbs (Total Carbs - Fiber), Fat, Protein, and Calories across 20+ dietary categories including cheeses, dairy, meats, seafood, eggs, nuts, grains, vegetables, and snacks, featuring color-coded Net Carb status pills for quick meal planning.",
    keyTakeaways: [
      "The Net Carb Formula: Net Carbs = Total Carbs - Fiber (fiber passes unabsorbed and is subtracted)",
      "Color-Coded Carb Pills: Green (<=2g net carbs), Yellow (>2g to 10g), and Red (>10g high carb alert)",
      "Meats & Seafood: Almost all beef, lamb, poultry, and fish cuts contain 0g carbs with high protein density",
      "The Sneaky Sugar Traps: Hidden sugars in salad dressings, barbecue/teriyaki sauces, and fruit juices",
      "High-Fiber Heroes: Black beans, chia, flax, lentils, and avocados where high fiber drops net carb impact significantly",
      "Vegetable Classification: Leafy greens (spinach, kale, lettuce) offer ultra-low net carbs vs root crops (potatoes, corn, yams)",
      "Dairy & Cheeses: Hard and aged cheeses remain below 1g net carbs, while milk and yogurt accumulate sugars rapidly",
      "Baking & Grain Swaps: Comparing high-carb white flour/cornmeal against low-carb alternatives and unsweetened baking chocolate"
    ],
    prerequisites: [
      "Basic nutrition and dietary awareness"
    ],
    recommendedNext: [
      "res-local-python-data-science-handbook"
    ],
    topics: [
      "Nutrition",
      "CarbCounter",
      "DietaryGuide",
      "NetCarbs",
      "HealthyLiving",
      "CheatSheet"
    ],
    tags: [
      "Nutrition",
      "Health",
      "Diet",
      "Carbs",
      "CheatSheet",
      "Guide",
      "Reference"
    ],
    dateAdded: "2026-10-10",
    lastOpened: "2026-10-10"
  },
  {
    id: "res-5-deadly-mistakes-first-date",
    title: "5 Deadly Mistakes to Avoid on Your First Date",
    author: "About-Secrets Publications",
    pages: 8,
    fileName: "5_Deadly_Mistakes_First_Date.pdf",
    category: "sec-english-language",
    subCategory: "Communication & Speaking",
    resourceType: "HANDBOOK",
    difficulty: "BEGINNER",
    priority: "NORMAL",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 8,
    source: "uploaded_pdf",
    sourceUrl: "/books/5_Deadly_Mistakes_First_Date.pdf",
    fileDataUrl: "/books/5_Deadly_Mistakes_First_Date.pdf",
    whatIsThisBookFor: "Mastering social intelligence, conversational dynamics, and first-date communication etiquette.",
    summary: "A concise 8-page dating etiquette and social communication guide identifying the 5 most common first-date blunders and actionable psychology rules: avoiding last-minute winging it through thoughtful planning, maintaining focused attentiveness, holding engaging two-way conversations without self-absorbed monologues or awkward silences, and the universal principle of treating service staff and bystanders with genuine respect.",
    keyTakeaways: [
      "Mistake 1 — Don't Wing It: Thoughtful date preparation communicates respect, capability, and genuine interest",
      "Mistake 2 — Don't Go Overboard: Balance planning without extravagant, high-pressure gestures on date one",
      "Mistake 3 — Keep Your Focus on Your Date: Avoid wandering attention, phone distractions, or flirting with waitstaff",
      "Mistake 4 — Don't Say Nothing: Master engaging conversational topics (travel, passions, culture) without monologuing or bragging",
      "Mistake 5 — The Golden Rule: Character is revealed by how you treat waiters, staff, and strangers, not just your date",
      "Two-Way Flow: Steer conversations collaboratively without dumping the entire speaking burden on the other person",
      "Confidence & Initiative: Decisiveness in suggesting venues demonstrates social maturity and leadership"
    ],
    prerequisites: [
      "Openness to interpersonal psychology and social communication feedback"
    ],
    recommendedNext: [
      "res-linkedin-recruiter-outreach-meta-muse"
    ],
    topics: [
      "Communication",
      "SocialSkills",
      "DatingEtiquette",
      "InterpersonalDynamics",
      "Psychology"
    ],
    tags: [
      "Communication",
      "Etiquette",
      "Dating",
      "SocialSkills",
      "Relationships",
      "Handbook"
    ],
    dateAdded: "2026-10-10",
    lastOpened: "2026-10-10"
  }
];

if (content.includes("res-amazing-carb-gram-counter")) {
  console.log("Books already present in pythonMlResources.ts");
  process.exit(0);
}

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find closing bracket in pythonMlResources.ts");
  process.exit(1);
}

const formattedEntries = newBooks.map(b => '  ' + JSON.stringify(b, null, 2).replace(/\n/g, '\n  ')).join(',\n');
const updatedContent = content.slice(0, lastBracketIndex) + ',\n' + formattedEntries + '\n' + content.slice(lastBracketIndex);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log("Successfully appended Carb Gram Counter and 5 Deadly Mistakes to pythonMlResources.ts!");
