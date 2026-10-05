import fs from 'fs';
import path from 'path';

const newBook = {
  id: "res-spring-security-10-concepts-guide",
  title: "10 Spring Security Concepts You Must Know: Large-Text Mobile Guide",
  author: "Spring Security Engineering",
  pages: 12,
  fileName: "10_Spring_Security_Concepts_You_Must_Know.pdf",
  category: "spring-boot",
  subCategory: "Spring Data JPA & Security",
  resourceType: "HANDBOOK",
  difficulty: "BEGINNER",
  priority: "MUST_LEARN",
  status: "NOT_STARTED",
  readingStatus: "NOT_STARTED",
  progress: 0,
  currentPage: 0,
  totalPages: 12,
  source: "uploaded_pdf",
  sourceUrl: "C:\\Users\\ashri\\Downloads\\Placement_Interview_Guides\\10_Spring_Security_Concepts_You_Must_Know.pdf",
  whatIsThisBookFor: "A high-clarity 12-page mobile guide covering the 10 indispensable Spring Security concepts: Authentication, Authorization, SecurityFilterChain, UserDetailsService, PasswordEncoder, Roles vs Authorities, JWT, CSRF, Method Security, and SecurityContext flow.",
  summary: "Crisp and screenshot-friendly handbook explaining the core mental models and practical Java syntax for modern Spring Security: (1) Authentication (identifying WHO the user is), (2) Authorization (WHAT they can access), (3) SecurityFilterChain request matching and permit rules, (4) UserDetails and UserDetailsService database loading, (5) DelegatingPasswordEncoder hash verification, (6) Roles vs Authorities fine-grained permissions, (7) Stateless JWT Bearer token authentication, (8) CSRF protection and state-changing request validation, (9) Method-Level Security with @EnableMethodSecurity and @PreAuthorize, (10) SecurityContextHolder authentication storage, and (11) Complete quick-revision summary checklist.",
  keyTakeaways: [
    "Clear visual workflow for the 10 pillars of enterprise Spring Security",
    "Modern Spring Boot 3 SecurityFilterChain syntax replacing deprecated WebSecurityConfigurerAdapter",
    "Stateless JWT vs session-based security, CSRF protection, and method-level @PreAuthorize defense",
    "Quick-revision questions ideal for technical interview preparation"
  ],
  prerequisites: ["Core Java and basic Spring Boot web application concepts"],
  recommendedNext: ["res-spring-boot-data-jpa-shaik-82", "res-java-1"],
  topics: ["SpringSecurity", "Authentication", "Authorization", "SecurityFilterChain", "JWT", "CSRF", "PasswordEncoder", "MethodSecurity"],
  tags: ["SpringSecurity", "SpringBoot", "Auth", "JWT", "Security", "Backend", "Handbook"],
  dateAdded: "2026-10-05",
  lastOpened: "2026-10-05"
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
console.log("Successfully added '10 Spring Security Concepts' to pythonMlResources.ts!");
