import fs from 'fs';
import path from 'path';

const newItems = [
  {
    id: "res-spring-boot-data-jpa-shaik-82",
    title: "Spring Boot Data JPA: The Complete Step-by-Step Guide (2026 Edition)",
    author: "Shaik Johny Basha (Full Stack Java Tech Lead)",
    pages: 82,
    fileName: "Spring_Boot_Data_JPA_Step_By_Step_Guide_82P.pdf",
    category: "spring-boot",
    subCategory: "Spring Data JPA & Security",
    resourceType: "HANDBOOK",
    difficulty: "INTERMEDIATE",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 82,
    source: "uploaded_pdf",
    sourceUrl: "C:\\Users\\ashri\\Downloads\\Placement_Interview_Guides\\Spring_Boot_Data_JPA_Step_By_Step_Guide_82P.pdf",
    whatIsThisBookFor: "Master enterprise Spring Data JPA, Hibernate 6, entity associations, JPQL, native queries, dirty checking, pagination, and PL/SQL stored procedure integration in Spring Boot 3.",
    summary: "An authoritative 82-page complete guide authored by Shaik Johny Basha. Covers: (1) Persistence, JDBC vs ORM, JPA specification vs Hibernate implementation, (2) Spring Data architecture, in-memory proxy generation, (3) Step-by-step setup with H2, MySQL, and Oracle, (4) Execution flow under the hood, (5) CrudRepository, findById idioms, Optional API, (6) Updating records, dirty checking, @DynamicUpdate, @Transient, (7) Deleting records, deleteById vs deleteAllInBatch, (8) Sorting and pagination with Pageable, Page<T>, Slice<T>, (9) JpaRepository extras, Query by Example (QBE), getReferenceById lazy loading, (10) Custom finder methods (findByXxx) and keywords, (11) @Query with JPQL, HQL, and native SQL, @Modifying queries, (12) Java 8 java.time mapping and age calculations, (13) Versioning (@Version optimistic locking) and time stamping (@CreationTimestamp, @UpdateTimestamp), (14) Large Objects (@Lob BLOB/CLOB), (15) Calling PL/SQL stored procedures and REF_CURSORs via EntityManager, (16-18) Association mappings: @OneToMany, @ManyToOne, @ManyToMany, bidirectional joins, orphanRemoval, solving the N+1 problem with JOIN FETCH and @EntityGraph, (19) Production best practices, connection pooling, and (20) Comprehensive troubleshooting guide with 42 interview model answers.",
    keyTakeaways: [
      "End-to-end mastery of Spring Boot 3.x, Hibernate 6, and Jakarta Persistence",
      "Rigorous patterns for CrudRepository, JpaRepository, Query by Example, and custom @Query",
      "Definitive solutions to association mapping, bidirectional cascades, and the 1+N select problem using JOIN FETCH",
      "42 high-frequency enterprise interview questions with concise, expert model answers",
      "Capstone hospital management project specification and 18-session structured study plan"
    ],
    prerequisites: ["Core Java, basic SQL, and Spring Boot basics"],
    recommendedNext: ["res-sql-300-interview-questions-pwc-deloitte", "res-java-1"],
    topics: ["SpringBoot", "SpringDataJPA", "Hibernate", "ORM", "JPQL", "EntityAssociations", "Transactions", "StoredProcedures"],
    tags: ["SpringBoot", "SpringDataJPA", "Hibernate", "Java", "Database", "Backend", "InterviewPrep"],
    dateAdded: "2026-10-05",
    lastOpened: "2026-10-05"
  },
  {
    id: "res-gate-cse-free-practice-directory",
    title: "GATE CSE Free Practice Directory & Mock Test Strategy Guide",
    author: "@dinakarforge",
    pages: 2,
    fileName: "GATE_CSE_Free_Practice_Directory.pdf",
    category: "sec-gate-engineering",
    subCategory: "GATE: Computer Science & IT (CS1 & CS2)",
    resourceType: "HANDBOOK",
    difficulty: "BEGINNER",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 2,
    source: "uploaded_pdf",
    sourceUrl: "C:\\Users\\ashri\\Downloads\\Gate_2026\\GATE_CSE_Free_Practice_Directory.pdf",
    whatIsThisBookFor: "A curated roadmap of high-quality free practice platforms, previous year questions (PYQs), and timed mock test series for GATE Computer Science Engineering aspirants.",
    summary: "Curated 2-page directory and strategy guide covering: (1) Gate Overflow (gateoverflow.in) community Q&A and PDF booklets, (2) NPTEL GATE Portal (gate.nptel.ac.in) official IIT faculty tests and video solutions, (3) ExamSide (questions.examside.com) topic-wise PYQs, (4) PracticePaper mock series for time management, (5) Feature comparison table across utilities and interface types, and (6) Recommended 3-phase revision strategy (Concept Building -> Deep Understanding -> Timed Exam Simulation) with focused tactics for Numerical Answer Type (NAT) questions.",
    keyTakeaways: [
      "Top free platforms for GATE CSE PYQs and simulated IIT exam environments",
      "3-phase revision blueprint: ExamSide topic questions -> Gate Overflow peer reviews -> NPTEL timed mocks",
      "Specialized test-taking strategies for zero-negative-marking NAT questions"
    ],
    prerequisites: ["Computer Science engineering syllabus knowledge"],
    recommendedNext: ["res-gate-cs-2024-set1", "res-gate-cs-2024-set2"],
    topics: ["GATE", "GATECSE", "PYQs", "GateOverflow", "MockTests", "ExamStrategy"],
    tags: ["GATE", "CSE", "ExamPrep", "PracticeDirectory", "Engineering"],
    dateAdded: "2026-10-05",
    lastOpened: "2026-10-05"
  },
  {
    id: "res-ultimate-portfolio-guide-sritech",
    title: "The Ultimate Portfolio Guide: Build a High-Converting Developer Showcase",
    author: "Sri Tech",
    pages: 4,
    fileName: "The_Ultimate_Developer_Portfolio_Guide.pdf",
    category: "projects",
    subCategory: "Portfolio Projects & Source Code",
    resourceType: "HANDBOOK",
    difficulty: "BEGINNER",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 4,
    source: "uploaded_pdf",
    sourceUrl: "C:\\Users\\ashri\\Downloads\\Placement_Interview_Guides\\The_Ultimate_Developer_Portfolio_Guide.pdf",
    whatIsThisBookFor: "Design and build an ultra-premium developer portfolio that communicates value, stands out to recruiters, and lands interviews.",
    summary: "A practical 4-page blueprint covering: (1) The Portfolio Formula: HOOK -> PROOF -> PROJECTS -> CREDIBILITY -> CTA, (2) 7 Essential Sections (Hero, About, Skills, Projects, Experience, Achievements, Contact), (3) Recommended modern stack (React, Next.js, Vite, Three.js, GSAP/Framer Motion), (4) Ready-to-use AI prompts for generating concepts, hero sections, project case studies, and cinematic assets, (5) Motion design pass guidelines, (6) 10-point portfolio content checklist, and (7) 10-Minute AI portfolio workflow.",
    keyTakeaways: [
      "The proven formula to answer Who are you? What can you build? How can someone work with you?",
      "Curated AI prompts to transform basic resumes into cinematic developer showcases",
      "10-minute iterative workflow from visual references to production deployment"
    ],
    prerequisites: ["Basic frontend web development knowledge"],
    recommendedNext: ["res-sql-interview-beginners-to-advance-68", "res-proj-1"],
    topics: ["Portfolio", "WebDev", "Career", "AIPrompts", "Design", "Showcase"],
    tags: ["Portfolio", "Frontend", "CareerGuide", "AIPrompts", "Projects"],
    dateAdded: "2026-10-05",
    lastOpened: "2026-10-05"
  },
  {
    id: "res-tcs-codevita-github-vault",
    title: "TCS CodeVita: Global Competitive Programming Solutions & Contest Vault",
    author: "Global Competitive Programming Community",
    pages: 120,
    fileName: "github.com/topics/tcs-codevita",
    category: "dsa",
    subCategory: "Dynamic Programming & Optimization",
    resourceType: "GITHUB",
    difficulty: "ADVANCED",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 120,
    source: "uploaded_pdf",
    url: "https://github.com/topics/tcs-codevita",
    sourceUrl: "https://github.com/topics/tcs-codevita",
    whatIsThisBookFor: "Prepare for TCS CodeVita (the Guinness World Record competitive coding contest) with curated solutions, round-wise problem analyses, and optimized C++, Java, and Python templates.",
    summary: "The definitive GitHub topic collection for TCS CodeVita aspirants. Features: (1) Solutions to previous seasons (Season 8, 9, 10, 11, 12) across Pre-Qualifier Round 1, Round 2, and Grand Finale, (2) Exhaustive problem-solving patterns: Dynamic Programming, Graph Algorithms (BFS/DFS, Dijkstra, MST), Matrix Simulations, Geometry, Greedy Heuristics, and Big-Integer Math, (3) High-performance templates tailored for TCS CodeVita strict execution time limits, and (4) Interview guidance for candidates who clear CodeVita to qualify for TCS Digital and Prime interview tracks.",
    keyTakeaways: [
      "Extensive repository archive covering past CodeVita contest problems across all rounds",
      "Multi-language implementations (C++, Java, Python 3) with time and space complexity optimizations",
      "Direct pathway to TCS Digital and TCS Prime technical placement offers"
    ],
    prerequisites: ["Data Structures & Algorithms in C++, Java, or Python"],
    recommendedNext: ["res-dsa-1", "res-sql-50-interview-queries-real"],
    topics: ["TCSCodeVita", "CompetitiveProgramming", "DSA", "DynamicProgramming", "GraphAlgorithms", "ContestPrep"],
    tags: ["CodeVita", "TCS", "CompetitiveProgramming", "GitHub", "Algorithms", "Placement"],
    dateAdded: "2026-10-05",
    lastOpened: "2026-10-05"
  }
];

const filePath = path.join(process.cwd(), 'src/data/pythonMlResources.ts');
let content = fs.readFileSync(filePath, 'utf8');

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find '];' in file");
  process.exit(1);
}

const formattedJson = ',\n' + newItems.map(b => '  ' + JSON.stringify(b, null, 2)).join(',\n') + '\n';
const updatedContent = content.slice(0, lastBracketIndex) + formattedJson + content.slice(lastBracketIndex);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log(`Successfully added ${newItems.length} new resources to pythonMlResources.ts!`);
