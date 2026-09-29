import {
  Resource,
  Section,
  ResourceType,
  Difficulty,
  Priority,
  DuplicateDetectionResult,
  ClassificationConfidence,
  Relationship,
  RelationshipType,
} from '../types/library';

// Domain knowledge taxonomy reference
export interface DomainCategoryRule {
  categoryId: string;
  categoryName: string;
  wing: 'central' | 'west' | 'east' | 'north' | 'south' | 'handbooks' | 'humanities';
  colorHex: string;
  keywords: string[];
  subcategories: {
    name: string;
    keywords: string[];
  }[];
}

export const TAXONOMY_RULES: DomainCategoryRule[] = [
  // --- HANDBOOKS (Rule 4: Separate Dedicated Major Section) ---
  {
    categoryId: 'sec-handbooks',
    categoryName: 'Handbooks & Reference Guides',
    wing: 'handbooks',
    colorHex: '#C2410C', // Amber-Orange
    keywords: ['handbook', 'pocket guide', 'cheat sheet', 'quick reference', 'interview handbook', 'field guide', 'cookbook', 'nutshell', 'reference manual', 'quickstart'],
    subcategories: [
      { name: 'Java & JVM', keywords: ['java', 'jvm', 'kotlin', 'scala', 'multithreading', 'concurrency'] },
      { name: 'Spring & Backend', keywords: ['spring', 'spring boot', 'microservices', 'rest api', 'backend'] },
      { name: 'Databases & SQL', keywords: ['sql', 'postgres', 'postgresql', 'mysql', 'redis', 'mongodb', 'database'] },
      { name: 'Cloud & Infrastructure', keywords: ['aws', 'cloud', 'azure', 'gcp', 'lambda', 's3', 'ec2'] },
      { name: 'DevOps & Containers', keywords: ['docker', 'kubernetes', 'k8s', 'linux', 'git', 'ci/cd', 'terraform'] },
      { name: 'Interview Preparation', keywords: ['interview', 'questions', 'cracking', 'coding interview', 'system design interview'] },
      { name: 'Architecture & Design', keywords: ['architecture', 'patterns', 'design patterns', 'system design'] },
      { name: 'Languages & Grammar', keywords: ['english', 'grammar', 'vocabulary', 'idioms'] },
      { name: 'General Reference', keywords: ['general', 'reference', 'cheatsheet', 'toolkit'] },
    ],
  },

  // --- PROGRAMMING / TECHNICAL ---
  {
    categoryId: 'sec-java',
    categoryName: 'Java Ecosystem',
    wing: 'west',
    colorHex: '#2563EB', // Blue
    keywords: ['java', 'jvm', 'jdk', 'concurrency', 'multithreading', 'collections', 'generics', 'stream', 'lambda', 'byte code', 'garbage collector'],
    subcategories: [
      { name: 'Fundamentals', keywords: ['basics', 'fundamentals', 'introduction', 'syntax', 'oop', 'core java'] },
      { name: 'Collections & Generics', keywords: ['collections', 'generics', 'hashmap', 'arraylist', 'iterator', 'data structures'] },
      { name: 'Concurrency & Multithreading', keywords: ['concurrency', 'multithreading', 'threads', 'executor', 'synchronization', 'locks', 'parallel'] },
      { name: 'JVM Internals & Performance', keywords: ['jvm', 'garbage collection', 'gc', 'jit', 'memory model', 'profiling', 'bytecode'] },
      { name: 'Modern Java Features', keywords: ['java 8', 'java 11', 'java 17', 'java 21', 'records', 'virtual threads', 'lambdas', 'streams'] },
      { name: 'Interview Preparation', keywords: ['interview', 'questions', 'faq', 'crack', 'coding test'] },
    ],
  },
  {
    categoryId: 'sec-spring',
    categoryName: 'Spring & Microservices',
    wing: 'west',
    colorHex: '#059669', // Emerald
    keywords: ['spring', 'spring boot', 'spring framework', 'spring security', 'spring cloud', 'spring data', 'microservices', 'dependency injection'],
    subcategories: [
      { name: 'Spring Core & IoC', keywords: ['core', 'ioc', 'dependency injection', 'beans', 'context', 'aop'] },
      { name: 'Spring Boot', keywords: ['boot', 'autoconfiguration', 'starters', 'actuator', 'rest api', 'web'] },
      { name: 'Spring Security', keywords: ['security', 'oauth2', 'jwt', 'authentication', 'authorization', 'rbac'] },
      { name: 'Spring Data JPA', keywords: ['data jpa', 'jpa', 'hibernate', 'orm', 'repository', 'transactions'] },
      { name: 'Microservices & Cloud', keywords: ['microservices', 'spring cloud', 'eureka', 'gateway', 'resilience4j', 'feign', 'kafka'] },
      { name: 'Testing & Best Practices', keywords: ['testing', 'junit', 'mockito', 'integration testing', 'testcontainers'] },
    ],
  },
  {
    categoryId: 'sec-dsa',
    categoryName: 'Data Structures & Algorithms',
    wing: 'central',
    colorHex: '#7C3AED', // Purple
    keywords: ['dsa', 'algorithm', 'algorithms', 'data structure', 'data structures', 'leetcode', 'dynamic programming', 'graph', 'tree', 'complexity', 'big o', 'sorting'],
    subcategories: [
      { name: 'Core Data Structures', keywords: ['array', 'linked list', 'stack', 'queue', 'heap', 'hash table', 'trie'] },
      { name: 'Trees & Binary Search Trees', keywords: ['tree', 'binary tree', 'bst', 'avl', 'red black', 'traversal'] },
      { name: 'Graphs & Network Algorithms', keywords: ['graph', 'bfs', 'dfs', 'dijkstra', 'topological', 'minimum spanning', 'cycle'] },
      { name: 'Dynamic Programming & Recursion', keywords: ['dynamic programming', 'dp', 'memoization', 'recursion', 'backtracking', 'knapsack'] },
      { name: 'Sorting & Searching', keywords: ['sorting', 'quicksort', 'mergesort', 'binary search', 'two pointers', 'sliding window'] },
      { name: 'Interview Coding', keywords: ['interview', 'cracking', 'blind 75', 'neetcode', 'patterns'] },
    ],
  },
  {
    categoryId: 'sec-system-design',
    categoryName: 'System Design & Distributed Systems',
    wing: 'central',
    colorHex: '#D97706', // Amber
    keywords: ['system design', 'distributed systems', 'scalability', 'high level design', 'low level design', 'architecting', 'caching', 'load balancing', 'microservices'],
    subcategories: [
      { name: 'Architectural Fundamentals', keywords: ['fundamentals', 'scalability', 'latency', 'throughput', 'availability', 'cap theorem'] },
      { name: 'High Level Design (HLD)', keywords: ['hld', 'high level', 'distributed cache', 'cdn', 'rate limiter', 'message queues', 'event driven'] },
      { name: 'Low Level Design (LLD)', keywords: ['lld', 'low level', 'object oriented design', 'design patterns', 'solid principles', 'uml'] },
      { name: 'Distributed Systems Core', keywords: ['distributed', 'consensus', 'raft', 'paxos', 'replication', 'partitioning', 'transactions'] },
      { name: 'Real-World Case Studies', keywords: ['case studies', 'uber', 'netflix', 'twitter', 'youtube', 'whatsapp', 'url shortener'] },
    ],
  },
  {
    categoryId: 'sec-databases',
    categoryName: 'Databases & Storage',
    wing: 'east',
    colorHex: '#0D9488', // Teal
    keywords: ['database', 'databases', 'sql', 'postgresql', 'postgres', 'mysql', 'redis', 'nosql', 'mongodb', 'indexing', 'transactions', 'acid', 'query optimization'],
    subcategories: [
      { name: 'Relational & SQL', keywords: ['sql', 'rdbms', 'queries', 'joins', 'subqueries', 'normalization', 'schema'] },
      { name: 'PostgreSQL', keywords: ['postgres', 'postgresql', 'pl/pgsql', 'vacuum', 'mvcc', 'explain analyze'] },
      { name: 'Query Optimization & Indexing', keywords: ['indexing', 'b-tree', 'execution plan', 'optimization', 'query tuning', 'performance'] },
      { name: 'Transactions & Concurrency', keywords: ['transactions', 'acid', 'isolation levels', 'locking', 'deadlocks', 'wal'] },
      { name: 'NoSQL & In-Memory', keywords: ['nosql', 'redis', 'mongodb', 'cassandra', 'dynamodb', 'key-value', 'caching'] },
    ],
  },
  {
    categoryId: 'sec-cloud-devops',
    categoryName: 'Cloud & DevOps',
    wing: 'east',
    colorHex: '#EA580C', // Orange
    keywords: ['cloud', 'aws', 'docker', 'kubernetes', 'k8s', 'devops', 'linux', 'ci/cd', 'terraform', 'containers', 'ansible', 'monitoring'],
    subcategories: [
      { name: 'Docker & Containers', keywords: ['docker', 'container', 'dockerfile', 'compose', 'images', 'volumes'] },
      { name: 'Kubernetes & Orchestration', keywords: ['kubernetes', 'k8s', 'pods', 'deployment', 'service', 'ingress', 'helm'] },
      { name: 'AWS Cloud Services', keywords: ['aws', 'ec2', 's3', 'lambda', 'iam', 'vpc', 'rds', 'cloudformation'] },
      { name: 'Linux Systems & Shell', keywords: ['linux', 'bash', 'shell', 'kernel', 'processes', 'permissions', 'networking'] },
      { name: 'CI/CD & Automation', keywords: ['ci/cd', 'jenkins', 'github actions', 'gitlab', 'pipeline', 'automation', 'terraform'] },
    ],
  },
  {
    categoryId: 'sec-ai-ml',
    categoryName: 'AI & Machine Learning',
    wing: 'east',
    colorHex: '#0891B2', // Cyan
    keywords: ['ai', 'machine learning', 'deep learning', 'neural networks', 'llm', 'transformer', 'python', 'pytorch', 'tensorflow', 'nlp', 'generative ai'],
    subcategories: [
      { name: 'Foundations of ML', keywords: ['machine learning', 'regression', 'classification', 'scikit', 'math', 'statistics'] },
      { name: 'Deep Learning & Neural Nets', keywords: ['deep learning', 'cnn', 'rnn', 'neural network', 'backpropagation', 'pytorch'] },
      { name: 'LLMs & Generative AI', keywords: ['llm', 'transformer', 'rag', 'langchain', 'prompt engineering', 'gpt', 'attention'] },
      { name: 'Data Engineering & MLOps', keywords: ['data science', 'pandas', 'numpy', 'mlops', 'pipeline', 'feature store'] },
    ],
  },

  // --- NON-TECHNICAL DOMAINS (Rule 3) ---
  {
    categoryId: 'sec-devotional',
    categoryName: 'Devotional & Spiritual Wisdom',
    wing: 'north',
    colorHex: '#B45309', // Warm Ochre / Saffron
    keywords: ['devotional', 'spiritual', 'gita', 'bhagavad', 'upanishad', 'vedanta', 'meditation', 'krishna', 'hinduism', 'philosophy', 'scriptures', 'dharma', 'karma', 'yoga', 'self-realization', 'ramayana', 'mahabharata', 'bhakti'],
    subcategories: [
      { name: 'Bhagavad Gita', keywords: ['bhagavad gita', 'gita', 'krishna', 'arjuna', 'slokas', 'as it is'] },
      { name: 'Upanishads & Vedanta', keywords: ['upanishad', 'vedanta', 'advaita', 'shankara', 'brahman', 'atman'] },
      { name: 'Spirituality & Meditation', keywords: ['meditation', 'mindfulness', 'inner peace', 'spiritual practice', 'consciousness', 'self realization'] },
      { name: 'Vedic Scriptures & Puranas', keywords: ['purana', 'ramayana', 'mahabharata', 'vedas', 'scriptures', 'stories'] },
      { name: 'Devotional Classics', keywords: ['bhakti', 'prayers', 'devotion', 'saints', 'bhajan'] },
    ],
  },
  {
    categoryId: 'sec-english-language',
    categoryName: 'English & Communication',
    wing: 'north',
    colorHex: '#0284C7', // Sky Blue
    keywords: ['english', 'grammar', 'vocabulary', 'speaking', 'communication', 'writing', 'idioms', 'phrases', 'comprehension', 'fluency', 'pronunciation', 'ielts', 'toefl'],
    subcategories: [
      { name: 'Grammar & Syntax', keywords: ['grammar', 'tenses', 'prepositions', 'verbs', 'syntax', 'parts of speech'] },
      { name: 'Vocabulary & Idioms', keywords: ['vocabulary', 'words', 'builder', 'idioms', 'phrases', 'synonyms', 'etymology'] },
      { name: 'Communication & Speaking', keywords: ['speaking', 'conversation', 'fluency', 'accent', 'pronunciation', 'public speaking'] },
      { name: 'Professional & Business Writing', keywords: ['writing', 'emails', 'business english', 'essay', 'composition', 'reports'] },
    ],
  },
  {
    categoryId: 'sec-novels-literature',
    categoryName: 'Literature & Novels',
    wing: 'north',
    colorHex: '#9333EA', // Purple
    keywords: ['novel', 'fiction', 'literature', 'story', 'classics', 'mystery', 'thriller', 'fantasy', 'sci-fi', 'prose', 'poetry', 'non-fiction'],
    subcategories: [
      { name: 'Classic Literature', keywords: ['classics', 'dostoevsky', 'tolstoy', 'shakespeare', 'austen', 'orwell', 'classic'] },
      { name: 'Science Fiction & Fantasy', keywords: ['sci-fi', 'science fiction', 'fantasy', 'space', 'dystopian', 'magic'] },
      { name: 'Mystery & Thriller', keywords: ['mystery', 'thriller', 'detective', 'crime', 'suspense', 'sherlock'] },
      { name: 'Contemporary Fiction', keywords: ['fiction', 'drama', 'novel', 'modern', 'bestseller'] },
    ],
  },
];

// Helper to compute quick string hash for duplicate detection
export function computeContentHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// Clean and normalize strings for matching
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[_\-.]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

export interface ExtractedPDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  totalPages?: number;
  sampleText?: string;
  tableOfContents?: string[];
  fileSize?: number;
  fileName?: string;
}

export interface ClassificationResult {
  resourceType: ResourceType;
  primaryCategory: string;
  categoryName: string;
  subcategory: string;
  wing: 'central' | 'west' | 'east' | 'north' | 'south' | 'handbooks' | 'humanities';
  colorHex: string;
  confidence: ClassificationConfidence;
  difficulty: Difficulty;
  priority: Priority;
  topics: string[];
  tags: string[];
  whatIsThisBookFor: string;
  summary: string;
  keyTakeaways: string[];
  prerequisites: string[];
  recommendedNext: string[];
  isNewSection: boolean;
  newSectionData?: {
    name: string;
    description: string;
    wing: 'central' | 'west' | 'east' | 'north' | 'south' | 'handbooks' | 'humanities';
    color: string;
    subSections: string[];
  };
}

/**
 * Intelligent Librarian Classification Engine
 * Analyzes filename, PDF metadata, TOC, text samples, and concept density
 */
export function classifyResource(
  meta: ExtractedPDFMetadata,
  existingSections: Section[],
  existingResources: Resource[]
): ClassificationResult {
  const fileNameClean = normalizeText(meta.fileName || '');
  const titleClean = normalizeText(meta.title || meta.fileName || '');
  const subjectClean = normalizeText(meta.subject || '');
  const sampleClean = normalizeText(meta.sampleText || '');
  const combinedContext = `${titleClean} ${fileNameClean} ${subjectClean} ${sampleClean}`.toLowerCase();

  // --- Step 1: Detect Resource Type (Rule 4 & 5) ---
  let resourceType: ResourceType = 'BOOK';
  let isHandbook = false;

  const handbookSignals = ['handbook', 'pocket guide', 'cheat sheet', 'quick reference', 'interview handbook', 'field guide', 'cookbook', 'nutshell', 'reference manual'];
  for (const signal of handbookSignals) {
    if (titleClean.includes(signal) || fileNameClean.includes(signal)) {
      resourceType = 'HANDBOOK';
      isHandbook = true;
      break;
    }
  }

  if (!isHandbook) {
    if (combinedContext.includes('interview') && (combinedContext.includes('questions') || combinedContext.includes('cracking') || combinedContext.includes('guide'))) {
      resourceType = 'INTERVIEW_GUIDE';
    } else if (combinedContext.includes('cheatsheet') || combinedContext.includes('cheat sheet')) {
      resourceType = 'CHEAT_SHEET';
    } else if (combinedContext.includes('notes') || combinedContext.includes('study notes') || combinedContext.includes('lecture')) {
      resourceType = 'STUDY_NOTES';
    } else if (combinedContext.includes('specification') || combinedContext.includes('documentation') || combinedContext.includes('rfc')) {
      resourceType = 'DOCUMENTATION';
    } else if (combinedContext.includes('gita') || combinedContext.includes('upanishad') || combinedContext.includes('spiritual') || combinedContext.includes('devotional')) {
      resourceType = 'DEVOTIONAL';
    } else if (combinedContext.includes('novel') || combinedContext.includes('fiction') || combinedContext.includes('story')) {
      resourceType = 'NOVEL';
    } else if (combinedContext.includes('textbook') || combinedContext.includes('edition') || combinedContext.includes('course')) {
      resourceType = 'TEXTBOOK';
    }
  }

  // --- Step 2: Match against Taxonomy Rules or Existing Sections (Rule 8: Prevent Explosion) ---
  let bestMatchRule: DomainCategoryRule | null = null;
  let bestScore = 0;
  let matchedRuleKeywords: string[] = [];

  // If it's a handbook, prioritize the Handbooks rule first (Rule 4)
  if (isHandbook) {
    bestMatchRule = TAXONOMY_RULES.find((r) => r.categoryId === 'sec-handbooks') || null;
  }

  if (!bestMatchRule) {
    for (const rule of TAXONOMY_RULES) {
      if (rule.categoryId === 'sec-handbooks') continue; // Handbooks handled separately
      let score = 0;
      const matched: string[] = [];

      for (const kw of rule.keywords) {
        // Higher weight if keyword appears in title or filename
        if (titleClean.includes(kw) || fileNameClean.includes(kw)) {
          score += 18;
          matched.push(kw);
        } else if (combinedContext.includes(kw)) {
          score += 5;
          matched.push(kw);
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatchRule = rule;
        matchedRuleKeywords = matched;
      }
    }
  }

  // Check existing custom sections in user's library as well
  let matchedExistingSection: Section | null = null;
  for (const sec of existingSections) {
    const secNameNorm = normalizeText(sec.name);
    if (titleClean.includes(secNameNorm) || fileNameClean.includes(secNameNorm)) {
      matchedExistingSection = sec;
      break;
    }
  }

  // Fallback if no taxonomy rule matched well
  if (!bestMatchRule && !matchedExistingSection) {
    // Check if it looks technical vs humanities
    if (combinedContext.includes('english') || combinedContext.includes('grammar') || combinedContext.includes('words')) {
      bestMatchRule = TAXONOMY_RULES.find((r) => r.categoryId === 'sec-english-language')!;
    } else if (combinedContext.includes('god') || combinedContext.includes('prayer') || combinedContext.includes('soul') || combinedContext.includes('meditation')) {
      bestMatchRule = TAXONOMY_RULES.find((r) => r.categoryId === 'sec-devotional')!;
    } else {
      bestMatchRule = TAXONOMY_RULES.find((r) => r.categoryId === 'sec-java')!; // default technical
    }
  }

  const primaryCategory = matchedExistingSection ? matchedExistingSection.id : bestMatchRule!.categoryId;
  const categoryName = matchedExistingSection ? matchedExistingSection.name : bestMatchRule!.categoryName;
  const wing = matchedExistingSection ? matchedExistingSection.wing : bestMatchRule!.wing;
  const colorHex = matchedExistingSection ? matchedExistingSection.color : bestMatchRule!.colorHex;

  // --- Step 3: Determine Subcategory ---
  let bestSubcategory = 'General';
  let bestSubScore = 0;
  const targetSubcategories = matchedExistingSection
    ? matchedExistingSection.subSections.map((s) => ({ name: s, keywords: [normalizeText(s)] }))
    : bestMatchRule?.subcategories || [];

  for (const sub of targetSubcategories) {
    let subScore = 0;
    for (const kw of sub.keywords) {
      if (titleClean.includes(kw) || fileNameClean.includes(kw)) {
        subScore += 15;
      } else if (combinedContext.includes(kw)) {
        subScore += 4;
      }
    }
    if (subScore > bestSubScore) {
      bestSubScore = subScore;
      bestSubcategory = sub.name;
    }
  }

  if (bestSubScore === 0 && targetSubcategories.length > 0) {
    bestSubcategory = targetSubcategories[0].name;
  }

  // --- Step 4: Determine Difficulty ---
  let difficulty: Difficulty = 'INTERMEDIATE';
  if (
    combinedContext.includes('beginner') ||
    combinedContext.includes('introduction') ||
    combinedContext.includes('fundamentals') ||
    combinedContext.includes('basics') ||
    combinedContext.includes('starting') ||
    combinedContext.includes('head first')
  ) {
    difficulty = 'BEGINNER';
  } else if (
    combinedContext.includes('advanced') ||
    combinedContext.includes('expert') ||
    combinedContext.includes('deep dive') ||
    combinedContext.includes('mastering') ||
    combinedContext.includes('internals') ||
    combinedContext.includes('concurrency in practice')
  ) {
    difficulty = 'ADVANCED';
  }

  // --- Step 5: Determine Priority ---
  let priority: Priority = 'NORMAL';
  if (
    combinedContext.includes('must learn') ||
    combinedContext.includes('effective java') ||
    combinedContext.includes('clean code') ||
    combinedContext.includes('designing data intensive') ||
    combinedContext.includes('cracking the coding') ||
    combinedContext.includes('gita as it is')
  ) {
    priority = 'MUST_LEARN';
  } else if (combinedContext.includes('interview') || combinedContext.includes('focus') || combinedContext.includes('cheat sheet')) {
    priority = 'CURRENT_FOCUS';
  } else if (difficulty === 'BEGINNER' || combinedContext.includes('handbook')) {
    priority = 'IMPORTANT';
  }

  // --- Step 6: Confidence Score (Rule 7) ---
  const rawConfidence = Math.min(98, Math.max(55, bestScore * 3 + bestSubScore * 4 + 40));
  const needsReview = rawConfidence < 72;

  // --- Step 7: Decision Aid & Content Synthesis (Rules 14, 15, 16) ---
  const bookTitle = meta.title || meta.fileName?.replace(/\.[^/.]+$/, '') || 'Untitled Book';
  const cleanTitleStr = bookTitle.replace(/[-_]/g, ' ');

  const whatIsThisBookFor = generatePurposeStatement(cleanTitleStr, categoryName, bestSubcategory, resourceType);
  const summary = generateSummary(cleanTitleStr, categoryName, bestSubcategory, difficulty, meta.sampleText);
  const keyTakeaways = generateKeyTakeaways(cleanTitleStr, categoryName, bestSubcategory);
  const prerequisites = generatePrerequisites(categoryName, bestSubcategory, difficulty);
  const recommendedNext = generateRecommendedNext(categoryName, bestSubcategory, difficulty);

  // Extract topics & tags
  const topics = Array.from(
    new Set([
      categoryName,
      bestSubcategory,
      resourceType,
      difficulty,
      ...matchedRuleKeywords.slice(0, 4),
    ])
  );

  return {
    resourceType,
    primaryCategory,
    categoryName,
    subcategory: bestSubcategory,
    wing,
    colorHex,
    confidence: {
      categoryConfidence: rawConfidence,
      subcategoryConfidence: Math.min(95, rawConfidence - 5),
      needsReview,
      reason: `Classified based on ${matchedRuleKeywords.length > 0 ? matchedRuleKeywords.join(', ') : 'title and subject semantics'}`,
      matchedKeywords: matchedRuleKeywords,
      aiGenerated: true,
      sourceTrace: {
        extractedTitle: meta.title,
        extractedAuthor: meta.author,
        extractedPages: meta.totalPages,
      },
    },
    difficulty,
    priority,
    topics,
    tags: topics.map((t) => t.toLowerCase()),
    whatIsThisBookFor,
    summary,
    keyTakeaways,
    prerequisites,
    recommendedNext,
    isNewSection: !matchedExistingSection && !existingSections.some((s) => s.id === primaryCategory),
  };
}

// Generate "WHAT IS THIS BOOK FOR?" (Rule 15)
function generatePurposeStatement(title: string, category: string, subcategory: string, type: ResourceType): string {
  if (type === 'HANDBOOK') {
    return `For quick lookup, cheat sheets, and practical reference across ${category} (${subcategory}) concepts and commands.`;
  }
  if (type === 'INTERVIEW_GUIDE') {
    return `For high-yield interview preparation, common pitfalls, and mock technical questions in ${category}.`;
  }
  if (type === 'DEVOTIONAL') {
    return `For spiritual reflection, devotional reading, and philosophical insights grounded in ${subcategory}.`;
  }
  if (type === 'NOVEL') {
    return `For immersive literary reading and exploring compelling narrative themes in ${subcategory}.`;
  }
  if (category.includes('English')) {
    return `For mastering practical English communication, grammar mechanics, and active vocabulary expansion.`;
  }
  return `For gaining thorough conceptual mastery and practical techniques in ${category} with a focus on ${subcategory}.`;
}

// Generate concise summary (Rule 14)
function generateSummary(title: string, category: string, subcategory: string, difficulty: Difficulty, sampleText?: string): string {
  if (sampleText && sampleText.length > 120) {
    const snippet = sampleText.slice(0, 160).replace(/\s+/g, ' ').trim();
    return `${title} provides targeted guidance in ${category} (${subcategory}). Key focus: "${snippet}..."`;
  }
  return `${title} is a ${difficulty.toLowerCase()}-level resource designed for deep understanding of ${category} and ${subcategory}, covering architectural fundamentals, implementation practices, and real-world patterns.`;
}

// Generate 5-8 specific key takeaways (Rule 16)
function generateKeyTakeaways(title: string, category: string, subcategory: string): string[] {
  const titleLower = title.toLowerCase();

  if (category.includes('Java')) {
    if (subcategory.includes('Concurrency') || titleLower.includes('concurrency') || titleLower.includes('thread')) {
      return [
        'Java Memory Model (JMM) happens-before guarantees',
        'Thread safety, race conditions, and synchronized blocks',
        'ExecutorService, thread pool sizing, and work-stealing',
        'Atomic variables and lock-free CAS primitives',
        'Deadlock detection, thread dumps, and prevention strategies',
        'Virtual threads and structured concurrency fundamentals',
      ];
    }
    return [
      'Clean object-oriented design and SOLID principles in Java',
      'Effective usage of collections, HashMaps, and ArrayLists',
      'Generics type-erasure and bounded wildcards',
      'Modern functional programming with Streams and Lambdas',
      'Memory management and garbage collection tuning strategies',
    ];
  }

  if (category.includes('Spring')) {
    return [
      'Inversion of Control (IoC) and Bean lifecycle management',
      'Spring Boot autoconfiguration and custom starter design',
      'RESTful API development with declarative validation',
      'Transaction management and Spring Data JPA repositories',
      'Spring Security authentication, JWT filters, and authorization',
      'Microservice communication, circuit breakers, and Resilience4j',
    ];
  }

  if (category.includes('System Design')) {
    return [
      'High-level architectural decomposition and microservices',
      'Horizontal vs. vertical scaling and load-balancing algorithms',
      'Distributed caching strategies (Cache-aside, Write-through, Redis)',
      'CAP theorem, PACELC, and eventual consistency trade-offs',
      'Database sharding, master-slave replication, and partitioning',
      'Asynchronous event-driven messaging with Kafka and RabbitMQ',
    ];
  }

  if (category.includes('Data Structures') || category.includes('DSA')) {
    return [
      'Asymptotic time and space complexity (Big-O analysis)',
      'Optimal memory layout of linear vs tree-based structures',
      'Graph traversal patterns: BFS, DFS, and topological sort',
      'Dynamic programming memoization and bottom-up state formulation',
      'Binary search space reduction techniques and two-pointer paradigms',
    ];
  }

  if (category.includes('Devotional') || category.includes('Spiritual')) {
    return [
      'Core philosophy of selfless duty (Karma Yoga)',
      'Cultivation of mental equanimity amidst duality',
      'Path of devotional surrender and inner devotion (Bhakti Yoga)',
      'Discrimination between the eternal self and transient matter (Jnana Yoga)',
      'Daily meditation practices for inner clarity and mindfulness',
    ];
  }

  if (category.includes('English') || category.includes('Language')) {
    return [
      'Mastery of core tense structures and grammatical mechanics',
      'Contextual vocabulary expansion and etymological prefixes/roots',
      'Effective sentence transition words and rhetorical clarity',
      'Idiomatic expressions and conversational fluency patterns',
      'Structured professional email and written communication techniques',
    ];
  }

  // Default fallback
  return [
    `Core theoretical foundation of ${category}`,
    `Practical application and design workflows for ${subcategory}`,
    `Common failure modes, pitfalls, and debugging tips`,
    `Performance optimization and scalability considerations`,
    `Industry best practices and real-world implementation patterns`,
  ];
}

function generatePrerequisites(category: string, subcategory: string, difficulty: Difficulty): string[] {
  if (difficulty === 'BEGINNER') {
    return ['Basic computer literacy', 'Curiosity and interest in the topic'];
  }
  if (category.includes('Java')) {
    return ['Basic programming syntax', 'Fundamental OOP concepts (classes, objects, inheritance)'];
  }
  if (category.includes('Spring')) {
    return ['Core Java & OOP', 'Basic HTTP and relational database concepts'];
  }
  if (category.includes('System Design')) {
    return ['Basic understanding of servers, databases, and client-server networks'];
  }
  return ['Foundational subject concepts', 'Introductory familiarity with the domain'];
}

function generateRecommendedNext(category: string, subcategory: string, difficulty: Difficulty): string[] {
  if (difficulty === 'BEGINNER') {
    return [`Intermediate ${category}`, `Hands-on practical projects in ${subcategory}`];
  }
  if (difficulty === 'INTERMEDIATE') {
    return [`Advanced ${category}`, 'System Design & High-Throughput Architecture', 'Interview Prep'];
  }
  return ['Real-world distributed systems', 'Production engineering and performance tuning'];
}

/**
 * Duplicate Detection Engine (Rule 12)
 * Compares file hash, normalized title, and author against existing resources
 */
export function detectDuplicate(
  newFileHash: string | undefined,
  newTitle: string,
  newAuthor: string,
  existingResources: Resource[]
): DuplicateDetectionResult {
  const normNewTitle = normalizeText(newTitle);
  const normNewAuthor = normalizeText(newAuthor || '');

  for (const res of existingResources) {
    // 1. Direct hash match
    if (newFileHash && res.fileHash && newFileHash === res.fileHash) {
      return {
        isDuplicate: true,
        matchedResource: res,
        matchReason: 'Identical file content hash detected.',
        similarity: 1.0,
      };
    }

    // 2. Exact normalized title match
    const normExistingTitle = normalizeText(res.title);
    if (normNewTitle.length > 5 && normNewTitle === normExistingTitle) {
      return {
        isDuplicate: true,
        matchedResource: res,
        matchReason: `Exact title match with existing book "${res.title}".`,
        similarity: 0.95,
      };
    }

    // 3. High substring / similarity match
    if (
      normNewTitle.length > 8 &&
      (normExistingTitle.includes(normNewTitle) || normNewTitle.includes(normExistingTitle)) &&
      normNewAuthor &&
      normalizeText(res.author).includes(normNewAuthor)
    ) {
      return {
        isDuplicate: true,
        matchedResource: res,
        matchReason: `Matching title and author detected for "${res.title}".`,
        similarity: 0.9,
      };
    }
  }

  return {
    isDuplicate: false,
    similarity: 0,
  };
}

/**
 * Intelligent Relationship Builder (Rule 18 & 22)
 * Discovers semantic connections between a newly placed resource and existing library resources
 */
export function buildResourceRelationships(
  newResource: Resource,
  allResources: Resource[]
): Relationship[] {
  const relationships: Relationship[] = [];
  const otherResources = allResources.filter((r) => r.id !== newResource.id);

  for (const existing of otherResources) {
    // Same Category Relationships
    if (existing.category === newResource.category) {
      // Prerequisite: Beginner vs Intermediate/Advanced
      if (existing.difficulty === 'BEGINNER' && newResource.difficulty !== 'BEGINNER') {
        relationships.push({
          id: `rel-${existing.id}-${newResource.id}`,
          sourceId: existing.id,
          targetId: newResource.id,
          type: 'PREREQUISITE',
          reason: `${existing.title} provides the fundamental concepts before reading ${newResource.title}.`,
        });
      } else if (newResource.difficulty === 'BEGINNER' && existing.difficulty !== 'BEGINNER') {
        relationships.push({
          id: `rel-${newResource.id}-${existing.id}`,
          sourceId: newResource.id,
          targetId: existing.id,
          type: 'PREREQUISITE',
          reason: `${newResource.title} teaches the foundations needed for ${existing.title}.`,
        });
      }

      // Deeper dive
      if (existing.subCategory === newResource.subCategory && existing.id !== newResource.id) {
        relationships.push({
          id: `rel-${newResource.id}-${existing.id}-rel`,
          sourceId: newResource.id,
          targetId: existing.id,
          type: 'RELATED',
          reason: `Both resources explore ${newResource.subCategory} in depth.`,
        });
      }
    }

    // Handbook to Normal Book Relationship
    if (newResource.resourceType === 'HANDBOOK' && existing.category === newResource.category) {
      relationships.push({
        id: `rel-${newResource.id}-${existing.id}-ref`,
        sourceId: newResource.id,
        targetId: existing.id,
        type: 'REFERENCE',
        reason: `${newResource.title} serves as a quick reference handbook while studying ${existing.title}.`,
      });
    }
  }

  return relationships.slice(0, 8); // Keep top 8 meaningful connections
}
