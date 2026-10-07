import fs from 'fs';
import path from 'path';

const book1 = {
  id: "res-150-dsa-problems-15-patterns",
  title: "150 DSA Problems, 15 Patterns: Complete Guide with Explanations & Python",
  author: "Algorithmic Interview Series",
  pages: 66,
  fileName: "150_DSA_Problems_15_Patterns.pdf",
  category: "dsa",
  subCategory: "LeetCode 150 & Striver FAANG Patterns",
  resourceType: "INTERVIEW_GUIDE",
  difficulty: "INTERMEDIATE",
  priority: "MUST_LEARN",
  status: "NOT_STARTED",
  readingStatus: "NOT_STARTED",
  progress: 0,
  currentPage: 1,
  totalPages: 66,
  source: "uploaded_pdf",
  sourceUrl: "/books/150_DSA_Problems_15_Patterns.pdf",
  whatIsThisBookFor: "A comprehensive 66-page guide organizing 150 hand-picked DSA problems across 15 core patterns: Two Pointers, Sliding Window, Fast & Slow Pointers, Merge Intervals, Cyclic Sort, In-place LinkedList Reversal, Tree BFS, Tree DFS, Two Heaps, Subsets/Backtracking, Modified Binary Search, Top K Elements, K-way Merge, Dynamic Programming, and Graphs.",
  summary: "Master the 15 fundamental algorithmic patterns required for top-tier software engineering interviews. Each pattern contains clear intuition, time/space complexity analysis, and clean Python implementations for 10 representative problems.",
  keyTakeaways: [
    "Pattern 1: Two Pointers for sorted pair and range convergence",
    "Pattern 2: Sliding Window for continuous subarray/substring optimizations",
    "Pattern 3: Fast & Slow Pointers for cycle detection and midpoints",
    "Pattern 4: Merge Intervals for scheduling and overlapping ranges",
    "Pattern 5: Cyclic Sort for O(n) missing/duplicate number identification",
    "Pattern 6: In-place LinkedList Reversal without extra memory",
    "Patterns 7 & 8: Level-order BFS and Recursive DFS on trees and graphs",
    "Patterns 9 & 12: Two Heaps and Top K Elements using Priority Queues",
    "Patterns 10 & 14: Backtracking subsets and 0/1 Knapsack dynamic programming",
    "Pattern 15: Graphs with BFS, DFS, Union-Find, and Topological Sort"
  ],
  prerequisites: ["Basic Python programming syntax and core data structure concepts"],
  recommendedNext: ["res-interview-theory-350-qa", "res-dsa-1"],
  topics: ["DSA", "LeetCode", "TwoPointers", "SlidingWindow", "DynamicProgramming", "Graphs", "BinarySearch", "Heaps"],
  tags: ["DSA", "Algorithms", "Interview", "Python", "Patterns", "LeetCode", "FAANG"],
  dateAdded: "2026-10-08",
  lastOpened: "2026-10-08"
};

const book2 = {
  id: "res-interview-theory-350-qa",
  title: "Interview Theory Question Bank: 350+ Frequently Asked Questions with Short Answers",
  author: "Code With Swaroop",
  pages: 21,
  fileName: "Interview_Theory_Question_Bank_350_QA.pdf",
  category: "interviews",
  subCategory: "Python Technical Interviews",
  resourceType: "HANDBOOK",
  difficulty: "BEGINNER",
  priority: "MUST_LEARN",
  status: "NOT_STARTED",
  readingStatus: "NOT_STARTED",
  progress: 0,
  currentPage: 1,
  totalPages: 21,
  source: "uploaded_pdf",
  sourceUrl: "/books/Interview_Theory_Question_Bank_350_QA.pdf",
  whatIsThisBookFor: "Rapid revision handbook providing 350 short, interview-friendly answers across the core engineering disciplines: OOPs, DBMS, SQL, Operating Systems, Computer Networks, DSA, Software Engineering, Computer Organization, Python/Java, and Web Technologies.",
  summary: "Handy 21-page reference guide covering 350 frequently asked computer science theory questions. Features 35 focused questions for each of the 10 major technical subjects, designed for high-impact interview preparation.",
  keyTakeaways: [
    "OOPs: 35 Q&As on Encapsulation, Polymorphism, SOLID principles, Virtual Functions, and Dependency Injection",
    "DBMS & SQL: 70 Q&As on ACID, Normalization 1NF-BCNF, Indexing, Transactions, Joins, CTEs, and Window Functions",
    "Operating Systems: 35 Q&As on Scheduling, Deadlocks, Paging, Virtual Memory, and Race Conditions",
    "Computer Networks: 35 Q&As on OSI 7-layers, TCP vs UDP, DNS, TLS, Three-Way Handshake, and Routing",
    "Software Engineering: 35 Q&As on SDLC, Agile/Scrum, CI/CD, Design Patterns, and Testing methodologies",
    "Computer Organization & Architecture: 35 Q&As on CPU, Pipelining, Caches, DMA, and Endianness",
    "Python & Java: 35 Q&As on Memory management, JVM, Garbage Collection, Mutability, and Decorators",
    "Web Technologies: 35 Q&As on DOM, REST APIs, CORS, XSS, SQL Injection, and Security"
  ],
  prerequisites: ["Computer Science undergraduate foundations"],
  recommendedNext: ["res-150-dsa-problems-15-patterns", "res-java-1"],
  topics: ["OOPs", "DBMS", "SQL", "OperatingSystems", "ComputerNetworks", "SoftwareEngineering", "Java", "Python", "Web"],
  tags: ["Interview", "Theory", "QuestionBank", "ComputerScience", "DBMS", "OS", "Networks", "OOPs"],
  dateAdded: "2026-10-08",
  lastOpened: "2026-10-08"
};

const filePath = path.join(process.cwd(), 'src/data/pythonMlResources.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Check if already exists
if (content.includes("res-150-dsa-problems-15-patterns")) {
  console.log("Books already present in pythonMlResources.ts");
  process.exit(0);
}

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find '];' in file");
  process.exit(1);
}

const formattedJson = ',\n  ' + JSON.stringify(book1, null, 2) + ',\n  ' + JSON.stringify(book2, null, 2) + '\n';
const updatedContent = content.slice(0, lastBracketIndex) + formattedJson + content.slice(lastBracketIndex);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log("Successfully added both new books to pythonMlResources.ts!");
